export type DeepPartial<T> = T extends object
    ? {
          [P in keyof T]?: DeepPartial<T[P]>;
      }
    : T;

export type NonNullableKey<T, K extends keyof T> = T extends object
    ? T & { [P in K]-?: NonNullable<T[P]> }
    : T;
