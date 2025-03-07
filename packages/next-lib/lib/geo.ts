"use client";

import { useState } from "react";

export const getGeoLocation = async (): Promise<GeolocationPosition | undefined> => {
    if (navigator && "geolocation" in navigator) {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    }
};

export const useGeoLocation = () => {
    const [location, setLocation] = useState<GeolocationPosition | undefined>();

    const onClick = async () => {
        const l = await getGeoLocation();
        setLocation(l);
        return l;
    };

    return [onClick, location] as const;
};
