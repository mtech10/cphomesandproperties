import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";

function Dashboard({ searchQuery }) {
  const [realtors, setRealtors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const searchTerm = searchQuery?.trim().toLowerCase();

  const filteredRealtors = useMemo(() => {
    if (!searchTerm) return realtors;

    return realtors.filter((r) => {
      const joined = new Date(r.joinedAt).toLocaleDateString();
      const referredBy = r.referredBy
        ? `${r.referredBy.fullName} @${r.referredBy.username}`
        : "";

      return (
        r.id.toString().toLowerCase().includes(searchTerm) ||
        r.fullName.toLowerCase().includes(searchTerm) ||
        r.username.toLowerCase().includes(searchTerm) ||
        r.email.toLowerCase().includes(searchTerm) ||
        r.phone.toLowerCase().includes(searchTerm) ||
        r.referralCount.toString().includes(searchTerm) ||
        joined.toLowerCase().includes(searchTerm) ||
        referredBy.toLowerCase().includes(searchTerm)
      );
    });
  }, [realtors, searchTerm]);

  useEffect(() => {
    const adminKey = sessionStorage.getItem("ADMIN_KEY");

    if (!adminKey) {
      navigate("/admin", { replace: true });
      return;
    }

    const fetchRealtors = async () => {
      try {
        const res = await api.get("/realtors", {
          headers: { "x-admin-key": adminKey },
        });
        setRealtors(res.data.realtors);
      } catch (err) {
        sessionStorage.removeItem("ADMIN_KEY");
        navigate("/admin", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchRealtors();
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("ADMIN_KEY");
    navigate("/admin", { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-emerald-50 py-16">
        <div className="container-wide">
          <div className="rounded-4xl bg-white shadow-2xl border border-slate-200 p-10 text-center">
            <p className="text-sm uppercase tracking-[0.28em] text-emerald-700">
              Admin dashboard
            </p>
            <h1 className="mt-4 text-3xl font-semibold text-slate-900">
              Loading private data…
            </h1>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-emerald-50 py-16">
        <div className="container-wide">
          <div className="rounded-4xl bg-white shadow-2xl border border-slate-200 p-10">
            <p className="text-sm uppercase tracking-[0.28em] text-emerald-700">
              Access denied
            </p>
            <h1 className="mt-4 text-3xl font-semibold text-slate-900">
              {error}
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50 py-16">
      <div className="container-wide">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-emerald-700">
              Internal dashboard
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">
              {realtors.length} registered partners
            </h1>
            <p className="mt-4 max-w-2xl text-slate-600 leading-7">
              Every partner, who referred them, and how many people they've
              personally brought in.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-emerald-700 shadow transition hover:bg-slate-100"
          >
            Sign out
          </button>
        </div>

        <div className="rounded-4xl bg-white shadow-2xl border border-slate-200 p-10">
          <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <table className="min-w-full text-left text-sm text-slate-700">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-[0.2em] text-slate-500">
                  <th className="pb-3 pr-6">ID</th>
                  <th className="pb-3 pr-6">Name</th>
                  <th className="pb-3 pr-6">Username</th>
                  <th className="pb-3 pr-6">Email</th>
                  <th className="pb-3 pr-6">Phone</th>
                  <th className="pb-3 pr-6">Referred by</th>
                  <th className="pb-3 pr-6">Referrals</th>
                  <th className="pb-3">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filteredRealtors.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-12 text-center text-sm text-slate-500"
                    >
                      {searchTerm
                        ? "No matching partners found. Please try a different search."
                        : "No partners are registered yet."}
                    </td>
                  </tr>
                ) : (
                  filteredRealtors.map((r) => (
                    <tr
                      key={r.id}
                      className="border-b border-slate-200 last:border-none"
                    >
                      <td className="py-4 pr-6 break-all text-slate-600">
                        {r.id}
                      </td>
                      <td className="py-4 pr-6">{r.fullName}</td>
                      <td className="py-4 pr-6 text-slate-600">
                        @{r.username}
                      </td>
                      <td className="py-4 pr-6">{r.email}</td>
                      <td className="py-4 pr-6">{r.phone}</td>
                      <td className="py-4 pr-6 text-slate-600">
                        {r.referredBy
                          ? `${r.referredBy.fullName} (@${r.referredBy.username})`
                          : "— direct sign-up"}
                      </td>
                      <td className="py-4 pr-6 font-semibold text-emerald-700">
                        {r.referralCount}
                      </td>
                      <td className="py-4 text-slate-600">
                        {new Date(r.joinedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
