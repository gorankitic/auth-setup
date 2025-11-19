// lib
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, KeyRound, Send } from "lucide-react";
// schemas & types
import { updatePasswordSchema, type UpdatePasswordSchema } from "@/lib/schemas/auth.schema";
// hooks
import { useUpdatePassword } from "@/features/authentication/useUpdatePassword";


const UpdatePasswordForm = () => {
    const { updatePassword, isPending } = useUpdatePassword();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [newPasswordVisible, setNewPasswordVisible] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<UpdatePasswordSchema>({ resolver: zodResolver(updatePasswordSchema) });

    const onSubmit = (data: UpdatePasswordSchema) => {
        updatePassword(data);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5">
                <div className="relative">
                    <input
                        {...register("currentPassword")}
                        type={passwordVisible ? "text" : "password"}
                        name="currentPassword"
                        placeholder="Current password"
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
                    {errors.currentPassword && <p className="text-red-500 text-sm mt-1">{errors.currentPassword.message}</p>}
                </div>
                <div className="relative">
                    <input
                        {...register("newPassword")}
                        type={newPasswordVisible ? "text" : "password"}
                        name="newPassword"
                        placeholder="New password"
                        disabled={isPending}
                        className="w-full pl-10 pr-4 py-1 rounded-md bg-white text-gray-700 placeholder-gray-400 border border-gray-300 focus:outline-blue-600"
                    />
                    <KeyRound className="size-4 absolute left-3 top-[9px] text-gray-500 pointer-events-none" />
                    {!newPasswordVisible ? (
                        <Eye
                            onClick={() => setNewPasswordVisible(prev => !prev)}
                            className="size-4 absolute right-3 top-[9px] text-gray-500 cursor-pointer"
                        />) : (
                        <EyeOff
                            onClick={() => setNewPasswordVisible(prev => !prev)}
                            className="size-4 absolute right-3 top-[9px] text-gray-500 cursor-pointer"
                        />
                    )}
                    {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>}
                </div>
            </div>
            <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                disabled={isPending}
                className="flex gap-2 items-center justify-center ml-auto w-52 p-2 bg-linear-to-r from-blue-400 to-blue-600 text-white text-sm rounded-md shadow-md focus:outline-none transition duration-100 mt-5 cursor-pointer"
            >
                {isPending ? <div className='size-5 animate-spin rounded-full border-b-2 border-white'></div> : (
                    <>
                        <span>Update password</span>
                        <Send className='size-4 text-blue-50' />
                    </>
                )}
            </motion.button>
        </form>
    )
}

export default UpdatePasswordForm;