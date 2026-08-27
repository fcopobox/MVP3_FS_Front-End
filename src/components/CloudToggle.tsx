import { useApp } from "@/context/AppContext";

export function CloudToggle() {
  const { cloudsVisible, toggleClouds } = useApp();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={cloudsVisible}
      onClick={toggleClouds}
      className="flex items-center gap-3 rounded-xl border border-border bg-card/70 px-3 py-2 text-sm"
    >
      <span
        className={`relative h-5 w-9 rounded-full transition-colors ${
          cloudsVisible ? "bg-primary" : "bg-muted"
        }`}
      >
        <span
          className={`absolute top-0.5 size-4 rounded-full bg-background transition-all ${
            cloudsVisible ? "left-4.5" : "left-0.5"
          }`}
        />
      </span>
      Camada de nuvens
    </button>
  );
}

export default CloudToggle;
