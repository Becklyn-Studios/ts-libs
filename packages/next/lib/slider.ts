"use client";

import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import KeenSlider, {
    Container,
    KeenSliderInstance,
    KeenSliderOptions,
    KeenSliderPlugin,
    TrackDetails,
} from "keen-slider";

export interface SliderOptions extends KeenSliderOptions {
    shouldObserverMutations?: boolean;
    shouldAutoDisable?: boolean;
}

export type SlideResult = [
    Dispatch<SetStateAction<Container | null>>,
    {
        slider: KeenSliderInstance | null;
        activeIndex: number;
        isDisabled: boolean;
        isMounted: boolean;
        isActiveIndex: (index: number) => boolean;
        details: TrackDetails | null;
        options: SliderOptions | null;
        next: () => void;
        prev: () => void;
        moveToIdx: (index: number) => void;
    },
];

export const useSlider = ({
    shouldObserverMutations,
    shouldAutoDisable,
    ...opt
}: SliderOptions = {}): SlideResult => {
    const [ref, setRef] = useState<Container | null>(null);
    const [details, setDetails] = useState<TrackDetails | null>(null);
    const [options, setOptions] = useState<SliderOptions | null>(null);
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const sliderRef = useRef<KeenSliderInstance | null>(null);

    useEffect(() => {
        if (!ref) {
            return;
        }

        sliderRef.current = new KeenSlider(
            ref,
            {
                rubberband: false,
                created: handleDetails,
                slideChanged: handleDetails,
                optionsChanged: ({ options }) => {
                    setOptions(options);
                },
                ...opt,
            },
            [
                shouldObserverMutations ? MutationPlugin : [],
                shouldAutoDisable ? AutoDisablePlugin : [],
            ].flat()
        );

        return () => {
            if (sliderRef.current) {
                sliderRef.current.destroy();
                sliderRef.current = null;
            }
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ref]);

    const isActiveIndex = useCallback((index: number) => index === details?.rel, [details]);

    const handleDetails = (ref: KeenSliderInstance) => {
        const details = ref.track.details;

        setIsMounted(true);

        setDetails(details);
    };

    const next = () => {
        if (!sliderRef.current) {
            return;
        }

        sliderRef?.current?.next();
    };

    const prev = () => {
        if (!sliderRef.current) {
            return;
        }

        sliderRef?.current?.prev();
    };

    const moveToIdx = (index: number) => {
        if (!sliderRef.current) {
            return;
        }

        sliderRef.current?.moveToIdx(index);
    };

    return [
        setRef,
        {
            slider: sliderRef.current,
            activeIndex: details ? details.rel : 0,
            isDisabled: options ? !!options.disabled : false,
            details,
            options,
            isMounted,
            isActiveIndex,
            next,
            prev,
            moveToIdx,
        },
    ];
};

const MutationPlugin: KeenSliderPlugin = slider => {
    const observer = new MutationObserver(() => {
        slider.update(slider.options);
    });

    slider.on("created", () => {
        observer.observe(slider.container, { childList: true });
    });

    slider.on("destroyed", () => {
        observer.disconnect();
    });
};

const AutoDisablePlugin: KeenSliderPlugin = slider => {
    const calcDisabled = () => {
        const { scrollWidth, offsetWidth } = slider.container;

        const isDisabled = scrollWidth <= offsetWidth;

        slider.update({
            ...slider.options,
            disabled: isDisabled,
        });
    };

    calcDisabled();

    let width = window.innerWidth;

    const onResize = () => {
        if (!width || width === window.innerWidth) {
            return;
        }

        width = window.innerWidth;

        calcDisabled();
    };

    window.addEventListener("resize", onResize);

    const observer = new MutationObserver(() => {
        calcDisabled();
    });

    slider.on("created", () => {
        observer.observe(slider.container, { childList: true });
    });

    slider.on("destroyed", () => {
        observer.disconnect();
    });

    slider.on("destroyed", () => {
        window.removeEventListener("resize", onResize);
    });
};
