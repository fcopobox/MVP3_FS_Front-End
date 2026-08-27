export function ErrorMessage({
  message,
  onDismiss,
}: {
  message: string | null;
  onDismiss?: () => void;
}) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="flex items-start justify-between gap-3 rounded-lg border border-destructive/50 bg-destructive/15 px-3 py-2 text-sm text-destructive-foreground"
    >
      <span>{message}</span>
      {onDismiss ? (
        <button type="button" onClick={onDismiss} className="text-xs opacity-70 hover:opacity-100">
          fechar
        </button>
      ) : null}
    </div>
  );
}

export default ErrorMessage;
