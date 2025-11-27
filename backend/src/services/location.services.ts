// modules
import { Request } from "express";

export const getLocation = async (req: Request) => {
    try {
        let ip =
            (req.headers["cf-connecting-ip"] as string) ||
            (req.headers["x-real-ip"] as string) ||
            (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
            req.ip || "";

        if (ip === "::1") ip = "127.0.0.1";

        // Skip private IPs
        if (ip.startsWith("127.") || ip.startsWith("10.") || ip.startsWith("192.168.")) {
            return null;
        }

        const response = await fetch(`https://ipwho.is/${ip}`);
        const data = await response.json();

        const location = data.city && data.country && data.region ? `${data.city}, ${data.region}, ${data.country}` : null;

        return { location, ip };
    } catch (err) {
        console.error("Location error:", err);
        return null;
    }
};
