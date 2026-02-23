import { createContext, useState, useEffect, useRef, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { AuthContextType } from '../shared/types/AuthContextType';
import type { AuthUser } from '../shared/types/AuthUser';
import { API_URL } from '../shared/constants/API_URL';
import { Loading } from '../shared/components/Loading';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!user

  const accessTokenRef = useRef<string | null>(null);
  const refreshPromiseRef = useRef<Promise<string | null> | null>(null);

  useEffect(() => {
    accessTokenRef.current = accessToken;
  }, [accessToken]);

  useEffect(() => {
      const restoreSession = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/refresh`, {
          method: "POST",
          credentials: "include"
        });

        if (!res.ok) throw new Error();

        const data = await res.json();
        setUser(data.result.user);
        setAccessToken(data.result.accessToken);
      } catch {
        setUser(null);
      } finally {
      setLoading(false);
    }
    };

    restoreSession();
  }, []);


const login = async (email: string, password: string) => {
  try {
    const res = await fetch(`${API_URL}/api/auth/login`, { 
        method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
     });

    const data = await res.json();

    if (res.ok) {
      setUser(data.user);
      setAccessToken(data.accessToken);
      return { success: true };
    }

    return { success: false, message: data.message };
  } catch {
    return { success: false, message: 'Error de conexión con el servidor' };
  }
};

  const logout = async () => {

    try{
        const res = await fetch(`${API_URL}/api/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        })

        if(res.ok){
            setUser(null)
            setAccessToken(null)
            accessTokenRef.current = null
        }
    } catch (error){
        console.error("Error en logout:", error);
    }
  };

  const refreshAccessToken = useCallback(async (): Promise<string | null> => {
    try {
      const res = await fetch(`${API_URL}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      const newToken = data.result.accessToken as string;
      setUser(data.result.user);
      setAccessToken(newToken);
      accessTokenRef.current = newToken;
      return newToken;
    } catch {
      setUser(null);
      setAccessToken(null);
      accessTokenRef.current = null;
      return null;
    }
  }, []);

  const authFetch = useCallback(async (url: string, options: RequestInit = {}): Promise<Response> => {
    const doFetch = (token: string | null) =>
      fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
          ...options.headers,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

    let res = await doFetch(accessTokenRef.current);

    if (res.status === 401) {
      if (!refreshPromiseRef.current) {
        refreshPromiseRef.current = refreshAccessToken();
      }
      const newToken = await refreshPromiseRef.current;
      refreshPromiseRef.current = null;

      if (newToken) {
        res = await doFetch(newToken);
      }
    }

    return res;
  }, [refreshAccessToken]);

  if (loading) return <Loading />;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, accessToken, login, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
