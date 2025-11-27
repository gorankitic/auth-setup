// lib
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
// services
import { forgotPasswordApi } from "@/services/auth.services";
// types
import type { NormalizedError } from "@/lib/api/apiTypes";

export const useForgotPassword = () => {
    const { mutate: forgotPassword, isPending } = useMutation({
        mutationFn: forgotPasswordApi,
        onSuccess: (data) => {
            toast.success(data.message);
        },
        onError: (error: NormalizedError) => {
            toast.error(error.message);
        }
    });

    return { forgotPassword, isPending };
}
