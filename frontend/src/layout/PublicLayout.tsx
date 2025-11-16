// lib
import { Outlet } from "react-router-dom";

const PublicLayout = () => {
    return (
        <main className="flex flex-1 justify-center items-center min-h-screen">
            <Outlet />
        </main>
    )
}

export default PublicLayout;