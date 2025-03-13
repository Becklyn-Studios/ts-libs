/* eslint-disable @typescript-eslint/no-explicit-any */
import { JSXElementConstructor, PropsWithChildren } from "react";
// import { FormConfig } from "./config";
import { FormFieldConfig } from "./field";
import { FormError } from "./validation";

// interface FormDataFieldConfig<Name extends string, InitialValue> {
//     name: Name;
//     initialValue: InitialValue;
// }

// helper for copilot
// interface FormRowConfig<T extends FormDataFieldConfig<unknown>> {
//     type: "row";
//     content: readonly FormEntryConfig<T>[];
// }

// interface FormSectionConfig<T extends FormDataFieldConfig<unknown>> {
//     type: "section";
//     content: readonly FormEntryConfig<T>[];
// }

// interface FormCustomConfig<T extends FormDataFieldConfig<unknown>> {
//     type: "custom";
//     content: readonly FormEntryConfig<T>[];
// }

// type FormEntryConfig<T extends FormDataFieldConfig<unknown>> =
//     | FormCustomConfig<T>
//     | FormSectionConfig<T>
//     | FormRowConfig<T>
//     | T;

// type FormConfig<T extends FormDataFieldConfig<unknown>> = readonly FormEntryConfig<T>[];

// export type FormData<T extends FormDataFieldConfig<unknown>[]> = {
//     [K in T[number] extends { name: infer V extends string } ? V : never]: Extract<
//         T[number],
//         { name: K }
//     >["initialValue"];
// };

export type FormData<T extends FormFieldConfig<string, unknown, unknown, never>> = {
    [K in T["name"]]: Extract<T, { name: K }>["initialValue"];
};

const fieldTypes = [
    {
        initialValue: "string",
        name: "stringField",
    },
    {
        initialValue: 123,
        name: "numberField",
    },
];

const a: FormData<FormFieldConfig<"text", string, unknown, never>> = {};

console.log(fieldTypes, a);

// export type FormData<U extends FormConfig<T>, T extends FormDataFieldConfig<string, unknown>[]> = {
// export type FormData<T extends FormDataFieldConfig<string, unknown>[]> = {
//     [K in T[number]["name"]]: Extract<T[number], { name: K }>["initialValue"];
// };

// type ExtractFormDataFieldConfig<T> =
//     T extends FormDataFieldConfig<infer Name, infer InitialValue>
//         ? { [key in Name]: InitialValue }
//         : T extends { content: readonly (infer U)[] }
//           ? U extends FormDataFieldConfig<infer Name, infer InitialValue>
//               ? { [key in Name]: InitialValue }
//               : ExtractFormDataFieldConfig<U>
//           : never;

// type FormConfigToObject<T extends FormConfig<FormDataFieldConfig<string, unknown>>> = {
//     [K in keyof T]: ExtractFormDataFieldConfig<T[K]>;
// }[number];

// const a: FormConfigToObject<
//     [FormDataFieldConfig<"a", string>, FormDataFieldConfig<"b", { name: string }>]
// > = {
//     a: "a",
//     b: 123,
// };

// export type FormData<T extends FormFieldConfig<string, string, unknown, unknown, T>> = {
//     [K in T["name"]]: T["initialValue"];
// };

// Record<
//     T extends { name: infer V } ? V : any,
//     T extends { initialValue?: infer V } ? V : any
// >;

export interface FormBuilderComponents {
    BuilderWrapper: JSXElementConstructor<PropsWithChildren>;
    SectionWrapper: JSXElementConstructor<PropsWithChildren>;
    RowWrapper: JSXElementConstructor<PropsWithChildren>;
    FieldWrapper: JSXElementConstructor<PropsWithChildren<{ columns?: number }>>;
}

export interface FormBuilderChildrenProps<
    T extends FormFieldConfig<string, string, unknown, unknown, T>,
> {
    value: any;
    error: FormError | undefined;
    onInput: (value: any) => void;
    onBlur: () => void;
    field: T;
}

// export interface FormBuilderProps {
//     Components?: Partial<FormBuilderComponents>;
//     children(props: FormBuilderChildrenProps): ReactNode;
// }

export interface FormInputFuncProps<
    Field extends FormFieldConfig<string, string, unknown, InitialValue, AllFields>,
    AllFields extends FormFieldConfig<string, string, unknown, unknown, AllFields>,
    InitialValue,
> {
    value: InitialValue;
    field: Field;
    previousData: FormData<AllFields>;
}

export type FormInputFunc<
    Field extends FormFieldConfig<string, string, unknown, InitialValue, AllFields>,
    AllFields extends FormFieldConfig<string, string, unknown, unknown, AllFields>,
    InitialValue,
> = (props: FormInputFuncProps<Field, AllFields, InitialValue>) => FormData<AllFields>;

// Add this type utility to flatten nested form structures

// // This type recursively extracts all field configs from any nesting level
// type FlattenFormConfig<T> =
//   T extends FormDataFieldConfig<infer Name, infer Value>
//     ? { [K in Name]: Value }
//     : T extends { content: readonly infer Content[] }
//       ? FlattenArrayContent<Content>
//       : T extends readonly infer Items[]
//         ? FlattenArrayContent<Items>
//         : never;

// // Helper type to handle array content flattening
// type FlattenArrayContent<T> = UnionToIntersection<FlattenFormConfig<T>>;

// // Convert union types to intersection types (combines all fields)
// type UnionToIntersection<U> =
//   (U extends any ? (k: U) => void : never) extends ((k: infer I) => void)
//     ? I
//     : never;

// // Usage
// export type FormData<T extends FormConfig<FormDataFieldConfig<string, unknown>>> = FlattenFormConfig<T>;

// // Example usage
// const formConfig = [
//     { name: "firstName", initialValue: "" },
//     {
//       type: "section",
//       content: [
//         { name: "age", initialValue: 0 },
//         {
//           type: "row",
//           content: [{ name: "isActive", initialValue: false }]
//         }
//       ]
//     }
//   ] as const;

//   type FlatFormData = FormData<typeof formConfig>;
