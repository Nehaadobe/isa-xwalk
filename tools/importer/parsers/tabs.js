/**
 * Tabs Block Parser
 * Parses tab-based navigation (e.g., AML/CLL indication switcher)
 */

export function parseTabsBlock(tabsContainer, document) {
  const block = {
    name: 'Tabs',
    rows: [],
  };

  // Look for indication-based tabs
  const indications = tabsContainer.querySelectorAll('[data-indication]');

  if (indications.length > 0) {
    indications.forEach((indication) => {
      const indicationType = indication.dataset.indication;
      const content = indication.innerHTML || '';

      block.rows.push([indicationType, content]);
    });

    return block;
  }

  // Look for button-based tabs
  const tabButtons = tabsContainer.querySelectorAll('button[data-goto-view*="aml"], button[data-goto-view*="cll"]');

  if (tabButtons.length > 0) {
    tabButtons.forEach((button) => {
      const tabName = button.textContent.trim() || button.dataset.gotoView;
      const targetView = button.dataset.gotoView || '';

      block.rows.push([tabName, targetView]);
    });

    return block;
  }

  // Generic tab parsing
  const genericTabs = tabsContainer.querySelectorAll('.tab, [role="tab"]');

  genericTabs.forEach((tab) => {
    const tabName = tab.textContent.trim() || tab.getAttribute('aria-label') || '';
    const tabPanel = document.querySelector(`[aria-labelledby="${tab.id}"]`);
    const content = tabPanel?.innerHTML || '';

    block.rows.push([tabName, content]);
  });

  return block.rows.length > 0 ? block : null;
}

/**
 * Parse indication tabs specifically
 */
export function parseIndicationTabs(container) {
  const tabs = [];

  // Common pharmaceutical indication patterns
  const indicationPatterns = ['aml', 'cll', 'mds', 'all', 'cml'];

  indicationPatterns.forEach((indication) => {
    const tabElement = container.querySelector(`[data-indication="${indication}"], #${indication}-tab, .${indication}-tab`);

    if (tabElement) {
      tabs.push({
        name: indication.toUpperCase(),
        element: tabElement,
        active: tabElement.classList.contains('active'),
      });
    }
  });

  return tabs;
}
