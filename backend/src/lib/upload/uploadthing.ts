// modules
import { createUploadthing, type FileRouter } from "uploadthing/express";
// models
import User from "src/models/user.model.ts";
// utils
import { AppError } from "../utils/AppError.ts";

const f = createUploadthing();

const auth = (req: any) => {
    if (!req.user) throw new AppError("Please sign in to upload image.", 401);
    return { userId: req.user._id }
}

export const uploadRouter = {
    profilePhoto:
        f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
            .middleware(async ({ req }) => {
                const user = auth(req);
                return { userId: user.userId }
            })
            .onUploadComplete(async ({ metadata, file }) => {
                const photoUrl = file.ufsUrl;
                await User.findByIdAndUpdate(metadata.userId, { photoUrl }, { new: true })
                return { photoUrl }
            })

} satisfies FileRouter;

export type uploadRouter = typeof uploadRouter;