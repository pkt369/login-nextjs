"use client";

import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";  // Next.js에서 사용하는 useRouter
import axios from "axios";
import Modal from "../../../components/Modal";
import { Shield, FileText, Info } from "lucide-react";
import PrivacyModal from "../../..//components/PrivacyModal";

interface FormInput {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
}

const Signup: React.FC = () => {
    const router = useRouter();  // Next.js의 useRouter 사용
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        getValues,
    } = useForm<FormInput>();

    // 개인정보 동의 관련 상태
    const [privacyAgreed, setPrivacyAgreed] = useState(false);
    const [privacyError, setPrivacyError] = useState<string | null>(null);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);
    const [activeTab, setActiveTab] = useState<"privacy" | "terms">("privacy");

    // 각 문서 읽음 상태 추적
    const [privacyRead, setPrivacyRead] = useState(false);
    const [termsRead, setTermsRead] = useState(false);

    // 두 문서 모두 읽었는지 확인
    const bothRead = privacyRead && termsRead;

    // 체크박스 비활성화 상태 관리
    const [checkboxDisabled, setCheckboxDisabled] = useState(true);

    // 두 문서 모두 읽었을 때 체크박스 활성화
    useEffect(() => {
        if (bothRead) {
            setCheckboxDisabled(false);
        }
    }, [bothRead]);

    // 체크박스 상태가 변경될 때 에러 메시지 초기화
    useEffect(() => {
        if (privacyAgreed) {
            setPrivacyError(null);
        }
    }, [privacyAgreed]);

    const onSubmit: SubmitHandler<FormInput> = async (data) => {
        // 개인정보 동의 체크 확인
        if (!privacyAgreed) {
            setPrivacyError("Please agree to the privacy policy and terms of service.");
            return;
        }

        try {
            await axios.post(`${process.env.API_URL}/auth/signup`, {
                name: data.name,
                email: data.email,
                password: data.password,
            });

            setIsModalOpen(true);
        } catch (e) {
            if (axios.isAxiosError(e)) {
                if (e.response?.status === 400) {
                    // 중복 이메일 등의 에러 처리
                    alert(e.response?.data?.message || "Account information does not match.");
                    return;
                }
            }
            console.log(e);
            alert("An unexpected error occurred.");
        }
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleCloseModal = () => {
        setIsModalOpen(false);
        router.push("/login");  // Next.js의 useRouter를 이용해 로그인 페이지로 이동
    };

    // 개인정보처리방침 모달 표시 핸들러
    const handleShowPrivacy = () => {
        setActiveTab("privacy");
        setShowPrivacyModal(true);
    };

    // 이용약관 모달 표시 핸들러
    const handleShowTerms = () => {
        setActiveTab("terms");
        setShowPrivacyModal(true);
    };

    const handlePrivacyChange = (checked: boolean) => {
        if (checkboxDisabled && checked) {
            setPrivacyError("Please read both the privacy policy and terms of service.");
            return;
        }

        setPrivacyAgreed(checked);
        if (checked) {
            setPrivacyError(null);
        }
    };

    // 문서 읽음 상태 업데이트 핸들러
    const handleReadComplete = (tab: "privacy" | "terms", isRead: boolean) => {
        if (tab === "privacy") {
            setPrivacyRead(isRead);
        } else {
            setTermsRead(isRead);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-blue-600 dark:text-blue-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                        </svg>
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">Create Account</h2>
                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                    Already have an account?{" "}
                    <a
                        href="/login"
                        className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        Login
                    </a>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-200 dark:border-gray-700">
                    <form method="POST" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
                        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                            <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-200 dark:border-gray-700">
                                <form method="POST" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Name
                                        </label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <input
                                                {...register("name", {
                                                    required: "Please enter your name.",
                                                    maxLength: { value: 50, message: "Maximum length is 50 characters." },
                                                })}
                                                placeholder="Enter your name"
                                                type="text"
                                                id="name"
                                                className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                            />
                                            {errors.name && (
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        {errors.name && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.name.message}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Email
                                        </label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <input
                                                {...register("email", {
                                                    required: "Please enter your email.",
                                                    pattern: {
                                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                        message: "Invalid email format.",
                                                    },
                                                })}
                                                id="email"
                                                placeholder="example@email.com"
                                                type="email"
                                                className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                            />
                                            {errors.email && (
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        {errors.email && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.email.message}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Password
                                        </label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <input
                                                {...register("password", {
                                                    required: "Please enter your password.",
                                                    pattern: {
                                                        value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                                        message:
                                                            "Password must be at least 8 characters and include letters, numbers, and special characters.",
                                                    },
                                                })}
                                                id="password"
                                                type="password"
                                                className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                            />
                                            {errors.password && (
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        {errors.password && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.password.message}</p>
                                        )}
                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                            Password must be at least 8 characters and include letters, numbers, and special characters.
                                        </p>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="password_confirmation"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            Confirm Password
                                        </label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <input
                                                {...register("passwordConfirm", {
                                                    required: "Please confirm your password.",
                                                    validate: (value) => value === getValues("password") || "Passwords do not match.",
                                                })}
                                                id="password_confirmation"
                                                type="password"
                                                className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                            />
                                            {errors.passwordConfirm && (
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        {errors.passwordConfirm && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.passwordConfirm.message}</p>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* 개인정보 동의 섹션 */}
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                            <div className="flex items-start mb-2">
                                <div className="flex items-center h-5">
                                    <input
                                        id="privacy-checkbox"
                                        type="checkbox"
                                        checked={privacyAgreed}
                                        onChange={(e) => handlePrivacyChange(e.target.checked)}
                                        disabled={checkboxDisabled}
                                        className={`w-4 h-4 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 ${checkboxDisabled
                                            ? "bg-gray-200 border-gray-300 dark:bg-gray-600 dark:border-gray-500 cursor-not-allowed"
                                            : "bg-white border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                                            }`}
                                        required
                                    />
                                </div>
                                <div className="ml-3">
                                    <label
                                        htmlFor="privacy-checkbox"
                                        className={`font-medium text-gray-700 dark:text-gray-300 ${checkboxDisabled ? "opacity-70" : ""}`}
                                    >
                                        I agree to the privacy policy and terms of service.
                                        <span className="text-red-500 ml-1">*</span>
                                    </label>
                                </div>
                            </div>

                            {privacyError && (
                                <div className="mb-3 text-sm text-red-600 dark:text-red-500 flex items-center">
                                    <Info className="h-4 w-4 mr-1" />
                                    {privacyError}
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-2 mt-3">
                                <button
                                    type="button"
                                    onClick={handleShowPrivacy}
                                    className={`flex-1 flex items-center justify-center px-3 py-2 text-sm border ${privacyRead
                                        ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400"
                                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                                        } rounded-md transition-colors`}
                                >
                                    <Shield className="h-4 w-4 mr-2" />
                                    Privacy Policy {privacyRead ? "(Read)" : "Read"}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleShowTerms}
                                    className={`flex-1 flex items-center justify-center px-3 py-2 text-sm border ${termsRead
                                        ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400"
                                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                                        } rounded-md transition-colors`}
                                >
                                    <FileText className="h-4 w-4 mr-2" />
                                    Terms of Service {termsRead ? "(Read)" : "Read"}
                                </button>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg
                                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Submitting...
                                    </>
                                ) : (
                                    "Sign Up"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* 개인정보처리방침 모달 */}
            <PrivacyModal
                isOpen={showPrivacyModal}
                onClose={() => setShowPrivacyModal(false)}
                initialTab={activeTab}
                onReadComplete={handleReadComplete}
                privacyRead={privacyRead}
                termsRead={termsRead}
            />

            {/* 회원가입 성공 모달 */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title="Signup Successful"
                buttonColor="bg-green-600 hover:bg-green-500"
                buttonName="Go to Login"
            >
                <p className="text-sm text-gray-500">You have successfully signed up. Please check your email.</p>
            </Modal>
        </div>
    );
};

export default Signup;