// utils
import { AppError } from "src/lib/utils/AppError.ts";
import { catchAsync } from "src/lib/utils/catchAsync.ts";
import { clearAuthCookies, setAccessTokenCookie, setRefreshTokenCookie } from "src/lib/utils/cookies.ts";
// services
import { createSession, revokeAllUserSesions, revokeSession, rotateSession, signinUser, signupUser } from "src/services/auth.services.ts";

// Sign up user
// POST method
// Public route /api/v1/users/signup
export const signUp = catchAsync(async (req, res, next) => {
    const { name, email, password } = req.body;
    // 1) Request validation is done in the validateSchema middleware
    // 2) Handle business logic, call service to create user document
    const user = await signupUser({ name, email, password });

    // 3) Send response to the client
    res.status(201).json({
        status: "success",
        message: "Account created. Check your email to verify your account."
    });
});

// Sign in user
// POST method
// Public route /api/v1/users/signin
export const signIn = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    // 1) Request validation is done in the validateSchema middleware
    // 2) Handle business logic, call service to sign in user
    const user = await signinUser({ email, password });

    // 3) Create a session & issue tokens
    const userAgent = req.get("user-agent") ?? "";
    const ip = req.ip ?? "";
    const { accessToken, refreshToken } = await createSession({ userId: user._id, role: user.role, userAgent, ip });

    // 4) Set HttpOnly cookies
    setAccessTokenCookie(accessToken, res);
    setRefreshTokenCookie(refreshToken, res);

    // 5) Send response to client
    res.status(200).json({
        status: "success",
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
        }
    });
});

// Rotate refresh token & issue new tokens
// POST method
// Public route /api/v1/users/refresh
export const refresh = catchAsync(async (req, res, next) => {
    // 1) Check for incoming refresh token
    const incomingRefreshToken = req.cookies.refreshToken as string;
    if (!incomingRefreshToken) {
        return next(new AppError("Please sign in again.", 401));
    }

    // 2) Rotate refresh token (revokes old one & creates new session)
    const userAgent = req.get("user-agent") ?? "";
    const ip = req.ip ?? "";
    const { accessToken, refreshToken } = await rotateSession({ refreshToken: incomingRefreshToken, userAgent, ip });

    // 3) Set new HttpOnly cookies
    setAccessTokenCookie(accessToken, res);
    setRefreshTokenCookie(refreshToken, res);

    // 4) Send response to client
    res.status(200).json({ status: "success" });
});

// Sign out user from single session
// POST method
// Protected route /api/v1/users/signout
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

    // 4) Send response to client
    res.status(200).json({ status: "success" });
});

// Sign out user from all session
// POST method
// Protected route /api/v1/users/signoutall
export const signOutAll = catchAsync(async (req, res, next) => {
    // 1) Check for authenticated user id
    const userId = (req as any).user._id;
    if (!userId) return next(new AppError("You are not authorized to perform this action.", 401));

    // 2) Revoke all device sessions
    await revokeAllUserSesions(userId);

    // 3) Clear all authentication cookies
    clearAuthCookies(res);

    // 4) Send response to client
    res.status(200).json({ status: "success" });
});