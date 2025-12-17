"use client";

import { use, useEffect, useId, useState } from "react";
import { useTheme } from "next-themes";

const cache = new Map<string, Promise<unknown>>();

export function Mermaid({ chart }: { chart: string }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return <MermaidContent chart={chart} />;
}

const cachePromise = <T extends object>(key: string, setPromise: () => Promise<T>) => {
    const cached = cache.get(key);

    if (cached) {
        return cached as Promise<T>;
    }

    const promise = setPromise();
    cache.set(key, promise);
    return promise;
};

function MermaidContent({ chart }: { chart: string }) {
    const id = useId();
    const { resolvedTheme } = useTheme();
    const { default: mermaid } = use(cachePromise("mermaid", () => import("mermaid")));

    mermaid.initialize({
        startOnLoad: false,
        securityLevel: "loose",
        fontFamily: "inherit",
        theme: resolvedTheme === "dark" ? "dark" : "default",
    });

    const { svg, bindFunctions } = use(
        cachePromise(`${chart}-${resolvedTheme}`, () => {
            return mermaid.render(id, chart.replaceAll("\\n", "\n"));
        })
    );

    return (
        <div
            ref={container => {
                if (container) bindFunctions?.(container);
            }}
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
}
