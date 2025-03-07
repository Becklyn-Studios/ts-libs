export interface StyledProps {
    className?: string;
}

export type PropsWithClassName<P = object> = P & { className?: string };
