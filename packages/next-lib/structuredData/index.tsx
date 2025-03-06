import React from "react";
import { StructuredData as Data } from "@tmbw/next-lib/types/structuredData";

export interface StructuredDataProps {
    data?: Data.Index | null | false;
}

export const StructuredData: React.FC<StructuredDataProps> = ({ data }) => {
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
