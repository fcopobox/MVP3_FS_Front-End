import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "@tanstack/react-router";

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-[500] border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
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
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-muted-foreground sm:inline">
            {user?.name ?? user?.email ?? "Conectado"}
          </span>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => {
              logout();
              void navigate({ to: "/login", replace: true });
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
