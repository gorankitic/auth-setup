// utils
import { AppError } from "src/lib/utils/AppError.ts";
import { generateToken, hash } from "src/lib/utils/crypto.ts";
// schemas & types
import { SigninSchema, SignupSchema } from "src/lib/schemas/auth.schemas.ts";
// email
import { sendEmail } from "src/lib/email/sendEmail.ts";
import { RESET_PASSWORD_TEMPLATE } from "src/lib/email/email.templates.ts";
// models
import User from "src/models/user.model.ts";
// constants
import { CLIENT_ORIGIN } from "src/constants/env.ts";
// services
import { revokeAllUserSesions } from "./session.services.ts";

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
        throw new AppError("Incorrect email or password.", 400);
    }

    if (!user.isVerified) {
        throw new AppError("Please verify your email before signing in.", 400);
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
    // Don't leak too much details, instead 404 error "There is no user with that email.", just return
    // User will see message: "If an account with that email exists, we sent instructions."
    if (!user) return;

    const resetPasswordToken = generateToken(32);
    const resetPasswordTokenHash = hash(resetPasswordToken);
    user.resetPasswordToken = resetPasswordTokenHash;
    user.resetPasswordTokenExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    const resetPasswordUrl = `${CLIENT_ORIGIN}/reset-password?token=${resetPasswordToken}`;
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
        throw new AppError("Incorrect current password.", 400);
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