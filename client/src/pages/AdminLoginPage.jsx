import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";
import { LogIn } from "lucide-react";

function AdminLoginPage() {
  const navigate = useNavigate();
  const [adminKey, setAdminKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.get("/realtors", {
        headers: { "x-admin-key": adminKey },
      });
      sessionStorage.setItem("ADMIN_KEY", adminKey);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid admin key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 py-16">
      <div className="container-wide">
        <div className="mx-auto max-w-3xl rounded-4xl bg-white shadow-2xl border border-slate-200 p-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
              <LogIn className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-emerald-700">
                Admin login
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">
                Secure dashboard entry
              </h1>
            </div>
          </div>

          <p className="max-w-2xl text-slate-600 leading-7 mb-8">
            This page is only accessible to authorized admins. Enter your admin
            key to unlock the private partner dashboard.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="adminKey"
                className="block text-sm font-medium text-slate-700"
              >
                Admin key
              </label>
              <input
                id="adminKey"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                type="password"
                placeholder="Enter admin key"
                className="mt-2 block w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10"
              />
            </div>

            {error && <div className="text-sm text-rose-600">{error}</div>}

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-2xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-emerald-800 disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Checking…" : "Access dashboard"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginPage;
