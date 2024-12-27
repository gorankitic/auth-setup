// hooks
import { useQuery } from "@tanstack/react-query";
// service functions
import { getUserApi } from "../services/authApi";

export const useAuth = (options = {}) => {
    const { data: user, isLoading, error } = useQuery({
        queryKey: ["user"],
        queryFn: getUserApi,
        staleTime: Infinity,
        ...options
    });

    return { user, isLoading, error };
}