import { useState, type FormEvent, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import AuthShell from "@/components/AuthShell";
import ErrorMessage from "@/components/ErrorMessage";
import { resetPassword } from "@/lib/userApi";

export function ResetPasswordPage() {
    const { isAuthenticated, token, user } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate({ to: "/login" });
        }
    }, [isAuthenticated, navigate]);

    async function onSubmit(event: FormEvent) {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!token) throw new Error("Token não encontrado.");

            await resetPassword(token);

            alert("Enviamos um e-mail com instruções para redefinir sua senha.");
            navigate({ to: "/profile", replace: true });
        } catch (err) {
            console.error(err);
            setError("Erro ao enviar instruções de redefinição.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthShell
            title="Redefinir senha"
            subtitle="Enviaremos um e-mail com instruções para redefinir sua senha."
        >
            <form onSubmit={onSubmit} className="space-y-4">

                <div className="space-y-1.5">
                    <label htmlFor="email" className="text-sm text-muted-foreground">
                        Seu e-mail
                    </label>
                    <input
                        id="email"
                        className="field bg-muted cursor-not-allowed"
                        value={user?.email ?? ""}
                        disabled
                    />
                </div>

                <ErrorMessage message={error} onDismiss={() => setError(null)} />

                <button type="submit" className="btn-primary w-full" disabled={loading}>
                    {loading ? "Enviando..." : "Enviar instruções"}
                </button>
            </form>

            <p className="mt-5 text-sm text-muted-foreground">
                Voltar para{" "}
                <span
                    onClick={() => navigate({ to: "/profile" })}
                    className="text-primary hover:underline cursor-pointer"
                >
                    Meu perfil
                </span>
            </p>
        </AuthShell>
    );
}

export default ResetPasswordPage;
