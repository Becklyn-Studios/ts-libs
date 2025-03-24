import { useContext, useSyncExternalStore } from "react";
import { FormDataContext } from "../context/data/context";
import { FormStore } from "./useFormStore";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useFormData = <GlobalFormData extends Record<string, any>>(
    selector: (store: GlobalFormData) => GlobalFormData
): [GlobalFormData, (value: Partial<GlobalFormData>) => void, () => GlobalFormData] => {
    const { data } = useContext(FormDataContext);

    if (!data) {
        throw new Error("Store not found");
    }

    return useData(data, selector);
};

export const useData = <Store, SelectorOutput>(
    data: FormStore<Store>,
    selector: (store: Store) => SelectorOutput
): [SelectorOutput, (value: Partial<Store>) => void, () => Store] => {
    const state = useSyncExternalStore(
        data.subscribe,
        () => selector(data.get()),
        () => selector(data.initialValue)
    );

    return [state, data.set, data.get];
};
