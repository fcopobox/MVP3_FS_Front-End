import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import AuthShell from "@/components/AuthShell";
import ErrorMessage from "@/components/ErrorMessage";
import { authApi } from "@/lib/api";

export function UserEditPage() {
    const { user, token, logout } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState(user?.name ?? "");
    const [email, setEmail] = useState(user?.email ?? "");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function onSubmit(event: FormEvent) {
        event.preventDefault();
        setLoading(true);
        setError(null);
        try {
            if (!token) throw new Error("Sessão inválida.");
            await authApi.updateUser({ name, email }, token);
            await navigate({ to: "/", replace: true });
        } catch (err) {
            setError((err as Error).message || "Erro ao atualizar dados.");
        } finally {
            setLoading(false);
        }
    }

    async function onDelete() {
        if (!token) return;
        try {
            await authApi.deleteUser(token);
            logout();
            await navigate({ to: "/login", replace: true });
        } catch (err) {
            setError((err as Error).message || "Erro ao excluir conta.");
        }
    }

    return (
        <AuthShell title="Editar usuário" subtitle="Atualize seus dados de acesso.">
            <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-1.5">
                    <label htmlFor="name" className="text-sm text-muted-foreground">Nome</label>
                    <input
                        id="name"
                        className="field"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Seu nome"
                    />
                </div>
                <div className="space-y-1.5">
                    <label htmlFor="email" className="text-sm text-muted-foreground">E-mail</label>
                    <input
                        id="email"
                        type="email"
                        className="field"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="voce@email.com"
                    />
                </div>
                <ErrorMessage message={error} onDismiss={() => setError(null)} />
                <button type="submit" className="btn-primary w-full" disabled={loading}>
                    {loading ? "Salvando..." : "Salvar alterações"}
                </button>
            </form>

            <div className="mt-6 border-t pt-4">
                <button
                    type="button"
                    className="btn-danger w-full"
                    onClick={onDelete}
                >
                    Deletar conta
                </button>
            </div>
        </AuthShell>
    );
}

export default UserEditPage;
