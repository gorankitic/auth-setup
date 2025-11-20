// lib
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
// services
import { updateDataApi } from "@/services/user.services";

export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    const { mutate: updateUser, isPending } = useMutation({
        mutationFn: updateDataApi,
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ["user"] });
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    return { updateUser, isPending };
}