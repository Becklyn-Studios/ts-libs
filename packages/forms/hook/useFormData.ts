import { useContext, useSyncExternalStore } from "react";
import { FormDataContext } from "../context/data/context";
import { FormData } from "../type";
import { FormStore } from "./useFormStore";

export const useFormData = <SelectorOutput>(
    selector: (store: FormData) => SelectorOutput
): [SelectorOutput, (value: Partial<FormData>) => void, () => FormData] => {
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
