import { type AnchorHTMLAttributes, type ButtonHTMLAttributes } from "react";
import { z } from "zod";

// Zod schema for button variants
export const ButtonVariantSchema = z.enum(["primary", "secondary", "tertiary"]);
export type ButtonVariant = z.input<typeof ButtonVariantSchema>;

/**
 * Zod schema for Button component props validation
 */
export const ButtonSchema = z.looseObject({
    // Visual style variant
    variant: ButtonVariantSchema.optional().default("primary"),
    // Full width button
    disabled: z.boolean().optional().default(false),
    // type of the button, defaults to "button"
    type: z.enum(["button", "submit", "reset"]).optional().default("button"),
    // CSS class
    className: z.string().optional().default(""),
});

// Type derived from the Zod schema including React's ButtonHTMLAttributes
export type ButtonProps = z.input<typeof ButtonSchema> &
    (ButtonHTMLAttributes<HTMLButtonElement> | AnchorHTMLAttributes<HTMLAnchorElement>);
