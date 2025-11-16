// modules
import ms from "ms";
import jwt from "jsonwebtoken";
// constants
import { JWT_ACCESS_TOKEN_TTL_MS, JWT_ACCESS_SECRET } from "src/constants/env.ts";

type JWTPayload = {
    sub: string,
    role?: string,
    sessionId: string,
    iat: number,
    exp: number
}

type JWTInput = {
    sub: string,
    role?: string,
    sessionId: string
};

export const signJWT = (payload: JWTInput) => jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: JWT_ACCESS_TOKEN_TTL_MS });

export const verifyJWT = (token: string) => jwt.verify(token, JWT_ACCESS_SECRET) as JWTPayload;