import type { FC, SVGProps } from "react";

export const ChevronDown20: FC<SVGProps<SVGSVGElement>> = props => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" {...props}>
            <path
                fill="currentColor"
                d="M12.803 7.803a.75.75 0 0 1 1.06 1.06l-3.334 3.334a.75.75 0 0 1-1.06 0L6.136 8.864a.75.75 0 1 1 1.06-1.061L10 10.606z"
            />
        </svg>
    );
};
