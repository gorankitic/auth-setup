// api
import api from "@/lib/api/apiClient";
// types
import type { GetUploadSignatureResponse, GetUserResponse, SuccessResponse } from "@/lib/api/apiTypes";
// schemas
import type { UpdateDataSchema, UpdateAvatarSchema } from "@/lib/schemas/user.schema";

export const getUserApi = async () => {
    const { data } = await api.get<GetUserResponse>("/users");
    return data;
}

export const updateDataApi = async ({ name }: UpdateDataSchema) => {
    const { data } = await api.patch<SuccessResponse>("/users/update-data", { name });
    return data;
}

export const updateAvatarApi = async ({ avatarUuid }: UpdateAvatarSchema) => {
    const { data } = await api.patch<SuccessResponse>("/users/update-avatar", { avatarUuid });
    return data;
}

export const getUploadSignature = async () => {
    const { data } = await api.get<GetUploadSignatureResponse>("/users/signature");
    return data;
}