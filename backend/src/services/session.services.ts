// modules
import { Types } from "mongoose";
// schemas & types
import { TCreateSession, TRotateSession } from "src/lib/types/session.types";
// utils
import { signJWT } from "src/lib/utils/jwt";
import { AppError } from "src/lib/utils/AppError";
import { generateToken, hash } from "src/lib/utils/crypto";
// models
import Session from "src/models/session.model";
// constants
import { REFRESH_TOKEN_TTL_MS } from "src/constants/env";
// services
import { getLocation } from "./location.services";

export const createSession = async ({ userId, role, req }: TCreateSession) => {
    // 1) Generate opaque refresh token
    const refreshToken = generateToken();
    const refreshTokenHash = hash(refreshToken);

    // 2) Get location, userAgent & IP address
    const userAgent = req.get("user-agent") ?? "";
    const locationResponse = await getLocation(req);
    const location = locationResponse?.location;
    const ip = locationResponse?.ip;

    // 3) Store session into database (per device)
    const session = await Session.create({
        userId,
        refreshTokenHash,
        userAgent,
        ip,
        location,
        createdAt: new Date(Date.now()),
        lastUsedAt: new Date(Date.now()),
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS)
    });

    // 4) Create access token 
    const accessToken = signJWT({ sub: String(userId), role, sessionId: String(session._id) });

    // 5) Return data to auth controller layer
    return { accessToken, refreshToken }
}

export const rotateSession = async ({ refreshToken, req }: TRotateSession) => {
    // 1.1) Find current session using hashed refreshToken
    const refreshTokenHash = hash(refreshToken);
    const currentSession = await Session.findOne({ refreshTokenHash });

    // 1.2) Validate session, session must exist, not be revoked or expired
    if (!currentSession || currentSession.revokedAt || currentSession.expiresAt < new Date()) {
        throw new AppError("Invalid or expired refresh token.", 401);
    }

    // 2) Create a new refresh token
    const newRefreshToken = generateToken();
    const newRefreshTokenHash = hash(newRefreshToken);

    // 3) Get location
    const userAgent = req.get("user-agent") ?? "";
    const ip = req.ip ?? "";
    const location = getLocation(req);

    // 4) Create a new session
    const newSession = await Session.create({
        userId: currentSession.userId,
        refreshTokenHash: newRefreshTokenHash,
        userAgent,
        ip,
        location,
        createdAt: new Date(Date.now()),
        lastUsedAt: new Date(Date.now()),
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS)
    });

    // 5) Revoke old session & link chain
    currentSession.revokedAt = new Date(Date.now());
    currentSession.replacedBy = newSession._id;
    await currentSession.save();

    // 6) Issue new access token
    const accessToken = signJWT({ sub: String(currentSession.userId), sessionId: String(newSession._id) });

    // 7) Return data
    return { accessToken, refreshToken: newRefreshToken, session: newSession }
}

export const revokeSession = async (incomingRefreshToken: string) => {
    // 1) Find current session using hashed refreshToken
    const refreshTokenHash = hash(incomingRefreshToken);
    const session = await Session.findOne({ refreshTokenHash });

    // Do not throw an appError here
    // Because throwing AppError would:
    // - Leak information about session validity
    // - Allow attackers to detect valid vs invalid tokens
    // Break signout gracefully when the session is already gone

    // 2) If session exists and isn't already revoked → revoke it
    if (session && !session.revokedAt) {
        session.revokedAt = new Date();
        await session.save();
    }
}

// Revoke all user session (e.g., password change)
export const revokeAllUserSesions = async (userId: Types.ObjectId) => {
    await Session.updateMany({ userId, revokedAt: { $exists: false } }, { $set: { revokedAt: new Date() } });
}

export const findAllUserSessions = async (userId: Types.ObjectId) => {
    // Find all active and not expired user sessions 
    // Sort all sessions in descending order
    const sessions = await Session
        .find({ userId, revokedAt: null, expiresAt: { $gt: new Date() } })
        .select("userAgent lastUsedAt location")
        .sort({ lastUsedAt: -1 });

    return sessions;
}