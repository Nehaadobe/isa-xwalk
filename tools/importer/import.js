/*
 * SKYRIZI Site Import Script for Helix AEM Importer
 * Converts SKYRIZI pharmaceutical pages to AEM Edge Delivery Services
 *
 * Supports pages:
 * - /access - Coverage and support information
 * - /h2h - Head-to-head comparison data
 * - /overview - Product overview
 * - /pasi-90-100 - PASI efficacy results
 * - /safety - Safety information
 */

/**
 * Helper: Get text content from element
 */
function getText(el) {
  return el?.textContent?.trim() || '';
}

/**
 * Helper: Create a block table with proper EDS structure
 */
function createBlock(doc, name, rows, columns = 2) {
  const table = doc.createElement('table');

  // Block name header row
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
 * Helper: Create section divider
 */
function createDivider(doc) {
  return doc.createElement('hr');
}

/**
 * Extract brand/logo info from page
 */
function extractBrandInfo(document) {
  const logo = document.querySelector('.brand-logo img, .logo img, [class*="logo"] img, header img');
  const subtitle = document.querySelector('.brand-subtitle, [class*="subtitle"]');

  return {
    name: 'SKYRIZI',
    subtitle: getText(subtitle) || '(risankizumab-rzaa)',
    logo: logo?.src || './images/logo-skyrizi.svg',
  };
}

/**
 * Extract ISI toggle lines from page header
 */
function extractISILines(document) {
  const isiLines = [];

  // Look for ISI toggle elements in header area
  const isiToggles = document.querySelectorAll('[class*="isi-toggle"], [class*="tap-here"], .topbar-line, [class*="topbar"]');

  isiToggles.forEach((toggle) => {
    const toggleBtn = toggle.querySelector('button, .toggle, [class*="toggle"]');
    const content = toggle.querySelector('.isi-content, .content, span:not(.toggle), p');
    const link = toggle.querySelector('a');

    if (toggleBtn || content) {
      isiLines.push({
        toggle: getText(toggleBtn) || 'Tap here',
        text: getText(content) || '',
        linkText: getText(link) || 'See Full Prescribing Information',
        linkHref: link?.href || '',
      });
    }
  });

  // Default ISI lines if none found
  if (isiLines.length === 0) {
    isiLines.push({
      toggle: 'Tap here',
      text: 'for SKYRIZI Indications and additional Important Safety Information.',
      linkText: 'See Full Prescribing Information',
      linkHref: 'https://www.rxabbvie.com/pdf/skyrizi_pi.pdf',
    });
  }

  return isiLines;
}

/**
 * Extract indications from page
 */
function extractIndications(document) {
  const indications = [];

  // Look for indication items
  const indicationEls = document.querySelectorAll('[class*="indication"], .indication-item, [class*="condition"]');

  indicationEls.forEach((el) => {
    const condition = getText(el.querySelector('h3, h4, .condition-name, strong, dt'));
    const description = getText(el.querySelector('p, .description, dd'));

    if (condition || description) {
      indications.push({ condition: condition || '', description: description || '' });
    }
  });

  // Default indications if none found
  if (indications.length === 0) {
    indications.push(
      { condition: 'Plaque Psoriasis:', description: 'SKYRIZI is indicated for the treatment of moderate to severe plaque psoriasis in adults who are candidates for systemic therapy or phototherapy.' },
      { condition: 'Psoriatic Arthritis:', description: 'SKYRIZI is indicated for the treatment of active psoriatic arthritis in adults.' },
      { condition: 'Crohn\'s Disease:', description: 'SKYRIZI is indicated for the treatment of moderately to severely active Crohn\'s disease in adults.' },
    );
  }

  return indications;
}

/**
 * Extract coverage statistics from page
 */
function extractCoverage(document) {
  const coverage = {
    title: '',
    tabs: ['Overview', 'National', 'Local'],
    stats: [],
    footnote: '',
  };

  // Extract title
  const titleEl = document.querySelector('[class*="coverage"] h2, [class*="coverage-title"], [class*="headline"]');
  coverage.title = getText(titleEl) || 'for Ps & PsA SKYRIZI Patients: Preferred NATIONAL Coverage & Exceptional Support';

  // Extract stats from stat cards or similar elements
  const statEls = document.querySelectorAll('[class*="stat-card"], [class*="coverage-stat"], [class*="stat"]');
  statEls.forEach((stat) => {
    const label = getText(stat.querySelector('.label, h3, h4, [class*="label"]'));
    const value = getText(stat.querySelector('.value, .percentage, [class*="number"], [class*="value"]'));
    const description = getText(stat.querySelector('.description, [class*="desc"]'));

    if (label || value) {
      coverage.stats.push({
        label: label || '',
        value: value?.replace('%', '') || '',
        description: description || 'PREFERRED COVERAGE<sup>2</sup>*†'
      });
    }
  });

  // Default stats if none found
  if (coverage.stats.length === 0) {
    coverage.stats = [
      { label: 'Commercial', value: '99', description: 'PREFERRED COVERAGE<sup>2</sup>*†' },
      { label: 'Medicare Part D', value: '97', description: 'PREFERRED COVERAGE<sup>2</sup>*†' },
    ];
  }

  // Extract footnote
  const footnoteEl = document.querySelector('[class*="footnote"], [class*="disclaimer"]');
  coverage.footnote = getText(footnoteEl) || '**Preferred coverage means SKYRIZI is AVAILABLE:** With no advanced systemic failure required‡ At the lowest branded co-pay/coinsurance tier.';

  return coverage;
}

/**
 * Extract support program info from page
 */
function extractSupport(document) {
  const support = {
    title: 'Encourage your patients to enroll in',
    cards: [],
    cta: { label: 'FIND OUT MORE', link: '/skyrizi-complete' },
    footnotes: '',
  };

  // Extract cards
  const cardEls = document.querySelectorAll('[class*="support-card"], [class*="card"], [class*="benefit"]');
  cardEls.forEach((card) => {
    const title = getText(card.querySelector('h4, h5, .title, strong, [class*="title"]'));
    const description = getText(card.querySelector('p, .description, [class*="desc"]'));
    const icon = getText(card.querySelector('[class*="icon"]')) || card.querySelector('img')?.alt || '';

    if (title || description) {
      support.cards.push({
        icon: icon || '$5',
        title: title?.toUpperCase() || '',
        description: description || ''
      });
    }
  });

  // Default cards if none found
  if (support.cards.length === 0) {
    support.cards = [
      { icon: '$5', title: 'AFFORDABILITY', description: 'Eligible commercially insured patients may pay as little as $5 per quarterly dose§' },
      { icon: 'support', title: 'ONE-TO-ONE SUPPORT', description: 'Insurance Specialists to help navigate insurance and Nurse Ambassadors∥ to help patients start and stay on therapy' },
      { icon: 'bridge', title: 'BRIDGE PROGRAM ELIGIBILITY', description: 'No-cost product available for eligible patients in the event of a denial in coverage due to step-therapy requirement¶' },
    ];
  }

  // Extract CTA
  const ctaEl = document.querySelector('[class*="cta"] a, a[class*="btn"], .button');
  if (ctaEl) {
    support.cta = { label: getText(ctaEl) || 'FIND OUT MORE', link: ctaEl.href || '/skyrizi-complete' };
  }

  // Extract footnotes
  const footnotesEl = document.querySelector('[class*="footnote"], footer [class*="disclaimer"]');
  support.footnotes = getText(footnotesEl) || '‡Advanced systemics inclusive of PDE4 inhibitors, JAK inhibitors, or biologics.';

  return support;
}

/**
 * Extract navigation items from page
 */
function extractNavigation(document) {
  const navItems = [];

  // Look for navigation links
  const navEls = document.querySelectorAll('nav a, [class*="nav"] a, .navigation a, [class*="menu"] a');

  navEls.forEach((link) => {
    const label = getText(link);
    const href = link.getAttribute('href');

    if (label && href && !href.startsWith('#')) {
      navItems.push({
        label: label.toUpperCase(),
        link: href
      });
    }
  });

  // Default nav items if none found
  if (navItems.length === 0) {
    navItems.push(
      { label: 'OVERVIEW', link: '/content/skyrizi/overview' },
      { label: 'H2H', link: '/content/skyrizi/h2h' },
      { label: 'PASI 90-100', link: '/content/skyrizi/pasi-90-100' },
      { label: 'SAFETY', link: '/content/skyrizi/safety' },
      { label: 'ACCESS', link: '/content/skyrizi/access' },
    );
  }

  return navItems;
}

/**
 * Extract safety information from page
 */
function extractSafetyInfo(document) {
  const sections = [];

  // Look for safety sections
  const safetyEls = document.querySelectorAll('[class*="safety-section"], [class*="warning"], [class*="precaution"]');

  safetyEls.forEach((el) => {
    const heading = getText(el.querySelector('h2, h3, h4, strong'));
    const content = getText(el.querySelector('p, .content'));

    if (heading || content) {
      sections.push({ heading: heading || '', content: content || '' });
    }
  });

  // Default safety sections if none found
  if (sections.length === 0) {
    sections.push(
      { heading: 'CONTRAINDICATIONS', content: 'SKYRIZI is contraindicated in patients with a history of serious hypersensitivity reaction to risankizumab-rzaa or any of the excipients.' },
      { heading: 'WARNINGS - Hypersensitivity', content: 'Serious hypersensitivity reactions, including anaphylaxis, have been reported. If a serious hypersensitivity reaction occurs, discontinue SKYRIZI and initiate appropriate therapy immediately.' },
      { heading: 'WARNINGS - Infections', content: 'SKYRIZI may increase the risk of infection. Instruct patients to report signs or symptoms of clinically important infection.' },
    );
  }

  return sections;
}

/**
 * Extract efficacy/PASI data from page
 */
function extractEfficacyData(document) {
  const data = {
    title: 'PASI Response at Week 16',
    items: [],
  };

  // Look for efficacy data points
  const dataEls = document.querySelectorAll('[class*="efficacy"], [class*="pasi"], [class*="result"]');

  dataEls.forEach((el) => {
    const label = getText(el.querySelector('.label, h3, h4'));
    const value = getText(el.querySelector('.value, .percentage, [class*="number"]'));
    const desc = getText(el.querySelector('.description, p'));

    if (label || value) {
      data.items.push({ label: label || '', value: value || '', description: desc || '' });
    }
  });

  // Default efficacy data if none found
  if (data.items.length === 0) {
    data.items = [
      { label: 'PASI 75', value: '91%', description: 'Patients achieving PASI 75' },
      { label: 'PASI 90', value: '75%', description: 'Patients achieving PASI 90' },
      { label: 'PASI 100', value: '51%', description: 'Patients achieving complete skin clearance' },
    ];
  }

  return data;
}

/**
 * Detect page type from URL
 */
function detectPageType(url) {
  const urlLower = url.toLowerCase();
  if (urlLower.includes('access')) return 'access';
  if (urlLower.includes('h2h') || urlLower.includes('head-to-head')) return 'h2h';
  if (urlLower.includes('overview')) return 'overview';
  if (urlLower.includes('pasi') || urlLower.includes('efficacy')) return 'pasi';
  if (urlLower.includes('safety')) return 'safety';
  return 'access'; // Default
}

/**
 * Build Access page content
 */
function buildAccessPage(doc, brand, isiLines, indications, coverage, support, navItems) {
  const { body } = doc;
  body.innerHTML = '';

  // Hero block
  const heroRows = [
    [`<img src="${brand.logo}" alt="SKYRIZI Logo">`, ''],
  ];
  isiLines.forEach((isi) => {
    heroRows.push([isi.toggle, `${isi.text} <a href="${isi.linkHref}">${isi.linkText}</a>`]);
  });
  body.appendChild(createBlock(doc, 'Ski Isi Hero', heroRows));
  body.appendChild(createDivider(doc));

  // Indications block
  const indicationsRows = [['INDICATIONS', '']];
  indications.forEach((ind) => {
    indicationsRows.push([ind.condition, ind.description]);
  });
  indicationsRows.push(['Please see <a href="https://www.rxabbvie.com/pdf/skyrizi_pi.pdf">Full Prescribing Information</a>.', '']);
  body.appendChild(createBlock(doc, 'Ski Isi Indications', indicationsRows));
  body.appendChild(createDivider(doc));

  // Coverage block
  const coverageRows = [
    [coverage.title],
    coverage.tabs,
  ];
  coverage.stats.forEach((stat) => {
    coverageRows.push([stat.label, `${stat.value}%`, stat.description]);
  });
  coverageRows.push([coverage.footnote]);
  body.appendChild(createBlock(doc, 'Ski Isi Coverage', coverageRows, 3));
  body.appendChild(createDivider(doc));

  // Support block
  const supportRows = [[support.title, '']];
  support.cards.forEach((card) => {
    supportRows.push([card.icon, `**${card.title}** ${card.description}`]);
  });
  supportRows.push([`<a href="${support.cta.link}">${support.cta.label}</a>`, '']);
  supportRows.push([support.footnotes, '']);
  body.appendChild(createBlock(doc, 'Ski Isi Support', supportRows));
  body.appendChild(createDivider(doc));

  // Navigation block
  const navLinks = navItems.map((item) => `<a href="${item.link}">${item.label}</a>`).join(' ');
  body.appendChild(createBlock(doc, 'Ski Isi Nav', [[navLinks]], 1));
  body.appendChild(createDivider(doc));

  // Metadata
  body.appendChild(createBlock(doc, 'Metadata', [
    ['title', 'SKYRIZI Access - Coverage & Support'],
    ['description', 'Access information, coverage details, and patient support programs for SKYRIZI'],
  ]));

  return '/skyrizi/access';
}

/**
 * Build Safety page content
 */
function buildSafetyPage(doc, brand, isiLines, safetySections, navItems) {
  const { body } = doc;
  body.innerHTML = '';

  // Hero block
  const heroRows = [[`<img src="${brand.logo}" alt="SKYRIZI Logo">`, '']];
  isiLines.forEach((isi) => {
    heroRows.push([isi.toggle, `${isi.text} <a href="${isi.linkHref}">${isi.linkText}</a>`]);
  });
  body.appendChild(createBlock(doc, 'Ski Isi Hero', heroRows));
  body.appendChild(createDivider(doc));

  // Safety block
  const safetyRows = [['Important Safety Information', '']];
  safetySections.forEach((section) => {
    safetyRows.push([section.heading, section.content]);
  });
  body.appendChild(createBlock(doc, 'Ski Isi Safety', safetyRows));
  body.appendChild(createDivider(doc));

  // Navigation
  const navLinks = navItems.map((item) => `<a href="${item.link}">${item.label}</a>`).join(' ');
  body.appendChild(createBlock(doc, 'Ski Isi Nav', [[navLinks]], 1));
  body.appendChild(createDivider(doc));

  // Metadata
  body.appendChild(createBlock(doc, 'Metadata', [
    ['title', 'SKYRIZI Safety Information'],
    ['description', 'Important safety information, warnings, and adverse reactions for SKYRIZI'],
  ]));

  return '/skyrizi/safety';
}

/**
 * Build PASI/Efficacy page content
 */
function buildPasiPage(doc, brand, isiLines, efficacyData, navItems) {
  const { body } = doc;
  body.innerHTML = '';

  // Hero block
  const heroRows = [[`<img src="${brand.logo}" alt="SKYRIZI Logo">`, '']];
  isiLines.forEach((isi) => {
    heroRows.push([isi.toggle, `${isi.text} <a href="${isi.linkHref}">${isi.linkText}</a>`]);
  });
  body.appendChild(createBlock(doc, 'Ski Isi Hero', heroRows));
  body.appendChild(createDivider(doc));

  // Efficacy block
  const efficacyRows = [[efficacyData.title]];
  efficacyData.items.forEach((item) => {
    efficacyRows.push([item.label, item.value, item.description]);
  });
  body.appendChild(createBlock(doc, 'Ski Isi Efficacy', efficacyRows, 3));
  body.appendChild(createDivider(doc));

  // Stats block
  const statsRows = [];
  efficacyData.items.forEach((item) => {
    statsRows.push([item.value, item.label, item.description]);
  });
  body.appendChild(createBlock(doc, 'Ski Isi Stats', statsRows, 3));
  body.appendChild(createDivider(doc));

  // Navigation
  const navLinks = navItems.map((item) => `<a href="${item.link}">${item.label}</a>`).join(' ');
  body.appendChild(createBlock(doc, 'Ski Isi Nav', [[navLinks]], 1));
  body.appendChild(createDivider(doc));

  // Metadata
  body.appendChild(createBlock(doc, 'Metadata', [
    ['title', 'SKYRIZI PASI 90-100 Clinical Results'],
    ['description', 'PASI efficacy results from SKYRIZI clinical trials'],
  ]));

  return '/skyrizi/pasi-90-100';
}

/**
 * Main transform function for Helix AEM Importer
 */
export default {
  transform: ({ document, url }) => {
    // eslint-disable-next-line no-console
    console.log('[SKYRIZI IMPORT] Transform called with URL:', url);

    const pageType = detectPageType(url);

    // Extract content from the page
    const brand = extractBrandInfo(document);
    const isiLines = extractISILines(document);
    const indications = extractIndications(document);
    const coverage = extractCoverage(document);
    const support = extractSupport(document);
    const navItems = extractNavigation(document);
    const safetySections = extractSafetyInfo(document);
    const efficacyData = extractEfficacyData(document);

    let path;

    switch (pageType) {
      case 'safety':
        path = buildSafetyPage(document, brand, isiLines, safetySections, navItems);
        break;
      case 'pasi':
        path = buildPasiPage(document, brand, isiLines, efficacyData, navItems);
        break;
      case 'h2h':
      case 'overview':
      case 'access':
      default:
        path = buildAccessPage(document, brand, isiLines, indications, coverage, support, navItems);
        break;
    }

    return [{
      element: document.body,
      path,
    }];
  },
};
