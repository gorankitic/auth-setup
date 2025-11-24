// modules
import mongoose, { Schema } from "mongoose";
// types
import { ISession } from "src/lib/types/session.types";

const sessionSchema = new Schema<ISession>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    refreshTokenHash: {
        type: String,
        required: true,
        unique: true
    },
    userAgent: String,
    location: String,
    ip: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastUsedAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        required: true,
        index: {
            expires: 0
        }
    },
    revokedAt: Date,
    replacedBy: {
        type: Schema.Types.ObjectId,
        ref: "Session"
    },
});

// Avoid using { timestamps: true } for sessions
// updatedAt changes whenever *any* field updates, which is not useful for session tracking
// We use a custom lastUsedAt field to capture "the last time the session was used to refresh tokens"
// lastUsedAt must NOT update when unrelated fields change (userAgent, ip, revokedAt, replacedBy)
// lastUsedAt should update only inside the refresh flow

// MongoDB TTL index, sessions are deleted automatically after their expiration date


const Session = mongoose.model<ISession>("Session", sessionSchema);

export default Session;