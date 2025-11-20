// modules
import { deleteFile } from "@uploadcare/rest-client";
// config
import { uploadcareAuth } from "src/config/uploadcare.ts";
// models
import User from "src/models/user.model.ts";
// schemas
import { UpdateDataSchema } from "../lib/schemas/user.schemas.ts";

export const updateUserData = async (id: string, data: UpdateDataSchema) => {
    const updatedUser = await User.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });

    return updatedUser;
};

export const updateUserAvatar = async (userId: string, avatarUuid: string) => {
    // 1) Get user document from collection
    const user = (await User.findById(userId))!;

    // 2) If user already had an avatar, delete it from Uploadcare
    if (user.avatarUuid && user.avatarUuid !== avatarUuid) {
        await deleteFile({ uuid: user.avatarUuid }, { authSchema: uploadcareAuth });
    }

    // 3) Update user avatarUuid field
    user.avatarUuid = avatarUuid;
    await user.save();

    // 4) Return data
    return user;
}