import React from "react";
import { FormProvider } from "../context";
import { FormProviderProps } from "../context/data/FormDataProvider";

export const withForm = <T,>(WrappedComponent: React.ComponentType<FormProviderProps & T>) => {
    const displayName = WrappedComponent.displayName || WrappedComponent.name || "Component";

    const ComponentWithProvider = (props: FormProviderProps & T) => {
        return (
            <FormProvider {...props}>
                <WrappedComponent {...props} />
            </FormProvider>
        );
    };

    ComponentWithProvider.displayName = `withForm(${displayName})`;

    return ComponentWithProvider;
};
