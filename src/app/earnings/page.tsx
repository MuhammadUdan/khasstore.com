
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
  Bell,
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

const transactions = [
  {
    id: "TXN-1001",
    order: "#KS-10241",
    customer: "Ahmed Khan",
    product: "Wireless Bluetooth Headphones",
    date: "31 Oct 2026",
    amount: 3499,
    commission: 175,
    earning: 3324,
    status: "Pending",
  },
  {
    id: "TXN-1002",
    order: "#KS-10240",
    customer: "Sara Ali",
    product: "Premium Smart Watch",
    date: "30 Oct 2026",
    amount: 5499,
    commission: 275,
    earning: 5224,
    status: "Processing",
  },
  {
    id: "TXN-1003",
    order: "#KS-10239",
    customer: "Usman Malik",
    product: "Bluetooth Speaker",
    date: "29 Oct 2026",
    amount: 2799,
    commission: 140,
    earning: 2659,
    status: "Paid",
  },
  {
    id: "TXN-1004",
    order: "#KS-10238",
    customer: "Fatima Noor",
    product: "Desk Accessories",
    date: "28 Oct 2026",
    amount: 3798,
    commission: 190,
    earning: 3608,
    status: "Pending",
  },
  {
    id: "TXN-1005",
    order: "#KS-10236",
    customer: "Ayesha Malik",
    product: "Wireless Mouse",
    date: "26 Oct 2026",
    amount: 2598,
    commission: 130,
    earning: 2468,
    status: "Paid",
  },
];

type Transaction = (typeof transactions)[number];

const statusStyles: Record<string, string> = {
  Paid: "bg-green-50 text-green-700",
  Pending: "bg-amber-50 text-amber-700",
  Processing: "bg-blue-50 text-blue-700",
};

function money(value: number) {
  return `Rs. ${value.toLocaleString("en-PK")}`;
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
        <Link href="/" onClick={onNavigate} className="text-2xl font-extrabold text-[#163b75]">
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

export default function EarningsPage() {
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [period, setPeriod] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 5;

  const filteredTransactions = useMemo(() => {
    if (period === "Paid") {
      return transactions.filter((item) => item.status === "Paid");
    }

    if (period === "Pending") {
      return transactions.filter((item) => item.status === "Pending");
    }

    return transactions;
  }, [period]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTransactions.length / pageSize)
  );

  const visibleTransactions = filteredTransactions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const availableBalance = transactions
    .filter((item) => item.status === "Paid")
    .reduce((sum, item) => sum + item.earning, 0);

  const pendingBalance = transactions
    .filter((item) => item.status !== "Paid")
    .reduce((sum, item) => sum + item.earning, 0);

  const totalEarnings = transactions.reduce(
    (sum, item) => sum + item.earning,
    0
  );

  const exportCSV = () => {
    const headers = [
      "Transaction ID",
      "Order ID",
      "Customer",
      "Product",
      "Date",
      "Order Amount",
      "Commission",
      "Seller Earning",
      "Status",
    ];

    const rows = filteredTransactions.map((item) => [
      item.id,
      item.order,
      item.customer,
      item.product,
      item.date,
      item.amount,
      item.commission,
      item.earning,
      item.status,
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
                Track your store earnings and transactions
              </p>
            </div>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#163b75] text-xs font-bold text-white">
            AE
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
                Monitor your sales, commissions and payout balance in one place.
              </p>
            </div>

            <div className="rounded-xl bg-white/10 p-4">
              <Wallet size={28} />
              <p className="mt-3 text-sm text-blue-100">Total Earnings</p>
              <p className="text-2xl font-extrabold">
                {money(totalEarnings)}
              </p>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[
              {
                title: "Available Balance",
                value: availableBalance,
                icon: CheckCircle,
                color: "text-green-700",
                bg: "bg-green-50",
                description: "Demo paid transactions",
              },
              {
                title: "Pending Balance",
                value: pendingBalance,
                icon: Clock,
                color: "text-amber-700",
                bg: "bg-amber-50",
                description: "Awaiting payout processing",
              },
              {
                title: "Total Earnings",
                value: totalEarnings,
                icon: TrendingUp,
                color: "text-blue-700",
                bg: "bg-blue-50",
                description: "After demo commission",
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
                  Bank account, JazzCash or Easypaisa setup will be available
                  after payment integration.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-amber-50 p-3 text-amber-700">
                  <CalendarDays size={22} />
                </div>
                <div>
                  <h3 className="font-bold">Payout Information</h3>
                  <p className="text-xs text-slate-500">
                    Understand your balance
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Paid transactions</span>
                  <span className="font-semibold">
                    {transactions.filter((item) => item.status === "Paid").length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Pending transactions</span>
                  <span className="font-semibold">
                    {transactions.filter((item) => item.status !== "Paid").length}
                  </span>
                </div>
                <p className="border-t pt-3 text-xs leading-5 text-slate-400">
                  These figures are illustrative demo data. Actual payout
                  eligibility and timing will follow KhasStore payment rules.
                </p>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-4 border-b p-5 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-bold">Transaction History</h2>
                <p className="mt-1 text-xs text-slate-500">
                  View order amounts, marketplace commission and seller earnings
                </p>
              </div>

              <button
                onClick={exportCSV}
                className="flex items-center justify-center gap-2 rounded-lg bg-[#163b75] px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
              >
                <ArrowDownToLine size={17} />
                Export CSV
              </button>
            </div>

            <div className="flex flex-wrap gap-2 p-5">
              {["All", "Paid", "Pending"].map((item) => (
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

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-slate-50 text-xs text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Transaction</th>
                    <th className="px-5 py-4">Order / Customer</th>
                    <th className="px-5 py-4">Order Amount</th>
                    <th className="px-5 py-4">Commission</th>
                    <th className="px-5 py-4">Your Earning</th>
                    <th className="px-5 py-4">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {visibleTransactions.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <p className="font-semibold">{item.id}</p>
                        <p className="mt-1 text-xs text-slate-400">
                          {item.date}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-semibold">{item.order}</p>
                        <p className="mt-1 text-xs text-slate-400">
                          {item.customer}
                        </p>
                      </td>
                      <td className="px-5 py-4">{money(item.amount)}</td>
                      <td className="px-5 py-4 text-red-600">
                        - {money(item.commission)}
                      </td>
                      <td className="px-5 py-4 font-bold text-slate-800">
                        {money(item.earning)}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyles[item.status]}`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {visibleTransactions.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-5 py-12 text-center text-slate-500"
                      >
                        No transactions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t px-5 py-4">
              <p className="text-xs text-slate-500">
                Showing {filteredTransactions.length} transactions
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
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
                  disabled={currentPage >= totalPages}
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
