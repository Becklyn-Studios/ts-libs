/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormFieldConfig } from "./field";

export type FormFieldValue<Type, Config = FormFieldConfig<string, any, any>> = Config extends {
    type: Type;
    initialValue?: infer InitialValue;
}
    ? InitialValue
    : never;
