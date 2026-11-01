
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
  Star,
  Search,
  Bell,
  Menu,
  Eye,
  X,
  MapPin,
  Phone,
  CheckCircle,
  Clock,
  Download,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Filter,
  Mail,
  RefreshCw,
} from "lucide-react";

const initialOrders = [
  {
    id: "#KS-10241",
    customer: "Ahmed Khan",
    email: "ahmed@example.com",
    phone: "0300-1234567",
    product: "Wireless Bluetooth Headphones",
    quantity: 1,
    amount: 3499,
    date: "31 Oct 2026",
    status: "Processing",
    address: "Gulshan-e-Iqbal, Karachi, Pakistan",
  },
  {
    id: "#KS-10240",
    customer: "Sara Ali",
    email: "sara@example.com",
    phone: "0301-7654321",
    product: "Premium Smart Watch",
    quantity: 1,
    amount: 5499,
    date: "30 Oct 2026",
    status: "Shipped",
    address: "DHA Phase 5, Lahore, Pakistan",
  },
  {
    id: "#KS-10239",
    customer: "Usman Malik",
    email: "usman@example.com",
    phone: "0302-9876543",
    product: "Bluetooth Speaker",
    quantity: 1,
    amount: 2799,
    date: "29 Oct 2026",
    status: "Delivered",
    address: "Blue Area, Islamabad, Pakistan",
  },
  {
    id: "#KS-10238",
    customer: "Fatima Noor",
    email: "fatima@example.com",
    phone: "0303-4567890",
    product: "Desk Accessories",
    quantity: 2,
    amount: 3798,
    date: "28 Oct 2026",
    status: "Pending",
    address: "Johar Town, Lahore, Pakistan",
  },
  {
    id: "#KS-10237",
    customer: "Bilal Ahmed",
    email: "bilal@example.com",
    phone: "0304-1112233",
    product: "Classic Wrist Watch",
    quantity: 1,
    amount: 4299,
    date: "27 Oct 2026",
    status: "Cancelled",
    address: "North Nazimabad, Karachi, Pakistan",
  },
  {
    id: "#KS-10236",
    customer: "Ayesha Malik",
    email: "ayesha@example.com",
    phone: "0305-2223344",
    product: "Wireless Mouse",
    quantity: 2,
    amount: 2598,
    date: "26 Oct 2026",
    status: "Pending",
    address: "Clifton, Karachi, Pakistan",
  },
  {
    id: "#KS-10235",
    customer: "Hassan Raza",
    email: "hassan@example.com",
    phone: "0306-3334455",
    product: "Gaming Keyboard",
    quantity: 1,
    amount: 4999,
    date: "25 Oct 2026",
    status: "Delivered",
    address: "Model Town, Lahore, Pakistan",
  },
  {
    id: "#KS-10234",
    customer: "Zainab Ahmed",
    email: "zainab@example.com",
    phone: "0307-4445566",
    product: "Smart LED Lamp",
    quantity: 1,
    amount: 1899,
    date: "24 Oct 2026",
    status: "Shipped",
    address: "F-10, Islamabad, Pakistan",
  },
];

type Order = (typeof initialOrders)[number];
type OrderStatus = Order["status"];

const statuses: OrderStatus[] = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const statusStyles: Record<OrderStatus, string> = {
  Pending: "bg-amber-50 text-amber-700 ring-amber-200",
  Processing: "bg-blue-50 text-blue-700 ring-blue-200",
  Shipped: "bg-purple-50 text-purple-700 ring-purple-200",
  Delivered: "bg-green-50 text-green-700 ring-green-200",
  Cancelled: "bg-red-50 text-red-700 ring-red-200",
};

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}

function formatCurrency(amount: number) {
  return `Rs. ${amount.toLocaleString("en-PK")}`;
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
        <Link
          href="/"
          onClick={onNavigate}
          className="text-2xl font-extrabold text-[#163b75]"
        >
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
            AE
          </div>
          <div>
            <p className="text-sm font-bold">Ali Electronics</p>
            <p className="text-xs text-slate-500">Verified Seller</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pendingStatus, setPendingStatus] = useState<OrderStatus | null>(null);

  const pageSize = 5;

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const term = search.toLowerCase().trim();

      const matchesSearch =
        order.id.toLowerCase().includes(term) ||
        order.customer.toLowerCase().includes(term) ||
        order.product.toLowerCase().includes(term) ||
        order.phone.toLowerCase().includes(term);

      const matchesStatus = filter === "All" || order.status === filter;

      const matchesDate =
        dateFilter === "All" ||
        (dateFilter === "October" && order.date.includes("Oct"));

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [orders, search, filter, dateFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));

  const safePage = Math.min(currentPage, totalPages);

  const paginatedOrders = filteredOrders.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  const countStatus = (status: string) =>
    orders.filter((order) => order.status === status).length;

  const totalRevenue = orders
    .filter((order) => order.status !== "Cancelled")
    .reduce((sum, order) => sum + order.amount, 0);

  const updateStatus = (id: string, status: OrderStatus) => {
    setOrders((previous) =>
      previous.map((order) =>
        order.id === id ? { ...order, status } : order
      )
    );

    setSelectedOrder((previous) =>
      previous && previous.id === id
        ? { ...previous, status }
        : previous
    );

    setPendingStatus(null);
  };

  const exportCSV = () => {
    const headers = [
      "Order ID",
      "Customer",
      "Email",
      "Phone",
      "Product",
      "Quantity",
      "Amount",
      "Date",
      "Status",
      "Address",
    ];

    const rows = filteredOrders.map((order) => [
      order.id,
      order.customer,
      order.email,
      order.phone,
      order.product,
      order.quantity,
      order.amount,
      order.date,
      order.status,
      order.address,
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
  };

  const changeFilter = (value: string) => {
    setFilter(value);
    setCurrentPage(1);
  };

  const changeSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-800">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 border-r lg:block">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar */}
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

      {/* Main Content */}
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
              title="Notifications"
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
          {/* Welcome Banner */}
          <section className="flex flex-col justify-between gap-5 rounded-2xl bg-gradient-to-r from-[#10264b] to-[#2860ad] p-6 text-white md:flex-row md:items-center md:p-7">
            <div>
              <p className="text-xs font-semibold tracking-wider text-blue-200">
                ORDER MANAGEMENT
              </p>
              <h2 className="mt-2 text-2xl font-bold md:text-3xl">
                Manage Customer Orders
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100">
                Keep track of purchases, manage order progress and deliver a
                great shopping experience.
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

          {/* Summary Cards */}
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
                value: countStatus("Pending"),
                icon: Clock,
                color: "text-amber-700",
                bg: "bg-amber-50",
              },
              {
                title: "Processing",
                value: countStatus("Processing"),
                icon: Package,
                color: "text-purple-700",
                bg: "bg-purple-50",
              },
              {
                title: "Delivered",
                value: countStatus("Delivered"),
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

          {/* Order Value */}
          <section className="flex flex-col justify-between gap-3 rounded-2xl border bg-white p-5 shadow-sm sm:flex-row sm:items-center">
            <div>
              <p className="text-sm text-slate-500">
                Total Order Value (excluding cancelled)
              </p>
              <h2 className="mt-2 text-2xl font-extrabold text-[#163b75]">
                {formatCurrency(totalRevenue)}
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Demo order value, not seller profit or payout
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <ArrowUpRight size={18} className="text-green-600" />
              <span>{orders.length} demo orders</span>
            </div>
          </section>

          {/* Orders Table */}
          <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            <div className="border-b p-5">
              <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
                <div>
                  <h2 className="font-bold">All Orders</h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Search, filter and manage your customer orders
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="flex items-center gap-2 rounded-lg border bg-slate-50 px-3 py-2.5">
                    <Search size={17} className="shrink-0 text-slate-400" />
                    <input
                      value={search}
                      onChange={(e) => changeSearch(e.target.value)}
                      placeholder="Search orders or customers..."
                      className="w-full bg-transparent text-sm outline-none sm:w-56"
                    />
                    {search && (
                      <button
                        onClick={() => changeSearch("")}
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
                    className="rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                    aria-label="Filter by date"
                  >
                    <option value="All">All dates</option>
                    <option value="October">October 2026</option>
                  </select>

                  <button
                    onClick={exportCSV}
                    className="flex items-center justify-center gap-2 rounded-lg bg-[#163b75] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
                  >
                    <Download size={17} />
                    Export CSV
                  </button>
                </div>
              </div>

              {/* Status Filters */}
              <div className="mt-5 flex flex-wrap gap-2">
                {["All", ...statuses].map((item) => (
                  <button
                    key={item}
                    onClick={() => changeFilter(item)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                      filter === item
                        ? "bg-[#163b75] text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {item}
                    {item === "All"
                      ? ` (${orders.length})`
                      : ` (${countStatus(item)})`}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-slate-50 text-xs text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Order ID</th>
                    <th className="px-5 py-4">Customer</th>
                    <th className="px-5 py-4">Product</th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4">Amount</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {paginatedOrders.map((order) => (
                    <tr key={order.id} className="transition hover:bg-slate-50">
                      <td className="px-5 py-4 font-semibold text-blue-700">
                        {order.id}
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-semibold">{order.customer}</p>
                        <p className="mt-1 text-xs text-slate-400">
                          {order.phone}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="max-w-52 truncate">{order.product}</p>
                        <p className="mt-1 text-xs text-slate-400">
                          Qty: {order.quantity}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-slate-500">
                        {order.date}
                      </td>

                      <td className="px-5 py-4 font-semibold">
                        {formatCurrency(order.amount)}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={order.status} />
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setPendingStatus(null);
                          }}
                          className="rounded-lg border p-2 text-blue-700 transition hover:bg-blue-50"
                          title="View order"
                          aria-label={`View ${order.id}`}
                        >
                          <Eye size={17} />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {paginatedOrders.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-5 py-16 text-center"
                      >
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                          <Filter size={22} />
                        </div>
                        <p className="mt-3 font-semibold text-slate-700">
                          No orders found
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          Try changing your search or filters.
                        </p>
                        <button
                          onClick={() => {
                            setSearch("");
                            setFilter("All");
                            setDateFilter("All");
                            setCurrentPage(1);
                          }}
                          className="mt-4 text-sm font-semibold text-blue-700 hover:underline"
                        >
                          Clear all filters
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
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
                  onClick={() =>
                    setCurrentPage((page) => Math.max(1, page - 1))
                  }
                  className="rounded-lg border p-2 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={18} />
                </button>

                <span className="px-3 text-sm font-semibold">
                  {safePage} / {totalPages}
                </span>

                <button
                  disabled={safePage >= totalPages}
                  onClick={() =>
                    setCurrentPage((page) => Math.min(totalPages, page + 1))
                  }
                  className="rounded-lg border p-2 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
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

      {/* Order Details Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedOrder(null);
              setPendingStatus(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-modal-title"
            className="my-6 w-full max-w-xl rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h2 id="order-modal-title" className="text-xl font-bold">
                  Order Details
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  {selectedOrder.id}
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedOrder(null);
                  setPendingStatus(null);
                }}
                className="rounded-lg p-2 hover:bg-slate-100"
                aria-label="Close order details"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm text-slate-500">Current Status</span>
                <StatusBadge status={selectedOrder.status} />
              </div>

              {/* Customer */}
              <div className="rounded-xl bg-slate-50 p-4">
                <h3 className="font-bold">{selectedOrder.customer}</h3>

                <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                  <Mail size={15} />
                  {selectedOrder.email}
                </p>

                <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                  <Phone size={15} />
                  {selectedOrder.phone}
                </p>

                <p className="mt-2 flex items-start gap-2 text-sm text-slate-500">
                  <MapPin size={15} className="mt-0.5 shrink-0" />
                  <span>{selectedOrder.address}</span>
                </p>
              </div>

              {/* Product */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold">Product Information</h3>

                <div className="flex items-start justify-between gap-4">
                  <span className="text-sm text-slate-500">Product</span>
                  <span className="max-w-64 text-right text-sm font-semibold">
                    {selectedOrder.product}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Quantity</span>
                  <span className="text-sm font-semibold">
                    {selectedOrder.quantity}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Order Date</span>
                  <span className="text-sm font-semibold">
                    {selectedOrder.date}
                  </span>
                </div>

                <div className="flex justify-between border-t pt-4">
                  <span className="font-semibold">Total Amount</span>
                  <span className="text-lg font-extrabold text-[#163b75]">
                    {formatCurrency(selectedOrder.amount)}
                  </span>
                </div>
              </div>

              {/* Status Update */}
              <div className="rounded-xl border p-4">
                <label className="mb-2 block text-sm font-semibold">
                  Update Order Status
                </label>

                <select
                  value={pendingStatus ?? selectedOrder.status}
                  onChange={(e) =>
                    setPendingStatus(e.target.value as OrderStatus)
                  }
                  className="w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>

                {pendingStatus && pendingStatus !== selectedOrder.status && (
                  <div className="mt-3 rounded-lg bg-amber-50 p-3">
                    <p className="text-xs leading-5 text-amber-800">
                      You are changing this order from{" "}
                      <strong>{selectedOrder.status}</strong> to{" "}
                      <strong>{pendingStatus}</strong>.
                    </p>

                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => setPendingStatus(null)}
                        className="flex-1 rounded-lg border bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                      >
                        Cancel
                      </button>

                      <button
                        onClick={() =>
                          updateStatus(selectedOrder.id, pendingStatus)
                        }
                        className="flex-1 rounded-lg bg-[#163b75] px-3 py-2 text-xs font-semibold text-white hover:bg-blue-800"
                      >
                        Confirm Update
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  setSelectedOrder(null);
                  setPendingStatus(null);
                }}
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
