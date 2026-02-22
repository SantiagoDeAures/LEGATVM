import { useEffect, useState, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';
import { VolumeContext } from '../context/VolumeContext';
import { API_URL } from '../shared/constants/API_URL';
import { useNavigate } from 'react-router';
import './ChapterChallenge.scss'
import NavBar from '../shared/components/NavBar';
import checkImage from '../assets/check-icon.png'
import errorIcon from '../assets/error-icon.png'
import congratulationsImage from '../assets/congratulations-image.png'

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
    return (
      (
        <>
          <div className='challenge-container'>
            <NavBar />
            <div className='challenge-error'>{error}</div>

          </div>
        </>
      )
    )
  }

  if (result) {
    if (result.passed && result.message) {
      return (
        <div className='challenge-container'>
          <NavBar />
          <section className='challenge-result-container'>
            <img src={congratulationsImage} alt="congratulations image" className='congratulations-image' />
            <h2 className='challenge-result'>Felicidades!</h2>
            <p className='challenge-result-message' >{result.message}</p>
          </section>

        </div>
      );
    }
    if (result.passed) {
      return (
        <div className='challenge-container'>
          <NavBar />
          <section className='challenge-result-container'>
            <img src={checkImage} alt="check icon" className='challenge-icon' />
            <h2 className='challenge-result'>Muy bien!</h2>
            <p className='challenge-result-message'>Obtuviste un puntaje de {result.score}, puedes continuar con el siguiente capítulo</p>
            <button onClick={goToVolumeContent} className='challenge-button'>Continuar</button>
          </section>

        </div>
      );
    }
    return (
      <div className='challenge-container'>
        <NavBar />
        <section className='challenge-result-container'>
          <img src={errorIcon} alt="error icon" className='challenge-icon' />
          <h2 className='challenge-result'>Buen intento!</h2>
          <p className='challenge-result-message'>Obtuviste un puntaje de {result.score}, aún no estás preparado para avanzar al siguiente capítulo</p>
          <button onClick={goToVolumeContent} className='challenge-button'>Repetir capítulo.</button>
        </section>

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
    <div className='challenge-container'>

      <NavBar />
      <section className='challenge-section'>
        <p className='challenge-question'>{currentQuestion.question}</p>
        <div className='challenge-options-container'>

          {currentQuestion.options.map((option) => (
            <div key={option.id} className='challenge-options'>
              <input
                type="radio"
                id={`option-${option.id}`}
                name={`question-${currentQuestion.id}`}
                checked={selectedOption === option.id}
                onChange={() => setSelectedOption(option.id)}
                className='challenge-option-input'
              />
              <label htmlFor={`option-${option.id}`} className='challenge-option'>{option.text}</label>
            </div>
          ))}
        </div>

        {isLastQuestion ? (
          <button onClick={handleSubmit} className='challenge-button'>Terminar prueba</button>
        ) : (
          <button onClick={handleNext} className='challenge-button'>Siguiente</button>
        )}
      </section>

    </div>
  );
}
