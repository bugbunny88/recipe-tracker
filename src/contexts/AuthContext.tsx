import React, { createContext, useState, useEffect, useContext } from 'react';
import * as authApi from '../api/auth';

interface User {
    id: string;
    email: string;
    createdAt?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: Error | null;
    signUp: (email: string, password: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        // Check for existing session on mount
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            setLoading(true);
            const session = await authApi.getSession();
            if (session?.user) {
                setUser(session.user);
            } else {
                setUser(null);
            }
            setError(null);
        } catch (err) {
            console.error('Auth check error:', err);
            setUser(null);
            setError(err instanceof Error ? err : new Error('Authentication check failed'));
        } finally {
            setLoading(false);
        }
    };

    const signUp = async (email: string, password: string) => {
        try {
            setLoading(true);
            const data = await authApi.signUp(email, password);
            setUser(data.user);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to sign up'));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const signIn = async (email: string, password: string) => {
        try {
            setLoading(true);
            const data = await authApi.signIn(email, password);
            setUser(data.user);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to sign in'));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        try {
            setLoading(true);
            await authApi.signOut();
            setUser(null);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to sign out'));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                error,
                signUp,
                signIn,
                signOut
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}; 