import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import GeneratePlanPage from "./pages/plan/GeneratePlanPage";
import PlanResultsPage from "./pages/plan/PlanResultsPage";
import SettingsPage from "./pages/settings/SettingsPage";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("session_token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <GeneratePlanPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/plan/generate"
        element={
          <ProtectedRoute>
            <GeneratePlanPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/plan/results"
        element={
          <ProtectedRoute>
            <PlanResultsPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
