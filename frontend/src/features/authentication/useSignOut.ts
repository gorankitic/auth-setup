// lib
import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
// services
import { signOutApi } from "@/services/auth.services";

export function useSignOut() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { mutate: signOut, isPending } = useMutation({
        mutationFn: signOutApi,
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: ["user"] });
            navigate("/signin", { replace: true });
        },
    });

    return { signOut, isPending };
}