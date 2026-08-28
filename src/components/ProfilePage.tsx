import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import AuthShell from "@/components/AuthShell";
import ErrorMessage from "@/components/ErrorMessage";
import { getProfile, updateProfile, deleteAccount } from "@/lib/userApi";

export function ProfilePage() {
    const { isAuthenticated, token } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [name, setName] = useState("");
    const [cep, setCep] = useState("");
    const [address, setAddress] = useState("");
    const [number, setNumber] = useState("");
    const [complement, setComplement] = useState("");
    const [district, setDistrict] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");

    // Carrega perfil ao entrar na página
    useEffect(() => {
        if (!isAuthenticated) {
            navigate({ to: "/login" });
            return;
        }

        async function load() {
            try {
                if (!token) throw new Error("Token não encontrado.");

                const data = await getProfile(token);

                setName(data.name ?? "");
                setCep(data.cep ?? "");
                setAddress(data.address ?? "");
                setNumber(data.number ?? "");
                setComplement(data.complement ?? "");
                setDistrict(data.district ?? "");
                setCity(data.city ?? "");
                setState(data.state ?? "");
            } catch (err) {
                console.error(err);
                setError("Não foi possível carregar seu perfil.");
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [isAuthenticated, token, navigate]);

    async function onSubmit(event: FormEvent) {
        event.preventDefault();
        setSaving(true);
        setError(null);

        try {
            if (!token) throw new Error("Token não encontrado.");

            await updateProfile(
                {
                    name,
                    cep,
                    address,
                    number,
                    complement,
                    district,
                    city,
                    state,
                },
                token
            );

            navigate({ to: "/", replace: true });
        } catch (err) {
            console.error(err);
            setError("Erro ao salvar alterações.");
        } finally {
            setSaving(false);
        }
    }

    async function onDeleteAccount() {
        if (!confirm("Tem certeza que deseja excluir sua conta?")) return;

        try {
            if (!token) throw new Error("Token não encontrado.");

            await deleteAccount(token);

            navigate({ to: "/login", replace: true });
        } catch (err) {
            console.error(err);
            setError("Erro ao excluir conta.");
        }
    }

    if (loading) {
        return (
            <AuthShell title="Carregando perfil..." subtitle="Aguarde um instante.">
                <p className="text-muted-foreground">Carregando...</p>
            </AuthShell>
        );
    }

    return (
        <AuthShell
            title="Meu perfil"
            subtitle="Gerencie suas informações pessoais."
        >
            <form onSubmit={onSubmit} className="space-y-4">

                <div className="space-y-1.5">
                    <label htmlFor="name" className="text-sm text-muted-foreground">Nome</label>
                    <input
                        id="name"
                        required
                        className="field"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Seu nome"
                        autoComplete="name"
                    />
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="cep" className="text-sm text-muted-foreground">CEP</label>
                    <input
                        id="cep"
                        className="field"
                        value={cep}
                        onChange={(event) => setCep(event.target.value)}
                        placeholder="00000-000"
                    />
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="address" className="text-sm text-muted-foreground">Endereço</label>
                    <input
                        id="address"
                        className="field"
                        value={address}
                        onChange={(event) => setAddress(event.target.value)}
                        placeholder="Rua, avenida..."
                    />
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="number" className="text-sm text-muted-foreground">Número</label>
                    <input
                        id="number"
                        className="field"
                        value={number}
                        onChange={(event) => setNumber(event.target.value)}
                        placeholder="Número"
                    />
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="complement" className="text-sm text-muted-foreground">Complemento</label>
                    <input
                        id="complement"
                        className="field"
                        value={complement}
                        onChange={(event) => setComplement(event.target.value)}
                        placeholder="Apto, bloco..."
                    />
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="district" className="text-sm text-muted-foreground">Bairro</label>
                    <input
                        id="district"
                        className="field"
                        value={district}
                        onChange={(event) => setDistrict(event.target.value)}
                        placeholder="Bairro"
                    />
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="city" className="text-sm text-muted-foreground">Cidade</label>
                    <input
                        id="city"
                        className="field"
                        value={city}
                        onChange={(event) => setCity(event.target.value)}
                        placeholder="Cidade"
                    />
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="state" className="text-sm text-muted-foreground">Estado</label>
                    <input
                        id="state"
                        className="field"
                        value={state}
                        onChange={(event) => setState(event.target.value)}
                        placeholder="Estado"
                    />
                </div>

                <ErrorMessage message={error} onDismiss={() => setError(null)} />

                <button type="submit" className="btn-primary w-full" disabled={saving}>
                    {saving ? "Salvando..." : "Salvar alterações"}
                </button>
            </form>

            <button
                onClick={onDeleteAccount}
                className="btn-danger w-full mt-6"
            >
                Excluir conta
            </button>
        </AuthShell>
    );
}

export default ProfilePage;
