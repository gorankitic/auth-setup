// lib
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
// services
import { signUpApi } from "@/services/auth.services";
// types
import type { NormalizedError } from "@/lib/api/apiTypes";

export function useSignup() {
    const navigate = useNavigate();

    const { mutate: signUp, isPending } = useMutation({
        mutationFn: signUpApi,
        onSuccess: (data) => {
            toast.success(data.message);
            navigate("/signin");
        },
        onError: (error: NormalizedError) => {
            toast.error(error.message);
        }
    });

    return { signUp, isPending };
}