import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useRef, useEffect } from 'react';
import { MemoryRouter, useLocation } from 'react-router';
import { AuthProvider } from '../context/AuthContext';
import { Login } from './Login';

const mockUser = { id: '1', username: 'user1', email: 'test@example.com', wallet: { balance: 150 } };

function renderLogin() {
  return render(
    <AuthProvider>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </AuthProvider>
  );
}

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn());
  // Mock the /api/auth/refresh call from AuthProvider
  (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
    ok: false,
    json: async () => ({}),
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Login', () => {
  describe('form structure', () => {
    it('renders a field for "Correo electrónico"', () => {
      renderLogin();
      expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    });

    it('renders a field for "Contraseña"', () => {
      renderLogin();
      expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    });

    it('renders an "Iniciar sesión" button', () => {
      renderLogin();
      expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
    });
  });

  describe('validation – empty fields', () => {
    it('shows an error below email when it is empty', async () => {
      renderLogin();

      fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'password123' } });
      fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

      const errorMessages = await screen.findAllByText(/este campo es obligatorio/i);
      expect(errorMessages.length).toBe(1);
    });

    it('shows an error below password when it is empty', async () => {
      renderLogin();

      fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'test@example.com' } });
      fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

      const errorMessages = await screen.findAllByText(/este campo es obligatorio/i);
      expect(errorMessages.length).toBe(1);
    });

    it('shows error messages for both fields when both are empty', async () => {
      renderLogin();
      fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

      const errorMessages = await screen.findAllByText(/este campo es obligatorio/i);
      expect(errorMessages.length).toBe(2);
    });

    it('displays error messages in red', async () => {
      renderLogin();
      fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

      const errorMessages = await screen.findAllByText(/este campo es obligatorio/i);
      errorMessages.forEach((msg) => {
        const style = window.getComputedStyle(msg);
        expect(style.color).toBe('rgb(255, 0, 0)');
      });
    });

    it('does not call the login API when validation fails', () => {
      renderLogin();
      fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

      // Only the AuthProvider /api/auth/refresh call should have been made
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('failed login', () => {
    it('shows the ResultModal with failure when credentials are invalid', async () => {
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Credenciales inválidas' }),
      });

      renderLogin();

      fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'wrong@example.com' } });
      fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'wrongpassword1' } });

      fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

      expect(await screen.findByAltText('failure')).toBeInTheDocument();
      expect(screen.getByText(/credenciales inválidas/i)).toBeInTheDocument();
    });
  });

  describe('successful login', () => {
    it('redirects to the homepage when login succeeds', async () => {
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ user: mockUser, accessToken: 'fake-token' }),
      });

      const locationRef = { current: '' };
      function LocationTracker() {
        const location = useLocation();
        const ref = useRef(locationRef);
        useEffect(() => {
          ref.current.current = location.pathname;
        });
        return null;
      }

      render(
        <AuthProvider>
          <MemoryRouter initialEntries={['/login']}>
            <Login />
            <LocationTracker />
          </MemoryRouter>
        </AuthProvider>
      );

      fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'password123' } });

      fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

      await waitFor(() => {
        expect(locationRef.current).toBe('/');
      });
    });

    it('does not show the ResultModal on successful login', async () => {
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ user: mockUser, accessToken: 'fake-token' }),
      });

      renderLogin();

      fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'password123' } });

      fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

      await waitFor(() => {
        expect(screen.queryByAltText('success')).not.toBeInTheDocument();
        expect(screen.queryByAltText('failure')).not.toBeInTheDocument();
      });
    });
  });
});
