// api
import api from "@/lib/api/apiClient";
// types
import type { GetSessionsResponse } from "@/lib/api/apiTypes";

export const getSessionsApi = async () => {
    const { data } = await api.get<GetSessionsResponse>("/sessions");
    return data;
};