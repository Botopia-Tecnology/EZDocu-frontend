
'use client';

import { createContext, useContext, ReactNode } from 'react';

export interface Account {
    id: string;
    role: 'owner' | 'member';
    name: string;
}

export interface User {
    id: string; // uuid
    email: string;
    firstName?: string;
    lastName?: string;
    roles?: string[]; // ['saas_admin']
    accounts?: Account[];
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    hasRole: (role: string) => boolean;
    hasGlobalRole: (role: string) => boolean;
    currentAccount: Account | null;
    switchAccount: (accountId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
    children,
    user,
}: {
    children: ReactNode;
    user: User | null;
}) {
    // In a real app, we might check localStorage for active account or default to first
    const currentAccount = user?.accounts?.[0] || null;

    const hasGlobalRole = (role: string) => {
        return user?.roles?.includes(role) || false;
    };

    const hasRole = (role: string) => {
        // Check global roles first? Or just account roles?
        // For now, check account role
        return currentAccount?.role === role;
    };

    const switchAccount = (accountId: string) => {
        // Implement account switching logic (cookie update or just state if SPA)
        console.log('Switch account not implemented yet', accountId);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading: false,
                hasRole,
                hasGlobalRole,
                currentAccount,
                switchAccount
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
