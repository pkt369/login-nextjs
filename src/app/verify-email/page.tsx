"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface VerifyEmailResponse {
    message: string;
}

const VerifyEmailPage: React.FC = () => {
    const router = useRouter();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

    useEffect(() => {
        const verify = async () => {
            const token = new URLSearchParams(window.location.search).get("token");
            if (!token) {
                setStatus("error");
                return;
            }

            try {
                await axios.post<VerifyEmailResponse>(`${process.env.API_URL}/auth/verify-email`, { token });
                setStatus("success");
            } catch (e) {
                console.error("Fail to Verify:", e);
                setStatus("error");
            }
        };

        verify();
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-6">
            <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl flex flex-col items-center text-center">
                {status === "loading" && (
                    <div className="animate-pulse">
                        <h1 className="text-2xl font-bold text-gray-700 dark:text-gray-300">Verifying your email...</h1>
                    </div>
                )}

                {status === "success" && (
                    <>
                        <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-green-100 dark:bg-green-700">
                            <svg
                                className="w-8 h-8 text-green-600 dark:text-green-100"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-2">Email Verified!</h1>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
                            Your email has been successfully verified. You can now enjoy our services!
                        </p>
                        <a
                            href="/"
                            className="inline-block w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-all duration-200"
                        >
                            Go to Home
                        </a>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-red-100 dark:bg-red-700">
                            <svg
                                className="w-8 h-8 text-red-600 dark:text-red-100"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856C18.07 18.163 18 16.582 18 15s.07-3.163.918-4.243C18.07 9.837 18 8.418 18 7c0-1.582.07-3.163.918-4.243C18.07 1.837 18 0.418 18 0H6c0 .418-.07 1.837-.918 3.757C6.07 3.837 6 5.418 6 7c0 1.582-.07 3.163-.918 4.243C6.07 12.837 6 14.418 6 16c0 1.582.07 3.163.918 4.243z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-2">Verification Failed</h1>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
                            Something went wrong. Please try again or contact support.
                        </p>
                        <a
                            href="mailto:aaa@gmail.com"
                            className="inline-block w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200"
                        >
                            Contact Support
                        </a>
                    </>
                )}
            </div>
        </div>
    );
};

export default VerifyEmailPage;