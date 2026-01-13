/**
 * SKI ISA Hero Block Parser
 * Extracts brand info and ISI (Important Safety Information) from the page
 */

/**
 * Extract text content safely from an element
 */
function getText(el) {
  return el?.textContent?.trim() || '';
}

/**
 * Extract brand info from the page
 */
export function extractBrandInfo(document) {
  const logo = document.querySelector('.brand-logo img, .logo img, [class*="logo"] img');
  const subtitle = document.querySelector('.brand-subtitle, [class*="subtitle"]');

  return {
    name: 'SKYRIZI',
    subtitle: getText(subtitle) || '(risankizumab-rzaa)',
    logo: logo?.src || '/content/skyrizi/images/logo-skyrizi.svg',
  };
}

/**
 * Extract ISI (Important Safety Information) lines from page
 */
export function extractISILines(document) {
  const isiLines = [];

  // Look for ISI toggle elements
  const isiToggles = document.querySelectorAll('[class*="isi-toggle"], [class*="tap-here"], .topbar-line');

  isiToggles.forEach((toggle) => {
    const toggleText = getText(toggle.querySelector('button, .toggle')) || 'Tap here';
    const content = toggle.querySelector('.isi-content, .content, span:not(.toggle)');
    const link = toggle.querySelector('a');

    isiLines.push({
      toggle: toggleText,
      text: getText(content) || '',
      linkText: getText(link) || 'See accompanying Full Prescribing Information',
      linkHref: link?.href || '',
    });
  });

  // Default ISI lines if none found
  if (isiLines.length === 0) {
    isiLines.push({
      toggle: 'Tap here',
      text: 'for SKYRIZI Indications and additional Important Safety Information.',
      linkText: 'See accompanying Full Prescribing Information',
      linkHref: 'https://www.rxabbvie.com/pdf/skyrizi_pi.pdf',
    });
    isiLines.push({
      toggle: 'Tap here',
      text: 'for HUMIRA Indications and Important Safety Information, including BOXED WARNING on Serious Infections and Malignancy.',
      linkText: 'See accompanying Full Prescribing Information',
      linkHref: 'https://www.rxabbvie.com/pdf/humira.pdf',
    });
  }

  return isiLines;
}

/**
 * Create Hero block table rows
 */
export function createHeroBlock(document, brand, isiLines) {
  const heroImg = document.createElement('img');
  heroImg.src = brand.logo;
  heroImg.alt = 'SKYRIZI Logo';

  const heroRows = [[heroImg, '']];
  isiLines.forEach((isi) => {
    const isiText = `${isi.text} <a href="${isi.linkHref}">${isi.linkText}</a>`;
    heroRows.push([isi.toggle, isiText]);
  });

  return heroRows;
}

export default {
  extractBrandInfo,
  extractISILines,
  createHeroBlock,
};
