// lib
import api from "@/lib/apiClient";

export const getSessionsApi = async () => {
    const { data } = await api.get("/sessions");
    return data;
};