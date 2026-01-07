/*
 * Venclexta Pharma Site Import Script
 * Converts SSWeaver pharmaceutical presentations to AEM Edge Delivery Services
 */

import {
  createBlock,
  createMetadata,
  transformDOM,
  WebImporter,
} from './utils.js';

import { parseHeroBlock } from './parsers/hero.js';
import { parseStatsBlock } from './parsers/stats.js';
import { parseCardsBlock } from './parsers/cards.js';
import { parseISIBlock } from './parsers/isi.js';
import { parseTabsBlock } from './parsers/tabs.js';

/**
 * Main transformation function
 * @param {Document} document - The source document
 * @param {string} url - The source URL
 * @returns {Object} - The transformed content
 */
export default function transform(document, url) {
  const main = document.body;
  const results = [];

  // Extract page metadata
  const metadata = extractMetadata(document, url);

  // Transform slide content
  const slideContent = main.querySelector('.ssweaverSlide');
  if (slideContent) {
    // Parse hero section
    const heroBlock = parseHeroBlock(slideContent, document);
    if (heroBlock) results.push(heroBlock);

    // Parse stats if present
    const statsBlock = parseStatsBlock(slideContent, document);
    if (statsBlock) results.push(statsBlock);

    // Parse navigation cards
    const cardsBlock = parseCardsBlock(main, document);
    if (cardsBlock) results.push(cardsBlock);
  }

  // Parse ISI drawer content
  const isiDrawer = main.querySelector('.IndicationAndIsiDrawer, .IndicationAndIsiModal');
  if (isiDrawer) {
    const isiBlock = parseISIBlock(isiDrawer, document);
    if (isiBlock) results.push(isiBlock);
  }

  // Parse tabs if present (AML/CLL switcher)
  const tabsContainer = main.querySelector('[data-indication]');
  if (tabsContainer) {
    const tabsBlock = parseTabsBlock(tabsContainer, document);
    if (tabsBlock) results.push(tabsBlock);
  }

  // Add metadata block
  results.push(createMetadata(metadata));

  return {
    element: main,
    path: generatePath(url),
    blocks: results,
  };
}

/**
 * Extract metadata from document
 */
function extractMetadata(document, url) {
  const meta = {};

  // Title
  const title = document.querySelector('title');
  if (title) meta.title = title.textContent;

  // Description
  const description = document.querySelector('meta[name="description"]');
  if (description) meta.description = description.content;

  // OG Image
  const ogImage = document.querySelector('meta[property="og:image"]');
  if (ogImage) meta['og:image'] = ogImage.content;

  // Viewport/ad size for pharma presentations
  const adSize = document.querySelector('meta[name="ad.size"]');
  if (adSize) meta.viewport = adSize.content;

  return meta;
}

/**
 * Generate EDS path from URL
 */
function generatePath(url) {
  const urlObj = new URL(url);
  let path = urlObj.pathname;

  // Remove index.html
  path = path.replace(/\/index\.html$/, '');

  // Remove trailing slash
  path = path.replace(/\/$/, '');

  // Default to /content if root
  if (!path || path === '/') {
    path = '/content/home';
  }

  return path;
}

/**
 * Create a standard EDS block
 */
export function createEDSBlock(name, rows) {
  const table = document.createElement('table');

  // Header row with block name
  const headerRow = document.createElement('tr');
  const headerCell = document.createElement('th');
  headerCell.textContent = name;
  headerRow.appendChild(headerCell);
  table.appendChild(headerRow);

  // Content rows
  rows.forEach((row) => {
    const tr = document.createElement('tr');
    if (Array.isArray(row)) {
      row.forEach((cell) => {
        const td = document.createElement('td');
        if (typeof cell === 'string') {
          td.textContent = cell;
        } else {
          td.appendChild(cell);
        }
        tr.appendChild(td);
      });
    } else {
      const td = document.createElement('td');
      if (typeof row === 'string') {
        td.textContent = row;
      } else {
        td.appendChild(row);
      }
      tr.appendChild(td);
    }
    table.appendChild(tr);
  });

  return table;
}
