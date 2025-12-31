/* eslint-disable no-console */
/**
 * validate-docs.js - Validate Docusaurus documentation
 * 
 * Checks for:
 * 1. Duplicate document IDs
 * 2. Missing frontmatter
 * 3. Broken relative links (./path, ../path)
 * 4. Broken absolute route links (/path/to/doc)
 * 
 * Run with: npm run validate
 */

const fs = require('fs');
const path = require('path');

const DOCS_ROOT = path.join(process.cwd(), 'docs');

// ============================================================================
// FILE UTILITIES
// ============================================================================

function defaultId(filePath) {
  const rel = path.relative(DOCS_ROOT, filePath);
  const withoutExt = rel.replace(path.extname(rel), '');
  return withoutExt.replace(/\\/g, '/');
}

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

function collectLinks(content) {
  const links = [];
  const linkRegex = /\[[^\]]*?\]\(([^)\s]+)[^)]*\)/g;
  let m;
  while ((m = linkRegex.exec(content)) !== null) {
    links.push(m[1]);
  }
  return links;
}

// ============================================================================
// BUILD ROUTE MAP (same logic as fix-docs.js)
// ============================================================================

function buildRouteMap(files) {
  const routeMap = new Map();

  files.forEach(file => {
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

    routeMap.set('/' + route, file);
    routeMap.set(route, file);
  });

  return routeMap;
}

// ============================================================================
// VALIDATION
// ============================================================================

function validateDocs() {
  const files = getAllMarkdownFiles(DOCS_ROOT);
  const routeMap = buildRouteMap(files);
  const errors = [];

  // -------------------------------------------------------------------------
  // CHECK 1: Duplicate IDs
  // -------------------------------------------------------------------------
  const idMap = new Map();
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    const { frontmatter } = parseFrontmatter(content);
    const id = extractId(frontmatter, file);
    if (idMap.has(id)) {
      idMap.get(id).push(file);
    } else {
      idMap.set(id, [file]);
    }
  });

  idMap.forEach((paths, id) => {
    if (paths.length > 1) {
      errors.push(`Duplicate id "${id}" in:\n  - ${paths.join('\n  - ')}`);
    }
  });

  // -------------------------------------------------------------------------
  // CHECK 2 & 3: Missing frontmatter + Broken links
  // -------------------------------------------------------------------------
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    const { frontmatter } = parseFrontmatter(content);

    if (!frontmatter) {
      errors.push(`Missing frontmatter in ${path.relative(process.cwd(), file)}`);
    }

    collectLinks(content).forEach(link => {
      // Skip external links, anchors, mailto, images
      if (link.startsWith('http') || link.startsWith('//') ||
          link.startsWith('#') || link.startsWith('mailto:') ||
          /\.(png|jpg|jpeg|gif|svg|webp|pdf)$/i.test(link)) {
        return;
      }

      const linkPath = link.split('#')[0].split('?')[0];
      const currentDir = path.dirname(file);

      // -----------------------------------------------------------------------
      // CASE A: Absolute route links (/path/to/doc)
      // -----------------------------------------------------------------------
      if (link.startsWith('/')) {
        const targetFile = routeMap.get(linkPath) || routeMap.get(linkPath.slice(1));
        if (!targetFile) {
          errors.push(
            `Broken link in ${path.relative(process.cwd(), file)} -> ${link}\n` +
            `  (No route found for: ${linkPath})`
          );
        }
        return;
      }

      // -----------------------------------------------------------------------
      // CASE B: Relative links (./path or ../path)
      // -----------------------------------------------------------------------
      if (link.startsWith('./') || link.startsWith('../')) {
        const target = path.resolve(currentDir, linkPath);
        const exists =
          fs.existsSync(target) ||
          fs.existsSync(target + '.md') ||
          fs.existsSync(target + '.mdx') ||
          (fs.existsSync(target) && fs.statSync(target).isDirectory() &&
            (fs.existsSync(path.join(target, 'index.md')) ||
             fs.existsSync(path.join(target, 'index.mdx'))));

        if (!exists) {
          errors.push(
            `Broken link in ${path.relative(process.cwd(), file)} -> ${link}`
          );
        }
      }
    });
  });

  // -------------------------------------------------------------------------
  // REPORT RESULTS
  // -------------------------------------------------------------------------
  if (errors.length) {
    console.error('Validation failed:\n');
    errors.forEach(err => console.error(`- ${err}\n`));
    console.error(`\nTotal: ${errors.length} error(s) found.`);
    console.error('Run "npm run fix" to attempt automatic repairs.\n');
    process.exit(1);
  } else {
    console.log('Docs validation passed.');
  }
}

validateDocs();
