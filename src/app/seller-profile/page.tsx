
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client";

const categories = [
  "Clothing & Fashion",
  "Electronics",
  "Mobile Accessories",
  "Home & Kitchen",
  "Beauty & Personal Care",
  "Shoes & Bags",
  "Grocery",
  "Sports & Fitness",
  "Other",
];

export default function SellerProfilePage() {
  const router = useRouter();

  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();

      const { data: { user }, error: authError } =
        await supabase.auth.getUser();

      if (authError || !user) {
        router.replace("/login");
        return;
      }

      const { data: application, error: applicationError } = await supabase
        .from("seller_applications")
        .select("city, business_address, whatsapp_number, product_categories, status")
        .eq("user_id", user.id)
        .maybeSingle();

      if (applicationError || !application) {
        setError(
          "Seller application nahi mili. Please dobara login karein ya admin se contact karein."
        );
        setLoading(false);
        return;
      }

      setCity(application.city || "");
      setAddress(application.business_address || "");
      setWhatsapp(application.whatsapp_number || "");
      setSelectedCategories(application.product_categories || []);

      if (application.status === "approved") {
        router.replace("/dashboard");
        return;
      }

      setLoading(false);
    }

    loadProfile();
  }, [router]);

  function toggleCategory(category: string) {
    setSelectedCategories((previous) =>
      previous.includes(category)
        ? previous.filter((item) => item !== category)
        : [...previous, category]
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (selectedCategories.length === 0) {
      setError("Kam az kam ek product category select karein.");
      return;
    }

    setSaving(true);

    try {
      const supabase = createClient();

      const { data: { user }, error: authError } =
        await supabase.auth.getUser();

      if (authError || !user) {
        setError("Session expire ho gaya. Dobara login karein.");
        return;
      }

      const { data, error: updateError } = await supabase
        .from("seller_applications")
        .update({
          city: city.trim(),
          business_address: address.trim(),
          whatsapp_number: whatsapp.trim(),
          product_categories: selectedCategories,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .eq("status", "pending")
        .select("id")
        .maybeSingle();

      if (updateError) {
        setError(updateError.message);
        return;
      }

      if (!data) {
        setError(
          "Application update nahi hui. Application status check karne ke liye admin se contact karein."
        );
        return;
      }

      setSuccess(true);
    } catch (err) {
      console.error("Seller profile error:", err);
      setError("Kuch masla hua. Dobara try karein.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-gray-600">Loading seller profile...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-9">
        <div className="mb-8">
          <p className="text-sm font-bold text-blue-600">KHASSTORE SELLER</p>
          <h1 className="mt-2 text-3xl font-black text-gray-900">
            Complete Your Store Profile
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Apne business ki basic information complete karein.
          </p>
        </div>

        {success ? (
          <div className="rounded-xl border border-green-200 bg-green-50 p-6">
            <h2 className="text-xl font-bold text-green-800">
              Profile Submitted!
            </h2>
            <p className="mt-2 text-sm leading-6 text-green-700">
              Aapki basic seller profile save ho gayi hai. KhasStore Admin
              aapki application review karega. Approval se pehle selling
              access available nahi hoga.
            </p>
            <p className="mt-4 font-bold text-amber-700">
              Application Status: Pending
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                City *
              </label>
              <input
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Karachi"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Business Address *
              </label>
              <textarea
                required
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your shop or business address"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                WhatsApp Number *
              </label>
              <input
                required
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="03XXXXXXXXX"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-3 block text-sm font-semibold text-gray-700">
                Product Categories *
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {categories.map((category) => (
                  <label
                    key={category}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-3 text-sm hover:border-blue-400"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => toggleCategory(category)}
                      className="h-4 w-4 accent-blue-600"
                    />
                    {category}
                  </label>
                ))}
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-blue-600 px-5 py-4 font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {saving ? "Saving Profile..." : "Submit Seller Profile"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
