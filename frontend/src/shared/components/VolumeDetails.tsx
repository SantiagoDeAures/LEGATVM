import { useEffect, useState } from 'react';
import { API_URL } from '../constants/API_URL';
import ResultModal from './ResultModal';
import { useAuth } from '../../hooks/useAuth';
import { useVolume } from '../../hooks/useVolume';
import './VolumeDetails.scss'
import { useNavigate } from 'react-router';

interface VolumeDetailsProps {
  volumeId: string | null;
  onClose: () => void;
}

interface VolumeData {
  id: string;
  title: string;
  description: string;
  categories: string[];
  thumbnail: string;
  price: number;
  owned: boolean;
}

export default function VolumeDetails({ volumeId, onClose }: VolumeDetailsProps) {
  const { accessToken } = useAuth();
  const { setVolumeId } = useVolume();
  const [volume, setVolume] = useState<VolumeData | null>(null);
  const [owned, setOwned] = useState(false);
  const [started, setStarted] = useState<boolean | null>(null);
  const [resultModal, setResultModal] = useState<{ result: 'success' | 'failure'; message: string } | null>(null);
  const navigate = useNavigate()

  useEffect(() => {
    const authHeaders = {
      credentials: 'include' as const,
      headers: { Authorization: `Bearer ${accessToken}` },
    };

    const fetchDetails = async () => {
      const res = await fetch(`${API_URL}/api/volumes/${volumeId}`, authHeaders);
      if (!res.ok) return;
      const data = await res.json();
      setVolume(data);
      setOwned(data.owned);

      if (data.owned) {
        const startedRes = await fetch(`${API_URL}/api/volumes/${volumeId}/started`, authHeaders);
        if (startedRes.ok) {
          const startedData = await startedRes.json();
          setStarted(startedData.started);
        }
      }
    };

    fetchDetails();
  }, [volumeId, accessToken]);

  const handlePurchase = async () => {
    const authHeaders = {
      credentials: 'include' as const,
      headers: { Authorization: `Bearer ${accessToken}` },
    };

    const res = await fetch(`${API_URL}/api/volumes/${volumeId}/purchase`, {
      method: 'POST',
      ...authHeaders,
    });
    const data = await res.json();

    if (res.ok) {
      setResultModal({ result: 'success', message: data.message });
      setOwned(true);
      setStarted(false);
    } else {
      setResultModal({ result: 'failure', message: data.message });
    }
  };

  const volumeAccess = () => {
    setVolumeId(volumeId)
    navigate('/volumeContent')
  }

  if (!volume) return null;

  return (
    <>
      <div data-testid="volume-details-overlay" className="volume-details-overlay" onClick={onClose}>
        <div onClick={(e) => e.stopPropagation()} className='volume-modal-content'>
          <img src={volume.thumbnail} alt={volume.title} className='volume-modal-image'/>
          <h2>{volume.title}</h2>
          <p>{volume.description}</p>

 {!owned && (
        <div className='volume-pricing-container'>
            <p>{volume.price}</p>
            <button onClick={handlePurchase}>Comprar</button>     
        </div>
         )}

          {owned && started === false && (
            <button onClick={volumeAccess}>Comenzar</button>
          )}

          {owned && started === true && (
            <button onClick={volumeAccess}>Continuar</button>
          )}
        </div>
      </div>

      {resultModal && (
        <ResultModal
          result={resultModal.result}
          message={resultModal.message}
          onClose={() => setResultModal(null)}
        />
      )}
    </>
  );
}
