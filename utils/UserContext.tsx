import { ReactNode, createContext, useContext } from "react";
import { useUser } from "./Authentication";

const AuthContext = createContext<any | undefined>(undefined);



export function AuthProvider({ children }: { children: ReactNode }) {
    const { userData, isLoading } = useUser();
    return (
        <AuthContext.Provider value={{ userData, isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}