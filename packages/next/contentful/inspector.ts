import { z } from "zod";

export const InspectableItemSchema = z.object({
    entryId: z.string().optional(),
    draftMode: z.boolean().optional(),
    locale: z.string().optional(),
});

export const InspectableFieldSchema = z
    .object({
        fieldId: z.string().optional(),
        assetId: z.string().optional(),
    })
    .extend(InspectableItemSchema.shape);

export const InspectorPropsSchema = z.object({
    entryId: z.string().optional(),
    draftMode: z.boolean().optional(),
    locale: z.string().optional(),
    fieldId: z.string().optional(),
    assetId: z.string().optional(),
});

export type InspectableItem = z.infer<typeof InspectableItemSchema>;
export type InspectableField = z.infer<typeof InspectableFieldSchema>;
export type InspectorProps = z.infer<typeof InspectorPropsSchema>;

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

export const inspector = <T extends InspectableField>(
    data: T
): Record<string, string | undefined> => {
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
