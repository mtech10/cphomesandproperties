import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api.js";

const USERNAME_PATTERN = /^[a-z0-9._-]{3,30}$/;

const NIGERIAN_BANKS = [
  "Access Bank",
  "Citibank Nigeria",
  "Ecobank Nigeria",
  "Fidelity Bank",
  "First Bank of Nigeria",
  "First City Monument Bank (FCMB)",
  "Globus Bank",
  "Guaranty Trust Bank (GTBank)",
  "Heritage Bank",
  "Keystone Bank",
  "Polaris Bank",
  "Providus Bank",
  "Stanbic IBTC Bank",
  "Standard Chartered Bank",
  "Sterling Bank",
  "SunTrust Bank",
  "Titan Trust Bank",
  "Union Bank of Nigeria",
  "United Bank for Africa (UBA)",
  "Unity Bank",
  "Wema Bank",
  "Zenith Bank",
  "Kuda Bank",
  "Moniepoint MFB",
  "OPay",
  "PalmPay",
  "VFD Microfinance Bank",
  "Carbon",
  "Rubies Bank",
  "Sparkle Bank",
];

const initialForm = {
  firstName: "",
  lastName: "",
  username: "",
  mobileNumber: "",
  email: "",
  confirmEmail: "",
  dateOfBirth: "",
  gender: "",
  city: "",
  address: "",
  country: "Nigeria",
  state: "",
  accountName: "",
  accountNumber: "",
  bankName: "",
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
    if (!form.firstName.trim()) next.firstName = "Enter your first name.";
    if (!form.lastName.trim()) next.lastName = "Enter your last name.";
    if (!USERNAME_PATTERN.test(form.username.trim().toLowerCase())) {
      next.username =
        "3-30 characters: letters, numbers, dots, dashes or underscores only.";
    }
    if (!form.mobileNumber.trim()) next.mobileNumber = "Enter a mobile number.";
    if (!/^\S+@\S+\.\S+$/.test(form.email))
      next.email = "Enter a valid email address.";
    if (
      form.email.trim().toLowerCase() !== form.confirmEmail.trim().toLowerCase()
    )
      next.confirmEmail = "Email addresses do not match.";
    if (!form.dateOfBirth) next.dateOfBirth = "Enter your date of birth.";
    if (!form.gender) next.gender = "Select a gender.";
    if (!form.city.trim()) next.city = "Enter your city.";
    if (!form.address.trim()) next.address = "Enter your address.";
    if (!form.country.trim()) next.country = "Enter your country.";
    if (!form.state.trim()) next.state = "Enter your state.";
    if (!form.accountName.trim()) next.accountName = "Enter the account name.";
    if (!form.accountNumber.trim())
      next.accountNumber = "Enter the account number.";
    if (!form.bankName) next.bankName = "Select a bank.";
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
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        username: form.username.trim().toLowerCase(),
        mobileNumber: form.mobileNumber.trim(),
        email: form.email.trim(),
        dateOfBirth: form.dateOfBirth,
        gender: form.gender,
        city: form.city.trim(),
        address: form.address.trim(),
        country: form.country.trim(),
        state: form.state.trim(),
        accountName: form.accountName.trim(),
        accountNumber: form.accountNumber.trim(),
        bankName: form.bankName,
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

  const inputClass =
    "mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10";
  const labelClass = "block text-sm font-medium text-slate-700";
  const errorClass = "mt-2 text-sm text-rose-600";

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
        {/* Name */}
        <div className="grid gap-5 lg:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="firstName">
              First name
            </label>
            <input
              id="firstName"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="Jane"
              className={inputClass}
            />
            {errors.firstName && (
              <p className={errorClass}>{errors.firstName}</p>
            )}
          </div>

          <div>
            <label className={labelClass} htmlFor="lastName">
              Last name
            </label>
            <input
              id="lastName"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Doe"
              className={inputClass}
            />
            {errors.lastName && <p className={errorClass}>{errors.lastName}</p>}
          </div>
        </div>

        {/* Username / Mobile */}
        <div className="grid gap-5 lg:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="username">
              Choose a username
            </label>
            <input
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="janedoe"
              autoComplete="off"
              className={inputClass}
            />
            {errors.username && <p className={errorClass}>{errors.username}</p>}
          </div>

          <div>
            <label className={labelClass} htmlFor="mobileNumber">
              Mobile number
            </label>
            <input
              id="mobileNumber"
              name="mobileNumber"
              value={form.mobileNumber}
              onChange={handleChange}
              placeholder="080 0000 0000"
              className={inputClass}
            />
            {errors.mobileNumber && (
              <p className={errorClass}>{errors.mobileNumber}</p>
            )}
          </div>
        </div>

        {/* Email / Confirm email */}
        <div className="grid gap-5 lg:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="jane@example.com"
              className={inputClass}
            />
            {errors.email && <p className={errorClass}>{errors.email}</p>}
          </div>

          <div>
            <label className={labelClass} htmlFor="confirmEmail">
              Confirm email address
            </label>
            <input
              id="confirmEmail"
              name="confirmEmail"
              type="email"
              value={form.confirmEmail}
              onChange={handleChange}
              placeholder="Re-enter your email"
              className={inputClass}
            />
            {errors.confirmEmail && (
              <p className={errorClass}>{errors.confirmEmail}</p>
            )}
          </div>
        </div>

        {/* DOB / Gender */}
        <div className="grid gap-5 lg:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="dateOfBirth">
              Date of birth
            </label>
            <input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={form.dateOfBirth}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.dateOfBirth && (
              <p className={errorClass}>{errors.dateOfBirth}</p>
            )}
          </div>

          <div>
            <label className={labelClass} htmlFor="gender">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select gender</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
            </select>
            {errors.gender && <p className={errorClass}>{errors.gender}</p>}
          </div>
        </div>

        {/* City / State */}
        <div className="grid gap-5 lg:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="city">
              City
            </label>
            <input
              id="city"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="Ikeja"
              className={inputClass}
            />
            {errors.city && <p className={errorClass}>{errors.city}</p>}
          </div>

          <div>
            <label className={labelClass} htmlFor="state">
              State
            </label>
            <input
              id="state"
              name="state"
              value={form.state}
              onChange={handleChange}
              placeholder="Lagos"
              className={inputClass}
            />
            {errors.state && <p className={errorClass}>{errors.state}</p>}
          </div>
        </div>

        {/* Country / Address */}
        <div className="grid gap-5 lg:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="country">
              Country
            </label>
            <input
              id="country"
              name="country"
              value={form.country}
              onChange={handleChange}
              placeholder="Nigeria"
              className={inputClass}
            />
            {errors.country && <p className={errorClass}>{errors.country}</p>}
          </div>

          <div>
            <label className={labelClass} htmlFor="address">
              Address
            </label>
            <input
              id="address"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="12 Allen Avenue"
              className={inputClass}
            />
            {errors.address && <p className={errorClass}>{errors.address}</p>}
          </div>
        </div>

        {/* Account name / number */}
        <div className="grid gap-5 lg:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="accountName">
              Account name
            </label>
            <input
              id="accountName"
              name="accountName"
              value={form.accountName}
              onChange={handleChange}
              placeholder="Jane Doe"
              className={inputClass}
            />
            {errors.accountName && (
              <p className={errorClass}>{errors.accountName}</p>
            )}
          </div>

          <div>
            <label className={labelClass} htmlFor="accountNumber">
              Account number
            </label>
            <input
              id="accountNumber"
              name="accountNumber"
              value={form.accountNumber}
              onChange={handleChange}
              placeholder="0123456789"
              inputMode="numeric"
              className={inputClass}
            />
            {errors.accountNumber && (
              <p className={errorClass}>{errors.accountNumber}</p>
            )}
          </div>
        </div>

        {/* Bank */}
        <div>
          <label className={labelClass} htmlFor="bankName">
            Bank
          </label>
          <select
            id="bankName"
            name="bankName"
            value={form.bankName}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Select bank</option>
            {NIGERIAN_BANKS.map((bank) => (
              <option key={bank} value={bank}>
                {bank}
              </option>
            ))}
          </select>
          {errors.bankName && <p className={errorClass}>{errors.bankName}</p>}
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
