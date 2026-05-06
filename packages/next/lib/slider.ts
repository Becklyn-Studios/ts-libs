"use client";

import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
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
    const [slider, setSlider] = useState<KeenSliderInstance | null>(null);

    useEffect(() => {
        if (!ref) {
            return;
        }

        const handleDetails = (instance: KeenSliderInstance) => {
            setIsMounted(true);
            setDetails(instance.track.details);
        };

        const instance = new KeenSlider(
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

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSlider(instance);

        return () => {
            instance.destroy();
            setSlider(null);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ref]);

    const isActiveIndex = useCallback((index: number) => index === details?.rel, [details]);

    const next = () => {
        slider?.next();
    };

    const prev = () => {
        slider?.prev();
    };

    const moveToIdx = (index: number) => {
        slider?.moveToIdx(index);
    };

    return [
        setRef,
        {
            slider,
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
