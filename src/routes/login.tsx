import { createFileRoute } from "@tanstack/react-router";
import LoginPage from "../components/LoginPage";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar | WeatherMap" },
      { name: "description", content: "Acesse o WeatherMap para consultar CEP, mapa e clima." },
      { property: "og:title", content: "Entrar | WeatherMap" },
      {
        property: "og:description",
        content: "Acesse o WeatherMap para consultar CEP, mapa e clima.",
      },
    ],
  }),
  component: LoginPage,
});
