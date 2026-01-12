/**
 * SKI ISA Coverage Block Parser
 * Extracts coverage statistics and tabs from the page
 */

/**
 * Extract text content safely from an element
 */
function getText(el) {
  return el?.textContent?.trim() || '';
}

/**
 * Extract coverage stats from page
 */
export function extractCoverage(document) {
  const coverage = {
    title: '',
    tabs: ['Overview', 'National', 'Local'],
    stats: [],
    footnote: '',
  };

  // Extract title
  const titleEl = document.querySelector('[class*="coverage"] h2, [class*="coverage-title"]');
  coverage.title = getText(titleEl) || 'for Ps & PsA SKYRIZI Patients: Preferred NATIONAL Coverage & Exceptional Support';

  // Extract tabs
  const tabEls = document.querySelectorAll('[class*="coverage"] [class*="tab"], [class*="tab-button"]');
  if (tabEls.length > 0) {
    coverage.tabs = Array.from(tabEls).map((t) => getText(t));
  }

  // Extract stats
  const statEls = document.querySelectorAll('[class*="stat-card"], [class*="coverage-stat"]');
  statEls.forEach((stat) => {
    const label = getText(stat.querySelector('.label, h3, [class*="label"]'));
    const value = getText(stat.querySelector('.value, .percentage, [class*="number"]'))?.replace('%', '');
    const description = getText(stat.querySelector('.description, [class*="desc"]'));

    if (label && value) {
      coverage.stats.push({ label, value, description: description || 'PREFERRED COVERAGE<sup>2</sup>*†' });
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
  const footnoteEl = document.querySelector('[class*="coverage"] [class*="footnote"], [class*="coverage-benefits"]');
  coverage.footnote = getText(footnoteEl) || '**Preferred coverage means SKYRIZI is AVAILABLE:** With no advanced systemic failure required‡ At the lowest branded co-pay/coinsurance tier. National Commercial and Medicare Part D Formulary coverage under the pharmacy benefit as of December 2023.';

  return coverage;
}

/**
 * Create Coverage block table rows
 */
export function createCoverageBlock(coverage) {
  const coverageRows = [
    [coverage.title], // Single column for title
    coverage.tabs, // ['Overview', 'National', 'Local']
  ];

  coverage.stats.forEach((stat) => {
    coverageRows.push([stat.label, `${stat.value}%`, stat.description]);
  });

  coverageRows.push([coverage.footnote]); // Single column for footnote

  return coverageRows;
}

export default {
  extractCoverage,
  createCoverageBlock,
};
