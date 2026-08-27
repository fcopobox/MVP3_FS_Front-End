import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    ReactNode,
} from "react";
import { useAuth0 } from "@auth0/auth0-react";

export type AuthUser = { name?: string | undefined; email?: string | undefined };

type AuthContextValue = {
    token: string | null;
    user: AuthUser | null;
    ready: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const {
        isAuthenticated,
        user,
        isLoading: authLoading,
        loginWithRedirect,
        getAccessTokenSilently,
        logout: auth0Logout,
    } = useAuth0();

    const [token, setToken] = useState<string | null>(null);
    const [ready, setReady] = useState(false);

    // Obtém token real do Auth0
    useEffect(() => {
        async function fetchToken() {
            if (!isAuthenticated) {
                setToken(null);
                setReady(true);
                return;
            }

            try {
                const accessToken = await getAccessTokenSilently();
                setToken(accessToken);
            } catch (err) {
                console.error("Erro ao obter token do Auth0:", err);
                setToken(null);
            } finally {
                setReady(true);
            }
        }

        fetchToken();
    }, [isAuthenticated, getAccessTokenSilently]);

    // Mantemos a API antiga para não quebrar nada
    const login = async () => {
        await loginWithRedirect();
    };

    const register = async () => {
        // Registro agora é responsabilidade do Auth0
        // Você pode implementar via Auth0 Management API se quiser
        throw new Error("Registro via Auth0 não implementado.");
    };

    const resetPassword = async () => {
        // Reset de senha também é responsabilidade do Auth0
        throw new Error("Reset de senha via Auth0 não implementado.");
    };

    const logout = () => {
        auth0Logout({ logoutParams: { returnTo: window.location.origin } });
    };

    const value = useMemo(
        () => ({
            token,
            user: user
                ? {
                    email: user.email ?? undefined,
                    name: user.name ?? undefined,
                }
                : null,
            ready: ready && !authLoading,
            isAuthenticated,
            login,
            register,
            resetPassword,
            logout,
        }),
        [token, user, ready, authLoading, isAuthenticated]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider");
    return context;
}
