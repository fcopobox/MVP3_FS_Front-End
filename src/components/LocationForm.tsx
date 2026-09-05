import { useEffect, useState } from "react";
import Autocomplete from "@/components/Autocomplete";

// Tipos IBGE
type EstadoIBGE = { id: number; sigla: string; nome: string };
type CidadeIBGE = { id: number; nome: string };
type BairroIBGE = { id: number; nome: string };

type Props = {
    onSubmit: (data: any) => void;
};


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

    // Carregar estados ao iniciar
    useEffect(() => {
        fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
            .then((r) => r.json())
            .then((data: EstadoIBGE[]) =>
                setEstados(data.sort((a, b) => a.nome.localeCompare(b.nome)))
            );
    }, []);

    // Carregar cidades ao escolher estado
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
        if (!cidade) return;

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

        const cidadeNome =
            cidades.find(c => String(c.id) === String(cidade))?.nome ?? "";

        onSubmit({
            estado,
            cidade,
            cidadeNome,
            bairro: bairro,
        });
    }

    async function carregarBairros(cidadeId: string) {
        if (!cidadeId) {
            setBairros([]);
            return;
        }

        try {
            const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/municipios/${cidadeId}/distritos`);
            const data = await response.json();

            setBairros(data);
        } catch (error) {
            console.error("Erro ao carregar bairros:", error);
            setBairros([]);
        }
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
                                // Se o nome selecionado é igual ao atual, não limpa o bairro
                                if (nome === cidadeNome) {
                                    return;
                                }

                                const cidadeObj = cidades.find(c => c.nome === nome);
                                setCidade(String(cidadeObj?.id || ""));
                                setCidadeNome(nome);

                                // Só limpa quando a cidade realmente muda
                                setBairro("");
                                setBairros([]);
                                // carrega bairros da nova cidade
                                carregarBairros(String(cidadeObj?.id || ""));
                            }}

                        />
                    )}

                    {/* Bairro */}
                    {cidade && (
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
                className="w-full rounded-xl bg-primary text-primary-foreground px-4 py-2 font-medium
                           transition-colors active:bg-primary/70"
            >
                Clima
            </button>

        </form>
    );
}

export default LocationForm;
