const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

const docsDir = path.join(__dirname, '../docs');

/**
 * Clean up a filename to use as a title
 */
function cleanTitle(filename) {
  return path.parse(filename).name
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
    .replace(/ Sheet\d+.*$/, '')
    .trim();
}

/**
 * Convert a cell to a markdown string, bolding labels and linking URLs
 */
function formatCell(content, isFirstColumn) {
  let val = content.trim();
  if (!val) return '';

  // Auto-link URLs
  if (val.startsWith('http')) {
    val = `[Link](${val})`;
  }

  // Escape markdown pipes
  val = val.replace(/\|/g, '\\|');

  // Bold first column if it's not a header
  if (isFirstColumn && val.length > 0) {
    // If it's already bolded or is a link, don't double-bold
    if (!val.startsWith('**') && !val.startsWith('[')) {
      val = `**${val}**`;
    }
  }

  return val;
}

/**
 * Recursively find files
 */
function getFiles(dir, extension) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(file, extension));
    } else {
      if (file.endsWith(extension)) {
        results.push(file);
      }
    }
  });
  return results;
}

function convert() {
  const csvFiles = getFiles(docsDir, '.csv');

  csvFiles.forEach(file => {
    const rawContent = fs.readFileSync(file, 'utf-8');
    
    try {
      const records = parse(rawContent, {
        skip_empty_lines: true,
        trim: true,
      });

      if (records.length === 0) return;

      // 1. Identify and prune empty columns
      const numCols = records[0].length;
      const emptyCols = new Set();
      for (let c = 0; c < numCols; c++) {
        let isColEmpty = true;
        // Check data rows (skipping header)
        for (let r = 1; r < records.length; r++) {
          if (records[r][c] && records[r][c].trim().length > 0) {
            isColEmpty = false;
            break;
          }
        }
        if (isColEmpty) emptyCols.add(c);
      }

      const filteredRecords = records.map(row => 
        row.filter((_, index) => !emptyCols.has(index))
      );

      // 2. Filter out rows that have no data besides the first column (label)
      // unless they look like headers (all caps or only one column anyway)
      const dataRecords = [filteredRecords[0]]; // Always keep header
      for (let i = 1; i < filteredRecords.length; i++) {
        const row = filteredRecords[i];
        const hasData = row.slice(1).some(cell => cell.trim().length > 0);
        const firstCell = row[0] ? row[0].trim() : '';
        
        // Keep if:
        // - Has data in other columns
        // - Or first cell is all caps (likely a separator/header) and row is otherwise empty
        // - Or it's a very short row (only 1-2 columns total)
        if (hasData || (firstCell.length > 0 && firstCell === firstCell.toUpperCase() && firstCell.length > 3)) {
          dataRecords.push(row);
        }
      }

      if (dataRecords.length <= 1 || dataRecords[0].length === 0) return;

      // 3. Build Markdown content
      const title = cleanTitle(file);
      let md = `---
title: ${title}
---

# ${title}

`;

      // Header row
      const headers = dataRecords[0];
      md += '| ' + headers.map(h => (h || ' ').replace(/\n/g, '<br/>')).join(' | ') + ' |\n';
      md += '| ' + headers.map(() => '---').join(' | ') + ' |\n';

      // Data rows (skipping header)
      for (let i = 1; i < dataRecords.length; i++) {
        const row = dataRecords[i];
        md += '| ' + row.map((cell, idx) => formatCell(cell, idx === 0).replace(/\n/g, '<br/>')).join(' | ') + ' |\n';
      }

      // 3. Write .md file
      const mdPath = file.replace(/\.csv$/, '.md');
      fs.writeFileSync(mdPath, md);
      console.log(`Converted: ${path.relative(docsDir, file)} -> ${path.relative(docsDir, mdPath)}`);
      
    } catch (err) {
      console.error(`Error converting ${file}:`, err.message);
    }
  });
}

convert();
