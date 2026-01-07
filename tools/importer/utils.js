/**
 * Import Utilities for AEM Edge Delivery Services
 */

/**
 * Create a block table structure
 */
export function createBlock(name, rows) {
  return {
    name,
    rows: rows || [],
  };
}

/**
 * Create metadata block from object
 */
export function createMetadata(meta) {
  const rows = Object.entries(meta).map(([key, value]) => [key, value]);

  return {
    name: 'Metadata',
    rows,
  };
}

/**
 * Transform DOM elements for EDS compatibility
 */
export function transformDOM(element, transformations) {
  if (!element) return null;

  const clone = element.cloneNode(true);

  // Apply transformations
  if (transformations.removeScripts !== false) {
    clone.querySelectorAll('script').forEach((el) => el.remove());
  }

  if (transformations.removeStyles !== false) {
    clone.querySelectorAll('style').forEach((el) => el.remove());
  }

  if (transformations.removeComments !== false) {
    const walker = document.createTreeWalker(clone, NodeFilter.SHOW_COMMENT);
    const comments = [];
    while (walker.nextNode()) comments.push(walker.currentNode);
    comments.forEach((comment) => comment.remove());
  }

  return clone;
}

/**
 * Web Importer helper class
 */
export class WebImporter {
  constructor(options = {}) {
    this.options = options;
    this.blocks = [];
  }

  addBlock(name, rows) {
    this.blocks.push(createBlock(name, rows));
  }

  addMetadata(meta) {
    this.blocks.push(createMetadata(meta));
  }

  toMarkdown() {
    let md = '';

    this.blocks.forEach((block) => {
      if (block.name === 'Metadata') {
        md += '\n---\n\n';
      }

      md += `| ${block.name} |\n`;
      md += '| --- |\n';

      block.rows.forEach((row) => {
        if (Array.isArray(row)) {
          md += `| ${row.join(' | ')} |\n`;
        } else {
          md += `| ${row} |\n`;
        }
      });

      md += '\n';
    });

    return md;
  }
}

/**
 * Sanitize filename for EDS
 */
export function sanitizeFilename(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Generate document path from URL
 */
export function generateDocumentPath(url) {
  const urlObj = new URL(url);
  let path = urlObj.pathname;

  // Remove file extensions
  path = path.replace(/\.(html|htm|php|aspx?)$/i, '');

  // Remove index
  path = path.replace(/\/index$/i, '');

  // Sanitize segments
  const segments = path.split('/').filter(Boolean).map(sanitizeFilename);

  return '/' + segments.join('/');
}
