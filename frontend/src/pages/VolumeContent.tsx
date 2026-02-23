import { useEffect, useState, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';
import { VolumeContext } from '../context/VolumeContext';
import { API_URL } from '../shared/constants/API_URL';
import { useNavigate } from 'react-router';
import { useVolume } from '../hooks/useVolume';
import './VolumeContent.scss'
import NavBar from '../shared/components/NavBar';

interface ChapterData {
  id: string | null;
  volumeId: string;
  title: string;
  type: string;
  contentUrl: string;
  isCompleted: boolean;
}

export function VolumeContent() {
  const { authFetch } = useAuth();
  const { setchapterId } = useVolume()
  const volumeContext = useContext(VolumeContext);
  const volumeId = volumeContext?.volumeId ?? null;
  const [chapter, setChapter] = useState<ChapterData | null>(null);
  const navigate = useNavigate()

  useEffect(() => {
    if (!volumeId) return;

    const fetchChapter = async () => {
      const res = await authFetch(`${API_URL}/api/volumes/${volumeId}/continue`);
      if (!res.ok) return;
      const data = await res.json();
      setChapter(data);
    };

    fetchChapter();
  }, [volumeId, authFetch]);

  const accessToChallenge = () => {
    setchapterId(chapter?.id ?? null)
    navigate('/chapterChallenge')
  }

  if (!chapter) return null;

  return (
    <div className='chapter-container'>
      <NavBar />
      <section className='chapter-video-section'>
        <video data-testid="chapter-video" src={chapter.contentUrl} controls muted={false} className='chapter-video' />
        <h2 className='chapter-title'>{chapter.title}</h2>
        <button onClick={accessToChallenge} className='chapter-video-button'>Ir a la prueba</button>
      </section>

    </div>
  );
}
