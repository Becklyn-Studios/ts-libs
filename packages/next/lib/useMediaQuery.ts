"use client";

import { useEffect, useRef, useState } from "react";

type Query =
    | `(min-width: ${number}px)`
    | `(max-width: ${number}px)`
    | `(min-width: ${number}px) and (max-width: ${number}px)`;

/**
 * Hook to track media query state
 * @param query - The media query string (e.g., "(min-width: 1024px)")
 * @returns boolean indicating if the media query matches
 */
export const useMediaQuery = (query: Query): boolean => {
    // Default to false for SSR to prevent hydration mismatch
    const [matches, setMatches] = useState<boolean>(false);
    const currentMatches = useRef<boolean>(matches);

    useEffect(() => {
        // Only run on client side
        if (typeof window === "undefined") {
            return;
        }

        const mediaQuery = window.matchMedia(query);

        // Set initial value
        setMatches(mediaQuery.matches);
        currentMatches.current = mediaQuery.matches;

        // Create event listener
        const handleChange = (event: MediaQueryListEvent) => {
            const newMatch = event.matches;

            if (newMatch !== currentMatches.current) {
                setMatches(newMatch);
                currentMatches.current = newMatch;
            }
        };

        // Add event listener
        mediaQuery.addEventListener("change", handleChange);

        // Cleanup
        return () => {
            mediaQuery.removeEventListener("change", handleChange);
        };
    }, [query]);

    return matches;
};
