import { useState } from "react";
import { getOpenWeatherKey, setOpenWeatherKey } from "@/lib/api";

export function ApiKeyNotice() {
  const [value, setValue] = useState("");
  const [saved, setSaved] = useState(() => Boolean(getOpenWeatherKey()));

  if (saved) return null;

  return (
    <section className="surface rounded-2xl p-5">
      <h2 className="text-base font-semibold">Chave do OpenWeatherMap</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        O clima e a camada de nuvens são consultados direto do navegador. Defina
        <code className="mx-1 rounded bg-muted px-1 py-0.5">VITE_OPENWEATHER_API_KEY</code>
        ou cole sua chave aqui.
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          className="field"
          placeholder="sua API key"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          aria-label="Chave da API OpenWeatherMap"
        />
        <button
          type="button"
          className="btn-primary sm:w-32"
          onClick={() => {
            if (!value.trim()) return;
            setOpenWeatherKey(value);
            setSaved(true);
            window.location.reload();
          }}
        >
          Salvar
        </button>
      </div>
    </section>
  );
}

export default ApiKeyNotice;
