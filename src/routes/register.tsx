import { createFileRoute } from "@tanstack/react-router";
import RegisterPage from "@/components/RegisterPage";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Criar conta | WeatherMap" },
      { name: "description", content: "Crie sua conta WeatherMap e mapeie o clima por CEP." },
      { property: "og:title", content: "Criar conta | WeatherMap" },
      {
        property: "og:description",
        content: "Crie sua conta WeatherMap e mapeie o clima por CEP.",
      },
    ],
  }),
  component: RegisterPage,
});
