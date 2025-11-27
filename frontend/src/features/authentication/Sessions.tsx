// lib
import { LogOut } from "lucide-react";
// hooks
import { useSessions } from "@/features/authentication/useSessions";
import { useSignOutAll } from "@/features/authentication/useSignOutAll";
// components
import Loader from "@/components/Loader";
import SessionCard from "@/features/authentication/SessionCard";
import Button from "@/components/Button";

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
            <div className="flex flex-col space-y-3">
                {sessions && sessions.map((session: any) => (
                    <SessionCard
                        key={session._id}
                        session={session}
                        isCurrent={session._id === currentSessionId}
                    />
                ))}
            </div>
            <Button
                icon={LogOut}
                disabled={isSigningOutAll}
                onClick={() => signOutAll()}
                className="bg-linear-to-r from-red-500 to-red-600 text-white mt-5 w-52 ml-auto"
            >
                Sign out from all devices
            </Button>
        </>
    )
}

export default Sessions;