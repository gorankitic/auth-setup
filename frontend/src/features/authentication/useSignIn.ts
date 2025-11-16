// lib
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
// services
import { signInApi } from "@/services/auth.services";

export const useSignIn = () => {
    const navigate = useNavigate();

    const { mutate: signIn, isPending } = useMutation({
        mutationFn: signInApi,
        onSuccess: () => navigate("/", { replace: true }),
        onError: (error) => toast.error(error.message),
    });

    return { signIn, isPending };
}