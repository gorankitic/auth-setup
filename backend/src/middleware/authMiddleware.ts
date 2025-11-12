// utils
import { AppError } from "src/lib/utils/AppError.ts";
import { catchAsync } from "src/lib/utils/catchAsync.ts";
import { verifyJWT } from "src/lib/utils/jwt.ts";
// models
import User from "src/models/user.model.ts";
import Session from "src/models/session.model.ts";

// Authentication middleware to protect routes from unauthenticated access
export const protect = catchAsync(async (req, res, next) => {
    // 1) Get access token and check if it exist
    const accessToken = req.cookies.accessToken as string;
    if (!accessToken) {
        return next(new AppError("Please sign in to get access.", 401));
    }
    // 2) Verify access token
    const payload = verifyJWT(accessToken);

    // 3) Check if session exists and is valid
    const session = await Session.findById(payload.sessionId);
    if (!session || session.revokedAt || session.expiresAt < new Date()) {
        return next(new AppError("Session has expired or been revoked. Please sign in again.", 401));
    }

    // 4) Find user based on _id decoded from JWT and check if user still exist
    const user = await User.findById(payload.sub);
    if (!user) {
        return next(new AppError("User owner of this token doesn't exist anymore.", 401));
    }
    // 5) Check if user changed password after the JWT was issued
    if (payload.iat && user.passwordChangedAfterJWTIssued(payload.iat)) {
        return next(new AppError("You changed password recently. Please sign in again.", 401));
    }
    // 6) Grant access to protected route and assign user to request object
    (req as any).user = user;
    (req as any).session = session;

    next();
});