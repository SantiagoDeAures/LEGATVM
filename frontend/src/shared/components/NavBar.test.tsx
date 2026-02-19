import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, vi, expect, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router';
import { useAuth } from '../../hooks/useAuth'
import NavBar from './NavBar'; 

vi.mock('../../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('NavBar', () => {

  const mockUseAuth = vi.mocked(useAuth);
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('shows guest menu with border-bottom on current page when not logged in', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      accessToken: null,
      login: vi.fn(),
      logout: vi.fn()
    });
    render(
      <MemoryRouter initialEntries={['/login']}>
        <NavBar />
      </MemoryRouter>
    );
    expect(screen.getByText('Acerca de LEGATVM')).toBeInTheDocument();
    expect(screen.getByText('Iniciar sesión')).toBeInTheDocument();
    expect(screen.getByText('Registrarse')).toBeInTheDocument();
    // Border-bottom on current page
    const loginLink = screen.getByText('Iniciar sesión');
    expect(loginLink).toHaveStyle({
  borderBottom: expect.stringContaining('2px solid'),
});
  });

  it('shows user menu with coins and username when logged in', () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: '1',
        username: 'testuser',
        email: 'test@test.com',
        wallet: {
          balance: 150
        }
      },
      isAuthenticated: false,
      accessToken: null,
      login: vi.fn(),
      logout: vi.fn()
    });
    render(
      <MemoryRouter initialEntries={['/']}> {/* Home page */}
        <NavBar />
      </MemoryRouter>
    );
    expect(screen.getByText('Acerca de LEGATVM')).toBeInTheDocument();
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByDisplayValue('150')).toBeInTheDocument();
    // Only About LEGATVM has border-bottom
    const aboutLink = screen.getByText('Acerca de LEGATVM');
    expect(aboutLink).toHaveStyle({
  borderBottom: expect.stringContaining('2px solid'),
});
  });

});
