import React from "react";
import styles from "./modal.module.css";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  open: boolean;
}

const Modal: React.FC<ModalProps> = ({ children, onClose, open }) => {
  // Close modal when clicking outside content
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleBackdropClick}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
