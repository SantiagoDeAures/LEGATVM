import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useRef, useEffect } from 'react';
import { MemoryRouter, useLocation } from 'react-router';
import { AuthProvider } from '../context/AuthContext';
import { Register } from './Register';
import { API_URL } from '../shared/constants/API_URL';

function renderRegister() {
  return render(
    <AuthProvider>
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    </AuthProvider>
  );
}

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn());
  // Mock the /api/auth/me call from AuthProvider so it doesn't interfere
  (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
    ok: false,
    json: async () => ({}),
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Register', () => {
  describe('form structure', () => {
    it('renders a field for "Correo electrónico"', () => {
      renderRegister();
      expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    });

    it('renders a field for "Nombre de usuario"', () => {
      renderRegister();
      expect(screen.getByLabelText(/nombre de usuario/i)).toBeInTheDocument();
    });

    it('renders a field for "Contraseña"', () => {
      renderRegister();
      expect(screen.getByLabelText(/^contraseña$/i)).toBeInTheDocument();
    });

    it('renders a field for "Confirmar contraseña"', () => {
      renderRegister();
      expect(screen.getByLabelText(/confirmar contraseña/i)).toBeInTheDocument();
    });

    it('renders a "Registrarme" button', () => {
      renderRegister();
      expect(screen.getByRole('button', { name: /registrarme/i })).toBeInTheDocument();
    });
  });

  describe('validation – empty fields', () => {
    it('shows error messages when all fields are empty and the form is submitted', async () => {
      renderRegister();
      fireEvent.click(screen.getByRole('button', { name: /registrarme/i }));

      expect(await screen.findByText(/el correo electrónico es obligatorio/i)).toBeInTheDocument();
      expect(screen.getByText(/el nombre de usuario es obligatorio/i)).toBeInTheDocument();
      expect(screen.getByText(/la contraseña es obligatoria/i)).toBeInTheDocument();
      expect(screen.getByText(/debes confirmar la contraseña/i)).toBeInTheDocument();
    });

    it('displays error messages in red', async () => {
      renderRegister();
      fireEvent.click(screen.getByRole('button', { name: /registrarme/i }));

      const errorMessage = await screen.findByText(/el correo electrónico es obligatorio/i);
      const style = window.getComputedStyle(errorMessage);
      expect(style.color).toBe('rgb(255, 0, 0)');
    });
  });

  describe('validation – invalid email', () => {
    it('shows an error when the email format is invalid', async () => {
      renderRegister();

      fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'invalid-email' } });
      fireEvent.change(screen.getByLabelText(/nombre de usuario/i), { target: { value: 'user1' } });
      fireEvent.change(screen.getByLabelText(/^contraseña$/i), { target: { value: 'password123' } });
      fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), { target: { value: 'password123' } });

      fireEvent.click(screen.getByRole('button', { name: /registrarme/i }));

      expect(await screen.findByText(/el correo electrónico no es válido/i)).toBeInTheDocument();
    });
  });

  describe('validation – password strength', () => {
    it('shows an error when the password has 8 or fewer characters', async () => {
      renderRegister();

      fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText(/nombre de usuario/i), { target: { value: 'user1' } });
      fireEvent.change(screen.getByLabelText(/^contraseña$/i), { target: { value: 'pass1' } });
      fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), { target: { value: 'pass1' } });

      fireEvent.click(screen.getByRole('button', { name: /registrarme/i }));

      expect(await screen.findByText(/la contraseña debe tener más de 8 caracteres, al menos una letra y al menos un número/i)).toBeInTheDocument();
    });

    it('shows an error when the password has no letters', async () => {
      renderRegister();

      fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText(/nombre de usuario/i), { target: { value: 'user1' } });
      fireEvent.change(screen.getByLabelText(/^contraseña$/i), { target: { value: '123456789' } });
      fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), { target: { value: '123456789' } });

      fireEvent.click(screen.getByRole('button', { name: /registrarme/i }));

      expect(await screen.findByText(/la contraseña debe tener más de 8 caracteres, al menos una letra y al menos un número/i)).toBeInTheDocument();
    });

    it('shows an error when the password has no numbers', async () => {
      renderRegister();

      fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText(/nombre de usuario/i), { target: { value: 'user1' } });
      fireEvent.change(screen.getByLabelText(/^contraseña$/i), { target: { value: 'abcdefghi' } });
      fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), { target: { value: 'abcdefghi' } });

      fireEvent.click(screen.getByRole('button', { name: /registrarme/i }));

      expect(await screen.findByText(/la contraseña debe tener más de 8 caracteres, al menos una letra y al menos un número/i)).toBeInTheDocument();
    });

    it('accepts a valid password with more than 8 characters, letters and numbers', async () => {
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Usuario registrado correctamente' }),
      });

      renderRegister();

      fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText(/nombre de usuario/i), { target: { value: 'user1' } });
      fireEvent.change(screen.getByLabelText(/^contraseña$/i), { target: { value: 'password123' } });
      fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), { target: { value: 'password123' } });

      fireEvent.click(screen.getByRole('button', { name: /registrarme/i }));

      await waitFor(() => {
        expect(screen.queryByText(/la contraseña debe tener más de 8 caracteres/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('validation – passwords do not match', () => {
    it('shows an error when passwords do not match', async () => {
      renderRegister();

      fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText(/nombre de usuario/i), { target: { value: 'user1' } });
      fireEvent.change(screen.getByLabelText(/^contraseña$/i), { target: { value: 'password123' } });
      fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), { target: { value: 'different456' } });

      fireEvent.click(screen.getByRole('button', { name: /registrarme/i }));

      expect(await screen.findByText(/las contraseñas no coinciden/i)).toBeInTheDocument();
    });
  });

  describe('validation – no API call on invalid form', () => {
    it('does not call fetch when validation fails', () => {
      renderRegister();
      fireEvent.click(screen.getByRole('button', { name: /registrarme/i }));

      // Only the AuthProvider /api/auth/me call should have been made, not a register call
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('successful registration', () => {
    it('calls /api/auth/register with the form data on valid submission', async () => {
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Usuario registrado correctamente' }),
      });

      renderRegister();

      fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText(/nombre de usuario/i), { target: { value: 'user1' } });
      fireEvent.change(screen.getByLabelText(/^contraseña$/i), { target: { value: 'password123' } });
      fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), { target: { value: 'password123' } });

      fireEvent.click(screen.getByRole('button', { name: /registrarme/i }));

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(`${API_URL}/api/auth/register`, expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'test@example.com',
            username: 'user1',
            password: 'password123',
          }),
        }));
      });
    });

    it('shows the ResultModal with success when registration succeeds', async () => {
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Usuario registrado correctamente' }),
      });

      renderRegister();

      fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText(/nombre de usuario/i), { target: { value: 'user1' } });
      fireEvent.change(screen.getByLabelText(/^contraseña$/i), { target: { value: 'password123' } });
      fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), { target: { value: 'password123' } });

      fireEvent.click(screen.getByRole('button', { name: /registrarme/i }));

      expect(await screen.findByAltText('success')).toBeInTheDocument();
      expect(screen.getByText(/usuario registrado correctamente/i)).toBeInTheDocument();
    });
  });

  describe('failed registration', () => {
    it('shows the ResultModal with failure when the API returns an error', async () => {
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'El correo ya está registrado' }),
      });

      renderRegister();

      fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'taken@example.com' } });
      fireEvent.change(screen.getByLabelText(/nombre de usuario/i), { target: { value: 'user1' } });
      fireEvent.change(screen.getByLabelText(/^contraseña$/i), { target: { value: 'password123' } });
      fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), { target: { value: 'password123' } });

      fireEvent.click(screen.getByRole('button', { name: /registrarme/i }));

      expect(await screen.findByAltText('failure')).toBeInTheDocument();
      expect(screen.getByText(/el correo ya está registrado/i)).toBeInTheDocument();
    });
  });

  describe('ResultModal dismissal', () => {
    it('closes the ResultModal when clicked', async () => {
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Usuario registrado correctamente' }),
      });

      renderRegister();

      fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText(/nombre de usuario/i), { target: { value: 'user1' } });
      fireEvent.change(screen.getByLabelText(/^contraseña$/i), { target: { value: 'password123' } });
      fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), { target: { value: 'password123' } });

      fireEvent.click(screen.getByRole('button', { name: /registrarme/i }));

      const successImage = await screen.findByAltText('success');
      expect(successImage).toBeInTheDocument();

      // Click the overlay to dismiss
      fireEvent.click(successImage.closest('.result-modal-overlay')!);

      await waitFor(() => {
        expect(screen.queryByAltText('success')).not.toBeInTheDocument();
      });
    });

    it('redirects to /login when the success modal is dismissed', async () => {
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Usuario registrado correctamente' }),
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
          <MemoryRouter initialEntries={['/register']}>
            <Register />
            <LocationTracker />
          </MemoryRouter>
        </AuthProvider>
      );

      fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText(/nombre de usuario/i), { target: { value: 'user1' } });
      fireEvent.change(screen.getByLabelText(/^contraseña$/i), { target: { value: 'password123' } });
      fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), { target: { value: 'password123' } });

      fireEvent.click(screen.getByRole('button', { name: /registrarme/i }));

      const successImage = await screen.findByAltText('success');
      fireEvent.click(successImage.closest('.result-modal-overlay')!);

      await waitFor(() => {
        expect(locationRef.current).toBe('/login');
      });
    });

    it('does not redirect when the failure modal is dismissed', async () => {
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'El correo ya está registrado' }),
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
          <MemoryRouter initialEntries={['/register']}>
            <Register />
            <LocationTracker />
          </MemoryRouter>
        </AuthProvider>
      );

      fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'taken@example.com' } });
      fireEvent.change(screen.getByLabelText(/nombre de usuario/i), { target: { value: 'user1' } });
      fireEvent.change(screen.getByLabelText(/^contraseña$/i), { target: { value: 'password123' } });
      fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), { target: { value: 'password123' } });

      fireEvent.click(screen.getByRole('button', { name: /registrarme/i }));

      const failureImage = await screen.findByAltText('failure');
      fireEvent.click(failureImage.closest('.result-modal-overlay')!);

      await waitFor(() => {
        expect(screen.queryByAltText('failure')).not.toBeInTheDocument();
      });
      expect(locationRef.current).toBe('/register');
    });
  });
});
