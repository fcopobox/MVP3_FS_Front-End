import { useState, type FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "@tanstack/react-router";
import AuthShell from "@/components/AuthShell";
import ErrorMessage from "@/components/ErrorMessage";
import { authApi } from "@/lib/api";
import { Button } from "@/components/ui/button";

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

export function ChangePasswordPage() {
    const { user, token } = useAuth();
    const navigate = useNavigate();

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Estado para controlar abertura do modal
    const [open, setOpen] = useState(false);

    // 🔥 Função de validação separada
    function validate(): boolean {
        setError(null);

        if (!token) {
            setError("Sessão inválida.");
            return false;
        }

        if (newPassword.length < 8) {
            setError("A nova senha deve ter pelo menos 8 caracteres.");
            return false;
        }

        if (newPassword === oldPassword) {
            setError("A nova senha deve ser diferente da senha atual.");
            return false;
        }

        if (newPassword !== repeatPassword) {
            setError("As senhas não coincidem.");
            return false;
        }

        return true;
    }

    // 🔥 Botão Alterar senha → valida → abre modal
    function handleOpenModal() {
        if (validate()) {
            setOpen(true);
        }
    }

    // 🔥 Confirmação dentro do modal
    async function onSubmit() {
        setError(null);
        setSuccess(null);

        setLoading(true);

        try {
            await authApi.changePassword(
                user!.id,
                {
                    old_password: oldPassword,
                    new_password: newPassword,
                },
                token!
            );

            setSuccess("Senha alterada com sucesso!");

            setTimeout(() => {
                navigate({ to: "/", replace: true });
            }, 1200);
        } catch (err) {
            setError((err as Error).message || "Erro ao alterar senha.");
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    return (
        <AuthShell title="Alterar senha" subtitle="Atualize sua senha de acesso.">
            <form className="space-y-4">
                <div className="space-y-1.5">
                    <label className="text-sm text-muted-foreground">Senha atual</label>
                    <input
                        type="password"
                        className="field"
                        value={oldPassword}
                        onChange={(e) => {
                            setOldPassword(e.target.value);
                            setError(null);
                        }
                        }
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm text-muted-foreground">Nova senha</label>
                    <input
                        type="password"
                        className="field"
                        value={newPassword}
                        onChange={(e) => {
                            setNewPassword(e.target.value);
                            setError(null);
                        }}
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm text-muted-foreground">Repetir nova senha</label>
                    <input
                        type="password"
                        className="field"
                        value={repeatPassword}
                        onChange={(e) => {
                            setRepeatPassword(e.target.value);
                            setError(null);
                        }}
                    />
                </div>

                <ErrorMessage message={error} onDismiss={() => setError(null)} />

                {success && <p className="text-sm text-green-600">{success}</p>}

                {/* Botão Alterar senha → valida → abre modal */}
                <Button
                    type="button"
                    className="w-full"
                    disabled={loading}
                    onClick={handleOpenModal}
                >
                    {loading ? "Salvando..." : "Alterar senha"}
                </Button>

                {/* Botão Cancelar da página */}
                <Button
                    type="button"
                    variant="secondary"
                    className="w-full mt-2"
                    onClick={() => navigate({ to: "/" })}
                >
                    Cancelar
                </Button>
            </form>

            {/* Modal de confirmação */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Confirmar alteração</DialogTitle>
                        <DialogDescription>
                            Tem certeza que deseja alterar sua senha? Você precisará usá-la no próximo login.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="flex justify-end gap-2">
                        <DialogClose asChild>
                            <Button variant="secondary">Cancelar</Button>
                        </DialogClose>

                        <Button variant="destructive" onClick={onSubmit}>
                            Sim, alterar senha
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AuthShell>
    );
}

export default ChangePasswordPage;
