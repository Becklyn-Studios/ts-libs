import { useCallback, useMemo } from "react";
import { useForm } from "../context";
import { useFormData } from "../hook/useFormData";
import { useFormErrors } from "../hook/useFormErrors";
import {
    FormBuilderChildrenProps,
    FormBuilderComponents,
    FormBuilderProps,
    FormFieldConfig,
} from "../type";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface FormFieldProps<T extends FormFieldConfig<string, any, any>> {
    Components: FormBuilderComponents;
    field: T;
    children: FormBuilderProps<T>["children"];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FormField = <T extends FormFieldConfig<string, any, any>>({
    Components,
    field,
    children,
}: FormFieldProps<T>) => {
    const {
        editData,
        validationStrategy: contextValidationStrategy,
        validateField,
        onInput,
    } = useForm();

    const {
        name,
        columns,
        conditions,
        validations,
        valueFn,
        validationStrategy: fieldValidationStrategy,
        onInput: onFieldInput,
        fieldConfig: fieldConfigFunc,
    } = field;

    const validationStrategy = useMemo(
        () => [fieldValidationStrategy, contextValidationStrategy],
        [fieldValidationStrategy, contextValidationStrategy]
    );

    const hasValueFn = !!valueFn;
    const hasConditions = !!conditions && Object.keys(conditions).length > 0;
    const hasFieldConfigFunc = typeof fieldConfigFunc === "function";
    const hasValidationFunc =
        !!validations && validations.some(({ validation }) => typeof validation === "function");

    const rerenderWithData = hasValueFn || hasConditions || hasFieldConfigFunc || hasValidationFunc;

    const [data, setStore, getStore] = useFormData(
        rerenderWithData ? store => store : store => store[name]
    );

    const [fieldError] = useFormErrors(store => store[name]);

    const value = rerenderWithData ? data[name] : data;
    const normalizedValue = valueFn ? valueFn(data) : value;
    const fieldConfig = hasFieldConfigFunc
        ? fieldConfigFunc({ value: normalizedValue, data })
        : fieldConfigFunc;

    const handleInput = useCallback<FormBuilderChildrenProps<T>["onInput"]>(
        value => {
            let normalizedValue;

            if (onFieldInput) {
                normalizedValue = onFieldInput({
                    value,
                    field,
                    previousData: getStore(),
                });
            } else if (onInput) {
                normalizedValue = onInput({
                    value,
                    field,
                    previousData: getStore(),
                });
            } else {
                normalizedValue = { [field.name]: value };
            }

            editData.set(normalizedValue);
            setStore(normalizedValue);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [field, setStore, getStore, onFieldInput, onInput]
    );

    const handleBlur = useCallback<FormBuilderChildrenProps<T>["onBlur"]>(() => {
        if (!validations || !validationStrategy.includes("blur")) {
            return;
        }

        validateField(field);
    }, [field, validations, validationStrategy, validateField]);

    const fieldInputError = (() => {
        if (!validations || !validationStrategy.includes("input")) {
            return;
        }

        const editValue = editData.get()[field.name];

        if (editValue === undefined) {
            return;
        }

        return validateField(field) ?? undefined;
    })();

    const childrenProps: FormBuilderChildrenProps<T> = {
        value: normalizedValue,
        error: fieldError || fieldInputError,
        onInput: handleInput,
        onBlur: handleBlur,
        field: { ...field, fieldConfig },
    };

    const { FieldWrapper } = Components;

    if (!FieldWrapper) {
        throw new Error("No field component found");
    }

    return <FieldWrapper columns={columns}>{children(childrenProps)}</FieldWrapper>;
};
