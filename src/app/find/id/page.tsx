"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import axios from "axios";
import Modal from "../../../../components/Modal";

interface FindIdInput {
    email: string;
}

const FindIdPage: React.FC = () => {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FindIdInput>();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState<string>("");
    const [modalTitle, setModalTitle] = useState<string>("");
    const [modalButtonColor, setModalButtonColor] = useState<string>("bg-blue-600 hover:bg-blue-500");
    const [modalButtonName, setModalButtonName] = useState<string>("OK");

    const handleCloseModal = () => {
        setIsModalOpen(false);
        if (modalTitle === "Account Found") {
            router.push("/login");
        }
    };

    const onSubmit: SubmitHandler<FindIdInput> = async (data) => {
        try {
            const response = await axios.post(`${process.env.API_URL}/auth/find/id`, { email: data.email });

            setModalTitle("Account Found");
            setModalMessage(response.data.message);
            setModalButtonColor("bg-green-600 hover:bg-green-500");
            setModalButtonName("Go to Login");
            setIsModalOpen(true);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setModalTitle("Failed to Find Account");
                setModalMessage("No account found with that email address or a network error occurred.");
                setModalButtonColor("bg-red-600 hover:bg-red-500");
                setModalButtonName("OK");
                setIsModalOpen(true);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900">
                    Find Your Account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-500">
                    <button
                        onClick={() => router.push("/login")}
                        className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline transition ease-in-out duration-150"
                    >
                        Go to Login
                    </button>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <div className="mt-6">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
                                    placeholder="user@example.com"
                                    type="email"
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm"
                                />
                                <div className={`${errors.email ? '' : 'hidden'} absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none`}>
                                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                            </div>
                            {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
                        </div>

                        <div className="mt-6">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none transition duration-150 ease-in-out"
                            >
                                {isSubmitting ? "Searching..." : "Find Account"}
                            </button>
                        </div>

                        <div className="mt-4">
                            <button
                                type="button"
                                onClick={() => router.push("/find/password")}
                                className="hover:underline text-sm text-blue-500"
                            >
                                Forgot Password?
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={modalTitle}
                buttonColor={modalButtonColor}
                buttonName={modalButtonName}
            >
                <p className="text-sm text-gray-500">{modalMessage}</p>
            </Modal>
        </div>
    );
};

export default FindIdPage;