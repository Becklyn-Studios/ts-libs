import { FC } from "react";
import { Options, documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { Document } from "@contentful/rich-text-types";
import { isString } from "../lib/typeChecks";
import { PropsWithClassName } from "../types/style";

export type RteJSON = Document;

export interface RteData {
    json?: RteJSON;
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
