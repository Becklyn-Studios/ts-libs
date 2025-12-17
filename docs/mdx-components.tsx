import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import defaultComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { Mermaid } from "./components/mdx/Mermaid";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
    return {
        ...defaultComponents,
        ...components,
        Steps,
        Step,
        Tabs,
        Tab,
        ImageZoom,
        Mermaid,
    };
}
