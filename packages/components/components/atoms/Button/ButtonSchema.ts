import { type AnchorHTMLAttributes, type ButtonHTMLAttributes } from "react";
import { z } from "zod";

export const ButtonVariantSchema = z.enum(["primary", "secondary", "tertiary"]);
export type ButtonVariant = z.input<typeof ButtonVariantSchema>;

export const ButtonSchema = z.looseObject({
    variant: ButtonVariantSchema.optional().default("primary"),
    disabled: z.boolean().optional().default(false),
    type: z.enum(["button", "submit", "reset"]).optional().default("button"),
    className: z.string().optional().default(""),
});

// Type derived from the Zod schema including React's ButtonHTMLAttributes
export type ButtonProps = z.input<typeof ButtonSchema> &
    (ButtonHTMLAttributes<HTMLButtonElement> | AnchorHTMLAttributes<HTMLAnchorElement>);
