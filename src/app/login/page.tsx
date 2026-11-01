
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "../lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();

    try {
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });

      if (loginError) {
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
          setError(
            "Aapki seller application abhi approve nahi hui. Admin approval ka intezar karein."
          );
          return;
        }

        router.push("/dashboard");
        router.refresh();
        return;
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Login error:", err);
      setError("Kuch masla hua hai. Internet connection check karein.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-9">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Login to your KhasStore account.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            href="/seller-register"
            className="font-semibold text-blue-600 hover:underline"
          >
            Register as Seller
          </Link>
        </p>

        <Link
          href="/"
          className="mt-5 block text-center text-sm text-gray-500 hover:text-blue-600"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
