import { useCallback, useState } from "react";
import { TypedFormData } from "./data";
import { FormStep, FormStructure } from "./structure";
import { DefaultValue, FieldComponent } from "./types";

type ValidationStructure = {
    steps: readonly {
        fields: readonly {
            name: string;
        }[];
    }[];
};

export type ValidationResult = string | false | undefined | null;

export type FormValidationResult<Structure extends ValidationStructure> = {
    fields: Partial<{
        [K in Structure["steps"][number]["fields"][number]["name"]]: ValidationResult;
    }>;
    form: ValidationResult;
} | null;

const hasErrors = <Structure extends ValidationStructure>(
    errors: FormValidationResult<Structure>
) => {
    if (!errors) {
        return false;
    }

    if (errors.form) {
        return true;
    }

    for (const field of Object.keys(errors.fields)) {
        if (errors.fields[field as Structure["steps"][number]["fields"][number]["name"]]) {
            return true;
        }
    }

    return false;
};

export const getFieldError = <Structure extends ValidationStructure>(
    errors: FormValidationResult<Structure>,
    field: Structure["steps"][number]["fields"][number]["name"]
): string | undefined => {
    if (!errors) {
        return undefined;
    }

    const error = errors.fields[field as Structure["steps"][number]["fields"][number]["name"]];

    return error ? error : undefined;
};

export const useValidation = <
    const FieldType extends FieldComponent<string, DefaultValue>,
    const Steps extends readonly FormStep<string, FieldType>[],
>(
    runConditions: (parsedData: TypedFormData<FieldType, FormStructure<Steps>>) => Promise<void>,
    validate?: (
        data: TypedFormData<FieldType, FormStructure<Steps>>
    ) => Promise<FormValidationResult<FormStructure<Steps>>>
) => {
    const [errors, setErrors] = useState<FormValidationResult<FormStructure<Steps>>>(null);

    const runValidation = useCallback(
        async (parsedData: TypedFormData<FieldType, FormStructure<Steps>>) => {
            runConditions(parsedData);

            if (validate) {
                const errors = await validate(parsedData);

                if (hasErrors(errors)) {
                    setErrors(errors);
                    return false;
                }

                setErrors(null);
            }

            return true;
        },
        [validate, runConditions]
    );

    return {
        errors,
        setErrors,
        runValidation,
    };
};
