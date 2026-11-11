import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { composeTraitDescriptors, createTraitDescriptor } from "../src/barrits/traits/index";
import { collectRoutes, generateOpenApiFromRoutes, type BarritsRouteContract } from "../src/barrits/schema/openapi";

const handler = (): null => null;

const usersTrait = createTraitDescriptor({
  name: "Users",
  provides: ["users-routes"],
  create: () => ({
    "users-routes": [
      { method: "GET", path: "/users", access: "public", handler, _openapi: { summary: "List users" } },
      { method: "GET", path: "/users/:id", access: "user", scope: "users:read", handler },
      {
        method: "POST",
        path: "/users",
        access: "master",
        handler,
        _openapi: { requestBody: { content: { "application/json": { schema: { type: "object" } } } } },
      },
      { method: "*", path: "/users/stream", handler },
    ] as BarritsRouteContract[],
  }),
});

const filesTrait = createTraitDescriptor({
  name: "Files",
  provides: ["file_routes"],
  create: () => ({
    file_routes: [{ method: "delete", path: "/files/{name}", handler }] as BarritsRouteContract[],
  }),
});

const composed = (): Record<string, unknown> => composeTraitDescriptors([usersTrait, filesTrait]).traits as Record<string, unknown>;

describe("route-level OpenAPI", () => {
  it("collects routes from every capability whose key contains 'routes', after composition", () => {
    const routes = collectRoutes(composed());
    assert.deepEqual(
      routes.map((r) => `${r.capability} ${r.route.method} ${r.route.path}`),
      // Composition order (barrits composes traits by name), then declaration order within a trait.
      [
        "file_routes delete /files/{name}",
        "users-routes GET /users",
        "users-routes GET /users/:id",
        "users-routes POST /users",
        "users-routes * /users/stream",
      ],
    );
  });

  it("documents every route the server would mount, with path parameters", () => {
    const spec = generateOpenApiFromRoutes(composed(), { title: "T", version: "2.0.0" });
    assert.equal(spec.openapi, "3.1.0");
    assert.deepEqual(Object.keys(spec.paths), ["/files/{name}", "/users", "/users/{id}"], "sorted; '*' cannot be expressed and is skipped");
    assert.deepEqual(Object.keys(spec.paths["/users"]).sort(), ["get", "post"]);
    const get = spec.paths["/users/{id}"].get;
    assert.deepEqual(get.parameters, [{ name: "id", in: "path", required: true, schema: { type: "string" } }]);
    assert.equal(spec.paths["/users"].get.summary, "List users");
    assert.ok(spec.paths["/users"].post.requestBody);
    assert.deepEqual(spec.paths["/files/{name}"].delete.tags, ["File"]);
    assert.deepEqual(spec.paths["/users"].get.tags, ["Users"]);
    assert.deepEqual(
      spec.tags.map((t) => t.name),
      ["File", "Users"],
    );
  });

  it("derives security from each route through securityFor, unless the route overrides it", () => {
    const spec = generateOpenApiFromRoutes(composed(), {
      securitySchemes: { master: { type: "apiKey", in: "header", name: "X-Master-Key" }, key: { type: "http", scheme: "bearer" } },
      securityFor: (route) =>
        route.access === "public" ? [] : route.access === "user" ? [{ key: route.scope ? [route.scope] : [] }] : [{ master: [] }],
    });
    assert.deepEqual(spec.paths["/users"].get.security, []);
    assert.deepEqual(spec.paths["/users/{id}"].get.security, [{ key: ["users:read"] }]);
    assert.deepEqual(spec.paths["/users"].post.security, [{ master: [] }]);
    assert.ok(spec.components.securitySchemes.master);
  });

  it("fails closed on a duplicated route unless told how to resolve it", () => {
    const dup = {
      a_routes: [{ method: "GET", path: "/x", _openapi: { summary: "first" } }],
      b_routes: [{ method: "GET", path: "/x", _openapi: { summary: "second" } }],
    };
    assert.throws(() => generateOpenApiFromRoutes(dup), /Duplicated route GET \/x/);
    assert.equal(generateOpenApiFromRoutes(dup, { onDuplicate: "first" }).paths["/x"].get.summary, "first");
    assert.equal(generateOpenApiFromRoutes(dup, { onDuplicate: "last" }).paths["/x"].get.summary, "second");
  });

  it("rejects a duplicated operationId", () => {
    const routes = {
      r_routes: [
        { method: "GET", path: "/a", _openapi: { operationId: "same" } },
        { method: "GET", path: "/b", _openapi: { operationId: "same" } },
      ],
    };
    assert.throws(() => generateOpenApiFromRoutes(routes), /operationId "same"/);
  });

  it("adds routes outside the traits, servers and extensions; output is deterministic", () => {
    const options = {
      extraRoutes: [{ method: "GET", path: "/health", access: "public" }],
      servers: [{ url: "https://api.example.com" }],
      extensions: { "x-app-id": "demo" } as const,
    };
    const a = generateOpenApiFromRoutes(composed(), options);
    const b = generateOpenApiFromRoutes(composed(), options);
    assert.deepEqual(a, b);
    assert.ok(a.paths["/health"].get);
    assert.deepEqual(a.paths["/health"].get.tags, ["Core"]);
    assert.equal(a.servers?.[0].url, "https://api.example.com");
    assert.equal(a["x-app-id"], "demo");
    assert.equal(JSON.parse(JSON.stringify(a)).openapi, "3.1.0");
  });

  it("accepts already collected routes", () => {
    const spec = generateOpenApiFromRoutes(collectRoutes(composed()).filter((r) => r.capability === "file_routes"));
    assert.deepEqual(Object.keys(spec.paths), ["/files/{name}"]);
  });
});
