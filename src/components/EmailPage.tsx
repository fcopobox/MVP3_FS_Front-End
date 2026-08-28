import { useState, type FormEvent, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import AuthShell from "@/components/AuthShell";
import ErrorMessage from "@/components/ErrorMessage";
import { updateEmail } from "@/lib/userApi";

export function EmailPage() {
    const { isAuthenticated, token, user } = useAuth();
    const navigate = useNavigate();

    const [newEmail, setNewEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Se não estiver autenticado, redireciona
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

            await updateEmail(newEmail.trim(), token);

            alert("Email atualizado! Verifique sua caixa de entrada para confirmar o novo endereço.");
            navigate({ to: "/profile", replace: true });
        } catch (err) {
            console.error(err);
            setError("Erro ao atualizar email.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthShell
            title="Alterar e-mail"
            subtitle="Atualize seu endereço de e-mail. Você precisará verificá-lo novamente."
        >
            <form onSubmit={onSubmit} className="space-y-4">

                <div className="space-y-1.5">
                    <label htmlFor="current-email" className="text-sm text-muted-foreground">
                        E-mail atual
                    </label>
                    <input
                        id="current-email"
                        className="field bg-muted cursor-not-allowed"
                        value={user?.email ?? ""}
                        disabled
                    />
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="new-email" className="text-sm text-muted-foreground">
                        Novo e-mail
                    </label>
                    <input
                        id="new-email"
                        type="email"
                        required
                        className="field"
                        value={newEmail}
                        onChange={(event) => setNewEmail(event.target.value)}
                        placeholder="novo@email.com"
                        autoComplete="email"
                    />
                </div>

                <ErrorMessage message={error} onDismiss={() => setError(null)} />

                <button type="submit" className="btn-primary w-full" disabled={loading}>
                    {loading ? "Atualizando..." : "Atualizar e-mail"}
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

export default EmailPage;
