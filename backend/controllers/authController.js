const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { promisify } = require("util");
// models
const User = require("../models/userModel");
// error handling
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
// email handling
const sendEmail = require("../utils/emailService");
const { VERIFICATION_EMAIL_TEMPLATE, RESET_PASSWORD_TEMPLATE } = require("../utils/emailTemplates");

// Reusable function for creating and sending JWT in cookie and sending user in response object
const createAndSendToken = (user, statusCode, res) => {
    const { _id } = user;
    // Create (sign) JWT
    const accessToken = jwt.sign({ _id }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN });

    const cookieOptions = {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    };

    // Send JWT in cookie
    res.cookie("accessToken", accessToken, cookieOptions);

    // Send user in response object
    res.status(statusCode).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        photoUrl: user.photoUrl,
        role: user.role,
        isVerified: user.isVerified
    });
}

// Generate random 6 digits verification token
const generateVerificationToken = () => crypto.randomInt(100000, 1000000).toString();

// Sign up user
// POST method
// Public route /api/users/signup
exports.signup = catchAsync(async (req, res, next) => {
    const { name, email, password } = req.body;

    // 1) Generate verification token
    // Verification token is hashed in pre-save mongoose hook in User model
    const verificationToken = generateVerificationToken();
    const verificationTokenExpiresAt = Date.now() + 1000 * 60 * 60 * 24; // 24 hours

    // 2) Create a new user
    // User password is hashed in pre-save mongoose hook in User model
    const user = await User.create({ name, email, password, verificationToken, verificationTokenExpiresAt });
    try {
        // 3) Send verification email to user
        await sendEmail({
            to: user.email,
            subject: "Verification email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationToken}", verificationToken)
        });

        // 4) Create and send JWT in cookie
        createAndSendToken(user, 201, res);
    } catch (error) {
        // Delete the user from the database if sending email fails
        await User.findByIdAndDelete(user._id);
        return next(new AppError("Failed to send verification email. Please try again.", 500));
    }
});

// Sign in user
// POST method
// Public route /api/users/signin
exports.signin = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 1) Check if email and password exists
    if (!email || !password) {
        return next(new AppError("Please provide email and password.", 400));
    }

    // 2) Check if user with this email exist and is password correct?
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError("Incorrect email or password.", 401));
    }
    // 3) Create JWT and send it in cookie and send user object in response
    createAndSendToken(user, 200, res);
});

// Sign out user
// GET method
// Protected route /api/users/signout
exports.signout = catchAsync(async (req, res, next) => {
    res.clearCookie("accessToken");
    res.status(200).json({ status: 'success', message: "User signed out." });
});

// Email token verification
// POST method
// Protected route /api/users/verifyEmail
exports.verifyEmail = catchAsync(async (req, res, next) => {
    const { verificationToken } = req.body;

    // 1) Hash verification token
    const hashedVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');

    // 2) Find user based on verification token and verificationTokenExpiresAt
    const user = await User.findOne({
        verificationToken: hashedVerificationToken,
        verificationTokenExpiresAt: { $gt: Date.now() }
    });
    if (!user) {
        return next(new AppError("Invalid or expired verification code.", 400));
    }

    // 3) Update user verification
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;

    await user.save();

    res.status(200).json({ status: "success" });
});

// Send new verification token
// GET method
// Protected route /api/users/newVerification
exports.createNewVerificationToken = catchAsync(async (req, res, next) => {
    // 1) Generate verification token
    // Verification token is hashed in pre-save mongoose hook in User model
    const verificationToken = generateVerificationToken();
    const verificationTokenExpiresAt = Date.now() + 1000 * 60 * 60 * 24; // 24 hours

    const user = await User.findById(req.user._id);

    // 2) Update user document
    user.verificationToken = verificationToken;
    user.verificationTokenExpiresAt = verificationTokenExpiresAt;
    await user.save();

    try {
        // 3) Send verification email to user
        await sendEmail({
            to: user.email,
            subject: "Verification email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationToken}", verificationToken)
        });

        res.status(200).json({
            status: "success",
            message: "Verification code sent to your email."
        });
    } catch (error) {
        return next(new AppError("Failed to send verification email. Please try again.", 500));
    }
});

// User forgot password
// POST method
// Public route /api/users/forgotPassword
exports.forgotPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError("There is no user with that email address.", 404));
    }

    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save();

    // 3) Send reset token to user's email
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    try {
        // Send verification email to user
        await sendEmail({
            to: user.email,
            subject: "Reset password email",
            html: RESET_PASSWORD_TEMPLATE.replace("{resetUrl}", resetUrl)
        });
    } catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpiresAt = undefined;
        await user.save();
        return next(new AppError("Failed to send reset password email. Please try again.", 500));
    }

    res.status(200).json({
        status: "success",
        message: "Reset password link has been sent to your email."
    });
});

// Reset password
// PATCH method
// Protected route /api/users/resetPassword/:token
exports.resetPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on the token
    const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetTokenExpiresAt: { $gt: Date.now() }
    });
    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
        return next(new AppError("Reset link is invalid or has expired.", 400));
    }
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiresAt = undefined;
    await user.save();

    // 3) Update changedPasswordAt property (using mongoose pre-save middleware in User model)

    // 4) Sign in user, send JWT
    createAndSendToken(user, 200, res);
});

// Update password
// PATCH method
// Protected route /api/users/updatePassword
exports.updatePassword = catchAsync(async (req, res, next) => {
    // 1) Get user from collection
    const user = await User.findById(req.user._id).select("+password");

    // 2) Check if POSTed current password is correct
    if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
        return next(new AppError("Incorrect current password.", 401));
    }

    // 3) Update password
    user.password = req.body.password;
    await user.save();

    // 4) Sign in user, send JWT
    createAndSendToken(user, 200, res);
});