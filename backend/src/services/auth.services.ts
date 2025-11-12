// modules
import { Types } from "mongoose";
// schemas
import { SigninSchema, SignupSchema } from "src/lib/schemas/auth.schemas.ts";
// utils
import { signJWT } from "src/lib/utils/jwt.ts";
import { AppError } from "src/lib/utils/AppError.ts";
import { generateToken, hash } from "src/lib/utils/crypto.ts";
// models
import User from "src/models/user.model.ts";
import Session from "src/models/session.model.ts";
// constants
import { REFRESH_TOKEN_TTL_MS } from "src/constants/env.ts";

type TCreateSession = {
    userId: Types.ObjectId,
    role?: string,
    userAgent: string,
    ip: string
}

type TRotateSession = {
    refreshToken: string,
    userAgent: string,
    ip: string
}

export const createSession = async ({ userId, role, userAgent, ip }: TCreateSession) => {
    // 1) Generate opaque refresh token
    const refreshToken = generateToken();
    const refreshTokenHash = hash(refreshToken);

    // 2) Store session into database (per device)
    await Session.create({
        userId,
        refreshTokenHash,
        userAgent,
        ip,
        createdAt: new Date(Date.now()),
        lastUsedAt: new Date(Date.now()),
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS)
    });

    // 3) Create access token 
    const accessToken = signJWT({ sub: String(userId), role });

    // 4) Return data to auth controller layer
    return { accessToken, refreshToken }
}

export const rotateSession = async ({ refreshToken, userAgent, ip }: TRotateSession) => {
    // 1.1) Find current session using hashed refreshToken
    const refreshTokenHash = hash(refreshToken);
    const currentSession = await Session.findOne({ refreshTokenHash });

    // 1.2) Validate session, session must exist, not be revoked or expired
    if (!currentSession || currentSession.revokedAt || currentSession.expiresAt < new Date()) {
        throw new AppError("Invalid or expired refresh token.", 401);
    }

    // 2) Rotation: create a new refresh token & session
    const newRefreshToken = generateToken();
    const newRefreshTokenHash = hash(newRefreshToken);
    const newSession = await Session.create({
        userId: currentSession.userId,
        refreshTokenHash: newRefreshTokenHash,
        userAgent,
        ip,
        createdAt: new Date(Date.now()),
        lastUsedAt: new Date(Date.now()),
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS)
    });

    // 3) Revoke old session & link chain
    currentSession.revokedAt = new Date(Date.now());
    currentSession.replacedBy = newSession._id;
    await currentSession.save();

    // 4) Issue new access token
    const accessToken = signJWT({ sub: String(currentSession.userId) });

    // 5) Return data
    return { accessToken, refreshToken: newRefreshToken, session: newSession }
}

export const revokeSession = async (incomingRefreshToken: string) => {
    // 1 Find current session using hashed refreshToken
    const refreshTokenHash = hash(incomingRefreshToken);
    const session = await Session.findOne({ refreshTokenHash });

    // Do not throw an appError here
    // Because throwing AppError would:
    // Leak information about session validity
    // Allow attackers to detect valid vs invalid tokens
    // Break logout gracefully when the session is already gone

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

export const signupUser = async ({ name, email, password }: SignupSchema) => {
    // 1) Initial check if user already exist in database
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new AppError("User already exists.", 409);

    // 2) Create a new user
    // User password is hashed in pre-save mongoose hook in User model
    const user = await User.create({ name, email, password });

    return user;
}

export const signinUser = async ({ email, password }: SigninSchema) => {
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
        throw new AppError("Incorrect email or password.", 401);
    }

    if (!user.isVerified) {
        throw new AppError("Please verify your email before signing in.", 401);
    }

    return user;
}