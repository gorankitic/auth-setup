// lib
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MailCheck } from "lucide-react";
// components
import AuthCard from "@/features/authentication/AuthCard";

const VerificationSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/signin");
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <AuthCard
            title="Email verification"
            backLinkHref="/signin"
            label="Go to the sign in page"
        >
            <MailCheck className="mx-auto size-8 text-gray-600" />
            <h1 className="mt-4 text-xl font-semibold text-gray-600 text-center">Email verification was successful!</h1>
            <p className="mt-4 text-gray-500 text-center">Redirecting you to the sign in page in 3 seconds...</p>
        </AuthCard>
    )
}

export default VerificationSuccess;