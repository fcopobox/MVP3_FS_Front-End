import { useApp } from "@/context/AppContext";

const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function ForecastPanel() {
    const { forecast } = useApp();

    if (!forecast) return null;

    const dias: Record<
        string,
        { temps: number[]; weatherSamples: any[]; weather?: any; date: Date }
    > = {};

    forecast.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000);

        // chave do dia usando data LOCAL (evita duplicação)
        const diaLocal = date.toLocaleDateString("pt-BR");

        if (!dias[diaLocal]) {
            dias[diaLocal] = {
                temps: [],
                weatherSamples: [],
                date,
            };
        }

        dias[diaLocal].temps.push(item.main.temp);

        // coletar todos os climas do dia com horário
        dias[diaLocal].weatherSamples.push({
            hour: date.getHours(),
            weather: item.weather[0],
        });
    });

    // escolher clima das 12:00 (ou mais próximo)
    Object.values(dias).forEach((dia) => {
        const meioDia = dia.weatherSamples.find(w => w.hour === 12);

        if (meioDia) {
            dia.weather = meioDia.weather;
        } else {
            dia.weather = dia.weatherSamples.reduce((prev, curr) =>
                Math.abs(curr.hour - 12) < Math.abs(prev.hour - 12) ? curr : prev
            ).weather;
        }
    });

    // ordenar corretamente
    const proximosDias = Object.values(dias)
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .slice(0, 5);

    return (
        <section className="surface rounded-2xl p-5">
            <h2 className="text-base font-semibold mb-3">Previsão para 5 dias</h2>

            <div className="flex gap-4 overflow-x-auto pb-2">
                {proximosDias.map((dia, idx) => {
                    const min = Math.min(...dia.temps);
                    const max = Math.max(...dia.temps);
                    const nomeDia = diasSemana[dia.date.getDay()];
                    const icon = dia.weather.icon;
                    const desc = dia.weather.description;

                    return (
                        <div
                            key={idx}
                            className="bg-card rounded-xl p-4 min-w-[160px] flex flex-col items-center justify-center flex-shrink-0 shadow-sm"
                        >
                            <img
                                src={`https://openweathermap.org/img/wn/${icon}.png`}
                                alt={desc}
                                width={48}
                                height={48}
                                className="mb-2"
                            />

                            <p className="font-medium">{nomeDia}</p>
                            <p className="text-sm text-muted-foreground capitalize mb-2">
                                {desc}
                            </p>

                            <p className="font-semibold text-lg">
                                {Math.round(min)}°C / {Math.round(max)}°C
                            </p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
