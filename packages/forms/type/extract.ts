import { FormConfig } from "./config";
import { FormFieldConfig } from "./field";

export type Prettify<T> = {
    [K in keyof T]: T[K];
} & unknown;

export type FormFieldInfer<
    Type,
    Config = FormFieldConfig<string, string, unknown, unknown, never>,
> = Config extends {
    type: Type;
    initialValue?: infer InitialValue;
}
    ? InitialValue
    : never;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UnionToIntersection<U> = (U extends any ? (x: U) => void : never) extends (
    x: infer I
) => void
    ? I
    : never;

export type FormInfer<
    Config extends FormConfig<FormFieldConfig<string, string, unknown, unknown, never>>,
    Acc = object,
> = Config extends readonly [infer Entry, ...infer Rest]
    ? Entry extends { content: infer Content }
        ? Prettify<
              UnionToIntersection<
                  FormInfer<
                      Extract<
                          Content,
                          FormConfig<FormFieldConfig<string, string, unknown, unknown, never>>
                      >,
                      Acc
                  > &
                      FormInfer<
                          Extract<
                              Rest,
                              FormConfig<FormFieldConfig<string, string, unknown, unknown, never>>
                          >,
                          Acc
                      >
              >
          >
        : Entry extends { type: infer Type; name: infer Name; onInput?: infer InputFn }
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            InputFn extends (...args: any) => infer Input
              ? FormInfer<
                    Extract<
                        Rest,
                        FormConfig<FormFieldConfig<string, string, unknown, unknown, never>>
                    >,
                    Prettify<
                        UnionToIntersection<
                            {
                                [key in keyof Input]?: FormFieldInfer<Type>;
                            } & Acc
                        >
                    >
                >
              : FormInfer<
                    Extract<
                        Rest,
                        FormConfig<FormFieldConfig<string, string, unknown, unknown, never>>
                    >,
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
