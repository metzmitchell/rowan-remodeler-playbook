import React, { useEffect, useRef } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { useDocsSidebar } from '@docusaurus/plugin-content-docs/client';
import { Markmap } from 'markmap-view';
import * as d3 from 'd3';

function MarkmapInternal() {
  const svgRef = useRef(null);
  const mmRef = useRef(null);
  const sidebar = useDocsSidebar();

  const getFoldedPaths = (node, path = []) => {
    let paths = [];
    const currentPath = [...path, node.content];
    if (node.payload?.fold) {
      paths.push(currentPath.join(' > '));
    }
    if (node.children) {
      node.children.forEach(child => {
        paths = [...paths, ...getFoldedPaths(child, currentPath)];
      });
    }
    return paths;
  };

  const saveState = (mm) => {
    if (!mm) return;
    const state = {
      transform: mm.state.transform,
      foldedPaths: getFoldedPaths(mm.state.data),
    };
    sessionStorage.setItem('playbook-markmap-state', JSON.stringify(state));
  };

  const loadState = () => {
    const saved = sessionStorage.getItem('playbook-markmap-state');
    return saved ? JSON.parse(saved) : null;
  };

  const setAllFolds = (foldValue) => {
    if (!mmRef.current) return;
    const mm = mmRef.current;
    
    // Helper to traverse and set fold
    const traverse = (node) => {
      if (node.children && node.children.length > 0) {
        node.payload = { ...node.payload, fold: foldValue };
        node.children.forEach(traverse);
      }
    };

    // Apply to all children of root, but not root itself (so we don't collapse the whole map away)
    if (mm.state.data.children) {
      mm.state.data.children.forEach(traverse);
    }
    
    // Force re-render
    mm.setData(mm.state.data);
    
    // Reset zoom if expanding all to fit? Maybe just fit view.
    mm.fit();
    saveState(mm);
  };

  useEffect(() => {
    if (!sidebar || !svgRef.current) return;

    const saved = loadState();

    const buildTree = (item, path = [], depth = 0) => {
      const url = item.href || '';
      const label = item.label;
      const content = `<span class="mm-label" data-url="${url}">${label}</span>`;
      const currentPath = [...path, content].join(' > ');
      
      const node = {
        content,
        children: (item.items || []).map(child => buildTree(child, [...path, content], depth + 1)),
        payload: {
          url,
        },
      };

      // Default logic:
      // If saved state exists, respect it.
      // If NO saved state, collapse if depth >= 1 (so only root and level 1 are open)
      if (saved) {
        if (saved.foldedPaths?.includes(currentPath)) {
          node.payload.fold = 1;
        }
      } else {
        // Default collapse: 17 categories are visible (depth 0 children), their children are folded
        if (depth >= 1 && node.children && node.children.length > 0) {
          node.payload.fold = 1;
        }
      }

      return node;
    };

    const rootContent = '<span class="mm-label mm-root" data-url="/">Playbook</span>';
    const rootItems = sidebar.items.filter(item => item.label !== 'Key Priorities');
    const data = {
      content: rootContent,
      children: rootItems.map(item => buildTree(item, [rootContent], 1)),
    };

    if (!mmRef.current) {
      mmRef.current = Markmap.create(svgRef.current, {
        autoFit: true,
        duration: 500,
        paddingX: 16,
      }, data);

      const mm = mmRef.current;
      const svg = d3.select(svgRef.current);

      svg.on('click', (event) => {
        const labelEl = event.target.closest('.mm-label');
        if (labelEl) {
          const url = labelEl.getAttribute('data-url');
          if (url && url !== '#' && url !== '') {
            // Check if it's the root node, if so, maybe reset view or do nothing special
            if (url === '/') return;

            if (event.metaKey || event.ctrlKey || event.button === 1) {
              window.open(url, '_blank');
            } else {
              window.location.href = url;
            }
            event.preventDefault();
            event.stopPropagation();
          }
        }
      });

      // Track zoom/pan
      mm.zoom.on('zoom.save', () => {
        saveState(mm);
      });

      // Track toggle
      const originalHandleClick = mm.handleClick;
      mm.handleClick = function(el) {
        originalHandleClick.call(this, el);
        setTimeout(() => saveState(mm), 600);
      };

      // Restore transform if saved
      if (saved && saved.transform) {
        const { x, y, k } = saved.transform;
        setTimeout(() => {
          mm.view.transition().duration(0).call(
            mm.zoom.transform,
            d3.zoomIdentity.translate(x, y).scale(k)
          );
        }, 100);
      }
    } else {
      mmRef.current.setData(data);
    }
  }, [sidebar]);

  return (
    <div className="markmap-container" style={{ width: '100%', height: 'calc(100vh - 250px)', minHeight: '500px', border: '1px solid var(--ifm-contents-border-color)', borderRadius: '8px', overflow: 'hidden', position: 'relative', backgroundColor: 'var(--ifm-background-color)' }}>
      <svg ref={svgRef} style={{ width: '100%', height: '100%' }} />
      <div className="mm-toolbar" style={{ position: 'absolute', bottom: '10px', right: '10px', display: 'flex', gap: '8px' }}>
        <button 
          onClick={() => setAllFolds(0)} 
          style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid var(--ifm-color-primary)', background: 'var(--ifm-background-color)', cursor: 'pointer', fontSize: '0.9em' }}
        >
          Expand All
        </button>
        <button 
          onClick={() => setAllFolds(1)} 
          style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid var(--ifm-color-primary)', background: 'var(--ifm-background-color)', cursor: 'pointer', fontSize: '0.9em' }}
        >
          Collapse All
        </button>
      </div>
      <style>{`
        .mm-label { cursor: pointer; padding: 2px 4px; border-radius: 4px; color: var(--ifm-font-color-base); }
        .mm-label:hover { background-color: var(--ifm-hover-overlay); text-decoration: underline; color: var(--ifm-color-primary); }
        .mm-root { font-weight: bold; font-size: 1.2em; color: var(--ifm-color-primary); }
        .markmap-node circle { fill: var(--ifm-color-primary) !important; }
        .markmap-link { stroke: var(--ifm-color-primary); stroke-opacity: 0.5; }
      `}</style>
    </div>
  );
}

export default function PlaybookMindmap() {
  return (
    <BrowserOnly fallback={<div style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Mindmap...</div>}>
      {() => <MarkmapInternal />}
    </BrowserOnly>
  );
}
