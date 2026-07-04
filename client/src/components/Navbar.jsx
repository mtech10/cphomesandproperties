import { Link } from "react-router-dom";
import logo from "../assets/logo2.png";

function Navbar({ searchQuery, setSearchQuery }) {
  const adminKey = sessionStorage.getItem("ADMIN_KEY");

  return (
    <header className="bg-white/80 backdrop-blur sticky top-0 z-20 shadow-sm border-b border-slate-200">
      <div className="container-wide flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Link
          to="/"
          className="flex items-center gap-3 text-emerald-800 font-semibold"
        >
          <img
            src={logo}
            className="w-25 h-25 m-0 p-0"
            alt="crown prince homes and properties logo"
          />
        </Link>

        <div className="flex flex-1 items-center justify-end gap-4">
          {adminKey && (
            <div className="flex w-full max-w-md items-center">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ID, name, email, phone, referrals, joined"
                className="h-10 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 text-sm text-slate-700 placeholder:text-slate-400 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
