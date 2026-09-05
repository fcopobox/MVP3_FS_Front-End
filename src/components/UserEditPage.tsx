import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import AuthShell from "@/components/AuthShell";
import ErrorMessage from "@/components/ErrorMessage";
import { authApi } from "@/lib/api";
import { Button } from "./ui/button";

import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";

export function UserEditPage() {
    const { user, token, logout, setUser } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState(user?.name ?? "");
    const [email, setEmail] = useState(user?.email ?? "");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Estado para abrir/fechar modal
    const [open, setOpen] = useState(false);

    // Validação antes de abrir o modal
    function validate(): boolean {
        setError(null);

        if (!token) {
            setError("Sessão inválida.");
            return false;
        }

        if (!name.trim()) {
            setError("O nome não pode estar vazio.");
            return false;
        }

        if (!email.trim()) {
            setError("O e-mail não pode estar vazio.");
            return false;
        }

        if (!email.includes("@")) {
            setError("E-mail inválido.");
            return false;
        }

        return true;
    }

    // Botão Salvar → valida → abre modal
    function handleOpenModal(event: FormEvent) {
        event.preventDefault();
        if (validate()) {
            setOpen(true);
        }
    }

    // Confirmação dentro do modal
    async function onSubmit() {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await authApi.updateUser(
                user!.id,
                { name, email: email.toLowerCase() },
                token!
            );

            setUser({ id: user!.id, name, email });

            setSuccess("Dados alterados com sucesso!");

            setTimeout(() => navigate({ to: "/", replace: true }), 1500);
        } catch (err) {
            setError((err as Error).message || "Erro ao atualizar dados.");
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    async function onDelete() {
        if (!token) return;

        try {
            await authApi.deleteUser(user!.id, token);
            logout();
            await navigate({ to: "/login", replace: true });
        } catch (err) {
            setError((err as Error).message || "Erro ao excluir conta.");
        }
    }

    return (
        <AuthShell title="Editar usuário" subtitle="Atualize seus dados de acesso.">
            <form className="space-y-4">
                <div className="space-y-1.5">
                    <label htmlFor="name" className="text-sm text-muted-foreground">
                        Nome
                    </label>
                    <input
                        id="name"
                        className="field"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            setError(null);
                        }}
                        placeholder="Seu nome"
                    />
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="email" className="text-sm text-muted-foreground">
                        E-mail
                    </label>
                    <input
                        id="email"
                        type="email"
                        className="field"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setError(null);
                        }}
                        placeholder="voce@email.com"
                    />
                </div>

                <ErrorMessage message={error} onDismiss={() => setError(null)} />

                {success && <p className="text-sm text-green-600">{success}</p>}

                {/* Botão Salvar → valida → abre modal */}
                <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                    onClick={handleOpenModal}
                >
                    {loading ? "Salvando..." : "Salvar alterações"}
                </Button>

                <Button
                    type="button"
                    variant="secondary"
                    className="w-full mt-2"
                    onClick={() => navigate({ to: "/" })}
                >
                    Cancelar
                </Button>
            </form>

            {/* Modal de confirmação para salvar alterações */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Confirmar alterações</DialogTitle>
                        <DialogDescription>
                            Tem certeza que deseja salvar as alterações do seu perfil?
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="flex justify-end gap-2">
                        <DialogClose asChild>
                            <Button variant="secondary">Cancelar</Button>
                        </DialogClose>

                        <Button variant="destructive" onClick={onSubmit}>
                            Sim, salvar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal de confirmação para deletar conta */}
            <div className="mt-6 border-t pt-4">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="destructive" className="w-full">
                            Deletar conta
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Excluir conta</DialogTitle>
                            <DialogDescription>
                                Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.
                            </DialogDescription>
                        </DialogHeader>

                        <DialogFooter className="flex justify-end gap-2">
                            <DialogClose asChild>
                                <Button variant="secondary">Cancelar</Button>
                            </DialogClose>

                            <Button variant="destructive" onClick={onDelete}>
                                Sim, excluir
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AuthShell>
    );
}

export default UserEditPage;
