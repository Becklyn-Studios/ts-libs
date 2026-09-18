import { useCallback, useState } from "react";
import { TypedFormData } from "./data";
import { FormStep, FormStructure } from "./structure";
import { DefaultValue, FieldComponent } from "./types";

export type FormConditions<
    FieldType extends FieldComponent<string, DefaultValue>,
    Steps extends readonly FormStep<string, FieldType>[],
> = {
    steps?: Partial<{
        [K in Steps[number]["name"]]: FormCondition<FieldType, Steps>;
    }>;
    fields?: Partial<{
        [K in Steps[number]["fields"][number]["name"]]: FormCondition<FieldType, Steps>;
    }>;
};

export type FormCondition<
    FieldType extends FieldComponent<string, DefaultValue>,
    Steps extends readonly FormStep<string, FieldType>[],
> = (data: TypedFormData<FieldType, FormStructure<Steps>>) => Promise<boolean | undefined | 0>;

export const useConditions = <
    const FieldType extends FieldComponent<string, DefaultValue>,
    const Steps extends readonly FormStep<string, FieldType>[],
>(
    conditions?: FormConditions<FieldType, Steps>
) => {
    const [hiddenSteps, setHiddenSteps] = useState<Steps[number]["name"][]>([]);
    const [hiddenFields, setHiddenFields] = useState<Steps[number]["fields"][number]["name"][]>([]);

    const runConditions = useCallback(
        async (parsedData: TypedFormData<FieldType, FormStructure<Steps>>) => {
            const newHiddenSteps: Steps[number]["name"][] = [];
            const newHiddenFields: Steps[number]["fields"][number]["name"][] = [];

            if (!conditions) {
                setHiddenSteps(newHiddenSteps);
                setHiddenFields(newHiddenFields);
                return;
            }

            if (conditions.steps) {
                for (const stepName of Object.keys(conditions.steps)) {
                    const stepCondition = conditions.steps[stepName as Steps[number]["name"]];

                    if (!stepCondition) {
                        continue;
                    }

                    if (!(await stepCondition(parsedData))) {
                        newHiddenSteps.push(stepName);
                    }
                }
            }

            if (conditions.fields) {
                for (const fieldName of Object.keys(conditions.fields)) {
                    const fieldCondition =
                        conditions.fields[fieldName as Steps[number]["fields"][number]["name"]];

                    if (!fieldCondition) {
                        continue;
                    }

                    if (!(await fieldCondition(parsedData))) {
                        newHiddenFields.push(fieldName);
                    }
                }
            }

            setHiddenSteps(newHiddenSteps);
            setHiddenFields(newHiddenFields);
        },
        [conditions]
    );

    return {
        hiddenSteps,
        hiddenFields,
        runConditions,
    };
};
