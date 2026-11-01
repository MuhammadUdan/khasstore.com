
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Package,
  Truck,
  ShieldCheck,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";

type Order = {
  id: string;
  customer: {
    name: string;
    phone: string;
    city: string;
    address: string;
  };
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  total: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
};

export default function OrderSuccessPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("khasstore-last-order");
      if (saved) setOrder(JSON.parse(saved));
    } catch {
      setOrder(null);
    }
    setLoaded(true);
  }, []);

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-5">
        <div className="bg-white rounded-2xl p-10 text-center shadow-sm max-w-md">
          <Package size={50} className="mx-auto text-gray-300" />
          <h1 className="text-2xl font-bold mt-5">No Order Found</h1>
          <p className="text-gray-500 mt-2">
            Please place an order before visiting this page.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Go Shopping <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
          <div className="bg-green-50 px-6 py-10 text-center">
            <CheckCircle2
              size={76}
              className="text-green-600 mx-auto"
            />
            <h1 className="text-3xl font-extrabold text-gray-900 mt-5">
              Order Placed Successfully!
            </h1>
            <p className="text-gray-600 mt-3">
              Thank you for shopping with KhasStore.
            </p>
            <p className="text-sm text-green-700 font-semibold mt-3">
              Your order has been saved.
            </p>
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between gap-4 border-b pb-6">
              <div>
                <p className="text-sm text-gray-500">Order Number</p>
                <p className="font-bold text-lg text-gray-900 mt-1">
                  {order.id}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="font-semibold mt-1">
                  {new Date(order.createdAt).toLocaleDateString("en-PK")}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Order Status</p>
                <span className="inline-block mt-1 bg-yellow-50 text-yellow-700 text-sm font-semibold px-3 py-1 rounded-full">
                  {order.status}
                </span>
              </div>
            </div>

            <h2 className="font-bold text-xl mt-7 mb-5">
              Order Items
            </h2>

            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    Rs. {(item.price * item.quantity).toLocaleString("en-PK")}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t mt-6 pt-5 flex justify-between text-lg font-bold">
              <span>Order Total</span>
              <span>Rs. {order.total.toLocaleString("en-PK")}</span>
            </div>

            <div className="bg-blue-50 rounded-2xl p-5 mt-7">
              <div className="flex items-center gap-3">
                <Truck className="text-blue-600" size={25} />
                <div>
                  <p className="font-bold text-gray-900">
                    Cash on Delivery
                  </p>
                  <p className="text-sm text-gray-600">
                    Pay when your parcel arrives.
                  </p>
                </div>
              </div>
            </div>

            <div className="border rounded-2xl p-5 mt-6">
              <h3 className="font-bold text-gray-900 mb-3">
                Delivery Information
              </h3>
              <p className="font-semibold">{order.customer.name}</p>
              <p className="text-sm text-gray-600 mt-1">
                {order.customer.phone}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {order.customer.address}, {order.customer.city}
              </p>
            </div>

            <div className="bg-green-50 rounded-xl p-4 mt-6 flex gap-3">
              <ShieldCheck className="text-green-600 shrink-0" size={23} />
              <p className="text-sm text-green-800">
                KhasStore is committed to safer shopping. Pay only when
                your order is delivered.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
              <Link
                href="/"
                className="flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl"
              >
                <ShoppingBag size={19} />
                Continue Shopping
              </Link>

              <Link
                href="/products"
                className="flex justify-center items-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-900 font-bold py-4 rounded-xl"
              >
                Browse Products
                <ArrowRight size={19} />
              </Link>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          Thank you for choosing KhasStore.com
        </p>
      </div>
    </div>
  );
}
