// lib
import { useNavigate } from "react-router";
import { Bell, LogOut, Settings } from "lucide-react";
// hooks
import { useUser } from "@/features/authentication/useUser";
import { useSignOut } from "@/features/authentication/useSignOut";
// utils
import { getInitials } from "@/lib/utils";
// components
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const UserButton = () => {
    const { user } = useUser();
    const { signOut } = useSignOut();
    const navigate = useNavigate();

    if (!user) return null;

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger>
                <div className="relative cursor-pointer">
                    <Avatar className="size-8" aria-label={`Avatar of ${user.name}`}>
                        {user.photoUrl && <img src={user.photoUrl} className="object-cover w-full h-full" />}
                        {!user.photoUrl && (
                            <AvatarFallback>
                                {getInitials(user.name)}
                            </AvatarFallback>
                        )}
                    </Avatar>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 px-5 py-3" align="end">
                <div className="mb-2 flex items-center gap-3">
                    {user.photoUrl ? (
                        <img
                            src={user.photoUrl}
                            alt={user.name!}
                            className="rounded-full object-cover size-10"
                        />
                    ) : (
                        <Avatar className="size-10">
                            <AvatarFallback>
                                {getInitials(user.name)}
                            </AvatarFallback>
                        </Avatar>
                    )}
                    <div>
                        <p className="text-sm font-semibold">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="group cursor-pointer transition-all duration-300"
                    onClick={() => navigate("/notifications")}
                >
                    <Bell className="text-gray-700 group-hover:rotate-45 transition-all duration-500 ease-in-out" />
                    <span>Notifications</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="group cursor-pointer transition-all duration-300"
                    onClick={() => navigate("/settings")}
                >
                    <Settings className="text-gray-700 group-hover:rotate-180 transition-all duration-500 ease-in-out" />
                    <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="group cursor-pointer transition-all duration-300"
                    onClick={() => signOut()}
                >
                    <LogOut className="text-gray-700 group-hover:translate-x-1 transition-all duration-500 ease-in-out" />
                    <span >Sign out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
};

export default UserButton;