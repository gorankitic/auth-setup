// hooks
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
// components
import MiniSpinner from "../components/MiniSpinner";
// framer-motion
import { motion } from "framer-motion";
// assets
import { Send } from "lucide-react";
// service functions
import { newVerifyEmailApi, verifyEmailApi } from "../services/authApi";

const VerifyEmail = () => {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const inputRefs = useRef([]);

    const { mutate: verifyEmail, isPending } = useMutation({
        mutationFn: verifyEmailApi,
        onSuccess: () => {
            navigate("/", { replace: true });
        },
        onError: (error) => {
            setError(error.message);
        }
    });

    const { mutate: newVerifyEmail, isPending: isPendingNewCode } = useMutation({
        mutationFn: newVerifyEmailApi,
        onSuccess: (data) => {
            setError("");
            clearInputs();
            setSuccess(data.message);
        },
        onError: (error) => {
            setError(error.message);
        }
    });

    const handleInput = (index, value) => {
        if (!/^\d+$/.test(value)) return inputRefs.current[index].value = "";
        if (value && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    }

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !e.target.value && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    }

    const handlePaste = (e) => {
        e.preventDefault();
        const clipboardData = e.clipboardData.getData("text");
        clipboardData
            .split("")
            .slice(0, inputRefs.current.length)
            .forEach((digit, index) => {
                if (inputRefs.current[index]) {
                    inputRefs.current[index].value = digit;
                }
            });
        // Focus on the last non-empty input or the first empty one
        const firstEmptyIndex = clipboardData.length < inputRefs.current.length ? clipboardData.length : inputRefs.current.length - 1;
        inputRefs.current[firstEmptyIndex]?.focus();
    }

    const clearInputs = () => {
        inputRefs.current.forEach((input) => {
            // Reset each input's value
            if (input) input.value = "";
        });
        // Focus on the first input
        inputRefs.current[0]?.focus();
    };

    const submitHandler = (e) => {
        e.preventDefault();
        const verificationCodeArray = inputRefs.current.map(input => input?.value.trim());
        if (!verificationCodeArray.every(digit => digit !== "")) return;
        const verificationCode = verificationCodeArray.join("");
        verifyEmail(verificationCode);
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md w-full bg-gray-200 bg-opacity-50 rounded-lg shadow-md overflow-hidden"
        >

            <div className="py-8 px-5">
                <form onSubmit={submitHandler}>
                    <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-400 to-blue-700 text-transparent bg-clip-text">
                        Verify your email
                    </h2>
                    <div className="flex justify-between px-3 mt-8">
                        {Array(6).fill("").map((_, index) => (
                            <input
                                key={index}
                                name={`input ${index}`}
                                type="text"
                                ref={((el) => (inputRefs.current[index] = el))}
                                maxLength="1"
                                onInput={(e) => handleInput(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={(e) => handlePaste(e)}
                                className={`w-12 h-12 text-center text-2xl text-gray-600 shadow-md border-2 border-gray-300 rounded-md 
                                focus:border-blue-600 focus:outline-none`}
                            />
                        ))}
                    </div>
                    {!isPendingNewCode && error && (
                        <>
                            <p className="text-red-500 mt-3 text-center">
                                {error}
                            </p>
                            <p
                                onClick={newVerifyEmail}
                                className="text-blue-600 text-center text-sm hover:underline cursor-pointer"
                            >
                                Send new code to email
                            </p>
                        </>
                    )}
                    {isPendingNewCode && (
                        <div className="text-center mt-5 text-blue-600">
                            <MiniSpinner />
                        </div>
                    )}
                    {!isPendingNewCode && !error && success && <p className="text-blue-600 text-center mt-3">{success}</p>}
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        disabled={isPending && isPendingNewCode}
                        className="flex gap-2 items-center justify-center mx-auto w-full mt-8 py-2 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-md shadow-md focus:outline-none transition duration-100"
                    >
                        {isPending ? <MiniSpinner /> : (
                            <>
                                <span>Verify email</span>
                                <Send className="w-4 h-4 text-white" />
                            </>
                        )}
                    </motion.button>
                </form>
            </div>
            <div className="px-8 py-3 text-sm bg-gray-500 bg-opacity-50 flex justify-center">
                <p>
                    Enter the 6 digit code sent to your email address
                </p>
            </div>
        </motion.div>
    )
}

export default VerifyEmail;