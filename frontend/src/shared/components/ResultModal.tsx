import './ResultModal.scss';

import successImage from '../../assets/congratulations-image.png';
import failureImage from '../../assets/error-icon.png';

interface ResultModalProps {
  result: 'success' | 'failure';
  message: string;
  onClose: () => void;
}

export default function ResultModal({ result, message, onClose }: ResultModalProps) {
  const image = result === 'success' ? successImage : failureImage;

  return (
    <div className="result-modal-overlay" onClick={onClose}>
      <div className="result-modal-content">
        <img src={image} alt={result} className="result-modal-image" />
        <p className="result-modal-message">{message}</p>
      </div>
    </div>
  );
}
