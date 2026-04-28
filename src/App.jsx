import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import HomePage from "./pages/home/HomePage";
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
        path="/home"
        element={
          <ProtectedRoute>
            <AppLayout>
              <HomePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <AppLayout>
              <SettingsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <Navigate to="/home" replace />
        }
      />
      <Route
        path="/plan/generate"
        element={
          <ProtectedRoute>
            <AppLayout>
              <GeneratePlanPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/plan/results"
        element={
          <ProtectedRoute>
            <AppLayout>
              <PlanResultsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
