// lib
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
// hooks
import { useSessions } from "@/features/authentication/useSessions";
import { useSignOutAll } from "@/features/authentication/useSignOutAll";
// components
import Loader from "@/components/Loader";
import SessionCard from "@/features/authentication/SessionCard";

const Sessions = () => {
    const { sessions, currentSessionId, isPending } = useSessions();
    const { signOutAll, isSigningOutAll } = useSignOutAll();

    if (isPending) {
        return (
            <div className="flex items-center justify-center w-full">
                <Loader className="size-10" />
            </div>
        )
    }

    return (
        <>
            <div className="flex flex-col space-y-3 mb-5">
                {sessions && sessions.map((session: any) => (
                    <SessionCard
                        key={session._id}
                        session={session}
                        isCurrent={session._id === currentSessionId}
                    />
                ))}
            </div>
            <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                disabled={isSigningOutAll}
                onClick={() => signOutAll()}
                className="flex gap-2 items-center justify-center ml-auto w-52 p-2 bg-linear-to-r from-red-500 to-red-600 text-white text-sm rounded-md shadow-md focus:outline-none transition duration-100 cursor-pointer"
            >
                {isSigningOutAll ? <div className='size-5 animate-spin rounded-full border-b-2 border-white'></div> : (
                    <>
                        <span>Sign out from all devices</span>
                        <LogOut className='size-4' />
                    </>
                )}
            </motion.button>
        </>
    )
}

export default Sessions;