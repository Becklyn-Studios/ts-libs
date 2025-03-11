import { useContext, useSyncExternalStore } from "react";
import { FormDataContext } from "../context/data/context";
import { FormErrors } from "../type";

export const useFormErrors = <SelectorOutput>(
    selector: (store: FormErrors) => SelectorOutput
): [SelectorOutput, (value: Partial<FormErrors>) => void, () => FormErrors] => {
    const { errors } = useContext(FormDataContext);

    if (!errors) {
        throw new Error("Store not found");
    }

    const state = useSyncExternalStore(
        errors.subscribe,
        () => selector(errors.get()),
        () => selector(errors.initialValue)
    );

    return [state, errors.set, errors.get];
};
