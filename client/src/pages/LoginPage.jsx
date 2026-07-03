import RegisterPage from "./RegisterPage.jsx";
import { UserPlus } from "lucide-react";

function LoginPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-amber-50 py-12">
      <div className="container-wide">
        <div className="rounded-4xl bg-white/80 shadow-2xl border border-slate-200 p-10 backdrop-blur-lg">
          <div className="flex items-center gap-4 mb-6">
            <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-emerald-100/90">
                Start here
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">
                Build your realtor referral profile
              </h1>
            </div>
          </div>
          <p className="max-w-2xl text-slate-600 leading-7">
            Create a partner account, claim your personalized referral link, and
            start capturing agent sign-ups with a professional onboarding
            experience.
          </p>
          <div className="mt-8">
            <RegisterPage embedded />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
