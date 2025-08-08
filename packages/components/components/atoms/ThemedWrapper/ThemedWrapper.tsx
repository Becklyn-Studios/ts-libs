"use client";

import { FC, PropsWithChildren } from "react";
import clsx from "clsx";
import { useTheme } from "@becklyn/components/contexts/theme/ThemeContext";
import { CUSTOM_FONT } from "@becklyn/components/styles/font/fonts";

export const ThemedWrapper: FC<PropsWithChildren> = ({ children }) => {
    const { theme } = useTheme();

    return <div className={clsx(theme, CUSTOM_FONT.variable)}>{children}</div>;
};
