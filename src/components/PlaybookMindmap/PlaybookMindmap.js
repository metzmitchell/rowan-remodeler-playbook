import React, { useEffect, useRef, useContext } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { useDocsSidebar } from '@docusaurus/plugin-content-docs/client';
import { Markmap } from 'markmap-view';
import * as d3 from 'd3';
import { LinkPreviewContext } from '../LinkPreview/LinkPreviewProvider';

function MarkmapInternal() {
  const svgRef = useRef(null);
  const mmRef = useRef(null);
  const sidebar = useDocsSidebar();
  const { openPreview } = useContext(LinkPreviewContext);

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
    try {
      const state = {
        transform: mm.state.transform,
        foldedPaths: getFoldedPaths(mm.state.data),
      };
      sessionStorage.setItem('playbook-markmap-state', JSON.stringify(state));
    } catch (e) {
      console.error('Error saving markmap state:', e);
    }
  };

  const loadState = () => {
    try {
      const saved = sessionStorage.getItem('playbook-markmap-state');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  };

  const setAllFolds = (foldValue) => {
    if (!mmRef.current) return;
    const mm = mmRef.current;
    
    const traverse = (node) => {
      if (node.children && node.children.length > 0) {
        node.payload = { ...node.payload, fold: foldValue };
        node.children.forEach(traverse);
      }
    };

    if (mm.state.data.children) {
      mm.state.data.children.forEach(traverse);
    }
    
    mm.setData(mm.state.data);
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

      if (saved) {
        if (saved.foldedPaths?.includes(currentPath)) {
          node.payload.fold = 1;
        }
      } else {
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
      payload: { url: '/', fold: 0 },
    };

    if (!mmRef.current) {
      mmRef.current = Markmap.create(svgRef.current, {
        autoFit: true,
        duration: 500,
        paddingX: 16,
      }, data);

      const mm = mmRef.current;
      const svg = d3.select(svgRef.current);

      // Label clicks for navigation
      svg.on('click', (event) => {
        const labelEl = event.target.closest('.mm-label');
        if (labelEl) {
          const url = labelEl.getAttribute('data-url');
          if (url && url !== '#' && url !== '' && url !== '/') {
            if (event.altKey) {
              // Option-click for preview
              openPreview(url);
            } else if (event.metaKey || event.ctrlKey || event.button === 1) {
              window.open(url, '_blank');
            } else {
              window.location.href = url;
            }
            event.preventDefault();
            event.stopPropagation();
          }
        }
      });

      // Debounced state save after any click (captures expansion/collapse)
      let clickTimeout;
      svg.on('mouseup.state', () => {
        clearTimeout(clickTimeout);
        clickTimeout = setTimeout(() => saveState(mm), 700);
      });

      // Save on zoom/pan
      mm.zoom.on('zoom.save', () => {
        saveState(mm);
      });

      // Save before navigation
      const handleUnload = () => saveState(mm);
      window.addEventListener('beforeunload', handleUnload);

      if (saved && saved.transform) {
        const { x, y, k } = saved.transform;
        setTimeout(() => {
          mm.view.transition().duration(0).call(
            mm.zoom.transform,
            d3.zoomIdentity.translate(x, y).scale(k)
          );
        }, 100);
      }

      return () => {
        window.removeEventListener('beforeunload', handleUnload);
        clearTimeout(clickTimeout);
      };
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
          className="button button--secondary button--sm"
          style={{ cursor: 'pointer', fontWeight: 'bold' }}
        >
          Expand All
        </button>
        <button 
          onClick={() => setAllFolds(1)} 
          className="button button--secondary button--sm"
          style={{ cursor: 'pointer', fontWeight: 'bold' }}
        >
          Collapse All
        </button>
      </div>
      <style>{`
        .mm-label { cursor: pointer; padding: 2px 4px; border-radius: 4px; color: var(--ifm-font-color-base); }
        .mm-label:hover { background-color: var(--ifm-hover-overlay); text-decoration: underline; color: var(--ifm-color-primary); }
        .mm-root { font-weight: bold; font-size: 1.2em; color: var(--ifm-color-primary); }
        .markmap-node circle { fill: var(--ifm-color-primary) !important; cursor: pointer; }
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
