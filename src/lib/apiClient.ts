import { useAuth } from "@/context/AuthContext";

export function useApiClient() {
    const { token } = useAuth();

    async function request<T>(path: string, options: RequestInit = {}) {
        if (!token) {
            throw new Error("Usuário não autenticado — token ausente.");
        }

        const response = await fetch(`${import.meta.env["VITE_API_URL"]}${path}`, {
            ...options,
            headers: {
                ...(options.headers || {}),
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(
                data?.detail ??
                data?.message ??
                `Erro na API (${response.status}).`
            );
        }

        return data as T;
    }

    return { request };
}
