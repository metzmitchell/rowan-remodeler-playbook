/* eslint-disable no-console */
/**
 * fix-docs.js - Auto-fix common Docusaurus documentation errors
 * 
 * This script automatically fixes:
 * 1. Missing frontmatter
 * 2. Broken relative links (./path, ../path)
 * 3. Broken absolute route links (/path/to/doc)
 * 4. Creates stub pages for missing link targets
 * 
 * Run with: npm run fix
 */

const fs = require('fs');
const path = require('path');

const DOCS_ROOT = path.join(process.cwd(), 'docs');

// ============================================================================
// FILE UTILITIES
// ============================================================================

function getAllMarkdownFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap(entry => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return getAllMarkdownFiles(fullPath);
    return entry.isFile() && (fullPath.endsWith('.md') || fullPath.endsWith('.mdx'))
      ? [fullPath]
      : [];
  });
}

function parseFrontmatter(content) {
  if (!content.startsWith('---')) return { frontmatter: null, body: content };
  const match = content.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return { frontmatter: null, body: content };
  return { frontmatter: match[1], body: content.slice(match[0].length) };
}

function extractId(frontmatter, filePath) {
  if (!frontmatter) return defaultId(filePath);
  const idMatch = frontmatter.match(/^id:\s*["']?(.+?)["']?\s*$/m);
  return idMatch ? idMatch[1].trim() : defaultId(filePath);
}

function defaultId(filePath) {
  const rel = path.relative(DOCS_ROOT, filePath);
  const withoutExt = rel.replace(path.extname(rel), '');
  return withoutExt.replace(/\\/g, '/');
}

// ============================================================================
// BUILD ROUTE MAP
// Docusaurus routes are derived from folder/file structure, stripping numeric prefixes
// ============================================================================

function buildRouteMap(files) {
  const routeMap = new Map();
  
  files.forEach(file => {
    const relPath = path.relative(DOCS_ROOT, file);
    const ext = path.extname(file);
    
    // Build the Docusaurus route from the file path
    // Example: docs/01-onboarding/02-admin-access.md -> /onboarding/admin-access
    let route = relPath
      .replace(ext, '')
      .split(path.sep)
      .map(segment => {
        // Strip numeric prefixes like "01-", "02-", etc.
        return segment.replace(/^\d+-/, '');
      })
      .join('/');
    
    // Handle index files - they become the parent route
    if (route.endsWith('/index') || route === 'index') {
      route = route.replace(/\/?index$/, '') || '/';
    }
    
    routeMap.set('/' + route, file);
    routeMap.set(route, file); // Also store without leading slash
  });
  
  return routeMap;
}

// ============================================================================
// LINK FIXING
// ============================================================================

function findBestMatch(targetSlug, files) {
  // Try to find a file that contains the target slug in its name
  const targetName = targetSlug.split('/').pop();
  
  // Exact filename match (ignoring numeric prefix)
  const exactMatch = files.find(f => {
    const fileName = path.basename(f, path.extname(f));
    const cleanName = fileName.replace(/^\d+-/, '');
    return cleanName === targetName;
  });
  
  if (exactMatch) return exactMatch;
  
  // Partial match - contains the target name
  const partialMatch = files.find(f => {
    const fileName = path.basename(f, path.extname(f)).toLowerCase();
    return fileName.includes(targetName.toLowerCase());
  });
  
  return partialMatch || null;
}

function getRouteForFile(file) {
  const relPath = path.relative(DOCS_ROOT, file);
  const ext = path.extname(file);
  
  let route = relPath
    .replace(ext, '')
    .split(path.sep)
    .map(segment => segment.replace(/^\d+-/, ''))
    .join('/');
  
  if (route.endsWith('/index') || route === 'index') {
    route = route.replace(/\/?index$/, '') || '/';
  }
  
  return '/' + route;
}

function createStubPage(targetRoute, referencingFile) {
  // Create a stub page for the missing link target
  // Determine where to create it based on the route structure
  
  const parts = targetRoute.split('/').filter(Boolean);
  if (parts.length === 0) return null;
  
  // Find the parent directory that matches the first part of the route
  const entries = fs.readdirSync(DOCS_ROOT, { withFileTypes: true });
  
  let targetDir = null;
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const cleanName = entry.name.replace(/^\d+-/, '');
      if (cleanName === parts[0]) {
        targetDir = path.join(DOCS_ROOT, entry.name);
        break;
      }
    }
  }
  
  if (!targetDir) {
    // Parent directory doesn't exist, can't create stub
    return null;
  }
  
  // Create the stub file
  const fileName = parts.length > 1 ? parts.slice(1).join('-') : parts[0];
  const stubPath = path.join(targetDir, `99-${fileName}.md`);
  
  // Generate a title from the route
  const title = parts[parts.length - 1]
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  const stubContent = `---
title: "${title}"
description: "This page is a placeholder. Content coming soon."
tags: ["stub", "todo"]
---

# ${title}

> **Note:** This page was automatically generated because another document links here.
> Please add content or update the referencing link.

Referenced from: ${path.relative(DOCS_ROOT, referencingFile)}
`;

  fs.writeFileSync(stubPath, stubContent);
  console.log(`[Stub] Created placeholder page: ${path.relative(process.cwd(), stubPath)}`);
  
  return stubPath;
}

// ============================================================================
// MAIN FIX FUNCTION
// ============================================================================

function fixDocs() {
  console.log('Starting auto-fix process...\n');
  const files = getAllMarkdownFiles(DOCS_ROOT);
  const routeMap = buildRouteMap(files);
  let changes = 0;
  const brokenLinks = [];

  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf-8');
    const originalContent = content;

    // ========================================================================
    // FIX 1: Missing Frontmatter
    // ========================================================================
    if (!content.trim().startsWith('---')) {
      const fileName = path.basename(file, path.extname(file));
      const title = fileName
        .replace(/^\d+-/, '')
        .split(/[-_]/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      const frontmatter = `---
title: "${title}"
description: ""
tags: []
---

`;
      content = frontmatter + content;
      console.log(`[Frontmatter] Added to ${path.relative(process.cwd(), file)}`);
    }

    // ========================================================================
    // FIX 2: Broken Links
    // ========================================================================
    const linkRegex = /\[([^\]]*?)\]\(([^)\s]+)([^)]*)\)/g;

    content = content.replace(linkRegex, (match, text, link, rest) => {
      // Skip external links, anchors, mailto, images
      if (link.startsWith('http') || link.startsWith('//') || 
          link.startsWith('#') || link.startsWith('mailto:') ||
          /\.(png|jpg|jpeg|gif|svg|webp|pdf)$/i.test(link)) {
        return match;
      }

      const currentDir = path.dirname(file);
      const linkPath = link.split('#')[0].split('?')[0];
      const anchor = link.includes('#') ? '#' + link.split('#')[1].split('?')[0] : '';
      const query = link.includes('?') ? '?' + link.split('?').pop() : '';

      // --------------------------------------------------------------------
      // CASE A: Absolute route links (Docusaurus routes like /path/to/doc)
      // --------------------------------------------------------------------
      if (link.startsWith('/')) {
        const targetFile = routeMap.get(linkPath) || routeMap.get(linkPath.slice(1));
        
        if (targetFile) {
          // Route exists, keep it
          return match;
        }
        
        // Route doesn't exist - try to find a match
        const bestMatch = findBestMatch(linkPath, files);
        
        if (bestMatch) {
          const newRoute = getRouteForFile(bestMatch);
          console.log(`[Link] Fixed in ${path.relative(process.cwd(), file)}: ${link} -> ${newRoute}${anchor}`);
          return `[${text}](${newRoute}${anchor}${rest})`;
        }
        
        // No match found - collect for stub creation
        brokenLinks.push({ file, link: linkPath, text, fullMatch: match });
        return match;
      }

      // --------------------------------------------------------------------
      // CASE B: Relative links (./path or ../path)
      // --------------------------------------------------------------------
      if (link.startsWith('./') || link.startsWith('../')) {
        const absPath = path.resolve(currentDir, linkPath);
        const exists =
          fs.existsSync(absPath) ||
          fs.existsSync(absPath + '.md') ||
          fs.existsSync(absPath + '.mdx') ||
          (fs.existsSync(absPath) && fs.statSync(absPath).isDirectory() &&
            (fs.existsSync(path.join(absPath, 'index.md')) ||
             fs.existsSync(path.join(absPath, 'index.mdx'))));

        if (exists) {
          return match;
        }

        // Try to find the target file by name
        const targetName = path.basename(linkPath).replace(/\.mdx?$/, '');
        const matches = files.filter(f => {
          const fName = path.basename(f).replace(/\.mdx?$/, '').replace(/^\d+-/, '');
          return fName === targetName || fName.includes(targetName);
        });

        if (matches.length === 1) {
          let newRelPath = path.relative(currentDir, matches[0]);
          newRelPath = newRelPath.replace(/\\/g, '/');
          if (!newRelPath.startsWith('.')) newRelPath = './' + newRelPath;

          console.log(`[Link] Fixed in ${path.relative(process.cwd(), file)}: ${link} -> ${newRelPath}${anchor}`);
          return `[${text}](${newRelPath}${anchor}${rest})`;
        }
      }

      return match;
    });

    if (content !== originalContent) {
      fs.writeFileSync(file, content);
      changes++;
    }
  });

  // ========================================================================
  // CREATE STUB PAGES FOR REMAINING BROKEN LINKS
  // ========================================================================
  const uniqueBrokenLinks = [...new Map(brokenLinks.map(b => [b.link, b])).values()];
  
  for (const broken of uniqueBrokenLinks) {
    console.log(`[Warning] Broken link found: ${broken.link} in ${path.relative(process.cwd(), broken.file)}`);
    
    // Create a stub page
    const stubCreated = createStubPage(broken.link, broken.file);
    if (stubCreated) {
      changes++;
    } else {
      console.log(`  -> Could not auto-fix. Manual intervention needed.`);
    }
  }

  console.log('');
  if (changes > 0) {
    console.log(`Success: Made changes to ${changes} file(s).`);
  } else {
    console.log('No automatic fixes needed.');
  }
}

fixDocs();
