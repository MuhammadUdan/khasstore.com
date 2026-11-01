
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Truck,
  ShoppingBag,
  ArrowLeft,
  CheckCircle,
  MapPin,
  User,
  Package,
} from "lucide-react";

type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

export default function CheckoutPage() {
  const router = useRouter();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    username: "",
    phone: "",
    email: "",
    address: "",
    postalCode: "",
    city: "",
    liveLocation: "",
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("khasstore-cart");
      setCart(saved ? JSON.parse(saved) : []);
    } catch {
      setCart([]);
    }
    setLoaded(true);
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const inputClass =
    "w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3.5 text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  const labelClass =
    "block text-sm font-semibold text-gray-800 mb-2";

  const updateForm = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    const phone = form.phone.replace(/[\s-]/g, "");

    if (!/^(\+92|0)?3\d{9}$/.test(phone)) {
      setError("Please enter a valid Pakistani mobile number.");
      return;
    }

    setSubmitting(true);

    try {
      const order = {
        id: `KS-${Date.now()}`,
        customer: form,
        items: cart,
        total,
        paymentMethod: "Cash on Delivery",
        status: "Pending",
        createdAt: new Date().toISOString(),
      };

      const existingOrders = JSON.parse(
        localStorage.getItem("khasstore-orders") || "[]"
      );

      localStorage.setItem(
        "khasstore-orders",
        JSON.stringify([order, ...existingOrders])
      );

      localStorage.setItem(
        "khasstore-last-order",
        JSON.stringify(order)
      );

      localStorage.removeItem("khasstore-cart");

      router.push("/order-success");
    } catch {
      setError("Unable to place order. Please try again.");
      setSubmitting(false);
    }
  };

  if (!loaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-600">
        Loading checkout...
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-5">
        <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center shadow-sm">
          <ShoppingBag size={48} className="mx-auto text-gray-300" />
          <h1 className="text-2xl font-bold mt-5 text-gray-900">
            Your cart is empty
          </h1>
          <Link
            href="/"
            className="inline-block mt-5 text-blue-600 font-semibold"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 sm:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold mb-6"
        >
          <ArrowLeft size={18} />
          Back to Cart
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Checkout
          </h1>
          <p className="text-gray-600 mt-2">
            Enter your delivery details and pay when your order arrives.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-7 items-start"
        >
          {/* Delivery Form */}

          <div className="lg:col-span-2 bg-white border border-gray-300 rounded-2xl shadow-sm overflow-hidden">

            <div className="px-6 sm:px-8 py-5 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2.5 rounded-xl">
                  <User className="text-blue-600" size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Delivery Information
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Please provide your correct information.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8">

              {/* Personal Information */}

              <h3 className="text-base font-bold text-gray-900 mb-5">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                <div>
                  <label className={labelClass}>
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    minLength={3}
                    value={form.name}
                    onChange={(e) => updateForm("name", e.target.value)}
                    placeholder="Enter your full name"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Username <span className="text-gray-400">(Optional)</span>
                  </label>
                  <input
                    value={form.username}
                    onChange={(e) => updateForm("username", e.target.value)}
                    placeholder="Enter your username"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={(e) => updateForm("phone", e.target.value)}
                    placeholder="03XXXXXXXXX"
                    className={inputClass}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Enter your Pakistani mobile number.
                  </p>
                </div>

                <div>
                  <label className={labelClass}>
                    Email Address <span className="text-gray-400">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateForm("email", e.target.value)}
                    placeholder="Enter your email address"
                    className={inputClass}
                  />
                </div>

              </div>

              {/* Delivery Address */}

              <div className="border-t border-gray-200 mt-8 pt-7">

                <div className="flex items-center gap-3 mb-5">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <MapPin size={20} className="text-blue-600" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">
                    Delivery Address
                  </h3>
                </div>

                <div className="space-y-5">

                  <div>
                    <label className={labelClass}>
                      Complete Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      minLength={10}
                      rows={4}
                      value={form.address}
                      onChange={(e) => updateForm("address", e.target.value)}
                      placeholder="Enter house number, street, area and nearby landmark"
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                    <div>
                      <label className={labelClass}>
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        value={form.city}
                        onChange={(e) => updateForm("city", e.target.value)}
                        placeholder="Enter your city"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Postal Code <span className="text-gray-400">(Optional)</span>
                      </label>
                      <input
                        value={form.postalCode}
                        onChange={(e) => updateForm("postalCode", e.target.value)}
                        placeholder="Enter your postal code"
                        className={inputClass}
                      />
                    </div>

                  </div>

                  <div>
                    <label className={labelClass}>
                      Live Location <span className="text-gray-400">(Optional)</span>
                    </label>
                    <input
                      value={form.liveLocation}
                      onChange={(e) => updateForm("liveLocation", e.target.value)}
                      placeholder="Paste your Google Maps location link"
                      className={inputClass}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      If you want to share your live location with us, paste your Google Maps link here. This is optional.
                    </p>
                  </div>

                </div>
              </div>

              {/* COD Information */}

              <div className="mt-8 rounded-xl border border-green-300 bg-green-50 p-5">
                <div className="flex items-center gap-3">
                  <Truck className="text-green-700 shrink-0" size={26} />
                  <div>
                    <p className="font-bold text-green-900">
                      Cash on Delivery
                    </p>
                    <p className="text-sm text-green-800 mt-1">
                      Pay cash only when your parcel is delivered.
                    </p>
                  </div>
                  <CheckCircle className="ml-auto text-green-600 shrink-0" />
                </div>
                <p className="text-xs text-green-800 mt-3 border-t border-green-200 pt-3">
                  Online and advance payments are not available on KhasStore.
                </p>
              </div>

              {error && (
                <p
                  role="alert"
                  className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 font-medium"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-7 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition shadow-sm"
              >
                {submitting ? "Placing Order..." : "Place COD Order"}
              </button>

              <p className="text-xs text-center text-gray-500 mt-3">
                Your order is currently saved in this browser demo.
              </p>

            </div>
          </div>

          {/* Order Summary */}

          <div className="bg-white border border-gray-300 rounded-2xl shadow-sm overflow-hidden lg:sticky lg:top-6">

            <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-3">
                <Package className="text-blue-600" size={23} />
                <h2 className="text-xl font-bold text-gray-900">
                  Order Summary
                </h2>
              </div>
            </div>

            <div className="p-6">

              <div className="space-y-5">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-xl border border-gray-200"
                    />

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Quantity: {item.quantity}
                      </p>
                      <p className="font-bold text-sm text-gray-900 mt-1">
                        Rs. {(item.price * item.quantity).toLocaleString("en-PK")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 mt-6 pt-5 flex justify-between font-bold text-gray-900">
                <span>Order Total</span>
                <span>Rs. {total.toLocaleString("en-PK")}</span>
              </div>

              <div className="mt-6 rounded-xl bg-gray-50 border border-gray-200 p-4 space-y-3 text-sm text-gray-700">
                <p className="flex items-center gap-2">
                  <ShieldCheck size={19} className="text-green-600 shrink-0" />
                  No advance payment
                </p>
                <p className="flex items-center gap-2">
                  <Truck size={19} className="text-green-600 shrink-0" />
                  Pay at your doorstep
                </p>
              </div>

            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
