// Front-end only integrations. Auth goes to the FastAPI/Auth0 backend,
// everything else (ViaCEP, Nominatim, OpenWeatherMap) is called directly.

export const API_URL =
  (import.meta.env["VITE_API_URL"] as string | undefined) ?? "http://localhost:8000";

const OWM_STORAGE_KEY = "weathermap.owm_key";

export function getOpenWeatherKey(): string {
  const envKey = import.meta.env["VITE_OPENWEATHER_API_KEY"] as string | undefined;
  if (envKey) return envKey;
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(OWM_STORAGE_KEY) ?? "";
}

export function setOpenWeatherKey(key: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(OWM_STORAGE_KEY, key.trim());
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error(`Não foi possível falar com o servidor (${API_URL}).`);
  }
  const data = (await response.json().catch(() => null)) as
    | (T & { detail?: string; message?: string })
    | null;
  if (!response.ok) {
    throw new Error(data?.detail ?? data?.message ?? "Falha na requisição.");
  }
  return data as T;
}

/* ---------------------------
   PUT JSON (necessário p/ updateUser)
---------------------------- */
async function putJson<T>(path: string, body: unknown, token: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
    body: JSON.stringify(body),
  });

  const data = (await response.json().catch(() => null)) as
    | (T & { detail?: string })
    | null;

  if (!response.ok) {
    throw new Error(data?.detail ?? "Falha na requisição.");
  }

  return data as T;
}


/* ---------------------------
   DELETE JSON (necessário p/ deleteUser)
---------------------------- */
async function deleteJson<T>(path: string, token: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: "DELETE",
    headers: {
      token: token,
    },
  });

  const data = (await response.json().catch(() => null)) as
    | (T & { detail?: string })
    | null;

  if (!response.ok) {
    throw new Error(data?.detail ?? "Falha na requisição.");
  }

  return data as T;
}

export type LoginResponse = {
  access_token?: string;
  token?: string;
  id_token?: string;
  user?: { id?: number; name?: string; email?: string };
};

export const authApi = {
  async login(email: string, password: string) {
    return postJson<{
      access_token: string;
      token_type: string;
      user: { id: number; name: string; email: string };
    }>("/user/login", { email, password });
  },

  async register(name: string, email: string, password: string) {
    return postJson<{
      id: number;
      name: string;
      email: string;
      access_token: string;
      token_type: string;
    }>("/user/register", {
      name,
      email,
      password,
    });
  },

  /* ---------------------------
     UPDATE USER 
  ---------------------------- */
  async updateUser(id: number, data: { name?: string; email?: string }, token: string) {
    return putJson(`/user/${id}`, data, token);
  },

  /* ---------------------------
     DELETE USER 
  ---------------------------- */
  async deleteUser(id: number, token: string) {
    return deleteJson(`/user/${id}`, token);
  },

  async resetPassword(email: string) {
    return postJson("/reset-password", { email });
  },

  /* ---------------------------
     CHANGE PASSWORD
  ---------------------------- */
  async changePassword(id: number, data: { old_password: string; new_password: string }, token: string) {
    return putJson(`/user/${id}/change-password`, data, token);
  }
}

export type CepAddress = {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  cidadeNome?: string;
};

export async function fetchCep(cep: string): Promise<CepAddress> {
  const digits = cep.replace(/\D/g, "");
  const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
  if (!response.ok) throw new Error("Não foi possível consultar o ViaCEP.");
  const data = (await response.json()) as CepAddress & { erro?: boolean | string };
  if (data.erro) throw new Error("CEP não encontrado.");
  return data;
}

export type Coordinates = { lat: number; lon: number };

export async function geocode(address: CepAddress): Promise<Coordinates> {
  const { logradouro, bairro, localidade, uf } = address;

  const attempts = [
    `${logradouro}, ${bairro}, ${localidade}, ${uf}, Brasil`,
    `${bairro}, ${localidade}, ${uf}, Brasil`,
    `${localidade}, ${uf}, Brasil`,
  ];

  for (const query of attempts) {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      query,
    )}&format=json&limit=1`;

    const response = await fetch(url, { headers: { Accept: "application/json" } });
    if (!response.ok) continue;

    const results = (await response.json()) as Array<{ lat: string; lon: string }>;

    if (results && results.length > 0 && results[0]) {
      const { lat, lon } = results[0];
      return { lat: Number(lat), lon: Number(lon) };
    }
  }

  throw new Error("Não foi possível localizar as coordenadas deste endereço.");
}

export async function geocodeRegional(params: {
  estado: string;
  cidade: string;
  bairro?: string | null;
}): Promise<Coordinates> {
  const { estado, cidade, bairro } = params;

  const cityResponse = await fetch(
    `https://servicodados.ibge.gov.br/api/v1/localidades/municipios/${cidade}`,
  );

  if (!cityResponse.ok) {
    throw new Error("Não foi possível obter dados da cidade no IBGE.");
  }

  const cityData = (await cityResponse.json()) as { nome: string };
  const cityName = cityData.nome;

  const query = bairro
    ? `${bairro}, ${cityName}, ${estado}, Brasil`
    : `${cityName}, ${estado}, Brasil`;

  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
    query,
  )}&format=json&limit=1`;

  const response = await fetch(url, { headers: { Accept: "application/json" } });

  if (!response.ok) {
    throw new Error("Falha ao consultar Nominatim.");
  }

  const results = (await response.json()) as Array<{ lat: string; lon: string }>;

  if (results && results.length > 0 && results[0]) {
    const { lat, lon } = results[0];
    return { lat: Number(lat), lon: Number(lon) };
  }

  throw new Error("Não foi possível localizar coordenadas para essa região.");
}

export type Weather = {
  temp: number;
  feelsLike: number;
  humidity: number;
  wind: number;
  clouds: number;
  description: string;
  icon: string;
  city: string;
};

export async function fetchWeather({ lat, lon }: Coordinates): Promise<Weather> {
  const key = getOpenWeatherKey();
  if (!key) throw new Error("Informe sua chave da API do OpenWeatherMap para ver o clima.");

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric&lang=pt_br`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      response.status === 401
        ? "Chave do OpenWeatherMap inválida."
        : "Não foi possível obter os dados de clima.",
    );
  }

  const data = (await response.json()) as {
    main: { temp: number; feels_like: number; humidity: number };
    wind: { speed: number };
    clouds: { all: number };
    weather: Array<{ description: string; icon: string }>;
    name: string;
  };

  return {
    temp: data.main.temp,
    feelsLike: data.main.feels_like,
    humidity: data.main.humidity,
    wind: data.wind.speed,
    clouds: data.clouds.all,
    description: data.weather[0]?.description ?? "",
    icon: data.weather[0]?.icon ?? "01d",
    city: data.name,
  };
}

// ===============================
// TIPOS DE PREVISÃO
// ===============================

export type ForecastWeather = {
  id: number;
  main: string;
  description: string;
  icon: string;
};

export type ForecastItem = {
  dt: number;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
  };
  weather: ForecastWeather[];
};

export type ForecastResponse = {
  list: ForecastItem[];
};

// ===============================
// FETCH FORECAST (5 dias / 3 horas)
// ===============================

export async function fetchForecast({ lat, lon }: Coordinates): Promise<ForecastResponse> {
  const key = getOpenWeatherKey();
  if (!key) throw new Error("Informe sua chave da API do OpenWeatherMap para ver a previsão.");

  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}&units=metric&lang=pt_br`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      response.status === 401
        ? "Chave do OpenWeatherMap inválida."
        : "Não foi possível obter os dados de previsão.",
    );
  }

  return (await response.json()) as ForecastResponse;
}
