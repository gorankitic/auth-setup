// modules
import { Request } from "express";

export const getLocation = (req: Request) => {
    const cityRaw = req.headers["cf-iploc-city"];
    const countryRaw = req.headers["cf-iploc-country"];

    const city = Array.isArray(cityRaw) ? cityRaw[0] : cityRaw;
    const country = Array.isArray(countryRaw) ? countryRaw[0] : countryRaw;

    return {
        city: city as string | undefined,
        country: country as string | undefined,
    }
}