// lib
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Send } from "lucide-react";
// schemas & types
import { forgotPasswordSchema, type ForgotPasswordSchema } from "@/lib/schemas/auth.schema";
// hooks
import { useForgotPassword } from "@/features/authentication/useForgotPassword";
// components
import AuthCard from "@/features/authentication/AuthCard";
import Input from "@/components/Input";
import Button from "@/components/Button";

const ForgotPasswordForm = () => {
    const { forgotPassword, isPending } = useForgotPassword();
    const { register, handleSubmit, formState: { errors }, reset } = useForm<ForgotPasswordSchema>({ resolver: zodResolver(forgotPasswordSchema) });

    const onSubmit = (data: ForgotPasswordSchema) => {
        forgotPassword(data, { onSuccess: () => reset() });
    }

    return (
        <AuthCard
            title="Forgot password?"
            backLinkHref="/signin"
            label="Get back to sign in"
        >
            <p className="mb-5 -mt-5 text-center text-gray-600 text-sm">Submit your email address and we will send you a reset password link</p>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col">
                    <Input
                        {...register("email")}
                        type="email"
                        placeholder="Email"
                        disabled={isPending}
                        error={errors.email?.message}
                        icon={Mail}
                    />
                </div>
                <Button
                    icon={Send}
                    disabled={isPending}
                    className="bg-linear-to-r from-blue-400 to-blue-600 text-white mt-5 w-full"
                >
                    Send reset link
                </Button>
            </form>
        </AuthCard>
    )
}

export default ForgotPasswordForm;