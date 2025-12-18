import React, { useEffect } from 'react';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import LinkPreviewProvider from '@site/src/components/LinkPreview/LinkPreviewProvider';

export default function Root({ children }) {
  useEffect(() => {
    if (ExecutionEnvironment.canUseDOM) {
      const isPreview = new URLSearchParams(window.location.search).has('linkPreview');
      if (isPreview) {
        document.documentElement.classList.add('is-link-preview');
      }

      // Prevent option-click from downloading pages
      const handleOptionClick = (event) => {
        if (event.altKey) {
          const target = event.target;
          const link = target.closest('a');
          
          // Prevent option-click on any link to avoid downloads
          if (link && link.href && !link.href.startsWith('#') && !link.href.startsWith('javascript:')) {
            event.preventDefault();
            event.stopPropagation();
            return false;
          }
        }
      };

      // Use capture phase to catch before other handlers
      document.addEventListener('click', handleOptionClick, true);
      document.addEventListener('auxclick', handleOptionClick, true); // Middle mouse button

      return () => {
        document.removeEventListener('click', handleOptionClick, true);
        document.removeEventListener('auxclick', handleOptionClick, true);
      };
    }
  }, []);

  return (
    <LinkPreviewProvider>
      {children}
    </LinkPreviewProvider>
  );
}
