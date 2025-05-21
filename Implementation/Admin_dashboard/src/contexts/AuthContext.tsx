/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, ReactNode } from "react";
import { checkAuth } from "../Services/AuthenticationService";


type AuthContextType = {
    isAuthenticated: boolean;
    userId: string | null;
    role: string | null;
    loading: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    setUserId: React.Dispatch<React.SetStateAction<string | null>>;
    setRole: React.Dispatch<React.SetStateAction<string | null>>;
    refreshAuth: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);

    const refreshAuth = async () => {
        const { userId, isAuthenticated, role } = await checkAuth();
        setUserId(userId);
        setIsAuthenticated(isAuthenticated);
        setRole(role);
    };

    useEffect(() => {

        const authenticate = async () => {
            const { userId, isAuthenticated, role } = await checkAuth();

            setLoading(false);
            setUserId(userId);
            setIsAuthenticated(isAuthenticated);
            setRole(role);

        };
        authenticate();
    }, []);

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            userId,
            role,
            loading,
            setIsAuthenticated,
            setUserId,
            setRole,
            refreshAuth,
        }}>
            {children}
        </AuthContext.Provider>
    );
};