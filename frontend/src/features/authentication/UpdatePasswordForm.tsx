// lib
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
// schemas & types
import { updatePasswordSchema, type UpdatePasswordSchema } from "@/lib/schemas/auth.schema";
// hooks
import { useUpdatePassword } from "@/features/authentication/useUpdatePassword";
// components
import InputPassword from "@/components/InputPassword";
import Button from "@/components/Button";

const UpdatePasswordForm = () => {
    const { updatePassword, isPending } = useUpdatePassword();
    const { register, handleSubmit, formState: { errors } } = useForm<UpdatePasswordSchema>({ resolver: zodResolver(updatePasswordSchema) });

    const onSubmit = (data: UpdatePasswordSchema) => {
        updatePassword(data);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5">
                <InputPassword
                    {...register("currentPassword")}
                    placeholder="Current password"
                    disabled={isPending}
                    error={errors.currentPassword?.message}
                />
                <InputPassword
                    {...register("newPassword")}
                    placeholder="New password"
                    disabled={isPending}
                    error={errors.newPassword?.message}
                />
            </div>
            <Button
                icon={Send}
                disabled={isPending}
                className="bg-linear-to-r from-blue-400 to-blue-600 text-white mt-5 w-52 ml-auto"
            >
                Update password
            </Button>
        </form>
    )
}

export default UpdatePasswordForm;