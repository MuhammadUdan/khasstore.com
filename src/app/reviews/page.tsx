
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
  Menu,
  X,
  Search,
  MessageSquare,
  ThumbsUp,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Send,
  Filter,
} from "lucide-react";

const initialReviews = [
  {
    id: 1,
    customer: "Ahmed Khan",
    product: "Wireless Bluetooth Headphones",
    rating: 5,
    date: "31 Oct 2026",
    comment:
      "Excellent quality and amazing sound. Product bilkul description ke mutabiq hai. Delivery bhi achi thi.",
    verified: true,
    helpful: 12,
    reply: "",
  },
  {
    id: 2,
    customer: "Sara Ali",
    product: "Premium Smart Watch",
    rating: 4,
    date: "30 Oct 2026",
    comment:
      "Watch achi hai aur battery timing bhi theek hai. Packaging thori aur better ho sakti thi.",
    verified: true,
    helpful: 8,
    reply: "Thank you for your valuable feedback. We will improve our packaging.",
  },
  {
    id: 3,
    customer: "Usman Malik",
    product: "Bluetooth Speaker",
    rating: 5,
    date: "29 Oct 2026",
    comment:
      "Very good sound quality. Highly recommended. I will shop again.",
    verified: true,
    helpful: 6,
    reply: "",
  },
  {
    id: 4,
    customer: "Fatima Noor",
    product: "Desk Accessories",
    rating: 3,
    date: "28 Oct 2026",
    comment:
      "Product is okay but delivery took longer than expected.",
    verified: true,
    helpful: 3,
    reply: "",
  },
  {
    id: 5,
    customer: "Bilal Ahmed",
    product: "Classic Wrist Watch",
    rating: 2,
    date: "27 Oct 2026",
    comment:
      "The product was not exactly what I expected. Please improve product details.",
    verified: true,
    helpful: 2,
    reply: "",
  },
  {
    id: 6,
    customer: "Ayesha Malik",
    product: "Wireless Mouse",
    rating: 5,
    date: "26 Oct 2026",
    comment:
      "Perfect product. Smooth performance and very reasonable price.",
    verified: true,
    helpful: 9,
    reply: "",
  },
  {
    id: 7,
    customer: "Hassan Raza",
    product: "Gaming Keyboard",
    rating: 4,
    date: "25 Oct 2026",
    comment:
      "Good keyboard and nice design. Keys feel comfortable.",
    verified: true,
    helpful: 4,
    reply: "",
  },
];

type Review = (typeof initialReviews)[number];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((number) => (
        <Star
          key={number}
          size={16}
          className={
            number <= rating
              ? "fill-amber-400 text-amber-400"
              : "text-slate-200"
          }
        />
      ))}
    </div>
  );
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
                const active = item.href === "/reviews";

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

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("All");
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [replyReview, setReplyReview] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  const pageSize = 5;

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) /
        reviews.length
      : 0;

  const filteredReviews = useMemo(() => {
    const term = search.toLowerCase().trim();

    return reviews.filter((review) => {
      const matchesSearch =
        review.customer.toLowerCase().includes(term) ||
        review.product.toLowerCase().includes(term) ||
        review.comment.toLowerCase().includes(term);

      const matchesRating =
        ratingFilter === "All" ||
        review.rating === Number(ratingFilter);

      return matchesSearch && matchesRating;
    });
  }, [reviews, search, ratingFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredReviews.length / pageSize)
  );

  const visibleReviews = filteredReviews.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const ratingCount = (rating: number) =>
    reviews.filter((review) => review.rating === rating).length;

  const submitReply = (id: number) => {
    const message = replyText.trim();

    if (!message) return;

    setReviews((previous) =>
      previous.map((review) =>
        review.id === id ? { ...review, reply: message } : review
      )
    );

    setReplyReview(null);
    setReplyText("");
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
              <h1 className="text-xl font-bold">Reviews & Ratings</h1>
              <p className="text-xs text-slate-500">
                Manage your customer feedback
              </p>
            </div>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#163b75] text-xs font-bold text-white">
            AE
          </div>
        </header>

        <div className="space-y-7 p-4 md:p-8">
          {/* Banner */}
          <section className="flex flex-col justify-between gap-5 rounded-2xl bg-gradient-to-r from-[#10264b] to-[#2860ad] p-6 text-white md:flex-row md:items-center">
            <div>
              <p className="text-xs font-semibold tracking-wider text-blue-200">
                CUSTOMER FEEDBACK
              </p>
              <h2 className="mt-2 text-2xl font-bold md:text-3xl">
                Reviews & Ratings
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100">
                Understand your customers and build a trusted seller reputation.
              </p>
            </div>

            <div className="rounded-xl bg-white/10 p-4">
              <div className="flex items-center gap-2">
                <Star className="fill-amber-400 text-amber-400" size={27} />
                <span className="text-3xl font-extrabold">
                  {averageRating.toFixed(1)}
                </span>
                <span className="text-sm text-blue-100">/ 5</span>
              </div>
              <p className="mt-2 text-sm text-blue-100">
                Average seller rating
              </p>
            </div>
          </section>

          {/* Summary */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">Total Reviews</p>
                <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
                  <MessageSquare size={21} />
                </div>
              </div>
              <h3 className="mt-4 text-3xl font-extrabold">
                {reviews.length}
              </h3>
              <p className="mt-2 text-xs text-slate-400">
                Customer feedback received
              </p>
            </div>

            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">Average Rating</p>
                <div className="rounded-xl bg-amber-50 p-3 text-amber-700">
                  <Star size={21} />
                </div>
              </div>
              <h3 className="mt-4 text-3xl font-extrabold">
                {averageRating.toFixed(1)} / 5
              </h3>
              <div className="mt-2">
                <Stars rating={Math.round(averageRating)} />
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">Verified Reviews</p>
                <div className="rounded-xl bg-green-50 p-3 text-green-700">
                  <CheckCircle size={21} />
                </div>
              </div>
              <h3 className="mt-4 text-3xl font-extrabold">
                {reviews.filter((review) => review.verified).length}
              </h3>
              <p className="mt-2 text-xs text-slate-400">
                Reviews marked as verified purchases in demo data
              </p>
            </div>
          </section>

          {/* Rating Breakdown */}
          <section className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="font-bold">Rating Breakdown</h2>
            <p className="mt-1 text-xs text-slate-500">
              Distribution of customer ratings
            </p>

            <div className="mt-6 space-y-4">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = ratingCount(rating);
                const percentage =
                  reviews.length > 0
                    ? (count / reviews.length) * 100
                    : 0;

                return (
                  <div
                    key={rating}
                    className="flex items-center gap-3"
                  >
                    <div className="flex w-16 shrink-0 items-center gap-1">
                      <span className="text-sm font-semibold">{rating}</span>
                      <Star
                        size={14}
                        className="fill-amber-400 text-amber-400"
                      />
                    </div>

                    <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-amber-400 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <span className="w-8 text-right text-xs text-slate-500">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Reviews List */}
          <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            <div className="border-b p-5">
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                <div>
                  <h2 className="font-bold">Customer Reviews</h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Read customer feedback and respond professionally
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="flex items-center gap-2 rounded-lg border bg-slate-50 px-3 py-2.5">
                    <Search size={17} className="text-slate-400" />
                    <input
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                      }}
                      placeholder="Search reviews..."
                      className="w-full bg-transparent text-sm outline-none sm:w-48"
                    />
                  </div>

                  <select
                    value={ratingFilter}
                    onChange={(e) => {
                      setRatingFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                    aria-label="Filter by rating"
                  >
                    <option value="All">All ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {visibleReviews.map((review) => (
                <article key={review.id} className="p-5">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 font-bold text-blue-800">
                        {review.customer
                          .split(" ")
                          .map((part) => part[0])
                          .join("")
                          .slice(0, 2)}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold">{review.customer}</h3>
                          {review.verified && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-[10px] font-semibold text-green-700">
                              <CheckCircle size={12} />
                              Verified Purchase
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-xs text-slate-500">
                          {review.product}
                        </p>

                        <div className="mt-2">
                          <Stars rating={review.rating} />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <CalendarDays size={14} />
                      {review.date}
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    {review.comment}
                  </p>

                  {review.reply && (
                    <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
                      <p className="text-xs font-bold text-blue-800">
                        Your response
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {review.reply}
                      </p>
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-3">
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <ThumbsUp size={14} />
                      {review.helpful} found helpful
                    </span>

                    <button
                      onClick={() => {
                        setReplyReview(
                          replyReview === review.id ? null : review.id
                        );
                        setReplyText(review.reply);
                      }}
                      className="flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50"
                    >
                      <MessageSquare size={15} />
                      {review.reply ? "Edit Reply" : "Reply to Review"}
                    </button>
                  </div>

                  {replyReview === review.id && (
                    <div className="mt-4 rounded-xl bg-slate-50 p-4">
                      <label className="mb-2 block text-xs font-semibold">
                        Your response
                      </label>

                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        rows={3}
                        maxLength={500}
                        placeholder="Write a professional reply..."
                        className="w-full resize-y rounded-lg border bg-white p-3 text-sm outline-none focus:border-blue-500"
                      />

                      <div className="mt-2 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                        <span className="text-xs text-slate-400">
                          {replyText.length}/500 characters
                        </span>

                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setReplyReview(null);
                              setReplyText("");
                            }}
                            className="rounded-lg border bg-white px-3 py-2 text-xs font-semibold text-slate-600"
                          >
                            Cancel
                          </button>

                          <button
                            onClick={() => submitReply(review.id)}
                            disabled={!replyText.trim()}
                            className="flex items-center gap-2 rounded-lg bg-[#163b75] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Send size={14} />
                            Save Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              ))}

              {visibleReviews.length === 0 && (
                <div className="px-5 py-16 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    <Filter size={22} />
                  </div>
                  <p className="mt-3 font-semibold">No reviews found</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Try another search or rating filter.
                  </p>
                  <button
                    onClick={() => {
                      setSearch("");
                      setRatingFilter("All");
                      setCurrentPage(1);
                    }}
                    className="mt-4 text-sm font-semibold text-blue-700 hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="flex flex-col justify-between gap-3 border-t px-5 py-4 sm:flex-row sm:items-center">
              <p className="text-xs text-slate-500">
                Showing {filteredReviews.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
                {" - "}
                {Math.min(currentPage * pageSize, filteredReviews.length)} of{" "}
                {filteredReviews.length} reviews
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

                <span className="px-3 text-sm font-semibold">
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
