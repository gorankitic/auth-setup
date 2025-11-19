// lib
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
// services
import { updatePasswordApi } from "@/services/auth.services";

export function useUpdatePassword() {
    const navigate = useNavigate()

    const { mutate: updatePassword, isPending } = useMutation({
        mutationFn: updatePasswordApi,
        onSuccess: (data) => {
            toast.success(data.message);
            navigate("/signin", { replace: true });
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    return { updatePassword, isPending };
}