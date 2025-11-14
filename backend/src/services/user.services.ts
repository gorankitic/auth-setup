// models
import User from "src/models/user.model.ts";
// schemas
import { UpdateUserSchema } from "../lib/schemas/user.schemas.ts";

export const updateUserData = async (id: string, data: UpdateUserSchema) => {
    const updatedUser = await User.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });

    return updatedUser;
};