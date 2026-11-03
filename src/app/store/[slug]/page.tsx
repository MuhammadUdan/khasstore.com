
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  MapPin,
  Package,
  Search,
  ShoppingCart,
  Store,
} from "lucide-react";
import { createClient } from "../../lib/supabase/client";

type SellerStore = {
  user_id: string;
  shop_name: string;
  city: string | null;
  business_address: string | null;
  product_categories: string[] | null;
  created_at: string;
};

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category: string | null;
  image_url: string | null;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function formatPKR(amount: number) {
  return `Rs. ${Number(amount || 0).toLocaleString("en-PK")}`;
}

export default function StorefrontPage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = useMemo(() => createClient(), []);

  const [seller, setSeller] = useState<SellerStore | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Products");
  const [sortBy, setSortBy] = useState("featured");
  const [showAbout, setShowAbout] = useState(false);

  const loadStore = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      // Approved sellers ki public list
      const { data: sellers, error: sellerError } = await supabase
        .from("seller_applications")
        .select(
          "user_id, shop_name, city, business_address, product_categories, created_at"
        )
        .eq("status", "approved");

      if (sellerError) throw sellerError;

      const matchedSeller = (sellers || []).find(
        (item) => slugify(item.shop_name) === params.slug
      );

      if (!matchedSeller) {
        setSeller(null);
        setProducts([]);
        return;
      }

      setSeller(matchedSeller);

      // Is seller ke active products
      const { data: productData, error: productError } = await supabase
        .from("products")
        .select(
          "id, name, description, price, stock, category, image_url"
        )
        .eq("seller_id", matchedSeller.user_id)
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (productError) throw productError;

      setProducts(productData || []);
    } catch (err) {
      console.error("Storefront error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Store load nahi ho saka. Dobara try karein."
      );
    } finally {
      setLoading(false);
    }
  }, [params.slug, supabase]);

  useEffect(() => {
    loadStore();
  }, [loadStore]);

  const categories = useMemo(() => {
    const values = Array.from(
      new Set(
        products
          .map((product) => product.category)
          .filter((value): value is string => Boolean(value))
      )
    );

    return ["All Products", ...values];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (category !== "All Products") {
      result = result.filter((product) => product.category === category);
    }

    const query = search.trim().toLowerCase();

    if (query) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          (product.category || "").toLowerCase().includes(query)
      );
    }

    if (sortBy === "low") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "high") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    }

    return result;
  }, [products, category, search, sortBy]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="font-semibold text-slate-600">Store loading...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 p-5">
        <p className="text-center text-red-600">{error}</p>
        <button
          onClick={loadStore}
          className="rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white"
        >
          Try Again
        </button>
      </main>
    );
  }

  if (!seller) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 p-5">
        <Store size={45} className="text-slate-300" />
        <h1 className="text-xl font-bold">Store Not Found</h1>
        <p className="text-sm text-slate-500">
          Ye store available nahi hai ya seller approved nahi hai.
        </p>
        <Link href="/" className="font-semibold text-blue-700">
          Back to KhasStore
        </Link>
      </main>
    );
  }


  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Bar */}
      <div className="bg-[#10264b] px-5 py-2 text-center text-sm text-white">
        Secure Payments | Easy Returns
      </div>

      {/* Main Navigation */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5">
          <Link href="/" className="text-2xl font-extrabold text-[#163b75]">
            KhasStore<span className="text-blue-500">.com</span>
          </Link>

          <div className="hidden flex-1 items-center rounded-xl border bg-slate-50 px-4 py-3 md:flex md:max-w-xl">
            <Search size={19} className="text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products on KhasStore..."
              className="ml-3 w-full bg-transparent text-sm outline-none"
            />
          </div>

          <Link
            href="/login"
            className="flex items-center gap-2 text-sm font-medium text-slate-700"
          >
            My Account <ShoppingCart size={21} />
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-6">
        <Link
          href="/"
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
        >
          <ArrowLeft size={17} />
          Back to KhasStore Marketplace
        </Link>

        {/* Store Banner */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#10264b] to-[#2458a2]">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -right-10 -top-20 h-80 w-80 rounded-full border-[40px] border-white" />
            <div className="absolute right-40 top-20 h-48 w-48 rounded-full border-[25px] border-white" />
          </div>

          <div className="relative px-7 py-14 text-white md:px-12">
            <p className="mb-3 text-sm font-medium text-blue-200">
              WELCOME TO OUR STORE
            </p>
            <h1 className="text-3xl font-extrabold md:text-5xl">
              {seller.shop_name}
            </h1>
            <p className="mt-3 max-w-xl text-sm text-blue-100 md:text-base">
              Explore products available at {seller.shop_name} on KhasStore.
            </p>
          </div>
        </section>

        {/* Store Information */}
        <section className="relative -mt-7 mx-3 rounded-2xl border bg-white p-5 shadow-sm md:mx-7 md:flex md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-[#163b75]">
              <Store size={34} />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold">{seller.shop_name}</h2>
                <BadgeCheck size={19} className="text-blue-600" />
                <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">
                  Verified Seller
                </span>
              </div>

              {seller.city && (
                <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                  <MapPin size={14} />
                  {seller.city}, Pakistan
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 flex gap-7 border-t pt-4 md:mt-0 md:border-0 md:pt-0">
            <div>
              <p className="text-xl font-bold">{products.length}</p>
              <p className="text-xs text-slate-500">Active Products</p>
            </div>
            <div>
              <p className="text-xl font-bold">â€”</p>
              <p className="text-xs text-slate-500">Rating</p>
            </div>
            <div>
              <p className="text-xl font-bold">
                {new Date(seller.created_at).getFullYear()}
              </p>
              <p className="text-xs text-slate-500">Joined Year</p>
            </div>
          </div>
        </section>

        {/* Store Navigation */}
        <nav className="mt-8 flex gap-7 overflow-x-auto border-b text-sm font-semibold">
          <button
            onClick={() => {
              setCategory("All Products");
              setShowAbout(false);
            }}
            className={`whitespace-nowrap border-b-2 pb-3 ${
              !showAbout
                ? "border-blue-700 text-blue-700"
                : "border-transparent text-slate-500"
            }`}
          >
            All Products
          </button>

          {categories.slice(1).map((item) => (
            <button
              key={item}
              onClick={() => {
                setCategory(item);
                setShowAbout(false);
              }}
              className={`whitespace-nowrap border-b-2 pb-3 ${
                category === item && !showAbout
                  ? "border-blue-700 text-blue-700"
                  : "border-transparent text-slate-500 hover:text-blue-700"
              }`}
            >
              {item}
            </button>
          ))}

          <button
            onClick={() => setShowAbout(true)}
            className={`whitespace-nowrap border-b-2 pb-3 ${
              showAbout
                ? "border-blue-700 text-blue-700"
                : "border-transparent text-slate-500 hover:text-blue-700"
            }`}
          >
            About Store
          </button>
        </nav>

        {showAbout ? (
          <section className="mt-8 rounded-2xl border bg-white p-6">
            <h2 className="text-xl font-bold">About {seller.shop_name}</h2>
            <p className="mt-3 text-sm text-slate-600">
              {seller.business_address || "Store address not provided."}
            </p>
            {seller.product_categories?.length ? (
              <p className="mt-3 text-sm text-slate-600">
                Categories: {seller.product_categories.join(", ")}
              </p>
            ) : null}
          </section>
        ) : (
          <>
            {/* Products Heading */}
            <section className="mt-8">
              <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-2xl font-bold">Store Products</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Explore products from {seller.shop_name}
                  </p>
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-lg border bg-white px-3 py-2 text-sm outline-none"
                >
                  <option value="featured">Featured</option>
                  <option value="low">Price: Low to High</option>
                  <option value="high">Price: High to Low</option>
                </select>
              </div>

              <div className="mb-5 flex items-center gap-2 rounded-lg border bg-white px-3 py-2 md:hidden">
                <Search size={16} className="text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search store products..."
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>

              {/* Product Grid */}
              {filteredProducts.length === 0 ? (
                <div className="rounded-2xl border border-dashed bg-white px-5 py-16 text-center">
                  <Package
                    size={38}
                    className="mx-auto mb-3 text-slate-300"
                  />
                  <h3 className="font-semibold text-slate-600">
                    No products found
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Is store mein abhi koi active product available nahi hai.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {filteredProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.id}`}
                      className="block overflow-hidden rounded-xl border bg-white transition hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="relative flex h-44 items-center justify-center bg-slate-100 md:h-56">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Package size={42} className="text-slate-300" />
                        )}

                        <span className="absolute left-2 top-2 rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-blue-700 shadow-sm">
                          Verified Seller
                        </span>
                      </div>

                      <div className="p-3 md:p-4">
                        {product.category && (
                          <p className="mb-2 text-xs text-slate-500">
                            {product.category}
                          </p>
                        )}

                        <h3 className="min-h-10 text-sm font-semibold leading-5">
                          {product.name}
                        </h3>

                        <div className="mt-3">
                          <span className="font-bold text-[#163b75]">
                            {formatPKR(Number(product.price))}
                          </span>
                        </div>

                        <p className="mt-2 text-xs text-slate-500">
                          {product.stock > 0
                            ? `${product.stock} in stock`
                            : "Out of stock"}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {/* Store Footer */}
        <footer className="mt-16 rounded-2xl bg-[#10264b] px-6 py-8 text-center text-white">
          <Package size={30} className="mx-auto mb-3 text-blue-300" />
          <h3 className="text-xl font-bold">Shop with Confidence</h3>
          <p className="mt-2 text-sm text-blue-100">
            Discover trusted sellers and quality products on KhasStore.
          </p>
          <Link
            href="/"
            className="mt-5 inline-block rounded-lg bg-white px-5 py-3 text-sm font-bold text-[#163b75] hover:bg-blue-50"
          >
            Explore KhasStore
          </Link>
        </footer>
      </div>
    </main>
  );
}

