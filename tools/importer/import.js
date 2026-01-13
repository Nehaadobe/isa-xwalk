/*
 * SKYRIZI Site Import Script for Helix AEM Importer
 * Extracts content from live SKYRIZI pages and converts to AEM Edge Delivery Services
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
 * Helper: Create section divider
 */
function createDivider(doc) {
  return doc.createElement('hr');
}

/**
 * Extract brand/logo info from page
 */
function extractBrandInfo(document) {
  // Look for SKYRIZI logo
  const logo = document.querySelector('img[alt*="Skyrizi"], img[alt*="SKYRIZI"], .logo img, header img');

  return {
    name: 'SKYRIZI',
    subtitle: '(risankizumab-rzaa)',
    logo: logo?.src || '',
  };
}

/**
 * Extract ISI toggle lines from page header
 */
function extractISILines(document) {
  const isiLines = [];

  // Look for ISI toggle text in the live site structure
  const isiContainer = document.querySelector('[class*="isi"], [class*="topbar"], .safety-info');

  if (isiContainer) {
    // Extract SKYRIZI ISI line
    const skyriziText = isiContainer.textContent;
    if (skyriziText.includes('SKYRIZI')) {
      const skyriziMatch = skyriziText.match(/Tap here.*?(?=Tap here|$)/i);
      if (skyriziMatch) {
        isiLines.push({
          toggle: 'Tap here',
          text: 'for SKYRIZI Indications and additional Important Safety Information.',
          linkText: 'See Full Prescribing Information',
          linkHref: 'https://www.rxabbvie.com/pdf/skyrizi_pi.pdf',
        });
      }
    }

    // Extract HUMIRA ISI line if present
    if (skyriziText.includes('HUMIRA')) {
      isiLines.push({
        toggle: 'Tap here',
        text: 'for HUMIRA Indications and Important Safety Information, including BOXED WARNING.',
        linkText: 'See Full Prescribing Information',
        linkHref: 'https://www.rxabbvie.com/pdf/humira.pdf',
      });
    }
  }

  // Extract from list items if structured that way
  const listItems = document.querySelectorAll('li p, [class*="isi"] p');
  listItems.forEach((item) => {
    const text = getText(item);
    if (text.includes('Tap here') && text.includes('SKYRIZI')) {
      const link = item.querySelector('a');
      isiLines.push({
        toggle: 'Tap here',
        text: text.replace('Tap here', '').replace(getText(link), '').trim(),
        linkText: getText(link) || 'See Full Prescribing Information',
        linkHref: link?.href || 'https://www.rxabbvie.com/pdf/skyrizi_pi.pdf',
      });
    }
  });

  return isiLines;
}

/**
 * Extract indications from page
 */
function extractIndications(document) {
  const indications = [];

  // Look for indication sections in the ISI modal or main content
  const indicationSections = document.querySelectorAll('[class*="indication"], h3 + p, dt + dd');

  // Try to find structured indication content
  const psoriasisEl = document.querySelector('h3:contains("Plaque Psoriasis"), [class*="plaque"]');
  const psoriaticEl = document.querySelector('h3:contains("Psoriatic Arthritis"), [class*="psoriatic"]');
  const crohnEl = document.querySelector('h3:contains("Crohn"), [class*="crohn"]');

  // Extract from heading + paragraph pairs
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

  // Alternative: look for strong + text patterns
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
          description: description,
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
    tabs: [],
    stats: [],
    footnote: '',
  };

  // Extract main headline
  const headline = document.querySelector('h2[class*="headline"], h2, [class*="coverage"] h2');
  if (headline) {
    coverage.title = getText(headline);
  }

  // Extract tabs
  const tabEls = document.querySelectorAll('[class*="tab"], [role="tab"]');
  tabEls.forEach((tab) => {
    const text = getText(tab);
    if (text && !coverage.tabs.includes(text)) {
      coverage.tabs.push(text);
    }
  });

  // Extract coverage stats (99%, 97%)
  // Look for percentage values with labels
  const statContainers = document.querySelectorAll('[class*="stat"], [class*="coverage"]');
  statContainers.forEach((container) => {
    const text = container.textContent;

    // Look for Commercial stat
    if (text.includes('Commercial') || text.includes('commercial')) {
      const percentMatch = text.match(/(\d{2,3})%?/);
      if (percentMatch) {
        coverage.stats.push({
          label: 'Commercial',
          value: percentMatch[1],
          description: 'PREFERRED COVERAGE<sup>2</sup>*†',
        });
      }
    }

    // Look for Medicare stat
    if (text.includes('Medicare') || text.includes('Part D')) {
      const percentMatch = text.match(/(\d{2,3})%?/);
      if (percentMatch && !coverage.stats.find(s => s.label.includes('Medicare'))) {
        coverage.stats.push({
          label: 'Medicare Part D',
          value: percentMatch[1],
          description: 'PREFERRED COVERAGE<sup>2</sup>*†',
        });
      }
    }
  });

  // Alternative: look for h1 headings with percentages
  const h1Els = document.querySelectorAll('h1');
  h1Els.forEach((h1) => {
    const text = getText(h1).toLowerCase();
    const parent = h1.parentElement;
    const siblingText = parent?.textContent || '';

    if (text.includes('commercial') && !coverage.stats.find(s => s.label === 'Commercial')) {
      const percentMatch = siblingText.match(/(\d{2,3})%?/);
      if (percentMatch) {
        coverage.stats.push({
          label: 'Commercial',
          value: percentMatch[1],
          description: 'PREFERRED COVERAGE<sup>2</sup>*†',
        });
      }
    }

    if (text.includes('medicare') && !coverage.stats.find(s => s.label.includes('Medicare'))) {
      const percentMatch = siblingText.match(/(\d{2,3})%?/);
      if (percentMatch) {
        coverage.stats.push({
          label: 'Medicare Part D',
          value: percentMatch[1],
          description: 'PREFERRED COVERAGE<sup>2</sup>*†',
        });
      }
    }
  });

  // Extract footnote/disclaimer
  const footnoteEl = document.querySelector('[class*="footnote"], [class*="disclaimer"], .preferred-coverage');
  if (footnoteEl) {
    coverage.footnote = getText(footnoteEl);
  }

  // Extract "Preferred coverage means" text
  const preferredEl = document.querySelector('h2:contains("Preferred"), [class*="preferred"]');
  if (preferredEl) {
    const list = preferredEl.parentElement?.querySelector('ul, ol');
    if (list) {
      const items = [...list.querySelectorAll('li')].map(li => getText(li));
      coverage.footnote = `**Preferred coverage means SKYRIZI is AVAILABLE:** ${items.join(' ')}`;
    }
  }

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
    footnotes: '',
  };

  // Extract "Encourage your patients" title
  const titleEl = document.querySelector('h2:contains("Encourage"), h2:contains("enroll")');
  if (titleEl) {
    support.title = getText(titleEl);
  } else {
    // Look for any h2 near support content
    const h2Els = document.querySelectorAll('h2');
    h2Els.forEach((h2) => {
      if (getText(h2).toLowerCase().includes('encourage') || getText(h2).toLowerCase().includes('enroll')) {
        support.title = getText(h2);
      }
    });
  }

  // Extract support cards (Affordability, One-to-One, Bridge)
  const cardHeadings = document.querySelectorAll('h5, h4');
  cardHeadings.forEach((heading) => {
    const text = getText(heading).toUpperCase();
    const parent = heading.parentElement;
    const description = parent?.querySelector('p');

    if (text.includes('AFFORDABILITY')) {
      support.cards.push({
        icon: '$5',
        title: 'AFFORDABILITY',
        description: getText(description) || '',
      });
    } else if (text.includes('ONE-TO-ONE') || text.includes('SUPPORT')) {
      support.cards.push({
        icon: 'support',
        title: 'ONE-TO-ONE SUPPORT',
        description: getText(description) || '',
      });
    } else if (text.includes('BRIDGE')) {
      support.cards.push({
        icon: 'bridge',
        title: 'BRIDGE PROGRAM ELIGIBILITY',
        description: getText(description) || '',
      });
    }
  });

  // Extract CTA button
  const ctaEl = document.querySelector('a:contains("FIND OUT"), button:contains("FIND OUT"), [class*="cta"]');
  if (ctaEl) {
    support.cta = {
      label: getText(ctaEl),
      link: ctaEl.href || '/skyrizi-complete',
    };
  } else {
    // Look for any button/link with "find out more"
    const links = document.querySelectorAll('a, button');
    links.forEach((link) => {
      if (getText(link).toLowerCase().includes('find out')) {
        support.cta = {
          label: getText(link),
          link: link.href || '/skyrizi-complete',
        };
      }
    });
  }

  // Extract footnotes
  const footnoteEls = document.querySelectorAll('[class*="footnote"] p, sup + span');
  const footnotes = [];
  footnoteEls.forEach((el) => {
    const text = getText(el);
    if (text.length > 20) {
      footnotes.push(text);
    }
  });
  support.footnotes = footnotes.join(' ');

  return support;
}

/**
 * Extract navigation items from page
 */
function extractNavigation(document) {
  const navItems = [];

  // Look for bottom navigation
  const navContainer = document.querySelector('[class*="nav"], nav, footer');
  if (navContainer) {
    const navEls = navContainer.querySelectorAll('a, [role="link"], [class*="nav-item"]');
    navEls.forEach((el) => {
      const label = getText(el);
      const href = el.href || el.getAttribute('data-href') || '';

      if (label && label.length < 30 && !href.includes('pdf')) {
        navItems.push({
          label: label.toUpperCase(),
          link: href || `/${label.toLowerCase().replace(/\s+/g, '-')}`,
        });
      }
    });
  }

  // Alternative: look for specific nav text
  const navTexts = ['OVERVIEW', 'H2H', 'PASI', 'SAFETY', 'ACCESS', 'DOSING', 'SUMMARY'];
  const allEls = document.querySelectorAll('*');
  allEls.forEach((el) => {
    const text = getText(el).toUpperCase();
    navTexts.forEach((navText) => {
      if (text === navText && !navItems.find(n => n.label === navText)) {
        navItems.push({
          label: navText,
          link: `/content/skyrizi/${navText.toLowerCase().replace(/\s+/g, '-')}`,
        });
      }
    });
  });

  return navItems;
}

/**
 * Extract safety information from page
 */
function extractSafetyInfo(document) {
  const sections = [];

  // Look for safety sections in ISI modal
  const safetyHeadings = document.querySelectorAll('h2, h3');
  safetyHeadings.forEach((heading) => {
    const text = getText(heading);
    const nextEl = heading.nextElementSibling;

    if (text.includes('Hypersensitivity') || text.includes('Infection') ||
        text.includes('Tuberculosis') || text.includes('Hepatotoxicity') ||
        text.includes('Vaccines') || text.includes('Adverse') ||
        text.includes('CONTRAINDICATIONS')) {
      sections.push({
        heading: text,
        content: getText(nextEl) || '',
      });
    }
  });

  return sections;
}

/**
 * Extract efficacy/PASI data from page
 */
function extractEfficacyData(document) {
  const data = {
    title: '',
    items: [],
  };

  // Look for PASI response title
  const titleEl = document.querySelector('h2:contains("PASI"), [class*="efficacy"] h2');
  if (titleEl) {
    data.title = getText(titleEl);
  }

  // Look for PASI values
  const pasiLabels = ['PASI 75', 'PASI 90', 'PASI 100'];
  pasiLabels.forEach((label) => {
    const els = document.querySelectorAll('*');
    els.forEach((el) => {
      const text = getText(el);
      if (text.includes(label)) {
        const parent = el.parentElement;
        const percentMatch = parent?.textContent?.match(/(\d{2,3})%/);
        if (percentMatch) {
          data.items.push({
            label: label,
            value: `${percentMatch[1]}%`,
            description: `Patients achieving ${label}`,
          });
        }
      }
    });
  });

  return data;
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
 * Build Access page content
 */
function buildAccessPage(doc, brand, isiLines, indications, coverage, support, navItems) {
  const elements = [];

  // Hero block
  const heroRows = [['Hero']];
  if (brand.logo) {
    heroRows.push([`<img src="${brand.logo}" alt="SKYRIZI Logo">`, '']);
  }
  isiLines.forEach((isi) => {
    heroRows.push([isi.toggle, `${isi.text} <a href="${isi.linkHref}">${isi.linkText}</a>`]);
  });
  elements.push(heroRows);

  // Indications block
  if (indications.length > 0) {
    const indicationsRows = [['Cards']];
    indicationsRows.push(['INDICATIONS', '']);
    indications.forEach((ind) => {
      indicationsRows.push([ind.condition, ind.description]);
    });
    indicationsRows.push(['Please see <a href="https://www.rxabbvie.com/pdf/skyrizi_pi.pdf">Full Prescribing Information</a>.', '']);
    elements.push(indicationsRows);
  }

  // Coverage block
  if (coverage.stats.length > 0) {
    const coverageRows = [['Columns']];
    if (coverage.title) {
      coverageRows.push([coverage.title]);
    }
    if (coverage.tabs.length > 0) {
      coverageRows.push(coverage.tabs);
    }
    coverage.stats.forEach((stat) => {
      coverageRows.push([stat.label, `${stat.value}%`, stat.description]);
    });
    if (coverage.footnote) {
      coverageRows.push([coverage.footnote]);
    }
    elements.push(coverageRows);
  }

  // Support block
  if (support.cards.length > 0) {
    const supportRows = [['Cards']];
    if (support.title) {
      supportRows.push([support.title, '']);
    }
    support.cards.forEach((card) => {
      supportRows.push([card.icon, `**${card.title}** ${card.description}`]);
    });
    if (support.cta.label) {
      supportRows.push([`<a href="${support.cta.link}">${support.cta.label}</a>`, '']);
    }
    if (support.footnotes) {
      supportRows.push([support.footnotes, '']);
    }
    elements.push(supportRows);
  }

  // Navigation block
  if (navItems.length > 0) {
    const navLinks = navItems.map((item) => `<a href="${item.link}">${item.label}</a>`).join(' ');
    elements.push([['Fragment'], [navLinks]]);
  }

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
  if (brand.logo) {
    heroRows.push([`<img src="${brand.logo}" alt="SKYRIZI Logo">`, '']);
  }
  isiLines.forEach((isi) => {
    heroRows.push([isi.toggle, `${isi.text} <a href="${isi.linkHref}">${isi.linkText}</a>`]);
  });
  elements.push(heroRows);

  // Safety block
  if (safetySections.length > 0) {
    const safetyRows = [['Accordion']];
    safetyRows.push(['Important Safety Information', '']);
    safetySections.forEach((section) => {
      safetyRows.push([section.heading, section.content]);
    });
    elements.push(safetyRows);
  }

  // Navigation
  if (navItems.length > 0) {
    const navLinks = navItems.map((item) => `<a href="${item.link}">${item.label}</a>`).join(' ');
    elements.push([['Fragment'], [navLinks]]);
  }

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
  if (brand.logo) {
    heroRows.push([`<img src="${brand.logo}" alt="SKYRIZI Logo">`, '']);
  }
  isiLines.forEach((isi) => {
    heroRows.push([isi.toggle, `${isi.text} <a href="${isi.linkHref}">${isi.linkText}</a>`]);
  });
  elements.push(heroRows);

  // Efficacy block
  if (efficacyData.items.length > 0) {
    const efficacyRows = [['Columns']];
    if (efficacyData.title) {
      efficacyRows.push([efficacyData.title]);
    }
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
  }

  // Navigation
  if (navItems.length > 0) {
    const navLinks = navItems.map((item) => `<a href="${item.link}">${item.label}</a>`).join(' ');
    elements.push([['Fragment'], [navLinks]]);
  }

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
 * Extracts content from live site DOM - no hardcoded values
 */
export default {
  transform: ({ document, url, html, params }) => {
    // eslint-disable-next-line no-console
    console.log('[SKYRIZI IMPORT] Transform called with URL:', url);

    const pageType = detectPageType(url);

    // Extract all content from the live page DOM
    const brand = extractBrandInfo(document);
    const isiLines = extractISILines(document);
    const indications = extractIndications(document);
    const coverage = extractCoverage(document);
    const support = extractSupport(document);
    const navItems = extractNavigation(document);
    const safetySections = extractSafetyInfo(document);
    const efficacyData = extractEfficacyData(document);

    // Log extracted data for debugging
    console.log('[SKYRIZI IMPORT] Extracted:', {
      pageType,
      brand,
      isiLinesCount: isiLines.length,
      indicationsCount: indications.length,
      coverageStatsCount: coverage.stats.length,
      supportCardsCount: support.cards.length,
      navItemsCount: navItems.length,
      safetySectionsCount: safetySections.length,
      efficacyItemsCount: efficacyData.items.length,
    });

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
      case 'dosing':
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
