import { Document, Types } from "mongoose";

export interface IUser extends Document {
    _id: Types.ObjectId,
    name: string;
    email: string;
    password: string;
    role: "admin" | "user";
    photoUrl?: string;
    isVerified: boolean;
    verificationToken?: string;
    verificationTokenExpiresAt?: Date;
    passwordChangedAt?: Date;
    passwordResetToken?: string;
    passwordResetTokenExpiresAt?: Date;
    correctPassword(candidatePassword: string, userPassword: string): Promise<boolean>;
    passwordChangedAfterJWTIssued(jwtIssuedAt: number): boolean
}
