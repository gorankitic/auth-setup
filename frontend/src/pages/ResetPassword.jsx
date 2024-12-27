// hooks
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Send, ArrowLeft, KeyRound, EyeOff, Eye } from "lucide-react";
// service functions
import { resetPasswordApi } from "../services/authApi";

const ResetPasswordSchema = yup.object({
    password: yup.string().required("Password is required.").min(8, "Minimum 8 characters required.").max(32, "Maximum length is 32 characters."),
});

const ResetPassword = () => {
    const { resetToken } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const { register, handleSubmit, formState: { errors }, setError } = useForm({ resolver: yupResolver(ResetPasswordSchema) });

    const { mutate: resetPassword, isPending } = useMutation({
        mutationFn: resetPasswordApi,
        onSuccess: (user) => {
            queryClient.setQueryData(["user"], user);
            if (!user.isVerified) {
                navigate("/verify-email")
            } else {
                navigate("/", { replace: true });
            }
        },
        onError: (error) => {
            setError("root", { type: "server", message: error.message });
        }
    });

    const onSubmit = (data) => {
        resetPassword({ data, resetToken });
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
                    Reset your password
                </h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="my-8">
                        <Input
                            type="password"
                            register={register}
                            name="password"
                            leftIcon={KeyRound}
                            rightIcon={passwordVisible ? EyeOff : Eye}
                            placeholder="Set new password"
                            error={errors.password}
                            passwordVisible={passwordVisible}
                            toggleVisibility={() => setPasswordVisible(!passwordVisible)}
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
                                <span>Reset password</span>
                                <Send className="w-4 h-4 text-white" />
                            </>
                        )}
                    </motion.button>
                </form>
            </div>
            <div className="px-8 py-3 bg-gray-500 bg-opacity-50 text-white flex justify-center items-center gap-1">
                <ArrowLeft className="w-4 h-4" />
                <Link to="/forgot-password" className="hover:underline">
                    <span>Send new reset link</span>
                </Link>
            </div>
        </motion.div>
    )
}
export default ResetPassword;