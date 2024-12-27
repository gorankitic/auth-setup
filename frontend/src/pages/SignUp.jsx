// hooks
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
// components
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import MiniSpinner from "../components/MiniSpinner";
// react-hook-form
import { useForm } from "react-hook-form";
// yup client-side validation
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
// framer-motion
import { motion } from "framer-motion";
// assets
import { User, Mail, KeyRound, Eye, EyeOff, Send } from "lucide-react";
// service functions
import { signUpApi } from "../services/authApi";

const SignUpSchema = yup.object({
	name: yup.string().required("Name is required.").max(64, "Maximum length is 64 characters."),
	email: yup.string().required("Email is required.").email("Please enter a valid email address."),
	password: yup.string().required("Password is required.").min(8, "Minimum 8 characters required.").max(32, "Maximum length is 32 characters."),
});

const SignUp = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [passwordVisible, setPasswordVisible] = useState(false);
	const { register, handleSubmit, formState: { errors }, setError } = useForm({ resolver: yupResolver(SignUpSchema) });

	const { mutate: signUp, isPending } = useMutation({
		mutationFn: signUpApi,
		onSuccess: (user) => {
			queryClient.setQueryData(["user"], user);
			navigate("/verify-email", { replace: true });
		},
		onError: (error) => {
			setError("root", { type: "server", message: error.message });
		}
	});

	const onSubmit = (data) => {
		signUp(data);
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="max-w-lg w-full bg-gray-200 bg-opacity-50 rounded-lg shadow-md overflow-hidden"
		>
			<div className="py-8 px-5">
				<form onSubmit={handleSubmit(onSubmit)}>
					<h1 className="text-3xl mb-8 font-bold text-center bg-gradient-to-r from-blue-400 to-blue-700 text-transparent bg-clip-text">
						Welcome to Application
					</h1>
					<div className="flex flex-col gap-5">
						<Input
							type="text"
							register={register}
							name="name"
							leftIcon={User}
							placeholder="Name"
							error={errors.name}
							disabled={isPending}
						/>
						<Input
							type="text"
							register={register}
							name="email"
							leftIcon={Mail}
							placeholder="Email"
							error={errors.email}
							disabled={isPending}
						/>
						<Input
							type="password"
							register={register}
							name="password"
							leftIcon={KeyRound}
							rightIcon={passwordVisible ? EyeOff : Eye}
							placeholder="Password"
							error={errors.password}
							passwordVisible={passwordVisible}
							toggleVisibility={() => setPasswordVisible(!passwordVisible)}
							disabled={isPending}
						/>
					</div>
					{errors.root?.type === "server" && <p className="text-red-500 mt-1">{errors.root.message}</p>}
					<motion.button
						whileHover={{ scale: 1.03 }}
						whileTap={{ scale: 0.97 }}
						disabled={isPending}
						className="flex gap-2 items-center justify-center mx-auto w-full mt-8 py-2 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-md shadow-md focus:outline-none transition duration-100"
					>
						{isPending ? <MiniSpinner /> : (
							<>
								<span>Sign up</span>
								<Send className="w-4 h-4 text-white" />
							</>
						)}
					</motion.button>
				</form>
			</div>
			<div className="px-8 py-3 bg-gray-500 bg-opacity-50 flex justify-center">
				<p>Already have an account?{" "}
					<Link to="/signin" className="text-blue-600 hover:underline">
						Sign in
					</Link>
				</p>
			</div>
		</motion.div>
	);
};

export default SignUp;
