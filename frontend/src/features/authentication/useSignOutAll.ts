// lib
import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
// services
import { signOutAllApi } from "@/services/auth.services";

export function useSignOutAll() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { mutate: signOutAll, isPending: isSigningOutAll } = useMutation({
        mutationFn: signOutAllApi,
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: ["user"] });
            queryClient.removeQueries({ queryKey: ["sessions"] });
            navigate("/signin", { replace: true });
        },
    });

    return { signOutAll, isSigningOutAll };
}