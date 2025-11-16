// lib
import api from "@/lib/apiClient";
// types
import type { SignInSchema, SignUpSchema } from "@/lib/schemas/auth.schema";

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

export const verificationApi = async (verificationToken: string) => {
    await api.post(`/auth/verification?token=${verificationToken}`);
}