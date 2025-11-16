// lib
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
// services
import { forgotPasswordApi } from "@/services/auth.services";

export const useForgotPassword = () => {
    const { mutate: forgotPassword, isPending } = useMutation({
        mutationFn: forgotPasswordApi,
        onSuccess: (data) => {
            toast.success(data.message);
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    return { forgotPassword, isPending };
}
