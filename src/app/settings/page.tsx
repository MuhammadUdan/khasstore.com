"use client";

import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import Link from "next/link";
import {
  LayoutDashboard, Package, ShoppingBag, Wallet, Store, Star,
  Settings as SettingsIcon, Bell, ShieldCheck, Save, Upload,
  Image as ImageIcon, Globe, Mail, Smartphone, CheckCircle2,
  AlertCircle, RotateCcw, ExternalLink, X, Camera, KeyRound,
  Eye, EyeOff,
} from "lucide-react";

type SettingsData = {
  storeName: string;
  email: string;
  phone: string;
  description: string;
  website: string;
  address: string;
  city: string;
  logo: string;
  banner: string;
  orders: boolean;
  reviews: boolean;
  promotions: boolean;
  emailAlerts: boolean;
  smsAlerts: boolean;
  twoFactor: boolean;
  publicStore: boolean;
};

const STORAGE_KEY = "khasstore-settings";

const defaultSettings: SettingsData = {
  storeName: "Ali Electronics",
  email: "ali@example.com",
  phone: "0300-1234567",
  description: "Quality electronics and accessories at affordable prices.",
  website: "",
  address: "Main Market",
  city: "Lahore",
  logo: "",
  banner: "",
  orders: true,
  reviews: true,
  promotions: false,
  emailAlerts: true,
  smsAlerts: false,
  twoFactor: false,
  publicStore: true,
};

const tabs = [
  { id: "profile", label: "Store Profile", icon: Store },
  { id: "branding", label: "Branding", icon: ImageIcon },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: ShieldCheck },
] as const;

type TabId = (typeof tabs)[number]["id"];

const cities = [
  "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad",
  "Multan", "Peshawar", "Quetta", "Hyderabad", "Other",
];

// Accepts 03001234567, 0300-1234567, or +923001234567.
// Displays Pakistani mobile numbers as 0300-1234567.
function formatPakistanPhone(value: string) {
  let digits = value.replace(/\D/g, "");

  if (digits.startsWith("0092")) digits = digits.slice(4);
  else if (digits.startsWith("92")) digits = digits.slice(2);

  if (digits.startsWith("3")) digits = `0${digits}`;
  digits = digits.slice(0, 11);

  if (digits.length > 4) {
    return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  }

  return digits;
}

function isValidPakistanPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return /^03[0-9]{9}$/.test(digits);
}

function makeStoreSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "your-store";
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        checked ? "bg-blue-600" : "bg-slate-300"
      }`}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${
          checked ? "left-6" : "left-1"
        }`}
      />
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  error,
  type = "text",
  maxLength,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  type?: string;
  maxLength?: number;
  inputMode?: "text" | "email" | "tel" | "url" | "numeric";
}) {
  return (
    <div className="min-w-0">
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        inputMode={inputMode}
        autoComplete="off"
        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${
          error ? "border-red-400" : "border-slate-200"
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export default function SettingsPage() {
  const [data, setData] = useState<SettingsData>(defaultSettings);
  const [original, setOriginal] = useState<SettingsData>(defaultSettings);
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const [loaded, setLoaded] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  const [passwordModal, setPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored) as Partial<SettingsData>;
        const restored = { ...defaultSettings, ...parsed };

        setData(restored);
        setOriginal(restored);
      }
    } catch {
      setMessage("Saved browser settings could not be loaded.");
      setMessageType("error");
    } finally {
      setLoaded(true);
    }
  }, []);

  const isDirty = useMemo(
    () => JSON.stringify(data) !== JSON.stringify(original),
    [data, original]
  );

  const storeUrl = useMemo(
    () => `khasstore.com/store/${makeStoreSlug(data.storeName)}`,
    [data.storeName]
  );

  function updateField<K extends keyof SettingsData>(
    key: K,
    value: SettingsData[K]
  ) {
    setData((previous) => ({ ...previous, [key]: value }));
    setMessage("");
    setErrors((previous) => ({ ...previous, [key]: "" }));
  }

  function validate() {
    const nextErrors: Record<string, string> = {};

    if (!data.storeName.trim()) {
      nextErrors.storeName = "Store name is required.";
    } else if (data.storeName.trim().length < 2) {
      nextErrors.storeName = "Store name must have at least 2 characters.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!isValidPakistanPhone(data.phone)) {
      nextErrors.phone = "Enter a valid Pakistani mobile number, e.g. 03001234567.";
    }

    if (data.description.trim().length > 300) {
      nextErrors.description = "Description cannot exceed 300 characters.";
    }

    if (data.website.trim()) {
      try {
        const parsedUrl = new URL(data.website);
        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
          nextErrors.website = "Website must start with http:// or https://.";
        }
      } catch {
        nextErrors.website = "Enter a valid website URL.";
      }
    }

    if (!data.address.trim()) {
      nextErrors.address = "Business address is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function saveSettings() {
    if (!validate()) {
      setMessage("Please correct the highlighted fields.");
      setMessageType("error");
      setActiveTab("profile");
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setOriginal(data);
      setMessage("Settings saved in this browser successfully.");
      setMessageType("success");
    } catch {
      setMessage(
        "Could not save settings. Your uploaded images may be too large for browser storage. Try smaller images."
      );
      setMessageType("error");
    }
  }

  function discardChanges() {
    if (!window.confirm("Discard all unsaved changes?")) return;

    setData(original);
    setErrors({});
    setMessage("Unsaved changes have been discarded.");
    setMessageType("success");
  }

  function resetAllSettings() {
    if (!window.confirm("Reset all settings to the original demo defaults?")) return;

    try {
      localStorage.removeItem(STORAGE_KEY);
      setData(defaultSettings);
      setOriginal(defaultSettings);
      setErrors({});
      setMessage("Demo settings have been reset.");
      setMessageType("success");
    } catch {
      setMessage("Could not reset browser settings.");
      setMessageType("error");
    }
  }

  function uploadImage(
    event: ChangeEvent<HTMLInputElement>,
    field: "logo" | "banner"
  ) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please select a valid image file.");
      setMessageType("error");
      event.target.value = "";
      return;
    }

    // Limit source file size to 2 MB.
    if (file.size > 2 * 1024 * 1024) {
      setMessage("Image must be smaller than 2 MB.");
      setMessageType("error");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateField(field, reader.result);
        setMessage("Image preview updated. Save changes to keep it in this browser.");
        setMessageType("success");
      }
    };

    reader.onerror = () => {
      setMessage("Image could not be loaded. Please try another file.");
      setMessageType("error");
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  }

  function changePassword() {
    if (!currentPassword) {
      setMessage("Enter your current password.");
      setMessageType("error");
      return;
    }

    if (newPassword.length < 8) {
      setMessage("New password must be at least 8 characters.");
      setMessageType("error");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match.");
      setMessageType("error");
      return;
    }

    setPasswordModal(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setMessage(
      "Password form validated. Actual password changes need backend authentication."
    );
    setMessageType("success");
  }

  if (!loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm font-semibold text-blue-700">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-800">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="border-b border-slate-100 px-6 py-6">
          <Link href="/" className="text-2xl font-extrabold text-[#163b75]">
            KhasStore<span className="text-blue-500">.com</span>
          </Link>
          <p className="mt-1 text-xs text-slate-400">Seller Dashboard</p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Main Menu
          </p>

          <Link href="/dashboard" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm hover:bg-slate-50">
            <LayoutDashboard size={19} /> Overview
          </Link>
          <Link href="/products" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm hover:bg-slate-50">
            <Package size={19} /> My Products
          </Link>
          <Link href="/orders" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm hover:bg-slate-50">
            <ShoppingBag size={19} /> Orders
          </Link>
          <Link href="/earnings" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm hover:bg-slate-50">
            <Wallet size={19} /> Earnings
          </Link>

          <p className="mb-3 mt-9 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Store Management
          </p>

          <Link href="/store/ali-electronics" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm hover:bg-slate-50">
            <Store size={19} /> My Store
          </Link>
          <Link href="/reviews" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm hover:bg-slate-50">
            <Star size={19} /> Reviews
          </Link>
          <Link href="/settings" className="flex items-center gap-3 rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
            <SettingsIcon size={19} /> Settings
          </Link>
        </nav>

        <div className="border-t p-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-800">
              AE
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{data.storeName}</p>
              <p className="text-xs text-slate-500">Seller Account</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="min-w-0 lg:ml-64">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 md:px-8">
          <div>
            <h1 className="text-xl font-bold">Store Settings</h1>
            <p className="text-xs text-slate-500">
              Manage your account, branding and preferences
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isDirty && (
              <span className="hidden text-xs font-semibold text-amber-600 sm:block">
                Unsaved changes
              </span>
            )}
            <button
              type="button"
              aria-label="Notifications"
              className="relative rounded-lg border border-slate-200 p-2.5"
            >
              <Bell size={19} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#163b75] text-xs font-bold text-white">
              AE
            </div>
          </div>
        </header>

        <div className="space-y-6 p-5 md:p-8">
          {/* Page banner */}
          <section className="flex flex-col justify-between gap-4 rounded-2xl bg-gradient-to-r from-[#10264b] to-[#2860ad] p-7 text-white md:flex-row md:items-center">
            <div>
              <p className="text-xs font-bold tracking-widest text-blue-200">
                ACCOUNT MANAGEMENT
              </p>
              <h2 className="mt-2 text-2xl font-bold">Customize Your Store</h2>
              <p className="mt-2 text-sm text-blue-100">
                Manage your shop identity and seller preferences.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start rounded-xl bg-white/10 px-4 py-3 text-sm md:self-center">
              <ShieldCheck size={19} />
              <span>Seller Account</span>
            </div>
          </section>

          {/* Feedback message */}
          {message && (
            <div
              role="status"
              className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${
                messageType === "success"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {messageType === "success" ? (
                <CheckCircle2 size={19} className="shrink-0" />
              ) : (
                <AlertCircle size={19} className="shrink-0" />
              )}
              <span className="flex-1">{message}</span>
              <button
                type="button"
                onClick={() => setMessage("")}
                aria-label="Dismiss message"
              >
                <X size={17} />
              </button>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition ${
                    activeTab === tab.id
                      ? "bg-[#163b75] text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Icon size={17} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Store profile */}
          {activeTab === "profile" && (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-5">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
                  <Store size={22} />
                </div>
                <div>
                  <h2 className="font-bold">Store Profile</h2>
                  <p className="text-xs text-slate-500">Your public shop information</p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="Store Name"
                  value={data.storeName}
                  onChange={(value) => updateField("storeName", value)}
                  error={errors.storeName}
                />

                <Field
                  label="Email Address"
                  value={data.email}
                  type="email"
                  inputMode="email"
                  onChange={(value) => updateField("email", value)}
                  error={errors.email}
                />

                <Field
                  label="Contact Number"
                  value={data.phone}
                  type="tel"
                  inputMode="numeric"
                  maxLength={12}
                  placeholder="0300-1234567"
                  onChange={(value) =>
                    updateField("phone", formatPakistanPhone(value))
                  }
                  error={errors.phone}
                />

                <Field
                  label="Website"
                  value={data.website}
                  placeholder="https://example.com"
                  onChange={(value) => updateField("website", value)}
                  error={errors.website}
                />

                <Field
                  label="Business Address"
                  value={data.address}
                  onChange={(value) => updateField("address", value)}
                  error={errors.address}
                />

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    City
                  </label>
                  <select
                    value={data.city}
                    onChange={(event) => updateField("city", event.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    {cities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Store Description
                  </label>
                  <textarea
                    rows={5}
                    maxLength={300}
                    value={data.description}
                    onChange={(event) => updateField("description", event.target.value)}
                    className={`w-full resize-y rounded-xl border px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${
                      errors.description ? "border-red-400" : "border-slate-200"
                    }`}
                    placeholder="Tell customers about your store..."
                  />
                  <div className="mt-1 flex justify-between gap-3 text-xs">
                    <span className={errors.description ? "text-red-600" : "text-slate-400"}>
                      {errors.description || "Tell customers about your shop."}
                    </span>
                    <span className="shrink-0 text-slate-400">
                      {data.description.length}/300
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between rounded-xl bg-slate-50 p-4">
                <div>
                  <p className="text-sm font-semibold">Public Store</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Allow customers to visit your storefront.
                  </p>
                </div>
                <Toggle
                  checked={data.publicStore}
                  onChange={(value) => updateField("publicStore", value)}
                />
              </div>

              <div className="mt-5 flex items-center gap-3 rounded-xl border border-slate-200 p-4">
                <Globe size={19} className="shrink-0 text-blue-600" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-slate-500">Your Store URL</p>
                  <p className="truncate text-sm font-semibold">{storeUrl}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    void navigator.clipboard?.writeText(`https://${storeUrl}`);
                    setMessage("Store URL copied (if clipboard permission is available).");
                    setMessageType("success");
                  }}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-blue-700"
                  aria-label="Copy store URL"
                  title="Copy store URL"
                >
                  <ExternalLink size={17} />
                </button>
              </div>
            </section>
          )}

          {/* Branding */}
          {activeTab === "branding" && (
            <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <h2 className="font-bold">Store Branding</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Upload your shop logo and storefront banner.
                </p>
              </div>

              <div>
                <label className="mb-3 block text-sm font-semibold">Store Banner</label>
                <div className="relative flex h-48 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50">
                  {data.banner ? (
                    <img
                      src={data.banner}
                      alt="Store banner preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="mx-auto text-slate-400" size={35} />
                      <p className="mt-2 text-sm font-semibold">Upload your banner</p>
                      <p className="mt-1 text-xs text-slate-400">
                        Recommended size: 1200 × 400
                      </p>
                    </div>
                  )}
                  <label className="absolute bottom-3 right-3 flex cursor-pointer items-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-semibold shadow">
                    <Upload size={15} /> Choose Banner
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={(event) => uploadImage(event, "banner")}
                    />
                  </label>
                </div>
                {data.banner && (
                  <button
                    type="button"
                    onClick={() => updateField("banner", "")}
                    className="mt-2 text-xs font-semibold text-red-600"
                  >
                    Remove banner
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border bg-slate-50">
                  {data.logo ? (
                    <img src={data.logo} alt="Store logo preview" className="h-full w-full object-cover" />
                  ) : (
                    <Store size={38} className="text-slate-300" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">Store Logo</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Square image recommended. Maximum 2 MB.
                  </p>
                  <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-slate-50">
                    <Camera size={16} /> Upload Logo
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={(event) => uploadImage(event, "logo")}
                    />
                  </label>
                  {data.logo && (
                    <button
                      type="button"
                      onClick={() => updateField("logo", "")}
                      className="ml-3 text-xs font-semibold text-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-5">
                <p className="mb-3 text-sm font-semibold">Store Preview</p>
                <div className="overflow-hidden rounded-xl border border-slate-200">
                  <div className="h-24 bg-gradient-to-r from-[#10264b] to-[#2860ad]">
                    {data.banner && (
                      <img src={data.banner} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 p-4">
                    <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border bg-white">
                      {data.logo ? (
                        <img src={data.logo} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <Store className="text-blue-700" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate font-bold">{data.storeName || "Your Store"}</h3>
                      <p className="text-xs text-slate-500">{data.city}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 border-b border-slate-100 pb-5">
                <h2 className="font-bold">Notification Preferences</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Control the alerts you want to receive.
                </p>
              </div>

              {[
                {
                  key: "orders" as const,
                  title: "New Orders",
                  detail: "Get notified when a customer places an order.",
                  icon: ShoppingBag,
                },
                {
                  key: "reviews" as const,
                  title: "Customer Reviews",
                  detail: "Receive alerts when customers review products.",
                  icon: Star,
                },
                {
                  key: "promotions" as const,
                  title: "Promotional Updates",
                  detail: "Marketplace announcements and seller offers.",
                  icon: Bell,
                },
                {
                  key: "emailAlerts" as const,
                  title: "Email Notifications",
                  detail: "Receive important updates by email.",
                  icon: Mail,
                },
                {
                  key: "smsAlerts" as const,
                  title: "SMS Notifications",
                  detail: "Receive important updates by SMS.",
                  icon: Smartphone,
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.key}
                    className="flex items-center justify-between gap-4 border-b border-slate-100 py-5 last:border-0"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
                        <Icon size={19} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold">{item.title}</p>
                        <p className="mt-1 text-xs text-slate-500">{item.detail}</p>
                      </div>
                    </div>
                    <Toggle
                      checked={data[item.key]}
                      onChange={(value) => updateField(item.key, value)}
                    />
                  </div>
                );
              })}
            </section>
          )}

          {/* Security */}
          {activeTab === "security" && (
            <section className="space-y-5">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-green-50 p-3 text-green-700">
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <h2 className="font-bold">Account Security</h2>
                    <p className="text-xs text-slate-500">
                      Review your account protection settings.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col justify-between gap-4 rounded-xl border border-slate-200 p-5 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3">
                    <KeyRound className="text-blue-700" size={22} />
                    <div>
                      <p className="text-sm font-semibold">Password</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Update your account password.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPasswordModal(true)}
                    className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-slate-50"
                  >
                    Change Password
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-5">
                  <div className="flex min-w-0 items-center gap-3">
                    <Smartphone className="shrink-0 text-blue-700" size={22} />
                    <div>
                      <p className="text-sm font-semibold">Two-Factor Authentication</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Extra account security with a second verification step.
                      </p>
                    </div>
                  </div>
                  <Toggle
                    checked={data.twoFactor}
                    onChange={(value) => updateField("twoFactor", value)}
                  />
                </div>

                <div className="mt-5 rounded-xl bg-amber-50 p-4 text-xs leading-5 text-amber-800">
                  Security options on this page are frontend demo preferences.
                  Real password changes and two-factor verification must be
                  handled by the backend authentication system.
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="font-bold">Account Information</h3>
                <div className="mt-4 space-y-4 text-sm">
                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500">Account Type</span>
                    <span className="font-semibold">Seller Account</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500">Verification</span>
                    <span className="font-semibold text-green-600">Demo Status</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500">Marketplace</span>
                    <span className="font-semibold">KhasStore.com</span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Save / discard action bar */}
          <section className="sticky bottom-3 z-10 flex flex-col justify-between gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-semibold">
                {isDirty ? "You have unsaved changes" : "All changes are saved"}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Save your changes before leaving this page.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={discardChanges}
                disabled={!isDirty}
                className="flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <RotateCcw size={16} /> Discard
              </button>
              <button
                type="button"
                onClick={saveSettings}
                disabled={!isDirty}
                className="flex items-center gap-2 rounded-xl bg-[#163b75] px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Save size={17} /> Save Changes
              </button>
            </div>
          </section>

          <div className="flex justify-between gap-3 pb-5">
            <button
              type="button"
              onClick={resetAllSettings}
              className="text-xs font-semibold text-red-600 hover:underline"
            >
              Reset all demo settings
            </button>
            <p className="text-xs text-slate-400">© 2026 KhasStore.com</p>
          </div>
        </div>
      </main>

      {/* Password modal */}
      {passwordModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setPasswordModal(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="password-modal-title"
            className="w-full max-w-md rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <h2 id="password-modal-title" className="text-lg font-bold">
                  Change Password
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Enter your password details.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPasswordModal(false)}
                className="rounded-lg p-2 hover:bg-slate-100"
                aria-label="Close password dialog"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 p-5">
              {[
                {
                  label: "Current Password",
                  value: currentPassword,
                  setter: setCurrentPassword,
                },
                {
                  label: "New Password",
                  value: newPassword,
                  setter: setNewPassword,
                },
                {
                  label: "Confirm New Password",
                  value: confirmPassword,
                  setter: setConfirmPassword,
                },
              ].map((item) => (
                <div key={item.label}>
                  <label className="mb-2 block text-sm font-semibold">
                    {item.label}
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords ? "text" : "password"}
                      value={item.value}
                      onChange={(event) => item.setter(event.target.value)}
                      autoComplete="new-password"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords((value) => !value)}
                      className="absolute right-3 top-3 text-slate-400"
                      aria-label={showPasswords ? "Hide passwords" : "Show passwords"}
                    >
                      {showPasswords ? <EyeOff size={19} /> : <Eye size={19} />}
                    </button>
                  </div>
                </div>
              ))}

              <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-700">
                Use at least 8 characters for your new password.
              </div>

              <button
                type="button"
                onClick={changePassword}
                className="w-full rounded-xl bg-[#163b75] py-3 text-sm font-semibold text-white hover:bg-blue-800"
              >
                Validate Password Change
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}