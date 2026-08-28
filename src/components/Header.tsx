import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "@tanstack/react-router";
import { User } from "lucide-react";
import { useState } from "react";

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[500] border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">

        {/* LOGO */}
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-xl bg-[image:var(--gradient-accent)] text-primary-foreground">
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17.5 19a4.5 4.5 0 0 0 .5-8.97A6 6 0 0 0 6.3 9.5 4.25 4.25 0 0 0 7 19h10.5Z" />
            </svg>
          </span>
          <div className="leading-tight">
            <h1 className="text-lg font-semibold">WeatherMap</h1>
            <p className="text-xs text-muted-foreground">Condições Climáticas</p>
          </div>
        </div>

        {/* USER AREA */}
        <div className="relative flex items-center gap-4">

          {/* Email do usuário */}
          <span className="hidden text-sm text-muted-foreground sm:inline">
            {user?.email ?? "Conectado"}
          </span>

          {/* Ícone de perfil */}
          <button
            className="text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setOpen(!open)}
          >
            <User className="h-5 w-5 cursor-pointer" />
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 top-10 w-48 rounded-lg border border-border bg-card shadow-lg">
              <div className="flex flex-col p-2 text-sm">

                <Link
                  to="/profile"
                  className="rounded px-3 py-2 hover:bg-accent"
                  onClick={() => setOpen(false)}
                >
                  Editar perfil
                </Link>

                <Link
                  to="/email"
                  className="rounded px-3 py-2 hover:bg-accent"
                  onClick={() => setOpen(false)}
                >
                  Alterar e‑mail
                </Link>

                <Link
                  to="/reset-password"
                  className="rounded px-3 py-2 hover:bg-accent"
                  onClick={() => setOpen(false)}
                >
                  Redefinir senha
                </Link>
              </div>
            </div>
          )}

          {/* Botão Sair — sempre visível */}
          <button
            type="button"
            className="btn-ghost"
            onClick={() => {
              console.log("LOGOUT_BUTTON → clicado");
              logout();
              //navigate({ to: "/login", replace: true });
            }}
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
