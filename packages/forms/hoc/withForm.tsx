import React from "react";
import { FormFieldConfig } from "type";
import { FormProvider } from "../context";
import { FormProviderProps } from "../context/data/FormDataProvider";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const withForm = <U extends FormFieldConfig<string, any, any>, T>(
    WrappedComponent: React.ComponentType<FormProviderProps<U> & T>
) => {
    const displayName = WrappedComponent.displayName || WrappedComponent.name || "Component";

    const ComponentWithProvider = (props: FormProviderProps<U> & T) => {
        return (
            // @ts-expect-error: ts does not understand this
            <FormProvider {...props}>
                <WrappedComponent {...props} />
            </FormProvider>
        );
    };

    ComponentWithProvider.displayName = `withForm(${displayName})`;

    return ComponentWithProvider;
};
