import { PropsWithClassName } from "@becklyn/next/types/style";
import { DefaultValue, FieldComponent, ValidateUniqueFieldNames } from "./types";

export type RenderFieldProps = PropsWithClassName<{
    error?: string;
    loading: boolean;
    nextStep: () => void;
    prevStep: () => void;
}>;

export type FormField<Name extends string, Type extends string, Default> =
    | {
          type: Type;
          name: Name;
          label?: string;
          default?: Default;
          className?: string;
      }
    | {
          name: Name;
          render: (props: RenderFieldProps) => React.ReactNode;
      };

export type FormStep<
    Name extends string,
    FieldType extends FieldComponent<string, DefaultValue>,
> = {
    name: Name;
    className?: string;
    fields: readonly InferFormField<FieldType, string>[];
};

export type FormStructure<
    Steps extends readonly FormStep<string, FieldComponent<string, DefaultValue>>[],
> = {
    steps: Steps;
};

type InferFormField<
    FieldTypes extends FieldComponent<string, DefaultValue>,
    Name extends string = string,
> = FieldTypes extends FieldComponent<infer T, infer D> ? FormField<Name, T, D> : never;

export const getFieldComponent = <FieldType extends FieldComponent<string, DefaultValue>>(
    fieldComponents: FieldType[],
    type: FieldType["type"]
) => {
    return fieldComponents.find(fieldComponent => fieldComponent.type === type);
};

export type InferStepsFromStructure<
    Structure extends FormStructure<
        readonly FormStep<string, FieldComponent<string, DefaultValue>>[]
    >,
> = Structure extends { steps: ValidateUniqueFieldNames<infer Steps> } ? Steps : never;
