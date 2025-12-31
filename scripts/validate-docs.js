/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const DOCS_ROOT = path.join(process.cwd(), 'docs');

function defaultId(filePath) {
  const rel = path.relative(DOCS_ROOT, filePath);
  const withoutExt = rel.replace(path.extname(rel), '');
  return withoutExt.replace(/\\/g, '/');
}

function getAllMarkdownFiles(dir) {
  const entries = fs.readdirSync(dir, {withFileTypes: true});
  return entries.flatMap(entry => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return getAllMarkdownFiles(fullPath);
    return entry.isFile() && (fullPath.endsWith('.md') || fullPath.endsWith('.mdx'))
      ? [fullPath]
      : [];
  });
}

function parseFrontmatter(content) {
  if (!content.startsWith('---')) return {frontmatter: null, body: content};
  const match = content.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return {frontmatter: null, body: content};
  return {frontmatter: match[1], body: content.slice(match[0].length)};
}

function extractId(frontmatter, filePath) {
  if (!frontmatter) return defaultId(filePath);
  const idMatch = frontmatter.match(/^id:\s*["']?(.+?)["']?\s*$/m);
  return idMatch ? idMatch[1].trim() : defaultId(filePath);
}

function collectLinks(content) {
  const links = [];
  const linkRegex = /\[[^\]]*?\]\(([^)\s]+)[^\)]*\)/g;
  let m;
  while ((m = linkRegex.exec(content)) !== null) {
    links.push(m[1]);
  }
  return links;
}

function isInternal(link) {
  return (
    link.startsWith('./') ||
    link.startsWith('../')
  );
}

function normalizeTarget(link, currentFile) {
  const withoutHash = link.split('#')[0].split('?')[0];
  if (!withoutHash) return null;
  const resolved = path.resolve(path.dirname(currentFile), withoutHash);
  if (fs.existsSync(resolved)) return resolved;
  // Fallbacks: try .md and .mdx extensions if missing
  if (!path.extname(resolved)) {
    if (fs.existsSync(`${resolved}.md`)) return `${resolved}.md`;
    if (fs.existsSync(`${resolved}.mdx`)) return `${resolved}.mdx`;
  }
  return resolved;
}

function validateDocs() {
  const files = getAllMarkdownFiles(DOCS_ROOT);
  const errors = [];

  // Duplicate IDs
  const idMap = new Map();
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    const {frontmatter} = parseFrontmatter(content);
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

  // Broken links + missing frontmatter
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    const {frontmatter} = parseFrontmatter(content);
    if (!frontmatter) {
      errors.push(`Missing frontmatter in ${path.relative(process.cwd(), file)}`);
    }

    collectLinks(content).forEach(link => {
      if (!isInternal(link)) return;
      const target = normalizeTarget(link, file);
      if (!target || !fs.existsSync(target)) {
        errors.push(
          `Broken link in ${path.relative(process.cwd(), file)} -> ${link}`
        );
      }
    });
  });

  if (errors.length) {
    console.error('Validation failed:\n');
    errors.forEach(err => console.error(`- ${err}`));
    process.exit(1);
  } else {
    console.log('Docs validation passed.');
  }
}

validateDocs();

