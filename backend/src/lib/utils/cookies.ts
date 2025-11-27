// modules
import { Response, CookieOptions } from "express";
// constants
import { JWT_ACCESS_TOKEN_TTL_MS, NODE_ENV } from "src/config/env";

const cookieOptions: CookieOptions = {
    httpOnly: true,
    sameSite: "none",
    secure: true
}

export const setAccessTokenCookie = (token: string, res: Response) => res.cookie("accessToken", token, { ...cookieOptions, maxAge: JWT_ACCESS_TOKEN_TTL_MS });

export const setRefreshTokenCookie = (token: string, res: Response) => res.cookie("refreshToken", token, { ...cookieOptions, maxAge: undefined });

export const clearAuthCookies = (res: Response) => {
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
}

// maxAge vs expires
// maxAge is the lifetime of the cookie in milliseconds
// expires is an exact Date object for when the cookie should expire
// For refresh token maxAge: undefined, the cookie becomes a “session cookie”
// The browser keeps it only in memory, it lives until the browser or tab is closed
// The browser automatically deletes it when the user closes the browser
// Even if an attacker steals the cookie, it disappears when the user closes the browser
// Refresh rotation: the server controls the lifetime of the refresh token via the database TTL (or expiresAt field)
// So the cookie doesn’t need to track expiration itself
// Rely on the server for revocation rather than the browser automatically deleting it