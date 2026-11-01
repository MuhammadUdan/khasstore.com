
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, LockKeyhole } from "lucide-react";
import { createClient } from "../app/lib/supabase/client";

type LoginModalProps = {
  onClose: () => void;
  onRegisterClick: () => void;
};

export default function LoginModal({
  onClose,
  onRegisterClick,
}: LoginModalProps) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();

      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });

      if (loginError) {
        console.error("SUPABASE LOGIN ERROR:", loginError);
        setError(loginError.message);
        return;
      }

      if (!data.user) {
        setError("Login nahi ho saka. Dobara try karein.");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profileError || !profile) {
        await supabase.auth.signOut();
        setError("Account profile nahi mila. Admin se rabta karein.");
        return;
      }

      if (profile.role === "admin") {
        onClose();
        router.push("/dashboard");
        router.refresh();
        return;
      }

      if (profile.role === "seller") {
        const { data: application, error: applicationError } =
          await supabase
            .from("seller_applications")
            .select("status")
            .eq("user_id", data.user.id)
            .maybeSingle();

        if (applicationError) {
          await supabase.auth.signOut();
          setError("Seller approval status check nahi ho saka.");
          return;
        }

        if (application?.status !== "approved") {
          await supabase.auth.signOut();
          setError("Aapki seller application abhi approve nahi hui.");
          return;
        }

        onClose();
        router.push("/dashboard");
        router.refresh();
        return;
      }

      onClose();
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Login error:", err);
      setError("Unable to connect. Please check your internet and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl sm:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          aria-label="Close login"
          className="absolute right-4 top-4 rounded-full p-2 text-gray-600 transition hover:bg-gray-100 hover:text-black"
        >
          <X size={21} />
        </button>

        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <LockKeyhole size={24} />
          </div>

          <h2 id="login-title" className="text-2xl font-black text-gray-900">
            Welcome Back
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            Login to your KhasStore account
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-800">
              Email Address
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-400 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-800">
              Password
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-lg border border-gray-400 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-700 px-4 py-3 font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-600">
          Don&apos;t have an account?
          <button
            type="button"
            onClick={onRegisterClick}
            disabled={loading}
            className="font-bold text-blue-700 hover:underline disabled:opacity-50"
          >
            Register as Seller
          </button>
        </p>
      </div>
    </div>
  );
}
