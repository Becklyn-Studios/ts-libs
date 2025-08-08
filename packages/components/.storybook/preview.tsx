import { FC, PropsWithChildren } from "react";
import { ThemedWrapper } from "@becklyn/components/components/atoms/ThemedWrapper/ThemedWrapper";
import { ThemeProvider, useTheme } from "@becklyn/components/contexts/ThemeContext";
import "@becklyn/next/scss/reset";
import type { Decorator, Preview } from "@storybook/nextjs";
// @ts-ignore - ts does not find the file in the .storybook directory
import styles from "./preview.module.scss";
import "./preview.scss";

const StorybookThemeSwitcher: FC<PropsWithChildren> = ({ children }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div>
            {children}
            <button onClick={toggleTheme} className={styles.themeButton}>
                Toggle Theme ({theme})
            </button>
        </div>
    );
};

const withThemedWrapper: Decorator = (Story, context) => {
    // Get the theme from Storybook globals if available, otherwise default to light
    const theme = context.globals?.theme || "light";

    return (
        <main>
            <ThemeProvider defaultTheme={theme}>
                <ThemedWrapper>
                    <StorybookThemeSwitcher>
                        <Story />
                    </StorybookThemeSwitcher>
                </ThemedWrapper>
            </ThemeProvider>
        </main>
    );
};

const preview: Preview = {
    parameters: {
        nextjs: {
            appDirectory: true,
        },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        viewport: {
            options: {
                mobile: { name: "Mobile", styles: { width: "393px", height: "852px" } },
                tablet: { name: "Tablet", styles: { width: "1024px", height: "100%" } },
                desktop: { name: "Desktop", styles: { width: "100%", height: "100%" } },
            },
        },
        layout: "fullscreen",
        options: {
            storySort: {
                order: ["Introduction", "Atoms", "Molecules", "Organisms", "Templates", "Pages"],
            },
        },
    },
    decorators: [withThemedWrapper],
    tags: ["autodocs"],
};

export default preview;
