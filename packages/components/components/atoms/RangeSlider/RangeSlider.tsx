"use client";

import { FC, useId, useState } from "react";
import clsx from "clsx";
import * as Slider from "@radix-ui/react-slider";
import styles from "./RangeSlider.module.scss";

export type RangeSliderProps = {
    id?: string;
    label?: string;
    step?: number;
    min?: number;
    max: number;
    className: string;
    disabled?: boolean;
    value: number;
    setValue: (value: number) => void;
    onValueCommit?: (value: number) => void;
};

export const RangeSlider: FC<RangeSliderProps> = ({
    id: providedId,
    className,
    label,
    min,
    max,
    step,
    disabled,
    value,
    setValue,
    onValueCommit,
}) => {
    const generatedId = useId();
    const id = providedId ?? generatedId;

    const [valueMin, setValueMin] = useState(value);

    if (value !== valueMin) {
        setValueMin(value);
    }

    return (
        <div className={clsx(styles.wrapper, className)}>
            {label && <label htmlFor={id}>{label}</label>}
            <Slider.Root
                id={id}
                className={styles.sliderRoot}
                min={min}
                max={max}
                step={step}
                value={[value]}
                onValueChange={([value]) => setValue(value ?? 0)}
                disabled={disabled}>
                <Slider.Track className={styles.sliderTrack}>
                    <Slider.Range className={styles.sliderRange} />
                </Slider.Track>
                <Slider.Thumb
                    onPointerUp={() => {
                        onValueCommit?.(value);
                    }}
                    className={styles.sliderThumb}
                    aria-label="Minimum"
                />
            </Slider.Root>
        </div>
    );
};
