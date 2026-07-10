import type {
  BarritsTraitDescriptorInspection,
  BarritsTraitDiagnostic,
  BarritsTraitDiagnosticCategory,
  BarritsTraitDiagnosticCode,
} from "../contracts";
import type { ExportedTraitBinding } from "./traits";

const DIAGNOSTIC_CODE_CATEGORY: Record<BarritsTraitDiagnosticCode, BarritsTraitDiagnosticCategory> = {
  "trait-conflicts-mismatch": "drift",
  "trait-consumes-mismatch": "drift",
  "trait-name-mismatch": "drift",
  "trait-provides-mismatch": "drift",
  "trait-requires-mismatch": "drift",
  "trait-state-mismatch": "drift",
  "trait-duplicate-name": "impossible",
  "trait-requires-conflict-overlap": "impossible",
  "trait-self-conflict": "impossible",
  "trait-self-requires": "impossible",
  "trait-duplicate-provides": "non-verifiable",
  "trait-required-conflicts": "non-verifiable",
  "trait-missing-consumed-capability": "non-verifiable",
  "trait-missing-required-trait": "non-verifiable",
  "trait-unsupported-factory": "non-verifiable",
};

const createTraitDiagnostic = (diagnostic: Omit<BarritsTraitDiagnostic, "category">): BarritsTraitDiagnostic => {
  return { ...diagnostic, category: DIAGNOSTIC_CODE_CATEGORY[diagnostic.code] };
};

const indexDescriptors = (
  descriptors: readonly BarritsTraitDescriptorInspection[],
): {
  byName: Map<string, BarritsTraitDescriptorInspection[]>;
  byCapability: Map<string, BarritsTraitDescriptorInspection[]>;
} => {
  const byName = new Map<string, BarritsTraitDescriptorInspection[]>();
  const byCapability = new Map<string, BarritsTraitDescriptorInspection[]>();

  for (const descriptor of descriptors) {
    const matchingNames = byName.get(descriptor.name) ?? [];
    matchingNames.push(descriptor);
    byName.set(descriptor.name, matchingNames);

    for (const capabilityName of descriptor.provides) {
      const matchingCapabilities = byCapability.get(capabilityName) ?? [];
      matchingCapabilities.push(descriptor);
      byCapability.set(capabilityName, matchingCapabilities);
    }
  }

  return { byName, byCapability };
};

const checkTraitSelfConsistency = (
  descriptor: BarritsTraitDescriptorInspection,
  byName: Map<string, BarritsTraitDescriptorInspection[]>,
): BarritsTraitDiagnostic[] => {
  const diagnostics: BarritsTraitDiagnostic[] = [];

  if (descriptor.requires.includes(descriptor.name)) {
    diagnostics.push(
      createTraitDiagnostic({
        code: "trait-self-requires",
        severity: "error",
        message: `Trait descriptor "${descriptor.name}" declares itself inside requires in ${descriptor.sourceFile}. A trait cannot depend on its own identity.`,
        sourceFile: descriptor.sourceFile,
        descriptorName: descriptor.name,
        bindingName: descriptor.bindingName,
      }),
    );
  }

  if (descriptor.conflicts.includes(descriptor.name)) {
    diagnostics.push(
      createTraitDiagnostic({
        code: "trait-self-conflict",
        severity: "error",
        message: `Trait descriptor "${descriptor.name}" declares itself inside conflicts in ${descriptor.sourceFile}. A trait cannot be incompatible with its own identity.`,
        sourceFile: descriptor.sourceFile,
        descriptorName: descriptor.name,
        bindingName: descriptor.bindingName,
      }),
    );
  }

  const contradictoryDependencies = descriptor.requires.filter((requiredName) => descriptor.conflicts.includes(requiredName));

  if (contradictoryDependencies.length > 0) {
    diagnostics.push(
      createTraitDiagnostic({
        code: "trait-requires-conflict-overlap",
        severity: "error",
        message: `Trait descriptor "${descriptor.name}" both requires and conflicts with [${contradictoryDependencies.join(", ")}] in ${descriptor.sourceFile}. Dependency and incompatibility contracts must not overlap.`,
        sourceFile: descriptor.sourceFile,
        descriptorName: descriptor.name,
        bindingName: descriptor.bindingName,
      }),
    );
  }

  for (let i = 0; i < descriptor.requires.length; i++) {
    const traitA = descriptor.requires[i];
    const descriptorA = byName.get(traitA)?.[0];
    if (!descriptorA) continue;

    for (let j = i + 1; j < descriptor.requires.length; j++) {
      const traitB = descriptor.requires[j];
      if (descriptorA.conflicts.includes(traitB)) {
        diagnostics.push(
          createTraitDiagnostic({
            code: "trait-required-conflicts",
            severity: "error",
            message: `Trait descriptor "${descriptor.name}" requires both "${traitA}" and "${traitB}" in ${descriptor.sourceFile}, but "${traitA}" declares a conflict with "${traitB}". This composition is impossible to satisfy.`,
            sourceFile: descriptor.sourceFile,
            descriptorName: descriptor.name,
            bindingName: descriptor.bindingName,
          }),
        );
      }
    }
  }

  return diagnostics;
};

const checkTraitMissingDependencies = (
  descriptor: BarritsTraitDescriptorInspection,
  byName: Map<string, BarritsTraitDescriptorInspection[]>,
  byCapability: Map<string, BarritsTraitDescriptorInspection[]>,
): BarritsTraitDiagnostic[] => {
  const diagnostics: BarritsTraitDiagnostic[] = [];

  const missingRequiredTraits = descriptor.requires.filter((requiredName) => !byName.has(requiredName));

  for (const missingRequiredTrait of missingRequiredTraits) {
    diagnostics.push(
      createTraitDiagnostic({
        code: "trait-missing-required-trait",
        severity: "warning",
        message: `Trait descriptor "${descriptor.name}" requires "${missingRequiredTrait}" in ${descriptor.sourceFile}, but that trait was not found among the inspected trait descriptors. The contract may still be satisfied externally, but the current portable graph cannot verify it.`,
        sourceFile: descriptor.sourceFile,
        descriptorName: descriptor.name,
        bindingName: descriptor.bindingName,
      }),
    );
  }

  const missingConsumedCapabilities = descriptor.consumes.filter((capabilityName) => {
    if (byCapability.has(capabilityName)) {
      return false;
    }

    return !descriptor.requires.includes(capabilityName);
  });

  for (const missingConsumedCapability of missingConsumedCapabilities) {
    diagnostics.push(
      createTraitDiagnostic({
        code: "trait-missing-consumed-capability",
        severity: "warning",
        message: `Trait descriptor "${descriptor.name}" consumes "${missingConsumedCapability}" in ${descriptor.sourceFile}, but that capability was not found among the inspected trait providers. The contract may still be satisfied externally, but the current portable graph cannot verify it.`,
        sourceFile: descriptor.sourceFile,
        descriptorName: descriptor.name,
        bindingName: descriptor.bindingName,
        capabilityName: missingConsumedCapability,
      }),
    );
  }

  if (!descriptor.factory) {
    diagnostics.push(
      createTraitDiagnostic({
        code: "trait-unsupported-factory",
        severity: "warning",
        message: `Trait descriptor "${descriptor.name}" is attached to export "${descriptor.bindingName}" in ${descriptor.sourceFile}, but no supported factory call was detected nearby. Prefer createTraitDescriptor() or createTraitDescriptorFromJsDoc().`,
        sourceFile: descriptor.sourceFile,
        descriptorName: descriptor.name,
        bindingName: descriptor.bindingName,
      }),
    );
  }

  return diagnostics;
};

const checkTraitRuntimeMismatches = (
  descriptor: BarritsTraitDescriptorInspection,
  bindingsBySourceFile: ReadonlyMap<string, readonly ExportedTraitBinding[]>,
): BarritsTraitDiagnostic[] => {
  if (descriptor.factory !== "createTraitDescriptor") {
    return [];
  }

  const diagnostics: BarritsTraitDiagnostic[] = [];
  const binding = bindingsBySourceFile.get(descriptor.sourceFile)?.find((entry) => entry.bindingName === descriptor.bindingName);

  if (binding?.runtimeName && binding.runtimeName !== descriptor.name) {
    diagnostics.push(
      createTraitDiagnostic({
        code: "trait-name-mismatch",
        severity: "error",
        message: `Trait descriptor "${descriptor.name}" documents export "${descriptor.bindingName}" in ${descriptor.sourceFile}, but createTraitDescriptor() declares runtime name "${binding.runtimeName}". Keep JSDoc and runtime trait identity aligned.`,
        sourceFile: descriptor.sourceFile,
        descriptorName: descriptor.name,
        bindingName: descriptor.bindingName,
      }),
    );
  }

  const addListMismatch = (
    code: BarritsTraitDiagnosticCode,
    runtimeField: readonly string[] | undefined,
    docField: readonly string[],
    message: string,
  ): void => {
    if (!runtimeField) return;
    if (docField.join(",") === runtimeField.join(",")) return;
    diagnostics.push(
      createTraitDiagnostic({
        code,
        severity: "warning",
        message,
        sourceFile: descriptor.sourceFile,
        descriptorName: descriptor.name,
        bindingName: descriptor.bindingName,
      }),
    );
  };

  addListMismatch(
    "trait-provides-mismatch",
    binding?.runtimeProvides,
    descriptor.provides,
    `Trait descriptor "${descriptor.name}" documents provides [${descriptor.provides.join(", ")}], but createTraitDescriptor() declares [${binding?.runtimeProvides?.join(", ")}] in ${descriptor.sourceFile}. Keep portable metadata aligned with runtime capabilities.`,
  );

  addListMismatch(
    "trait-conflicts-mismatch",
    binding?.runtimeConflicts,
    descriptor.conflicts,
    `Trait descriptor "${descriptor.name}" documents conflicts [${descriptor.conflicts.join(", ")}], but createTraitDescriptor() declares [${binding?.runtimeConflicts?.join(", ")}] in ${descriptor.sourceFile}. Keep incompatibility metadata aligned with runtime composition policy.`,
  );

  addListMismatch(
    "trait-requires-mismatch",
    binding?.runtimeRequires,
    descriptor.requires,
    `Trait descriptor "${descriptor.name}" documents requires [${descriptor.requires.join(", ")}], but createTraitDescriptor() declares [${binding?.runtimeRequires?.join(", ")}] in ${descriptor.sourceFile}. Keep dependency metadata aligned with runtime composition order.`,
  );

  addListMismatch(
    "trait-consumes-mismatch",
    binding?.runtimeConsumes,
    descriptor.consumes,
    `Trait descriptor "${descriptor.name}" documents consumes [${descriptor.consumes.join(", ")}], but createTraitDescriptor() declares [${binding?.runtimeConsumes?.join(", ")}] in ${descriptor.sourceFile}. Keep capability dependency metadata aligned with runtime expectations.`,
  );

  addListMismatch(
    "trait-state-mismatch",
    binding?.runtimeState,
    descriptor.state,
    `Trait descriptor "${descriptor.name}" documents state [${descriptor.state.join(", ")}], but createTraitDescriptor() declares [${binding?.runtimeState?.join(", ")}] in ${descriptor.sourceFile}. Keep state ownership metadata aligned with runtime slots.`,
  );

  return diagnostics;
};

const checkTraitGlobalDuplicates = (
  byName: Map<string, BarritsTraitDescriptorInspection[]>,
  byCapability: Map<string, BarritsTraitDescriptorInspection[]>,
): BarritsTraitDiagnostic[] => {
  const diagnostics: BarritsTraitDiagnostic[] = [];

  for (const [descriptorName, matchingDescriptors] of byName.entries()) {
    if (matchingDescriptors.length <= 1) {
      continue;
    }

    for (const descriptor of matchingDescriptors) {
      diagnostics.push(
        createTraitDiagnostic({
          code: "trait-duplicate-name",
          severity: "error",
          message: `Trait descriptor "${descriptorName}" is declared more than once across inspected files. Keep trait names globally stable and unique.`,
          sourceFile: descriptor.sourceFile,
          descriptorName,
          bindingName: descriptor.bindingName,
        }),
      );
    }
  }

  for (const [capabilityName, matchingDescriptors] of byCapability.entries()) {
    if (matchingDescriptors.length <= 1) {
      continue;
    }

    for (const descriptor of matchingDescriptors) {
      diagnostics.push(
        createTraitDiagnostic({
          code: "trait-duplicate-provides",
          severity: "warning",
          message: `Trait capability "${capabilityName}" is declared by multiple inspected traits. This may be intentional, but usually deserves explicit conflict policy or clearer ownership.`,
          sourceFile: descriptor.sourceFile,
          descriptorName: descriptor.name,
          bindingName: descriptor.bindingName,
          capabilityName,
        }),
      );
    }
  }

  return diagnostics;
};

const sortDiagnostics = (diagnostics: BarritsTraitDiagnostic[]): BarritsTraitDiagnostic[] => {
  return diagnostics.sort((left, right) => {
    if (left.severity === right.severity) {
      if (left.code === right.code) {
        if (left.descriptorName === right.descriptorName) {
          return left.sourceFile.localeCompare(right.sourceFile);
        }

        return (left.descriptorName ?? "").localeCompare(right.descriptorName ?? "");
      }

      return left.code.localeCompare(right.code);
    }

    return left.severity.localeCompare(right.severity);
  });
};

/**
 * Validates abstract portable graph contracts against programmatic runtime mappings.
 */
export const collectTraitDiagnostics = (
  descriptors: readonly BarritsTraitDescriptorInspection[],
  bindingsBySourceFile: ReadonlyMap<string, readonly ExportedTraitBinding[]>,
): BarritsTraitDiagnostic[] => {
  const { byName, byCapability } = indexDescriptors(descriptors);
  const diagnostics: BarritsTraitDiagnostic[] = [];

  for (const descriptor of descriptors) {
    diagnostics.push(...checkTraitSelfConsistency(descriptor, byName));

    if (descriptor.factory) {
      diagnostics.push(...checkTraitRuntimeMismatches(descriptor, bindingsBySourceFile));
    }

    diagnostics.push(...checkTraitMissingDependencies(descriptor, byName, byCapability));
  }

  diagnostics.push(...checkTraitGlobalDuplicates(byName, byCapability));

  return sortDiagnostics(diagnostics);
};
