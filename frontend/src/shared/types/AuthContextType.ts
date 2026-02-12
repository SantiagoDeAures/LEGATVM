import type { AuthUser } from "./AuthUser";

export interface AuthContextType  {
    user: AuthUser | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
}