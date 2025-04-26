"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Shield, FileText, X, Check } from "lucide-react";

interface PrivacyModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialTab?: "privacy" | "terms";
    onReadComplete?: (tab: "privacy" | "terms", isRead: boolean) => void;
    privacyRead?: boolean;
    termsRead?: boolean;
}

const PrivacyModal: React.FC<PrivacyModalProps> = ({
    isOpen,
    onClose,
    initialTab = "privacy",
    onReadComplete,
    privacyRead = false,
    termsRead = false,
}) => {
    const [activeTab, setActiveTab] = useState<"privacy" | "terms">(initialTab);
    const [hasReadPrivacy, setHasReadPrivacy] = useState(privacyRead);
    const [hasReadTerms, setHasReadTerms] = useState(termsRead);

    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab, isOpen]);

    const handleScroll = () => {
        if (!contentRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
        const isScrolledToBottom = scrollTop + clientHeight >= scrollHeight * 0.9;

        if (isScrolledToBottom) {
            if (activeTab === "privacy" && !hasReadPrivacy) {
                setHasReadPrivacy(true);
                onReadComplete && onReadComplete("privacy", true);
            } else if (activeTab === "terms" && !hasReadTerms) {
                setHasReadTerms(true);
                onReadComplete && onReadComplete("terms", true);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
        >
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-3xl w-full h-[80vh] flex flex-col shadow-xl animate-fadeIn">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">
                        {activeTab === "privacy" ? "Privacy Policy" : "Terms of Service"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="flex mb-4 border-b border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => setActiveTab("privacy")}
                        className={`flex items-center pb-2 px-4 -mb-px ${activeTab === "privacy"
                                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 font-medium"
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                            }`}
                    >
                        <Shield className="h-4 w-4 mr-2" />
                        Privacy Policy
                        {hasReadPrivacy && <Check className="h-4 w-4 ml-2 text-green-500" />}
                    </button>
                    <button
                        onClick={() => setActiveTab("terms")}
                        className={`flex items-center pb-2 px-4 -mb-px ${activeTab === "terms"
                                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 font-medium"
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                            }`}
                    >
                        <FileText className="h-4 w-4 mr-2" />
                        Terms of Service
                        {hasReadTerms && <Check className="h-4 w-4 ml-2 text-green-500" />}
                    </button>
                </div>

                {/* Content Area */}
                <div ref={contentRef} className="flex-1 overflow-y-auto pr-2" onScroll={handleScroll}>
                    {activeTab === "privacy" ? (
                        <div className="prose prose-sm prose-blue max-w-none dark:prose-invert">
                            <h1 className="text-xl font-bold mb-4">Privacy Policy</h1>

                            <p className="mb-4">
                                Follow the rules.
                            </p>

                            <h2 className="text-lg font-semibold mt-6 mb-2">1. A</h2>
                            <ul className="list-disc pl-5 mb-4 space-y-1">
                                <li>B</li>
                                <li>C</li>
                            </ul>

                            <h2 className="text-lg font-semibold mt-6 mb-2">1. B</h2>
                            <ul className="list-disc pl-5 mb-4 space-y-1">
                                <li>B</li>
                                <li>C</li>
                            </ul>

                            <h2 className="text-lg font-semibold mt-6 mb-2">1. C</h2>
                            <ul className="list-disc pl-5 mb-4 space-y-1">
                                <li>B</li>
                                <li>C</li>
                            </ul>

                            <h2 className="text-lg font-semibold mt-6 mb-2">1. D</h2>
                            <ul className="list-disc pl-5 mb-4 space-y-1">
                                <li>B</li>
                                <li>C</li>
                            </ul>

                            <h2 className="text-lg font-semibold mt-6 mb-2">1. E</h2>
                            <ul className="list-disc pl-5 mb-4 space-y-1">
                                <li>B</li>
                                <li>C</li>
                            </ul>

                            {/* Scroll prompt */}
                            <div className="mt-10 py-10">
                                <p className="text-center text-sm text-gray-500">
                                    Please scroll to the bottom to review the document completely.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="prose prose-sm prose-blue max-w-none dark:prose-invert">
                            <h1 className="text-xl font-bold mb-4">Terms of Service</h1>

                            <h2 className="text-lg font-semibold mt-6 mb-2">Article 1 (Purpose)</h2>
                            <p className="mb-4">
                                A
                            </p>

                            <h2 className="text-lg font-semibold mt-6 mb-2">Article 1 (Purpose)</h2>
                            <p className="mb-4">
                                A
                            </p>

                            <h2 className="text-lg font-semibold mt-6 mb-2">Article 1 (Purpose)</h2>
                            <p className="mb-4">
                                A
                            </p>

                            <h2 className="text-lg font-semibold mt-6 mb-2">Article 1 (Purpose)</h2>
                            <p className="mb-4">
                                A
                            </p>

                            <h2 className="text-lg font-semibold mt-6 mb-2">Article 1 (Purpose)</h2>
                            <p className="mb-4">
                                A
                            </p>

                            <h2 className="text-lg font-semibold mt-6 mb-2">Article 1 (Purpose)</h2>
                            <p className="mb-4">
                                A
                            </p>

                            {/* Scroll prompt */}
                            <div className="mt-10 py-10">
                                <p className="text-center text-sm text-gray-500">
                                    Please scroll to the bottom to review the document completely.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Status */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                        {activeTab === "privacy"
                            ? hasReadPrivacy
                                ? "✓ You have reviewed the Privacy Policy."
                                : "⚠️ Please read through the Privacy Policy."
                            : hasReadTerms
                                ? "✓ You have reviewed the Terms of Service."
                                : "⚠️ Please read through the Terms of Service."}
                    </div>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PrivacyModal;