"use client";

import { useCallback, useRef, useState } from "react";
import clsx from "clsx";
import { PropsWithClassName } from "@becklyn/next/types/style";
import { FormConditions, useConditions } from "./conditions";
import { TypedFormData, parseFormData } from "./data";
import { FormStep, FormStructure, getFieldComponent } from "./structure";
import {
    DefaultValue,
    FieldComponent,
    SubmitResponse,
    ValidateUniqueFieldNames,
    isSubmitSuccessResponse,
} from "./types";
import { FormValidationResult, getFieldError, useValidation } from "./validation";

interface FormProps<
    FieldType extends FieldComponent<string, DefaultValue>,
    Steps extends readonly FormStep<string, FieldType>[],
> {
    fields: FieldType[];
    structure: { steps: ValidateUniqueFieldNames<Steps> };
    conditions?: FormConditions<FieldType, Steps>;
    activeStepClassName?: string;
    hiddenStepClassName?: string;
    hiddenFieldClassName?: string;
    validate?: (
        data: TypedFormData<FieldType, FormStructure<Steps>>
    ) => Promise<FormValidationResult<FormStructure<Steps>>>;
    onSubmit: (
        data: TypedFormData<FieldType, FormStructure<Steps>>
    ) => Promise<SubmitResponse<FormStructure<Steps>>>;
    onSuccess?: (success: true | string) => void;
    onError?: (errors: FormValidationResult<FormStructure<Steps>>) => void;
    onChange?: (data: TypedFormData<FieldType, FormStructure<Steps>>) => void;
}

export const Form = <
    const FieldType extends FieldComponent<string, DefaultValue>,
    const Steps extends readonly FormStep<string, FieldType>[],
>({
    fields,
    structure,
    conditions,
    activeStepClassName,
    hiddenStepClassName,
    hiddenFieldClassName,
    validate,
    onSubmit,
    onSuccess,
    onError,
    onChange,
    className,
}: PropsWithClassName<FormProps<FieldType, Steps>>) => {
    const debounceTimeout = useRef<NodeJS.Timeout>(null);
    const [loading, setLoading] = useState(false);
    const { steps } = structure as unknown as FormStructure<Steps>;
    const [activeStep, setActiveStep] = useState<number>(0);
    const { hiddenSteps, hiddenFields, runConditions } = useConditions(conditions);
    const { errors, setErrors, runValidation } = useValidation(runConditions, validate);

    const handleSubmit = useCallback(
        async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            setLoading(true);
            const formData = new FormData(e.target as HTMLFormElement);
            const parsedData = parseFormData(
                structure as unknown as FormStructure<Steps>,
                fields,
                formData
            );

            if (!(await runValidation(parsedData))) {
                setLoading(false);
                return;
            }

            const response = await onSubmit(parsedData);

            setLoading(false);

            if (isSubmitSuccessResponse(response)) {
                onSuccess?.(response.success);
            } else {
                setErrors(response.errors);
                onError?.(response.errors);
            }
        },
        [runValidation, setErrors, onSubmit, onSuccess, onError, structure, fields]
    );

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLFormElement>) => {
            const formData = new FormData(e.currentTarget);

            const later = async () => {
                if (debounceTimeout.current) {
                    clearTimeout(debounceTimeout.current);
                }

                const parsedData = parseFormData(
                    structure as unknown as FormStructure<Steps>,
                    fields,
                    formData
                );

                if (await runValidation(parsedData)) {
                    onChange?.(parsedData);
                }
            };

            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
            debounceTimeout.current = setTimeout(() => later(), 300);
        },
        [runValidation, onChange, structure, fields]
    );

    return (
        <form onSubmit={handleSubmit} onChange={handleChange} className={className}>
            {steps.map((step, index) => (
                <div
                    key={index}
                    className={clsx(
                        step.className,
                        hiddenSteps.includes(step.name) && hiddenStepClassName,
                        activeStep === index && activeStepClassName
                    )}>
                    {step.fields.map((field, index) => {
                        if ("render" in field) {
                            return (
                                <field.render
                                    key={index}
                                    nextStep={() => setActiveStep(prev => prev + 1)}
                                    prevStep={() => setActiveStep(prev => prev - 1)}
                                    error={errors?.form ? errors.form : undefined}
                                    loading={loading}
                                />
                            );
                        }

                        const Field = getFieldComponent(fields, field.type);

                        if (!Field) {
                            return null;
                        }

                        return (
                            <Field.render
                                key={index}
                                className={clsx(
                                    field.className,
                                    hiddenFields.includes(field.name) && hiddenFieldClassName
                                )}
                                name={field.name}
                                label={field.label}
                                defaultValue={field.default}
                                error={getFieldError(errors, field.name)}
                            />
                        );
                    })}
                </div>
            ))}
        </form>
    );
};
