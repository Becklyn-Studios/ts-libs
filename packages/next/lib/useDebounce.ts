"use client";

import { DependencyList, useEffect, useMemo } from "react";
import { debounce } from "./debounce";

type Props = Parameters<typeof debounce>;

export const useDebounce = (fn: Props[0], ms: Props[1], deps?: DependencyList) => {
    const bounce = useMemo(() => debounce(fn, ms), [fn, ms]);

    useEffect(() => (deps && Array.isArray(deps) ? bounce() : bounce()), [deps, bounce]);
};
