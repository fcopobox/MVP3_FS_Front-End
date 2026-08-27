import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import AuthShell from "@/components/AuthShell";
import ErrorMessage from "@/components/ErrorMessage";

export function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await resetPassword(email.trim());
      setSent(true);
    } catch (resetError) {
      setError((resetError as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Esqueci a senha"
      subtitle="Enviaremos as instruções de recuperação para o seu e-mail."
    >
      {sent ? (
        <p className="rounded-lg border border-border bg-card/60 px-3 py-3 text-sm">
          Se o e-mail existir, você receberá as instruções em instantes.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
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
          <ErrorMessage message={error} onDismiss={() => setError(null)} />
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Enviando..." : "Enviar instruções"}
          </button>
        </form>
      )}
      <p className="mt-5 text-sm">
        <Link to="/login" className="text-primary hover:underline">Voltar ao login</Link>
      </p>
    </AuthShell>
  );
}

export default ForgotPasswordPage;
