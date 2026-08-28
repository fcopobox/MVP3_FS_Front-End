import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    ReactNode,
} from "react";
import { useAuth0 } from "@auth0/auth0-react";

export type AuthUser = {
    name: string | undefined;
    email: string | undefined;
};

type AuthContextValue = {
    token: string | null;
    user: AuthUser | null;
    ready: boolean;
    isAuthenticated: boolean;
    login: () => Promise<void>;
    register: () => Promise<void>;
    resetPassword: () => Promise<void>;
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

    console.log("AUTH0 → isAuthenticated:", isAuthenticated);
    console.log("AUTH0 → user:", user);
    console.log("AUTH0 → authLoading:", authLoading);


    // Obtém token real do Auth0
    useEffect(() => {
        async function fetchToken() {
            if (!isAuthenticated) {
                setToken(null);
                setReady(true);
                return;
            }
            console.log("AUTH_CONTEXT → token:", token);
            console.log("AUTH_CONTEXT → ready:", ready);
            if (isAuthenticated) {
                console.log("AUTH_CONTEXT → usuário autenticado, obtendo token...");
            } else {
                console.log("AUTH_CONTEXT → usuário NÃO autenticado");
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

    const login = async () => {
        await loginWithRedirect();
    };

    const register = async () => {
        throw new Error("Registro via Auth0 não implementado.");
    };

    const resetPassword = async () => {
        throw new Error("Reset de senha via Auth0 não implementado.");
    };

    const logout = () => {
        auth0Logout({
            logoutParams: {
                returnTo: "http://localhost:8080/login",
                // federated: true,
            },
        });
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
