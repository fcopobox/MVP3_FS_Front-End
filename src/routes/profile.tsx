import { createFileRoute } from "@tanstack/react-router";
import ProfilePage from "@/components/ProfilePage";

export const Route = createFileRoute("/profile")({
    head: () => ({
        meta: [
            { title: "Meu perfil | WeatherMap" },
            { name: "description", content: "Gerencie suas informações pessoais." },
        ],
    }),
    component: ProfilePage,
});
