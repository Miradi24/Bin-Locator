import { createContext, useContext, useState, ReactNode, useMemo } from 'react';

// The context type defines the structure of the authentication state and methods
interface AuthContextType {
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// AuthProvider component to wrap around the app and provide authentication context
export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = async (email: string, password: string) => {
        setIsAuthenticated(true);
    };

    const register = async (email: string, password: string) => {
        setIsAuthenticated(true);
    };

    const logout = () => setIsAuthenticated(false);

    // Memoize the context value to avoid unnecessary re-renders
    const value = useMemo(
        () => ({
            isAuthenticated,
            login,
            register,
            logout,
        }),
        [isAuthenticated, login, register, logout]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the AuthContext
// This allows components to access authentication state and methods easily
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
