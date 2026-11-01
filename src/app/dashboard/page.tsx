
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Wallet,
  Settings,
  Store,
  Plus,
  TrendingUp,
  TrendingDown,
  Eye,
  Star,
  ArrowUpRight,
  Bell,
  Search,
  Menu,
  X,
  MoreHorizontal,
  CheckCircle,
  Truck,
  Clock,
  XCircle,
} from "lucide-react";

const stats = [
  {
    title: "Total Sales",
    value: "Rs. 245,800",
    change: "+12.5%",
    positive: true,
    icon: Wallet,
  },
  {
    title: "Total Orders",
    value: "184",
    change: "+8.2%",
    positive: true,
    icon: ShoppingBag,
  },
  {
    title: "Total Products",
    value: "56",
    change: "+4 new",
    positive: true,
    icon: Package,
  },
  {
    title: "Store Visits",
    value: "8,420",
    change: "-2.4%",
    positive: false,
    icon: Eye,
  },
];

const orders = [
  {
    id: "#KS-10241",
    customer: "Ahmed Khan",
    product: "Wireless Headphones",
    amount: "Rs. 3,499",
    status: "Processing",
    date: "31 Oct 2026",
  },
  {
    id: "#KS-10240",
    customer: "Sara Ali",
    product: "Smart Watch",
    amount: "Rs. 5,499",
    status: "Shipped",
    date: "30 Oct 2026",
  },
  {
    id: "#KS-10239",
    customer: "Usman Malik",
    product: "Bluetooth Speaker",
    amount: "Rs. 2,799",
    status: "Delivered",
    date: "29 Oct 2026",
  },
  {
    id: "#KS-10238",
    customer: "Fatima Noor",
    product: "Desk Accessories",
    amount: "Rs. 1,899",
    status: "Pending",
    date: "28 Oct 2026",
  },
];

const navigation = [
  {
    heading: "Main Menu",
    items: [
      { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
      { label: "My Products", href: "/products", icon: Package },
      { label: "Orders", href: "/orders", icon: ShoppingBag },
      { label: "Earnings", href: "/earnings", icon: Wallet },
    ],
  },
  {
    heading: "Store Management",
    items: [
      { label: "My Store", href: "/store/ali-electronics", icon: Store },
      { label: "Reviews", href: "/reviews", icon: Star },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Processing: "bg-blue-50 text-blue-700",
    Shipped: "bg-purple-50 text-purple-700",
    Delivered: "bg-green-50 text-green-700",
    Pending: "bg-amber-50 text-amber-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
        styles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}

export default function DashboardPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] =
    useState<(typeof orders)[number] | null>(null);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return orders;

    return orders.filter((order) =>
      [
        order.id,
        order.customer,
        order.product,
        order.status,
      ].some((value) => value.toLowerCase().includes(query))
    );
  }, [search]);

  function closeMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-800">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <button
          aria-label="Close navigation"
          onClick={closeMenu}
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between border-b px-6 py-6">
          <div>
            <Link
              href="/"
              onClick={closeMenu}
              className="text-2xl font-extrabold text-[#163b75]"
            >
              KhasStore<span className="text-blue-500">.com</span>
            </Link>
            <p className="mt-1 text-xs text-slate-400">
              Seller Dashboard
            </p>
          </div>

          <button
            onClick={closeMenu}
            aria-label="Close menu"
            className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          {navigation.map((group) => (
            <div key={group.heading} className="mb-8">
              <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {group.heading}
              </p>

              <nav className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = item.href === "/dashboard";

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMenu}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                        active
                          ? "bg-blue-50 font-semibold text-blue-700"
                          : "text-slate-600 hover:bg-slate-50 hover:text-blue-700"
                      }`}
                    >
                      <Icon size={19} />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        <div className="border-t p-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-800">
              AE
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">
                Ali Electronics
              </p>
              <p className="text-xs text-slate-500">
                Verified Seller
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="min-w-0 lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4 md:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
              className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
            >
              <Menu size={22} />
            </button>

            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold md:text-xl">
                Dashboard Overview
              </h1>
              <p className="hidden text-xs text-slate-500 sm:block">
                Welcome back, Ali! Here is your store summary.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden items-center gap-2 rounded-lg border bg-slate-50 px-3 py-2 md:flex">
              <Search size={17} className="text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search orders..."
                aria-label="Search recent orders"
                className="w-32 bg-transparent text-sm outline-none"
              />
            </div>

            <button
              aria-label="Notifications"
              title="Notifications"
              className="relative rounded-lg border p-2.5 hover:bg-slate-50"
            >
              <Bell size={19} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
            </button>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#163b75] text-xs font-bold text-white">
              AE
            </div>
          </div>
        </header>

        <div className="space-y-7 p-4 md:p-8">
          {/* Welcome banner */}
          <section className="flex flex-col justify-between gap-5 overflow-hidden rounded-2xl bg-gradient-to-r from-[#10264b] to-[#2860ad] p-6 text-white md:flex-row md:items-center md:p-8">
            <div>
              <p className="text-sm text-blue-200">
                SELLER CONTROL PANEL
              </p>
              <h2 className="mt-2 text-2xl font-bold md:text-3xl">
                Welcome back, Ali! 👋
              </h2>
              <p className="mt-2 max-w-xl text-sm text-blue-100">
                Manage your products, track orders and grow your business
                with KhasStore.
              </p>
            </div>

            <Link
              href="/products"
              className="flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#163b75] shadow-sm transition hover:bg-blue-50"
            >
              <Plus size={18} />
              Add New Product
            </Link>
          </section>

          {/* Stats */}
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-bold">Store Performance</h2>
              <p className="text-xs text-slate-500">
                Your store activity at a glance
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.title}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-500">
                        {stat.title}
                      </p>
                      <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
                        <Icon size={21} />
                      </div>
                    </div>

                    <h3 className="mt-4 text-2xl font-extrabold">
                      {stat.value}
                    </h3>

                    <div className="mt-2 flex items-center gap-1 text-xs">
                      {stat.positive ? (
                        <TrendingUp
                          size={15}
                          className="text-green-600"
                        />
                      ) : (
                        <TrendingDown
                          size={15}
                          className="text-red-500"
                        />
                      )}

                      <span
                        className={
                          stat.positive
                            ? "font-semibold text-green-600"
                            : "font-semibold text-red-500"
                        }
                      >
                        {stat.change}
                      </span>
                      <span className="text-slate-400">
                        vs last month
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Sales chart and quick information */}
          <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold">Sales Overview</h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Your sales performance this week
                  </p>
                </div>
                <span className="rounded-lg border bg-slate-50 px-3 py-2 text-xs text-slate-600">
                  This Week
                </span>
              </div>

              <div className="mt-8 flex h-48 items-end justify-between gap-3 border-b border-l px-2 pb-2">
                {[38, 58, 45, 78, 55, 90, 70].map(
                  (height, index) => (
                    <div
                      key={index}
                      className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                    >
                      <div
                        style={{ height: `${height}%` }}
                        className="w-full max-w-12 rounded-t-lg bg-blue-600 transition hover:bg-blue-800"
                      />
                      <span className="text-[10px] text-slate-400">
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
                      </span>
                    </div>
                  )
                )}
              </div>
              <p className="mt-3 text-center text-[11px] text-slate-400">
                Illustrative demo sales data
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-bold">Quick Information</h2>
              <p className="mt-1 text-xs text-slate-500">
                Your seller account
              </p>

              <div className="mt-6 space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Store Status
                  </span>
                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Verification
                  </span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-blue-700">
                    <CheckCircle size={14} /> Verified
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Pending Orders
                  </span>
                  <span className="font-bold">12</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Commission
                  </span>
                  <span className="font-bold">5%</span>
                </div>
              </div>

              <Link
                href="/store/ali-electronics"
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50"
              >
                <Store size={17} />
                View My Store
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </section>

          {/* Recent orders */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-3 border-b p-5 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-bold">Recent Orders</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Latest customer orders in your store
                </p>
              </div>

              <Link
                href="/orders"
                className="flex items-center gap-1 text-xs font-semibold text-blue-700 hover:underline"
              >
                View All Orders <ArrowUpRight size={14} />
              </Link>
            </div>

            <div className="border-b px-5 py-3 md:hidden">
              <div className="flex items-center gap-2 rounded-lg border bg-slate-50 px-3 py-2">
                <Search size={16} className="text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search recent orders..."
                  aria-label="Search recent orders"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left text-sm">
                <thead className="bg-slate-50 text-xs text-slate-500">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Order ID</th>
                    <th className="px-5 py-4 font-semibold">Customer</th>
                    <th className="px-5 py-4 font-semibold">Product</th>
                    <th className="px-5 py-4 font-semibold">Amount</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                    <th className="px-5 py-4 font-semibold">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4 font-semibold text-blue-700">
                        {order.id}
                      </td>
                      <td className="px-5 py-4">{order.customer}</td>
                      <td className="px-5 py-4">{order.product}</td>
                      <td className="px-5 py-4 font-semibold">
                        {order.amount}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          aria-label={`View ${order.id}`}
                          className="rounded-lg p-2 hover:bg-slate-100"
                        >
                          <MoreHorizontal size={19} />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filteredOrders.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-5 py-10 text-center text-sm text-slate-400"
                      >
                        No matching orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Footer */}
          <footer className="flex flex-col items-center justify-between gap-3 pb-4 text-xs text-slate-400 sm:flex-row">
            <p>© 2026 KhasStore.com. All rights reserved.</p>
            <p>Seller Dashboard · Built for better business</p>
          </footer>
        </div>
      </main>

      {/* Order details popup */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-dialog-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2
                id="order-dialog-title"
                className="text-lg font-bold"
              >
                Order Details
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                aria-label="Close order details"
                className="rounded-lg p-2 hover:bg-slate-100"
              >
                <X size={19} />
              </button>
            </div>

            <p className="mt-4 text-sm font-bold text-blue-700">
              {selectedOrder.id}
            </p>

            <div className="mt-5 space-y-4 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Customer</span>
                <span className="text-right font-semibold">
                  {selectedOrder.customer}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Product</span>
                <span className="text-right font-semibold">
                  {selectedOrder.product}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Amount</span>
                <span className="font-semibold">
                  {selectedOrder.amount}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Date</span>
                <span className="font-semibold">
                  {selectedOrder.date}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500">Status</span>
                <StatusBadge status={selectedOrder.status} />
              </div>
            </div>

            <Link
              href="/orders"
              onClick={() => setSelectedOrder(null)}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#163b75] px-4 py-3 text-sm font-semibold text-white hover:bg-blue-900"
            >
              Go to Orders <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
