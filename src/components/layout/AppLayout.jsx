import { NavLink, useNavigate } from "react-router-dom";

function navClassName({ isActive }) {
  return `rounded-md px-3 py-2 text-sm font-medium transition ${
    isActive ? "bg-indigo-100 text-indigo-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }`;
}

export default function AppLayout({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("session_token");
    localStorage.removeItem("user_id");
    sessionStorage.removeItem("latest_plan");
    sessionStorage.removeItem("latest_plan_request");
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <nav className="flex items-center gap-2">
            <NavLink to="/home" className={navClassName}>
              Home
            </NavLink>
            <NavLink to="/plan/generate" className={navClassName}>
              Workout Plan
            </NavLink>
            <NavLink to="/settings" className={navClassName}>
              Settings
            </NavLink>
          </nav>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="px-4 py-6">{children}</main>
    </div>
  );
}
