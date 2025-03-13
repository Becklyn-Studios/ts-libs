/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormConfig } from "./config";
import { FormFieldConfig } from "./field";

export type Prettify<T> = {
    [K in keyof T]: T[K];
} & unknown;

export type FormFieldInfer<Type, Config = FormFieldConfig<string, any, any>> = Config extends {
    type: Type;
    initialValue?: infer InitialValue;
}
    ? InitialValue
    : never;

export type UnionToIntersection<U> = (U extends any ? (x: U) => void : never) extends (
    x: infer I
) => void
    ? I
    : never;

export type FormInfer<
    Config extends FormConfig<AllConfigs>,
    AllConfigs extends FormFieldConfig<string, any, any>,
    Acc = object,
> = Config extends readonly [infer Entry, ...infer Rest]
    ? Entry extends { content: infer Content }
        ? Prettify<
              UnionToIntersection<
                  FormInfer<Extract<Content, FormConfig<AllConfigs>>, AllConfigs, Acc> &
                      FormInfer<Extract<Rest, FormConfig<AllConfigs>>, AllConfigs, Acc>
              >
          >
        : Entry extends { type: infer Type; name: infer Name; onInput?: infer InputFn }
          ? InputFn extends (...args: any) => infer Input
              ? FormInfer<
                    Extract<Rest, FormConfig<AllConfigs>>,
                    AllConfigs,
                    Prettify<
                        UnionToIntersection<
                            {
                                [key in keyof Input]?: FormFieldInfer<Type>;
                            } & Acc
                        >
                    >
                >
              : FormInfer<
                    Extract<Rest, FormConfig<AllConfigs>>,
                    AllConfigs,
                    Prettify<
                        UnionToIntersection<
                            {
                                [key in Extract<Name, string>]?: FormFieldInfer<Type>;
                            } & Acc
                        >
                    >
                >
          : Acc
    : Acc;
