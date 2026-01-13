/*
 * SKYRIZI ISI Import Script for Helix AEM Importer
 * Generates proper block tables for ski-isi-* blocks
 * Compatible with AEM Helix Importer tool
 */

/**
 * Create a block table with proper EDS structure
 * @param {Document} doc - The document object
 * @param {string} name - Block name (e.g., 'ski-isi-hero')
 * @param {Array} rows - Array of row data (each row is an array of cells)
 * @param {number} columns - Number of columns for the block
 */
function createBlockTable(doc, name, rows, columns = 2) {
  const table = doc.createElement('table');

  // Header row with block name
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
    cells.forEach((cellContent) => {
      const td = doc.createElement('td');
      if (typeof cellContent === 'string') {
        td.innerHTML = cellContent;
      } else if (cellContent && cellContent.nodeType) {
        td.appendChild(cellContent.cloneNode(true));
      }
      tr.appendChild(td);
    });
    // Pad remaining columns if needed
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
 * Extract logo/brand info from source page
 */
function extractLogo(document) {
  const logo = document.querySelector('img[alt*="SKYRIZI"], img[alt*="Skyrizi"], .logo img, header img');
  return logo ? logo.src : './images/logo-skyrizi.svg';
}

/**
 * Main transform function for Helix AEM Importer
 */
export default {
  transform: ({ document, url }) => {
    console.log('[SKI-ISI IMPORT] Processing URL:', url);

    const { body } = document;
    const logoSrc = extractLogo(document);

    // Clear body and build new structure
    body.innerHTML = '';

    // === SKI-ISI-HERO Block ===
    const heroRows = [
      [`<img src="${logoSrc}" alt="SKYRIZI Logo">`, ''],
      ['Tap here', 'for SKYRIZI Indications and additional Important Safety Information. <a href="https://www.rxabbvie.com/pdf/skyrizi_pi.pdf">See Full Prescribing Information</a>'],
      ['Tap here', 'for HUMIRA Indications and Important Safety Information, including BOXED WARNING. <a href="https://www.rxabbvie.com/pdf/humira.pdf">See Full Prescribing Information</a>'],
    ];
    body.appendChild(createBlockTable(document, 'Ski Isi Hero', heroRows, 2));
    body.appendChild(createDivider(document));

    // === SKI-ISI-INDICATIONS Block ===
    const indicationsRows = [
      ['INDICATIONS', ''],
      ['Plaque Psoriasis:', 'SKYRIZI is indicated for the treatment of moderate to severe plaque psoriasis in adults who are candidates for systemic therapy or phototherapy.'],
      ['Psoriatic Arthritis:', 'SKYRIZI is indicated for the treatment of active psoriatic arthritis in adults.'],
      ["Crohn's Disease:", 'SKYRIZI is indicated for the treatment of moderately to severely active Crohn\'s disease in adults.'],
      ['Please see <a href="https://www.rxabbvie.com/pdf/skyrizi_pi.pdf">Full Prescribing Information</a>.', ''],
    ];
    body.appendChild(createBlockTable(document, 'Ski Isi Indications', indicationsRows, 2));
    body.appendChild(createDivider(document));

    // === SKI-ISI-COVERAGE Block ===
    const coverageRows = [
      ['for Ps &amp; PsA SKYRIZI Patients: Preferred NATIONAL Coverage &amp; Exceptional Support', '', ''],
      ['Overview', 'National', 'Local'],
      ['Commercial', '99%', 'PREFERRED COVERAGE<sup>2</sup>*†'],
      ['Medicare Part D', '97%', 'PREFERRED COVERAGE<sup>2</sup>*†'],
      ['<strong>Preferred coverage means SKYRIZI is AVAILABLE:</strong> With no advanced systemic failure required‡ At the lowest branded co-pay/coinsurance tier. National Commercial and Medicare Part D Formulary coverage under the pharmacy benefit as of December 2023.', '', ''],
    ];
    body.appendChild(createBlockTable(document, 'Ski Isi Coverage', coverageRows, 3));
    body.appendChild(createDivider(document));

    // === SKI-ISI-SUPPORT Block ===
    const supportRows = [
      ['Encourage your patients to enroll in', ''],
      ['$5', '<strong>AFFORDABILITY</strong> Eligible commercially insured patients may pay as little as $5 per quarterly dose§'],
      ['support', '<strong>ONE-TO-ONE SUPPORT</strong> Insurance Specialists to help navigate insurance and Nurse Ambassadors∥ to help patients start and stay on therapy'],
      ['bridge', '<strong>BRIDGE PROGRAM ELIGIBILITY</strong> No-cost product available for eligible patients in the event of a denial in coverage due to step-therapy requirement¶'],
      ['<a href="/skyrizi-complete">FIND OUT MORE</a>', ''],
      ['‡Advanced systemics inclusive of PDE4 inhibitors, JAK inhibitors, or biologics. ∥Nurse Ambassadors are provided by AbbVie and do not provide medical advice.', ''],
    ];
    body.appendChild(createBlockTable(document, 'Ski Isi Support', supportRows, 2));
    body.appendChild(createDivider(document));

    // === SKI-ISI-NAV Block ===
    const navRows = [
      ['<a href="/content/skyrizi/overview">OVERVIEW</a> <a href="/content/skyrizi/h2h">H2H</a> <a href="/content/skyrizi/pasi-90-100">PASI 90-100</a> <a href="/content/skyrizi/safety">SAFETY</a> <a href="/content/skyrizi/access">ACCESS</a>'],
    ];
    body.appendChild(createBlockTable(document, 'Ski Isi Nav', navRows, 1));
    body.appendChild(createDivider(document));

    // === METADATA Block ===
    const metadataRows = [
      ['title', 'SKYRIZI Access - Coverage &amp; Support'],
      ['description', 'Access information, coverage details, and patient support programs for SKYRIZI'],
    ];
    body.appendChild(createBlockTable(document, 'Metadata', metadataRows, 2));

    return [{
      element: body,
      path: '/skyrizi/access',
    }];
  },
};
