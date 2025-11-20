// lib
import { Shield } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
// components
import UserButton from "@/features/user/UserButton";

const Header = () => {
    return (
        <div className="my-4 flex items-center justify-between">
            <motion.div
                className="p-1 rounded-md cursor-pointer"
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
            >
                <Link to="/" className="flex gap-2 items-center">
                    <Shield className="text-blue-500 size-6" />
                    <h1 className="text-xl font-bold bg-linear-to-r from-blue-500 to-blue-600 text-transparent bg-clip-text">
                        Authentication setup
                    </h1>
                </Link>
            </motion.div>
            <UserButton />
        </div>
    )
}

export default Header;