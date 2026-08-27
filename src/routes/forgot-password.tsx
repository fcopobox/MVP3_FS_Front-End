import { createFileRoute } from "@tanstack/react-router";
import ForgotPasswordPage from "@/components/ForgotPasswordPage";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Recuperar senha | WeatherMap" },
      { name: "description", content: "Receba instruções para redefinir sua senha do WeatherMap." },
      { property: "og:title", content: "Recuperar senha | WeatherMap" },
      {
        property: "og:description",
        content: "Receba instruções para redefinir sua senha do WeatherMap.",
      },
    ],
  }),
  component: ForgotPasswordPage,
});
