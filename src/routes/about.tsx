import { createFileRoute, Link } from '@tanstack/react-router'
import AboutPage from "@/components/AboutPage";

export const Route = createFileRoute('/about')({
    head: () => ({
        meta: [
            { title: 'WeatherMap — Sobre o Projeto' },
            {
                name: 'description',
                content: 'Informações sobre o projeto WeatherMap, funcionalidades e tecnologias utilizadas.',
            },
        ],
    }),
    component: AboutPage,
})
