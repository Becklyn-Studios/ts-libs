export interface StyledProps {
    className?: string;
}

export type PropsWithClassName<P = object> = P & { className?: string };

export type PropsWithClassNames<K extends string, P = object> = P & {
    classNames?: {
        [Key in K]?: string;
    };
};
