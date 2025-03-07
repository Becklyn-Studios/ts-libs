import {
    BLOCKS,
    Block,
    Document,
    INLINES,
    Inline,
    Mark,
    Text,
    TopLevelBlock,
} from "@contentful/rich-text-types";
import { RteData, RteJSON } from ".";

export const generateRteText = (text: string, marks: Mark[] = []): Text => {
    return {
        data: {},
        marks,
        value: text,
        nodeType: "text",
    };
};

export const generateRteLink = (text: string, url: string): Inline => {
    return {
        data: {
            uri: url,
        },
        content: [generateRteText(text)],
        nodeType: INLINES.HYPERLINK,
    };
};

export const generateRteHeadline = (text: string, marks: Mark[] = []): TopLevelBlock => {
    return {
        data: {},
        content: [generateRteText(text, marks)],
        nodeType: BLOCKS.HEADING_3,
    };
};

export const generateRteParagraph = (children: (Block | Inline | Text)[]): TopLevelBlock => {
    return {
        content: children,
        data: {},
        nodeType: BLOCKS.PARAGRAPH,
    };
};

export const generateRteEmbed = (id: string): TopLevelBlock => {
    return {
        nodeType: BLOCKS.EMBEDDED_ENTRY,
        data: {
            target: {
                sys: {
                    id,
                    type: "Link",
                    linkType: "Entry",
                },
            },
        },
        content: [],
    };
};

export const generateRteAsset = (id: string): TopLevelBlock => {
    return {
        nodeType: BLOCKS.EMBEDDED_ASSET,
        data: {
            target: {
                sys: {
                    id,
                    type: "Link",
                    linkType: "Entry",
                },
            },
        },
        content: [],
    };
};

export const generateRteNewline = () => generateRteParagraph([generateRteText("")]);

export const generateRteData = (children: TopLevelBlock[]): Document => {
    return {
        content: children,
        data: {},
        nodeType: BLOCKS.DOCUMENT,
    };
};

export const generateRte = (json: RteJSON): RteData => {
    return {
        json,
    };
};
