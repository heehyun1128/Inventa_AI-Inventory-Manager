
import React, { ReactNode } from "react";
import "../app/modal.css"

interface ModalProps {
  isOpen: boolean; 
  onClose: () => void; 
  title?: string; 
  children: ReactNode; 
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {

  if (!isOpen) return null;

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div  className="modalContent" onClick={(e) => e.stopPropagation()}>
    
        <div className="modalHeader">
          {title && <h2 className="modalTitle">{title}</h2>}
          <button className="closeButton" onClick={onClose}>
            &times;
          </button>
        </div>

       
        <div className="modalBody">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
