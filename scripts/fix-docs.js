/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const DOCS_ROOT = path.join(process.cwd(), 'docs');

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

function fixDocs() {
  console.log('Starting auto-fix process...');
  const files = getAllMarkdownFiles(DOCS_ROOT);
  let changes = 0;

  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf-8');
    const originalContent = content;
    let modified = false;

    // 1. Fix Missing Frontmatter
    // Docusaurus requires frontmatter for many features. 
    // If missing, we add a basic ID and Title based on the filename.
    if (!content.trim().startsWith('---')) {
      const fileName = path.basename(file, path.extname(file));
      // Convert "my-file-name" to "My File Name"
      const title = fileName
        .split(/[-_]/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
        
      const frontmatter = `---\nid: ${fileName}\ntitle: ${title}\n---\n\n`;
      content = frontmatter + content;
      console.log(`[Frontmatter] Added to ${path.relative(process.cwd(), file)}`);
    }

    // 2. Fix Broken Links
    // Strategy: If a link is broken, look for a file with the same name in the docs folder.
    // If exactly one match is found, update the link to point to it.
    
    // Regex to match markdown links: [text](url)
    const linkRegex = /\[([^\]]*?)\]\(([^)\s]+)([^)]*)\)/g;
    
    content = content.replace(linkRegex, (match, text, link, rest) => {
        // Ignore external links, anchors, and mailto
        if (link.startsWith('http') || link.startsWith('//') || link.startsWith('#') || link.startsWith('mailto:')) {
            return match;
        }

        // ignore absolute paths that might be aliased (though usually in MD usually relative)
        if (link.startsWith('/')) {
             // In Docusaurus, / usually means static file or absolute route. 
             // We'll skip trying to fix these automatically for now to avoid breaking valid static asset links.
             return match;
        }

        const currentDir = path.dirname(file);
        // Clean link of anchor/query for file checking
        const linkPath = link.split('#')[0].split('?')[0];
        const absPath = path.resolve(currentDir, linkPath);

        // Check if valid
        const exists = 
            fs.existsSync(absPath) || 
            fs.existsSync(absPath + '.md') || 
            fs.existsSync(absPath + '.mdx') ||
            (fs.existsSync(absPath) && fs.statSync(absPath).isDirectory() && (fs.existsSync(path.join(absPath, 'index.md')) || fs.existsSync(path.join(absPath, 'index.mdx')))); // link to directory implying index

        if (exists) {
            return match;
        }

        // Link is likely broken. Try to find the target file by name.
        const targetName = path.basename(linkPath);
        const targetNameNoExt = targetName.replace(/\.mdx?$/, '');

        // Search for matches in all doc files
        const matches = files.filter(f => {
            const fName = path.basename(f);
            const fNameNoExt = fName.replace(/\.mdx?$/, '');
            return fName === targetName || fNameNoExt === targetNameNoExt; // Match exact filename or without extension
        });

        if (matches.length === 1) {
            const targetFile = matches[0];
            let newRelPath = path.relative(currentDir, targetFile);
            
            // Normalize path separators for Windows compatibility if needed, though mostly for consistent MD output
            newRelPath = newRelPath.replace(/\\/g, '/');
            
            // Ensure it starts with ./ or ../
            if (!newRelPath.startsWith('.')) newRelPath = './' + newRelPath;

            // Preserve anchor/query from original link
            const anchor = link.split('#')[1] ? '#' + link.split('#')[1] : '';
            const query = link.split('?')[1] ? '?' + link.split('?')[1] : '';
            
            const newLink = newRelPath + query + anchor;

            console.log(`[Link] Fixed in ${path.relative(process.cwd(), file)}: ${link} -> ${newLink}`);
            return `[${text}](${newLink}${rest})`;
        }

        return match;
    });

    if (content !== originalContent) {
        fs.writeFileSync(file, content);
        changes++;
    }
  });

  if (changes > 0) {
      console.log(`\nSuccess: Automatically fixed ${changes} file(s).`);
  } else {
      console.log('\nNo automatic fixes needed.');
  }
}

fixDocs();

