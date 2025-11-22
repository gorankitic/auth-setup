// modules
import { generateSecureSignature } from "@uploadcare/signed-uploads";
// utils
import { catchAsync } from "src/lib/utils/catchAsync";
// models
import User from "src/models/user.model";
// services
import { updateUserAvatar, updateUserData } from "src/services/user.services";
// config
import { UPLOADCARE_SIGNATURE_LIFETIME } from "src/config/uploadcare";
// constants
import { UPLOADCARE_PUBLIC_KEY, UPLOADCARE_SECRET_KEY } from "src/constants/env";

// Get signed in user
// GET method
// Protected route /api/v1/users
export const getUser = catchAsync(async (req, res, next) => {
    const userId = req.user._id;

    const user = (await User.findById(userId))!;

    res.status(200).json({
        status: "success",
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            avatarUuid: user.avatarUuid,
            role: user.role,
            isVerified: user.isVerified
        }
    });
});

// Update signed in user data
// PATCH method
// Protected route /api/v1/users/update-data
export const updateData = catchAsync(async (req, res, next) => {
    // 1) Request validation is done in the validateSchema middleware
    // 2) Handle business logic, call service to update user data
    await updateUserData(req.user._id, req.body);
    // 3) Send response to the client
    res.status(201).json({
        status: "success",
        message: "Your account has been successfully updated."
    });
});

// Update signed in user avatar
// PATCH method
// Protected route /api/v1/users/update-avatar
export const updateAvatar = catchAsync(async (req, res, next) => {
    const { avatarUuid } = req.body;
    // 1) Request validation is done in the validateSchema middleware
    // 2) Handle business logic, call service to update user avatarUuid
    await updateUserAvatar(req.user._id, avatarUuid);
    // 3) Send response to the client
    res.status(201).json({
        status: "success",
        message: "Your avatar has been successfully updated."
    });
});

// Get signature for upload
// GET method
// Protected route /api/v1/users/signature
export const getUploadcareSignature = catchAsync((req, res) => {
    const secretKey = UPLOADCARE_SECRET_KEY;
    const publicKey = UPLOADCARE_PUBLIC_KEY;

    const { secureSignature, secureExpire } = generateSecureSignature(secretKey, { lifetime: UPLOADCARE_SIGNATURE_LIFETIME });

    res.status(200).json({
        secureSignature,
        secureExpire,
        publicKey,
    });
});
