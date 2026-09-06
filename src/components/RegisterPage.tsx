import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import AuthShell from "@/components/AuthShell";
import ErrorMessage from "@/components/ErrorMessage";

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  }

  function validateForm() {
    if (!formData.name.trim()) {
      return "O nome não pode estar vazio.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      return "E-mail inválido.";
    }

    if (formData.password.length < 8) {
      return "A senha deve conter no mínimo 8 caracteres.";
    }

    if (formData.password !== formData.confirmPassword) {
      return "As senhas não coincidem.";
    }

    return null;
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      await register(
        formData.name.trim(),
        formData.email.toLowerCase().trim(),
        formData.password
      );
      await navigate({ to: "/", replace: true });
    } catch (registerError) {
      setError((registerError as Error).message || "Erro ao cadastrar usuário.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Criar conta" subtitle="Cadastre-se para começar a usar o WeatherMap.">
      <form onSubmit={onSubmit} className="space-y-4">

        {/* Nome */}
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-sm text-muted-foreground">Nome</label>
          <input
            id="name"
            name="name"
            required
            className="field"
            value={formData.name}
            onChange={handleChange}
            placeholder="Seu nome"
            autoComplete="name"
          />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm text-muted-foreground">E-mail</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="field"
            value={formData.email}
            onChange={handleChange}
            placeholder="voce@email.com"
            autoComplete="email"
          />
        </div>

        {/* Senha */}
        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm text-muted-foreground">Senha</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            className="field"
            value={formData.password}
            onChange={handleChange}
            placeholder="Mínimo 8 caracteres"
            autoComplete="new-password"
          />
        </div>

        {/* Confirmar senha */}
        <div className="space-y-1.5">
          <label htmlFor="confirmPassword" className="text-sm text-muted-foreground">Confirmar senha</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            minLength={8}
            className="field"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Repita a senha"
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
