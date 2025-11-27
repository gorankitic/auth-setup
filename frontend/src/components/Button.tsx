// lib
import type { ComponentType } from "react";
import { motion } from "framer-motion";
// utils
import { cn } from "@/lib/utils";

type IconType = ComponentType<{ className?: string }>;

type ButtonProps = {
    children: React.ReactNode,
    disabled?: boolean,
    className?: string,
    icon?: IconType,
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const Button = ({ children, disabled, onClick, icon: Icon, className }: ButtonProps) => {

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={disabled}
            onClick={onClick}
            className={cn("flex gap-2 items-center justify-center text-sm h-9 py-1 px-4 rounded-md shadow-md focus:outline-none transition duration-100 cursor-pointer", className)}
        >
            {disabled ? (
                <div className='size-5 animate-spin rounded-full border-b-2 border-white'></div>
            ) : (
                <>
                    {children}
                    {Icon && <Icon className="size-4 mt-0.5" />}
                </>
            )}
        </motion.button>
    )
}

export default Button;