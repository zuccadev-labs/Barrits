import ts from "typescript";
import type { BarritsTraitDescriptorInspection } from "../contracts";
import type { BarritsTraitContractConfig } from "../../config";
export type ExportedTraitBinding = {
    readonly bindingKind: "const" | "function" | "class";
    readonly bindingName: string;
    readonly matchIndex: number;
    readonly runtimeConflicts?: readonly string[];
    readonly factory?: "createTraitDescriptor" | "createTraitDescriptorFromJsDoc";
    readonly runtimeConsumes?: readonly string[];
    readonly runtimeName?: string;
    readonly runtimeRequires?: readonly string[];
    readonly runtimeProvides?: readonly string[];
    readonly runtimeState?: readonly string[];
};
export type TraitRuntimeMetadata = {
    readonly conflicts?: readonly string[];
    readonly consumes?: readonly string[];
    readonly name?: string;
    readonly requires?: readonly string[];
    readonly provides?: readonly string[];
    readonly state?: readonly string[];
};
/**
 * Resolves deeply nested semantic abstract factories evaluating expression tree architectures mapped targeting capability creation.
 *
 * @param expression - Typescript logic interface binding literal root syntax expression node component dependency pointer.
 * @returns Resolves the factory literal identifier string natively mapped.
 */
export declare const resolveTraitDescriptorFactoryFromExpression: (expression: ts.Expression | undefined) => "createTraitDescriptor" | "createTraitDescriptorFromJsDoc" | undefined;
/**
 * Parses a TypeScript Array Literal node mapping plain text constants mapping primitive string interfaces.
 */
export declare const readStringArrayLiteral: (expression: ts.Expression | undefined) => string[] | undefined;
/**
 * Parses internal explicit argument objects targeting explicit trait mapping dependencies evaluating structural runtime property maps.
 */
export declare const readTraitRuntimeMetadataFromCall: (expression: ts.Expression | undefined) => TraitRuntimeMetadata | undefined;
/**
 * Sweeps the AST structure explicitly collecting export bindings matching trait payload creation routines mapping signatures recursively natively traversing explicit modifiers.
 */
export declare const collectExportedTraitBindings: (source: string, relativePath: string) => ExportedTraitBinding[];
/**
 * Builds physical meta-descriptor objects parsing logical block JSDocs overriding payload identifiers.
 * Traces context pointers securely parsing traits without side-effects or heavy runtime impact.
 */
export declare const collectTraitDescriptorMetadata: (source: string, relativePath: string) => BarritsTraitDescriptorInspection[];
export declare const normalizeContractStringArray: (values: readonly string[] | undefined) => string[];
export declare const toTraitContractDescriptor: (contract: BarritsTraitContractConfig) => BarritsTraitDescriptorInspection | null;
export declare const mergeTraitDescriptors: (discoveredDescriptors: readonly BarritsTraitDescriptorInspection[], contractDescriptors: readonly BarritsTraitDescriptorInspection[]) => BarritsTraitDescriptorInspection[];
