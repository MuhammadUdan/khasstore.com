"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Wallet,
  Settings,
  Store,
  Plus,
  TrendingUp,
  Eye,
  Star,
  ArrowUpRight,
  Bell,
  Search,
  Menu,
  X,
  MoreHorizontal,
  CheckCircle,
  LogOut,
} from "lucide-react";
import { createClient } from "../lib/supabase/client";

type Order = {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: string;
  date: string;
};

type SellerInfo = {
  fullName: string;
  shopName: string;
  status: string;
};

type DashboardStats = {
  sales: number;
  orders: number;
  products: number;
  pendingOrders: number;
};

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
      { label: "My Store", href: "/dashboard", icon: Store },
      { label: "Reviews", href: "/reviews", icon: Star },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

function formatPKR(amount: number) {
  return `Rs. ${Number(amount || 0).toLocaleString("en-PK", {
    maximumFractionDigits: 0,
  })}`;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function displayStatus(status: string) {
  const labels: Record<string, string> = {
    pending: "Pending",
    confirmed: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };

  return labels[status?.toLowerCase()] || status;
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Processing: "bg-blue-50 text-blue-700",
    Shipped: "bg-purple-50 text-purple-700",
    Delivered: "bg-green-50 text-green-700",
    Pending: "bg-amber-50 text-amber-700",
    Cancelled: "bg-red-50 text-red-700",
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
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [seller, setSeller] = useState<SellerInfo | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    sales: 0,
    orders: 0,
    products: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
  }, [orders, search]);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.replace("/login");
        return;
      }

      // Seller profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError || !profile) {
        throw new Error("Account profile load nahi ho saka.");
      }

      if (profile.role !== "seller" && profile.role !== "admin") {
        router.replace("/");
        return;
      }

      // Seller application
      const { data: application, error: applicationError } = await supabase
        .from("seller_applications")
        .select("shop_name, status")
        .eq("user_id", user.id)
        .maybeSingle();

      if (applicationError) {
        throw new Error("Seller information load nahi ho saki.");
      }

      if (profile.role === "seller" && application?.status !== "approved") {
        router.replace("/seller-profile");
        return;
      }

      setSeller({
        fullName:
          profile.full_name || user.email?.split("@")[0] || "Seller",
        shopName: application?.shop_name || "My Store",
        status: application?.status || "admin",
      });

      // Seller's products count
      const { count: productCount, error: productsError } = await supabase
        .from("products")
        .select("id", { count: "exact", head: true })
        .eq("seller_id", user.id);

      if (productsError) {
        throw new Error("Products load nahi ho sake: " + productsError.message);
      }

      // Seller's orders
      const { data: orderData, error: ordersError } = await supabase
        .from("orders")
        .select("id, customer_name, total_amount, status, created_at")
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false });

      if (ordersError) {
        throw new Error("Orders load nahi ho sake: " + ordersError.message);
      }

      const allOrders = orderData || [];

      // Sales = delivered orders only
      const deliveredSales = allOrders
        .filter((order) => order.status?.toLowerCase() === "delivered")
        .reduce(
          (total, order) => total + Number(order.total_amount || 0),
          0
        );

      const pendingCount = allOrders.filter(
        (order) => order.status?.toLowerCase() === "pending"
      ).length;

      setStats({
        sales: deliveredSales,
        orders: allOrders.length,
        products: productCount || 0,
        pendingOrders: pendingCount,
      });

      // Latest five orders
      setOrders(
        allOrders.slice(0, 5).map((order) => ({
          id: order.id,
          customer: order.customer_name || "Customer",
          product: "—",
          amount: Number(order.total_amount || 0),
          status: displayStatus(order.status),
          date: order.created_at,
        }))
      );
    } catch (err) {
      console.error("Dashboard error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Dashboard load nahi ho saka. Dobara try karein."
      );
    } finally {
      setLoading(false);
    }
  }, [router, supabase]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  function closeMenu() {
    setMobileMenuOpen(false);
  }

  const initials = (seller?.shopName || "KS")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");

  const storeSlug = (seller?.shopName || "my-store")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const statCards = [
    {
      title: "Total Sales",
      value: formatPKR(stats.sales),
      change: "From delivered orders",
      icon: Wallet,
    },
    {
      title: "Total Orders",
      value: stats.orders.toLocaleString(),
      change: `${stats.pendingOrders} pending orders`,
      icon: ShoppingBag,
    },
    {
      title: "Total Products",
      value: stats.products.toLocaleString(),
      change: "Your listed products",
      icon: Package,
    },
    {
      title: "Store Visits",
      value: "0",
      change: "Visit tracking not enabled",
      icon: Eye,
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f7fb]">
        <p className="text-sm font-semibold text-slate-600">
          Dashboard loading...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f5f7fb] p-5">
        <p className="text-center text-sm text-red-600">{error}</p>
        <button
          onClick={loadDashboard}
          className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!seller) return null;

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-800">
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
            <p className="mt-1 text-xs text-slate-400">Seller Dashboard</p>
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
                      key={item.label}
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
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">{seller.shopName}</p>
              <p className="text-xs text-slate-500">Seller Account</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="mt-3 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="min-w-0 lg:ml-64">
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
                Welcome back, {seller.fullName}!
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
            </button>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#163b75] text-xs font-bold text-white">
              {initials}
            </div>
          </div>
        </header>

        <div className="space-y-7 p-4 md:p-8">
          {/* Welcome banner */}
          <section className="flex flex-col justify-between gap-5 overflow-hidden rounded-2xl bg-gradient-to-r from-[#10264b] to-[#2860ad] p-6 text-white md:flex-row md:items-center md:p-8">
            <div>
              <p className="text-sm text-blue-200">SELLER CONTROL PANEL</p>
              <h2 className="mt-2 text-2xl font-bold md:text-3xl">
                Welcome back, {seller.fullName}! 👋
              </h2>
              <p className="mt-2 max-w-xl text-sm text-blue-100">
                {seller.shopName} — manage your store and grow your business
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
              {statCards.map((stat) => {
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

                    <p className="mt-2 text-xs text-slate-400">
                      {stat.change}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Sales overview */}
          <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
              <h2 className="font-bold">Sales Overview</h2>
              <p className="mt-1 text-xs text-slate-500">
                Total revenue from delivered orders
              </p>

              <div className="mt-8 flex h-48 items-center justify-center rounded-xl border border-dashed border-slate-200">
                <div className="text-center">
                  <TrendingUp
                    className="mx-auto mb-3 text-slate-300"
                    size={34}
                  />
                  <p className="text-2xl font-extrabold text-slate-800">
                    {formatPKR(stats.sales)}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Total delivered sales
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-bold">Quick Information</h2>
              <p className="mt-1 text-xs text-slate-500">Your seller account</p>

              <div className="mt-6 space-y-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-500">Store Name</span>
                  <span className="max-w-[55%] truncate text-right text-sm font-bold">
                    {seller.shopName}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Store Status</span>
                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Verification</span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-blue-700">
                    <CheckCircle size={14} /> Approved
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Pending Orders</span>
                  <span className="font-bold">{stats.pendingOrders}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Commission</span>
                  <span className="text-sm font-bold text-slate-500">
                    Not configured
                  </span>
                </div>
              </div>

              <Link
                href={`/store/${storeSlug}`}
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
              {filteredOrders.length === 0 ? (
                <div className="px-5 py-12 text-center">
                  <ShoppingBag
                    className="mx-auto mb-3 text-slate-300"
                    size={36}
                  />
                  <p className="text-sm font-semibold text-slate-500">
                    No orders received yet
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Customer orders will appear here.
                  </p>
                </div>
              ) : (
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
                          #{order.id.slice(0, 8).toUpperCase()}
                        </td>
                        <td className="px-5 py-4">{order.customer}</td>
                        <td className="px-5 py-4">{order.product}</td>
                        <td className="px-5 py-4 font-semibold">
                          {formatPKR(order.amount)}
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="px-5 py-4">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            aria-label={`View order ${order.id}`}
                            className="rounded-lg p-2 hover:bg-slate-100"
                          >
                            <MoreHorizontal size={19} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>

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
              <h2 id="order-dialog-title" className="text-lg font-bold">
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

            <div className="mt-5 space-y-4 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Order ID</span>
                <span className="font-semibold">
                  #{selectedOrder.id.slice(0, 8).toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Customer</span>
                <span className="font-semibold">{selectedOrder.customer}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Amount</span>
                <span className="font-semibold">
                  {formatPKR(selectedOrder.amount)}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Status</span>
                <StatusBadge status={selectedOrder.status} />
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Date</span>
                <span className="font-semibold">
                  {formatDate(selectedOrder.date)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}