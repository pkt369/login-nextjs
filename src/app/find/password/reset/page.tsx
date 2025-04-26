"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Modal from "../../../../../components/Modal";

interface ChangePasswordInput {
    email: string;
    password: string;
    passwordConfirm: string;
}

const ChangePasswordPage: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || '';
    const token = searchParams.get("token") || '';

    const { register, handleSubmit, formState: { errors, isSubmitting }, getValues } = useForm<ChangePasswordInput>();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState<string>("");
    const [modalTitle, setModalTitle] = useState<string>("");
    const [modalButtonColor, setModalButtonColor] = useState<string>("bg-blue-600 hover:bg-blue-500");
    const [modalButtonName, setModalButtonName] = useState<string>("OK");

    const handleCloseModal = () => {
        setIsModalOpen(false);
        if (modalTitle === "Password Changed Successfully!") {
            router.push('/login');
        }
    };

    const onSubmit: SubmitHandler<ChangePasswordInput> = async (data) => {
        try {
            await axios.post(`${process.env.API_URL}/auth/password/reset`, {
                email: email,
                token: token,
                password: data.password,
            });
            setModalTitle("Password Changed Successfully!");
            setModalMessage("You have successfully changed your password.");
            setModalButtonColor("bg-green-600 hover:bg-green-500");
            setModalButtonName("Go to Login");
            setIsModalOpen(true);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setModalTitle("Password Change Failed");
                setModalMessage("Failed to change your password. Please try again.");
                setModalButtonColor("bg-red-600 hover:bg-red-500");
                setModalButtonName("OK");
                setIsModalOpen(true);
            }
        }
    };

    const handleGoToLogin = () => {
        router.push('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900">
                    Change Password
                </h2>
                <p className="mt-2 text-center text-sm text-gray-500">
                    <button
                        onClick={handleGoToLogin}
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
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                New Password
                            </label>
                            <div className="mt-1 rounded-md shadow-sm">
                                <input
                                    {...register("password", {
                                        required: "Please enter your password.",
                                        pattern: {
                                            value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                            message: "Password must be at least 8 characters long, including letters, numbers, and special characters."
                                        }
                                    })}
                                    id="password"
                                    type="password"
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm"
                                />
                            </div>
                            {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
                        </div>

                        <div className="mt-6">
                            <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700">
                                Confirm New Password
                            </label>
                            <div className="mt-1 rounded-md shadow-sm">
                                <input
                                    {...register("passwordConfirm", {
                                        required: "Please confirm your password.",
                                        validate: value => value === getValues("password") || "Passwords do not match."
                                    })}
                                    id="passwordConfirm"
                                    type="password"
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm"
                                />
                            </div>
                            {errors.passwordConfirm && <p className="mt-2 text-sm text-red-600">{errors.passwordConfirm.message}</p>}
                        </div>

                        <div className="mt-6">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none transition duration-150 ease-in-out"
                            >
                                {isSubmitting ? "Changing..." : "Change Password"}
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
                <p className="text-sm text-gray-500">
                    {modalMessage}
                </p>
            </Modal>
        </div>
    );
};

export default ChangePasswordPage;