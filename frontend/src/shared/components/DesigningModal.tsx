import designingImage from '../../assets/creation-image.png';
import './DesigningModal.scss'

interface DesigningModalProp {
  onClose: () => void;
}


export function DesigningModal({ onClose }: DesigningModalProp) {

  return (
    <div className="Designing-modal-overlay" onClick={onClose}>
      <div className="Designing-modal-content">
        <img src={designingImage} alt="design image" className="Designing-modal-image" />
        <p className="Designing-modal-message">Este módulo aún está en construcción, se habilitará tan pronto cuando tengamos contenido de mayor calidad.</p>
      </div>
    </div>
  );
}