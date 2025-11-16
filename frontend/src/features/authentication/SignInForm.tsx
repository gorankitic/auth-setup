// lib
import { useState } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, KeyRound, Mail, Send } from "lucide-react";
// schema
import { signInSchema, type SignInSchema } from "@/lib/schemas/auth.schema";
// hooks
import { useSignIn } from "@/features/authentication/useSignIn";
// components
import AuthCard from "@/features/authentication/AuthCard";

const SignInForm = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const { signIn, isPending } = useSignIn();
    const { register, handleSubmit, formState: { errors } } = useForm<SignInSchema>({ resolver: zodResolver(signInSchema) });

    const onSubmit = ({ email, password }: SignInSchema) => {
        signIn({ email, password });
    }
    return (
        <AuthCard
            title="Welcome back"
            backLinkHref="/signup"
            label="Don't have an account?"
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-5">
                    <div className="relative">
                        <input
                            {...register("email")}
                            type="email"
                            name="email"
                            placeholder="Email"
                            autoComplete="off"
                            disabled={isPending}
                            className="w-full pl-10 pr-4 py-1 rounded-md bg-white text-gray-700 placeholder-gray-400 border border-gray-300 focus:outline-blue-600"
                        />
                        <Mail className="size-4 absolute left-3 top-[9px] text-gray-500 pointer-events-none" />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>
                    <div className="relative">
                        <input
                            {...register("password")}
                            type={passwordVisible ? "text" : "password"}
                            name="password"
                            placeholder="Password"
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
                </div>
                <div className="flex items-center">
                    <Link to="/forgot-password" className="text-sm mt-2 ml-auto text-blue-500 hover:underline">
                        Forgot password?
                    </Link>
                </div>
                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    disabled={isPending}
                    className="flex gap-2 items-center justify-center mx-auto w-full py-2 px-4 bg-linear-to-r from-blue-400 to-blue-600 text-white rounded-md shadow-md focus:outline-none transition duration-100 mt-5 cursor-pointer"
                >
                    {isPending ? <div className='size-5 animate-spin rounded-full border-b-2 border-white'></div> : (
                        <>
                            <p>Sign in</p>
                            <Send className='size-4 text-blue-50 mt-0.5' />
                        </>
                    )}
                </motion.button>
            </form>
        </AuthCard>
    )
}

export default SignInForm;