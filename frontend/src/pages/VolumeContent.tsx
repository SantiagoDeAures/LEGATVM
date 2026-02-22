import { useEffect, useState, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';
import { VolumeContext } from '../context/VolumeContext';
import { API_URL } from '../shared/constants/API_URL';
import { useNavigate } from 'react-router';
import { useVolume } from '../hooks/useVolume';

interface ChapterData {
  id: string | null;
  volumeId: string;
  title: string;
  type: string;
  contentUrl: string;
  isCompleted: boolean;
}

export function VolumeContent() {
  const { accessToken } = useAuth();
  const { setchapterId } = useVolume()
  const volumeContext = useContext(VolumeContext);
  const volumeId = volumeContext?.volumeId ?? null;
  const [chapter, setChapter] = useState<ChapterData | null>(null);
  const navigate = useNavigate()

  useEffect(() => {
    if (!volumeId) return;

    const fetchChapter = async () => {
      const res = await fetch(`${API_URL}/api/volumes/${volumeId}/continue`, {
        credentials: 'include',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setChapter(data);
    };

    fetchChapter();
  }, [volumeId, accessToken]);

  const accessToChallenge = () => {
    setchapterId(chapter?.id ?? null)
    navigate('/chapterChallenge')
  }

  if (!chapter) return null;

  return (
    <div>
      <video data-testid="chapter-video" src={chapter.contentUrl} controls muted={false} />
      <h2>{chapter.title}</h2>
      <button onClick={accessToChallenge}>Ir a la prueba</button>
    </div>
  );
}
