import { compose, composePipeline, mergeTraits } from "./compose";
import { composeTraitDescriptors, createTraitDescriptor, createTraitDescriptorFromJsDoc, parseTraitDescriptorJsDoc } from "./descriptor";
export { compose, composePipeline, composeTraitDescriptors, createTraitDescriptor, createTraitDescriptorFromJsDoc, mergeTraits, parseTraitDescriptorJsDoc };
export type { ComposedTraitDescriptorsResult, ComposeTraitDescriptorsOptions, TraitConflictStrategy, TraitDescriptor, TraitDescriptorContext, TraitDescriptorFromJsDocInput, TraitDescriptorInput, TraitDescriptorJsDocMetadata, TraitDescriptorMetadata, } from "./descriptor";
/**
 * Trait descriptor and composition helpers exposed under `barrits.traits`.
 */
export declare const traits: {
    compose: {
        mergeTraits: <TLeft extends object, TRight extends object>(left: TLeft, right: TRight, options?: import("./compose/merge").MergeTraitsOptions) => TLeft & TRight;
        composePipeline: <TValue>(initialValue: TValue, ...steps: Array<import("..").UnaryFunction<TValue, TValue>>) => TValue;
    };
    composePipeline: <TValue>(initialValue: TValue, ...steps: Array<import("..").UnaryFunction<TValue, TValue>>) => TValue;
    composeTraitDescriptors: <TState extends object = Record<string, never>, const TDescriptors extends readonly {
        readonly name: string;
        readonly summary?: string;
        readonly requires: readonly string[];
        readonly conflicts: readonly string[];
        readonly state: readonly string[];
        readonly consumes: readonly string[];
        readonly provides: readonly string[];
        readonly tags: readonly string[];
        readonly runtimes: readonly string[];
        readonly create: (context: import("./descriptor").TraitDescriptorContext<any, any, string>) => any;
    }[] = readonly {
        readonly name: string;
        readonly summary?: string;
        readonly requires: readonly string[];
        readonly conflicts: readonly string[];
        readonly state: readonly string[];
        readonly consumes: readonly string[];
        readonly provides: readonly string[];
        readonly tags: readonly string[];
        readonly runtimes: readonly string[];
        readonly create: (context: import("./descriptor").TraitDescriptorContext<any, any, string>) => any;
    }[]>(descriptors: TDescriptors, options?: import("./descriptor").ComposeTraitDescriptorsOptions<TState>) => import("./descriptor").ComposedTraitDescriptorsResult<TState, (((TDescriptors[number] extends infer T ? T extends TDescriptors[number] ? T extends import("./descriptor").TraitDescriptor<string, object, infer TProvides extends object> ? TProvides : never : never : never) extends infer T_1 ? T_1 extends (TDescriptors[number] extends infer T_2 ? T_2 extends TDescriptors[number] ? T_2 extends import("./descriptor").TraitDescriptor<string, object, infer TProvides extends object> ? TProvides : never : never : never) ? T_1 extends unknown ? (value: T_1) => void : never : never : never) extends (value: infer TIntersection) => void ? TIntersection : never) extends object ? object & (((TDescriptors[number] extends infer T_3 ? T_3 extends TDescriptors[number] ? T_3 extends import("./descriptor").TraitDescriptor<string, object, infer TProvides extends object> ? TProvides : never : never : never) extends infer T_4 ? T_4 extends (TDescriptors[number] extends infer T_5 ? T_5 extends TDescriptors[number] ? T_5 extends import("./descriptor").TraitDescriptor<string, object, infer TProvides extends object> ? TProvides : never : never : never) ? T_4 extends unknown ? (value: T_4) => void : never : never : never) extends (value: infer TIntersection) => void ? TIntersection : never) : Record<string, never>>;
    createTraitDescriptor: <const TName extends string, TState extends object, TProvides extends object>(descriptor: import("./descriptor").TraitDescriptorInput<TName, TState, TProvides>) => import("./descriptor").TraitDescriptor<TName, TState, TProvides>;
    createTraitDescriptorFromJsDoc: <const TName extends string = string, TState extends object = Record<string, never>, TProvides extends object = Record<string, never>>(jsDoc: string, descriptor: import("./descriptor").TraitDescriptorFromJsDocInput<TName, TState, TProvides>) => import("./descriptor").TraitDescriptor<TName, TState, TProvides>;
    mergeTraits: <TLeft extends object, TRight extends object>(left: TLeft, right: TRight, options?: import("./compose/merge").MergeTraitsOptions) => TLeft & TRight;
    parseTraitDescriptorJsDoc: (jsDoc: string) => import("./descriptor").TraitDescriptorJsDocMetadata;
};
