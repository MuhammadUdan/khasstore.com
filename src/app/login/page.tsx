
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShoppingBag,
  User,
  Store,
  Phone,
  KeyRound,
  Truck,
  ShieldCheck,
  Headset,
} from "lucide-react";
import { createClient } from "../lib/supabase/client";

type View = "login" | "register" | "forgot";

export default function LoginPage() {
  const router = useRouter();

  const [view, setView] = useState<View>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [fullName, setFullName] = useState("");
  const [shopName, setShopName] = useState("");
  const [phone, setPhone] = useState("");

  function changeView(next: View) {
    setView(next);
    setError("");
    setMessage("");
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

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
      console.error(err);
      setError("Internet connection check karein aur dobara try karein.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const supabase = createClient();

    try {
      const { data, error: signupError } =
        await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/registered`,
            data: {
              full_name: fullName.trim(),
              shop_name: shopName.trim(),
              phone: phone.trim(),
            },
          },
        });

      if (signupError) {
        setError(signupError.message);
        return;
      }

      if (data.user) {
        setMessage(
          "Registration request receive ho gayi. Email confirmation check karein. KYC verification ke aglay steps jald complete karwaye jayenge."
        );
      }
    } catch (err) {
      console.error(err);
      setError("Registration nahi ho saki. Dobara try karein.");
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const supabase = createClient();

    try {
      const { error: resetError } =
        await supabase.auth.resetPasswordForEmail(
          email.trim().toLowerCase(),
          {
            redirectTo: `${window.location.origin}/reset-password`,
          }
        );

      if (resetError) {
        setError(resetError.message);
        return;
      }

      setMessage(
        "Agar is email par account mojood hai to password reset link bhej diya gaya hai. Apna inbox check karein."
      );
    } catch (err) {
      console.error(err);
      setError("Reset email nahi bheji ja saki. Dobara try karein.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-blue-50 to-blue-100 px-4 py-8 sm:py-12">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-blue-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-blue-300/30 blur-3xl" />

      <div className="relative mx-auto grid min-h-[85vh] max-w-7xl items-center gap-10 lg:grid-cols-2">

        {/* Left Branding Section */}
        <section className="hidden lg:block">
          <Link href="/" className="mb-20 inline-flex items-center gap-3">
            <div className="rounded-xl bg-blue-600 p-3 text-white shadow-lg">
              <ShoppingBag size={34} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">
                Khas<span className="text-blue-600">Store</span>.com
              </h1>
              <p className="text-sm text-slate-600">
                Shop Smart. Live Better.
              </p>
            </div>
          </Link>

          <h2 className="text-5xl font-extrabold leading-tight text-slate-900">
            Welcome <span className="text-blue-600">Back</span>
          </h2>

          <p className="mt-5 max-w-lg text-xl leading-8 text-slate-600">
            Login to your KhasStore account and continue your journey with us.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <div className="flex items-center gap-3 rounded-xl bg-white/70 p-4 shadow-sm">
              <Truck className="text-blue-600" size={27} />
              <span className="text-sm font-semibold text-slate-800">
                Fast Delivery
              </span>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-white/70 p-4 shadow-sm">
              <ShieldCheck className="text-blue-600" size={27} />
              <span className="text-sm font-semibold text-slate-800">
                Secure Shopping
              </span>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-white/70 p-4 shadow-sm">
              <Headset className="text-blue-600" size={27} />
              <span className="text-sm font-semibold text-slate-800">
                Customer Support
              </span>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="mx-auto w-full max-w-md">
          <div className="rounded-3xl border border-white bg-white/95 p-6 shadow-2xl shadow-blue-900/10 sm:p-9">

            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-200">
                {view === "forgot" ? (
                  <KeyRound size={29} />
                ) : view === "register" ? (
                  <Store size={29} />
                ) : (
                  <ShoppingBag size={29} />
                )}
              </div>

              <h2 className="text-3xl font-extrabold text-slate-900">
                {view === "login"
                  ? "Welcome Back"
                  : view === "register"
                  ? "Become a Seller"
                  : "Forgot Password?"}
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                {view === "login"
                  ? "Login to your KhasStore account."
                  : view === "register"
                  ? "Start your selling journey with KhasStore."
                  : "Enter your registered email to reset your password."}
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {message && (
              <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                {message}
              </div>
            )}

            {/* LOGIN FORM */}
            {view === "login" && (
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={19} />
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-semibold text-slate-700">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => changeView("forgot")}
                      className="text-xs font-semibold text-blue-600 hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <div className="relative">
                    <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={19} />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-12 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:opacity-60"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>
            )}

            {/* SELLER REGISTRATION FORM */}
            {view === "register" && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={19} />
                    <input
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Store Name
                  </label>
                  <div className="relative">
                    <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={19} />
                    <input
                      required
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      placeholder="Your store name"
                      className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={19} />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="03XXXXXXXXX"
                      className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Create Password
                  </label>
                  <div className="relative">
                    <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={19} />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-12 text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                    >
                      {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-blue-600 px-4 py-3.5 font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:opacity-60"
                >
                  {loading ? "Submitting..." : "Continue Registration"}
                </button>

                <p className="text-center text-xs leading-5 text-slate-500">
                  This is the initial registration step. CNIC, selfie,
                  address and payment verification will be completed
                  in the secure KYC steps.
                </p>
              </form>
            )}

            {/* FORGOT PASSWORD FORM */}
            {view === "forgot" && (
              <form onSubmit={handleForgotPassword} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Registered Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={19} />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-blue-600 px-4 py-3.5 font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            )}

            <div className="my-6 border-t border-slate-100" />

            <div className="text-center text-sm text-slate-600">
              {view === "login" ? (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => changeView("register")}
                    className="font-bold text-blue-600 hover:underline"
                  >
                    Register as Seller
                  </button>
                </>
              ) : view === "register" ? (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => changeView("login")}
                    className="font-bold text-blue-600 hover:underline"
                  >
                    Login
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => changeView("login")}
                  className="font-bold text-blue-600 hover:underline"
                >
                  Back to Login
                </button>
              )}
            </div>

            <Link
              href="/"
              className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-3 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
            >
              <ArrowLeft size={17} />
              Back to Home
            </Link>
          </div>

          <p className="mt-5 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} KhasStore.com — The Name of Trust
          </p>
        </section>
      </div>
    </main>
  );
}
