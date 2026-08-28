import { lazy, Suspense } from "react";
import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { ProtectedRoute } from "../components/ProtectedRoute";
import Header from "@/components/Header";
import LocationForm from "@/components/LocationForm";
import WeatherPanel from "@/components/WeatherPanel";
import ErrorMessage from "@/components/ErrorMessage";
import ApiKeyNotice from "@/components/ApiKeyNotice";
import Loader from "@/components/Loader";
import { AppProvider, useApp } from "@/context/AppContext";
import { ForecastPanel } from "@/components/ForecastPanel";


const GeoMap = lazy(() => import("@/components/GeoMap"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WeatherMap | Clima" },
      {
        name: "description",
        content:
          "Busque um CEP, veja o local no mapa OpenStreetMap e acompanhe temperatura, vento e nuvens.",
      },
      { property: "og:title", content: "WeatherMap | Clima" },
      {
        property: "og:description",
        content:
          "Busque um CEP, veja o local no mapa OpenStreetMap e acompanhe temperatura, vento e nuvens.",
      },
    ],
  }),
  component: MainScreen,
});

// ======================================================
// MapArea 
// ======================================================
function MapArea() {
  const { coords, cloudsVisible, toggleClouds, address, error, clearError } = useApp();
  const label = address ? `${address.logradouro || address.bairro}, ${address.localidade}` : undefined;

  return (
    <div className="flex flex-col gap-3 h-full">
      <ErrorMessage message={error} onDismiss={clearError} />

      <div className="flex-1">
        <ClientOnly fallback={<div className="grid h-[420px] place-items-center"><Loader label="Carregando mapa..." /></div>}>
          <Suspense fallback={<div className="grid h-[420px] place-items-center"><Loader label="Carregando mapa..." /></div>}>
            <GeoMap
              coords={coords}
              label={label}
              clouds={cloudsVisible}
              toggleClouds={toggleClouds}
            />
          </Suspense>
        </ClientOnly>
      </div>
    </div>
  );
}

// ======================================================
// MainScreen - não usa useApp()
// ======================================================
function MainScreen() {
  return (
    <ClientOnly fallback={<div>Carregando...</div>}>
      <AppProvider>
        <Header />
        <InnerMainScreen />
      </AppProvider>
    </ClientOnly>
  );
}


// ======================================================
// InnerMainScreen — useApp()
// ======================================================
function InnerMainScreen() {
  const { searchByCep, searchByRegion } = useApp();

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 
                   lg:grid-cols-[minmax(0,340px)_1fr] h-[calc(100vh-64px)]">

      {/* COLUNA ESQUERDA */}
      <div className="flex flex-col gap-4">
        <ApiKeyNotice />

        <LocationForm
          onSubmit={(data) => {
            if (data.cep) {
              searchByCep(data.cep);
            } else {
              searchByRegion({
                estado: data.estado,
                cidade: data.cidade,
                cidadeNome: data.cidadeNome,
                bairro: data.bairro,
              });
            }
          }}
        />

        <WeatherPanel />
      </div>

      {/* COLUNA DIREITA */}
      <div className="flex flex-col gap-4 h-full">

        {/* Mapa com altura reduzida */}
        <div className="flex-1 overflow-hidden rounded-2xl surface">
          <MapArea />
        </div>

        {/* Forecast horizontal */}
        <ForecastPanel />
      </div>

    </main>
  );
}

