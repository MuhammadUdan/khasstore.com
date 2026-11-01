
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
  Wallet,
  CreditCard,
  Building2,
  X,
  Store,
} from "lucide-react";

type PaymentMethod = "jazzcash" | "easypaisa" | "bank";

const plans = {
  go: { name: "Go", monthly: 999, yearly: 9990, orders: "30 orders/month" },
  plus: { name: "Plus", monthly: 2499, yearly: 24990, orders: "100 orders/month" },
  pro: { name: "Pro", monthly: 4999, yearly: 49990, orders: "Unlimited orders" },
};

export default function SellerRegisterPage() {
  const [plan, setPlan] = useState<keyof typeof plans>("go");
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [payment, setPayment] = useState<PaymentMethod>("jazzcash");
  const [showPayment, setShowPayment] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    store: "",
    phone: "",
    email: "",
    password: "",
    transactionId: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const selected = params.get("plan")?.toLowerCase();
    const period = params.get("billing");

    if (selected && selected in plans) {
      setPlan(selected as keyof typeof plans);
    }
    if (period === "yearly" || period === "monthly") {
      setBilling(period);
    }
  }, []);

  const selectedPlan = plans[plan];
  const amount =
    billing === "monthly" ? selectedPlan.monthly : selectedPlan.yearly;

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const submitApplication = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.name.trim() || !form.store.trim() || !form.phone.trim() ||
        !form.email.trim() || !form.password.trim()) {
      alert("Please fill in all required fields.");
      return;
    }

    if (!form.transactionId.trim()) {
      alert("Please enter your payment transaction ID or reference.");
      return;
    }

    const application = {
      ...form,
      plan,
      billing,
      amount,
      payment,
      status: "Pending Admin Verification",
      createdAt: new Date().toISOString(),
    };

    const previous = JSON.parse(
      localStorage.getItem("khasstore-seller-applications") || "[]"
    );

    previous.push(application);
    localStorage.setItem(
      "khasstore-seller-applications",
      JSON.stringify(previous)
    );

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center p-5">
        <div className="max-w-lg w-full bg-white border border-green-200 rounded-3xl shadow-xl p-8 text-center">
          <CheckCircle2 size={65} className="mx-auto text-green-600" />
          <h1 className="text-3xl font-black mt-5">Application Submitted!</h1>
          <p className="text-gray-600 mt-3 leading-7">
            Your seller registration and payment reference have been saved
            in this browser demo. Your membership is not active yet.
            Admin verification is required.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-6 text-left">
            <p className="font-bold">Selected plan: {selectedPlan.name}</p>
            <p className="text-gray-600 mt-1">
              Amount: Rs. {amount.toLocaleString("en-PK")}
            </p>
            <p className="text-amber-700 font-semibold mt-2">
              Status: Pending Verification
            </p>
          </div>
          <Link href="/" className="block mt-7 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-bold">
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 text-gray-900">
      <header className="bg-slate-950 text-white">
        <div className="max-w-6xl mx-auto px-5 py-5 flex items-center justify-between">
          <Link href="/pricing" className="flex items-center gap-2 text-sm text-slate-300 hover:text-white">
            <ArrowLeft size={18} /> Back to Plans
          </Link>
          <div className="flex items-center gap-2 font-black text-lg">
            <Store className="text-blue-400" /> KhasStore
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-5 py-10 sm:py-14">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 text-blue-800 px-4 py-2 text-sm font-bold">
            <ShieldCheck size={17} /> Secure Seller Registration
          </span>
          <h1 className="text-3xl sm:text-4xl font-black mt-5">
            Complete Your Subscription
          </h1>
          <p className="text-gray-600 mt-3">
            Register your store and submit your payment reference.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-7 items-start">
          <form onSubmit={submitApplication} className="lg:col-span-3 bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8 space-y-5">
            <div>
              <h2 className="text-xl font-black">Seller Information</h2>
              <p className="text-sm text-gray-500 mt-1">Enter your store and contact details.</p>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Full Name *</label>
              <input required value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="Your full name" className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Store Name *</label>
              <input required value={form.store} onChange={(e) => updateField("store", e.target.value)} placeholder="Your business / store name" className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Mobile Number *</label>
              <input required type="tel" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="03XXXXXXXXX" className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Email Address *</label>
              <input required type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} placeholder="you@example.com" className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Password *</label>
              <input required type="password" minLength={8} value={form.password} onChange={(e) => updateField("password", e.target.value)} placeholder="At least 8 characters" className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
              <p className="text-xs text-red-600 mt-2">Demo only: do not enter a real password. This version does not securely create an account.</p>
            </div>

            <div className="border-t border-gray-200 pt-5">
              <h2 className="text-xl font-black">Choose Payment Method</h2>
              <p className="text-sm text-gray-500 mt-1">Select how you want to pay.</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
                <button type="button" onClick={() => setPayment("jazzcash")} className={`rounded-xl border-2 p-4 text-left transition ${payment === "jazzcash" ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-400"}`}>
                  <Wallet className="text-red-600 mb-2" />
                  <span className="font-bold text-sm">JazzCash</span>
                </button>
                <button type="button" onClick={() => setPayment("easypaisa")} className={`rounded-xl border-2 p-4 text-left transition ${payment === "easypaisa" ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-400"}`}>
                  <Wallet className="text-green-600 mb-2" />
                  <span className="font-bold text-sm">Easypaisa</span>
                </button>
                <button type="button" onClick={() => setPayment("bank")} className={`rounded-xl border-2 p-4 text-left transition ${payment === "bank" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-400"}`}>
                  <Building2 className="text-blue-600 mb-2" />
                  <span className="font-bold text-sm">Bank Transfer</span>
                </button>
              </div>

              <button type="button" onClick={() => setShowPayment(true)} className="mt-4 w-full rounded-xl border border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-800 py-3 font-bold flex justify-center items-center gap-2">
                <CreditCard size={18} /> View Payment Instructions
              </button>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Transaction ID / Payment Reference *</label>
              <input required value={form.transactionId} onChange={(e) => updateField("transactionId", e.target.value)} placeholder="Enter transaction ID after payment" className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <button type="submit" className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-4 font-extrabold shadow-lg transition">
              Submit Registration & Payment Reference
            </button>

            <p className="text-xs text-gray-500 text-center">
              Your subscription will remain pending until an admin verifies your payment.
            </p>
          </form>

          <aside className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-7 lg:sticky lg:top-6">
            <h2 className="text-xl font-black">Subscription Summary</h2>

            <div className="mt-6 rounded-xl border-2 border-blue-200 bg-blue-50 p-5">
              <p className="text-sm font-bold text-blue-700">SELECTED PLAN</p>
              <h3 className="text-3xl font-black mt-2">{selectedPlan.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{selectedPlan.orders}</p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between gap-3 text-sm">
                <span className="text-gray-500">Subscription</span>
                <span className="font-bold">Rs. {amount.toLocaleString("en-PK")}</span>
              </div>
              <div className="flex justify-between gap-3 text-sm">
                <span className="text-gray-500">Billing</span>
                <span className="font-bold capitalize">{billing}</span>
              </div>
              <div className="flex justify-between gap-3 text-sm">
                <span className="text-gray-500">Tax</span>
                <span className="font-bold">Rs. 0</span>
              </div>
              <div className="border-t border-gray-200 pt-5 flex justify-between items-center">
                <span className="font-black">Due today</span>
                <span className="text-2xl font-black text-blue-700">Rs. {amount.toLocaleString("en-PK")}</span>
              </div>
            </div>

            <div className="mt-7 bg-green-50 border border-green-200 rounded-xl p-4 flex gap-3">
              <ShieldCheck className="text-green-700 shrink-0" />
              <p className="text-xs text-green-900 leading-5">
                Manual payment verification protects sellers and KhasStore from unverified transactions.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {showPayment && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setShowPayment(false)}>
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 relative" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => setShowPayment(false)} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100">
              <X size={20} />
            </button>

            <h3 className="text-xl font-black pr-8">Payment Instructions</h3>
            <p className="text-sm text-gray-500 mt-2">
              {payment === "jazzcash" ? "JazzCash" : payment === "easypaisa" ? "Easypaisa" : "Bank Transfer"}
            </p>

            <div className="mt-5 rounded-xl bg-slate-100 border border-slate-200 p-5 space-y-3">
              <p className="text-sm text-gray-600">Please replace these placeholders with your real receiving account details:</p>
              {payment === "jazzcash" && (
                <>
                  <p className="font-bold">JazzCash Account Number</p>
                  <p className="text-lg font-black">YOUR JAZZCASH NUMBER</p>
                  <p className="text-sm text-gray-600">Account Title: YOUR ACCOUNT NAME</p>
                </>
              )}
              {payment === "easypaisa" && (
                <>
                  <p className="font-bold">Easypaisa Account Number</p>
                  <p className="text-lg font-black">YOUR EASYPAISA NUMBER</p>
                  <p className="text-sm text-gray-600">Account Title: YOUR ACCOUNT NAME</p>
                </>
              )}
              {payment === "bank" && (
                <>
                  <p className="font-bold">Bank Account Details</p>
                  <p className="text-sm">Bank: YOUR BANK NAME</p>
                  <p className="text-sm">Account Title: YOUR ACCOUNT NAME</p>
                  <p className="text-sm">Account / IBAN: YOUR IBAN</p>
                </>
              )}
              <div className="border-t border-gray-300 pt-3 flex justify-between">
                <span className="text-sm text-gray-600">Amount to pay</span>
                <span className="font-black">Rs. {amount.toLocaleString("en-PK")}</span>
              </div>
            </div>

            <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
              Do not make a payment until the real account details have been added and verified by KhasStore.
            </p>

            <button type="button" onClick={() => setShowPayment(false)} className="mt-5 w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-3 font-bold">
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
