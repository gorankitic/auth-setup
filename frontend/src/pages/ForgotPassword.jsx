// hooks
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
// react-hook-form
import { useForm } from "react-hook-form";
// yup client-side validation
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
// framer-motion
import { motion } from "framer-motion";
// components
import { Link } from "react-router-dom";
import Input from "../components/Input";
import MiniSpinner from "../components/MiniSpinner";
// assets
import { Mail, Send, ArrowLeft } from "lucide-react";
// service functions
import { forgotPasswordApi } from "../services/authApi";

const ForgotPasswordSchema = yup.object({
    email: yup.string().required("Email is required.").email("Please enter a valid email address.")
});

const ForgotPassword = () => {
    const [message, setMessage] = useState("");
    const { register, handleSubmit, formState: { errors }, setError } = useForm({ resolver: yupResolver(ForgotPasswordSchema) });

    const { mutate: forgotPassword, isPending } = useMutation({
        mutationFn: forgotPasswordApi,
        onSuccess: (data) => {
            setMessage(data.message);
        },
        onError: (error) => {
            setError("root", { type: "server", message: error.message });
        }
    });

    const onSubmit = (data) => {
        forgotPassword(data);
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg w-full bg-gray-200 bg-opacity-50 rounded-lg shadow-md overflow-hidden"
        >
            <div className="py-8 px-5">
                <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-400 to-blue-700 text-transparent bg-clip-text">
                    Forgot password
                </h1>
                {!message ? (
                    <>
                        <p className="text-center text-gray-500 text-sm">Submit your email address and we will send you a reset password link</p>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="my-8">
                                <Input
                                    type="text"
                                    register={register}
                                    name="email"
                                    leftIcon={Mail}
                                    placeholder="Email"
                                    error={errors.email}
                                    disabled={isPending}
                                />
                                {errors.root?.type === "server" && <p className="text-red-500 mt-1">{errors.root.message}</p>}
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                disabled={isPending}
                                className="flex gap-2 items-center justify-center mx-auto w-full mt-2 py-2 px-4 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-md shadow-md focus:outline-none transition duration-100"
                            >
                                {isPending ? <MiniSpinner /> : (
                                    <>
                                        <span>Send reset link</span>
                                        <Send className="w-4 h-4 text-white" />
                                    </>
                                )}
                            </motion.button>
                        </form>
                    </>
                ) : (
                    <div className='text-center'>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            className="w-14 h-14 border-2 border-gray-500 rounded-full flex items-center justify-center mx-auto my-4"
                        >
                            <Mail className="h-8 w-8 text-gray-500 stroke-[1.5px]" />
                        </motion.div>
                        <p className='text-gray-500 text-lg'>{message}</p>
                    </div>
                )}
            </div>
            <div className="px-5 py-3 bg-gray-500 bg-opacity-50 text-center">
                <div className="flex justify-center items-center gap-1">
                    <ArrowLeft className="w-4 h-4" />
                    <p>Get back to</p>
                    <Link to="/signin" className="text-blue-600 hover:underline">
                        <span>sign in</span>
                    </Link>
                </div>
            </div>
        </motion.div>
    )
}
export default ForgotPassword;