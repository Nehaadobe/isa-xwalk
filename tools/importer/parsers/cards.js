/**
 * Cards Block Parser
 * Parses navigation cards from pharmaceutical presentations
 * Uses content mapping when buttons are image-based (no text content)
 */

export function parseCardsBlock(mainElement, document, viewContent = {}) {
  // If viewContent has buttons defined, skip cards block (buttons are in hero)
  if (viewContent.buttons && viewContent.buttons.length > 0) {
    return null;
  }

  // Look for navigation sections with buttons
  const navSections = mainElement.querySelectorAll('nav[data-set-size]');

  if (!navSections.length) return null;

  const block = {
    name: 'Cards',
    rows: [],
  };

  navSections.forEach((nav) => {
    const buttons = nav.querySelectorAll('button[data-goto-view]');

    buttons.forEach((button) => {
      const targetView = button.dataset.gotoView;
      // Clean view name (remove gotoSlide params)
      const cleanView = targetView?.split(',')[0] || '';
      const buttonText = button.textContent.trim() || extractViewName(cleanView);

      if (cleanView) {
        block.rows.push([buttonText, `/venclexta/${cleanView}`]);
      }
    });
  });

  return block.rows.length > 0 ? block : null;
}

/**
 * Extract human-readable name from view ID
 */
function extractViewName(viewId) {
  if (!viewId) return '';

  // Convert kebab-case to Title Case
  return viewId
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Parse card items from structured navigation
 */
export function parseNavigationCards(navElements) {
  const cards = [];

  navElements.forEach((nav) => {
    const title = nav.querySelector('.card-title, h3, h4')?.textContent || '';
    const link = nav.querySelector('a')?.href || nav.dataset.gotoView || '';
    const image = nav.querySelector('img')?.src || '';

    if (title || link) {
      cards.push({ title, link, image });
    }
  });

  return cards;
}
