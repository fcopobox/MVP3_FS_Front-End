import { useState, type FormEvent, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import AuthShell from "@/components/AuthShell";
import ErrorMessage from "@/components/ErrorMessage";
import { createProfile } from "@/lib/userApi";

export function RegisterPage() {
  const { isAuthenticated, token } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [cep, setCep] = useState("");
  const [address, setAddress] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Se o usuário não estiver autenticado, redireciona para login
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
      if (!token) {
        throw new Error("Token não encontrado.");
      }

      await createProfile(
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
      setError("Erro ao salvar perfil.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Completar cadastro"
      subtitle="Finalize seu perfil para começar a mapear o clima por CEP."
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

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? "Salvando..." : "Salvar perfil"}
        </button>
      </form>

      <p className="mt-5 text-sm text-muted-foreground">
        Já completou o cadastro?{" "}
        <Link to="/" className="text-primary hover:underline">Ir para o mapa</Link>
      </p>
    </AuthShell>
  );
}

export default RegisterPage;
