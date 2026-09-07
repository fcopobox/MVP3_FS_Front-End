import { useEffect, useRef } from "react";
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
  const coordsRef = useRef<Coordinates | null>(null);

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

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

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
    };
  }, []);

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
    // força o mapa a recalcular o tamanho após mudanças no layout
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

  return (
    <div className="relative w-full min-h-[350px] sm:min-h-[400px] md:min-h-[500px] lg:h-full rounded-2xl overflow-hidden">
      <div ref={containerRef} className="absolute inset-0" />

      <button
        onClick={toggleClouds}
        type="button"
        role="switch"
        aria-checked={clouds}
        className="absolute top-3 right-3 z-[1000] flex items-center gap-2 rounded-xl 
                bg-background/80 backdrop-blur border border-border px-3 py-2 text-sm shadow"
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
    </div>
  );
}

export default GeoMap;
