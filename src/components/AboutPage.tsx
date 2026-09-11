import { Link } from "@tanstack/react-router";
import diagramaImg from '../assets/Diagrama.png';

function AboutPage() {
    return (
        <main className="p-6 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Sobre o Projeto</h1>

            <p className="mb-4">
                O <strong>WeatherMap</strong> é um MVP desenvolvido para a disciplina Back-End Avançado <br />
                do curso de Pós-Graduação em Desenvolvimento Full Stack da PUC-Rio.
            </p>

            {/* Autor */}
            <h2 className="text-xl font-semibold mt-6 mb-2">Autor</h2>
            <p className="mb-4">Francisco Silveira</p>

            <h2 className="text-xl font-semibold mt-6 mb-2">Descrição</h2>
            <p className="mb-4">
                O <strong>WeatherMap</strong> é composto por um frontend em React + Vite e uma
                API backend desenvolvida em FastAPI. <br /><br />
                O backend gerencia usuários, autenticação e autorização via tickets JWT. Todas as credenciais são armazenadas
                em um banco SQLite utilizando hash bcrypt, enquanto o SQLAlchemy organiza o acesso aos dados.<br /><br />

                O frontend é construído com React + Vite, utilizando TailwindCSS para estilização e TanStack Router para gerenciamento
                de rotas. Consome diretamente APIs externas como ViaCEP, IBGE, OpenWeatherMap, OpenStreetMap e Nominatim, processando
                esses dados para exibir informações de clima, localização e navegação em mapa por meio de componentes interativos baseados
                em Leaflet.<br /><br />

                A interface permite aos usuários consultar condições climáticas por CEP, ou Estado / Cidade, além de visualizar camadas
                meteorológicas como nuvens e precipitação, vento, temperatura e pressão atmosférica.
            </p>



            {/* Funcionalidades */}
            <h2 className="text-xl font-semibold mt-6 mb-2">Funcionalidades</h2>
            <ul className="list-disc pl-6 space-y-1">
                <li>Consulta de clima por CEP ou localidade (Estado / Cidade)</li>
                <li>Visualização de camadas meteorológicas (nuvens / precipitação, vento, temperatura, pressão atmosférica)</li>
                <li>Mapa interativo com OpenStreetMap e Leaflet</li>
                <li>Integração com ViaCEP, IBGE, Nominatim e OpenWeatherMap</li>
                <li>Autenticação de usuário e rotas protegidas</li>
            </ul>

            {/* Tecnologias */}
            <h2 className="text-xl font-semibold mt-6 mb-2">Tecnologias</h2>
            <ul className="list-disc pl-6 space-y-1">
                <li>React + Vite</li>
                <li>TanStack Router</li>
                <li>TypeScript</li>
                <li>TailwindCSS</li>
                <li>Leaflet + React Leaflet</li>
                <li>FastAPI (Backend)</li>
                <li>SQLite + SQLAlchemy</li>
                <li>bcrypt (hash de senhas)</li>
                <li>Docker (containerização)</li>
            </ul>
            
            {/* Diagrama de Arquitetura */}
            <div className="mt-6">
                <h2 className="text-xl font-semibold mt-6 mb-2">Diagrama de Arquitetura</h2>
                    <img 
                    src={diagramaImg} 
                    alt="Diagrama de arquitetura" 
                    />
            </div>

            {/* Observação */}
            <p className="mt-6 text-sm text-gray-500">
                Este projeto foi desenvolvido como parte de um MVP acadêmico para fins educacionais.
            </p>

            {/* Botão de retorno para a Home */}
            <div className="mt-8 flex justify-center">
                <Link
                    to="/"
                    className="inline-flex h-11 items-center justify-center rounded-lg bg-gradient-primary px-6 text-sm font-medium text-primary-foreground shadow-glow transition-all hover:brightness-110"
                >
                    Voltar para a Home
                </Link>
            </div>

            {/* Botão Voltar */}
            <div className="mt-4 flex justify-center">
                <Link
                    to="/"
                    className="inline-flex h-10 items-center justify-center rounded-lg bg-muted px-4 text-sm font-medium text-foreground hover:bg-muted/70 transition-colors"
                >
                    Voltar
                </Link>
            </div>
        </main>
    );
}

export default AboutPage;
