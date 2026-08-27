export function Loader({ label = "Carregando..." }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-muted-foreground">
      <span className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      {label}
    </div>
  );
}

export default Loader;
