
"use client";

import { useState } from "react";
import {
  X,
  Store,
  User,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

import { createClient } from "../src/app/lib/supabase/client";

type SellerRegisterModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
};

export default function SellerRegisterModal({
  isOpen,
  onClose,
  onLoginClick,
}: SellerRegisterModalProps) {
  const [fullName, setFullName] = useState("");
  const [shopName, setShopName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!isOpen) return null;

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setSuccess("");

    const cleanName = fullName.trim();
    const cleanShop = shopName.trim();
    const cleanPhone = phone.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanShop || !cleanPhone || !cleanEmail) {
      setError("Please tamam fields fill karein.");
      return;
    }

    if (cleanPhone.replace(/\D/g, "").length < 10) {
      setError("Valid phone number enter karein.");
      return;
    }

    if (password.length < 8) {
      setError("Password kam az kam 8 characters ka hona chahiye.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { data, error: signupError } =
        await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/registered`,
            data: {
              full_name: cleanName,
              shop_name: cleanShop,
              phone: cleanPhone,
            },
          },
        });

      if (signupError) {
        setError(signupError.message);
        return;
      }

      if (!data.user) {
        setError("Account create nahi ho saka. Dobara try karein.");
        return;
      }

      setSuccess(
        "Registration successful! Apni email inbox check karein aur confirmation link par click karein."
      );

      setPassword("");
    } catch (err) {
      console.error("Seller registration error:", err);
      setError(
        "Kuch masla hua hai. Internet connection check karein aur dobara try karein."
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-gray-300 bg-white py-3.5 pl-12 pr-4 text-sm font-medium text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100";

  const iconClass =
    "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-3 py-4 backdrop-blur-sm sm:px-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl sm:p-7"
        role="dialog"
        aria-modal="true"
        aria-labelledby="seller-register-title"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          aria-label="Close registration"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50"
        >
          <X size={19} />
        </button>

        {/* Header */}
        <div className="mb-6 pr-10">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <Store size={25} />
          </div>

          <h2
            id="seller-register-title"
            className="text-2xl font-black text-gray-900"
          >
            Become a Seller
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            Create your KhasStore seller account and start your business
            journey.
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-800">
              Full Name
            </label>

            <div className="relative">
              <span className={iconClass}>
                <User size={19} />
              </span>

              <input
                type="text"
                required
                disabled={loading || !!success}
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className={inputClass}
              />
            </div>
          </div>

          {/* Shop Name */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-800">
              Shop Name
            </label>

            <div className="relative">
              <span className={iconClass}>
                <Store size={19} />
              </span>

              <input
                type="text"
                required
                disabled={loading || !!success}
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="Enter your shop name"
                className={inputClass}
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-800">
              Phone Number
            </label>

            <div className="relative">
              <span className={iconClass}>
                <Phone size={19} />
              </span>

              <input
                type="tel"
                required
                disabled={loading || !!success}
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="03XXXXXXXXX"
                className={inputClass}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-800">
              Email Address
            </label>

            <div className="relative">
              <span className={iconClass}>
                <Mail size={19} />
              </span>

              <input
                type="email"
                required
                disabled={loading || !!success}
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-800">
              Password
            </label>

            <div className="relative">
              <span className={iconClass}>
                <Lock size={19} />
              </span>

              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                disabled={loading || !!success}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className={`${inputClass} pr-12`}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 transition hover:text-blue-700"
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>

            <p className="mt-1.5 text-xs text-gray-500">
              Password must contain at least 8 characters.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-5 text-red-700"
            >
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div
              role="status"
              className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm leading-6 text-green-800"
            >
              <div className="mb-2 flex items-center gap-2 font-bold">
                <CheckCircle2 size={19} />
                Registration Successful
              </div>

              {success}

              <p className="mt-2 font-medium">
                Email confirm karne ke baad aapki application Admin review
                ke liye pending rahegi.
              </p>
            </div>
          )}

          {/* Submit Button */}
          {!success && (
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-bold text-white shadow-sm transition duration-200 hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={19} className="animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Seller Account"
              )}
            </button>
          )}
        </form>

        {/* Admin Approval Notice */}
        <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">
          <div className="flex items-center gap-2">
            <ShieldCheck size={19} className="text-blue-700" />

            <p className="text-sm font-bold text-blue-900">
              Admin Approval Required
            </p>
          </div>

          <p className="mt-2 text-xs leading-5 text-blue-800">
            Your shop will become active only after KhasStore Admin approves
            your application.
          </p>
        </div>

        {/* Login Link */}
        <p className="mt-5 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onLoginClick}
            disabled={loading}
            className="font-bold text-blue-700 transition hover:text-blue-900 hover:underline disabled:opacity-50"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
