import React, { useState, useEffect } from 'react';
import DocSidebar from '@theme-original/DocSidebar';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

const collapseAllSidebar = () => {
  const openCategories = document.querySelectorAll(
    '.theme-doc-sidebar-item-category:not(.menu__list-item--collapsed) > .menu__list-item-collapsible > .menu__caret'
  );
  openCategories.forEach((btn) => {
    if (btn) btn.click();
  });
};

export default function DocSidebarWrapper(props) {
  const [hasExpanded, setHasExpanded] = useState(false);

  useEffect(() => {
    if (!ExecutionEnvironment.canUseDOM) return;

    const checkExpanded = () => {
      const expanded = document.querySelector('.theme-doc-sidebar-item-category:not(.menu__list-item--collapsed)');
      const isExpanded = !!expanded;
      if (isExpanded !== hasExpanded) {
        setHasExpanded(isExpanded);
      }
    };

    const interval = setInterval(checkExpanded, 1000);
    const clickHandler = () => setTimeout(checkExpanded, 200);
    document.addEventListener('click', clickHandler);

    return () => {
      clearInterval(interval);
      document.removeEventListener('click', clickHandler);
    };
  }, [hasExpanded]);

  return (
    <div className="doc-sidebar-wrapper" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      <DocSidebar {...props} />
      <div 
        className="sidebar-collapse-btn-container" 
        style={{ 
          padding: '10px', 
          borderTop: '1px solid var(--ifm-toc-border-color)', 
          backgroundColor: 'var(--ifm-background-color)',
          position: 'sticky',
          bottom: 0,
          zIndex: 100,
          boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
          display: hasExpanded ? 'block' : 'none',
          marginTop: 'auto'
        }}
      >
        <button
          className="clean-btn button button--secondary button--sm button--block"
          onClick={collapseAllSidebar}
          style={{ fontWeight: 'bold' }}
        >
          Collapse All Menus
        </button>
      </div>
      <style>{`
        .doc-sidebar-wrapper .menu {
          padding-bottom: ${hasExpanded ? '80px' : '20px'} !important;
        }
        .sidebar-collapse-btn-container {
          background-color: var(--ifm-background-color) !important;
          opacity: 1 !important;
          background-image: none !important;
        }
        /* Ensure the container is fully opaque in light mode */
        [data-theme='light'] .sidebar-collapse-btn-container {
          background-color: #ffffff !important;
        }
        /* Ensure the container is fully opaque in dark mode */
        [data-theme='dark'] .sidebar-collapse-btn-container {
          background-color: var(--ifm-background-color) !important;
        }
      `}</style>
    </div>
  );
}
