// lib
import { Request } from "express";
import { Types } from "mongoose";

export interface ISession {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    refreshTokenHash: string;
    userAgent?: string;
    location?: string;
    ip?: string;
    createdAt: Date;
    lastUsedAt: Date;
    expiresAt: Date; // Session lifetime, based on refresh token TTL
    revokedAt?: Date;
    replacedBy?: Types.ObjectId; // Points to a new session on rotation
}

export type TCreateSession = {
    userId: Types.ObjectId,
    role?: string,
    req: Request
}

export type TRotateSession = {
    refreshToken: string,
    req: Request
}