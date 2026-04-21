import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import SettingsPage from "./pages/settings/SettingsPage";

function DashboardStub() {
  return (
    <div className="mx-auto mt-20 max-w-xl rounded-xl bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
      <p className="mt-2 text-slate-600">
        Session token has been stored. Replace this stub with your actual dashboard.
      </p>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/dashboard" element={<DashboardStub />} />
    </Routes>
  );
}
