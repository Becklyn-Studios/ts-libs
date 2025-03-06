import React, { FC } from "react";
import { Options, documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { Document } from "@contentful/rich-text-types";
import { isString } from "@next-lib/lib/typeChecks";
import { PropsWithClassName } from "@next-lib/types/style";

export type RteJSON = Document;
export type RteLinks = {
    entries: {
        block: any[];
        inline: any[];
        hyperlink: any[];
    };
    assets: {
        block: any[];
        inline: any[];
        hyperlink: any[];
    };
};

export interface RteData {
    json?: RteJSON;
    links?: RteLinks;
}

export interface RteProps {
    data: RteData;
    options?: Options;
}

export const Rte: FC<PropsWithClassName<RteProps>> = ({ data, options, ...props }) => {
    if (!data) {
        return null;
    }

    const { json } = data;

    if (!json) {
        return null;
    }

    if (isString(json)) {
        return <div {...props}>{json}</div>;
    }

    return <div {...props}>{documentToReactComponents(json, options)}</div>;
};
