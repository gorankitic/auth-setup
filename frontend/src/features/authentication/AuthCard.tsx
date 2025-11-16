// lib
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

type AuthCardProps = {
    children: React.ReactNode,
    title: string,
    backLinkHref?: string,
    label: string,
}

const AuthCard = ({ children, title, backLinkHref, label }: AuthCardProps) => {

    return (
        <div className="max-w-lg w-full bg-gray-100 rounded-lg shadow-md overflow-hidden">
            <div className="py-8 px-5">
                <h1 className="text-2xl mb-8 font-bold text-center bg-linear-to-r from-blue-300 to-blue-700 text-transparent bg-clip-text">
                    {title}
                </h1>
                {children}
            </div>
            <div className="px-8 py-3 text-sm bg-gray-300 flex justify-center text-gray-800">
                {backLinkHref ? (
                    <Link to={backLinkHref} className="flex items-center gap-1 hover:text-blue-600 hover:underline">
                        <span>{label}</span>
                        <ArrowRight className="size-4 mt-0.5" />
                    </Link>
                ) : <span>{label}</span>}
            </div>
        </div>
    )
}

export default AuthCard;