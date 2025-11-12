// modules
import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
// types
import { IUser } from "src/lib/types/user.types.ts";

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: [true, "Name is required."]
    },
    email: {
        type: String,
        required: [true, "Email is required."],
        unique: true,
        lowercase: true,
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
        index: true,
        select: false
    },
    verificationTokenExpiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 60 * 60 * 1000),
        index: { expires: 0 }
    },
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

// Pre-save mongoose document hook/middleware to hash verification code
userSchema.pre("save", async function (next) {
    if (!this.isModified("verificationToken") || !this.verificationToken) return next();
    this.verificationToken = crypto.createHash('sha256').update(this.verificationToken).digest('hex');
    next();
});

// Instance methods (correctPassword, passwordChangedAfterJWTIssued, createPasswordResetToken) 
// assigned to methods object of Mongoose schema (userSchema) are 
// available on all model (User) documents
userSchema.methods.correctPassword = async function (candidatePassword: string, userPassword: string) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.passwordChangedAfterJWTIssued = function (jwtIssuedAt: number) {
    if (!this.passwordChangedAt) return false;
    if (this.passwordChangedAt) {
        const passwordChangedAtTimestamp = Math.floor(this.passwordChangedAt.getTime() / 1000);
        // Password changed after JWT was issued
        return jwtIssuedAt < passwordChangedAtTimestamp;
    }
}

const User = mongoose.model<IUser>("User", userSchema);

export default User;