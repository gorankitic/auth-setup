// lib
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Send, User } from "lucide-react";
// schemas & types
import { signUpSchema, type SignUpSchema } from "@/lib/schemas/auth.schema";
// hooks
import { useSignup } from "@/features/authentication/useSignUp";
// components
import AuthCard from "@/features/authentication/AuthCard";
import Input from "@/components/Input";
import InputPassword from "@/components/InputPassword";
import Button from "@/components/Button";

const SignUpForm = () => {
    const { signUp, isPending } = useSignup();
    const { register, handleSubmit, formState: { errors } } = useForm<SignUpSchema>({ resolver: zodResolver(signUpSchema) });

    const onSubmit = ({ name, email, password }: SignUpSchema) => {
        signUp({ name, email, password });
    }

    return (
        <AuthCard
            title="Create an Adriatic account"
            backLinkHref="/signin"
            label="Already have an account?"
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-5">
                    <Input
                        {...register("name")}
                        placeholder="Name"
                        disabled={isPending}
                        error={errors.name?.message}
                        icon={User}
                    />
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
                <Button
                    icon={Send}
                    disabled={isPending}
                    className="bg-linear-to-r from-blue-400 to-blue-600 text-white mt-5 w-full"
                >
                    Sign up
                </Button>
            </form>
        </AuthCard>
    )
}

export default SignUpForm;