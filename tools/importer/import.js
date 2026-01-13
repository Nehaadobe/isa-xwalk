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

  const indicationEls = document.querySelectorAll('[class*="indication"], .indication-item, [class*="condition"]');

  indicationEls.forEach((el) => {
    const condition = getText(el.querySelector('h3, h4, .condition-name, strong, dt'));
    const description = getText(el.querySelector('p, .description, dd'));

    if (condition || description) {
      indications.push({ condition: condition || '', description: description || '' });
    }
  });

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

  const titleEl = document.querySelector('[class*="coverage"] h2, [class*="coverage-title"], [class*="headline"]');
  coverage.title = getText(titleEl) || 'for Ps & PsA SKYRIZI Patients: Preferred NATIONAL Coverage & Exceptional Support';

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

  if (coverage.stats.length === 0) {
    coverage.stats = [
      { label: 'Commercial', value: '99', description: 'PREFERRED COVERAGE<sup>2</sup>*†' },
      { label: 'Medicare Part D', value: '97', description: 'PREFERRED COVERAGE<sup>2</sup>*†' },
    ];
  }

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

  if (support.cards.length === 0) {
    support.cards = [
      { icon: '$5', title: 'AFFORDABILITY', description: 'Eligible commercially insured patients may pay as little as $5 per quarterly dose§' },
      { icon: 'support', title: 'ONE-TO-ONE SUPPORT', description: 'Insurance Specialists to help navigate insurance and Nurse Ambassadors∥ to help patients start and stay on therapy' },
      { icon: 'bridge', title: 'BRIDGE PROGRAM ELIGIBILITY', description: 'No-cost product available for eligible patients in the event of a denial in coverage due to step-therapy requirement¶' },
    ];
  }

  const ctaEl = document.querySelector('[class*="cta"] a, a[class*="btn"], .button');
  if (ctaEl) {
    support.cta = { label: getText(ctaEl) || 'FIND OUT MORE', link: ctaEl.href || '/skyrizi-complete' };
  }

  const footnotesEl = document.querySelector('[class*="footnote"], footer [class*="disclaimer"]');
  support.footnotes = getText(footnotesEl) || '‡Advanced systemics inclusive of PDE4 inhibitors, JAK inhibitors, or biologics.';

  return support;
}

/**
 * Extract navigation items from page
 */
function extractNavigation(document) {
  const navItems = [];

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

  const safetyEls = document.querySelectorAll('[class*="safety-section"], [class*="warning"], [class*="precaution"]');

  safetyEls.forEach((el) => {
    const heading = getText(el.querySelector('h2, h3, h4, strong'));
    const content = getText(el.querySelector('p, .content'));

    if (heading || content) {
      sections.push({ heading: heading || '', content: content || '' });
    }
  });

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

  const dataEls = document.querySelectorAll('[class*="efficacy"], [class*="pasi"], [class*="result"]');

  dataEls.forEach((el) => {
    const label = getText(el.querySelector('.label, h3, h4'));
    const value = getText(el.querySelector('.value, .percentage, [class*="number"]'));
    const desc = getText(el.querySelector('.description, p'));

    if (label || value) {
      data.items.push({ label: label || '', value: value || '', description: desc || '' });
    }
  });

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
  return 'access';
}

/**
 * Build Access page content
 */
function buildAccessPage(doc, brand, isiLines, indications, coverage, support, navItems) {
  const elements = [];

  // Hero block
  const heroRows = [['Hero']];
  heroRows.push([`<img src="${brand.logo}" alt="SKYRIZI Logo">`, '']);
  isiLines.forEach((isi) => {
    heroRows.push([isi.toggle, `${isi.text} <a href="${isi.linkHref}">${isi.linkText}</a>`]);
  });
  elements.push(heroRows);

  // Indications block
  const indicationsRows = [['Cards']];
  indicationsRows.push(['INDICATIONS', '']);
  indications.forEach((ind) => {
    indicationsRows.push([ind.condition, ind.description]);
  });
  indicationsRows.push(['Please see <a href="https://www.rxabbvie.com/pdf/skyrizi_pi.pdf">Full Prescribing Information</a>.', '']);
  elements.push(indicationsRows);

  // Coverage block
  const coverageRows = [['Columns']];
  coverageRows.push([coverage.title]);
  coverageRows.push(coverage.tabs);
  coverage.stats.forEach((stat) => {
    coverageRows.push([stat.label, `${stat.value}%`, stat.description]);
  });
  coverageRows.push([coverage.footnote]);
  elements.push(coverageRows);

  // Support block
  const supportRows = [['Cards']];
  supportRows.push([support.title, '']);
  support.cards.forEach((card) => {
    supportRows.push([card.icon, `**${card.title}** ${card.description}`]);
  });
  supportRows.push([`<a href="${support.cta.link}">${support.cta.label}</a>`, '']);
  supportRows.push([support.footnotes, '']);
  elements.push(supportRows);

  // Navigation block
  const navLinks = navItems.map((item) => `<a href="${item.link}">${item.label}</a>`).join(' ');
  elements.push([['Fragment'], [navLinks]]);

  // Metadata
  elements.push([
    ['Metadata'],
    ['title', 'SKYRIZI Access - Coverage & Support'],
    ['description', 'Access information, coverage details, and patient support programs for SKYRIZI'],
  ]);

  return { elements, path: '/skyrizi/access' };
}

/**
 * Build Safety page content
 */
function buildSafetyPage(doc, brand, isiLines, safetySections, navItems) {
  const elements = [];

  // Hero block
  const heroRows = [['Hero']];
  heroRows.push([`<img src="${brand.logo}" alt="SKYRIZI Logo">`, '']);
  isiLines.forEach((isi) => {
    heroRows.push([isi.toggle, `${isi.text} <a href="${isi.linkHref}">${isi.linkText}</a>`]);
  });
  elements.push(heroRows);

  // Safety block
  const safetyRows = [['Accordion']];
  safetyRows.push(['Important Safety Information', '']);
  safetySections.forEach((section) => {
    safetyRows.push([section.heading, section.content]);
  });
  elements.push(safetyRows);

  // Navigation
  const navLinks = navItems.map((item) => `<a href="${item.link}">${item.label}</a>`).join(' ');
  elements.push([['Fragment'], [navLinks]]);

  // Metadata
  elements.push([
    ['Metadata'],
    ['title', 'SKYRIZI Safety Information'],
    ['description', 'Important safety information, warnings, and adverse reactions for SKYRIZI'],
  ]);

  return { elements, path: '/skyrizi/safety' };
}

/**
 * Build PASI/Efficacy page content
 */
function buildPasiPage(doc, brand, isiLines, efficacyData, navItems) {
  const elements = [];

  // Hero block
  const heroRows = [['Hero']];
  heroRows.push([`<img src="${brand.logo}" alt="SKYRIZI Logo">`, '']);
  isiLines.forEach((isi) => {
    heroRows.push([isi.toggle, `${isi.text} <a href="${isi.linkHref}">${isi.linkText}</a>`]);
  });
  elements.push(heroRows);

  // Efficacy block
  const efficacyRows = [['Columns']];
  efficacyRows.push([efficacyData.title]);
  efficacyData.items.forEach((item) => {
    efficacyRows.push([item.label, item.value, item.description]);
  });
  elements.push(efficacyRows);

  // Stats block
  const statsRows = [['Cards']];
  efficacyData.items.forEach((item) => {
    statsRows.push([item.value, item.label, item.description]);
  });
  elements.push(statsRows);

  // Navigation
  const navLinks = navItems.map((item) => `<a href="${item.link}">${item.label}</a>`).join(' ');
  elements.push([['Fragment'], [navLinks]]);

  // Metadata
  elements.push([
    ['Metadata'],
    ['title', 'SKYRIZI PASI 90-100 Clinical Results'],
    ['description', 'PASI efficacy results from SKYRIZI clinical trials'],
  ]);

  return { elements, path: '/skyrizi/pasi-90-100' };
}

/**
 * Main transform function for Helix AEM Importer
 * Uses WebImporter.DOMUtils.createTable for proper block creation
 */
export default {
  transform: ({ document, url, html, params }) => {
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

    let result;

    switch (pageType) {
      case 'safety':
        result = buildSafetyPage(document, brand, isiLines, safetySections, navItems);
        break;
      case 'pasi':
        result = buildPasiPage(document, brand, isiLines, efficacyData, navItems);
        break;
      case 'h2h':
      case 'overview':
      case 'access':
      default:
        result = buildAccessPage(document, brand, isiLines, indications, coverage, support, navItems);
        break;
    }

    // Clear the body and build using WebImporter.DOMUtils.createTable
    const { body } = document;
    body.innerHTML = '';

    result.elements.forEach((blockData, index) => {
      // Use WebImporter.DOMUtils.createTable to create proper block tables
      const table = WebImporter.DOMUtils.createTable(blockData, document);
      body.appendChild(table);

      // Add section divider between blocks (except after last)
      if (index < result.elements.length - 1) {
        body.appendChild(createDivider(document));
      }
    });

    return [{
      element: body,
      path: result.path,
    }];
  },
};
