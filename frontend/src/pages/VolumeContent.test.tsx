import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router';
import { VolumeContent } from './VolumeContent';
import { AuthContext } from '../context/AuthContext';
import { VolumeContext } from '../context/VolumeContext';
import { API_URL } from '../shared/constants/API_URL';

const mockAuthValue = {
  user: { id: 'user-uuid-1', username: 'Ana Developer', email: 'ana@test.com', wallet: { balance: 1000 } },
  isAuthenticated: true,
  accessToken: 'fake-access-token',
  login: vi.fn(),
  logout: vi.fn(),
  authFetch: vi.fn((...args: Parameters<typeof fetch>) => fetch(...args)),
};

const mockChapter = {
  id: 'chapter-01',
  volumeId: 'vol-01',
  title: 'Introducción a la IA',
  type: 'video',
  contentUrl: 'https://example.com/video.mp4',
  isCompleted: false,
};

function renderWithProviders(ui: ReactNode, volumeId: string | null = 'vol-01') {
  return render(
    <MemoryRouter>
      <AuthContext.Provider value={mockAuthValue}>
        <VolumeContext.Provider value={{ volumeId, setVolumeId: vi.fn(), chapterId: null, setchapterId: vi.fn() }}>
          {ui}
        </VolumeContext.Provider>
      </AuthContext.Provider>
    </MemoryRouter>
  );
}

describe('VolumeContent', () => {
  beforeEach(() => {

    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches the chapter from /api/volumes/:volumeId/continue and displays the title', async () => {
    // @ts-expect-error: mock fetch
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockChapter,
    });

    renderWithProviders(<VolumeContent />);

    await waitFor(() => {
      expect(screen.getByText('Introducción a la IA')).toBeInTheDocument();
    });

    expect(mockAuthValue.authFetch).toHaveBeenCalledWith(
      `${API_URL}/api/volumes/vol-01/continue`,
    );
  });

  it('displays the video using the contentUrl', async () => {
    // @ts-expect-error: mock fetch
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockChapter,
    });

    renderWithProviders(<VolumeContent />);

    await waitFor(() => {
      const video = screen.getByTestId('chapter-video');
      expect(video).toBeInTheDocument();
      expect(video).toHaveAttribute('src', 'https://example.com/video.mp4');
    });
  });

  
});
