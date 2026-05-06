"use client";

import { FC, PropsWithChildren } from "react";
import clsx from "clsx";
import { SliderOptions, useSlider } from "@becklyn/next/lib/slider";
import { PropsWithClassName } from "@becklyn/next/types/style";
import styles from "./Slider.module.scss";

export interface SliderProps extends SliderOptions {
    showNav?: boolean;
}

export const Slider: FC<PropsWithChildren<PropsWithClassName<SliderProps>>> = ({
    children,
    className,
    showNav = true,
    ...options
}) => {
    const [setRef, { next, prev, isActiveIndex, details, isDisabled }] = useSlider(options);

    const slideCount = details?.slides.length ?? 0;

    return (
        <div className={clsx(styles.wrapper, isDisabled && styles.disabled, className)}>
            <div ref={node => setRef(node)} className={clsx("keen-slider", styles.slider)}>
                {children}
            </div>
            {showNav && !isDisabled && slideCount > 1 && (
                <div className={styles.nav}>
                    <button onClick={prev} className={styles.navButton} type="button">
                        ←
                    </button>
                    <div className={styles.dots}>
                        {Array.from({ length: slideCount }).map((_, i) => (
                            <span
                                key={i}
                                className={clsx(styles.dot, isActiveIndex(i) && styles.dotActive)}
                            />
                        ))}
                    </div>
                    <button onClick={next} className={styles.navButton} type="button">
                        →
                    </button>
                </div>
            )}
        </div>
    );
};

export const Slide: FC<PropsWithChildren<PropsWithClassName>> = ({ children, className }) => (
    <div className={clsx("keen-slider__slide", styles.slide, className)}>{children}</div>
);
