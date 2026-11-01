
"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Wallet,
  Settings,
  Store,
  Star,
  Plus,
  Search,
  Bell,
  Menu,
  Pencil,
  Trash2,
  X,
  CheckCircle,
  Eye,
} from "lucide-react";

const initialProducts = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    category: "Electronics",
    price: 3499,
    stock: 42,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
  },
  {
    id: 2,
    name: "Premium Smart Watch",
    category: "Electronics",
    price: 5499,
    stock: 18,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
  },
  {
    id: 3,
    name: "Wireless Bluetooth Speaker",
    category: "Accessories",
    price: 2799,
    stock: 7,
    status: "Low Stock",
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500",
  },
  {
    id: 4,
    name: "Minimal Desk Accessories",
    category: "Home & Living",
    price: 1899,
    stock: 0,
    status: "Out of Stock",
    image:
      "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=500",
  },
  {
    id: 5,
    name: "Classic Wrist Watch",
    category: "Fashion",
    price: 4299,
    stock: 25,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500",
  },
];

type Product = (typeof initialProducts)[number];

const categories = [
  "Electronics",
  "Accessories",
  "Home & Living",
  "Fashion",
];

const navigation = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Products", href: "/products", icon: Package },
  { label: "Orders", href: "/orders", icon: ShoppingBag },
  { label: "Earnings", href: "/earnings", icon: Wallet },
  { label: "My Store", href: "/store/ali-electronics", icon: Store },
  { label: "Reviews", href: "/reviews", icon: Star },
  { label: "Settings", href: "/settings", icon: Settings },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Active: "bg-green-50 text-green-700",
    "Low Stock": "bg-amber-50 text-amber-700",
    "Out of Stock": "bg-red-50 text-red-600",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${
        styles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [filter, setFilter] = useState("All");

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Quick View State
  const [viewProduct, setViewProduct] = useState<Product | null>(null);

  const [form, setForm] = useState({
    name: "",
    category: "Electronics",
    price: "",
    stock: "",
    image: "",
  });

  const filteredProducts = products.filter((product) => {
    const query = search.trim().toLowerCase();

    const matchesSearch =
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query);

    const matchesCategory =
      category === "All Categories" || product.category === category;

    const matchesFilter =
      filter === "All" || product.status === filter;

    return matchesSearch && matchesCategory && matchesFilter;
  });

  const activeCount = products.filter(
    (product) => product.status === "Active"
  ).length;

  const lowStockCount = products.filter(
    (product) => product.status === "Low Stock"
  ).length;

  const outOfStockCount = products.filter(
    (product) => product.status === "Out of Stock"
  ).length;

  const resetForm = () => {
    setForm({
      name: "",
      category: "Electronics",
      price: "",
      stock: "",
      image: "",
    });

    setEditingId(null);
    setShowAddForm(false);
  };

  const handleSaveProduct = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const price = Number(form.price);
    const stock = Number(form.stock);

    if (
      !form.name.trim() ||
      !Number.isFinite(price) ||
      price <= 0 ||
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      alert("Please enter valid product details.");
      return;
    }

    const status =
      stock === 0
        ? "Out of Stock"
        : stock <= 10
        ? "Low Stock"
        : "Active";

    if (editingId !== null) {
      setProducts((previous) =>
        previous.map((product) =>
          product.id === editingId
            ? {
                ...product,
                name: form.name.trim(),
                category: form.category,
                price,
                stock,
                status,
                image: form.image.trim() || product.image,
              }
            : product
        )
      );
    } else {
      const newProduct: Product = {
        id: Date.now(),
        name: form.name.trim(),
        category: form.category,
        price,
        stock,
        status,
        image:
          form.image.trim() ||
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
      };

      setProducts((previous) => [newProduct, ...previous]);
    }

    resetForm();
  };

  const handleEdit = (product: Product) => {
    setForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
      image: product.image,
    });

    setEditingId(product.id);
    setShowAddForm(true);
  };

  const handleDelete = (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (confirmed) {
      setProducts((previous) =>
        previous.filter((product) => product.id !== id)
      );

      setViewProduct((current) =>
        current?.id === id ? null : current
      );
    }
  };

  const openAddForm = () => {
    resetForm();
    setShowAddForm(true);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const openQuickView = (product: Product) => {
    setViewProduct(product);
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-800">

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={closeMobileMenu}
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
              onClick={closeMobileMenu}
              className="text-2xl font-extrabold text-[#163b75]"
            >
              KhasStore<span className="text-blue-500">.com</span>
            </Link>

            <p className="mt-1 text-xs text-slate-400">
              Seller Dashboard
            </p>
          </div>

          <button
            type="button"
            onClick={closeMobileMenu}
            aria-label="Close menu"
            className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Main Menu
          </p>

          <nav className="space-y-1">
            {navigation.slice(0, 4).map((item) => {
              const Icon = item.icon;
              const active = item.href === "/products";

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                    active
                      ? "bg-blue-50 font-semibold text-blue-700"
                      : "font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-700"
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
            {navigation.slice(4).map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-blue-700"
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

      {/* Main Content */}
      <main className="min-w-0 lg:ml-64">

        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4 md:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
              className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
            >
              <Menu size={22} />
            </button>

            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold md:text-xl">
                My Products
              </h1>

              <p className="hidden text-xs text-slate-500 sm:block">
                Manage your store inventory and products
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
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

          {/* Welcome Banner */}
          <section className="flex flex-col justify-between gap-5 overflow-hidden rounded-2xl bg-gradient-to-r from-[#10264b] to-[#2860ad] p-6 text-white md:flex-row md:items-center md:p-8">
            <div>
              <p className="text-xs font-semibold tracking-wider text-blue-200">
                INVENTORY MANAGEMENT
              </p>

              <h2 className="mt-2 text-2xl font-bold md:text-3xl">
                Manage Your Products
              </h2>

              <p className="mt-2 max-w-xl text-sm text-blue-100">
                Add, edit and manage products in your KhasStore shop.
              </p>
            </div>

            <button
              type="button"
              onClick={openAddForm}
              className="flex w-fit shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#163b75] shadow-sm transition hover:bg-blue-50"
            >
              <Plus size={18} />
              Add New Product
            </button>
          </section>

          {/* Summary Cards */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Total Products
              </p>

              <h3 className="mt-2 text-3xl font-extrabold">
                {products.length}
              </h3>

              <p className="mt-2 text-xs text-slate-400">
                Products in your store
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Active Products
              </p>

              <h3 className="mt-2 text-3xl font-extrabold text-green-600">
                {activeCount}
              </h3>

              <p className="mt-2 text-xs text-slate-400">
                Currently available
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Stock Alerts
              </p>

              <h3 className="mt-2 text-3xl font-extrabold text-amber-600">
                {lowStockCount + outOfStockCount}
              </h3>

              <p className="mt-2 text-xs text-slate-400">
                Low or unavailable stock
              </p>
            </div>
          </section>

          {/* Products Section */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* Search and Filters */}
            <div className="border-b p-4 sm:p-5">
              <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
                <div>
                  <h2 className="font-bold">
                    All Products
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    View and manage your listed products
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="flex min-w-0 items-center gap-2 rounded-lg border bg-slate-50 px-3 py-2">
                    <Search size={17} className="shrink-0 text-slate-400" />

                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search products..."
                      aria-label="Search products"
                      className="w-full bg-transparent text-sm outline-none sm:w-48"
                    />
                  </div>

                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    aria-label="Filter by category"
                    className="rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                  >
                    <option>All Categories</option>
                    {categories.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status Filters */}
              <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
                {["All", "Active", "Low Stock", "Out of Stock"].map(
                  (item) => (
                    <button
                      type="button"
                      key={item}
                      onClick={() => setFilter(item)}
                      className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${
                        filter === item
                          ? "bg-[#163b75] text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {item}

                      {item === "All" && ` (${products.length})`}
                      {item === "Active" && ` (${activeCount})`}
                      {item === "Low Stock" && ` (${lowStockCount})`}
                      {item === "Out of Stock" && ` (${outOfStockCount})`}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Desktop Product Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[750px] text-left text-sm">
                <thead className="bg-slate-50 text-xs text-slate-500">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Product</th>
                    <th className="px-5 py-4 font-semibold">Category</th>
                    <th className="px-5 py-4 font-semibold">Price</th>
                    <th className="px-5 py-4 font-semibold">Stock</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                    <th className="px-5 py-4 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-12 w-12 rounded-lg border object-cover"
                          />

                          <span className="max-w-52 font-semibold">
                            {product.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-slate-500">
                        {product.category}
                      </td>

                      <td className="px-5 py-4 font-semibold">
                        Rs. {product.price.toLocaleString("en-PK")}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={
                            product.stock <= 10
                              ? "font-semibold text-amber-600"
                              : "text-slate-600"
                          }
                        >
                          {product.stock} units
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={product.status} />
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openQuickView(product)}
                            title="Quick view"
                            aria-label={`View ${product.name}`}
                            className="rounded-lg border p-2 text-green-700 transition hover:bg-green-50"
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleEdit(product)}
                            title="Edit product"
                            aria-label={`Edit ${product.name}`}
                            className="rounded-lg border p-2 text-blue-700 transition hover:bg-blue-50"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(product.id)}
                            title="Delete product"
                            aria-label={`Delete ${product.name}`}
                            className="rounded-lg border p-2 text-red-600 transition hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredProducts.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-5 py-12 text-center text-slate-500"
                      >
                        No products found. Try another search or filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Product Cards */}
            <div className="divide-y divide-slate-100 md:hidden">
              {filteredProducts.map((product) => (
                <div key={product.id} className="p-4">
                  <div className="flex gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-20 w-20 shrink-0 rounded-xl border object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-2 text-sm font-bold text-slate-800">
                        {product.name}
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        {product.category}
                      </p>

                      <p className="mt-2 font-bold text-[#163b75]">
                        Rs. {product.price.toLocaleString("en-PK")}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={product.status} />

                      <span className="text-xs text-slate-500">
                        Stock: {product.stock}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openQuickView(product)}
                        aria-label={`View ${product.name}`}
                        className="rounded-lg border p-2.5 text-green-700 hover:bg-green-50"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleEdit(product)}
                        aria-label={`Edit ${product.name}`}
                        className="rounded-lg border p-2.5 text-blue-700 hover:bg-blue-50"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(product.id)}
                        aria-label={`Delete ${product.name}`}
                        className="rounded-lg border p-2.5 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredProducts.length === 0 && (
                <div className="px-5 py-12 text-center text-sm text-slate-500">
                  No products found. Try another search or filter.
                </div>
              )}
            </div>

            {/* Results Count */}
            <div className="border-t px-5 py-4 text-xs text-slate-500">
              Showing {filteredProducts.length} of {products.length} products
            </div>
          </section>

          {/* Footer */}
          <footer className="flex flex-col justify-between gap-2 pb-4 text-xs text-slate-400 sm:flex-row">
            <p>© 2026 KhasStore.com. All rights reserved.</p>
            <p>Seller Dashboard · Built for better business</p>
          </footer>
        </div>
      </main>

      {/* Add / Edit Product Modal */}
      {showAddForm && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-3 sm:p-4"
          onClick={resetForm}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-form-title"
            className="my-auto w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h2
                  id="product-form-title"
                  className="text-lg font-bold sm:text-xl"
                >
                  {editingId !== null ? "Edit Product" : "Add New Product"}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Enter your product information below.
                </p>
              </div>

              <button
                type="button"
                onClick={resetForm}
                aria-label="Close form"
                className="rounded-lg p-2 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSaveProduct}
              className="max-h-[75vh] space-y-4 overflow-y-auto p-5"
            >
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Product Name
                </label>

                <input
                  required
                  maxLength={120}
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  placeholder="Enter product name"
                  className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Category
                </label>

                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                >
                  {categories.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Price (Rs.)
                  </label>

                  <input
                    required
                    type="number"
                    min="1"
                    step="1"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    placeholder="3499"
                    className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Stock Quantity
                  </label>

                  <input
                    required
                    type="number"
                    min="0"
                    step="1"
                    value={form.stock}
                    onChange={(e) =>
                      setForm({ ...form, stock: e.target.value })
                    }
                    placeholder="20"
                    className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Product Image URL (optional)
                </label>

                <input
                  type="url"
                  value={form.image}
                  onChange={(e) =>
                    setForm({ ...form, image: e.target.value })
                  }
                  placeholder="https://example.com/product.jpg"
                  className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-blue-500"
                />

                <p className="mt-1 text-xs text-slate-400">
                  Image upload integration will be added with backend.
                </p>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border px-5 py-3 text-sm font-semibold transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#163b75] px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
                >
                  <CheckCircle size={17} />

                  {editingId !== null ? "Save Changes" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Quick View Modal */}
      {viewProduct && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onClick={() => setViewProduct(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="quick-view-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div>
                <h2
                  id="quick-view-title"
                  className="text-lg font-bold text-slate-900"
                >
                  Product Details
                </h2>

                <p className="text-xs text-slate-500">
                  Quick product preview
                </p>
              </div>

              <button
                type="button"
                onClick={() => setViewProduct(null)}
                className="rounded-lg p-2 transition hover:bg-slate-100"
                aria-label="Close preview"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5">
              <img
                src={viewProduct.image}
                alt={viewProduct.name}
                className="h-48 w-full rounded-xl bg-slate-50 object-cover"
              />

              <div className="mt-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-bold text-slate-900">
                    {viewProduct.name}
                  </h3>

                  <StatusBadge status={viewProduct.status} />
                </div>

                <p className="mt-2 text-sm text-slate-500">
                  {viewProduct.category}
                </p>

                <p className="mt-3 text-2xl font-extrabold text-[#163b75]">
                  Rs. {viewProduct.price.toLocaleString("en-PK")}
                </p>
              </div>

              {/* Product Information */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">
                    Available Stock
                  </p>

                  <p className="mt-1 text-lg font-bold text-slate-900">
                    {viewProduct.stock} Units
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">
                    Product ID
                  </p>

                  <p className="mt-1 text-lg font-bold text-slate-900">
                    #{viewProduct.id}
                  </p>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    handleEdit(viewProduct);
                    setViewProduct(null);
                  }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#163b75] py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
                >
                  <Pencil size={16} />
                  Edit Product
                </button>

                <button
                  type="button"
                  onClick={() => setViewProduct(null)}
                  className="rounded-xl border px-5 py-3 text-sm font-semibold transition hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
