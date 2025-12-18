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
    }
  }, []);

  return (
    <LinkPreviewProvider>
      {children}
    </LinkPreviewProvider>
  );
}
