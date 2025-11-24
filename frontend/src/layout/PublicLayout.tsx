// lib
import { Outlet } from "react-router-dom";

const PublicLayout = () => {
    return (
        <main className="flex min-h-screen items-center justify-center px-4">
            <div className="w-full max-w-sm sm:max-w-lg">
                <Outlet />
            </div>
        </main>
    )
}

export default PublicLayout;