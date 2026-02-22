import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router';
import { ProtectedRoute } from './ProtectedRoute';
import { AuthContext } from '../../context/AuthContext';
import type { AuthContextType } from '../types/AuthContextType';

function renderWithAuth(isAuthenticated: boolean, initialRoute: string = '/protected') {
  const authValue: AuthContextType = {
    user: isAuthenticated ? { id: '1', username: 'test', email: 'test@test.com', wallet: { balance: 100 } } : null,
    isAuthenticated,
    accessToken: isAuthenticated ? 'token' : null,
    login: vi.fn(),
    logout: vi.fn(),
  };

  return render(
    <AuthContext.Provider value={authValue}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/protected" element={<div>Protected Content</div>} />
          </Route>
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

describe('ProtectedRoute', () => {
  it('renders the child route when the user is authenticated', () => {
    renderWithAuth(true);
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to /login when the user is not authenticated', () => {
    renderWithAuth(false);
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });
});
