// lib
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
// schemas & types
import { resetPasswordSchema, type ResetPasswordSchema } from "@/lib/schemas/auth.schema";
// hooks
import { useResetPassword } from "@/features/authentication/useResetPassword";
// components
import AuthCard from "@/features/authentication/AuthCard";
import Button from "@/components/Button";
import InputPassword from "@/components/InputPassword";

const ResetPasswordForm = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const { resetPassword, isPending } = useResetPassword();
    const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordSchema>({ resolver: zodResolver(resetPasswordSchema) });

    if (!token) return null;

    const onSubmit = (data: ResetPasswordSchema) => {
        resetPassword({ password: data.password, token });
    }

    return (
        <AuthCard
            title="Reset your password"
            backLinkHref="/forgot-password"
            label="Send new reset link"
        >
            <p className="mb-5 -mt-5 text-center text-gray-500 text-sm">Submit your new password</p>
            <form onSubmit={handleSubmit(onSubmit)}>
                <InputPassword
                    {...register("password")}
                    placeholder="Password"
                    disabled={isPending}
                    error={errors.password?.message}
                />
                <Button
                    icon={Send}
                    disabled={isPending}
                    className="bg-linear-to-r from-blue-400 to-blue-600 text-white mt-5 w-full"
                >
                    Reset password
                </Button>
            </form>
        </AuthCard>
    )
}

export default ResetPasswordForm;