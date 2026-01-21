"use client";

import { FC, useId, useState } from "react";
import clsx from "clsx";
import * as Slider from "@radix-ui/react-slider";
import styles from "./RangeSlider.module.scss";

export type RangeSliderBase = {
    id?: string;
    label?: string;
    step?: number;
    min?: number;
    max: number;
    className?: string;
    disabled?: boolean;
    onValueCommit?: (value: number) => void;
};

type RangeSliderControlled = RangeSliderBase & {
    value: number;
    setValue: (value: number) => void;
    defaultValue?: undefined;
    name?: undefined;
};

type RangeSliderUncontrolled = RangeSliderBase & {
    value?: undefined;
    setValue?: undefined;
    defaultValue: number;
    name: string;
};

export type RangeSliderProps = RangeSliderControlled | RangeSliderUncontrolled;

export const RangeSlider: FC<RangeSliderProps> = ({
    id: providedId,
    className,
    label,
    min,
    max,
    step,
    disabled,
    name,
    value,
    setValue,
    onValueCommit,
    defaultValue,
}) => {
    const generatedId = useId();
    const id = providedId ?? generatedId;

    // Determine if controlled or uncontrolled
    const isControlled = value !== undefined && setValue !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue ?? min ?? 0);

    // Use controlled value if provided, otherwise use internal state
    const currentValue = isControlled ? value : internalValue;
    const handleValueChange = (newValue?: number) => {
        if (newValue === undefined) {
            return;
        }

        if (isControlled) {
            setValue(newValue);
        } else {
            setInternalValue(newValue);
        }
    };

    return (
        <div className={clsx(styles.wrapper, className)}>
            {label && <label htmlFor={id}>{label}</label>}
            <Slider.Root
                id={id}
                className={styles.sliderRoot}
                min={min}
                max={max}
                step={step}
                value={[currentValue]}
                onValueChange={([newValue]) => handleValueChange(newValue)}
                disabled={disabled}
                name={name}>
                <Slider.Track className={styles.sliderTrack}>
                    <Slider.Range className={styles.sliderRange} />
                </Slider.Track>
                <Slider.Thumb
                    onPointerUp={() => {
                        onValueCommit?.(currentValue);
                    }}
                    className={styles.sliderThumb}
                    aria-label="Minimum"
                />
            </Slider.Root>
        </div>
    );
};
