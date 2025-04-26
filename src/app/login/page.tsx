"use client";

import { useState } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import axios from 'axios';
import Modal from '../../../components/Modal';
import { useAuth } from '../../../components/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface LoginInput {
    email: string;
    password: string;
}

const LoginPage: React.FC = () => {
    const [modalTitle, setModalTitle] = useState<string>('');
    const router = useRouter();
    console.log(router)
    const { fetchUser } = useAuth();

    const [modalMessage, setModalMessage] = useState<string>('');

    const { register, handleSubmit, formState: { errors }, formState: { isSubmitting } } = useForm<LoginInput>();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleCloseModal = () => {
        setIsModalOpen(false);
    }

    const login: SubmitHandler<LoginInput> = async (data) => {
        try {
            await axios.post(`${process.env.API_URL}/auth/login`, {
                email: data.email,
                password: data.password
            }, {
                withCredentials: true
            });
            await fetchUser();
            router.push('/');
        } catch (e) {
            if (axios.isAxiosError(e)) {
                if (e.response?.data.status === 'not_verify') {
                    setModalTitle('Email verification required');
                    setModalMessage('For security reasons, email verification is required. A verification email has been sent to your registered email address, so please check your inbox and follow the instructions to complete the verification. After verifying your email, you will be able to log in normally.');
                    setIsModalOpen(true);
                    return;
                }
                if (e.response?.status === 400) { // ✅ Catch duplicate email error
                    setModalTitle('Login failed');
                    setModalMessage('Login failed. Please check your email and password.');
                    setIsModalOpen(true);
                    return;
                }
            }
            console.log(e);
            alert("An unexpected error occurred.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
            <div className="max-w-screen-md m-4 sm:m-6 bg-white shadow sm:rounded-lg flex justify-center flex-1">
                <div className="lg:w-3/4 xl:w-10/12 p-6 sm:p-12">
                    <div className="mt-12 flex flex-col items-center">
                        <h1 className="text-2xl xl:text-3xl font-extrabold">
                            Sign up
                        </h1>
                        <div className="w-full flex-1 mt-8">
                            <div className="flex flex-col items-center">
                                <button
                                    className="w-full max-w-sm font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline">
                                    <div className="bg-white p-2 rounded-full">
                                        <svg className="w-4" viewBox="0 0 533.5 544.3">
                                            <path
                                                d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z"
                                                fill="#4285f4" />
                                            <path
                                                d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z"
                                                fill="#34a853" />
                                            <path
                                                d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z"
                                                fill="#fbbc04" />
                                            <path
                                                d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z"
                                                fill="#ea4335" />
                                        </svg>
                                    </div>
                                    <span className="ml-4">
                                        <a href={`${process.env.API_URL}/oauth2/authorization/google`}>Google Login</a>
                                    </span>
                                </button>
                            </div>

                            <div className="my-12 border-b text-center">
                                <div
                                    className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                                    Or sign up with e-mail
                                </div>
                            </div>
                            <form method="POST" onSubmit={handleSubmit(login)} noValidate>
                                <div className="mx-auto max-w-sm">
                                    <div>
                                        <input
                                            {...register("email", {
                                                required: "Please enter your email.",
                                                pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email format." }
                                            })}
                                            className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                                            type="email" placeholder="Email" />
                                        <div className={`${errors.email ? '' : 'hidden'} absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none`}>
                                            <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
                                    </div>
                                    <div>
                                        <input
                                            {...register("password", {
                                                required: "Please enter your password.",
                                                pattern: {
                                                    value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                                    message: "Password must be at least 8 characters long and contain at least one letter, one number, and one special character."
                                                }
                                            })}
                                            className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                                            type="password" placeholder="Password" />
                                        {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="feather feather-log-in"
                                        >
                                            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                            <polyline points="10 17 15 12 10 7" />
                                            <line x1="15" y1="12" x2="3" y2="12" />
                                        </svg>
                                        <span className="ml-3">
                                            {isSubmitting ? 'Sending...' : 'Login'}
                                        </span>
                                    </button>
                                </div>
                            </form>

                            <div className="mx-auto max-w-sm">
                                <Link
                                    href="/signup"
                                    className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
                                    <svg className="w-6 h-6 -ml-2" fill="none" stroke="currentColor" strokeWidth="2"
                                        strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                                        <circle cx="8.5" cy="7" r="4" />
                                        <path d="M20 8v6M23 11h-6" />
                                    </svg>
                                    <span className="ml-3">
                                        Sign up
                                    </span>
                                </Link>
                                <div className='flex mt-4 justify-between'>
                                    <Link href="/find/id" className='hover:underline text-sm text-blue-500'>Find ID</Link>
                                    <Link href="/find/password" className='hover:underline text-sm text-blue-500'>Find Password</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={modalTitle}
                buttonColor="bg-yellow-600 hover:bg-yellow-500"
                buttonName="Go Back"
            >
                <p className="text-sm text-gray-500">
                    {modalMessage}
                </p>
            </Modal>
        </div>
    );
};

export default LoginPage;