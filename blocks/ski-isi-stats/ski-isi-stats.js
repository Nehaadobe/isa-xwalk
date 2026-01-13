/**
 * SKI ISI Stats Block
 * Displays statistical data with large percentage numbers
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  // Create stats container
  const statsContainer = document.createElement('div');
  statsContainer.className = 'ski-isi-stats-container';

  rows.forEach((row) => {
    const cols = [...row.querySelectorAll(':scope > div')];
    if (cols.length >= 2) {
      const statCard = document.createElement('div');
      statCard.className = 'ski-isi-stat-card';

      const value = cols[0]?.textContent?.trim() || '';
      const label = cols[1]?.innerHTML || '';
      const description = cols[2]?.innerHTML || '';

      // Check if value contains percentage
      const isPercentage = value.includes('%');
      const numValue = value.replace('%', '');

      statCard.innerHTML = `
        <div class="stat-value">${numValue}${isPercentage ? '<span class="percent">%</span>' : ''}</div>
        <div class="stat-label">${label}</div>
        ${description ? `<div class="stat-description">${description}</div>` : ''}
      `;

      statsContainer.appendChild(statCard);
    }
  });

  block.textContent = '';
  block.appendChild(statsContainer);
}
