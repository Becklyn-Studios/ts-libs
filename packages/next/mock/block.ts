import { BlockProps } from "../types/block";

export const mockBlock = <T>(overwrite: T): T & BlockProps => ({
    entryId: "123",
    locale: "de",
    draftMode: false,
    ...overwrite,
});
