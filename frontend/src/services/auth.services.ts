// lib
import api from "@/lib/apiClient";
// types
import type { ForgotPasswordSchema, SignInSchema, SignUpSchema } from "@/lib/schemas/auth.schema";

export const signUpApi = async ({ name, email, password }: SignUpSchema) => {
    const { data } = await api.post("/auth/signup", { name, email, password });
    return data;
}

export const signInApi = async ({ email, password }: SignInSchema) => {
    await api.post("/auth/signin", { email, password });
}

export const signOutApi = async () => {
    await api.post("/auth/signout");
}

export const forgotPasswordApi = async ({ email }: ForgotPasswordSchema) => {
    const { data } = await api.post("/auth/forgot-password", { email });
    return data;
}

export const resetPasswordApi = async ({ password, token }: { password: string; token: string }) => {
    const { data } = await api.patch(`/auth/reset-password?token=${token}`, { password });
    return data;
}