import { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import axios, { AxiosError } from 'axios';

// Create an axios instance
const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

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
        try {
            // Send the login data to the backend
            const response = await api.post('/auth/login', { email, password });
            // If login is successful, set the authenticated state
            if (response.status === 200) {
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
        setIsAuthenticated(true);
    };

    const register = async (email: string, password: string) => {
        try {
            // Send the registration data to the backend
            const response = await api.post('/auth/register', { email, password });
            // If registration is successful, set the authenticated state
            if (response.status === 201) {
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
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
