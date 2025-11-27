// lib
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Send, User } from "lucide-react";
// schemas & types
import { updateDataSchema, type UpdateDataSchema } from "@/lib/schemas/user.schema";
// hooks
import { useUser } from "@/features/user/useUser";
import { useUpdateUser } from "@/features/user/useUpdateUser";
// components
import Input from "@/components/Input";
import Button from "@/components/Button";

const UpdateUserDataForm = () => {
    const { user } = useUser();
    const { updateUser, isPending } = useUpdateUser();

    const { register, handleSubmit, formState: { errors } } = useForm<UpdateDataSchema>({
        resolver: zodResolver(updateDataSchema),
        defaultValues: {
            email: user?.email,
            name: user?.name,
        }
    });

    const onSubmit = (data: UpdateDataSchema) => {
        updateUser({ name: data.name });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5">
                <Input
                    {...register("email")}
                    type="email"
                    placeholder="Email"
                    disabled
                    error={errors.email?.message}
                    icon={Mail}
                />
                <Input
                    {...register("name")}
                    placeholder="Name"
                    disabled={isPending}
                    error={errors.name?.message}
                    icon={User}
                />
            </div>
            <Button
                icon={Send}
                disabled={isPending}
                className="bg-linear-to-r from-blue-400 to-blue-600 text-white mt-5 w-52 ml-auto"
            >
                Update profile
            </Button>
        </form>
    )
}

export default UpdateUserDataForm;