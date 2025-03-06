export interface InspectableItem {
    entryId?: string;
    draftMode?: boolean;
    locale?: string;
}

export interface InspectableField extends Partial<InspectableItem> {
    fieldId?: string;
    assetId?: string;
}

export const getInspectorProps = (data: any) => {
    if (!data) {
        return {};
    }

    const { entryId, fieldId, assetId, draftMode, locale } = data;
    return { entryId, fieldId, assetId, draftMode, locale };
};

export const removeInspectorProps = (data: any) => {
    if (!data) {
        return {};
    }

    const { entryId: _1, fieldId: _2, assetId: _3, draftMode: _4, locale: _5, ...props } = data;
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
