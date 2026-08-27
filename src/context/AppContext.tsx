import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  fetchCep,
  fetchWeather,
  fetchForecast,
  geocode,
  geocodeRegional,
  type CepAddress,
  type Coordinates,
  type Weather,
} from "@/lib/api";

type AppContextValue = {
  address: CepAddress | null;
  coords: Coordinates | null;
  weather: Weather | null;
  forecast: any | null;
  loading: boolean;
  error: string | null;
  cloudsVisible: boolean;
  toggleClouds: () => void;

  searchByCep: (cep: string) => Promise<void>;
  searchByRegion: (params: {
    estado: string;
    cidade: string;       // ID IBGE
    cidadeNome: string;   // Nome real da cidade
    bairro?: string | null | undefined;
  }) => Promise<void>;

  clearError: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<CepAddress | null>(null);
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [forecast, setForecast] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cloudsVisible, setCloudsVisible] = useState(true);

  // ============================
  // BUSCA POR CEP
  // ============================
  const searchByCep = useCallback(async (cep: string) => {
    setLoading(true);
    setError(null);

    try {
      const found = await fetchCep(cep);
      setAddress(found);

      const position = await geocode(found);
      setCoords(position);

      try {
        setWeather(await fetchWeather(position));
        setForecast(await fetchForecast(position));
      } catch (weatherError) {
        setWeather(null);
        setForecast(null);
        setError((weatherError as Error).message);
      }
    } catch (searchError) {
      setAddress(null);
      setCoords(null);
      setWeather(null);
      setForecast(null);
      setError("Localidade não encontrada. Verifique o CEP informado.");
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================
  // BUSCA POR ESTADO / CIDADE / BAIRRO
  // ============================
  const searchByRegion = useCallback(
    async ({
      estado,
      cidade,
      cidadeNome,
      bairro,
    }: {
      estado: string;
      cidade: string;
      cidadeNome: string;
      bairro?: string | null | undefined;
    }) => {
      setLoading(true);
      setError(null);

      try {
        const position = await geocodeRegional({
          estado,
          cidade,
          bairro: bairro ?? null,
        });

        setCoords(position);

        setAddress({
          cep: "",
          logradouro: "",
          bairro: bairro ?? "",
          localidade: cidadeNome,
          uf: estado,
        });

        try {
          setWeather(await fetchWeather(position));
          setForecast(await fetchForecast(position));
        } catch (weatherError) {
          setWeather(null);
          setForecast(null);
          setError((weatherError as Error).message);
        }
      } catch (searchError) {
        setAddress(null);
        setCoords(null);
        setWeather(null);
        setForecast(null);
        setError("Localidade não encontrada. Verifique os dados informados.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const value = useMemo(
    () => ({
      address,
      coords,
      weather,
      forecast,
      loading,
      error,
      cloudsVisible,
      toggleClouds: () => setCloudsVisible((visible) => !visible),

      searchByCep,
      searchByRegion,

      clearError: () => setError(null),
    }),
    [address, coords, weather, forecast, loading, error, cloudsVisible, searchByCep, searchByRegion],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp deve ser usado dentro de AppProvider");
  return context;
}
