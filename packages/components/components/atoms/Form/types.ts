import { ReactNode } from "react";
import { FormValidationResult } from "./validation";

// Field Component
export interface FieldComponentRenderProps<Default> {
    name: string;
    label?: string;
    defaultValue?: Default;
    error?: string;
    className?: string;
}

export interface FieldComponent<Type extends string, Default> {
    type: Type;
    parseValue: (value: string | File) => Default;
    render: (props: FieldComponentRenderProps<Default>) => ReactNode | Promise<ReactNode>;
}

// Submit Response
type SubmitSuccessResponse = {
    success: true | string;
};

type FormValidationStructure = {
    steps: readonly {
        fields: readonly {
            name: string;
        }[];
    }[];
};

type SubmitErrorResponse<Structure extends FormValidationStructure> = {
    errors: FormValidationResult<Structure>;
};

export type SubmitResponse<Structure extends FormValidationStructure> =
    | SubmitSuccessResponse
    | SubmitErrorResponse<Structure>;

export const isSubmitSuccessResponse = <Structure extends FormValidationStructure>(
    response: SubmitResponse<Structure>
): response is SubmitSuccessResponse => {
    return "success" in response && response.success === true;
};

// Utility
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DefaultValue = any;

type HasDuplicateNames<
    T extends readonly { name: string }[],
    Seen extends string = never,
> = T extends readonly [
    infer Head extends { name: string },
    ...infer Tail extends readonly { name: string }[],
]
    ? Head["name"] extends Seen
        ? Head["name"] // Found duplicate
        : HasDuplicateNames<Tail, Seen | Head["name"]>
    : false;

// Collects all field objects from all steps into a single tuple
type CollectAllFields<Steps extends readonly { fields: readonly { name: string }[] }[]> =
    Steps extends readonly [
        infer Head extends { fields: readonly { name: string }[] },
        ...infer Tail extends readonly { fields: readonly { name: string }[] }[],
    ]
        ? readonly [...Head["fields"], ...CollectAllFields<Tail>]
        : readonly [];

// Validates that all field names across all steps are unique
// Returns the Steps type if valid, or an error string if duplicates are found
export type ValidateUniqueFieldNames<
    Steps extends readonly { name: string; fields: readonly { name: string }[] }[],
> =
    HasDuplicateNames<Steps> extends string
        ? `Duplicate step name: ${HasDuplicateNames<Steps>}`
        : HasDuplicateNames<CollectAllFields<Steps>> extends string
          ? `Duplicate field name: ${HasDuplicateNames<CollectAllFields<Steps>>}`
          : Steps;
