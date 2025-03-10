export interface Previewable {
    draftMode?: boolean;
}

export interface Inspectable extends Previewable {
    entryId: string;
    locale: string;
}
