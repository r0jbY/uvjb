/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, ReactNode } from "react";
import { checkAuth } from "../Services/Authentication";
import { getExpoPushToken } from "@/utils/push";
import { AppState } from 'react-native';
import axios from "@/app/axiosConfigs";

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


    const registerToken = async (uid: string) => {
        const token = await getExpoPushToken();
        if (!token) return;
        try {
    await axios.post(`notifications/addToken`, {
      id: uid,
      token,
    });
    console.log("✅ Registered push token:", token);
  } catch (e) {
    console.warn('❌ Failed to send push token', e);
  }
    };

    const refreshAuth = async () => {
        const { userId, isAuthenticated, role } = await checkAuth();
        setUserId(userId);
        setIsAuthenticated(isAuthenticated);
        setRole(role);

        if (isAuthenticated && userId) {
            await registerToken(userId);
        }

    };

    useEffect(() => {
        const authenticate = async () => {
            await refreshAuth();       // ⚠️ call the extended version
            setLoading(false);
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