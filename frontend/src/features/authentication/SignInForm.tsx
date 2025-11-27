// lib
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Send } from "lucide-react";
// schemas & types
import { signInSchema, type SignInSchema } from "@/lib/schemas/auth.schema";
// hooks
import { useSignIn } from "@/features/authentication/useSignIn";
// components
import AuthCard from "@/features/authentication/AuthCard";
import Button from "@/components/Button";
import Input from "@/components/Input";
import InputPassword from "@/components/InputPassword";

const SignInForm = () => {
    const { signIn, isPending } = useSignIn();
    const { register, handleSubmit, formState: { errors } } = useForm<SignInSchema>({ resolver: zodResolver(signInSchema) });

    const onSubmit = ({ email, password }: SignInSchema) => {
        signIn({ email, password });
    }
    return (
        <AuthCard
            title="Welcome back to Adriatic"
            backLinkHref="/signup"
            label="Don't have an account?"
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-5">
                    <Input
                        {...register("email")}
                        type="email"
                        placeholder="Email"
                        disabled={isPending}
                        error={errors.email?.message}
                        icon={Mail}
                    />
                    <InputPassword
                        {...register("password")}
                        placeholder="Password"
                        disabled={isPending}
                        error={errors.password?.message}
                    />
                </div>
                <div className="flex items-center">
                    <Link to="/forgot-password" className="text-sm mt-2 ml-auto text-blue-500 hover:underline">
                        Forgot password?
                    </Link>
                </div>
                <Button
                    icon={Send}
                    disabled={isPending}
                    className="bg-linear-to-r from-blue-400 to-blue-600 text-white mt-5 w-full"
                >
                    Sign in
                </Button>
            </form>
        </AuthCard>
    )
}

export default SignInForm;