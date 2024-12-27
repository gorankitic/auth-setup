// hooks
import { useAuth } from "../hooks/useAuth";
// components
import { Navigate, Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const ProtectedAppLayout = () => {
    const { user, isLoading } = useAuth();

    if (!user && !isLoading) return (
        <Navigate
            to="/signin"
            // user won't be able to go back to the original page using the browser's back button
            replace
            // redirecting the user back to the original page after they complete the signin process
            state={{ redirectUrl: window.location.pathname }}
        />
    )

    if (user) return (
        <div className="flex flex-col min-h-screen w-full max-w-5xl px-10">
            <Header />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div >
    )
}

export default ProtectedAppLayout;