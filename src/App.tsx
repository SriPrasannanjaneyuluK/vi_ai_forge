import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { PortalAuthProvider } from "@/context/PortalAuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { HomePage } from "@/pages/HomePage";
import { LoginPage } from "@/pages/LoginPage";
import { SignupPage } from "@/pages/SignupPage";
import { ForgotPasswordPage } from "@/pages/ForgotPasswordPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { EditProfilePage } from "@/pages/EditProfilePage";
import { PortalRoute } from "@/components/auth/PortalRoute";

export default function App() {
  return (
    <PortalAuthProvider>
      <MotionConfig reducedMotion="user">
        <BrowserRouter>
          <Navbar />
          <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/my-learnings" element={<Navigate to="/dashboard" replace />} />
          <Route element={<PortalRoute />}>
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/profile" element={<EditProfilePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </BrowserRouter>
      </MotionConfig>
    </PortalAuthProvider>
  );
}
