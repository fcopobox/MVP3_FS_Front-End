import { useState, useEffect, useRef } from "react";

type Props = {
    label: string;
    items: string[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

export default function Autocomplete({
    label,
    items,
    value,
    onChange,
    placeholder = "Digite para buscar...",
    onKeyDown,
}: Props) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [highlightIndex, setHighlightIndex] = useState(-1);

    const ref = useRef<HTMLDivElement>(null);

    const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

    // Filtragem inteligente
    const filtered = query
        ? items.filter(item =>
            item.toLowerCase().includes(query.toLowerCase())
        )
        : items;

    // Fechar ao clicar fora
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Scroll automático para o item destacado
    useEffect(() => {
        if (highlightIndex >= 0 && itemRefs.current[highlightIndex]) {
            itemRefs.current[highlightIndex]?.scrollIntoView({
                block: "nearest",
                behavior: "smooth"
            });
        }
    }, [highlightIndex]);

    // Navegação por teclado
    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (!open) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();

            // Se ainda não há highlight, começa pelo primeiro item
            if (highlightIndex === -1 && filtered.length > 0) {
                setHighlightIndex(0);
                return;
            }

            // Caso contrário, navega normalmente
            setHighlightIndex((prev) =>
                prev < filtered.length - 1 ? prev + 1 : prev
            );
        }

        if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightIndex((prev) => (prev > 0 ? prev - 1 : prev));
        }

        if (e.key === "Enter") {
            e.preventDefault();
            if (highlightIndex >= 0 && filtered[highlightIndex]) {
                const item = filtered[highlightIndex];
                onChange(item);
                setQuery(item);
                setOpen(false);
            }
        }

        if (e.key === "Escape") {
            setOpen(false);
        }
    }

    return (
        <div ref={ref} className="relative w-full">
            <label className="block mb-1 text-sm text-muted-foreground font-medium">
                {label}
            </label>

            <input
                type="text"
                value={query}
                onChange={(e) => {
                    const text = e.target.value;
                    setQuery(text);
                    setOpen(true);
                    onChange(text);
                }}
                onFocus={() => setOpen(true)}
                onKeyDown={(e) => {
                    // Navegação interna do autocomplete
                    handleKeyDown(e);

                    // Se o pai passou um onKeyDown (ex: submit no Enter)
                    if (onKeyDown) {
                        // Só chamamos quando a lista NÃO está aberta
                        if (!open) {
                            onKeyDown(e);
                        }
                    }
                }}
                placeholder={placeholder}
                className="
        w-full bg-input text-foreground border border-border rounded-md px-3 py-2
        focus:outline-none focus:ring-2 focus:ring-primary
    "
            />


            {open && filtered.length > 0 && (
                <ul
                    className="
                        absolute left-0 right-0 mt-1 bg-card border border-border rounded-md shadow-lg
                        max-h-60 overflow-auto z-50
                    "
                >
                    {filtered.map((item, index) => (
                        <li
                            ref={(el) => {
                                itemRefs.current[index] = el;
                            }}
                            key={item}
                            onClick={() => {
                                onChange(item);
                                setQuery(item);
                                setOpen(false);
                            }}
                            className={`px-3 py-2 cursor-pointer ${index === highlightIndex
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-muted"}`}
                        >
                            {item}
                        </li>

                    ))}
                </ul>
            )}
        </div>
    );
}
