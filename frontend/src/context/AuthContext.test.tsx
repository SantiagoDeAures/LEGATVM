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
            json: async () => ({ result: { user: mockUser, accessToken: 'token-123' } }),
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
        // Mock refresh call (fails — no session to restore)
        // @ts-expect-error: Not implemented yet
        fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({}),
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

        // Wait for loading to finish
        await waitFor(() => {
            expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
        });

        // Mock login call
        // @ts-expect-error: Not implemented yet
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ user: mockUser, accessToken: 'token-123' }),
        });

        act(() => {
            screen.getByRole('button', { name: /login/i }).click();
        });
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/auth/login'),
                expect.objectContaining({
                    method: 'POST',
                    credentials: 'include',
                })
            );
            expect(contextValue?.user).toEqual(mockUser);
        });
    });

    it('logout function calls /api/auth/logout and clears user', async () => {
        // Mock refresh call (succeeds — restore session with user)
        (vi.mocked(fetch))
            .mockResolvedValueOnce({ ok: true, json: async () => ({ result: { user: mockUser, accessToken: 'token-123' } }) } as unknown as Response)

        let contextValue: AuthContextType | undefined
        function TestComponent() {
            const auth = useContext(AuthContext);

            // Usamos useEffect para asignar el valor de forma segura
            useEffect(() => {
                contextValue = auth;
            }, [auth]);
            return <button onClick={() => auth?.logout()}>Logout</button>;
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
                expect.stringContaining('/api/auth/logout'),
                expect.objectContaining({
                    method: 'POST',
                    credentials: 'include',
                })
            );
            expect(contextValue?.user).toBeNull();
        });
    });
});
