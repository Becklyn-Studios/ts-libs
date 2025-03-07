export const isString = (value: unknown): value is string => {
    return typeof value === "string";
};

export const isObject = (value: unknown): value is { [key: string | number | symbol]: unknown } => {
    return typeof value === "object" && !Array.isArray(value);
};

export const isDefined = <T>(value: unknown): value is NonNullable<T> => {
    return value !== undefined && value !== null;
};

export const first = <T = unknown>(value?: T | T[] | null) =>
    value ? (Array.isArray(value) ? value.at(0) : value) : undefined;

export const ensureArray = <T = unknown>(value?: T | T[] | null): Array<T> =>
    value ? (Array.isArray(value) ? value : [value]) : [];
