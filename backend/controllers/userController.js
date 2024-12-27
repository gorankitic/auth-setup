const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const filterObject = (obj, ...allowedFields) => {
    const newObj = {};
    // Object.keys() returns array of field names of obj
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
}

// Get signed in user
// GET method
// Protected route /api/users
exports.getUser = catchAsync(async (req, res, next) => {
    const userId = req.user._id;

    const user = await User.findById(userId);

    res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        photoUrl: user.photoUrl,
        role: user.role,
        isVerified: user.isVerified
    });
});

// Update user data
// PATCH method
// Protected route /api/users/updateMe
exports.updateMe = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.body.password) {
        return next(new AppError("This route is not for password update. Please use /api/users/updatePassword.", 400));
    }
    // 2) Filtered out unwanted field names that are not allowed to be updated
    const filteredBody = filterObject(req.body, "name", "email");

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, { new: true, runValidators: true });

    res.status(200).json({
        status: "success",
        user: updatedUser
    });
});

// Delete user account
// DELETE method
// Protected route /api/users/deleteMe
exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndDelete(req.user._id);
    res.clearCookie('jwt', { httpOnly: true });
    res.status(204).end();
});