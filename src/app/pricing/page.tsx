
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check, ArrowRight, Store, TrendingUp, Crown, ShieldCheck, Gift,
  Zap, Star
} from "lucide-react";

const plans = [
  {
    name: "Go",
    description: "Everything you need to start selling online.",
    monthly: 999,
    yearly: 9990,
    orders: "30 orders per month",
    icon: Store,
    color: "green",
    features: [
      "Up to 30 orders per month",
      "Seller dashboard",
      "Product management",
      "Order management",
      "Basic store analytics",
      "Customer reviews",
    ],
  },
  {
    name: "Plus",
    description: "More tools to grow your online business.",
    monthly: 2499,
    yearly: 24990,
    orders: "100 orders per month",
    icon: TrendingUp,
    color: "blue",
    popular: true,
    features: [
      "Up to 100 orders per month",
      "Everything in Go",
      "Sales analytics",
      "Earnings overview",
      "Advanced store insights",
      "Priority seller support",
    ],
  },
  {
    name: "Pro",
    description: "Maximum freedom for established sellers.",
    monthly: 4999,
    yearly: 49990,
    orders: "Unlimited orders",
    icon: Crown,
    color: "purple",
    features: [
      "Unlimited orders",
      "Everything in Plus",
      "Advanced analytics",
      "Business performance insights",
      "Priority seller support",
      "All available seller features",
    ],
  },
];

const styles: Record<string, {
  card: string; icon: string; price: string; button: string;
  badge: string; order: string; check: string;
}> = {
  green: {
    card: "border-green-300 bg-green-50/70",
    icon: "bg-green-100 text-green-700",
    price: "text-green-700",
    button: "bg-green-600 hover:bg-green-700 text-white",
    badge: "bg-green-100 text-green-800",
    order: "bg-green-100 border-green-200 text-green-900",
    check: "text-green-600",
  },
  blue: {
    card: "border-blue-500 bg-blue-50/80",
    icon: "bg-blue-100 text-blue-700",
    price: "text-blue-700",
    button: "bg-blue-600 hover:bg-blue-700 text-white",
    badge: "bg-blue-600 text-white",
    order: "bg-blue-100 border-blue-200 text-blue-900",
    check: "text-blue-600",
  },
  purple: {
    card: "border-purple-300 bg-purple-50/70",
    icon: "bg-purple-100 text-purple-700",
    price: "text-purple-700",
    button: "bg-purple-600 hover:bg-purple-700 text-white",
    badge: "bg-purple-100 text-purple-800",
    order: "bg-purple-100 border-purple-200 text-purple-900",
    check: "text-purple-600",
  },
};

export default function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-slate-100 text-gray-900">
      <section className="bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 text-white border-b-4 border-blue-500">
        <div className="max-w-7xl mx-auto px-5 py-16 sm:py-20 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-5 py-2 text-sm font-bold text-blue-200">
            <Store size={17} /> KHASSTORE SELLER MEMBERSHIP
          </span>

          <h1 className="mt-7 text-4xl sm:text-6xl font-black tracking-tight">
            Choose Your <span className="text-blue-400">Growth Plan</span>
          </h1>

          <p className="mt-5 max-w-2xl mx-auto text-slate-300 text-base sm:text-lg leading-8">
            Start your online business with KhasStore. Select a plan
            that matches your business and grow with confidence.
          </p>

          <div className="mt-9 inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 p-2">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition ${
                billing === "monthly"
                  ? "bg-white text-blue-900 shadow-lg"
                  : "text-white hover:bg-white/10"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition ${
                billing === "yearly"
                  ? "bg-white text-blue-900 shadow-lg"
                  : "text-white hover:bg-white/10"
              }`}
            >
              Yearly <span className="text-green-600">Save 2 months</span>
            </button>
          </div>

          {billing === "yearly" && (
            <p className="mt-4 text-green-300 font-semibold">
              Pay for 10 months and enjoy 12 months of membership!
            </p>
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 py-14 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black">Our Seller Plans</h2>
          <p className="text-gray-600 mt-3">
            Transparent pricing. No hidden charges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 items-stretch">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const style = styles[plan.color];
            const price = billing === "monthly" ? plan.monthly : plan.yearly;

            return (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-3xl border-2 p-7 sm:p-8 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ${
                  style.card
                } ${plan.popular ? "md:scale-[1.04] shadow-xl z-10" : ""}`}
              >
                {plan.popular && (
                  <span className={`absolute -top-4 left-1/2 -translate-x-1/2 rounded-full px-5 py-2 text-xs font-black tracking-wider whitespace-nowrap shadow-lg ${style.badge}`}>
                    <Star size={13} className="inline mr-1" />
                    MOST POPULAR
                  </span>
                )}

                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${style.icon}`}>
                  <Icon size={29} />
                </div>

                <h3 className="mt-6 text-3xl font-black">{plan.name}</h3>
                <p className="mt-2 text-sm text-gray-600 min-h-10">
                  {plan.description}
                </p>

                <div className="mt-7 border-b border-gray-300 pb-7">
                  <div className="flex items-end gap-2">
                    <span className="text-sm font-bold text-gray-500 mb-2">Rs.</span>
                    <span className={`text-4xl sm:text-5xl font-black tracking-tight ${style.price}`}>
                      {price.toLocaleString("en-PK")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    per {billing === "monthly" ? "month" : "year"}
                  </p>
                  {billing === "yearly" && (
                    <p className="text-sm font-bold text-green-700 mt-3">
                      ✓ 2 months free included
                    </p>
                  )}
                </div>

                <div className={`mt-6 rounded-xl border p-4 ${style.order}`}>
                  <div className="flex items-center gap-2">
                    <Zap size={19} />
                    <span className="font-extrabold text-sm">{plan.orders}</span>
                  </div>
                </div>

                <div className="mt-7 flex-1">
                  <p className="font-extrabold text-sm mb-5">PLAN FEATURES</p>
                  <ul className="space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm text-gray-700">
                        <Check size={19} className={`shrink-0 ${style.check}`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedPlan(plan.name)}
                  className={`mt-9 w-full flex items-center justify-center gap-2 rounded-xl py-4 px-5 font-extrabold shadow-md transition ${style.button}`}
                >
                  Select {plan.name} Plan
                  <ArrowRight size={19} />
                </button>
              </div>
            );
          })}
        </div>

        {selectedPlan && (
          <div className="mt-10 rounded-2xl border-2 border-blue-300 bg-white p-6 sm:p-8 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Selected Membership
                </span>
                <h3 className="text-2xl font-black mt-2">
                  {selectedPlan} Plan
                </h3>
                <p className="text-gray-600 mt-1">
                  Rs. {(
                    billing === "monthly"
                      ? plans.find(p => p.name === selectedPlan)!.monthly
                      : plans.find(p => p.name === selectedPlan)!.yearly
                  ).toLocaleString("en-PK")} / {billing === "monthly" ? "month" : "year"}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="rounded-xl border border-gray-300 px-5 py-3 font-bold hover:bg-gray-100"
                >
                  Change Plan
                </button>
                <Link
                  href={`/seller-register?plan=${selectedPlan.toLowerCase()}&billing=${billing}`}
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 font-bold flex items-center gap-2"
                >
                  Continue <ArrowRight size={18} />
                </Link>
              </div>
            </div>
            <p className="mt-5 text-xs text-gray-500">
              Note: Continuing requires a seller registration page. Subscription activation and payment verification are not connected yet.
            </p>
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-5 pb-16">
        <div className="rounded-3xl bg-gradient-to-r from-amber-100 via-yellow-50 to-orange-100 border-2 border-amber-300 p-8 sm:p-12 text-center shadow-md">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-white border border-amber-200 flex items-center justify-center shadow">
            <Gift size={32} className="text-amber-600" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black mt-5 text-amber-950">
            First 100 Sellers Get PLUS FREE!
          </h2>
          <p className="max-w-2xl mx-auto mt-4 text-gray-700 leading-7">
            The first 100 sellers selected and approved by KhasStore
            administration will receive 5 months of PLUS membership absolutely free.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mt-7 text-sm font-bold text-gray-800">
            <span className="flex items-center gap-2"><Check className="text-green-700" size={19} />5 Months Free</span>
            <span className="flex items-center gap-2"><Check className="text-green-700" size={19} />100 Selected Sellers</span>
            <span className="flex items-center gap-2"><ShieldCheck className="text-green-700" size={19} />Admin Approved</span>
          </div>
        </div>
      </section>

      <footer className="border-t-2 border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-5 py-8 text-center">
          <p className="font-bold text-gray-700">KhasStore — The name of trust.</p>
        </div>
      </footer>
    </main>
  );
}
