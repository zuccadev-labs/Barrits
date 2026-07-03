import test from "node:test";
import assert from "node:assert/strict";

import {
  composeTraitDescriptors,
  createTraitDescriptor,
  createTraitDescriptorFromJsDoc,
  parseTraitDescriptorJsDoc,
} from "../src/barrits/traits";

test("trait descriptors compose in dependency order with explicit state ownership", () => {
  const auditTrail: string[] = [];
  const state = {
    calls: [] as string[],
  };

  const baseTrait = createTraitDescriptor({
    name: "base",
    state: ["calls"],
    provides: ["normalize"],
    create: ({ state: localState }) => ({
      normalize(value: string) {
        (localState as { calls: string[] }).calls.push(`normalize:${value}`);
        auditTrail.push("base");
        return value.trim().toLowerCase();
      },
    }),
  });

  const slugTrait = createTraitDescriptor({
    name: "slug",
    requires: ["base"],
    provides: ["toSlug"],
    create: ({ traits, order }) => ({
      toSlug(value: string) {
        auditTrail.push(order.join(">"));
        return (traits as any).normalize?.(value).replace(/\s+/g, "-") ?? value;
      },
    }),
  });

  const result = composeTraitDescriptors([slugTrait, baseTrait] as any, { state }) as any;

  assert.deepEqual(result.order, ["base", "slug"]);
  assert.deepEqual(result.stateOwners, { calls: "base" });
  assert.deepEqual(result.traitProviders, {
    base: ["normalize"],
    slug: ["toSlug"],
  });
  assert.deepEqual(result.traitMetadata, {
    base: {
      summary: undefined,
      requires: [],
      conflicts: [],
      state: ["calls"],
      consumes: [],
      provides: ["normalize"],
      tags: [],
      runtimes: [],
    },
    slug: {
      summary: undefined,
      requires: ["base"],
      conflicts: [],
      state: [],
      consumes: [],
      provides: ["toSlug"],
      tags: [],
      runtimes: [],
    },
  });
  assert.equal(result.traits.toSlug("  Hello World  "), "hello-world");
  assert.deepEqual(state.calls, ["normalize:  Hello World  "]);
  assert.deepEqual(auditTrail, ["base>slug", "base"]);
});

test("trait descriptors reject duplicated state ownership and explicit conflicts", () => {
  const first = createTraitDescriptor({
    name: "first",
    state: ["session"],
    provides: ["load"],
    create: () => ({
      load: () => "first",
    }),
  });

  const second = createTraitDescriptor({
    name: "second",
    state: ["session"],
    conflicts: ["first"],
    provides: ["save"],
    create: () => ({
      save: () => "second",
    }),
  });

  assert.throws(
    () => composeTraitDescriptors([first, second] as any),
    /cannot be composed with "first"|State key "session"/,
  );
});

test("trait descriptors reject self-referential requires as a cyclic dependency", () => {
  const recursive = createTraitDescriptor({
    name: "recursive",
    requires: ["recursive"],
    provides: ["format"],
    create: () => ({
      format: () => "recursive",
    }),
  });

  assert.throws(
    () => composeTraitDescriptors([recursive] as any),
    /cyclic dependency graph/,
  );
});

test("trait descriptors surface capability collisions unless the caller resolves them explicitly", () => {
  const left = createTraitDescriptor({
    name: "left",
    provides: ["format"],
    create: () => ({
      format: () => "left",
    }),
  });

  const right = createTraitDescriptor({
    name: "right",
    provides: ["format"],
    create: () => ({
      format: () => "right",
    }),
  });

  assert.throws(
    () => composeTraitDescriptors([left, right] as any),
    /Trait capability collision for "format"/,
  );

  const resolved = composeTraitDescriptors([left, right] as any, {
    resolveConflict: (key, leftValue, rightValue, leftTraitName, rightTraitName) => {
      assert.equal(key, "format");
      assert.equal(leftTraitName, "left");
      assert.equal(rightTraitName, "right");
      assert.equal(typeof leftValue, "function");
      assert.equal(typeof rightValue, "function");
      return () => "merged";
    },
  }) as any;

  assert.equal(resolved.traits.format(), "merged");
});

test("trait descriptor JSDoc metadata parses declarative tags consistently", () => {
  const metadata = parseTraitDescriptorJsDoc(`
    /**
     * @barrits-trait slug
     * @barrits-summary Slugifies normalized values for route-safe identifiers.
     * @barrits-requires base format-base
     * @barrits-requires base
     * @barrits-conflicts legacy-slug
     * @barrits-state session cache
     * @barrits-consumes normalize
     * @barrits-provides toSlug normalizeSlug
     * @barrits-tags routing formatting
     * @barrits-runtime node browser
     */
  `);

  assert.deepEqual(metadata, {
    name: "slug",
    summary: "Slugifies normalized values for route-safe identifiers.",
    requires: ["base", "format-base"],
    conflicts: ["legacy-slug"],
    state: ["cache", "session"],
    consumes: ["normalize"],
    provides: ["normalizeSlug", "toSlug"],
    tags: ["formatting", "routing"],
    runtimes: ["browser", "node"],
  });
});

test("trait descriptors can be created from JSDoc metadata with explicit overrides", () => {
  const normalizeTrait = createTraitDescriptorFromJsDoc<
    "normalize",
    Record<string, string>,
    { normalize: (value: string) => string }
  >(
    `
    /**
     * @barrits-trait normalize
      * @barrits-summary Normalizes raw values before downstream formatting.
     * @barrits-state session
     * @barrits-provides normalize
      * @barrits-tags formatting
      * @barrits-runtime universal
     */
    `,
    {
      create: ({ state }) => ({
        normalize(value: string) {
          state.session = value.trim().toLowerCase();
          return state.session;
        },
      }),
    },
  );

  const slugTrait = createTraitDescriptorFromJsDoc<
    "slug",
    object,
    { toSlug: (value: string) => string }
  >(
    `
    /**
     * @barrits-trait slug
     * @barrits-requires normalize
      * @barrits-consumes normalize
     * @barrits-provides toSlug
      * @barrits-tags routing formatting
     */
    `,
    {
      provides: ["toSlug"],
      create: ({ traits }) => ({
        toSlug(value: string) {
          return (traits as any).normalize?.(value).replace(/\s+/g, "-") ?? value;
        },
      }),
    },
  );

  const result = composeTraitDescriptors([slugTrait, normalizeTrait] as any, {
    state: {
      session: "",
    },
  }) as any;

  assert.deepEqual(result.order, ["normalize", "slug"]);
  assert.equal(result.traits.toSlug("  Hello World  "), "hello-world");
  assert.deepEqual(result.stateOwners, { session: "normalize" });
  assert.deepEqual(result.traitMetadata.slug, {
    summary: undefined,
    requires: ["normalize"],
    conflicts: [],
    state: [],
    consumes: ["normalize"],
    provides: ["toSlug"],
    tags: ["formatting", "routing"],
    runtimes: [],
  });
  assert.deepEqual(result.traitMetadata.normalize, {
    summary: "Normalizes raw values before downstream formatting.",
    requires: [],
    conflicts: [],
    state: ["session"],
    consumes: [],
    provides: ["normalize"],
    tags: ["formatting"],
    runtimes: ["universal"],
  });
});

test("trait descriptors fail when declared consumed capabilities are missing", () => {
  const slugTrait = createTraitDescriptorFromJsDoc(
    `
    /**
     * @barrits-trait slug
     * @barrits-consumes normalize
     * @barrits-provides toSlug
     */
    `,
    {
      create: () => ({
        toSlug(value: string) {
          return value;
        },
      }),
    },
  );

  assert.throws(
    () => composeTraitDescriptors([slugTrait]),
    /consumes "normalize", but that capability is not available/,
  );
});