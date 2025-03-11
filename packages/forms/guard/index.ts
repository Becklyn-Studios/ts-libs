import {
    FormCustomConfig,
    FormEntryConfig,
    FormFieldBasicConfig,
    FormRowConfig,
    FormSectionConfig,
} from "../type";

export const entryIsSection = (
    entry: Pick<FormEntryConfig, "type">
): entry is FormSectionConfig => {
    return entry.type === "section";
};

export const entryIsRow = (entry: Pick<FormEntryConfig, "type">): entry is FormRowConfig => {
    return entry.type === "row";
};

export const entryIsCustom = (entry: Pick<FormEntryConfig, "type">): entry is FormCustomConfig => {
    return entry.type === "custom";
};

export const entryIsField = (
    entry: Pick<FormEntryConfig, "type">
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): entry is FormFieldBasicConfig<any> => {
    return !entryIsSection(entry) && !entryIsRow(entry) && !entryIsCustom(entry);
};
