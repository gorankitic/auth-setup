const { promisify } = require("util");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");

const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

// Authentication middleware to protect routes from unauthenticated access
exports.protect = catchAsync(async (req, res, next) => {
    // 1) Get access token and check if it exist
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
        return next(new AppError("Please sign in to get access.", 401));
    }
    // 2) Verify access token
    const decoded = await promisify(jwt.verify)(accessToken, process.env.JWT_ACCESS_SECRET);
    // 3) Find user based on _id decoded from JWT and check if user still exist
    const user = await User.findById(decoded._id);
    if (!user) {
        return next(new AppError("User owner of this token doesn't exist anymore.", 401));
    }
    // 4) Check if user changed password after the JWT was issued
    if (user.passwordChangedAfterJWTIssued(decoded.iat)) {
        return next(new AppError("You changed password recently. Please log in again.", 401));
    }
    // 5) Grant access to protected route and assign user to request object
    req.user = user;

    next();
});

// Authorization middleware to protect routes from unauthorized access
exports.restrictTo = (...roles) => {
    // roles are ["admin", "user"]
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError("You are not authorized to perform this action.", 403));
        }
        next();
    }
}