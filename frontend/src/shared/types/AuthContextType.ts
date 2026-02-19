import type { AuthUser } from "./AuthUser";

export interface LoginResult {
    success: boolean;
    message?: string;
}

export interface AuthContextType  {
    user: AuthUser | null;
    isAuthenticated: boolean;
    accessToken: string | null;
    login: (email: string, password: string) => Promise<LoginResult>
    logout: () => Promise<void>
}