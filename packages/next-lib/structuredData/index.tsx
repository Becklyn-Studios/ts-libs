import { FC } from "react";
import { Index } from "../types/structuredData";

export interface StructuredDataProps {
    data?: Index | null | false;
}

export const StructuredData: FC<StructuredDataProps> = ({ data }) => {
    if (!data) {
        return null;
    }

    const structuredData = {
        "@context": "https://schema.org",
        ...data,
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    );
};
