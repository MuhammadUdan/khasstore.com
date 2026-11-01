"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import LoginModal from "../components/LoginModel";
import SellerRegisterModal from "../components/SellerRegisterModal";
import CartCheckoutModal, {
 type CartItem
} from "../components/CartCheckoutModal";

import {
  Search,
  ShoppingCart,
  UserRound,
  Heart,
  ShieldCheck,
  RotateCcw,
  Headphones,
  ArrowRight,
  Menu,
  X,
  ChevronRight,
  Star,
  Truck,
  Sparkles,
  Zap,
  CheckCircle2,
  Package,
  Globe,
  Camera,
  Mail,
  MapPin,
} from "lucide-react";


  const photo = (id: string, width = 700) =>
    `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

  const categories = [
    { name: "Mobiles", image: "photo-1511707171634-5f897ff02aa9", color: "bg-blue-50" },
    { name: "Laptops", image: "photo-1496181133206-80ce9b88a853", color: "bg-purple-50" },
    { name: "Headphones", image: "photo-1505740420928-5e560c06d30e", color: "bg-orange-50" },
    { name: "Fashion", image: "photo-1529139574466-a303027c1d8b", color: "bg-pink-50" },
    { name: "Shoes", image: "photo-1542291026-7eec264c27ff", color: "bg-red-50" },
    { name: "Home & Living", image: "photo-1600210492486-724fe5c67fb0", color: "bg-green-50" },
    { name: "Beauty", image: "photo-1596462502278-27bfdc403348", color: "bg-rose-50" },
    { name: "Watches", image: "photo-1523275335684-37898b6baf30", color: "bg-amber-50" },
  ];

  const products = [
    {
      id: "1",
      name: "Wireless Bluetooth Headphones",
      category: "Headphones",
      price: 4500,
      oldPrice: 6000,
      rating: 4.8,
      reviews: 124,
      image: "photo-1505740420928-5e560c06d30e",
      discount: "25% OFF",
      seller: "Ali Electronics",
    },
    {
      id: "2",
      name: "Smart Watch Series 8",
      category: "Watches",
      price: 6500,
      oldPrice: 8000,
      rating: 4.6,
      reviews: 86,
      image: "photo-1523275335684-37898b6baf30",
      discount: "19% OFF",
      seller: "Ali Electronics",
    },
    {
      id: "3",
      name: "Premium Sports Shoes",
      category: "Shoes",
      price: 3800,
      oldPrice: 5000,
      rating: 4.7,
      reviews: 56,
      image: "photo-1542291026-7eec264c27ff",
      discount: "24% OFF",
      seller: "Ali Store",
    },
    {
      id: "4",
      name: "Everyday Travel Backpack",
      category: "Fashion",
      price: 3499,
      oldPrice: 4500,
      rating: 4.6,
      reviews: 65,
      image: "photo-1553062407-98eeb64c6a62",
      discount: "22% OFF",
      seller: "KhasStore",
    },
  ];

  const formatPrice = (price: number) =>
    `Rs. ${price.toLocaleString("en-PK")}`;

  export default function Home() {
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [wishlist, setWishlist] = useState<string[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
const [showCart, setShowCart] = useState(false);

useEffect(() => {
  try {
    const saved = localStorage.getItem("khasstore-cart");
    setCart(saved ? JSON.parse(saved) : []);
  } catch {
    setCart([]);
  }
}, []);
    const [mobileMenu, setMobileMenu] = useState(false);
    const [notice, setNotice] = useState("");

    const [showLogin, setShowLogin] = useState(false);
    const [showSellerRegister, setShowSellerRegister] = useState(false);
    const filteredProducts = useMemo(() => {
      return products.filter((product) => {
        const matchesSearch =
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.category.toLowerCase().includes(search.toLowerCase());

        const matchesCategory =
          activeCategory === "All" ||
          product.category.toLowerCase() === activeCategory.toLowerCase();

        return matchesSearch && matchesCategory;
      });
    }, [search, activeCategory]);

    const toggleWishlist = (id: string) => {
      setWishlist((current) =>
        current.includes(id)
          ? current.filter((item) => item !== id)
          : [...current, id]
      );
    };

    const addToCart = (id: string) => {
  const product = products.find((item) => item.id === id);
  if (!product) return;

  const saved = localStorage.getItem("khasstore-cart");
  const currentCart: CartItem[] = saved ? JSON.parse(saved) : [];

  const existing = currentCart.find((item) => item.id === id);

  let updatedCart: CartItem[];

  if (existing) {
    updatedCart = currentCart.map((item) =>
      item.id === id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  } else {
    updatedCart = [
      ...currentCart,
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: photo(product.image, 650),
        quantity: 1,
      },
    ];
  }

  localStorage.setItem("khasstore-cart", JSON.stringify(updatedCart));
  setCart(updatedCart);
  setNotice("Product added to your cart!");

  window.setTimeout(() => setNotice(""), 2500);
};

    return (
      <main className="min-h-screen overflow-hidden bg-white text-slate-900">

        {/* Announcement Bar */}
        <div className="bg-[#102b50] text-white">
          <div className="mx-auto flex max-w-[1400px] items-center justify-center gap-2 px-4 py-2.5 text-center text-xs font-medium sm:text-sm">
            <Sparkles size={15} className="text-amber-300" />
            Discover amazing deals at KhasStore
            <span className="hidden sm:inline"> — Your shopping destination!</span>
          </div>
        </div>

        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 shadow-sm backdrop-blur-md">
          <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-4 sm:px-6">

            <Link href="/" className="shrink-0 text-2xl font-black tracking-tight sm:text-3xl">
              <span className="text-[#1455a0]">KhasStore</span>
              <span className="text-slate-900">.com</span>
            </Link>

            {/* Desktop Search */}
            <div className="hidden max-w-2xl flex-1 items-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-blue-400 focus-within:bg-white md:flex">
              <Search size={20} className="shrink-0 text-slate-400" />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setActiveCategory("All");
                }}
                placeholder="Search products, categories..."
                className="ml-3 w-full bg-transparent text-sm outline-none"
              />
              <button
                onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
                className="rounded-lg bg-[#1455a0] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                Search
              </button>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-4 sm:gap-6">
              <Link href="/dashboard" className="hidden items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-blue-600 sm:flex">
                <UserRound size={21} />
                Seller
              </Link>

              <button
                onClick={() => setShowLogin(true)}
                aria-label="Login or Signup"
                title="Login / Signup"
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-blue-400 hover:bg-blue-50"
              >
                <UserRound size={21} className="text-[#1455a0]" />
                <span className="hidden lg:inline">Login / Signup</span>
              </button>

              <button
                onClick={() => {
                  setNotice(`You have ${wishlist.length} wishlist item(s).`);
                  window.setTimeout(() => setNotice(""), 2500);
                }}
                className="relative hidden sm:block"
                aria-label="Wishlist"
              >
                <Heart size={23} className="text-slate-700" />
                {wishlist.length > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {wishlist.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setNotice(`You have ${cart.length} cart item(s).`);
                  window.setTimeout(() => setNotice(""), 2500);
                }}
                className="relative"
                aria-label="Shopping cart"
              >
                <ShoppingCart size={24} className="text-slate-800" />
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                  {cart.length}
                </span>
              </button>

              <button
                onClick={() => setMobileMenu(!mobileMenu)}
                className="rounded-lg p-1 text-slate-800 md:hidden"
                aria-label="Toggle menu"
              >
                {mobileMenu ? <X size={25} /> : <Menu size={25} />}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="px-4 pb-3 md:hidden">
            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
              <Search size={19} className="text-slate-400" />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setActiveCategory("All");
                }}
                placeholder="Search products..."
                className="ml-3 w-full bg-transparent text-sm outline-none"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden border-t border-slate-100 md:block">
            <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-3 text-sm font-semibold text-slate-600">
              <Link href="/" className="text-blue-700">Home</Link>
              <a href="#categories" className="transition hover:text-blue-600">Categories</a>
              <a href="#products" className="transition hover:text-blue-600">Products</a>
              <a href="#deals" className="transition hover:text-blue-600">Deals</a>
              <a href="#why-us" className="transition hover:text-blue-600">Why KhasStore?</a>
              <Link href="/dashboard" className="transition hover:text-blue-600">Become a Seller</Link>
            </div>
          </nav>

          {/* Mobile Navigation */}
          {mobileMenu && (
            <div className="border-t border-slate-100 bg-white px-5 py-4 shadow-lg md:hidden">
              <div className="flex flex-col gap-4 text-sm font-semibold text-slate-700">
                <Link href="/" onClick={() => setMobileMenu(false)}>Home</Link>
                <a href="#categories" onClick={() => setMobileMenu(false)}>Categories</a>
                <a href="#products" onClick={() => setMobileMenu(false)}>Products</a>
                <a href="#deals" onClick={() => setMobileMenu(false)}>Deals</a>
                <Link href="/dashboard" onClick={() => setMobileMenu(false)}>Become a Seller</Link>
                <Link href="/settings" onClick={() => setMobileMenu(false)}>Settings</Link>
              </div>
            </div>
          )}
        </header>

        {/* Notification */}
        {notice && (
          <div className="fixed right-4 top-24 z-[70] flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-xl">
            <CheckCircle2 size={18} className="text-green-400" />
            {notice}
          </div>
        )}

        {/* Hero */}
        <section className="mx-auto max-w-[1400px] px-4 pt-6 sm:px-6 sm:pt-8">
          <div className="relative min-h-[450px] overflow-hidden rounded-[28px] bg-[#eaf2ff] md:min-h-[510px]">

            <div className="absolute inset-0">
              <img
                src={photo("photo-1490481651871-ab68de25d43d", 1600)}
                alt="KhasStore shopping collection"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#071d3a]/95 via-[#102b50]/75 to-transparent" />
            </div>

            <div className="relative z-10 flex min-h-[450px] max-w-2xl flex-col justify-center px-6 py-14 text-white sm:px-12 md:min-h-[510px] md:px-16">
              <span className="mb-6 flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold tracking-widest text-blue-100 backdrop-blur-sm">
                <Sparkles size={15} />
                WELCOME TO KHASSTORE
              </span>

              <h1 className="text-4xl font-black leading-[1.12] tracking-tight sm:text-5xl md:text-6xl">
                Shopping Made
                <br />
                <span className="text-blue-300">Special For You.</span>
              </h1>

              <p className="mt-6 max-w-lg text-sm leading-7 text-blue-100 sm:text-base">
                Discover quality products, explore exciting deals and enjoy a better shopping experience — all in one place.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#products"
                  className="flex items-center gap-3 rounded-xl bg-white px-7 py-4 text-sm font-extrabold text-[#1455a0] shadow-xl transition hover:-translate-y-1 hover:bg-blue-50"
                >
                  Explore Products
                  <ArrowRight size={18} />
                </a>
                <Link
                  href="/dashboard"
                  className="rounded-xl border border-white/40 bg-white/10 px-7 py-4 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
                >
                  Become a Seller
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap gap-6 text-xs font-semibold text-blue-100">
                <span className="flex items-center gap-2"><CheckCircle2 size={16} /> Quality Products</span>
                <span className="flex items-center gap-2"><ShieldCheck size={16} /> Trusted Shopping</span>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section id="why-us" className="mx-auto grid max-w-[1400px] grid-cols-1 gap-4 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {[
            { icon: Truck, title: "Fast Delivery", desc: "Convenient delivery experience" },
            { icon: ShieldCheck, title: "Secure Shopping", desc: "Shop with more confidence" },
            { icon: RotateCcw, title: "Easy Returns", desc: "Simple return experience" },
            { icon: Headphones, title: "Customer Support", desc: "We're here to help" },
          ].map((item) => (
            <div key={item.title} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
                <item.icon size={25} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{item.title}</h3>
                <p className="mt-1 text-xs text-slate-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Categories */}
        <section id="categories" className="mx-auto max-w-[1400px] px-4 py-9 sm:px-6">
          <div className="mb-7 flex items-end justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Explore collection</span>
              <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">Shop by Category</h2>
              <p className="mt-2 text-sm text-slate-500">Find exactly what you're looking for.</p>
            </div>
            <a href="#products" className="flex shrink-0 items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-800">
              Explore <ChevronRight size={17} />
            </a>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => {
                  const match = products.some(
                    (p) => p.category.toLowerCase() === category.name.toLowerCase()
                  );
                  setActiveCategory(match ? category.name : "All");
                  setSearch("");
                  document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="group overflow-hidden rounded-2xl border border-slate-100 bg-white text-left transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
              >
                <div className={`overflow-hidden ${category.color}`}>
                  <img
                    src={photo(category.image, 350)}
                    alt={category.name}
                    loading="lazy"
                    className="h-28 w-full object-cover transition duration-500 group-hover:scale-110 sm:h-32"
                  />
                </div>
                <div className="flex items-center justify-between px-3 py-4">
                  <h3 className="text-xs font-bold sm:text-sm">{category.name}</h3>
                  <ChevronRight size={15} className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600" />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Promotional Banner */}
        <section id="deals" className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#102b50] to-[#1455a0] px-6 py-10 text-white sm:px-12 md:flex md:items-center md:justify-between">
            <div className="relative z-10">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-200">
                <Zap size={16} className="text-yellow-300" />
                Special collection
              </span>
              <h2 className="mt-4 text-3xl font-black sm:text-4xl">Great Deals. Better Prices.</h2>
              <p className="mt-3 max-w-lg text-sm leading-6 text-blue-100">
                Explore our featured products and discover something special today.
              </p>
              <a href="#products" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-extrabold text-[#1455a0] transition hover:bg-blue-50">
                Shop Deals <ArrowRight size={17} />
              </a>
            </div>
            <div className="pointer-events-none absolute -right-10 -top-24 h-80 w-80 rounded-full border-[35px] border-white/10" />
            <div className="pointer-events-none absolute -bottom-36 right-32 h-80 w-80 rounded-full border-[35px] border-white/10" />
            <Sparkles size={110} className="absolute bottom-5 right-8 hidden text-white/10 md:block" />
          </div>
        </section>

        {/* Products */}
        <section id="products" className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Handpicked for you</span>
              <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">Trending Products</h2>
              <p className="mt-2 text-sm text-slate-500">Popular picks worth exploring.</p>
            </div>
            <Link href="/products" className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-800">
              View All Products <ChevronRight size={17} />
            </Link>
          </div>

          {/* Category Filter */}
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
            {["All", "Headphones", "Watches", "Shoes", "Fashion"].map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`shrink-0 rounded-full px-5 py-2.5 text-xs font-bold transition ${activeCategory === category
                  ? "bg-[#1455a0] text-white shadow-md"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-700"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {filteredProducts.map((product) => (
                <article
                  key={product.id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-xl"
                >
                  <div className="relative overflow-hidden bg-slate-50">
                    <Link href={`/product/${product.id}`}>
                      <img
                        src={photo(product.image, 650)}
                        alt={product.name}
                        loading="lazy"
                        className="h-44 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-60"
                      />
                    </Link>

                    <span className="absolute left-2 top-2 rounded-lg bg-red-500 px-2.5 py-1.5 text-[10px] font-extrabold text-white sm:left-3 sm:top-3 sm:text-xs">
                      {product.discount}
                    </span>

                    <button
                      onClick={() => toggleWishlist(product.id)}
                      aria-label="Toggle wishlist"
                      className="absolute right-2 top-2 rounded-full bg-white p-2.5 shadow-md transition hover:scale-110 sm:right-3 sm:top-3"
                    >
                      <Heart
                        size={17}
                        className={
                          wishlist.includes(product.id)
                            ? "fill-red-500 text-red-500"
                            : "text-slate-600"
                        }
                      />
                    </button>

                    <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded-md bg-green-600 px-2 py-1 text-[9px] font-bold text-white sm:bottom-3 sm:left-3 sm:text-[10px]">
                      <ShieldCheck size={12} />
                      DEMO VERIFIED
                    </span>
                  </div>

                  <div className="p-3 sm:p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600">{product.category}</p>
                    <Link href={`/product/${product.id}`}>
                      <h3 className="mt-2 min-h-10 text-xs font-bold leading-5 text-slate-900 transition hover:text-blue-700 sm:text-sm">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="text-sm font-black text-slate-900 sm:text-base">{formatPrice(product.price)}</span>
                      <span className="text-[10px] text-slate-400 line-through sm:text-xs">{formatPrice(product.oldPrice)}</span>
                    </div>

                    <div className="mt-3 flex items-center gap-1 text-[10px] text-slate-500 sm:text-xs">
                      <Star size={13} className="fill-amber-400 text-amber-400" />
                      <span className="font-bold text-slate-800">{product.rating}</span>
                      <span>({product.reviews} reviews)</span>
                    </div>

                    <button
                      onClick={() => addToCart(product.id)}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1455a0] py-3 text-xs font-bold text-white transition hover:bg-blue-700 sm:text-sm"
                    >
                      <ShoppingCart size={16} />
                      Add to Cart
                    </button>

                    <p className="mt-2 truncate text-center text-[10px] text-slate-400">
                      Sold by {product.seller}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 py-16 text-center">
              <Package size={40} className="mx-auto text-slate-300" />
              <h3 className="mt-4 font-bold text-slate-800">No products found</h3>
              <p className="mt-2 text-sm text-slate-500">Try another search or category.</p>
              <button
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All");
                }}
                className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white"
              >
                Clear Filters
              </button>
            </div>
          )}
        </section>

        {/* Seller CTA */}
        <section className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
          <div className="grid overflow-hidden rounded-3xl bg-[#f0f5ff] md:grid-cols-2">
            <div className="flex flex-col justify-center p-7 sm:p-12">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Grow with us</span>
              <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
                Have Products to Sell?
                <span className="block text-blue-600">Join KhasStore.</span>
              </h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-slate-600">
                Bring your products to our marketplace and start building your online store.
              </p>
              <Link href="/dashboard" className="mt-7 flex w-fit items-center gap-2 rounded-xl bg-[#1455a0] px-6 py-4 text-sm font-bold text-white shadow-lg transition hover:-translate-y-1 hover:bg-blue-700">
                Become a Seller <ArrowRight size={18} />
              </Link>
            </div>
            <div className="min-h-64">
              <img
                src={photo("photo-1556742049-0cfed4f6a45d", 1000)}
                alt="Online business and shopping"
                className="h-full min-h-64 w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
          <div className="rounded-3xl border border-blue-100 bg-blue-50 px-6 py-10 text-center sm:px-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
              <Mail size={26} />
            </div>
            <h2 className="mt-5 text-2xl font-black sm:text-3xl">Stay in the Loop</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-600">
              Stay connected with KhasStore for updates, new collections and exciting offers.
            </p>
            <p className="mt-4 text-xs font-semibold text-blue-700">
              Coming soon — Newsletter subscription
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 bg-[#0b203c] px-4 pb-6 pt-14 text-white sm:px-6">
          <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Link href="/" className="text-2xl font-black tracking-tight">
                KhasStore<span className="text-blue-300">.com</span>
              </Link>
              <p className="mt-4 max-w-xs text-sm leading-7 text-blue-100/70">
                Discover quality products and enjoy a better shopping experience with KhasStore.
              </p>
              <div className="mt-5 flex gap-3">
                <a
                  href="#"
                  aria-label="Facebook"
                  className="rounded-lg bg-white/10 p-2.5 transition hover:bg-blue-600"
                >
                  <Globe size={18} />
                </a>

                <a
                  href="#"
                  aria-label="Instagram"
                  className="rounded-lg bg-white/10 p-2.5 transition hover:bg-pink-600"
                >
                  <Camera size={18} />
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-bold">Quick Links</h3>
              <div className="mt-5 flex flex-col gap-3 text-sm text-blue-100/70">
                <Link href="/" className="hover:text-white">Home</Link>
                <Link href="/products" className="hover:text-white">All Products</Link>
                <Link href="/orders" className="hover:text-white">Orders</Link>
                <Link href="/reviews" className="hover:text-white">Reviews</Link>
              </div>
            </div>

            <div>
              <h3 className="font-bold">Customer Support</h3>
              <div className="mt-5 flex flex-col gap-3 text-sm text-blue-100/70">
                <a href="mailto:support@khasstore.com" className="flex items-center gap-2 hover:text-white"><Mail size={15} /> Contact Us</a>
                <a href="#" className="hover:text-white">Return Policy</a>
                <a href="#" className="hover:text-white">Privacy Policy</a>
                <a href="#" className="hover:text-white">Terms & Conditions</a>
              </div>
            </div>

            <div>
              <h3 className="font-bold">Sell with KhasStore</h3>
              <div className="mt-5 flex flex-col gap-3 text-sm text-blue-100/70">
                <Link href="/dashboard" className="hover:text-white">Become a Seller</Link>
                <Link href="/settings" className="hover:text-white">Seller Settings</Link>
                <Link href="/earnings" className="hover:text-white">Seller Earnings</Link>
              </div>
              <div className="mt-5 flex items-center gap-2 text-xs text-blue-100/70">
                <MapPin size={15} /> Pakistan
              </div>
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-[1400px] border-t border-white/10 pt-6 text-center text-xs text-blue-100/60">
            © {new Date().getFullYear()} KhasStore.com. All rights reserved.

          </div>
        </footer>

        {showLogin && (
          <LoginModal
            onClose={() => setShowLogin(false)}
            onRegisterClick={() => {
              setShowLogin(false);
              setShowSellerRegister(true);
            }}
          />
        )}

              {showSellerRegister && (
          <SellerRegisterModal
            isOpen={showSellerRegister}
            onClose={() => setShowSellerRegister(false)}
            onLoginClick={() => {
              setShowSellerRegister(false);
              setShowLogin(true);
            }}
          />
        )}
        {/* Login Modal */}
{showLogin && (
  <LoginModal
    onClose={() => setShowLogin(false)}
    onRegisterClick={() => {
      setShowLogin(false);
      setShowSellerRegister(true);
    }}
  />
)}
{showSellerRegister && (
  <SellerRegisterModal
    isOpen={showSellerRegister}
    onClose={() => setShowSellerRegister(false)}
    onLoginClick={() => {
      setShowSellerRegister(false);
      setShowLogin(true);
    }}
  />
)}

{/* Cart Modal */}
{showCart && (
  <CartCheckoutModal
    isOpen={showCart}
    onClose={() => {
      setShowCart(false);

      try {
        const saved = localStorage.getItem("khasstore-cart");
        setCart(saved ? JSON.parse(saved) : []);
      } catch {
        setCart([]);
      }
    }}
  />
)}  
      </main>
    );
  }
