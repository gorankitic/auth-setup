// modules
import { Types } from "mongoose";
// schemas
import { SigninSchema, SignupSchema } from "src/lib/schemas/auth.schemas.ts";
// utils
import { signJWT } from "src/lib/utils/jwt.ts";
import { AppError } from "src/lib/utils/AppError.ts";
import { generateToken, hash } from "src/lib/utils/crypto.ts";
// email
import { sendEmail } from "src/lib/email/sendEmail.ts";
import { RESET_PASSWORD_TEMPLATE } from "src/lib/email/email.templates.ts";
// models
import User from "src/models/user.model.ts";
import Session from "src/models/session.model.ts";
// constants
import { SERVER_ORIGIN, REFRESH_TOKEN_TTL_MS } from "src/constants/env.ts";

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
    const session = await Session.create({
        userId,
        refreshTokenHash,
        userAgent,
        ip,
        createdAt: new Date(Date.now()),
        lastUsedAt: new Date(Date.now()),
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS)
    });

    // 3) Create access token 
    const accessToken = signJWT({ sub: String(userId), role, sessionId: String(session._id) });

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
    const accessToken = signJWT({ sub: String(currentSession.userId), sessionId: String(newSession._id) });

    // 5) Return data
    return { accessToken, refreshToken: newRefreshToken, session: newSession }
}

export const revokeSession = async (incomingRefreshToken: string) => {
    // 1) Find current session using hashed refreshToken
    const refreshTokenHash = hash(incomingRefreshToken);
    const session = await Session.findOne({ refreshTokenHash });

    // Do not throw an appError here
    // Because throwing AppError would:
    // Leak information about session validity
    // Allow attackers to detect valid vs invalid tokens
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

export const signupUser = async ({ name, email, password }: SignupSchema) => {
    // 1) Initial check if user already exists in database
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new AppError("User already exists.", 409);

    // 2) Generate verification code
    // Verification code is hashed in pre-save mongoose hook in User model
    const verificationToken = generateToken(32);

    // 3) Create a new user
    // User password is hashed in pre-save mongoose hook in User model
    const verificationTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000);
    const user = await User.create({ name, email, password, verificationToken, verificationTokenExpiresAt });

    // 4) Return data to controller
    return { user, verificationToken };
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

export const tokenVerification = async (verificationToken: string) => {
    // 1) Hash verification token
    const verificationTokenHash = hash(verificationToken);

    // 2) Check if verification token has expired
    const user = await User.findOne({
        verificationToken: verificationTokenHash,
        verificationTokenExpiresAt: { $gt: new Date() },
    });
    // If verification fails return false to redirect user to /verification-failed
    if (!user) return false;

    // 3) Mark user as verified
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    // If verification successfull return true to redirect user to /verification-success
    return true;
}

export const requestResetPassword = async (email: string) => {
    const user = await User.findOne({ email });
    if (!user) throw new AppError("No user found with that email.", 404);

    const resetPasswordToken = generateToken(32);
    const resetPasswordTokenHash = hash(resetPasswordToken);
    user.resetPasswordToken = resetPasswordTokenHash;
    user.resetPasswordTokenExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    const resetPasswordUrl = `${SERVER_ORIGIN}/reset-password?token=${resetPasswordToken}`;
    const html = RESET_PASSWORD_TEMPLATE.replace("{resetPasswordUrl}", resetPasswordUrl);
    const { error } = await sendEmail({ to: user.email, subject: "Reset password", html });

    if (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpiresAt = undefined;
        await user.save();
        throw new AppError("Failed to send reset password email. Please try again later.", 500);
    }
}

export const resetUserPassword = async (resetPasswordToken: string, newPassword: string) => {
    // 1) Hash the incoming reset password token
    const resetPasswordTokenHash = hash(resetPasswordToken);
    // 2) Find user with this token & check if token is expired
    const user = await User.findOne({
        resetPasswordToken: resetPasswordTokenHash,
        resetPasswordTokenExpiresAt: { $gt: new Date() }
    });
    if (!user) {
        throw new AppError("Invalid or expired reset password token.", 400);
    }

    // 3) Update password and clear reset fields
    // User password is hashed in pre-save mongoose hook in User model
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiresAt = undefined;
    await user.save();
    // 4) Update changedPasswordAt property (using mongoose pre-save middleware in User model)

    // 5) Invalidate all sessions
    await revokeAllUserSesions(user._id);

    return user;
}

export const updateUserPassword = async (userId: string, currentPassword: string, newPassword: string) => {
    // 1) Get user from collection
    const user = await User.findById(userId).select("+password");
    // We already checked for user in protect middleware, but typescript doesn't know that 
    if (!user) {
        throw new AppError("There is no user with that id.", 404);
    }

    // 2) Check if POSTed current password is correct
    if (!(await user.correctPassword(currentPassword, user.password))) {
        throw new AppError("Incorrect current password.", 401);
    }

    // 3) Update password
    // User password is hashed in pre-save mongoose hook in User model
    user.password = newPassword;
    await user.save();

    // 4) Update changedPasswordAt property (using mongoose pre-save middleware in User model)

    return user;
}

export const deleteUser = async (userId: string) => {
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
        throw new AppError("There is no user with that id.", 404);
    }
} 