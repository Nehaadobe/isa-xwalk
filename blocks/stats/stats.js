export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  // Create stats container
  const statsContainer = document.createElement('div');
  statsContainer.className = 'stats-container';

  rows.forEach((row, index) => {
    const cols = [...row.querySelectorAll(':scope > div')];

    if (index === 0 && cols.length >= 2) {
      // First row: Treatment stats
      const treatmentStat = document.createElement('div');
      treatmentStat.className = 'stat-item treatment';
      treatmentStat.innerHTML = `
        <span class="stat-label">${cols[0]?.textContent || ''}</span>
        <span class="stat-value">${cols[1]?.textContent || ''}</span>
        ${cols[2] ? `<span class="stat-ci">${cols[2].textContent}</span>` : ''}
      `;
      statsContainer.appendChild(treatmentStat);
    } else if (index === 1 && cols.length >= 2) {
      // Second row: VS divider
      const vsDivider = document.createElement('div');
      vsDivider.className = 'stat-vs';
      vsDivider.textContent = 'vs';
      statsContainer.appendChild(vsDivider);

      // Comparator stats
      const comparatorStat = document.createElement('div');
      comparatorStat.className = 'stat-item comparator';
      comparatorStat.innerHTML = `
        <span class="stat-label">${cols[0]?.textContent || ''}</span>
        <span class="stat-value">${cols[1]?.textContent || ''}</span>
        ${cols[2] ? `<span class="stat-ci">${cols[2].textContent}</span>` : ''}
      `;
      statsContainer.appendChild(comparatorStat);
    } else if (index === 2) {
      // Third row: Hazard ratio / p-value
      const hrStat = document.createElement('div');
      hrStat.className = 'stat-hr';
      hrStat.textContent = cols[0]?.textContent || '';
      statsContainer.appendChild(hrStat);
    }
  });

  block.textContent = '';
  block.appendChild(statsContainer);
}
