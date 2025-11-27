// lib
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
// services
import { updatePasswordApi } from "@/services/auth.services";
// types
import type { NormalizedError } from "@/lib/api/apiTypes";

export function useUpdatePassword() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { mutate: updatePassword, isPending } = useMutation({
        mutationFn: updatePasswordApi,
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.removeQueries({ queryKey: ["user"] });
            queryClient.removeQueries({ queryKey: ["sessions"] });
            navigate("/signin", { replace: true });
        },
        onError: (error: NormalizedError) => {
            toast.error(error.message);
        }
    });

    return { updatePassword, isPending };
}