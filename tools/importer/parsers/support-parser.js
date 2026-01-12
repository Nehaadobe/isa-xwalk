/**
 * SKI ISA Support Block Parser
 * Extracts support program cards and CTA from the page
 */

/**
 * Extract text content safely from an element
 */
function getText(el) {
  return el?.textContent?.trim() || '';
}

/**
 * Extract support cards from page
 */
export function extractSupport(document) {
  const support = {
    title: '',
    programName: 'SKYRIZI Complete',
    cards: [],
    cta: { label: 'FIND OUT MORE', link: '/skyrizi-complete' },
    footnotes: '',
  };

  // Extract title
  const titleEl = document.querySelector('[class*="support"] h2, [class*="support-title"]');
  support.title = getText(titleEl) || 'Encourage your patients to enroll in';

  // Extract cards
  const cardEls = document.querySelectorAll('[class*="support"] [class*="card"], [class*="support-card"]');
  cardEls.forEach((card) => {
    const title = getText(card.querySelector('h4, h5, .title, [class*="title"]'));
    const description = getText(card.querySelector('p, .description, [class*="desc"]'));

    if (title) {
      support.cards.push({ title: title.toUpperCase(), description: description || '' });
    }
  });

  // Default cards if none found
  if (support.cards.length === 0) {
    support.cards = [
      { title: 'AFFORDABILITY', description: 'Eligible commercially insured patients may pay as little as $5 per quarterly dose§' },
      { title: 'ONE-TO-ONE SUPPORT', description: 'Insurance Specialists to help navigate insurance and Nurse Ambassadors∥ to help patients start and stay on therapy' },
      { title: 'BRIDGE PROGRAM ELIGIBILITY', description: 'No-cost product available for eligible patients in the event of a denial in coverage due to step-therapy requirement¶' },
    ];
  }

  // Extract CTA
  const ctaEl = document.querySelector('[class*="support"] a[class*="btn"], [class*="support"] .cta a');
  if (ctaEl) {
    support.cta = { label: getText(ctaEl), link: ctaEl.href || '/skyrizi-complete' };
  }

  // Extract footnotes
  const footnotesEl = document.querySelector('[class*="support"] [class*="footnote"]');
  support.footnotes = getText(footnotesEl) || '‡Advanced systemics inclusive of phosphodiesterase-4 (PDE4) inhibitors, Janus kinase (JAK) inhibitors, or biologics. ∥Nurse Ambassadors are provided by AbbVie and do not provide medical advice or work under the direction of the prescribing health care professional (HCP). They are trained to direct patients to speak with their HCP about any treatment-related questions, including further referrals.';

  return support;
}

/**
 * Create Support block table rows
 */
export function createSupportBlock(support) {
  const supportRows = [
    [support.title, ''],
  ];

  // Card icon identifiers for the first column
  const cardIcons = ['$5', 'support', 'bridge'];
  support.cards.forEach((card, idx) => {
    supportRows.push([cardIcons[idx] || '', `**${card.title}** ${card.description}`]);
  });

  supportRows.push([`<a href="${support.cta.link}">${support.cta.label}</a>`, '']);
  supportRows.push([support.footnotes, '']);

  return supportRows;
}

export default {
  extractSupport,
  createSupportBlock,
};
