import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router';
import VolumeDetails from './VolumeDetails';
import { API_URL } from '../constants/API_URL';
import { AuthContext } from '../../context/AuthContext';
import { VolumeContext } from '../../context/VolumeContext';
import type { ReactNode } from 'react';

const mockAuthValue = {
  user: { id: 'user-uuid-1', username: 'Ana Developer', email: 'ana@test.com', wallet: { balance: 1000 } },
  isAuthenticated: true,
  accessToken: 'fake-access-token',
  login: vi.fn(),
  logout: vi.fn(),
};

function renderWithAuth(ui: ReactNode) {
  return render(
    <MemoryRouter>
      <AuthContext.Provider value={mockAuthValue}>
        <VolumeContext.Provider value={{ volumeId: null, setVolumeId: vi.fn(), chapterId: null, setchapterId: vi.fn() }}>
          {ui}
        </VolumeContext.Provider>
      </AuthContext.Provider>
    </MemoryRouter>
  );
}

const mockVolumeOwned = {
  id: '01',
  title: 'Historia de la IA',
  description: 'La IA desde sus orígenes',
  categories: ['historia', 'tecnología'],
  thumbnail: 'https://example.com/ia.jpg',
  owned: true,
};

const mockVolumeNotOwned = {
  id: '02',
  title: 'Filosofía Griega',
  description: 'Desde Tales hasta Aristóteles',
  categories: ['filosofía', 'historia'],
  thumbnail: 'https://example.com/filosofia.jpg',
  owned: false,
};

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn());
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('VolumeDetails', () => {
  // ─── RENDERING VOLUME INFO ────────────────────────────────

  it('fetches volume details and displays thumbnail, title, and description', async () => {
    // @ts-expect-error: Not implemented yet
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockVolumeOwned,
    });
    // @ts-expect-error: Not implemented yet
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ started: true }),
    });

    renderWithAuth(<VolumeDetails volumeId="01" onClose={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText('Historia de la IA')).toBeInTheDocument();
    });

    expect(screen.getByText('La IA desde sus orígenes')).toBeInTheDocument();
    expect(screen.getByAltText('Historia de la IA')).toHaveAttribute('src', 'https://example.com/ia.jpg');
  });

  it('calls GET /:volumeId endpoint on mount', async () => {
    // @ts-expect-error: Not implemented yet
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockVolumeNotOwned,
    });

    renderWithAuth(<VolumeDetails volumeId="02" onClose={() => {}} />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        `${API_URL}/api/volumes/02`,
        expect.objectContaining({ credentials: 'include' }),
      );
    });
  });

  // ─── OWNED = FALSE → COMPRAR BUTTON ───────────────────────

  it('shows "Comprar" button when owned is false', async () => {
    // @ts-expect-error: Not implemented yet
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockVolumeNotOwned,
    });

    renderWithAuth(<VolumeDetails volumeId="02" onClose={() => {}} />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /comprar/i })).toBeInTheDocument();
    });

    expect(screen.queryByRole('button', { name: /comenzar/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /continuar/i })).not.toBeInTheDocument();
  });

  // ─── OWNED = TRUE, STARTED = FALSE → COMENZAR BUTTON ─────

  it('shows "Comenzar" button when owned is true and started is false', async () => {
    // @ts-expect-error: Not implemented yet
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockVolumeOwned,
    });
    // @ts-expect-error: Not implemented yet
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ started: false }),
    });

    renderWithAuth(<VolumeDetails volumeId="01" onClose={() => {}} />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /comenzar/i })).toBeInTheDocument();
    });

    expect(screen.queryByRole('button', { name: /comprar/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /continuar/i })).not.toBeInTheDocument();
  });

  it('calls GET /:volumeId/started when owned is true', async () => {
    // @ts-expect-error: Not implemented yet
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockVolumeOwned,
    });
    // @ts-expect-error: Not implemented yet
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ started: false }),
    });

    renderWithAuth(<VolumeDetails volumeId="01" onClose={() => {}} />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        `${API_URL}/api/volumes/01/started`,
        expect.objectContaining({ credentials: 'include' }),
      );
    });
  });

  // ─── OWNED = TRUE, STARTED = TRUE → CONTINUAR BUTTON ─────

  it('shows "Continuar" button when owned is true and started is true', async () => {
    // @ts-expect-error: Not implemented yet
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockVolumeOwned,
    });
    // @ts-expect-error: Not implemented yet
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ started: true }),
    });

    renderWithAuth(<VolumeDetails volumeId="01" onClose={() => {}} />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /continuar/i })).toBeInTheDocument();
    });

    expect(screen.queryByRole('button', { name: /comprar/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /comenzar/i })).not.toBeInTheDocument();
  });

  // ─── PURCHASE: SUCCESS ────────────────────────────────────

  it('calls POST /:volumeId/purchase when "Comprar" is clicked', async () => {
    // @ts-expect-error: Not implemented yet
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockVolumeNotOwned,
    });

    renderWithAuth(<VolumeDetails volumeId="02" onClose={() => {}} />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /comprar/i })).toBeInTheDocument();
    });

    // @ts-expect-error: Not implemented yet
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Volumen comprado exitosamente', remainingBalance: 400 }),
    });

    fireEvent.click(screen.getByRole('button', { name: /comprar/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        `${API_URL}/api/volumes/02/purchase`,
        expect.objectContaining({ method: 'POST', credentials: 'include' }),
      );
    });
  });

  it('shows success ResultModal after a successful purchase', async () => {
    // @ts-expect-error: Not implemented yet
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockVolumeNotOwned,
    });

    renderWithAuth(<VolumeDetails volumeId="02" onClose={() => {}} />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /comprar/i })).toBeInTheDocument();
    });

    // @ts-expect-error: Not implemented yet
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Volumen comprado exitosamente', remainingBalance: 400 }),
    });

    fireEvent.click(screen.getByRole('button', { name: /comprar/i }));

    await waitFor(() => {
      expect(screen.getByText('Volumen comprado exitosamente')).toBeInTheDocument();
    });
  });

  it('hides "Comprar" and shows "Comenzar" after a successful purchase', async () => {
    // @ts-expect-error: Not implemented yet
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockVolumeNotOwned,
    });

    renderWithAuth(<VolumeDetails volumeId="02" onClose={() => {}} />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /comprar/i })).toBeInTheDocument();
    });

    // @ts-expect-error: Not implemented yet
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Volumen comprado exitosamente', remainingBalance: 400 }),
    });

    fireEvent.click(screen.getByRole('button', { name: /comprar/i }));

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /comprar/i })).not.toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /comenzar/i })).toBeInTheDocument();
  });

  // ─── PURCHASE: FAILURE ────────────────────────────────────

  it('shows failure ResultModal when purchase fails (insufficient funds)', async () => {
    // @ts-expect-error: Not implemented yet
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockVolumeNotOwned,
    });

    renderWithAuth(<VolumeDetails volumeId="02" onClose={() => {}} />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /comprar/i })).toBeInTheDocument();
    });

    // @ts-expect-error: Not implemented yet
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Saldo insuficiente' }),
    });

    fireEvent.click(screen.getByRole('button', { name: /comprar/i }));

    await waitFor(() => {
      expect(screen.getByText('Saldo insuficiente')).toBeInTheDocument();
    });
  });

  it('keeps "Comprar" button visible after a failed purchase', async () => {
    // @ts-expect-error: Not implemented yet
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockVolumeNotOwned,
    });

    renderWithAuth(<VolumeDetails volumeId="02" onClose={() => {}} />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /comprar/i })).toBeInTheDocument();
    });

    // @ts-expect-error: Not implemented yet
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Saldo insuficiente' }),
    });

    fireEvent.click(screen.getByRole('button', { name: /comprar/i }));

    await waitFor(() => {
      expect(screen.getByText('Saldo insuficiente')).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /comprar/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /continuar/i })).not.toBeInTheDocument();
  });

  // ─── MODAL BEHAVIOR ──────────────────────────────────────

  it('calls onClose when the modal overlay is clicked', async () => {
    const onClose = vi.fn();

    // @ts-expect-error: Not implemented yet
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockVolumeNotOwned,
    });

    renderWithAuth(<VolumeDetails volumeId="02" onClose={onClose} />);

    await waitFor(() => {
      expect(screen.getByText('Filosofía Griega')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('volume-details-overlay'));

    expect(onClose).toHaveBeenCalled();
  });
});
