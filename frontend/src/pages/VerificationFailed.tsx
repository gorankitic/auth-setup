// lib
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MailX } from "lucide-react";
// components
import AuthCard from "@/features/authentication/AuthCard";

const VerificationFailed = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/signup");
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <AuthCard
            title="Email verification"
            backLinkHref="/signup"
            label="Go to the sign up page"
        >
            <MailX className="mx-auto size-8 text-gray-600" />
            <h1 className="mt-4 text-xl font-semibold text-gray-600 text-center">Email verification failed!</h1>
            <p className="mt-4 text-gray-500 text-center">Please try the verification link we sent you, or sign up again later.</p>
            <p className="text-gray-500 text-center">Redirecting you to the sign up page in 5 seconds...</p>
        </AuthCard>
    )
}

export default VerificationFailed;