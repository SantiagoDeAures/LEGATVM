import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useContext, useEffect } from 'react';
import type { AuthContextType } from '../shared/types/AuthContextType'
import { AuthProvider, AuthContext } from './AuthContext';

const mockUser = { id: '1', username: 'test', email: 'test@example.com'};

beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
});

describe('AuthContext', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('restores session on reload using useEffect', async () => {
        // @ts-expect-error: Not implemented yet
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ user: mockUser }),
        });
        let contextValue: AuthContextType | undefined;
        function TestComponent() {
            const auth = useContext(AuthContext);

            useEffect(() => {
                contextValue = auth;
            }, [auth]);
            return null;
        }

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );
        await waitFor(() => {
            expect(contextValue?.user).toEqual(mockUser);

        });
    });

    it('login function calls /api/auth/login with credentials and sets user', async () => {
        // @ts-expect-error: Not implemented yet
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ user: mockUser }),
        });
        let contextValue: AuthContextType | undefined;
        function TestComponent() {
            const auth = useContext(AuthContext);

            // Usamos useEffect para asignar el valor de forma segura
            useEffect(() => {
                contextValue = auth;
            }, [auth]);
            return <button onClick={() => contextValue?.login('test@example.com', 'pw')}>Login</button>;
        }

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );
        act(() => {
            screen.getByRole('button', { name: /login/i }).click();
        });
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                '/api/auth/login',
                expect.objectContaining({
                    method: 'POST',
                    credentials: 'include',
                })
            );
            expect(contextValue?.user).toEqual(mockUser);
        });
    });

    it('logout function calls /api/auth/logout and clears user', async () => {
        (vi.mocked(fetch))
            .mockResolvedValueOnce({ ok: true, json: async () => ({ user: mockUser }) } as unknown as Response)

        let contextValue: AuthContextType | undefined
        function TestComponent() {
            const auth = useContext(AuthContext);

            // Usamos useEffect para asignar el valor de forma segura
            useEffect(() => {
                contextValue = auth;
            }, [auth]);
            return <button onClick={contextValue?.logout}>Logout</button>;
        }

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => expect(contextValue?.user).toEqual(mockUser));

        vi.clearAllMocks();

        (vi.mocked(fetch)).mockResolvedValueOnce({ ok: true } as unknown as Response);

        act(() => {
            screen.getByRole('button', { name: /logout/i }).click();
        });
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                '/api/auth/logout',
                expect.objectContaining({
                    method: 'POST',
                    credentials: 'include',
                })
            );
            expect(contextValue?.user).toBeNull();
        });
    });
});
