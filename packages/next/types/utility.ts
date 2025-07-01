export type Pretty<T> = {
    [k in keyof T]: T[k];
} & {};
