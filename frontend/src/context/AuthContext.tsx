import { createContext, useState, useEffect} from 'react';
import type { ReactNode } from 'react';
import type { AuthContextType } from '../shared/types/AuthContextType';
import type { User } from '../shared/types/user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = !!user

  useEffect(() => {
      const restoreSession = async () => {
      try {
        const res = await fetch("/api/auth/refresh", {
          credentials: "include"
        });

        if (!res.ok) throw new Error();

        const data = await res.json();
        setUser(data.user);
      } catch {
        setUser(null);
      } 
    };

    restoreSession();
  }, []);


const login = async (email: string, password: string) => {
  try {
    const res = await fetch('/api/auth/login', { 
        method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
     });
    if (res && res.ok) { // Añadimos chequeo de seguridad "res &&"
      const data = await res.json();
      setUser(data.user);
    }
  } catch (error) {
    console.error("Error en login:", error);
  }
};

  const logout = async () => {

    try{
        const res = await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
        })

        if(res.ok){
            setUser(null)
        }
    } catch (error){
        console.error("Error en logout:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
