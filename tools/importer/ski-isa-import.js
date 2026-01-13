/*
 * SKYRIZI ISA Page Import Script
 * Converts SKYRIZI Access page to AEM Edge Delivery Services
 * Source: https://skrz.abbvie-sandbox-309.workers.dev/access/#/
 *
 * Creates blocks: ski-isa-hero (with collapsible safety panel),
 *                 ski-isa-indications, ski-isa-coverage,
 *                 ski-isa-support, ski-isa-nav
 *
 * This script dynamically extracts content from the live page DOM
 * Uses separate parser modules for each block type
 */

import {
  extractBrandInfo,
  extractISILines,
  createHeroBlock,
} from './parsers/hero-parser.js';

import {
  extractIndications,
  createIndicationsBlock,
} from './parsers/indications-parser.js';

import {
  extractCoverage,
  createCoverageBlock,
} from './parsers/coverage-parser.js';

import {
  extractSupport,
  createSupportBlock,
} from './parsers/support-parser.js';

import {
  extractNavigation,
  createNavBlock,
} from './parsers/nav-parser.js';

/**
 * Create a block table with proper structure for EDS
 * Supports both single-column and multi-column layouts
 */
function createBlock(doc, name, rows, columns = 1) {
  const table = doc.createElement('table');

  // Block name header row with correct colspan
  const headerRow = doc.createElement('tr');
  const headerCell = doc.createElement('th');
  headerCell.colSpan = columns;
  headerCell.textContent = name;
  headerRow.appendChild(headerCell);
  table.appendChild(headerRow);

  // Content rows
  rows.forEach((row) => {
    const tr = doc.createElement('tr');
    const cells = Array.isArray(row) ? row : [row];
    cells.forEach((cell) => {
      const td = doc.createElement('td');
      if (typeof cell === 'string') {
        td.innerHTML = cell;
      } else if (cell && cell.nodeType) {
        td.appendChild(cell);
      }
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });

  return table;
}

/**
 * Create section divider (hr element)
 */
function createSectionDivider(doc) {
  return doc.createElement('hr');
}

/**
 * Main transform function for SKYRIZI ISA page
 * Dynamically extracts content from the source page DOM
 */
export default {
  transform: ({ document, url }) => {
    // eslint-disable-next-line no-console
    console.log('[SKYRIZI ISA IMPORT] Transform called with URL:', url);

    // Extract content from the live page using parsers
    const brand = extractBrandInfo(document);
    const isiLines = extractISILines(document);
    const indications = extractIndications(document);
    const coverage = extractCoverage(document);
    const support = extractSupport(document);
    const navItems = extractNavigation(document);

    // Create new document body
    const { body } = document;
    body.innerHTML = '';

    // --- SKI-ISA-HERO BLOCK ---
    const heroRows = createHeroBlock(document, brand, isiLines);
    body.appendChild(createBlock(document, 'Ski Isa Hero', heroRows, 2));
    body.appendChild(createSectionDivider(document));

    // --- SKI-ISA-INDICATIONS BLOCK ---
    const indicationsRows = createIndicationsBlock(indications);
    body.appendChild(createBlock(document, 'Ski Isa Indications', indicationsRows, 2));
    body.appendChild(createSectionDivider(document));

    // --- SKI-ISA-COVERAGE BLOCK ---
    const coverageRows = createCoverageBlock(coverage);
    body.appendChild(createBlock(document, 'Ski Isa Coverage', coverageRows, 3));
    body.appendChild(createSectionDivider(document));

    // --- SKI-ISA-SUPPORT BLOCK ---
    const supportRows = createSupportBlock(support);
    body.appendChild(createBlock(document, 'Ski Isa Support', supportRows, 2));
    body.appendChild(createSectionDivider(document));

    // --- SKI-ISA-NAV BLOCK ---
    const navRows = createNavBlock(document, navItems);
    body.appendChild(createBlock(document, 'Ski Isa Nav', navRows));
    body.appendChild(createSectionDivider(document));

    // --- METADATA BLOCK ---
    body.appendChild(createBlock(document, 'Metadata', [
      ['title', 'SKYRIZI Access - Important Safety Information'],
      ['description', 'Access information, coverage details, and patient support programs for SKYRIZI (risankizumab-rzaa)'],
      ['keywords', 'SKYRIZI, risankizumab, psoriasis, psoriatic arthritis, Crohn\'s disease, AbbVie'],
    ], 2));

    // Return the transformed document
    return [{
      element: body,
      path: '/skyrizi/access',
    }];
  },
};
