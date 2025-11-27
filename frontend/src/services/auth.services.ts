// api
import api from "@/lib/api/apiClient";
// types
import type { SuccessResponse } from "@/lib/api/apiTypes";
// schemas
import type { ForgotPasswordSchema, SignInSchema, SignUpSchema, UpdatePasswordSchema } from "@/lib/schemas/auth.schema";

export const signUpApi = async ({ name, email, password }: SignUpSchema) => {
    const { data } = await api.post<SuccessResponse>("/auth/signup", { name, email, password });
    return data;
}

export const signInApi = async ({ email, password }: SignInSchema) => {
    await api.post<SuccessResponse>("/auth/signin", { email, password });
}

export const signOutApi = async () => {
    await api.post<SuccessResponse>("/auth/signout");
}

export const signOutAllApi = async () => {
    await api.post<SuccessResponse>("/auth/signoutall");
}

export const forgotPasswordApi = async ({ email }: ForgotPasswordSchema) => {
    const { data } = await api.post<SuccessResponse>("/auth/forgot-password", { email });
    return data;
}

export const resetPasswordApi = async ({ password, token }: { password: string; token: string }) => {
    const { data } = await api.patch<SuccessResponse>(`/auth/reset-password?token=${token}`, { password });
    return data;
}

export const updatePasswordApi = async ({ currentPassword, newPassword }: UpdatePasswordSchema) => {
    const { data } = await api.patch<SuccessResponse>(`/auth/update-password`, { currentPassword, newPassword });
    return data;
}