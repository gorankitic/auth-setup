// lib
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
// services
import { updateAvatarApi } from "@/services/user.services";

export const useUpdateAvatar = () => {
    const queryClient = useQueryClient();

    const { mutate: updateAvatar } = useMutation({
        mutationFn: updateAvatarApi,
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ["user"] });
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    return { updateAvatar };
};
