import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from '@docusaurus/router';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import LinkPreviewModal from './LinkPreviewModal';
import styles from './styles.module.css';

const normalizeInternalHref = (href) => {
  if (!ExecutionEnvironment.canUseDOM) return null;
  
  try {
    const url = new URL(href, window.location.origin);
    if (url.origin !== window.location.origin) return null;
    return url.pathname + url.search + url.hash;
  } catch (e) {
    return null;
  }
};

export const LinkPreviewContext = React.createContext({
  openPreview: () => {},
});

export default function LinkPreviewProvider({ children }) {
  const [previewUrl, setPreviewUrl] = useState(null); // The actual target URL
  const [iframeSrc, setIframeSrc] = useState(null); // The URL with ?linkPreview=1
  const [isVisible, setIsVisible] = useState(false);
  const history = useHistory();

  // Check if we are currently inside an iframe preview
  const isPreviewMode = ExecutionEnvironment.canUseDOM && 
    new URLSearchParams(window.location.search).has('linkPreview');

  const closePreview = useCallback(() => {
    setIsVisible(false);
    setPreviewUrl(null);
    setIframeSrc(null);
  }, []);

  const navigateToPage = useCallback(() => {
    if (previewUrl) {
      history.push(previewUrl);
      closePreview();
    }
  }, [previewUrl, history, closePreview]);

  const openPreview = (href) => {
    const normalized = normalizeInternalHref(href);
    if (!normalized) return;

    const urlObj = new URL(normalized, window.location.origin);
    urlObj.searchParams.set('linkPreview', '1');
    
    setPreviewUrl(normalized);
    setIframeSrc(urlObj.toString());
    setIsVisible(true);
  };

  useEffect(() => {
    if (!ExecutionEnvironment.canUseDOM || isPreviewMode) return;

    const handleClick = (e) => {
      // Check for Option/Alt key and left click
      if (!e.altKey || e.button !== 0) return;

      const link = e.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      // Simple check for internal links
      if (href && (href.startsWith('/') || href.startsWith(window.location.origin))) {
        e.preventDefault();
        e.stopPropagation();
        openPreview(href);
      }
    };

    const handleKeyDown = (e) => {
      if (!isVisible) return;

      if (e.key === 'Escape') {
        closePreview();
      } else if (e.key === 'Enter') {
        navigateToPage();
      }
    };

    document.addEventListener('click', handleClick, true);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible, navigateToPage, closePreview, isPreviewMode]);

  return (
    <LinkPreviewContext.Provider value={{ openPreview }}>
      {children}
      {isVisible && (
        <LinkPreviewModal
          url={previewUrl}
          iframeSrc={iframeSrc}
          onClose={closePreview}
          onNavigate={navigateToPage}
        />
      )}
      {!isPreviewMode && (
        <div className={styles.previewHint}>
          ⌥ + click to preview links
        </div>
      )}
    </LinkPreviewContext.Provider>
  );
}
