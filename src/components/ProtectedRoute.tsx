import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/components/Loader";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { ready, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && !isAuthenticated) {
      void navigate({ to: "/login", replace: true });
    }
  }, [ready, isAuthenticated, navigate]);

  if (!ready || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader label="Verificando sessão..." />
      </div>
    );
  }

  return <>{children}</>;
}

export default ProtectedRoute;
