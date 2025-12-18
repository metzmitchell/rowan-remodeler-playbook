import React from 'react';
import DocSidebar from '@theme-original/DocSidebar';

const collapseAllSidebar = () => {
  // Select all expanded category items (that are not currently collapsed)
  // The structure is usually li.theme-doc-sidebar-item-category
  // If it does NOT have 'menu__list-item--collapsed', it is open.
  // We need to click the toggle button.
  
  // Note: Docusaurus might nest them. If we click a top-level one, it collapses children too visually, 
  // but we might want to collapse EVERYTHING deeply or just the visible ones.
  // Clicking top-level open ones is usually enough to "collapse all" from view.
  // But to reset state completely, we might want to find ALL expanded ones.
  
  // We can use a recursive approach or just query all.
  // Querying all might trigger animations simultaneously.
  
  const openCategories = document.querySelectorAll(
    '.theme-doc-sidebar-item-category:not(.menu__list-item--collapsed) > .menu__list-item-collapsible > .menu__caret'
  );
  
  openCategories.forEach((btn) => {
    // Check if it's actually visible or part of the tree we want to collapse
    // Just clicking them should toggle them closed.
    if (btn) btn.click();
  });
};

export default function DocSidebarWrapper(props) {
  return (
    <div className="doc-sidebar-wrapper" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <DocSidebar {...props} />
      <div className="sidebar-collapse-btn-container" style={{ padding: '10px', borderTop: '1px solid var(--ifm-toc-border-color)', background: 'var(--ifm-background-color)' }}>
        <button
          className="clean-btn button button--secondary button--sm button--block"
          onClick={collapseAllSidebar}
        >
          Collapse All
        </button>
      </div>
    </div>
  );
}
