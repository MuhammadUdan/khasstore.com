"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Wallet,
  Settings,
  Store,
  Star,
  Menu,
  X,
  TrendingUp,
  Clock,
  ArrowDownToLine,
  CalendarDays,
  CreditCard,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { createClient } from "@/app/lib/supabase/client";

type Order = {
  id: string;
  seller_id: string;
  customer_name: string;
  customer_phone: string | null;
  delivery_address: string | null;
  total_amount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  created_at: string;
};

const money = (value: number) =>
  `Rs. ${Number(value || 0).toLocaleString("en-PK")}`;

const statusLabels: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-blue-50 text-blue-700",
  shipped: "bg-indigo-50 text-indigo-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const groups = [
    {
      title: "Main Menu",
      links: [
        { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { name: "My Products", href: "/products", icon: Package },
        { name: "Orders", href: "/orders", icon: ShoppingBag },
        { name: "Earnings", href: "/earnings", icon: Wallet },
      ],
    },
    {
      title: "Store Management",
      links: [
        { name: "My Store", href: "/store/ali-electronics", icon: Store },
        { name: "Reviews", href: "/reviews", icon: Star },
        { name: "Settings", href: "/settings", icon: Settings },
      ],
    },
  ];

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="border-b px-6 py-6">
        <Link
          href="/"
          onClick={onNavigate}
          className="text-2xl font-extrabold text-[#163b75]"
        >
          KhasStore<span className="text-blue-500">.com</span>
        </Link>
        <p className="mt-1 text-xs text-slate-400">Seller Dashboard</p>
      </div>

      <nav className="flex-1 space-y-8 overflow-y-auto px-4 py-6">
        {groups.map((group) => (
          <div key={group.title}>
            <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {group.title}
            </p>

            <div className="space-y-1">
              {group.links.map((item) => {
                const Icon = item.icon;
                const active = item.href === "/earnings";

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm ${
                      active
                        ? "bg-blue-50 font-semibold text-blue-700"
                        : "font-medium text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Icon size={19} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t p-4">
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-800">
            KS
          </div>
          <div>
            <p className="text-sm font-bold">Seller Account</p>
            <p className="text-xs text-slate-500">KhasStore Seller</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EarningsPage() {
  const supabase = useMemo(() => createClient(), []);

  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [period, setPeriod] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const pageSize = 8;

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) throw authError;

      if (!user) {
        setOrders([]);
        setError("Please login to view your earnings.");
        return;
      }

      const { data, error: ordersError } = await supabase
        .from("orders")
        .select(
          "id, seller_id, customer_name, customer_phone, delivery_address, total_amount, status, created_at"
        )
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false });

      if (ordersError) throw ordersError;

      setOrders((data || []) as Order[]);
    } catch (err: unknown) {
      console.error("Earnings loading error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load earnings. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const validOrders = useMemo(
    () => orders.filter((order) => order.status !== "cancelled"),
    [orders]
  );

  const filteredOrders = useMemo(() => {
    if (period === "Pending") {
      return orders.filter((order) =>
        ["pending", "confirmed", "shipped"].includes(order.status)
      );
    }

    if (period === "Delivered") {
      return orders.filter((order) => order.status === "delivered");
    }

    return orders;
  }, [orders, period]);

  const totalSales = validOrders.reduce(
    (sum, order) => sum + Number(order.total_amount || 0),
    0
  );

  const pendingValue = orders
    .filter((order) =>
      ["pending", "confirmed", "shipped"].includes(order.status)
    )
    .reduce((sum, order) => sum + Number(order.total_amount || 0), 0);

  const deliveredValue = orders
    .filter((order) => order.status === "delivered")
    .reduce((sum, order) => sum + Number(order.total_amount || 0), 0);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / pageSize)
  );

  const visibleOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const exportCSV = () => {
    const headers = [
      "Order ID",
      "Customer",
      "Phone",
      "Date",
      "Order Amount",
      "Order Status",
    ];

    const rows = filteredOrders.map((order) => [
      order.id,
      order.customer_name,
      order.customer_phone || "",
      formatDate(order.created_at),
      order.total_amount,
      statusLabels[order.status] || order.status,
    ]);

    const escapeCSV = (value: string | number) =>
      `"${String(value).replace(/"/g, '""')}"`;

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCSV).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "khasstore-earnings.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-800">
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 border-r lg:block">
        <Sidebar />
      </aside>

      {mobileSidebar && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-slate-950/50"
            onClick={() => setMobileSidebar(false)}
          />

          <aside className="relative h-full w-72 max-w-[85%] shadow-2xl">
            <button
              onClick={() => setMobileSidebar(false)}
              className="absolute right-3 top-4 z-10 rounded-lg p-2 hover:bg-slate-100"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
            <Sidebar onNavigate={() => setMobileSidebar(false)} />
          </aside>
        </div>
      )}

      <main className="min-w-0 lg:ml-64">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b bg-white px-4 py-4 md:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebar(true)}
              className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            <div>
              <h1 className="text-xl font-bold">Earnings & Payouts</h1>
              <p className="text-xs text-slate-500">
                Track your store sales and order transactions
              </p>
            </div>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#163b75] text-xs font-bold text-white">
            KS
          </div>
        </header>

        <div className="space-y-7 p-4 md:p-8">
          <section className="flex flex-col justify-between gap-5 rounded-2xl bg-gradient-to-r from-[#10264b] to-[#2860ad] p-6 text-white md:flex-row md:items-center">
            <div>
              <p className="text-xs font-semibold tracking-wider text-blue-200">
                SELLER FINANCIAL OVERVIEW
              </p>
              <h2 className="mt-2 text-2xl font-bold md:text-3xl">
                Your Earnings
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100">
                Monitor your actual orders and sales from KhasStore.
              </p>
            </div>

            <div className="rounded-xl bg-white/10 p-4">
              <Wallet size={28} />
              <p className="mt-3 text-sm text-blue-100">Total Sales</p>
              <p className="text-2xl font-extrabold">
                {money(totalSales)}
              </p>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[
              {
                title: "Total Sales",
                value: totalSales,
                icon: TrendingUp,
                color: "text-blue-700",
                bg: "bg-blue-50",
                description: "All non-cancelled orders",
              },
              {
                title: "Pending Order Value",
                value: pendingValue,
                icon: Clock,
                color: "text-amber-700",
                bg: "bg-amber-50",
                description: "Pending, confirmed and shipped orders",
              },
              {
                title: "Delivered Order Value",
                value: deliveredValue,
                icon: CheckCircle,
                color: "text-green-700",
                bg: "bg-green-50",
                description: "Orders marked as delivered",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-500">{item.title}</p>
                    <div className={`rounded-xl p-3 ${item.bg} ${item.color}`}>
                      <Icon size={21} />
                    </div>
                  </div>

                  <h3 className="mt-4 text-2xl font-extrabold text-slate-800">
                    {money(item.value)}
                  </h3>

                  <p className="mt-2 text-xs text-slate-400">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
                  <CreditCard size={22} />
                </div>
                <div>
                  <h3 className="font-bold">Payout Method</h3>
                  <p className="text-xs text-slate-500">
                    Seller payment details
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Current method</p>
                <p className="mt-1 font-semibold">Not connected</p>
                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Bank account, JazzCash and Easypaisa payouts will be
                  configured when payment integration is added.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-amber-50 p-3 text-amber-700">
                  <CalendarDays size={22} />
                </div>
                <div>
                  <h3 className="font-bold">Sales Information</h3>
                  <p className="text-xs text-slate-500">
                    Your current order summary
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Total orders</span>
                  <span className="font-semibold">{orders.length}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Delivered orders</span>
                  <span className="font-semibold">
                    {orders.filter((order) => order.status === "delivered").length}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Cancelled orders</span>
                  <span className="font-semibold">
                    {orders.filter((order) => order.status === "cancelled").length}
                  </span>
                </div>

                <p className="border-t pt-3 text-xs leading-5 text-slate-400">
                  These figures show order sales, not confirmed payouts.
                  Commission and payout tracking will be added with the
                  payment system.
                </p>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-4 border-b p-5 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-bold">Order & Sales History</h2>
                <p className="mt-1 text-xs text-slate-500">
                  View actual customer orders and their amounts
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={loadOrders}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Refresh
                </button>

                <button
                  onClick={exportCSV}
                  disabled={filteredOrders.length === 0}
                  className="flex items-center justify-center gap-2 rounded-lg bg-[#163b75] px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ArrowDownToLine size={17} />
                  Export CSV
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 p-5">
              {["All", "Pending", "Delivered"].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setPeriod(item);
                    setCurrentPage(1);
                  }}
                  className={`rounded-full px-4 py-2 text-xs font-semibold ${
                    period === item
                      ? "bg-[#163b75] text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {error && (
              <div className="mx-5 mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-slate-50 text-xs text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Order ID</th>
                    <th className="px-5 py-4">Customer</th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4">Order Amount</th>
                    <th className="px-5 py-4">Order Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-5 py-12 text-center text-slate-500"
                      >
                        Loading your sales...
                      </td>
                    </tr>
                  ) : (
                    <>
                      {visibleOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50">
                          <td className="px-5 py-4">
                            <p className="font-semibold">
                              #{order.id.slice(0, 8).toUpperCase()}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <p className="font-semibold">
                              {order.customer_name}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              {order.customer_phone || "No phone provided"}
                            </p>
                          </td>

                          <td className="px-5 py-4 text-slate-600">
                            {formatDate(order.created_at)}
                          </td>

                          <td className="px-5 py-4 font-bold text-slate-800">
                            {money(Number(order.total_amount || 0))}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                                statusStyles[order.status] ||
                                "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {statusLabels[order.status] || order.status}
                            </span>
                          </td>
                        </tr>
                      ))}

                      {visibleOrders.length === 0 && (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-5 py-12 text-center text-slate-500"
                          >
                            No orders found. Customer orders will appear here.
                          </td>
                        </tr>
                      )}
                    </>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t px-5 py-4">
              <p className="text-xs text-slate-500">
                Showing {filteredOrders.length} orders
              </p>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1 || loading}
                  onClick={() =>
                    setCurrentPage((page) => Math.max(1, page - 1))
                  }
                  className="rounded-lg border p-2 disabled:opacity-40"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={18} />
                </button>

                <span className="text-sm font-semibold">
                  {currentPage} / {totalPages}
                </span>

                <button
                  disabled={currentPage >= totalPages || loading}
                  onClick={() =>
                    setCurrentPage((page) => Math.min(totalPages, page + 1))
                  }
                  className="rounded-lg border p-2 disabled:opacity-40"
                  aria-label="Next page"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </section>

          <footer className="pb-4 text-xs text-slate-400">
            © 2026 KhasStore.com. All rights reserved.
          </footer>
        </div>
      </main>
    </div>
  );
}