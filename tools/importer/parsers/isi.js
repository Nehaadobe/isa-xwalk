/**
 * ISI (Important Safety Information) Block Parser
 * Parses pharmaceutical safety information sections
 */

export function parseISIBlock(isiElement, document) {
  const block = {
    name: 'ISI',
    rows: [],
  };

  // Look for ISI content image (common in pharma presentations)
  const isiImage = isiElement.querySelector('img[data-src*="isi"], img[src*="isi"]');

  if (isiImage) {
    // For image-based ISI, we need to provide structure for manual text entry
    // This is common in regulated pharma content where ISI is rendered as images
    block.rows = getDefaultISISections();
    return block;
  }

  // Parse structured ISI content if available
  const sections = isiElement.querySelectorAll('.isi-section, [data-section]');

  sections.forEach((section) => {
    const title = section.querySelector('h3, h4, .section-title')?.textContent || '';
    const content = section.querySelector('.section-content, p')?.innerHTML || '';

    if (title || content) {
      block.rows.push([title, content]);
    }
  });

  // If no structured content found, use default sections
  if (block.rows.length === 0) {
    block.rows = getDefaultISISections();
  }

  return block;
}

/**
 * Default ISI sections for pharmaceutical products
 */
function getDefaultISISections() {
  return [
    ['Indication', ''],
    ['Contraindications', ''],
    ['Warnings and Precautions', ''],
    ['Adverse Reactions', ''],
    ['Drug Interactions', ''],
    ['Use in Specific Populations', ''],
  ];
}

/**
 * Parse indication text
 */
export function parseIndication(element) {
  const indicationSection = element.querySelector('[data-section="indication"], .indication');

  if (!indicationSection) return null;

  return {
    title: 'Indication',
    content: indicationSection.innerHTML || indicationSection.textContent,
  };
}

/**
 * Parse safety warnings
 */
export function parseSafetyWarnings(element) {
  const warnings = [];
  const warningElements = element.querySelectorAll('.warning, [data-warning]');

  warningElements.forEach((warning) => {
    const title = warning.querySelector('h4, .warning-title')?.textContent || '';
    const content = warning.querySelector('.warning-content, p')?.innerHTML || '';

    warnings.push({ title, content });
  });

  return warnings;
}
