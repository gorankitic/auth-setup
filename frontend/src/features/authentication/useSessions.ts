// lib
import { useQuery } from "@tanstack/react-query";
// services
import { getSessionsApi } from "@/services/session.services";

export const useSessions = () => {
    const { isPending, data } = useQuery({
        queryKey: ["sessions"],
        queryFn: getSessionsApi,
    });

    return { isPending, sessions: data?.sessions, currentSessionId: data?.currentSessionId };
}