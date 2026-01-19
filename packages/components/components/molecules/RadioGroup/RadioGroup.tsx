import { ChangeEventHandler, FC } from "react";
import clsx from "clsx";
import styles from "./RadioGroup.module.scss";

export interface RadioItem {
    value: string;
    label?: string;
    disabled?: boolean;
}

export interface RadioGroupProps {
    /** Name must be unique from other radio inputs on the website,
     * especially if it's uncontrolled.
     * */
    name: string;
    label?: string;
    value?: string;
    onChange?: ChangeEventHandler<HTMLInputElement>;
    defaultValue?: string;
    items: RadioItem[];
    disabled?: boolean;
    required?: boolean;
    orientation?: "vertical" | "horizontal";
    className?: string;
}

export const RadioGroup: FC<RadioGroupProps> = ({
    name,
    label,
    value,
    onChange,
    defaultValue,
    items,
    disabled,
    required,
    orientation = "vertical",
    className,
}) => {
    return (
        <fieldset
            disabled={disabled}
            className={clsx(styles.wrapper, className)}
            aria-label={!label ? name : undefined}
            role="radiogroup">
            {label && (
                <legend className={styles.label}>
                    {label} {required && "*"}
                </legend>
            )}
            <div className={clsx(styles.items, styles[orientation])}>
                {items.map((item, index) => (
                    <label className={styles.item} key={index}>
                        <input
                            type="radio"
                            name={name}
                            value={item.value}
                            {...(value
                                ? { checked: item.value === value }
                                : { defaultChecked: item.value === defaultValue })}
                            onChange={onChange}
                            disabled={item.disabled || disabled}
                            required={required}
                            className={styles.input}
                        />
                        {item.label ?? item.value}
                    </label>
                ))}
            </div>
        </fieldset>
    );
};
