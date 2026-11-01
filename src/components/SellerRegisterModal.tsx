
"use client";

import { useState } from "react";
import { createClient } from "../app/lib/supabase/client";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onLoginClick: () => void;
};;

export default function SellerRegisterModal({ isOpen, onClose, onLoginClick, }: Props) {
    const [fullName, setFullName] = useState("");
    const [shopName, setShopName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    if (!isOpen) return null;

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const supabase = createClient();

            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/registered`,
                    data: {
                        full_name: fullName,
                        shop_name: shopName,
                        phone,
                    },
                },
            });

            if (error) throw error;

            setMessage(
                "Registration successful! Please check your email to verify your account."
            );
        } catch (error) {
            setMessage(
                error instanceof Error ? error.message : "Registration failed."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
            <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-4 top-3 text-2xl text-slate-500 hover:text-black"
                >
                    ×
                </button>

                <h2 className="text-2xl font-black text-slate-900">
                    Become a Seller
                </h2>
                <p className="mb-5 mt-2 text-sm text-slate-500">
                    Register your shop with KhasStore.
                </p>

                <form onSubmit={handleRegister} className="space-y-3">
                    <input
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Full Name"
                        className="w-full rounded-lg border-2 border-slate-300 bg-white p-3 text-slate-900 outline-none focus:border-blue-600"
                    />

                    <input
                        required
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                        placeholder="Shop Name"
                        className="w-full rounded-lg border-2 border-slate-300 bg-white p-3 text-slate-900 outline-none focus:border-blue-600"
                    />

                    <input
                        required
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Phone Number"
                        className="w-full rounded-lg border-2 border-slate-300 bg-white p-3 text-slate-900 outline-none focus:border-blue-600"
                    />

                    <input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address"
                        className="w-full rounded-lg border-2 border-slate-300 bg-white p-3 text-slate-900 outline-none focus:border-blue-600"
                    />

                    <input
                        required
                        type="password"
                        minLength={8}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password (minimum 8 characters)"
                        className="w-full rounded-lg border-2 border-slate-300 bg-white p-3 text-slate-900 outline-none focus:border-blue-600"
                    />
                    <p className="mt-4 text-center text-sm text-slate-600">
                        Already have an account?{" "}
                        <button
                            type="button"
                            onClick={onLoginClick}
                            className="font-bold text-blue-700 hover:underline"
                        >
                            Login
                        </button>
                    </p>

                    {message && (
                        <p className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
                            {message}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-[#1455a0] py-3 font-bold text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Registering..." : "Register as Seller"}
                    </button>
                </form>
            </div>
        </div>
    );
}
