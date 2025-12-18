import React, { useRef, useEffect } from 'react';
import styles from './styles.module.css';

export default function LinkPreviewModal({ 
  url, 
  iframeSrc,
  onClose, 
  onNavigate 
}) {
  const modalRef = useRef(null);

  // Handle key bindings and focus
  useEffect(() => {
    if (!url) return;

    // Focus the modal when it opens to ensure key bindings work
    if (modalRef.current) {
      modalRef.current.focus();
    }

    const handleKeyDown = (e) => {
      // If we're typing in an input (unlikely here but good practice), don't trigger shortcuts
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Enter') {
        onNavigate();
      }
    };

    window.addEventListener('keydown', handleKeyDown, true); // Use capture phase
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [url, onClose, onNavigate]);

  // Close when clicking outside
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  if (!url) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleBackdropClick}>
      <div 
        className={styles.modalContent} 
        ref={modalRef}
        tabIndex={-1}
        style={{ outline: 'none' }}
      >
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
