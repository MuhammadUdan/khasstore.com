
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  RefreshCw,
  Store,
  Users,
  Clock,
  ShieldCheck,
  LogOut,
  AlertCircle,
} from "lucide-react";
import { createClient } from "../../lib/supabase/client";

type SellerApplication = {
  id: string;
  user_id: string;
  full_name: string;
  shop_name: string;
  phone: string;
  status: "pending" | "approved" | "rejected";
  admin_note: string | null;
  created_at: string;
};

export default function AdminSellersPage() {
  const router = useRouter();

  const [applications, setApplications] = useState<SellerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [adminNote, setAdminNote] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("pending");

  const loadApplications = useCallback(async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const supabase = createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.replace("/login");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profileError || profile?.role !== "admin") {
        setError("Access denied. Sirf Admin is page ko use kar sakta hai.");
        setApplications([]);
        return;
      }

      const { data, error: applicationsError } = await supabase
        .from("seller_applications")
        .select(
          "id, user_id, full_name, shop_name, phone, status, admin_note, created_at"
        )
        .order("created_at", { ascending: false });

      if (applicationsError) {
        setError(applicationsError.message);
        return;
      }

      setApplications((data || []) as SellerApplication[]);
    } catch (err) {
      console.error("Applications loading error:", err);
      setError("Applications load nahi ho sakin. Dobara try karein.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  async function updateApplication(
    applicationId: string,
    status: "approved" | "rejected"
  ) {
    const application = applications.find(
      (item) => item.id === applicationId
    );

    if (!application) return;

    const actionText = status === "approved" ? "approve" : "reject";

    if (!window.confirm(`Kya aap is seller ko ${actionText} karna chahte hain?`)) {
      return;
    }

    setUpdatingId(applicationId);
    setError("");
    setMessage("");

    try {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role !== "admin") {
        setError("Aapko yeh action karne ki permission nahi hai.");
        return;
      }

      const { error: updateError } = await supabase
        .from("seller_applications")
        .update({
          status,
          admin_note: adminNote[applicationId]?.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", applicationId)
        .eq("status", "pending");

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setMessage(
        status === "approved"
          ? `${application.shop_name} successfully approve ho gaya.`
          : `${application.shop_name} ki application reject ho gayi.`
      );

      await loadApplications();
    } catch (err) {
      console.error("Application update error:", err);
      setError("Status update nahi ho saka. Dobara try karein.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  const pendingCount = applications.filter(
    (item) => item.status === "pending"
  ).length;

  const approvedCount = applications.filter(
    (item) => item.status === "approved"
  ).length;

  const rejectedCount = applications.filter(
    (item) => item.status === "rejected"
  ).length;

  const filteredApplications =
    filter === "all"
      ? applications
      : applications.filter((item) => item.status === filter);

  function statusStyle(status: SellerApplication["status"]) {
    if (status === "approved") {
      return "bg-green-100 text-green-700";
    }

    if (status === "rejected") {
      return "bg-red-100 text-red-700";
    }

    return "bg-amber-100 text-amber-700";
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900">
                KhasStore Admin
              </h1>
              <p className="text-xs text-slate-500">
                Seller Applications Management
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              Seller Applications
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Review applications and manage seller approvals.
            </p>
          </div>

          <button
            onClick={loadApplications}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-60"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">Total Applications</p>
              <Users className="text-blue-600" size={22} />
            </div>
            <p className="mt-3 text-3xl font-black text-slate-900">
              {applications.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">Pending</p>
              <Clock className="text-amber-600" size={22} />
            </div>
            <p className="mt-3 text-3xl font-black text-amber-600">
              {pendingCount}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">Approved</p>
              <CheckCircle2 className="text-green-600" size={22} />
            </div>
            <p className="mt-3 text-3xl font-black text-green-600">
              {approvedCount}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">Rejected</p>
              <XCircle className="text-red-600" size={22} />
            </div>
            <p className="mt-3 text-3xl font-black text-red-600">
              {rejectedCount}
            </p>
          </div>
        </section>

        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={19} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        {message && (
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-800">
            {message}
          </div>
        )}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-5">
            <h3 className="font-bold text-slate-900">
              Applications List
            </h3>

            <select
              value={filter}
              onChange={(e) =>
                setFilter(
                  e.target.value as
                    | "all"
                    | "pending"
                    | "approved"
                    | "rejected"
                )
              }
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-600"
            >
              <option value="pending">Pending Applications</option>
              <option value="approved">Approved Applications</option>
              <option value="rejected">Rejected Applications</option>
              <option value="all">All Applications</option>
            </select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-3 py-16 text-slate-500">
              <RefreshCw className="animate-spin" size={22} />
              Loading applications...
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="py-16 text-center">
              <Store className="mx-auto text-slate-300" size={42} />
              <h4 className="mt-4 font-bold text-slate-800">
                No applications found
              </h4>
              <p className="mt-1 text-sm text-slate-500">
                Is filter mein abhi koi application nahi hai.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredApplications.map((application) => (
                <article
                  key={application.id}
                  className="p-5 transition hover:bg-slate-50"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h4 className="text-lg font-bold text-slate-900">
                        {application.shop_name}
                      </h4>
                      <p className="mt-1 text-sm text-slate-600">
                        Owner: {application.full_name}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        Phone: {application.phone}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Applied:{" "}
                        {new Date(application.created_at).toLocaleString()}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize ${statusStyle(
                        application.status
                      )}`}
                    >
                      {application.status}
                    </span>
                  </div>

                  {application.status === "pending" && (
                    <div className="mt-5">
                      <label className="mb-2 block text-xs font-bold text-slate-600">
                        Admin Note (optional)
                      </label>

                      <textarea
                        rows={2}
                        value={adminNote[application.id] || ""}
                        onChange={(e) =>
                          setAdminNote((previous) => ({
                            ...previous,
                            [application.id]: e.target.value,
                          }))
                        }
                        placeholder="Write a note for this seller..."
                        className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-800 outline-none focus:border-blue-600"
                      />

                      <div className="mt-3 flex flex-wrap gap-3">
                        <button
                          onClick={() =>
                            updateApplication(application.id, "approved")
                          }
                          disabled={updatingId === application.id}
                          className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-50"
                        >
                          <CheckCircle2 size={17} />
                          {updatingId === application.id
                            ? "Updating..."
                            : "Approve Seller"}
                        </button>

                        <button
                          onClick={() =>
                            updateApplication(application.id, "rejected")
                          }
                          disabled={updatingId === application.id}
                          className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-50"
                        >
                          <XCircle size={17} />
                          Reject
                        </button>
                      </div>
                    </div>
                  )}

                  {application.admin_note && (
                    <div className="mt-4 rounded-lg bg-slate-100 p-3 text-sm text-slate-600">
                      <strong>Admin note:</strong> {application.admin_note}
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
