// lib
import api from "@/lib/config/apiClient";
import type { UpdateDataSchema, UpdateAvatarSchema } from "@/lib/schemas/user.schema";

export const getUserApi = async () => {
    const { data } = await api.get("/users");
    return data.user;
}

export const updateDataApi = async ({ name }: UpdateDataSchema) => {
    const { data } = await api.patch("/users/update-data", { name });
    return data;
}

export const updateAvatarApi = async ({ avatarUuid }: UpdateAvatarSchema) => {
    const { data } = await api.patch("/users/update-avatar", { avatarUuid });
    return data;
}

export const getUploadSignature = async () => {
    const { data } = await api.get("/users/signature");
    return data;
}