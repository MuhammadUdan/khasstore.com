
"use client";

import { useEffect, useState } from "react";
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  Truck,
  ShieldCheck,
  MapPin,
} from "lucide-react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  initialStep?: "cart" | "checkout";
};

export default function CartCheckoutModal({
  isOpen,
  onClose,
  initialStep = "cart",
}: Props) {
  const [step, setStep] = useState<"cart" | "checkout">(initialStep);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    liveLocation: "",
  });

  useEffect(() => {
    if (!isOpen) return;

    setStep(initialStep);

    try {
      const saved = localStorage.getItem("khasstore-cart");
      setCart(saved ? JSON.parse(saved) : []);
    } catch {
      setCart([]);
    }

    setLoaded(true);
  }, [isOpen, initialStep]);

  const saveCart = (updated: CartItem[]) => {
    setCart(updated);
    localStorage.setItem("khasstore-cart", JSON.stringify(updated));
  };

  const updateQuantity = (id: string, change: number) => {
    const updated = cart.map((item) =>
      item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity + change) }
        : item
    );

    saveCart(updated);
  };

  const removeItem = (id: string) => {
    saveCart(cart.filter((item) => item.id !== id));
  };

  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const updateForm = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const placeOrder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (cart.length === 0) {
      setError("Your cart is empty.");
      setStep("cart");
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

      onClose();
      window.location.href = "/order-success";
    } catch {
      setError("Unable to place your order. Please try again.");
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const inputClass =
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  const labelClass =
    "mb-1.5 block text-sm font-semibold text-gray-800";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3 sm:p-5"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {step === "cart" ? "Your Shopping Cart" : "Checkout"}
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              {step === "cart"
                ? `${totalItems} item(s) in your cart`
                : "Enter your delivery information"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            aria-label="Close popup"
          >
            <X size={22} />
          </button>
        </div>

        {!loaded ? (
          <div className="p-10 text-center text-gray-500">
            Loading your cart...
          </div>
        ) : step === "cart" ? (
          <div className="overflow-y-auto p-5">
            {cart.length === 0 ? (
              <div className="py-8 text-center">
                <ShoppingBag
                  size={48}
                  className="mx-auto text-gray-300"
                />
                <h3 className="mt-4 text-lg font-bold text-gray-900">
                  Your cart is empty
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Add some products to continue shopping.
                </p>
                <button
                  onClick={onClose}
                  className="mt-5 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 rounded-xl border border-gray-200 p-3"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-20 w-20 rounded-lg bg-gray-100 object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between gap-2">
                          <h3 className="text-sm font-bold text-gray-900">
                            {item.name}
                          </h3>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="h-fit rounded-lg p-1.5 text-red-500 hover:bg-red-50"
                            aria-label="Remove item"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>

                        <p className="mt-1 font-semibold text-blue-600">
                          Rs. {item.price.toLocaleString("en-PK")}
                        </p>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center overflow-hidden rounded-lg border">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-2 hover:bg-gray-100"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} />
                            </button>

                            <span className="px-3 text-sm font-semibold">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-2 hover:bg-gray-100"
                              aria-label="Increase quantity"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          <span className="text-sm font-bold text-gray-900">
                            Rs.{" "}
                            {(item.price * item.quantity).toLocaleString("en-PK")}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 border-t border-gray-200 pt-4">
                  <div className="flex justify-between font-bold text-gray-900">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>Rs. {total.toLocaleString("en-PK")}</span>
                  </div>

                  <button
                    onClick={() => {
                      setError("");
                      setStep("checkout");
                    }}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-bold text-white hover:bg-blue-700"
                  >
                    Proceed to Checkout
                    <ArrowLeft className="rotate-180" size={18} />
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <form
            onSubmit={placeOrder}
            className="overflow-y-auto p-5"
          >
            <button
              type="button"
              onClick={() => {
                setError("");
                setStep("cart");
              }}
              className="mb-5 flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft size={17} />
              Back to Cart
            </button>

            <div className="mb-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex justify-between text-sm text-gray-700">
                <span>Items ({totalItems})</span>
                <span className="font-bold">
                  Rs. {total.toLocaleString("en-PK")}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-2 border-t border-gray-200 pt-3 text-sm font-bold text-green-700">
                <Truck size={19} />
                Cash on Delivery
              </div>
            </div>

            <h3 className="mb-4 flex items-center gap-2 font-bold text-gray-900">
              <MapPin size={19} className="text-blue-600" />
              Delivery Information
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Full Name *</label>
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
                <label className={labelClass}>Mobile Number *</label>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateForm("phone", e.target.value)}
                  placeholder="03XXXXXXXXX"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Email (Optional)</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateForm("email", e.target.value)}
                  placeholder="Email address"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>City *</label>
                <input
                  required
                  value={form.city}
                  onChange={(e) => updateForm("city", e.target.value)}
                  placeholder="Enter your city"
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>Complete Address *</label>
                <textarea
                  required
                  minLength={10}
                  rows={3}
                  value={form.address}
                  onChange={(e) => updateForm("address", e.target.value)}
                  placeholder="House number, street, area and nearby landmark"
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div>
                <label className={labelClass}>Postal Code</label>
                <input
                  value={form.postalCode}
                  onChange={(e) => updateForm("postalCode", e.target.value)}
                  placeholder="Postal code"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Google Maps Link</label>
                <input
                  value={form.liveLocation}
                  onChange={(e) => updateForm("liveLocation", e.target.value)}
                  placeholder="Optional location link"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4">
              <div className="flex items-center gap-2 font-bold text-green-800">
                <ShieldCheck size={20} />
                Cash on Delivery
              </div>
              <p className="mt-1 text-xs text-green-700">
                Pay only when your parcel is delivered. No advance payment required.
              </p>
            </div>

            {error && (
              <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-5 w-full rounded-xl bg-blue-600 py-3.5 font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Placing Order..."
                : `Place COD Order — Rs. ${total.toLocaleString("en-PK")}`}
            </button>

            <p className="mt-3 text-center text-xs text-gray-500">
              Your order is currently saved in this browser demo.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
