// lib
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, KeyRound, Send } from "lucide-react";
// schemas & types
import { resetPasswordSchema, type ResetPasswordSchema } from "@/lib/schemas/auth.schema";
// components
import AuthCard from "@/features/authentication/AuthCard";
// hooks
import { useResetPassword } from "@/features/authentication/useResetPassword";

const ResetPasswordForm = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const { resetPassword, isPending } = useResetPassword();
    const [passwordVisible, setPasswordVisible] = useState(false);
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
                <div className="relative">
                    <input
                        {...register("password")}
                        type={passwordVisible ? "text" : "password"}
                        name="password"
                        placeholder="New password"
                        disabled={isPending}
                        className="w-full pl-10 pr-4 py-1 rounded-md bg-white text-gray-700 placeholder-gray-400 border border-gray-300 focus:outline-blue-600"
                    />
                    <KeyRound className="size-4 absolute left-3 top-[9px] text-gray-500 pointer-events-none" />
                    {!passwordVisible ? (
                        <Eye
                            onClick={() => setPasswordVisible(prev => !prev)}
                            className="size-4 absolute right-3 top-[9px] text-gray-500 cursor-pointer"
                        />) : (
                        <EyeOff
                            onClick={() => setPasswordVisible(prev => !prev)}
                            className="size-4 absolute right-3 top-[9px] text-gray-500 cursor-pointer"
                        />
                    )}
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                </div>
                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    disabled={isPending}
                    className="flex gap-2 items-center justify-center mx-auto w-full py-2 px-4 bg-linear-to-r from-blue-400 to-blue-600 text-white rounded-md shadow-md focus:outline-none transition duration-100 mt-5 cursor-pointer"
                >
                    {isPending ? <div className='size-5 animate-spin rounded-full border-b-2 border-white'></div> : (
                        <>
                            <span>Reset password</span>
                            <Send className='size-4 text-blue-50' />
                        </>
                    )}
                </motion.button>
            </form>
        </AuthCard>
    )
}

export default ResetPasswordForm;