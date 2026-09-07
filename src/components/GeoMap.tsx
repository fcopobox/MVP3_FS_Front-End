import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getOpenWeatherKey, type Coordinates } from "@/lib/api";

type Props = {
  coords: Coordinates | null;
  label?: string | undefined;
  clouds: boolean;
  toggleClouds: () => void;
};

export function GeoMap({ coords, label, clouds, toggleClouds }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const cloudLayerRef = useRef<L.TileLayer | null>(null);
  const precipitationLayerRef = useRef<L.TileLayer | null>(null);

  const windLayerRef = useRef<L.TileLayer | null>(null);
  const tempLayerRef = useRef<L.TileLayer | null>(null);

  const solarLayerRef = useRef<L.TileLayer | null>(null);
  const pressureLayerRef = useRef<L.TileLayer | null>(null);
  const airLayerRef = useRef<L.TileLayer | null>(null);


  const coordsRef = useRef<Coordinates | null>(null);

  // base layers
  const osmBaseLayerRef = useRef<L.TileLayer | null>(null);
  const whiteBaseLayerRef = useRef<L.TileLayer | null>(null);

  // Camadas weather
  const [wind, setWind] = useState(false);
  const [temp, setTemp] = useState(false);
  const [solar, setSolar] = useState(false);
  const [pressure, setPressure] = useState(false);
  const [air, setAir] = useState(false);


  // manter sempre o último coords disponível para o botão
  useEffect(() => {
    coordsRef.current = coords;
  }, [coords]);

  // Inicialização do mapa + criação do botão de centralizar (uma vez só)
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: true,
      minZoom: 2,
      maxZoom: 18,
    }).setView([-14.235, -51.925], 4);

    map.setMaxBounds([
      [-85, -180],
      [85, 180],
    ]);

    map.options.maxBoundsViscosity = 1.0;

    // Base layer padrão (OSM)
    osmBaseLayerRef.current = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap",
      }
    ).addTo(map);

    // Base layer branco 
    whiteBaseLayerRef.current = L.tileLayer(
      "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
      {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap HOT",
      }
    );


    mapRef.current = map;

    // observar mudanças no tamanho do container
    const observer = new ResizeObserver(() => {
      const currentCoords = coordsRef.current;
      if (mapRef.current && currentCoords) {
        mapRef.current.invalidateSize();
        mapRef.current.setView(
          [currentCoords.lat, currentCoords.lon],
          14
        );
      }
    });

    observer.observe(containerRef.current);

    const CenterControl = L.Control.extend({
      options: { position: "topleft" },

      onAdd: function () {
        const container = L.DomUtil.create("div", "leaflet-bar leaflet-control");

        const button = L.DomUtil.create("a", "", container);
        button.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2l3 3h-2v4h4V7l3 3-3 3v-2h-4v4h2l-3 3-3-3h2v-4H7v2l-3-3 3-3v2h4V5H9l3-3z"/>
                            </svg>
                          </div>`;
        button.title = "Centralizar mapa";
        button.href = "#";

        L.DomEvent.on(button, "click", (e) => {
          L.DomEvent.stopPropagation(e);
          L.DomEvent.preventDefault(e);

          const currentCoords = coordsRef.current;
          if (mapRef.current && currentCoords) {
            mapRef.current.flyTo(
              [currentCoords.lat, currentCoords.lon],
              14,
              { duration: 0.8 }
            );

            setTimeout(() => {
              map.invalidateSize();
            }, 300);
          }
        });

        return container;
      },
    });

    map.addControl(new CenterControl());

    return () => {
      observer.disconnect();
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
      cloudLayerRef.current = null;
      precipitationLayerRef.current = null;
      windLayerRef.current = null;
      tempLayerRef.current = null;
    };
  }, []);

  // Troca dinâmica do mapa base (OSM ↔ branco)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const osm = osmBaseLayerRef.current;
    const white = whiteBaseLayerRef.current;

    if (!osm || !white) return;

    // Remover ambos os mapas
    if (map.hasLayer(osm)) map.removeLayer(osm);
    if (map.hasLayer(white)) map.removeLayer(white);

    if (temp || pressure || air || solar) {
      // temperatura ligada → usar mapa branco
      if (map.hasLayer(osm)) map.removeLayer(osm);
      if (!map.hasLayer(white)) white.addTo(map);

      const whiteContainer = white.getContainer();
      if (whiteContainer) {
        whiteContainer.style.filter = `
        brightness(1.1)
        contrast(2)
        saturate(.1)
      `;
      }

      // REMOVER BLEND MODE QUANDO O MAPA É BRANCO
      if (tempLayerRef.current) {
        const tempContainer = tempLayerRef.current.getContainer();
        if (tempContainer) tempContainer.style.mixBlendMode = "color-burn";
      }

      if (cloudLayerRef.current) {
        const cloudsContainer = cloudLayerRef.current.getContainer();
        if (cloudsContainer) cloudsContainer.style.mixBlendMode = "normal";
      }

      if (precipitationLayerRef.current) {
        const precipContainer = precipitationLayerRef.current.getContainer();
        if (precipContainer) precipContainer.style.mixBlendMode = "normal";
      }

    } else {
      // temperatura desligada → voltar ao OSM
      if (map.hasLayer(white)) map.removeLayer(white);
      if (!map.hasLayer(osm)) osm.addTo(map);

      // RESTAURAR BLEND MODE NO MAPA NORMAL
      if (tempLayerRef.current) {
        const tempContainer = tempLayerRef.current.getContainer();
        if (tempContainer) tempContainer.style.mixBlendMode = "multiply";
      }

      if (cloudLayerRef.current) {
        const cloudsContainer = cloudLayerRef.current.getContainer();
        if (cloudsContainer) cloudsContainer.style.mixBlendMode = "multiply";
      }

      if (precipitationLayerRef.current) {
        const precipContainer = precipitationLayerRef.current.getContainer();
        if (precipContainer) precipContainer.style.mixBlendMode = "darken";
      }
    }

  }, [temp, pressure, air, solar]);


  // Atualização do marker e flyTo
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !coords) return;

    const position: L.LatLngExpression = [coords.lat, coords.lon];

    if (!markerRef.current) {
      const icon = L.divIcon({
        className: "",
        html: `
          <span style="
            display:block;
            width:18px;
            height:18px;
            border-radius:9999px;
            background:oklch(0.72 0.15 226);
            box-shadow:0 0 0 6px oklch(0.72 0.15 226 / 30%);
          "></span>
        `,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });

      markerRef.current = L.marker(position, { icon }).addTo(map);
    } else {
      markerRef.current.setLatLng(position);
    }

    if (label) markerRef.current.bindPopup(label);

    map.flyTo(position, 14, { duration: 0.8 });

    setTimeout(() => {
      map.invalidateSize();
    }, 300);
  }, [coords, label]);

  // Camadas de nuvens e precipitação
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const key = getOpenWeatherKey();
    if (!key) return;

    if (clouds) {
      if (!cloudLayerRef.current) {
        cloudLayerRef.current = L.tileLayer(
          `https://tile.openweathermap.org/map/clouds/{z}/{x}/{y}.png?appid=${key}`,
          {
            opacity: 0.75,
            attribution: "&copy; OpenWeatherMap",
            zIndex: 10,
          }
        );
      }

      cloudLayerRef.current.addTo(map);
      const cloudsContainer = cloudLayerRef.current.getContainer();
      if (cloudsContainer) {
        cloudsContainer.style.mixBlendMode = "multiply";
        cloudsContainer.style.filter = "brightness(0.75) contrast(1.25)";
      }

      if (!precipitationLayerRef.current) {
        precipitationLayerRef.current = L.tileLayer(
          `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${key}`,
          {
            opacity: 0.9,
            attribution: "&copy; OpenWeatherMap",
            zIndex: 20,
          }
        );
      }

      precipitationLayerRef.current.addTo(map);
      const precipContainer = precipitationLayerRef.current.getContainer();
      if (precipContainer) {
        precipContainer.style.mixBlendMode = "darken";
        precipContainer.style.filter = "brightness(0.65) contrast(1.35)";
      }
    } else {
      if (precipitationLayerRef.current)
        map.removeLayer(precipitationLayerRef.current);
      if (cloudLayerRef.current) map.removeLayer(cloudLayerRef.current);
    }
  }, [clouds]);

  // Camada de vento
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const key = getOpenWeatherKey();
    if (!key) return;

    if (wind) {
      if (!windLayerRef.current) {
        windLayerRef.current = L.tileLayer(
          `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${key}`,
          {
            opacity: 0.85,
            attribution: "&copy; OpenWeatherMap",
            zIndex: 30,
          }
        );
      }

      windLayerRef.current.addTo(map);
    } else {
      if (windLayerRef.current) map.removeLayer(windLayerRef.current);
    }
  }, [wind]);

  // Camada de temperatura
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const key = getOpenWeatherKey();
    if (!key) return;

    if (temp) {
      if (!tempLayerRef.current) {
        tempLayerRef.current = L.tileLayer(
          `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${key}`,
          {
            opacity: 1.0,
            attribution: "&copy; OpenWeatherMap",
            zIndex: 5,
          }
        );
      }

      const layer = tempLayerRef.current;
      layer.addTo(map);

      const tempContainer = layer.getContainer();
      if (tempContainer) {
        tempContainer.style.mixBlendMode = "normal";
        tempContainer.style.filter =
          "brightness(1.15) contrast(1) saturate(30)";
      }
    } else {
      if (tempLayerRef.current) {
        map.removeLayer(tempLayerRef.current);
      }
    }
  }, [temp, pressure, air, solar]);

  // camada de radiação solar
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const key = getOpenWeatherKey();
    if (!key) return;

    if (solar) {
      if (!solarLayerRef.current) {
        solarLayerRef.current = L.tileLayer(
          `https://maps.openweathermap.org/maps/2.0/weather/SOLAR_IRRADIANCE/{z}/{x}/{y}?appid=${key}`,
          {
            opacity: 0.85,
            zIndex: 35,
          }
        );
      }

      solarLayerRef.current.addTo(map);

      const container = solarLayerRef.current.getContainer();
      if (container) {
        container.style.mixBlendMode = "multiply";
        container.style.filter = "brightness(1.2) contrast(1.4)";
      }
    } else {
      if (solarLayerRef.current) map.removeLayer(solarLayerRef.current);
    }
  }, [solar]);

  // camada de pressão atmosférica
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const key = getOpenWeatherKey();
    if (!key) return;

    if (pressure) {
      if (!pressureLayerRef.current) {
        pressureLayerRef.current = L.tileLayer(
          `https://tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid=${key}`,
          {
            opacity: 0.9,
            zIndex: 32,
          }
        );
      }

      pressureLayerRef.current.addTo(map);

      const container = pressureLayerRef.current.getContainer();
      if (container) {
        container.style.mixBlendMode = "multiply";
        container.style.filter = "contrast(1.3)";
      }
    } else {
      if (pressureLayerRef.current) map.removeLayer(pressureLayerRef.current);
    }
  }, [pressure]);

  // camada de poluição do ar
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const key = getOpenWeatherKey();
    if (!key) return;

    if (air) {
      if (!airLayerRef.current) {
        airLayerRef.current = L.tileLayer(
          `https://tile.openweathermap.org/map/air_pollution/{z}/{x}/{y}.png?appid=${key}`,
          {
            opacity: 0.9,
            zIndex: 33,
          }
        );
      }

      airLayerRef.current.addTo(map);

      const container = airLayerRef.current.getContainer();
      if (container) {
        container.style.mixBlendMode = "multiply";
        container.style.filter = "brightness(1.1) contrast(1.4)";
      }
    } else {
      if (airLayerRef.current) map.removeLayer(airLayerRef.current);
    }
  }, [air]);


  return (
    <div className="relative w-full min-h-[350px] sm:min-h-[400px] md:min-h-[500px] lg:h-full rounded-2xl overflow-hidden">
      <div ref={containerRef} className="absolute inset-0" />

      {/* Painel de controles integrado */}
      <div
        className="absolute top-3 right-3 z-[1000] flex flex-col gap-3
           bg-transparent backdrop-blur-md 
           border border-border/40 
           text-black/80
           rounded-xl px-4 py-4 shadow"

      >
        {/* Controle Nuvens */}
        <button
          onClick={toggleClouds}
          type="button"
          role="switch"
          aria-checked={clouds}
          className="flex items-center justify-between gap-3 w-full text-sm"
        >
          <span className="font-medium">Nuvens</span>
          <span
            className={`relative h-5 w-10 rounded-full transition-colors ${clouds ? "bg-green-500" : "bg-muted"
              }`}
          >
            <span
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-background shadow transition-all ${clouds ? "left-5" : "left-0.5"
                }`}
            />
          </span>
        </button>

        {/* Controle Vento */}
        <button
          onClick={() => setWind(!wind)}
          type="button"
          role="switch"
          aria-checked={wind}
          className="flex items-center justify-between gap-3 w-full text-sm"
        >
          <span className="font-medium">Vento</span>
          <span
            className={`relative h-5 w-10 rounded-full transition-colors ${wind ? "bg-green-500" : "bg-muted"
              }`}
          >
            <span
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-background shadow transition-all ${wind ? "left-5" : "left-0.5"
                }`}
            />
          </span>
        </button>

        {/* Controle Pressão */}
        <button
          onClick={() => setPressure(!pressure)}
          role="switch"
          aria-checked={pressure}
          className="flex items-center justify-between gap-3 w-full text-sm"
        >
          <span className="font-medium">Pressão atm</span>
          <span
            className={`relative h-5 w-10 rounded-full transition-colors ${pressure ? "bg-green-500" : "bg-muted"
              }`}
          >
            <span
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-background shadow transition-all ${pressure ? "left-5" : "left-0.5"
                }`}
            />
          </span>
        </button>

        {/* Controle Temperatura */}
        <button
          onClick={() => setTemp(!temp)}
          type="button"
          role="switch"
          aria-checked={temp}
          className="flex items-center justify-between gap-3 w-full text-sm"
        >
          <span className="font-medium">Temperatura</span>
          <span
            className={`relative h-5 w-10 rounded-full transition-colors ${temp ? "bg-green-500" : "bg-muted"
              }`}
          >
            <span
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-background shadow transition-all ${temp ? "left-5" : "left-0.5"
                }`}
            />
          </span>
        </button>

        {/* Escalas lado a lado */}
        <div className="flex flex-row gap-4 mt-2">

          {/* Escala de pressão */}
          {pressure && (
            <div
              className="flex flex-col items-center 
                 bg-background/10 backdrop-blur-sm border border-border/40 
                 rounded-xl px-3 py-3 shadow"
            >
              <span className="text-xs font-medium mb-2">hPa</span>

              <div className="relative h-40 w-14">

                {/* Gradiente de pressão (OpenWeather padrão) */}
                <div
                  className="absolute left-0 top-0 h-full w-4 rounded-md overflow-hidden"
                  style={{
                    background: `
              linear-gradient(
                to bottom,
                #4b0082 0%,     /* 1030 hPa - alta pressão */
                #0000ff 20%,    /* 1020 */
                #00ffff 40%,    /* 1010 */
                #00ff00 60%,    /* 1000 */
                #ffff00 75%,    /* 990 */
                #ffa500 90%,    /* 980 */
                #ff0000 100%    /* 970 hPa - baixa pressão */
              )
            `,
                  }}
                />

                {/* Labels */}
                <span className="absolute left-6 text-[10px]" style={{ top: "0%" }}>
                  1030
                </span>
                <span className="absolute left-6 text-[10px]" style={{ top: "20%" }}>
                  1020
                </span>
                <span className="absolute left-6 text-[10px]" style={{ top: "40%" }}>
                  1010
                </span>
                <span className="absolute left-6 text-[10px]" style={{ top: "60%" }}>
                  1000
                </span>
                <span className="absolute left-6 text-[10px]" style={{ top: "75%" }}>
                  990
                </span>
                <span className="absolute left-6 text-[10px]" style={{ top: "90%" }}>
                  980
                </span>
                <span className="absolute left-6 text-[10px]" style={{ top: "100%" }}>
                  970
                </span>
              </div>
            </div>
          )}

          {/* Escala de temperatura */}
          {temp && (
            <div
              className="flex flex-col items-center 
                 bg-background/10 backdrop-blur-sm border border-border/40 
                 rounded-xl px-3 py-3 shadow"
            >
              <span className="text-xs font-medium mb-2">°C</span>

              <div className="relative h-40 w-14">
                <div
                  className="absolute left-0 top-0 h-full w-4 rounded-md overflow-hidden"
                  style={{
                    background: `
              linear-gradient(
                to bottom,
                #800000 0%,
                #ff0000 15%,
                #ffa500 30%,
                #ffff00 45%,
                #00ff00 60%,
                #00ffff 75%,
                #0000ff 90%,
                #ff00ff 100%
              )
            `,
                  }}
                />

                <span className="absolute left-6 text-[10px]" style={{ top: "0%" }}>
                  +40°
                </span>
                <span className="absolute left-6 text-[10px]" style={{ top: "15%" }}>
                  +30°
                </span>
                <span className="absolute left-6 text-[10px]" style={{ top: "30%" }}>
                  +20°
                </span>
                <span className="absolute left-6 text-[10px]" style={{ top: "45%" }}>
                  +10°
                </span>
                <span className="absolute left-6 text-[10px]" style={{ top: "60%" }}>
                  0°
                </span>
                <span className="absolute left-6 text-[10px]" style={{ top: "75%" }}>
                  -10°
                </span>
                <span className="absolute left-6 text-[10px]" style={{ top: "90%" }}>
                  -20°
                </span>
                <span className="absolute left-6 text-[10px]" style={{ top: "100%" }}>
                  -40°
                </span>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
export default GeoMap;
