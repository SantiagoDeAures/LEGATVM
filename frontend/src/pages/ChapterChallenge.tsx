import { useEffect, useState, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';
import { VolumeContext } from '../context/VolumeContext';
import { API_URL } from '../shared/constants/API_URL';
import { useNavigate } from 'react-router';

interface Option {
  id: string;
  text: string;
}

interface Question {
  id: string;
  question: string;
  options: Option[];
}

interface PruebaData {
  id: string;
  questions: Question[];
}

interface SubmitResult {
  score: number;
  passed: boolean;
  correctCount: number;
  totalQuestions: number;
  message?: string;
  volumeCompleted?: boolean;
}

interface Answer {
  questionId: string;
  selectedOptions: string[];
}

export function ChapterChallenge() {
  const { accessToken } = useAuth();
  const volumeContext = useContext(VolumeContext);
  const volumeId = volumeContext?.volumeId ?? null;
  const chapterId = volumeContext?.chapterId ?? null;

  const [prueba, setPrueba] = useState<PruebaData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate()

  useEffect(() => {
    if (!volumeId || !chapterId) return;

    const fetchPrueba = async () => {
      const res = await fetch(`${API_URL}/api/volumes/${volumeId}/${chapterId}/prueba`, {
        credentials: 'include',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setPrueba(data);
    };

    fetchPrueba();
  }, [volumeId, chapterId, accessToken]);

    const goToVolumeContent = () => {
    navigate('/volumeContent')
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (result) {
    if (result.passed && result.message) {
      return (
        <div>
          <h2>Congratulations</h2>
          <p>{result.message}</p>
        </div>
      );
    }
    if (result.passed) {
      return (
        <div>
          <h2>Muy bien!</h2>
          <p>Obtuviste un puntaje de {result.score}, puedes continuar con el siguiente capítulo</p>
          <button onClick={goToVolumeContent}>Continuar</button>
        </div>
      );
    }
    return (
      <div>
        <h2>Buen intento!</h2>
        <p>Obtuviste un puntaje de {result.score}, aún no estás preparado para avanzar al siguiente capítulo</p>
        <button onClick={goToVolumeContent}>Repetir capítulo.</button>
      </div>
    );
  }

  if (!prueba) return null;

  const currentQuestion = prueba.questions[currentIndex];
  const isLastQuestion = currentIndex === prueba.questions.length - 1;

  const handleNext = () => {
    if (selectedOption === null) return;

    const newAnswers = [...answers, { questionId: currentQuestion.id, selectedOptions: [selectedOption] }];
    setAnswers(newAnswers);
    setSelectedOption(null);
    setCurrentIndex(currentIndex + 1);
  };

  const handleSubmit = async () => {
    if (selectedOption === null) return;

    const finalAnswers = [...answers, { questionId: currentQuestion.id, selectedOptions: [selectedOption] }];

    const res = await fetch(`${API_URL}/api/pruebas/${prueba.id}/submit`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ answers: finalAnswers }),
    });

    if (!res.ok) {
      setError('Parese que hubo un problema al enviar tus respuestas');
      return;
    }

    const data = await res.json();
    setResult(data);
  };


  return (
    <div>
      <p>{currentQuestion.question}</p>
      {currentQuestion.options.map((option) => (
        <div key={option.id}>
          <input
            type="radio"
            id={`option-${option.id}`}
            name={`question-${currentQuestion.id}`}
            checked={selectedOption === option.id}
            onChange={() => setSelectedOption(option.id)}
          />
          <label htmlFor={`option-${option.id}`}>{option.text}</label>
        </div>
      ))}
      {isLastQuestion ? (
        <button onClick={handleSubmit}>Terminar prueba</button>
      ) : (
        <button onClick={handleNext}>Siguiente</button>
      )}
    </div>
  );
}
