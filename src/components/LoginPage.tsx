import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth0 } from "@auth0/auth0-react";
import AuthShell from "@/components/AuthShell";
import ErrorMessage from "@/components/ErrorMessage";

export function LoginPage() {
    const { loginWithRedirect, isAuthenticated, isLoading: authLoading } = useAuth0();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(""); // Mantido apenas para UI
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Se já estiver autenticado, redireciona
    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            void navigate({ to: "/", replace: true });
        }
    }, [authLoading, isAuthenticated, navigate]);

    async function onSubmit(event: FormEvent) {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Agora o login é totalmente Auth0
            await loginWithRedirect();
        } catch (err) {
            console.error(err);
            setError("Erro ao redirecionar para o Auth0.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthShell
            title="Entrar"
            subtitle="Acesse sua conta para consultar CEPs, mapas e clima."
        >
            <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-1.5">
                    <label htmlFor="email" className="text-sm text-muted-foreground">
                        E-mail
                    </label>
                    <input
                        id="email"
                        type="email"
                        required
                        className="field"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="voce@email.com"
                        autoComplete="email"
                    />
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="password" className="text-sm text-muted-foreground">
                        Senha
                    </label>
                    <input
                        id="password"
                        type="password"
                        required
                        className="field"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="••••••••"
                        autoComplete="current-password"
                    />
                </div>

                <ErrorMessage message={error} onDismiss={() => setError(null)} />

                <button type="submit" className="btn-primary w-full" disabled={loading}>
                    {loading ? "Entrando..." : "Entrar"}
                </button>
            </form>

            <div className="mt-5 flex items-center justify-between text-sm">
                <Link to="/register" className="text-primary hover:underline">
                    Criar conta
                </Link>
                <Link to="/forgot-password" className="text-muted-foreground hover:underline">
                    Esqueci a senha
                </Link>
            </div>
        </AuthShell>
    );
}

export default LoginPage;
