import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import SuccessPage from "./pages/SuccessPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import AdminLoginPage from "./pages/AdminLoginPage.jsx";

function App() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="app-shell">
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <main>
        <Routes>
          {/* Root shows unified login with partner signup + admin login */}
          <Route path="/" element={<LoginPage />} />

          {/* Personal referral link: /register/USERNAME */}
          <Route path="/register/:username" element={<RegisterPage />} />

          <Route path="/success" element={<SuccessPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard searchQuery={searchQuery} />
              </ProtectedRoute>
            }
          />
          <Route path="/admin" element={<AdminLoginPage />} />

          <Route
            path="*"
            element={
              <div className="not-found">
                <h1>Page not found</h1>
                <p>The link you followed doesn't match anything here.</p>
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
