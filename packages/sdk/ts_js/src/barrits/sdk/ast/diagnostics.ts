import type { 
  BarritsTraitDescriptorInspection, 
  BarritsTraitDiagnostic 
} from "../contracts";
import type { ExportedTraitBinding } from "./traits";

/**
 * Validates abstract portable graph contracts against programmatic runtime mappings evaluating semantic rule collisions identically structurally identifying mismatches.
 *
 * @param descriptors - Pure portable semantic interfaces identifying global payload logic context.
 * @param bindingsBySourceFile - Deep programmatic node mapping representing AST node explicit structures natively pointing targeting interface bindings.
 * @returns Exhaustive diagnostic payload collection detailing validation failures or structural drifts natively identifying path context.
 */
export const collectTraitDiagnostics = (
  descriptors: readonly BarritsTraitDescriptorInspection[],
  bindingsBySourceFile: ReadonlyMap<string, readonly ExportedTraitBinding[]>,
): BarritsTraitDiagnostic[] => {
  const diagnostics: BarritsTraitDiagnostic[] = [];
  const descriptorsByName = new Map<string, BarritsTraitDescriptorInspection[]>();
  const descriptorsByCapability = new Map<string, BarritsTraitDescriptorInspection[]>();

  for (const descriptor of descriptors) {
    const matchingNames = descriptorsByName.get(descriptor.name) ?? [];
    matchingNames.push(descriptor);
    descriptorsByName.set(descriptor.name, matchingNames);

    for (const capabilityName of descriptor.provides) {
      const matchingCapabilities = descriptorsByCapability.get(capabilityName) ?? [];
      matchingCapabilities.push(descriptor);
      descriptorsByCapability.set(capabilityName, matchingCapabilities);
    }
  }

  const createTraitDiagnostic = (
    diagnostic: Omit<BarritsTraitDiagnostic, "category">,
  ): BarritsTraitDiagnostic => {
    switch (diagnostic.code) {
      case "trait-conflicts-mismatch":
      case "trait-consumes-mismatch":
      case "trait-name-mismatch":
      case "trait-provides-mismatch":
      case "trait-requires-mismatch":
      case "trait-state-mismatch":
        return { ...diagnostic, category: "drift" };
      case "trait-duplicate-name":
      case "trait-requires-conflict-overlap":
      case "trait-self-conflict":
      case "trait-self-requires":
        return { ...diagnostic, category: "impossible" };
      case "trait-duplicate-provides":
      case "trait-missing-consumed-capability":
      case "trait-missing-required-trait":
      case "trait-unsupported-factory":
        return { ...diagnostic, category: "non-verifiable" };
    }
  };

  for (const descriptor of descriptors) {
    if (descriptor.requires.includes(descriptor.name)) {
      diagnostics.push(createTraitDiagnostic({
        code: "trait-self-requires",
        severity: "error",
        message: `Trait descriptor "${descriptor.name}" declares itself inside requires in ${descriptor.sourceFile}. A trait cannot depend on its own identity.`,
        sourceFile: descriptor.sourceFile,
        descriptorName: descriptor.name,
        bindingName: descriptor.bindingName,
      }));
    }

    if (descriptor.conflicts.includes(descriptor.name)) {
      diagnostics.push(createTraitDiagnostic({
        code: "trait-self-conflict",
        severity: "error",
        message: `Trait descriptor "${descriptor.name}" declares itself inside conflicts in ${descriptor.sourceFile}. A trait cannot be incompatible with its own identity.`,
        sourceFile: descriptor.sourceFile,
        descriptorName: descriptor.name,
        bindingName: descriptor.bindingName,
      }));
    }

    const contradictoryDependencies = descriptor.requires.filter((requiredName) => descriptor.conflicts.includes(requiredName));

    if (contradictoryDependencies.length > 0) {
      diagnostics.push(createTraitDiagnostic({
        code: "trait-requires-conflict-overlap",
        severity: "error",
        message: `Trait descriptor "${descriptor.name}" both requires and conflicts with [${contradictoryDependencies.join(", ")}] in ${descriptor.sourceFile}. Dependency and incompatibility contracts must not overlap.`,
        sourceFile: descriptor.sourceFile,
        descriptorName: descriptor.name,
        bindingName: descriptor.bindingName,
      }));
    }

    const missingRequiredTraits = descriptor.requires.filter((requiredName) => !descriptorsByName.has(requiredName));

    for (const missingRequiredTrait of missingRequiredTraits) {
      diagnostics.push(createTraitDiagnostic({
        code: "trait-missing-required-trait",
        severity: "warning",
        message: `Trait descriptor "${descriptor.name}" requires "${missingRequiredTrait}" in ${descriptor.sourceFile}, but that trait was not found among the inspected trait descriptors. The contract may still be satisfied externally, but the current portable graph cannot verify it.`,
        sourceFile: descriptor.sourceFile,
        descriptorName: descriptor.name,
        bindingName: descriptor.bindingName,
      }));
    }

    const missingConsumedCapabilities = descriptor.consumes.filter((capabilityName) => {
      if (descriptorsByCapability.has(capabilityName)) {
        return false;
      }

      return !descriptor.requires.includes(capabilityName);
    });

    for (const missingConsumedCapability of missingConsumedCapabilities) {
      diagnostics.push(createTraitDiagnostic({
        code: "trait-missing-consumed-capability",
        severity: "warning",
        message: `Trait descriptor "${descriptor.name}" consumes "${missingConsumedCapability}" in ${descriptor.sourceFile}, but that capability was not found among the inspected trait providers. The contract may still be satisfied externally, but the current portable graph cannot verify it.`,
        sourceFile: descriptor.sourceFile,
        descriptorName: descriptor.name,
        bindingName: descriptor.bindingName,
        capabilityName: missingConsumedCapability,
      }));
    }

    if (!descriptor.factory) {
      diagnostics.push(createTraitDiagnostic({
        code: "trait-unsupported-factory",
        severity: "warning",
        message: `Trait descriptor "${descriptor.name}" is attached to export "${descriptor.bindingName}" in ${descriptor.sourceFile}, but no supported factory call was detected nearby. Prefer createTraitDescriptor() or createTraitDescriptorFromJsDoc().`,
        sourceFile: descriptor.sourceFile,
        descriptorName: descriptor.name,
        bindingName: descriptor.bindingName,
      }));
      continue;
    }

    if (descriptor.factory !== "createTraitDescriptor") {
      continue;
    }

    const binding = bindingsBySourceFile
      .get(descriptor.sourceFile)
      ?.find((entry) => entry.bindingName === descriptor.bindingName);

    if (binding?.runtimeName && binding.runtimeName !== descriptor.name) {
      diagnostics.push(createTraitDiagnostic({
        code: "trait-name-mismatch",
        severity: "error",
        message: `Trait descriptor "${descriptor.name}" documents export "${descriptor.bindingName}" in ${descriptor.sourceFile}, but createTraitDescriptor() declares runtime name "${binding.runtimeName}". Keep JSDoc and runtime trait identity aligned.`,
        sourceFile: descriptor.sourceFile,
        descriptorName: descriptor.name,
        bindingName: descriptor.bindingName,
      }));
    }

    if (binding?.runtimeProvides) {
      const documentedProvides = descriptor.provides.join(",");
      const runtimeProvides = binding.runtimeProvides.join(",");

      if (documentedProvides !== runtimeProvides) {
        diagnostics.push(createTraitDiagnostic({
          code: "trait-provides-mismatch",
          severity: "warning",
          message: `Trait descriptor "${descriptor.name}" documents provides [${descriptor.provides.join(", ")}], but createTraitDescriptor() declares [${binding.runtimeProvides.join(", ")}] in ${descriptor.sourceFile}. Keep portable metadata aligned with runtime capabilities.`,
          sourceFile: descriptor.sourceFile,
          descriptorName: descriptor.name,
          bindingName: descriptor.bindingName,
        }));
      }
    }

    if (binding?.runtimeConflicts) {
      const documentedConflicts = descriptor.conflicts.join(",");
      const runtimeConflicts = binding.runtimeConflicts.join(",");

      if (documentedConflicts !== runtimeConflicts) {
        diagnostics.push(createTraitDiagnostic({
          code: "trait-conflicts-mismatch",
          severity: "warning",
          message: `Trait descriptor "${descriptor.name}" documents conflicts [${descriptor.conflicts.join(", ")}], but createTraitDescriptor() declares [${binding.runtimeConflicts.join(", ")}] in ${descriptor.sourceFile}. Keep incompatibility metadata aligned with runtime composition policy.`,
          sourceFile: descriptor.sourceFile,
          descriptorName: descriptor.name,
          bindingName: descriptor.bindingName,
        }));
      }
    }

    if (binding?.runtimeRequires) {
      const documentedRequires = descriptor.requires.join(",");
      const runtimeRequires = binding.runtimeRequires.join(",");

      if (documentedRequires !== runtimeRequires) {
        diagnostics.push(createTraitDiagnostic({
          code: "trait-requires-mismatch",
          severity: "warning",
          message: `Trait descriptor "${descriptor.name}" documents requires [${descriptor.requires.join(", ")}], but createTraitDescriptor() declares [${binding.runtimeRequires.join(", ")}] in ${descriptor.sourceFile}. Keep dependency metadata aligned with runtime composition order.`,
          sourceFile: descriptor.sourceFile,
          descriptorName: descriptor.name,
          bindingName: descriptor.bindingName,
        }));
      }
    }

    if (binding?.runtimeConsumes) {
      const documentedConsumes = descriptor.consumes.join(",");
      const runtimeConsumes = binding.runtimeConsumes.join(",");

      if (documentedConsumes !== runtimeConsumes) {
        diagnostics.push(createTraitDiagnostic({
          code: "trait-consumes-mismatch",
          severity: "warning",
          message: `Trait descriptor "${descriptor.name}" documents consumes [${descriptor.consumes.join(", ")}], but createTraitDescriptor() declares [${binding.runtimeConsumes.join(", ")}] in ${descriptor.sourceFile}. Keep capability dependency metadata aligned with runtime expectations.`,
          sourceFile: descriptor.sourceFile,
          descriptorName: descriptor.name,
          bindingName: descriptor.bindingName,
        }));
      }
    }

    if (binding?.runtimeState) {
      const documentedState = descriptor.state.join(",");
      const runtimeState = binding.runtimeState.join(",");

      if (documentedState !== runtimeState) {
        diagnostics.push(createTraitDiagnostic({
          code: "trait-state-mismatch",
          severity: "warning",
          message: `Trait descriptor "${descriptor.name}" documents state [${descriptor.state.join(", ")}], but createTraitDescriptor() declares [${binding.runtimeState.join(", ")}] in ${descriptor.sourceFile}. Keep state ownership metadata aligned with runtime slots.`,
          sourceFile: descriptor.sourceFile,
          descriptorName: descriptor.name,
          bindingName: descriptor.bindingName,
        }));
      }
    }
  }

  for (const [descriptorName, matchingDescriptors] of descriptorsByName.entries()) {
    if (matchingDescriptors.length <= 1) {
      continue;
    }

    for (const descriptor of matchingDescriptors) {
      diagnostics.push(createTraitDiagnostic({
        code: "trait-duplicate-name",
        severity: "error",
        message: `Trait descriptor "${descriptorName}" is declared more than once across inspected files. Keep trait names globally stable and unique.`,
        sourceFile: descriptor.sourceFile,
        descriptorName,
        bindingName: descriptor.bindingName,
      }));
    }
  }

  for (const [capabilityName, matchingDescriptors] of descriptorsByCapability.entries()) {
    if (matchingDescriptors.length <= 1) {
      continue;
    }

    for (const descriptor of matchingDescriptors) {
      diagnostics.push(createTraitDiagnostic({
        code: "trait-duplicate-provides",
        severity: "warning",
        message: `Trait capability "${capabilityName}" is declared by multiple inspected traits. This may be intentional, but usually deserves explicit conflict policy or clearer ownership.`,
        sourceFile: descriptor.sourceFile,
        descriptorName: descriptor.name,
        bindingName: descriptor.bindingName,
        capabilityName,
      }));
    }
  }

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
