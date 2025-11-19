// utils
import { AppError } from "src/lib/utils/AppError.ts";
import { catchAsync } from "src/lib/utils/catchAsync.ts";
import { clearAuthCookies, setAccessTokenCookie, setRefreshTokenCookie } from "src/lib/utils/cookies.ts";
// email
import { sendEmail } from "src/lib/email/sendEmail.ts";
import { VERIFICATION_EMAIL_TEMPLATE } from "src/lib/email/email.templates.ts";
// services
import { createSession, revokeAllUserSesions, revokeSession, rotateSession } from "src/services/session.services.ts";
import { deleteUser, requestResetPassword, resetUserPassword, signinUser, signupUser, tokenVerification, updateUserPassword } from "src/services/auth.services.ts";
// constants
import { CLIENT_ORIGIN, SERVER_ORIGIN } from "src/constants/env.ts";

// Sign up user
// POST method
// Public route /api/v1/auth/signup
export const signUp = catchAsync(async (req, res, next) => {
    const { name, email, password } = req.body;
    // 1) Request validation is done in the validateSchema middleware
    // 2) Handle business logic, call service to create user document
    const { user, verificationToken } = await signupUser({ name, email, password });

    // 3.1) Send a verification token to the user’s email
    const verificationUrl = `${SERVER_ORIGIN}/api/v1/auth/verification?token=${verificationToken}`;
    const html = VERIFICATION_EMAIL_TEMPLATE.replace("{verificationUrl}", verificationUrl);
    const { error } = await sendEmail({ to: user.email, subject: "Confirm email", html });

    // 3.2) Delete the user from the database if sending email fails
    if (error) {
        await deleteUser(user._id.toString());
        return next(new AppError("Failed to send verification email. Please try again.", 500));
    }

    // 4) Send response to the client
    res.status(201).json({
        status: "success",
        message: "Account created. Check your email to confirm it."
    });
});

// Sign in user
// POST method
// Public route /api/v1/auth/signin
export const signIn = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    // 1) Request validation is done in the validateSchema middleware
    // 2) Handle business logic, call service to sign in user
    const user = await signinUser({ email, password });

    // 3) Create a session & issue tokens
    const { accessToken, refreshToken } = await createSession({ userId: user._id, role: user.role, req });

    // 4) Set HttpOnly cookies
    setAccessTokenCookie(accessToken, res);
    setRefreshTokenCookie(refreshToken, res);

    // 5) Send response to client
    res.status(200).json({ status: "success" });
});

// Rotate refresh token & issue new tokens
// POST method
// Public route /api/v1/auth/refresh
export const refresh = catchAsync(async (req, res, next) => {
    // 1) Check for incoming refresh token
    const incomingRefreshToken = req.cookies.refreshToken as string;
    if (!incomingRefreshToken) {
        return next(new AppError("Please sign in again.", 401));
    }

    // 2) Rotate refresh token (revokes old one & creates new session)
    const { accessToken, refreshToken } = await rotateSession({ refreshToken: incomingRefreshToken, req });

    // 3) Set new HttpOnly cookies
    setAccessTokenCookie(accessToken, res);
    setRefreshTokenCookie(refreshToken, res);

    // 4) Send response to the client
    res.status(200).json({ status: "success" });
});

// Sign out user from single session
// POST method
// Protected route /api/v1/auth/signout
export const signOut = catchAsync(async (req, res, next) => {
    // 1) Check for incoming refresh token
    const incomingRefreshToken = req.cookies.refreshToken as string;
    if (!incomingRefreshToken) {
        return next(new AppError("Please sign in again.", 401));
    }

    // 2) Revoke single session
    await revokeSession(incomingRefreshToken);

    // 3) Clear all authentication cookies
    clearAuthCookies(res);

    // 4) Send response to the client
    res.status(200).json({ status: "success" });
});

// Sign out user from all sessions
// POST method
// Protected route /api/v1/auth/signoutall
export const signOutAll = catchAsync(async (req, res, next) => {
    // 1) Check for authenticated user id
    const userId = (req as any).user._id;
    if (!userId) return next(new AppError("You are not authorized to perform this action.", 401));

    // 2) Revoke all device sessions
    await revokeAllUserSesions(userId);

    // 3) Clear all authentication cookies
    clearAuthCookies(res);

    // 4) Send response to the client
    res.status(200).json({ status: "success" });
});

// Email token verification
// GET method
// Public route /api/v1/auth/verification?token=verificationToken
export const verification = catchAsync(async (req, res, next) => {
    // 1) Check for verification token
    const { token } = req.query;
    if (!token || typeof token !== "string") {
        return res.redirect(`${CLIENT_ORIGIN}/verification-failed`);
    }

    // 2) Handle business logic, call service to verify user's email
    const isVerified = await tokenVerification(token);
    if (!isVerified) {
        return res.redirect(`${CLIENT_ORIGIN}/verification-failed`);
    }

    // 3) Redirect user to /verification-success
    res.redirect(`${CLIENT_ORIGIN}/verification-success`);
});

// User forgot password
// POST method
// Public route /api/v1/auth/forgot-password
export const forgotPassword = catchAsync(async (req, res, next) => {
    const { email } = req.body;
    // 1) Request validation is done in the validateSchema middleware
    // 2) Handle business logic, call service to request and send reset password link
    await requestResetPassword(email);

    // 3) Send response to the client
    res.status(200).json({
        status: "success",
        message: "If an account with that email exists, we sent instructions."
    });
});

// Reset password
// PATCH method
// Public route /api/v1/auth/reset-password
export const resetPassword = catchAsync(async (req, res, next) => {
    const { password } = req.body;
    // 1) Request validation is done in the validateSchema middleware
    // 2) Check if reset password token exits and is valid
    const { token } = req.query;
    if (!token || typeof token !== "string") {
        return next(new AppError("Reset password token is missing or invalid.", 400));
    }
    // 3) Handle business logic, call service to actually reset user's password
    await resetUserPassword(token, password);

    // 4) Send response to the client
    res.status(200).json({
        status: "success",
        message: "Password has been reset successfully. Please sign in again."
    });
});

// Update password
// PATCH method
// Protected route /api/v1/auth/update-password
export const updatePassword = catchAsync(async (req, res, next) => {
    // 1) Request validation is done in the validateSchema middleware
    const { currentPassword, newPassword } = req.body;
    const userId = (req as any).user._id;

    // 2) Call service to update user password
    await updateUserPassword(userId, currentPassword, newPassword);

    // 3) Reavoke all sessions & clear all cookies
    await revokeAllUserSesions(userId);
    clearAuthCookies(res);

    // 4) Send response to the client
    res.status(200).json({
        status: "success",
        message: "Password updated successfully. Please sign in again."
    });
});