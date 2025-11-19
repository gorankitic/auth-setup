// utils
import { catchAsync } from "src/lib/utils/catchAsync.ts";
// models
import User from "src/models/user.model.ts";
// services
import { updateUserData } from "src/services/user.services.ts";

// Get signed in user
// GET method
// Protected route /api/v1/users
export const getUser = catchAsync(async (req, res, next) => {
    const userId = (req as any).user._id;

    const user = (await User.findById(userId))!;

    res.status(200).json({
        status: "success",
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            photoUrl: user.photoUrl,
            role: user.role,
            isVerified: user.isVerified
        }
    });
});

// Update signed in user
// PATCH method
// Protected route /api/v1/users/update
export const updateUser = catchAsync(async (req, res, next) => {
    // 1) Request validation is done in the validateSchema middleware
    // 2) Handle business logic, call service to update user document
    const updatedUser = (await updateUserData((req as any).user._id, req.body))!;
    // 3) Send response to the client
    res.status(201).json({
        status: "success",
        user: {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            isVerified: updatedUser.isVerified,
            photoUrl: updatedUser.photoUrl,
        }
    });
});