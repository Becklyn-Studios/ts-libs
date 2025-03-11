// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FormConditions = Record<string, string | boolean | ((value: any) => boolean)>;

export type FormFieldConditions = readonly (FormConditions | readonly FormConditions[])[];
