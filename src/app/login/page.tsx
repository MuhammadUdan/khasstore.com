
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
  Heart,
  Tag,
  ShoppingCart,
  Package,
  Star,
} from "lucide-react";
import { createClient } from "../lib/supabase/client";

type View = "login" | "register" | "forgot";

function ShoppingIllustration() {
  return (
    <div className="relative mx-auto flex h-[420px] w-full max-w-[570px] items-center justify-center">
      <div className="absolute left-1/2 top-1/2 h-[330px] w-[330px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-200/50 blur-3xl" />

      <div className="absolute right-10 top-8 z-20 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/90 text-blue-500 shadow-xl">
        <Heart size={28} fill="currentColor" />
      </div>

      <div className="absolute left-12 top-20 z-20 flex h-14 w-14 rotate-[-12deg] items-center justify-center rounded-2xl bg-white/90 text-blue-600 shadow-xl">
        <Tag size={28} />
      </div>

      <div className="absolute bottom-12 right-8 z-20 flex h-14 w-14 rotate-12 items-center justify-center rounded-2xl bg-white/90 text-blue-600 shadow-xl">
        <ShoppingCart size={28} />
      </div>

      <div className="absolute bottom-5 left-16 z-20 flex h-12 w-12 items-center justify-center rounded-xl bg-white/90 text-blue-600 shadow-lg">
        <Star size={24} fill="currentColor" />
      </div>

      <svg
        viewBox="0 0 580 430"
        className="relative z-10 w-full drop-shadow-2xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Shopping trolley filled with KhasStore shopping bags"
      >
        <ellipse cx="305" cy="365" rx="190" ry="23" fill="#93B9F5" opacity=".28" />

        {/* Boxes behind trolley */}
        <path d="M350 113 L420 88 L470 111 L398 140 Z" fill="#D8A36F" />
        <path d="M350 113 L398 140 L398 220 L350 193 Z" fill="#B97D4D" />
        <path d="M398 140 L470 111 L470 190 L398 220 Z" fill="#C99160" />
        <path d="M398 140 L399 220" stroke="#E6B789" strokeWidth="3" />
        <path d="M398 140 L399 220" stroke="#9D643F" strokeWidth="1" />

        <path d="M420 88 L420 132 L444 122 L444 99" fill="#E9C49D" />
        <path d="M420 88 L444 99 L470 111" stroke="#F1D0A9" strokeWidth="3" />

        <path d="M440 155 L490 137 L523 154 L474 174 Z" fill="#E7B98C" />
        <path d="M440 155 L474 174 L474 228 L440 208 Z" fill="#C48B5A" />
        <path d="M474 174 L523 154 L523 209 L474 228 Z" fill="#D9A477" />

        {/* Blue shopping bag */}
        <path d="M240 139 L323 139 L333 285 L230 285 Z" fill="#0864E8" />
        <path d="M240 139 L323 139 L333 285 L230 285 Z" fill="url(#blueBag)" />
        <path d="M259 142 C258 99 305 99 304 142" stroke="#084EB4" strokeWidth="10" strokeLinecap="round" />
        <path d="M259 142 C258 99 305 99 304 142" stroke="#6DA8FF" strokeWidth="4" strokeLinecap="round" />
        <path d="M256 195 L309 195" stroke="#73AFFF" strokeWidth="2" opacity=".6" />
        <path d="M281 212 L294 225 L281 238 L268 225 Z" fill="white" opacity=".95" />

        {/* White shopping bag */}
        <path d="M326 177 L391 177 L400 289 L318 289 Z" fill="#F9FBFF" />
        <path d="M344 180 C343 145 375 145 375 180" stroke="#C8D9F2" strokeWidth="8" strokeLinecap="round" />
        <path d="M344 180 C343 145 375 145 375 180" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
        <path d="M360 216 L372 228 L360 240 L348 228 Z" fill="#1769E8" />
        <path d="M360 216 L360 240" stroke="white" strokeWidth="2" />

        {/* Small blue bag */}
        <path d="M185 190 L242 190 L247 277 L179 277 Z" fill="#438BFA" />
        <path d="M199 191 C199 164 229 164 229 191" stroke="#1C63CB" strokeWidth="7" strokeLinecap="round" />
        <path d="M199 191 C199 164 229 164 229 191" stroke="#8CB9FF" strokeWidth="3" strokeLinecap="round" />

        {/* Trolley handle */}
        <path d="M105 152 L148 152 L176 195" stroke="#64748B" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M105 152 L148 152 L176 195" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

        {/* Trolley basket */}
        <path d="M143 189 L480 189 L442 323 Q438 340 420 340 L202 340 Q185 340 180 323 Z" fill="#CBD5E1" opacity=".24" />
        <path d="M143 189 L480 189 L442 323 Q438 340 420 340 L202 340 Q185 340 180 323 Z" stroke="#64748B" strokeWidth="9" strokeLinejoin="round" />
        <path d="M155 224 L468 224" stroke="#94A3B8" strokeWidth="5" />
        <path d="M165 263 L455 263" stroke="#94A3B8" strokeWidth="5" />
        <path d="M179 302 L449 302" stroke="#94A3B8" strokeWidth="5" />
        <path d="M215 194 L229 337" stroke="#94A3B8" strokeWidth="5" />
        <path d="M292 194 L296 339" stroke="#94A3B8" strokeWidth="5" />
        <path d="M373 194 L365 339" stroke="#94A3B8" strokeWidth="5" />
        <path d="M452 194 L423 337" stroke="#94A3B8" strokeWidth="5" />

        {/* Lower frame */}
        <path d="M202 340 L191 365 L419 365 L429 340" stroke="#64748B" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M191 365 L165 365" stroke="#64748B" strokeWidth="8" strokeLinecap="round" />

        {/* Wheels */}
        <circle cx="202" cy="375" r="19" fill="#475569" />
        <circle cx="202" cy="375" r="10" fill="#CBD5E1" />
        <circle cx="413" cy="375" r="19" fill="#475569" />
        <circle cx="413" cy="375" r="10" fill="#CBD5E1" />
        <circle cx="202" cy="375" r="4" fill="#64748B" />
        <circle cx="413" cy="375" r="4" fill="#64748B" />

        <defs>
          <linearGradient id="blueBag" x1="230" y1="140" x2="333" y2="285" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3B8BFF" />
            <stop offset="1" stopColor="#0754C8" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

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
    setShowPassword(false);
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
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-[#F0F6FF] to-[#DCEAFF]">

      {/* Background effects */}
      <div className="pointer-events-none absolute -left-40 top-20 h-[450px] w-[450px] rounded-full bg-blue-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 top-0 h-[550px] w-[550px] rounded-full bg-blue-300/30 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-28 -left-20 h-56 w-[115%] -rotate-3 rounded-[50%] bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 opacity-90" />

      {/* Main three-section layout */}
      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-[1600px] items-center gap-5 px-5 py-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_410px_minmax(0,1fr)] lg:gap-7 lg:px-10 xl:gap-10 xl:px-14">

        {/* LEFT: Branding */}
        <section className="hidden lg:flex lg:flex-col lg:justify-center">

          <Link href="/" className="mb-16 inline-flex w-fit items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-300/60">
              <ShoppingBag size={30} />
            </div>

            <div>
              <h1 className="text-[29px] font-extrabold tracking-tight text-slate-900">
                Khas<span className="text-blue-600">Store</span>.com
              </h1>
              <p className="text-sm font-medium text-slate-600">
                Shop Smart. Live Better.
              </p>
            </div>
          </Link>

          <h2 className="text-5xl font-extrabold leading-[1.15] tracking-tight text-slate-900 xl:text-[58px]">
            Welcome <span className="text-blue-600">Back</span>
          </h2>

          <p className="mt-5 max-w-[440px] text-lg leading-8 text-slate-600">
            Login to your KhasStore account and continue your journey with us.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">

            <div className="flex items-center gap-2.5 rounded-xl border border-white/90 bg-white/75 px-3.5 py-3 shadow-sm backdrop-blur">
              <Truck size={24} className="text-blue-600" />
              <span className="text-xs font-semibold text-slate-800">
                Fast Delivery
              </span>
            </div>

            <div className="flex items-center gap-2.5 rounded-xl border border-white/90 bg-white/75 px-3.5 py-3 shadow-sm backdrop-blur">
              <ShieldCheck size={24} className="text-blue-600" />
              <span className="text-xs font-semibold text-slate-800">
                Secure Shopping
              </span>
            </div>

            <div className="flex items-center gap-2.5 rounded-xl border border-white/90 bg-white/75 px-3.5 py-3 shadow-sm backdrop-blur">
              <Headset size={24} className="text-blue-600" />
              <span className="text-xs font-semibold text-slate-800">
                24/7 Support
              </span>
            </div>

          </div>
        </section>

        {/* CENTER: Form card */}
        <section className="mx-auto w-full max-w-[410px]">

          {/* Mobile logo */}
          <Link
            href="/"
            className="mb-6 flex items-center justify-center gap-3 lg:hidden"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg">
              <ShoppingBag size={26} />
            </div>

            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">
                Khas<span className="text-blue-600">Store</span>.com
              </h1>
              <p className="text-xs text-slate-500">
                Shop Smart. Live Better.
              </p>
            </div>
          </Link>

          <div className="rounded-[24px] border border-white bg-white/95 px-6 py-7 shadow-[0_18px_55px_rgba(37,99,235,0.16)] backdrop-blur-xl sm:px-8">

            <div className="mb-6 text-center">

              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-200">
                {view === "forgot" ? (
                  <KeyRound size={27} />
                ) : view === "register" ? (
                  <Store size={27} />
                ) : (
                  <ShoppingBag size={27} />
                )}
              </div>

              <h2 className="text-[26px] font-extrabold tracking-tight text-slate-900">
                {view === "login"
                  ? "Welcome Back"
                  : view === "register"
                  ? "Become a Seller"
                  : "Forgot Password?"}
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {view === "login"
                  ? "Login to your KhasStore account."
                  : view === "register"
                  ? "Start your selling journey with KhasStore."
                  : "Enter your registered email to reset your password."}
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-5 text-red-700">
                {error}
              </div>
            )}

            {message && (
              <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-3 text-sm leading-5 text-green-700">
                {message}
              </div>
            )}

            {/* LOGIN */}
            {view === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />

                    <input
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700">
                      Password
                    </label>

                    <button
                      type="button"
                      onClick={() => changeView("forgot")}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <div className="relative">
                    <LockKeyhole className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />

                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Logging in..." : "➜ Login"}
                </button>

              </form>
            )}

            {/* SELLER REGISTRATION */}
            {view === "register" && (
              <form onSubmit={handleRegister} className="space-y-3.5">

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Full Name
                  </label>

                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />

                    <input
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Store Name
                  </label>

                  <div className="relative">
                    <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />

                    <input
                      required
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      placeholder="Your store name"
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Mobile Number
                  </label>

                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />

                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="03XXXXXXXXX"
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Email Address
                  </label>

                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Create Password
                  </label>

                  <div className="relative">
                    <LockKeyhole className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />

                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-11 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:opacity-60"
                >
                  {loading ? "Submitting..." : "Continue Registration"}
                </button>

                <p className="text-center text-[11px] leading-5 text-slate-500">
                  This is the initial registration step. CNIC, selfie,
                  address and payment verification will be completed
                  in the secure KYC steps.
                </p>

              </form>
            )}

            {/* FORGOT PASSWORD */}
            {view === "forgot" && (
              <form onSubmit={handleForgotPassword} className="space-y-4">

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Registered Email Address
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />

                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-blue-700 disabled:opacity-60"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>

              </form>
            )}

            <div className="my-5 border-t border-slate-100" />

            <div className="text-center text-xs text-slate-600">

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
              className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
            >
              <ArrowLeft size={15} />
              Back to Home
            </Link>

          </div>

          <p className="mt-5 text-center text-[11px] text-slate-500">
            © {new Date().getFullYear()} KhasStore.com — The Name of Trust
          </p>

        </section>

        {/* RIGHT: Shopping illustration */}
        <section className="hidden min-w-0 items-center justify-center lg:flex">
          <ShoppingIllustration />
        </section>

      </div>
    </main>
  );
}
