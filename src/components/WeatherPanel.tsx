import { useApp } from "@/context/AppContext";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card/60 px-3 py-2.5">
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-semibold">{value}</p>
    </div>
  );
}

export function WeatherPanel() {
  const { weather, address } = useApp();

  if (!weather) {
    return (
      <section className="surface rounded-2xl p-5">
        <h2 className="text-base font-semibold">Clima</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Busque uma localidade para ver as condições climáticas.
        </p>
      </section>
    );
  }
  const cidade =
    address?.localidade && isNaN(Number(address.localidade))
      ? address.localidade
      : address?.cidadeNome;

  return (
    <section className="surface rounded-2xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          {/*} <h2 className="text-base font-semibold">{address?.bairro}</h2> */}

          <h2 className="text-base font-semibold">
            {address?.bairro && address.bairro.trim() !== ""
              ? address.bairro
              : cidade}
          </h2>
          <p className="text-sm capitalize text-muted-foreground">{weather.description}</p>
        </div>
        <img
          src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
          alt={weather.description}
          width={64}
          height={64}
          loading="lazy"
        />
      </div>
      <p className="mt-1 font-display text-5xl font-semibold">{Math.round(weather.temp)}°C</p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Stat label="Sensação" value={`${Math.round(weather.feelsLike)}°C`} />
        <Stat label="Umidade" value={`${weather.humidity}%`} />
        <Stat label="Vento" value={`${weather.wind.toFixed(1)} m/s`} />
        <Stat label="Nuvens" value={`${weather.clouds}%`} />
      </div>
    </section>
  );
}

export default WeatherPanel;
