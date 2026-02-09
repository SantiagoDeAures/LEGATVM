import type { User } from "./user"

export interface AuthContextType  {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
}