import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "@tanstack/react-router";   // ⬅ ADICIONADO Link
import { useState, useRef, useEffect } from "react";
import { HelpCircle } from "lucide-react";                    // ⬅ ADICIONADO ícone

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  function handleLogout() {
    logout();
    void navigate({ to: "/login", replace: true });
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-[500] border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">

        {/* Logo */}
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

        {/* Usuário + menu + info */}
        <div className="flex items-center gap-4">

          {/* Usuário + menu */}
          <div className="relative flex items-center gap-3" ref={menuRef}>
            <button
              type="button"
              className="flex items-center gap-2 btn-ghost"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A9 9 0 1118.879 6.196 9 9 0 015.121 17.804z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 0 016 0z" />
              </svg>
              <span className="hidden text-sm text-muted-foreground sm:inline">
                {user?.name ?? "Usuário"}
              </span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-40 rounded-md border border-border bg-background shadow-lg">
                <button
                  className="block w-full px-4 py-2 text-left text-sm hover:bg-muted"
                  onClick={() => {
                    setMenuOpen(false);
                    void navigate({ to: "/edit" });
                  }}
                >
                  Editar dados
                </button>

                <button
                  className="block w-full px-4 py-2 text-left text-sm hover:bg-muted"
                  onClick={() => {
                    setMenuOpen(false);
                    void navigate({ to: "/change-password" });
                  }}
                >
                  Alterar senha
                </button>

                <button
                  className="block w-full px-4 py-2 text-left text-sm hover:bg-muted"
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                >
                  Sair
                </button>
              </div>
            )}
          </div>

          {/* Ícone de informações — ADICIONADO */}
          <Link to="/about">
            <HelpCircle
              className="size-5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            />
          </Link>

        </div>
      </div>
    </header>
  );
}

export default Header;
