// react-router
import { Outlet } from "react-router-dom"
// components
import Header from "@/components/Header"
import Footer from "@/components/Footer"

const ProtectedLayout = () => {
    return (
        <div className="flex flex-col min-h-screen max-w-5xl mx-auto px-5">
            <Header />
            <Outlet />
            <Footer />
        </div>
    )
}

export default ProtectedLayout;