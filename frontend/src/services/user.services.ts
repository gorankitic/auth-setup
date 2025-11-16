// lib
import api from "@/lib/apiClient";

export const getUserApi = async () => {
    const { data } = await api.get("/users");
    return data.user;
}