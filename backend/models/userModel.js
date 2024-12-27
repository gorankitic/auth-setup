const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require('crypto');
const validator = require("validator");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required."]
    },
    email: {
        type: String,
        required: [true, "Email is required."],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email address."]
    },
    password: {
        type: String,
        required: [true, "Password is required."],
        minlength: 8,
        select: false
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    photoUrl: String,
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String,
        index: true
    },
    verificationTokenExpiresAt: Date,
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpiresAt: Date,

}, { timestamps: true });

// Pre-save mongoose document hook/middleware to hash password
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Pre-save mongoose document hook/middleware to hash verification token
userSchema.pre("save", async function (next) {
    if (!this.isModified("verificationToken") || !this.verificationToken) return next();
    this.verificationToken = crypto.createHash('sha256').update(this.verificationToken).digest('hex');
    next();
});

// Pre-save mongoose document hook/middleware to update passwordChangedAt property when reset password happens
userSchema.pre("save", function (next) {
    if (!this.isModified("password") || this.isNew) return next();
    this.passwordChangedAt = Date.now();
    next();
});

// Instance methods (correctPassword, passwordChangedAfterJWTIssued, createPasswordResetToken) 
// assigned to methods object of Mongoose schema (userSchema) are 
// available on all model (User) documents
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.passwordChangedAfterJWTIssued = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        // Password changed after JWT was issued
        return JWTTimestamp < changedTimestamp
    }
    // Password not changed after JWT was issued
    return false;
}

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.passwordResetTokenExpiresAt = Date.now() + 1000 * 60 * 10; // 10 minutes
    return resetToken;
}

const User = mongoose.model("User", userSchema);

module.exports = User;