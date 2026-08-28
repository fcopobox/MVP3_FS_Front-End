import { ReactNode } from "react";
import { Navigate } from "@tanstack/react-router";
import { useAuth } from "../context/AuthContext";

type ProtectedRouteProps = {
  children: ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isBrowser = typeof window !== "undefined";

  if (!isBrowser) return null;

  const { isAuthenticated, ready } = useAuth();

  console.log("PROTECTED_ROUTE → ready:", ready);
  console.log("PROTECTED_ROUTE → isAuthenticated:", isAuthenticated);


  if (!ready) return <div>Carregando...</div>;

  if (!isAuthenticated) return <Navigate to="/login" />;

  return <>{children}</>;
}
