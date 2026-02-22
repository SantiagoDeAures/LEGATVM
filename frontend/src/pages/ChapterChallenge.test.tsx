import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router';
import { ChapterChallenge } from './ChapterChallenge';
import { AuthContext } from '../context/AuthContext';
import { VolumeContext } from '../context/VolumeContext';
import { API_URL } from '../shared/constants/API_URL';

const mockAuthValue = {
  user: { id: 'user-uuid-1', username: 'Ana Developer', email: 'ana@test.com', wallet: { balance: 1000 } },
  isAuthenticated: true,
  accessToken: 'fake-access-token',
  login: vi.fn(),
  logout: vi.fn(),
};

const mockPrueba = {
  id: 'prueba-01',
  questions: [
    {
      id: 'q_01',
      question: '¿Qué es un invierno de IA?',
      options: [
        { id: 'a', text: 'Una estación del año' },
        { id: 'b', text: 'Un período de reducción de fondos' },
        { id: 'c', text: 'Un algoritmo de enfriamiento' },
      ],
    },
    {
      id: 'q_02',
      question: '¿Quién es considerado el padre de la IA?',
      options: [
        { id: 'a', text: 'Albert Einstein' },
        { id: 'b', text: 'Alan Turing' },
        { id: 'c', text: 'Isaac Newton' },
      ],
    },
    {
      id: 'q_03',
      question: '¿En qué año se acuñó el término IA?',
      options: [
        { id: 'a', text: '1943' },
        { id: 'b', text: '1956' },
        { id: 'c', text: '1970' },
      ],
    },
  ],
};

function renderWithProviders(ui: ReactNode, volumeId: string | null = 'vol-01', chapterId: string | null = 'chapter-01') {
  return render(
    <MemoryRouter>
      <AuthContext.Provider value={mockAuthValue}>
        <VolumeContext.Provider value={{ volumeId, setVolumeId: vi.fn(), chapterId, setchapterId: vi.fn() }}>
          {ui}
        </VolumeContext.Provider>
      </AuthContext.Provider>
    </MemoryRouter>
  );
}

describe('ChapterChallenge', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches the prueba and displays the first question', async () => {
    // @ts-expect-error: mock fetch
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPrueba,
    });

    renderWithProviders(<ChapterChallenge />);

    await waitFor(() => {
      expect(screen.getByText('¿Qué es un invierno de IA?')).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/api/volumes/vol-01/chapter-01/prueba`,
      expect.objectContaining({
        headers: { Authorization: 'Bearer fake-access-token' },
      }),
    );

    expect(screen.getByText('Una estación del año')).toBeInTheDocument();
    expect(screen.getByText('Un período de reducción de fondos')).toBeInTheDocument();
    expect(screen.getByText('Un algoritmo de enfriamiento')).toBeInTheDocument();
  });

  it('shows "Siguiente" button on non-last questions', async () => {
    // @ts-expect-error: mock fetch
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPrueba,
    });

    renderWithProviders(<ChapterChallenge />);

    await waitFor(() => {
      expect(screen.getByText('¿Qué es un invierno de IA?')).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /siguiente/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /terminar prueba/i })).not.toBeInTheDocument();
  });

  it('advances to the next question when selecting an option and clicking "Siguiente"', async () => {
    // @ts-expect-error: mock fetch
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPrueba,
    });

    renderWithProviders(<ChapterChallenge />);

    await waitFor(() => {
      expect(screen.getByText('¿Qué es un invierno de IA?')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText('Un período de reducción de fondos'));
    fireEvent.click(screen.getByRole('button', { name: /siguiente/i }));

    expect(screen.getByText('¿Quién es considerado el padre de la IA?')).toBeInTheDocument();
    expect(screen.queryByText('¿Qué es un invierno de IA?')).not.toBeInTheDocument();
  });

  it('shows "Terminar prueba" button on the last question', async () => {
    // @ts-expect-error: mock fetch
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPrueba,
    });

    renderWithProviders(<ChapterChallenge />);

    await waitFor(() => {
      expect(screen.getByText('¿Qué es un invierno de IA?')).toBeInTheDocument();
    });

    // Advance to question 2
    fireEvent.click(screen.getByLabelText('Un período de reducción de fondos'));
    fireEvent.click(screen.getByRole('button', { name: /siguiente/i }));

    // Advance to question 3 (last)
    fireEvent.click(screen.getByLabelText('Alan Turing'));
    fireEvent.click(screen.getByRole('button', { name: /siguiente/i }));

    expect(screen.getByText('¿En qué año se acuñó el término IA?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /terminar prueba/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /siguiente/i })).not.toBeInTheDocument();
  });

  it('submits answers and shows passed result', async () => {
    // @ts-expect-error: mock fetch
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPrueba,
    });

    renderWithProviders(<ChapterChallenge />);

    await waitFor(() => {
      expect(screen.getByText('¿Qué es un invierno de IA?')).toBeInTheDocument();
    });

    // Answer question 1
    fireEvent.click(screen.getByLabelText('Un período de reducción de fondos'));
    fireEvent.click(screen.getByRole('button', { name: /siguiente/i }));

    // Answer question 2
    fireEvent.click(screen.getByLabelText('Alan Turing'));
    fireEvent.click(screen.getByRole('button', { name: /siguiente/i }));

    // Answer question 3 (last)
    fireEvent.click(screen.getByLabelText('1956'));

    // @ts-expect-error: mock fetch
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ score: 100, passed: true, correctCount: 3, totalQuestions: 3 }),
    });

    fireEvent.click(screen.getByRole('button', { name: /terminar prueba/i }));

    await waitFor(() => {
      expect(screen.getByText('Muy bien!')).toBeInTheDocument();
    });

    expect(screen.getByText('Obtuviste un puntaje de 100, puedes continuar con el siguiente capítulo')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continuar/i })).toBeInTheDocument();

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/api/pruebas/prueba-01/submit`,
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ Authorization: 'Bearer fake-access-token' }),
        body: JSON.stringify({
          answers: [
            { questionId: 'q_01', selectedOptions: ['b'] },
            { questionId: 'q_02', selectedOptions: ['b'] },
            { questionId: 'q_03', selectedOptions: ['b'] },
          ],
        }),
      }),
    );
  });

  it('submits answers and shows failed result', async () => {
    // @ts-expect-error: mock fetch
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPrueba,
    });

    renderWithProviders(<ChapterChallenge />);

    await waitFor(() => {
      expect(screen.getByText('¿Qué es un invierno de IA?')).toBeInTheDocument();
    });

    // Answer all questions
    fireEvent.click(screen.getByLabelText('Una estación del año'));
    fireEvent.click(screen.getByRole('button', { name: /siguiente/i }));

    fireEvent.click(screen.getByLabelText('Albert Einstein'));
    fireEvent.click(screen.getByRole('button', { name: /siguiente/i }));

    fireEvent.click(screen.getByLabelText('1943'));

    // @ts-expect-error: mock fetch
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ score: 20, passed: false, correctCount: 1, totalQuestions: 3 }),
    });

    fireEvent.click(screen.getByRole('button', { name: /terminar prueba/i }));

    await waitFor(() => {
      expect(screen.getByText('Buen intento!')).toBeInTheDocument();
    });

    expect(screen.getByText('Obtuviste un puntaje de 20, aún no estás preparado para avanzar al siguiente capítulo')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /repetir capítulo/i })).toBeInTheDocument();
  });

  it('shows error message when submit fails', async () => {
    // @ts-expect-error: mock fetch
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPrueba,
    });

    renderWithProviders(<ChapterChallenge />);

    await waitFor(() => {
      expect(screen.getByText('¿Qué es un invierno de IA?')).toBeInTheDocument();
    });

    // Answer all questions
    fireEvent.click(screen.getByLabelText('Un período de reducción de fondos'));
    fireEvent.click(screen.getByRole('button', { name: /siguiente/i }));

    fireEvent.click(screen.getByLabelText('Alan Turing'));
    fireEvent.click(screen.getByRole('button', { name: /siguiente/i }));

    fireEvent.click(screen.getByLabelText('1956'));

    // @ts-expect-error: mock fetch
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Error' }),
    });

    fireEvent.click(screen.getByRole('button', { name: /terminar prueba/i }));

    await waitFor(() => {
      expect(screen.getByText('Parese que hubo un problema al enviar tus respuestas')).toBeInTheDocument();
    });
  });

  it('allows changing the selected option before clicking "Siguiente"', async () => {
    // @ts-expect-error: mock fetch
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPrueba,
    });

    renderWithProviders(<ChapterChallenge />);

    await waitFor(() => {
      expect(screen.getByText('¿Qué es un invierno de IA?')).toBeInTheDocument();
    });

    // Select option a first
    fireEvent.click(screen.getByLabelText('Una estación del año'));

    // Change to option b
    fireEvent.click(screen.getByLabelText('Un período de reducción de fondos'));

    fireEvent.click(screen.getByRole('button', { name: /siguiente/i }));

    // Advance through remaining questions
    fireEvent.click(screen.getByLabelText('Alan Turing'));
    fireEvent.click(screen.getByRole('button', { name: /siguiente/i }));

    fireEvent.click(screen.getByLabelText('1956'));

    // @ts-expect-error: mock fetch
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ score: 100, passed: true, correctCount: 3, totalQuestions: 3 }),
    });

    fireEvent.click(screen.getByRole('button', { name: /terminar prueba/i }));

    await waitFor(() => {
      expect(screen.getByText('Muy bien!')).toBeInTheDocument();
    });

    // Verify only option b was sent for q_01 (the changed answer, not a)
    expect(fetch).toHaveBeenLastCalledWith(
      `${API_URL}/api/pruebas/prueba-01/submit`,
      expect.objectContaining({
        body: JSON.stringify({
          answers: [
            { questionId: 'q_01', selectedOptions: ['b'] },
            { questionId: 'q_02', selectedOptions: ['b'] },
            { questionId: 'q_03', selectedOptions: ['b'] },
          ],
        }),
      }),
    );
  });

  it('shows congratulations message when volume is completed', async () => {
    // @ts-expect-error: mock fetch
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPrueba,
    });

    renderWithProviders(<ChapterChallenge />);

    await waitFor(() => {
      expect(screen.getByText('¿Qué es un invierno de IA?')).toBeInTheDocument();
    });

    // Answer all questions
    fireEvent.click(screen.getByLabelText('Un período de reducción de fondos'));
    fireEvent.click(screen.getByRole('button', { name: /siguiente/i }));

    fireEvent.click(screen.getByLabelText('Alan Turing'));
    fireEvent.click(screen.getByRole('button', { name: /siguiente/i }));

    fireEvent.click(screen.getByLabelText('1956'));

    // @ts-expect-error: mock fetch
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        score: 100,
        passed: true,
        correctCount: 3,
        totalQuestions: 3,
        volumeCompleted: true,
        message: 'Has llegado al final de esta historia y has aprendido cosas nuevas, es hora de celebrar!',
      }),
    });

    fireEvent.click(screen.getByRole('button', { name: /terminar prueba/i }));

    await waitFor(() => {
      expect(screen.getByText('Congratulations')).toBeInTheDocument();
    });

    expect(screen.getByText('Has llegado al final de esta historia y has aprendido cosas nuevas, es hora de celebrar!')).toBeInTheDocument();
    expect(screen.queryByText('Muy bien!')).not.toBeInTheDocument();
  });
});
