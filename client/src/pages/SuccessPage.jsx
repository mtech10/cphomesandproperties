import { useState } from "react";
import { useLocation, Navigate, Link } from "react-router-dom";

function SuccessPage() {
  const { state } = useLocation();
  const [copied, setCopied] = useState(false);

  // If someone lands here directly without registering, send them home.
  if (!state?.realtor) {
    return <Navigate to="/" replace />;
  }

  const { realtor } = state;
  const personalLink = `${window.location.origin}/register/${realtor.username}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(personalLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="container-wide mt-4">
      <div className="card p-8">
        <div className="mb-4">
          <p className="eyebrow mb-4">Welcome aboard</p>
          <h1 className="text-2xl font-semibold mb-3">
            You're in, {realtor.firstName}
          </h1>
          <p>
            Your partner account has been created{" "}
            {realtor.referredBy ? (
              <>
                under a referral from{" "}
                <strong>{realtor.referredBy.fullName}</strong>.
              </>
            ) : (
              "as a direct sign-up."
            )}{" "}
            Here is your personal ID and link (share it to track referrals).
          </p>
        </div>

        <div className="rounded-[28px] bg-linear-to-r from-emerald-700 to-emerald-900 p-5 text-white shadow-2xl mb-6">
          <div className="mt-4 text-sm text-white">
            Your Partner ID:{" "}
            <strong className="text-white">{realtor.realtorId}</strong>
          </div>
          <div className="text-xs text-emerald-100/80">
            Your personal referral link:{" "}
            <strong className="mt-3 wrap-break-word text-sm font-semibold leading-7">
              {personalLink}
            </strong>
          </div>
          <button
            className="mt-5 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-slate-100"
            cursor-pointer
            onClick={handleCopy}
          >
            {copied ? "Copied ✓" : "Copy link"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SuccessPage;
