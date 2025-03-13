import React from "react";
import { FormFieldConfig } from "type";
import { FormDataProvider, FormProviderProps } from "../context/data/FormDataProvider";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const withFormData = <U extends FormFieldConfig<string, any, any>, T>(
    WrappedComponent: React.ComponentType<FormProviderProps<U> & T>
) => {
    const displayName = WrappedComponent.displayName || WrappedComponent.name || "Component";

    const ComponentWithProvider = (props: FormProviderProps<U> & T) => {
        return (
            <FormDataProvider {...props}>
                <WrappedComponent {...props} />
            </FormDataProvider>
        );
    };

    ComponentWithProvider.displayName = `withFormData(${displayName})`;

    return ComponentWithProvider;
};
