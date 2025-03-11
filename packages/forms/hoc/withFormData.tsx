import React from "react";
import { FormDataProvider, FormProviderProps } from "../context/data/FormDataProvider";

export const withFormData = <T,>(WrappedComponent: React.ComponentType<FormProviderProps & T>) => {
    const displayName = WrappedComponent.displayName || WrappedComponent.name || "Component";

    const ComponentWithProvider = (props: FormProviderProps & T) => {
        return (
            <FormDataProvider {...props}>
                <WrappedComponent {...props} />
            </FormDataProvider>
        );
    };

    ComponentWithProvider.displayName = `withFormData(${displayName})`;

    return ComponentWithProvider;
};
