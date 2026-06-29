import { Navigate, Outlet } from "react-router-dom";
import { usePortalAuth } from "@/context/PortalAuthContext";

export function PortalRoute() {
  const { user, loading, isStudent, isTeacher } = usePortalAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-muted">Loading your session…</p>
      </div>
    );
  }

  if (!user || (!isStudent && !isTeacher)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
