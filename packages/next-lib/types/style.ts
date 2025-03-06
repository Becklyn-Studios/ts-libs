export interface StyledProps {
    className?: string;
}

export type PropsWithClassName<P = {}> = P & { className?: string };
