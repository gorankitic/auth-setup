// hooks
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
// assets
import { LogOut } from "lucide-react";
// service functions
import { signOutApi } from "../services/authApi";

const Header = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);

    const { mutate: signOut, isPending } = useMutation({
        mutationFn: signOutApi,
        onSuccess: () => {
            queryClient.clear();
            navigate("/signin");
        },
    });

    return (
        <header className="border-b border-b-gray-300 w-full py-3 flex justify-between items-center">
            <span>Application</span>
            <div className="flex items-center gap-3">
                <p>{user?.name}</p>
                <button
                    onClick={signOut}
                    disabled={isPending}
                    className="flex gap-2 items-center justify-center py-1 px-3 bg-blue-600 text-white rounded-md shadow-md"
                >
                    <span>Sign out</span>
                    <LogOut className="w-4 h-4" />
                </button>
            </div>
        </header>
    )
}
export default Header;