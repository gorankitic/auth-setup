// lib
import { useState } from "react";
import { Eye, EyeOff, KeyRound } from "lucide-react";
// utils
import { cn } from "@/lib/utils";

type InputPasswordProps = {
    placeholder: string,
    disabled?: boolean,
    className?: string
    error?: string,
}

const InputPassword = ({ placeholder, disabled, error, className, ...props }: InputPasswordProps) => {
    const [passwordVisible, setPasswordVisible] = useState(false);

    return (
        <div className="flex flex-col">
            <div className="relative">
                <KeyRound className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                <input
                    type={passwordVisible ? "text" : "password"}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={cn("w-full pl-10 pr-4 py-1 rounded-md bg-white text-gray-700 placeholder-gray-400 border border-gray-300 focus:outline-blue-500", className)}
                    {...props}
                />
                {!passwordVisible ? (
                    <Eye
                        onClick={() => setPasswordVisible(prev => !prev)}
                        className="size-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                    />) : (
                    <EyeOff
                        onClick={() => setPasswordVisible(prev => !prev)}
                        className="size-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                    />
                )}
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    )
}

export default InputPassword;