// lib
import api from "@/lib/config/apiClient";

export const getSessionsApi = async () => {
    const { data } = await api.get("/sessions");
    return data;
};