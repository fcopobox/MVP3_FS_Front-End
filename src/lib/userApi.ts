import { API_URL } from "@/lib/api";

export async function createProfile(data: any, token: string) {
    const response = await fetch(`${API_URL}/user`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => null);
        throw new Error(err?.detail ?? "Erro ao criar perfil.");
    }

    return response.json();
}

export async function getProfile(token: string) {
    const response = await fetch(`${API_URL}/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error("Erro ao carregar perfil.");
    }

    return response.json();
}

export async function updateProfile(data: any, token: string) {
    const response = await fetch(`${API_URL}/user/me`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Erro ao atualizar perfil.");
    }

    return response.json();
}

export async function updateEmail(newEmail: string, token: string) {
    const response = await fetch(`${API_URL}/user/me/email`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: newEmail }),
    });

    if (!response.ok) {
        throw new Error("Erro ao atualizar email.");
    }

    return response.json();
}

export async function resetPassword(token: string) {
    const response = await fetch(`${API_URL}/user/me/reset-password`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error("Erro ao enviar email de redefinição.");
    }

    return response.json();
}

export async function deleteAccount(token: string) {
    const response = await fetch(`${API_URL}/user/me`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error("Erro ao remover conta.");
    }

    return response.json();
}
