import type { FC, SVGProps } from "react";

export const Cross20: FC<SVGProps<SVGSVGElement>> = props => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" {...props}>
            <path
                fill="currentColor"
                d="M13.01 5.928a.75.75 0 0 1 1.061 1.06L11.06 10l3.011 3.012a.75.75 0 1 1-1.06 1.06L9.999 11.06l-3.01 3.012a.75.75 0 1 1-1.061-1.06l3.01-3.013-3.01-3.01a.75.75 0 1 1 1.06-1.061L10 8.938z"
            />
        </svg>
    );
};
