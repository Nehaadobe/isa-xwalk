/*
 * SKYRIZI Live Import Script for Helix AEM Importer
 * Dynamically extracts content from live SKYRIZI HCP pages
 * Source: https://www.skyrizihcp.com/dermatology/coverage-access
 */

/**
 * Create a block table with proper EDS structure
 */
function createBlockTable(doc, name, rows, columns = 2) {
  const table = doc.createElement('table');

  const headerRow = doc.createElement('tr');
  const headerCell = doc.createElement('th');
  headerCell.colSpan = columns;
  headerCell.textContent = name;
  headerRow.appendChild(headerCell);
  table.appendChild(headerRow);

  rows.forEach((row) => {
    const tr = doc.createElement('tr');
    const cells = Array.isArray(row) ? row : [row];
    cells.forEach((cellContent) => {
      const td = doc.createElement('td');
      if (typeof cellContent === 'string') {
        td.innerHTML = cellContent;
      } else if (cellContent && cellContent.nodeType) {
        td.appendChild(cellContent.cloneNode(true));
      }
      tr.appendChild(td);
    });
    while (tr.children.length < columns) {
      tr.appendChild(doc.createElement('td'));
    }
    table.appendChild(tr);
  });

  return table;
}

/**
 * Create section divider
 */
function createDivider(doc) {
  return doc.createElement('hr');
}

/**
 * Extract logo from the page
 */
function extractLogo(document) {
  const logoImg = document.querySelector('img[alt*="SKYRIZI"], img[alt*="skyrizi"], .logo img, header img');
  return logoImg ? logoImg.src : '';
}

/**
 * Extract coverage statistics from page
 */
function extractCoverageStats(document) {
  const stats = {
    headline: '',
    commercial: '',
    medicare: '',
    footnote: ''
  };

  // Get headline from h1
  const h1 = document.querySelector('h1');
  if (h1) {
    stats.headline = h1.textContent.trim();
  }

  // Get percentage stats from h2 elements
  const h2s = document.querySelectorAll('h2');
  h2s.forEach((h2) => {
    const text = h2.textContent;
    if (text.includes('99')) stats.commercial = text.trim();
    if (text.includes('97')) stats.medicare = text.trim();
  });

  // Get footnote
  const footnoteEl = document.querySelector('p[class*="footnote"], .footnote');
  if (footnoteEl) {
    stats.footnote = footnoteEl.textContent.trim();
  }

  return stats;
}

/**
 * Extract indications from ISI section
 */
function extractIndications(document) {
  const indications = [];

  // Look in the ISI region or safety information section
  const isiRegion = document.querySelector('[aria-label*="Safety"], .isi, #isi, [class*="safety"]');
  const searchArea = isiRegion || document;

  const paragraphs = searchArea.querySelectorAll('p');
  paragraphs.forEach((p) => {
    const text = p.textContent;
    if (text.includes('Plaque Psoriasis:') ||
        text.includes('Psoriatic Arthritis:') ||
        text.includes("Crohn's Disease:") ||
        text.includes('Ulcerative Colitis:')) {
      indications.push(text.trim());
    }
  });

  return indications;
}

/**
 * Extract support program cards
 */
function extractSupportCards(document) {
  const cards = [];

  // Look for support-related sections
  const headings = document.querySelectorAll('h3, h4, p strong, p b');
  headings.forEach((heading) => {
    const text = heading.textContent.toUpperCase();
    const parent = heading.closest('div') || heading.parentElement;
    const description = parent?.querySelector('p:not(:first-child)')?.textContent || '';

    if (text.includes('AFFORDABILITY')) {
      cards.push({ title: 'AFFORDABILITY', description: description.trim() });
    } else if (text.includes('ACCESS SUPPORT') || text.includes('FIELD REIMBURSEMENT')) {
      cards.push({ title: 'ACCESS SUPPORT', description: description.trim() });
    } else if (text.includes('BRIDGING') || text.includes('BRIDGE PROGRAM')) {
      cards.push({ title: 'BRIDGING PATIENTS', description: description.trim() });
    }
  });

  return cards;
}

/**
 * Extract safety information sections
 */
function extractSafetyInfo(document) {
  const sections = [];

  const isiRegion = document.querySelector('[aria-label*="Safety"], .isi, #isi');
  if (!isiRegion) return sections;

  const headings = ['Hypersensitivity', 'Infection', 'Tuberculosis', 'Vaccines', 'Adverse Reactions'];

  headings.forEach((keyword) => {
    const elements = isiRegion.querySelectorAll('p, h3, h4');
    elements.forEach((el) => {
      if (el.textContent.includes(keyword)) {
        const nextEl = el.nextElementSibling;
        sections.push({
          title: el.textContent.trim(),
          content: nextEl?.textContent?.trim() || ''
        });
      }
    });
  });

  return sections;
}

/**
 * Extract page metadata
 */
function extractMetadata(document) {
  return {
    title: document.title || '',
    description: document.querySelector('meta[name="description"]')?.content || '',
    keywords: document.querySelector('meta[name="keywords"]')?.content || ''
  };
}

/**
 * Main transform function - dynamically extracts from live page
 */
export default {
  transform: ({ document, url }) => {
    console.log('[SKI-ISI LIVE IMPORT] Processing URL:', url);

    // Extract all data from live page
    const logo = extractLogo(document);
    const coverage = extractCoverageStats(document);
    const indications = extractIndications(document);
    const supportCards = extractSupportCards(document);
    const safetyInfo = extractSafetyInfo(document);
    const metadata = extractMetadata(document);

    console.log('[SKI-ISI LIVE IMPORT] Extracted:', {
      hasLogo: !!logo,
      hasCoverage: !!coverage.headline,
      indicationsCount: indications.length,
      supportCardsCount: supportCards.length,
      safetyCount: safetyInfo.length
    });

    // Clear body and build new structure
    const { body } = document;
    body.innerHTML = '';

    // === SKI-ISI-HERO Block ===
    const heroRows = [];
    if (logo) {
      heroRows.push([`<img src="${logo}" alt="SKYRIZI Logo">`, '']);
    }
    heroRows.push(['Tap here', 'for SKYRIZI Indications and additional Important Safety Information. <a href="https://www.rxabbvie.com/pdf/skyrizi_pi.pdf">See Full Prescribing Information</a>']);

    body.appendChild(createBlockTable(document, 'Ski Isi Hero', heroRows, 2));
    body.appendChild(createDivider(document));

    // === SKI-ISI-INDICATIONS Block ===
    if (indications.length > 0) {
      const indicationsRows = [['INDICATIONS', '']];
      indications.forEach((ind) => {
        const colonIndex = ind.indexOf(':');
        if (colonIndex > -1) {
          indicationsRows.push([
            ind.substring(0, colonIndex + 1),
            ind.substring(colonIndex + 1).trim()
          ]);
        } else {
          indicationsRows.push([ind, '']);
        }
      });
      indicationsRows.push(['Please see <a href="https://www.rxabbvie.com/pdf/skyrizi_pi.pdf">Full Prescribing Information</a>.', '']);

      body.appendChild(createBlockTable(document, 'Ski Isi Indications', indicationsRows, 2));
      body.appendChild(createDivider(document));
    }

    // === SKI-ISI-COVERAGE Block ===
    if (coverage.commercial || coverage.medicare) {
      const coverageRows = [
        [coverage.headline || 'Preferred National Coverage', '', ''],
        ['Overview', 'National', 'Local'],
        ['Commercial', coverage.commercial || 'N/A', 'PREFERRED COVERAGE'],
        ['Medicare Part D', coverage.medicare || 'N/A', 'PREFERRED COVERAGE'],
        [coverage.footnote || '', '', '']
      ];

      body.appendChild(createBlockTable(document, 'Ski Isi Coverage', coverageRows, 3));
      body.appendChild(createDivider(document));
    }

    // === SKI-ISI-SUPPORT Block ===
    if (supportCards.length > 0) {
      const supportRows = [['Encourage your patients to enroll in', '']];
      supportCards.forEach((card) => {
        supportRows.push([`<strong>${card.title}</strong>`, card.description]);
      });
      supportRows.push(['<a href="/skyrizi-complete">FIND OUT MORE</a>', '']);

      body.appendChild(createBlockTable(document, 'Ski Isi Support', supportRows, 2));
      body.appendChild(createDivider(document));
    }

    // === SKI-ISI-SAFETY Block (if safety info extracted) ===
    if (safetyInfo.length > 0) {
      const safetyRows = [['IMPORTANT SAFETY INFORMATION', '']];
      safetyInfo.forEach((section) => {
        safetyRows.push([`<strong>${section.title}</strong>`, section.content]);
      });

      body.appendChild(createBlockTable(document, 'Ski Isi Safety', safetyRows, 2));
      body.appendChild(createDivider(document));
    }

    // === SKI-ISI-NAV Block ===
    const navRows = [
      ['<a href="/content/skyrizi/overview">OVERVIEW</a> <a href="/content/skyrizi/h2h">H2H</a> <a href="/content/skyrizi/pasi-90-100">PASI 90-100</a> <a href="/content/skyrizi/safety">SAFETY</a> <a href="/content/skyrizi/access">ACCESS</a>']
    ];
    body.appendChild(createBlockTable(document, 'Ski Isi Nav', navRows, 1));
    body.appendChild(createDivider(document));

    // === METADATA Block ===
    const metadataRows = [
      ['title', metadata.title],
      ['description', metadata.description]
    ];
    if (metadata.keywords) {
      metadataRows.push(['keywords', metadata.keywords]);
    }
    body.appendChild(createBlockTable(document, 'Metadata', metadataRows, 2));

    // Determine output path from URL
    let path = '/skyrizi/access';
    const urlLower = url.toLowerCase();
    if (urlLower.includes('safety')) path = '/skyrizi/safety';
    else if (urlLower.includes('efficacy') || urlLower.includes('pasi')) path = '/skyrizi/pasi-90-100';
    else if (urlLower.includes('h2h') || urlLower.includes('head-to-head')) path = '/skyrizi/h2h';
    else if (urlLower.includes('overview')) path = '/skyrizi/overview';

    return [{
      element: body,
      path,
    }];
  },
};
