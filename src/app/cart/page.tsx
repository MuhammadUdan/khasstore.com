    
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  ShoppingCart,
} from "lucide-react";

type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("khasstore-cart");
      setCart(saved ? JSON.parse(saved) : []);
    } catch {
      setCart([]);
    }
    setLoaded(true);
  }, []);

  const saveCart = (updated: CartItem[]) => {
    setCart(updated);
    localStorage.setItem("khasstore-cart", JSON.stringify(updated));
  };

  const updateQuantity = (id: string, change: number) => {
    const updated = cart
      .map((item) =>
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

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading your cart...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <p className="text-sm text-blue-600 font-semibold">
            KHASSTORE SHOPPING
          </p>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">
            Shopping Cart
          </h1>
          <p className="text-gray-500 mt-2">
            Review your products before placing your order.
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl border p-10 text-center">
            <ShoppingBag
              size={55}
              className="mx-auto text-gray-300"
            />
            <h2 className="text-xl font-bold mt-5">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mt-2">
              Discover products and add your favourites.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700"
            >
              Continue Shopping <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-5"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full sm:w-32 h-40 sm:h-32 object-cover rounded-xl bg-gray-100"
                  />

                  <div className="flex-1">
                    <div className="flex justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {item.name}
                        </h3>
                        <p className="text-blue-600 font-semibold mt-2">
                          Rs. {item.price.toLocaleString("en-PK")}
                        </p>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg h-fit"
                        aria-label="Remove product"
                      >
                        <Trash2 size={19} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-6">
                      <div className="flex items-center border rounded-xl overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-2.5 hover:bg-gray-100"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={16} />
                        </button>

                        <span className="px-4 font-semibold">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-2.5 hover:bg-gray-100"
                          aria-label="Increase quantity"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <p className="font-bold text-gray-900">
                        Rs.{" "}
                        {(item.price * item.quantity).toLocaleString("en-PK")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              <Link
                href="/"
                className="inline-flex items-center gap-2 text-blue-600 font-semibold mt-3"
              >
                <ShoppingCart size={18} />
                Continue Shopping
              </Link>
            </div>

            <div>
              <div className="bg-white border border-gray-100 rounded-2xl p-6 sticky top-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Order Summary
                </h2>

                <div className="flex justify-between mt-6 text-gray-600">
                  <span>Items ({totalItems})</span>
                  <span>
                    Rs. {subtotal.toLocaleString("en-PK")}
                  </span>
                </div>

                <div className="flex justify-between mt-4 text-gray-600">
                  <span>Delivery</span>
                  <span className="text-sm">Calculated later</span>
                </div>

                <div className="border-t mt-5 pt-5 flex justify-between">
                  <span className="font-bold text-gray-900">
                    Subtotal
                  </span>
                  <span className="font-bold text-xl text-gray-900">
                    Rs. {subtotal.toLocaleString("en-PK")}
                  </span>
                </div>

                <Link
                  href="/checkout"
                  className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl mt-7 transition"
                >
                  Proceed to Checkout
                  <ArrowRight size={19} />
                </Link>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="text-green-600" size={22} />
                    <p className="text-sm text-gray-600">
                      Trust-focused shopping
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Truck className="text-green-600" size={22} />
                    <p className="text-sm text-gray-600">
                      Cash on Delivery available
                    </p>
                  </div>
                </div>

                <p className="text-xs text-gray-400 text-center mt-5">
                  No advance payment required.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
