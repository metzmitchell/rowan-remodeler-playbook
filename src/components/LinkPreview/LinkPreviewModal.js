import React, { useRef } from 'react';
import styles from './styles.module.css';

export default function LinkPreviewModal({ 
  url, 
  iframeSrc,
  onClose, 
  onNavigate 
}) {
  const modalRef = useRef(null);

  // Close when clicking outside
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  if (!url) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleBackdropClick}>
      <div className={styles.modalContent} ref={modalRef}>
        <div className={styles.modalHeader}>
          <span className={styles.modalTitle}>{url}</span>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 5L5 15M5 5l10 10" />
            </svg>
          </button>
        </div>

        <div className={styles.scrollArea}>
          <iframe 
            src={iframeSrc} 
            className={styles.iframe} 
            title="Link Preview"
            loading="lazy"
          />
        </div>

        <div className={styles.modalFooter}>
          <div className={styles.shortcut}>
            <span className={styles.key}>⏎</span>
            <span>Open page</span>
          </div>
          <div className={styles.shortcut}>
            <span className={styles.key}>Esc</span>
            <span>Close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
