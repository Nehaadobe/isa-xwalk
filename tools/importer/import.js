/*
 * SKYRIZI Site Import Script for Helix AEM Importer
 * Extracts content from live SKYRIZI pages and converts to AEM Edge Delivery Services
 * Uses default content approach to avoid model validation errors
 */

/**
 * Helper: Get text content from element
 */
function getText(el) {
  return el?.textContent?.trim() || '';
}

/**
 * Helper: Get innerHTML from element
 */
function getHTML(el) {
  return el?.innerHTML?.trim() || '';
}

/**
 * Extract brand/logo info from page
 */
function extractBrandInfo(document) {
  const logo = document.querySelector('img[alt*="Skyrizi"], img[alt*="SKYRIZI"], .logo img, header img');

  return {
    name: 'SKYRIZI',
    subtitle: '(risankizumab-rzaa)',
    logo: logo?.src || '',
  };
}

/**
 * Extract indications from page
 */
function extractIndications(document) {
  const indications = [];

  const headings = document.querySelectorAll('h3');
  headings.forEach((h3) => {
    const headingText = getText(h3);
    const nextP = h3.nextElementSibling;

    if (headingText.includes('Plaque Psoriasis') && nextP) {
      indications.push({
        condition: 'Plaque Psoriasis:',
        description: getText(nextP),
      });
    } else if (headingText.includes('Psoriatic Arthritis') && nextP) {
      indications.push({
        condition: 'Psoriatic Arthritis:',
        description: getText(nextP),
      });
    } else if (headingText.includes('Crohn') && nextP) {
      indications.push({
        condition: "Crohn's Disease:",
        description: getText(nextP),
      });
    }
  });

  if (indications.length === 0) {
    const strongEls = document.querySelectorAll('strong, b');
    strongEls.forEach((strong) => {
      const text = getText(strong);
      const parent = strong.parentElement;
      if (text.includes('Plaque Psoriasis') || text.includes('Psoriatic Arthritis') || text.includes('Crohn')) {
        const fullText = getText(parent);
        const description = fullText.replace(text, '').trim();
        indications.push({
          condition: text,
          description,
        });
      }
    });
  }

  return indications;
}

/**
 * Extract coverage statistics from page
 */
function extractCoverage(document) {
  const coverage = {
    title: '',
    stats: [],
    footnote: '',
  };

  const headlines = document.querySelectorAll('h2');
  headlines.forEach((h2) => {
    const text = getText(h2);
    if (text.toLowerCase().includes('coverage') || text.toLowerCase().includes('preferred')) {
      coverage.title = text;
    }
  });

  const statContainers = document.querySelectorAll('[class*="stat"], [class*="coverage"]');
  statContainers.forEach((container) => {
    const text = container.textContent;

    if ((text.includes('Commercial') || text.includes('commercial')) && !coverage.stats.find((s) => s.label === 'Commercial')) {
      const percentMatch = text.match(/(\d{2,3})%?/);
      if (percentMatch) {
        coverage.stats.push({
          label: 'Commercial',
          value: `${percentMatch[1]}%`,
          description: 'PREFERRED COVERAGE',
        });
      }
    }

    if ((text.includes('Medicare') || text.includes('Part D')) && !coverage.stats.find((s) => s.label.includes('Medicare'))) {
      const percentMatch = text.match(/(\d{2,3})%?/);
      if (percentMatch) {
        coverage.stats.push({
          label: 'Medicare Part D',
          value: `${percentMatch[1]}%`,
          description: 'PREFERRED COVERAGE',
        });
      }
    }
  });

  return coverage;
}

/**
 * Extract support program info from page
 */
function extractSupport(document) {
  const support = {
    title: '',
    cards: [],
    cta: { label: '', link: '' },
  };

  const h2Els = document.querySelectorAll('h2');
  h2Els.forEach((h2) => {
    const text = getText(h2).toLowerCase();
    if (text.includes('encourage') || text.includes('enroll')) {
      support.title = getText(h2);
    }
  });

  const cardHeadings = document.querySelectorAll('h5, h4');
  cardHeadings.forEach((heading) => {
    const text = getText(heading).toUpperCase();
    const parent = heading.parentElement;
    const description = parent?.querySelector('p');

    if (text.includes('AFFORDABILITY') && !support.cards.find((c) => c.title.includes('AFFORDABILITY'))) {
      support.cards.push({
        title: 'AFFORDABILITY',
        description: getText(description) || '',
      });
    } else if ((text.includes('ONE-TO-ONE') || text.includes('SUPPORT')) && !support.cards.find((c) => c.title.includes('SUPPORT'))) {
      support.cards.push({
        title: 'ONE-TO-ONE SUPPORT',
        description: getText(description) || '',
      });
    } else if (text.includes('BRIDGE') && !support.cards.find((c) => c.title.includes('BRIDGE'))) {
      support.cards.push({
        title: 'BRIDGE PROGRAM ELIGIBILITY',
        description: getText(description) || '',
      });
    }
  });

  return support;
}

/**
 * Extract safety information from page
 */
function extractSafetyInfo(document) {
  const sections = [];

  const safetyHeadings = document.querySelectorAll('h2, h3');
  safetyHeadings.forEach((heading) => {
    const text = getText(heading);
    const nextEl = heading.nextElementSibling;

    if (text.includes('Hypersensitivity') || text.includes('Infection')
        || text.includes('Tuberculosis') || text.includes('Hepatotoxicity')
        || text.includes('Vaccines') || text.includes('Adverse')
        || text.includes('CONTRAINDICATIONS')) {
      sections.push({
        heading: text,
        content: getText(nextEl) || '',
      });
    }
  });

  return sections;
}

/**
 * Detect page type from URL
 */
function detectPageType(url) {
  const urlLower = url.toLowerCase();
  if (urlLower.includes('access')) return 'access';
  if (urlLower.includes('h2h') || urlLower.includes('head-to-head') || urlLower.includes('switch')) return 'h2h';
  if (urlLower.includes('overview')) return 'overview';
  if (urlLower.includes('pasi') || urlLower.includes('efficacy')) return 'pasi';
  if (urlLower.includes('safety')) return 'safety';
  if (urlLower.includes('dosing')) return 'dosing';
  return 'access';
}

/**
 * Main transform function for Helix AEM Importer
 * Uses default content (headings, paragraphs) instead of block tables
 * to avoid model validation errors
 */
export default {
  transform: ({ document, url }) => {
    console.log('[SKYRIZI IMPORT] Transform called with URL:', url);

    const pageType = detectPageType(url);
    const brand = extractBrandInfo(document);
    const indications = extractIndications(document);
    const coverage = extractCoverage(document);
    const support = extractSupport(document);
    const safetySections = extractSafetyInfo(document);

    console.log('[SKYRIZI IMPORT] Extracted:', {
      pageType,
      indicationsCount: indications.length,
      coverageStatsCount: coverage.stats.length,
      supportCardsCount: support.cards.length,
      safetySectionsCount: safetySections.length,
    });

    // Build page using default content elements (no block tables)
    const { body } = document;
    body.innerHTML = '';

    // Hero section - using default content
    const heroSection = document.createElement('div');
    if (brand.logo) {
      const img = document.createElement('img');
      img.src = brand.logo;
      img.alt = 'SKYRIZI Logo';
      heroSection.appendChild(img);
    }
    const h1 = document.createElement('h1');
    h1.textContent = 'SKYRIZI';
    heroSection.appendChild(h1);
    const subtitle = document.createElement('p');
    subtitle.textContent = brand.subtitle;
    heroSection.appendChild(subtitle);
    body.appendChild(heroSection);

    body.appendChild(document.createElement('hr'));

    // Indications section
    if (indications.length > 0) {
      const indSection = document.createElement('div');
      const indTitle = document.createElement('h2');
      indTitle.textContent = 'Indications';
      indSection.appendChild(indTitle);

      indications.forEach((ind) => {
        const p = document.createElement('p');
        const strong = document.createElement('strong');
        strong.textContent = ind.condition;
        p.appendChild(strong);
        p.appendChild(document.createTextNode(' ' + ind.description));
        indSection.appendChild(p);
      });

      const piLink = document.createElement('p');
      const a = document.createElement('a');
      a.href = 'https://www.rxabbvie.com/pdf/skyrizi_pi.pdf';
      a.textContent = 'Please see Full Prescribing Information.';
      piLink.appendChild(a);
      indSection.appendChild(piLink);

      body.appendChild(indSection);
      body.appendChild(document.createElement('hr'));
    }

    // Coverage section
    if (coverage.stats.length > 0) {
      const covSection = document.createElement('div');
      if (coverage.title) {
        const covTitle = document.createElement('h2');
        covTitle.textContent = coverage.title;
        covSection.appendChild(covTitle);
      }

      coverage.stats.forEach((stat) => {
        const statDiv = document.createElement('div');
        const label = document.createElement('h3');
        label.textContent = stat.label;
        statDiv.appendChild(label);
        const value = document.createElement('p');
        value.innerHTML = `<strong>${stat.value}</strong> ${stat.description}`;
        statDiv.appendChild(value);
        covSection.appendChild(statDiv);
      });

      body.appendChild(covSection);
      body.appendChild(document.createElement('hr'));
    }

    // Support section
    if (support.cards.length > 0) {
      const supSection = document.createElement('div');
      if (support.title) {
        const supTitle = document.createElement('h2');
        supTitle.textContent = support.title;
        supSection.appendChild(supTitle);
      }

      support.cards.forEach((card) => {
        const cardDiv = document.createElement('div');
        const cardTitle = document.createElement('h3');
        cardTitle.textContent = card.title;
        cardDiv.appendChild(cardTitle);
        if (card.description) {
          const cardDesc = document.createElement('p');
          cardDesc.textContent = card.description;
          cardDiv.appendChild(cardDesc);
        }
        supSection.appendChild(cardDiv);
      });

      body.appendChild(supSection);
      body.appendChild(document.createElement('hr'));
    }

    // Safety section (for safety pages)
    if (safetySections.length > 0 && pageType === 'safety') {
      const safetySection = document.createElement('div');
      const safetyTitle = document.createElement('h2');
      safetyTitle.textContent = 'Important Safety Information';
      safetySection.appendChild(safetyTitle);

      safetySections.forEach((section) => {
        const secHeading = document.createElement('h3');
        secHeading.textContent = section.heading;
        safetySection.appendChild(secHeading);
        if (section.content) {
          const secContent = document.createElement('p');
          secContent.textContent = section.content;
          safetySection.appendChild(secContent);
        }
      });

      body.appendChild(safetySection);
    }

    // Metadata table - this is required and should work
    const metaTable = WebImporter.DOMUtils.createTable([
      ['Metadata'],
      ['title', `SKYRIZI ${pageType.charAt(0).toUpperCase() + pageType.slice(1)}`],
      ['description', `SKYRIZI ${pageType} information for healthcare professionals`],
    ], document);
    body.appendChild(metaTable);

    // Determine path based on page type
    let path = '/skyrizi/access';
    switch (pageType) {
      case 'safety':
        path = '/skyrizi/safety';
        break;
      case 'pasi':
        path = '/skyrizi/pasi-90-100';
        break;
      case 'h2h':
        path = '/skyrizi/h2h';
        break;
      case 'overview':
        path = '/skyrizi/overview';
        break;
      default:
        path = '/skyrizi/access';
    }

    return [{
      element: body,
      path,
    }];
  },
};
