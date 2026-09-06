import { useEffect, useState } from "react";
import Autocomplete from "@/components/Autocomplete";

// Tipos IBGE
type EstadoIBGE = { id: number; sigla: string; nome: string };
type CidadeIBGE = { id: number; nome: string };
type BairroIBGE = { id: number; nome: string };

type Props = {
    onSubmit: (data: any) => void;
};

// Lista fixa de bairros do Rio de Janeiro (ordenada)
// A API do IBGE não retorna os Bairros do Rio de Janeiro, então foi usada uma lista fixa
const bairrosRio = [
    "Abolição", "Água Santa", "Alto da Boa Vista", "Anchieta", "Andaraí", "Bancários",
    "Barra da Tijuca", "Barra de Guaratiba", "Benfica", "Bento Ribeiro", "Bonsucesso",
    "Botafogo", "Brás de Pina", "Cachambi", "Cacuia", "Camorim", "Campinho", "Campo Grande",
    "Cascadura", "Catete", "Catumbi", "Cidade de Deus", "Cidade Nova", "Cocotá", "Colégio",
    "Copacabana", "Cordovil", "Cosme Velho", "Cosmos", "Curicica", "Del Castilho",
    "Deodoro", "Encantado", "Engenho da Rainha", "Engenho de Dentro", "Engenho Novo",
    "Estácio", "Flamengo", "Freguesia (Ilha)", "Freguesia (Jacarepaguá)", "Gávea",
    "Grajaú", "Guadalupe", "Guaratiba", "Higienópolis", "Honório Gurgel", "Humaitá",
    "Inhaúma", "Ipanema", "Irajá", "Itanhangá", "Jacaré", "Jacarezinho", "Jacarepaguá",
    "Jardim América", "Jardim Botânico", "Jardim Carioca", "Jardim Guanabara",
    "Jardim Sulacap", "Lagoa", "Lapa", "Leblon", "Leme", "Lins de Vasconcelos",
    "Madureira", "Magalhães Bastos", "Mangueira", "Maracanã", "Maria da Graça",
    "Méier", "Moneró", "Olaria", "Padre Miguel", "Paquetá", "Parada de Lucas",
    "Pavuna", "Pechincha", "Pedra de Guaratiba", "Penha", "Penha Circular",
    "Piedade", "Pilares", "Pitangueiras", "Praia da Bandeira", "Quintino Bocaiúva",
    "Realengo", "Recreio dos Bandeirantes", "Riachuelo", "Ribeira", "Rocinha",
    "Rocha", "Santa Cruz", "Santa Teresa", "Santíssimo", "Santo Cristo",
    "São Conrado", "São Cristóvão", "São Francisco Xavier", "Saúde", "Senador Camará",
    "Senador Vasconcelos", "Sepetiba", "Tanque", "Taquara", "Tijuca", "Todos os Santos",
    "Tomás Coelho", "Turiaçu", "Urca", "Vargem Grande", "Vargem Pequena",
    "Vaz Lobo", "Vicente de Carvalho", "Vidigal", "Vigário Geral", "Vila da Penha",
    "Vila Isabel", "Vila Kosmos", "Vila Militar", "Vista Alegre", "Zumbi"
].sort();

export function LocationForm({ onSubmit }: Props) {
    const [mode, setMode] = useState<"cep" | "regional">("cep");

    const [cep, setCep] = useState("");

    const [estados, setEstados] = useState<EstadoIBGE[]>([]);
    const [cidades, setCidades] = useState<CidadeIBGE[]>([]);
    const [bairros, setBairros] = useState<BairroIBGE[]>([]);

    const [estado, setEstado] = useState("");
    const [cidade, setCidade] = useState("");
    const [cidadeNome, setCidadeNome] = useState("");
    const [bairro, setBairro] = useState("");

    // Carregar estados ao iniciar (IBGE)
    useEffect(() => {
        fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
            .then((r) => r.json())
            .then((data: EstadoIBGE[]) =>
                setEstados(data.sort((a, b) => a.nome.localeCompare(b.nome)))
            );
    }, []);

    // Carregar cidades ao escolher estado (IBGE)
    useEffect(() => {
        if (!estado) return;

        fetch(
            `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios`
        )
            .then((r) => r.json())
            .then((data: CidadeIBGE[]) =>
                setCidades(data.sort((a, b) => a.nome.localeCompare(b.nome)))
            );
    }, [estado]);

    // Carregar bairros ao escolher cidade
    useEffect(() => {
        if (!cidadeNome || !estado) return;

        // Se for Rio de Janeiro → usar lista fixa
        if (cidadeNome.toLowerCase() === "rio de janeiro") {
            const lista = bairrosRio.map((nome, idx) => ({
                id: idx + 1,
                nome
            }));
            setBairros(lista);
            return;
        }

        // Caso contrário buscar bairros IBGE (não funciona para o Rio de Janeiro)
        fetch(
            `https://servicodados.ibge.gov.br/api/v1/localidades/municipios/${cidade}/distritos`
        )
            .then((r) => r.json())
            .then((data: BairroIBGE[]) =>
                setBairros(data.sort((a, b) => a.nome.localeCompare(b.nome)))
            );
    }, [cidade]);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (mode === "cep") {
            const digits = cep.replace(/\D/g, "");
            if (digits.length !== 8) {
                alert("CEP inválido");
                return;
            }
            onSubmit({ cep: digits });
            return;
        }

        if (!estado) {
            alert("Selecione o estado");
            return;
        }

        if (!cidade) {
            alert("Selecione a cidade");
            return;
        }

        const cidadeNomeFinal =
            cidades.find(c => String(c.id) === String(cidade))?.nome ?? cidadeNome;

        onSubmit({
            estado,
            cidade,
            cidadeNome: cidadeNomeFinal,
            bairro,
        });
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 p-4 bg-card text-card-foreground border border-border rounded-xl shadow-card"
        >

            {/* Toggle de modo */}
            <div className="flex gap-4">
                <button
                    type="button"
                    className={`px-3 py-2 rounded-md font-medium transition ${mode === "cep"
                        ? "bg-primary text-primary-foreground shadow-glow"
                        : "bg-muted text-muted-foreground"
                        }`}
                    onClick={() => setMode("cep")}
                >
                    Buscar por CEP
                </button>

                <button
                    type="button"
                    className={`px-3 py-2 rounded-md font-medium transition ${mode === "regional"
                        ? "bg-primary text-primary-foreground shadow-glow"
                        : "bg-muted text-muted-foreground"
                        }`}
                    onClick={() => setMode("regional")}
                >
                    Busca por Estado/Cidade
                </button>
            </div>

            {mode === "cep" && (
                <div>
                    <label className="block mb-1 text-sm text-muted-foreground font-medium">
                        CEP
                    </label>
                    <input
                        type="text"
                        value={cep}
                        onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, "").slice(0, 8);
                            const formatted =
                                digits.length > 5
                                    ? `${digits.slice(0, 5)}-${digits.slice(5)}`
                                    : digits;

                            setCep(formatted);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                        maxLength={9}
                        className="w-full bg-input text-foreground border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="00000-000"
                    />
                </div>
            )}

            {mode === "regional" && (
                <>
                    {/* Estado */}
                    <Autocomplete
                        label="Estado"
                        items={estados.map(e => e.nome)}
                        value={estado ? estados.find(e => e.sigla === estado)?.nome || "" : ""}
                        onChange={(nome) => {
                            const uf = estados.find(e => e.nome === nome);
                            setEstado(uf?.sigla || "");
                            setCidade("");
                            setCidadeNome("");
                            setBairro("");
                            setCidades([]);
                            setBairros([]);
                        }}
                    />

                    {/* Cidade */}
                    {estado && (
                        <Autocomplete
                            label="Cidade"
                            items={cidades.map(c => c.nome)}
                            value={cidadeNome}
                            onChange={(nome) => {
                                if (nome === cidadeNome) return;

                                const cidadeObj = cidades.find(c => c.nome === nome);
                                setCidade(String(cidadeObj?.id || ""));
                                setCidadeNome(nome);

                                setBairro("");
                                setBairros([]);
                            }}
                        />
                    )}

                    {/* Bairro */}
                    {cidadeNome && (
                        <Autocomplete
                            label="Bairro (opcional)"
                            items={bairros.map(b => b.nome)}
                            value={bairro}
                            onChange={setBairro}
                            placeholder="Digite para buscar..."
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }
                            }}
                        />
                    )}
                </>
            )}

            <button
                type="submit"
                className="w-full rounded-xl bg-primary text-primary-foreground px-4 py-2 font-medium transition-colors active:bg-primary/70"
            >
                Consulta
            </button>

        </form>
    );
}

export default LocationForm;
