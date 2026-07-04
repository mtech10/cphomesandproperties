import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api.js";

const USERNAME_PATTERN = /^[a-z0-9._-]{3,30}$/;

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  username: "",
  password: "",
  confirmPassword: "",
};

function RegisterPage({ embedded } = { embedded: false }) {
  const { username: referralUsername } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [referrer, setReferrer] = useState(null);
  const [referrerError, setReferrerError] = useState("");
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // If this page was opened via a personal referral link, look up who owns
  // it so we can greet the new sign-up with "Invited by ...".
  useEffect(() => {
    if (!referralUsername) return;

    let cancelled = false;
    api
      .get(`/realtors/lookup/${referralUsername}`)
      .then((res) => {
        if (!cancelled) setReferrer(res.data);
      })
      .catch(() => {
        if (!cancelled) {
          setReferrerError(
            "This referral link could not be verified. You can still sign up directly below.",
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [referralUsername]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = "Enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email))
      next.email = "Enter a valid email address.";
    if (!form.phone.trim()) next.phone = "Enter a phone number.";
    if (!USERNAME_PATTERN.test(form.username.trim().toLowerCase())) {
      next.username =
        "3-30 characters: letters, numbers, dots, dashes or underscores only.";
    }
    if (form.password.length < 6)
      next.password = "Password must be at least 6 characters.";
    if (form.password !== form.confirmPassword)
      next.confirmPassword = "Passwords do not match.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await api.post("/realtors/register", {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        username: form.username.trim().toLowerCase(),
        password: form.password,
        referralUsername: referralUsername || null,
      });

      navigate("/success", { state: { realtor: res.data.realtor } });
    } catch (err) {
      setSubmitError(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={embedded ? "" : "page max-w-3xl "}>
      <section className="mx-0 mb-8 rounded-[28px] bg-white/90 p-8 shadow-2xl border border-slate-200">
        <p className="eyebrow">Become a partner</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">
          Join a high-value realtor referral network.
        </h1>
        <p className="mt-4 max-w-2xl text-slate-600 leading-7">
          Register once and receive a personal referral URL. Your referred
          sign-ups are tracked automatically, giving you transparent credit for
          every introduction.
        </p>

        {referralUsername && referrer && (
          <div className="mt-6 rounded-3xl border border-emerald-100 bg-emerald-50 p-4 text-emerald-900">
            You were invited by <strong>{referrer.fullName}</strong> (@
            {referrer.username})
          </div>
        )}
        {referralUsername && referrerError && (
          <div className="mt-6 rounded-3xl border border-rose-100 bg-rose-50 p-4 text-rose-700">
            {referrerError}
          </div>
        )}
      </section>

      <form className="card space-y-5 p-8" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-5 lg:grid-cols-2">
          <div>
            <label
              className="block text-sm font-medium text-slate-700"
              htmlFor="fullName"
            >
              Full name
            </label>
            <input
              id="fullName"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Jane Doe"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10"
            />
            {errors.fullName && (
              <p className="mt-2 text-sm text-rose-600">{errors.fullName}</p>
            )}
          </div>

          <div>
            <label
              className="block text-sm font-medium text-slate-700"
              htmlFor="email"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="jane@example.com"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10"
            />
            {errors.email && (
              <p className="mt-2 text-sm text-rose-600">{errors.email}</p>
            )}
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div>
            <label
              className="block text-sm font-medium text-slate-700"
              htmlFor="phone"
            >
              Phone number
            </label>
            <input
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+234 800 000 0000"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10"
            />
            {errors.phone && (
              <p className="mt-2 text-sm text-rose-600">{errors.phone}</p>
            )}
          </div>

          <div>
            <label
              className="block text-sm font-medium text-slate-700"
              htmlFor="username"
            >
              Choose a username
            </label>
            <input
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="janedoe"
              autoComplete="off"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10"
            />

            {errors.username && (
              <p className="mt-2 text-sm text-rose-600">{errors.username}</p>
            )}
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div>
            <label
              className="block text-sm font-medium text-slate-700"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10"
            />
            {errors.password && (
              <p className="mt-2 text-sm text-rose-600">{errors.password}</p>
            )}
          </div>

          <div>
            <label
              className="block text-sm font-medium text-slate-700"
              htmlFor="confirmPassword"
            >
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10"
            />
            {errors.confirmPassword && (
              <p className="mt-2 text-sm text-rose-600">
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        {submitError && (
          <div className="rounded-3xl bg-rose-50 p-4 text-sm text-rose-700">
            {submitError}
          </div>
        )}

        <button
          type="submit"
          className="w-full rounded-2xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-emerald-800 disabled:opacity-60"
          disabled={submitting}
        >
          {submitting ? "Creating your account…" : "Create my partner account"}
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;
