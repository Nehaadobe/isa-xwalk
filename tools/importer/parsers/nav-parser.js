/**
 * SKI ISA Navigation Block Parser
 * Extracts navigation items from the page
 */

/**
 * Extract text content safely from an element
 */
function getText(el) {
  return el?.textContent?.trim() || '';
}

/**
 * Extract navigation items from page
 */
export function extractNavigation(document) {
  const navItems = [];

  // Look for navigation links
  const navEls = document.querySelectorAll('nav a, [class*="nav"] a, .navigation a');

  navEls.forEach((link) => {
    const label = getText(link);
    const href = link.getAttribute('href');
    const isActive = link.classList.contains('active') || link.getAttribute('aria-current') === 'page';

    if (label && href) {
      navItems.push({ label: label.toUpperCase(), link: href, active: isActive });
    }
  });

  // Default nav items if none found
  if (navItems.length === 0) {
    navItems.push(
      { label: 'OVERVIEW', link: '/overview' },
      { label: 'DRC', link: '/drc' },
      { label: 'JOINTS', link: '/joints' },
      { label: 'H2H/SWITCH DATA', link: '/h2h-switch-data' },
      { label: 'DOSING', link: '/dosing' },
      { label: 'SAFETY', link: '/safety' },
      { label: 'ACCESS', link: '/access', active: true },
      { label: 'SUMMARY', link: '/summary' },
    );
  }

  return navItems;
}

/**
 * Create Navigation block table rows
 */
export function createNavBlock(document, navItems) {
  const navLinks = navItems.map((item) => {
    const link = document.createElement('a');
    link.href = item.link;
    link.textContent = item.label;
    return link.outerHTML;
  }).join(' ');

  return [[navLinks]];
}

export default {
  extractNavigation,
  createNavBlock,
};
