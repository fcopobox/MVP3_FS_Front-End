import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import AuthShell from "@/components/AuthShell";
import ErrorMessage from "@/components/ErrorMessage";

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await register(name.trim(), email.trim(), password);
      await navigate({ to: "/login", replace: true });
    } catch (registerError) {
      setError((registerError as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Criar conta" subtitle="Cadastre-se para começar a mapear o clima por CEP.">
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
          <label htmlFor="email" className="text-sm text-muted-foreground">E-mail</label>
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
          <label htmlFor="password" className="text-sm text-muted-foreground">Senha</label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            className="field"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Mínimo 8 caracteres"
            autoComplete="new-password"
          />
        </div>
        <ErrorMessage message={error} onDismiss={() => setError(null)} />
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>
      <p className="mt-5 text-sm text-muted-foreground">
        Já tem conta?{" "}
        <Link to="/login" className="text-primary hover:underline">Entrar</Link>
      </p>
    </AuthShell>
  );
}

export default RegisterPage;
