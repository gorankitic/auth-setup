// lib
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Mail, Send, User } from "lucide-react";
// schemas & types
import { updateDataSchema, type UpdateDataSchema } from "@/lib/schemas/user.schema";
// hooks
import { useUser } from "@/features/user/useUser";
import { useUpdateUser } from "@/features/user/useUpdateUser";


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
                <div className="relative">
                    <input
                        {...register("email")}
                        type="email"
                        name="email"
                        placeholder="Email"
                        autoComplete="off"
                        disabled
                        className="w-full pl-10 pr-4 py-1 rounded-md bg-white text-gray-700 placeholder-gray-400 border border-gray-300 focus:outline-blue-600 disabled:bg-gray-100"
                    />
                    <Mail className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>
                <div className="relative">
                    <input
                        {...register("name")}
                        type="text"
                        name="name"
                        placeholder="Name"
                        autoComplete="off"
                        disabled={isPending}
                        className="w-full pl-10 pr-4 py-1 rounded-md bg-white text-gray-700 placeholder-gray-400 border border-gray-300 focus:outline-blue-600"
                    />
                    <User className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>
            </div>
            <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                disabled={isPending}
                className="flex gap-2 items-center justify-center ml-auto mt-5 w-52 p-2 bg-linear-to-r from-blue-400 to-blue-600 text-white text-sm rounded-md shadow-md focus:outline-none transition duration-100 cursor-pointer"
            >
                {isPending ? <div className='size-5 animate-spin rounded-full border-b-2 border-white'></div> : (
                    <>
                        <span>Update profile</span>
                        <Send className='size-4 text-blue-50' />
                    </>
                )}
            </motion.button>
        </form>
    )
}

export default UpdateUserDataForm;