
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard, Package, ShoppingBag, Wallet, Settings, Store,
  Star, Search, Bell, Menu, Eye, X, MapPin, Phone, CheckCircle,
  Clock, Download, ArrowUpRight, ChevronLeft, ChevronRight, Filter,
} from "lucide-react";
import { createClient } from "@/app/lib/supabase/client";

type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

type Order = {
  id: string;
  customer_name: string;
  customer_phone: string | null;
  delivery_address: string | null;
  total_amount: number;
  status: OrderStatus;
  created_at: string;
};

const statuses: OrderStatus[] = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

const statusLabels: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const statusStyles: Record<OrderStatus, string> = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  confirmed: "bg-blue-50 text-blue-700 ring-blue-200",
  shipped: "bg-purple-50 text-purple-700 ring-purple-200",
  delivered: "bg-green-50 text-green-700 ring-green-200",
  cancelled: "bg-red-50 text-red-700 ring-red-200",
};

function formatCurrency(amount: number) {
  return `Rs. ${Number(amount || 0).toLocaleString("en-PK")}`;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${statusStyles[status]}`}>
      {statusLabels[status]}
    </span>
  );
}

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const mainLinks = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Products", href: "/products", icon: Package },
    { label: "Orders", href: "/orders", icon: ShoppingBag },
    { label: "Earnings", href: "/earnings", icon: Wallet },
  ];

  const storeLinks = [
    { label: "My Store", href: "/store/ali-electronics", icon: Store },
    { label: "Reviews", href: "/reviews", icon: Star },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="border-b px-6 py-6">
        <Link href="/" onClick={onNavigate} className="text-2xl font-extrabold text-[#163b75]">
          KhasStore<span className="text-blue-500">.com</span>
        </Link>
        <p className="mt-1 text-xs text-slate-400">Seller Dashboard</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Main Menu
        </p>
        <nav className="space-y-1">
          {mainLinks.map((item) => {
            const Icon = item.icon;
            const active = item.href === "/orders";
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                  active
                    ? "bg-blue-50 font-semibold text-blue-700"
                    : "font-medium text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Icon size={19} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <p className="mb-3 mt-9 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Store Management
        </p>
        <nav className="space-y-1">
          {storeLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                <Icon size={19} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

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

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const pageSize = 5;

  useEffect(() => {
    let mounted = true;

    async function loadOrders() {
      setLoading(true);
      setError("");

      try {
        const supabase = createClient();
        const { data: authData, error: authError } =
          await supabase.auth.getUser();

        if (authError) throw authError;

        const user = authData.user;

        if (!user) {
          throw new Error("Please login to view your orders.");
        }

        const { data, error: ordersError } = await supabase
          .from("orders")
          .select(
            "id, customer_name, customer_phone, delivery_address, total_amount, status, created_at"
          )
          .eq("seller_id", user.id)
          .order("created_at", { ascending: false });

        if (ordersError) throw ordersError;

        if (mounted) {
          setOrders((data || []) as Order[]);
        }
      } catch (err: unknown) {
        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Orders load nahi ho sake. Dobara try karein."
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadOrders();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredOrders = useMemo(() => {
    const term = search.toLowerCase().trim();

    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(term) ||
        (order.customer_name || "").toLowerCase().includes(term) ||
        (order.customer_phone || "").toLowerCase().includes(term);

      const matchesStatus =
        filter === "all" || order.status === filter;

      const month = new Date(order.created_at).getMonth();
      const matchesDate =
        dateFilter === "all" ||
        (dateFilter === "current" &&
          month === new Date().getMonth());

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [orders, search, filter, dateFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / pageSize)
  );

  const safePage = Math.min(currentPage, totalPages);

  const paginatedOrders = filteredOrders.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  const countStatus = (status: OrderStatus) =>
    orders.filter((order) => order.status === status).length;

  const totalRevenue = orders
    .filter((order) => order.status !== "cancelled")
    .reduce((sum, order) => sum + Number(order.total_amount || 0), 0);

  function exportCSV() {
    const headers = [
      "Order ID",
      "Customer",
      "Phone",
      "Amount",
      "Date",
      "Status",
      "Address",
    ];

    const rows = filteredOrders.map((order) => [
      order.id,
      order.customer_name,
      order.customer_phone || "",
      order.total_amount,
      formatDate(order.created_at),
      statusLabels[order.status],
      order.delivery_address || "",
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
    anchor.download = "khasstore-orders.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function clearFilters() {
    setSearch("");
    setFilter("all");
    setDateFilter("all");
    setCurrentPage(1);
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-800">
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 border-r lg:block">
        <Sidebar />
      </aside>

      {mobileSidebar && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close sidebar"
            className="absolute inset-0 bg-slate-950/50"
            onClick={() => setMobileSidebar(false)}
          />
          <aside className="relative h-full w-72 max-w-[85%] shadow-2xl">
            <button
              onClick={() => setMobileSidebar(false)}
              className="absolute right-3 top-4 z-10 rounded-lg p-2 hover:bg-slate-100"
              aria-label="Close menu"
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
              <h1 className="text-lg font-bold md:text-xl">
                Orders Management
              </h1>
              <p className="text-xs text-slate-500">
                Manage and track your customer orders
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="relative rounded-lg border p-2.5 text-slate-600 hover:bg-slate-50"
              aria-label="Notifications"
            >
              <Bell size={19} />
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#163b75] text-xs font-bold text-white">
              KS
            </div>
          </div>
        </header>

        <div className="space-y-7 p-4 md:p-8">
          <section className="flex flex-col justify-between gap-5 rounded-2xl bg-gradient-to-r from-[#10264b] to-[#2860ad] p-6 text-white md:flex-row md:items-center md:p-7">
            <div>
              <p className="text-xs font-semibold tracking-wider text-blue-200">
                ORDER MANAGEMENT
              </p>
              <h2 className="mt-2 text-2xl font-bold md:text-3xl">
                Manage Customer Orders
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100">
                Keep track of purchases and monitor order progress.
              </p>
            </div>
            <div className="flex min-w-40 items-center gap-4 rounded-xl bg-white/10 p-4">
              <ShoppingBag size={30} />
              <div>
                <p className="text-sm text-blue-100">Total Orders</p>
                <p className="text-2xl font-extrabold">{orders.length}</p>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: "Total Orders",
                value: orders.length,
                icon: ShoppingBag,
                color: "text-blue-700",
                bg: "bg-blue-50",
              },
              {
                title: "Pending Orders",
                value: countStatus("pending"),
                icon: Clock,
                color: "text-amber-700",
                bg: "bg-amber-50",
              },
              {
                title: "Confirmed",
                value: countStatus("confirmed"),
                icon: Package,
                color: "text-purple-700",
                bg: "bg-purple-50",
              },
              {
                title: "Delivered",
                value: countStatus("delivered"),
                icon: CheckCircle,
                color: "text-green-700",
                bg: "bg-green-50",
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
                  <h3 className="mt-4 text-3xl font-extrabold">
                    {item.value}
                  </h3>
                </div>
              );
            })}
          </section>

          <section className="flex flex-col justify-between gap-3 rounded-2xl border bg-white p-5 shadow-sm sm:flex-row sm:items-center">
            <div>
              <p className="text-sm text-slate-500">
                Total Order Value (excluding cancelled)
              </p>
              <h2 className="mt-2 text-2xl font-extrabold text-[#163b75]">
                {formatCurrency(totalRevenue)}
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Total order value, not seller profit or payout
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <ArrowUpRight size={18} className="text-green-600" />
              <span>{orders.length} orders</span>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            <div className="border-b p-5">
              <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
                <div>
                  <h2 className="font-bold">All Orders</h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Search and filter your customer orders
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="flex items-center gap-2 rounded-lg border bg-slate-50 px-3 py-2.5">
                    <Search size={17} className="shrink-0 text-slate-400" />
                    <input
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                      }}
                      placeholder="Search orders or customers..."
                      className="w-full bg-transparent text-sm outline-none sm:w-56"
                    />
                    {search && (
                      <button
                        onClick={() => setSearch("")}
                        aria-label="Clear search"
                      >
                        <X size={15} />
                      </button>
                    )}
                  </div>

                  <select
                    value={dateFilter}
                    onChange={(e) => {
                      setDateFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="rounded-lg border bg-white px-3 py-2.5 text-sm outline-none"
                    aria-label="Filter by date"
                  >
                    <option value="all">All dates</option>
                    <option value="current">This month</option>
                  </select>

                  <button
                    onClick={exportCSV}
                    disabled={filteredOrders.length === 0}
                    className="flex items-center justify-center gap-2 rounded-lg bg-[#163b75] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:opacity-40"
                  >
                    <Download size={17} />
                    Export CSV
                  </button>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {["all", ...statuses].map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setFilter(item);
                      setCurrentPage(1);
                    }}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                      filter === item
                        ? "bg-[#163b75] text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {item === "all" ? "All" : statusLabels[item as OrderStatus]}
                    {` (${item === "all" ? orders.length : countStatus(item as OrderStatus)})`}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead className="bg-slate-50 text-xs text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Order ID</th>
                    <th className="px-5 py-4">Customer</th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4">Amount</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-16 text-center text-slate-500">
                        Loading orders...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-16 text-center text-red-600">
                        {error}
                      </td>
                    </tr>
                  ) : paginatedOrders.map((order) => (
                    <tr key={order.id} className="transition hover:bg-slate-50">
                      <td className="px-5 py-4 font-semibold text-blue-700">
                        #{order.id.slice(0, 8)}
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-semibold">{order.customer_name}</p>
                        <p className="mt-1 text-xs text-slate-400">
                          {order.customer_phone || "No phone provided"}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-slate-500">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-5 py-4 font-semibold">
                        {formatCurrency(order.total_amount)}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="rounded-lg border p-2 text-blue-700 transition hover:bg-blue-50"
                          title="View order"
                          aria-label="View order"
                        >
                          <Eye size={17} />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {!loading && !error && paginatedOrders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-5 py-16 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                          <Filter size={22} />
                        </div>
                        <p className="mt-3 font-semibold text-slate-700">
                          No orders found
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          Orders placed by customers will appear here.
                        </p>
                        <button
                          onClick={clearFilters}
                          className="mt-4 text-sm font-semibold text-blue-700 hover:underline"
                        >
                          Clear filters
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col justify-between gap-3 border-t px-5 py-4 sm:flex-row sm:items-center">
              <p className="text-xs text-slate-500">
                Showing{" "}
                {filteredOrders.length === 0
                  ? 0
                  : (safePage - 1) * pageSize + 1}
                {" - "}
                {Math.min(safePage * pageSize, filteredOrders.length)} of{" "}
                {filteredOrders.length} orders
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled={safePage === 1}
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  className="rounded-lg border p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="px-3 text-sm font-semibold">
                  {safePage} / {totalPages}
                </span>
                <button
                  disabled={safePage >= totalPages}
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  className="rounded-lg border p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
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

      {selectedOrder && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setSelectedOrder(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="my-6 w-full max-w-xl rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h2 className="text-xl font-bold">Order Details</h2>
                <p className="mt-1 text-xs text-slate-500">
                  #{selectedOrder.id.slice(0, 8)}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg p-2 hover:bg-slate-100"
                aria-label="Close order details"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-slate-500">Order Status</span>
                <StatusBadge status={selectedOrder.status} />
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <h3 className="font-bold">{selectedOrder.customer_name}</h3>
                <p className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                  <Phone size={15} />
                  {selectedOrder.customer_phone || "Phone not provided"}
                </p>
                <p className="mt-3 flex items-start gap-2 text-sm text-slate-500">
                  <MapPin size={15} className="mt-0.5 shrink-0" />
                  <span>{selectedOrder.delivery_address || "Address not provided"}</span>
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold">Order Information</h3>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Order Date</span>
                  <span className="text-sm font-semibold">
                    {formatDate(selectedOrder.created_at)}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-4">
                  <span className="font-semibold">Total Amount</span>
                  <span className="text-lg font-extrabold text-[#163b75]">
                    {formatCurrency(selectedOrder.total_amount)}
                  </span>
                </div>
              </div>

              <p className="rounded-lg bg-blue-50 p-3 text-xs leading-5 text-blue-800">
                Order status updates will be enabled after the database update
                permission is configured.
              </p>

              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full rounded-xl bg-[#163b75] py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
