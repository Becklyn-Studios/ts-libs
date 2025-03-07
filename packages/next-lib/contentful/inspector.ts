export interface InspectableItem {
    entryId?: string;
    draftMode?: boolean;
    locale?: string;
}

export interface InspectableField extends Partial<InspectableItem> {
    fieldId?: string;
    assetId?: string;
}

interface InspectorProps {
    entryId?: string;
    fieldId?: string;
    assetId?: string;
    draftMode?: boolean;
    locale?: string;
}

export const getInspectorProps = <T extends InspectorProps>(data: T) => {
    if (!data) {
        return {};
    }

    const { entryId, fieldId, assetId, draftMode, locale } = data;
    return { entryId, fieldId, assetId, draftMode, locale };
};

export const removeInspectorProps = <T extends InspectorProps>(data: T) => {
    if (!data) {
        return {};
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { entryId, fieldId, assetId, draftMode, locale, ...props } = data;
    return props;
};

export const inspector = (data: InspectableField): Record<string, string | undefined> => {
    if (!data) {
        return {};
    }

    const { entryId, fieldId, assetId, draftMode, locale } = data;

    if (!draftMode || !entryId || (!fieldId && !assetId)) {
        return {};
    }

    return {
        ...(fieldId
            ? { "data-contentful-field-id": fieldId }
            : { "data-contentful-asset-id": assetId }),
        "data-contentful-entry-id": entryId,
        "data-contentful-locale": locale,
    };
};
