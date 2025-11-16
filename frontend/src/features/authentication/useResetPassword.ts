// lib
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
// services
import { resetPasswordApi } from "@/services/auth.services";

export const useResetPassword = () => {
    const navigate = useNavigate();
    const { mutate: resetPassword, isPending } = useMutation({
        mutationFn: resetPasswordApi,
        onSuccess: (data) => {
            toast(data.message);
            navigate("/signin");
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    return { resetPassword, isPending };
}
