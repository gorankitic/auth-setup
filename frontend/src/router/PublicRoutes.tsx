// lib
import { Navigate, Outlet, useLocation } from "react-router-dom";
// hooks
import { useUser } from "@/features/user/useUser";
// components
import Loader from "@/components/Loader";

const PublicRoutes = () => {
    const { user, isPending } = useUser();
    const location = useLocation();

    if (isPending) {
        return (
            <div className="flex items-center justify-center w-full h-screen">
                <Loader className="size-16" />
            </div>
        );
    }

    // Routes that should remain public even if user is signed in
    const alwaysPublic = [
        "/verification-success",
        "/verification-failed"
    ];

    const currentPath = location.pathname;

    // If user is signed in and path is NOT in alwaysPublic → redirect
    if (user && !alwaysPublic.includes(currentPath)) {
        return <Navigate to="/" replace />;
    }
    return (
        <Outlet />
    )
}

export default PublicRoutes;