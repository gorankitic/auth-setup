// lib
import { useQuery } from "@tanstack/react-query";
// services
import { getUserApi } from "@/services/user.services";

export const useUser = () => {
    const { isPending, data } = useQuery({
        queryKey: ["user"],
        queryFn: getUserApi,
        staleTime: Infinity,
        retry: false,
    });

    return { isPending, user: data };
}