/**
 * SKI ISI Coverage Block
 * Displays insurance coverage statistics with circular charts
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  const container = document.createElement('div');
  container.className = 'ski-isi-coverage-container';

  // Title from first row
  if (rows[0]) {
    const title = document.createElement('h2');
    title.className = 'coverage-title';
    title.innerHTML = rows[0].querySelector('div')?.innerHTML || rows[0].textContent.trim();
    container.appendChild(title);
  }

  // Tabs from second row
  if (rows[1]) {
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'coverage-tabs';
    const cols = [...rows[1].querySelectorAll(':scope > div')];
    cols.forEach((col, index) => {
      const tab = document.createElement('button');
      tab.className = `coverage-tab ${index === 0 ? 'active' : ''}`;
      tab.textContent = col.textContent.trim();
      tab.addEventListener('click', () => {
        tabsContainer.querySelectorAll('.coverage-tab').forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
      });
      tabsContainer.appendChild(tab);
    });
    container.appendChild(tabsContainer);
  }

  // Stats from remaining rows
  const statsGrid = document.createElement('div');
  statsGrid.className = 'coverage-stats-grid';

  rows.slice(2, -1).forEach((row) => {
    const cols = [...row.querySelectorAll(':scope > div')];
    if (cols.length >= 3) {
      const card = document.createElement('div');
      card.className = 'coverage-stat-card';

      const label = cols[0]?.textContent?.trim() || '';
      const rawValue = cols[1]?.textContent?.trim() || '';
      const desc = cols[2]?.innerHTML || '';

      // Parse percentage value
      const percentMatch = rawValue.match(/(\d+)/);
      const percentValue = percentMatch ? parseInt(percentMatch[1], 10) : 0;
      const hasPercent = rawValue.includes('%');

      // Create circular chart with SVG
      const svgSize = 160;
      const strokeWidth = 12;
      const radius = (svgSize - strokeWidth) / 2;
      const circumference = 2 * Math.PI * radius;
      const dashOffset = circumference - (percentValue / 100) * circumference;

      card.innerHTML = `
        <div class="stat-label">${label}</div>
        <div class="stat-value">
          <svg width="${svgSize}" height="${svgSize}" viewBox="0 0 ${svgSize} ${svgSize}">
            <circle
              cx="${svgSize / 2}"
              cy="${svgSize / 2}"
              r="${radius}"
              fill="none"
              stroke="#e8f4f8"
              stroke-width="${strokeWidth}"
            />
            <circle
              cx="${svgSize / 2}"
              cy="${svgSize / 2}"
              r="${radius}"
              fill="none"
              stroke="#10a4de"
              stroke-width="${strokeWidth}"
              stroke-linecap="round"
              stroke-dasharray="${circumference}"
              stroke-dashoffset="${dashOffset}"
              transform="rotate(-90 ${svgSize / 2} ${svgSize / 2})"
            />
          </svg>
          <span class="stat-number">${percentValue}${hasPercent ? '<sup class="percent">%</sup>' : ''}</span>
        </div>
        <div class="stat-desc">${desc}</div>
      `;
      statsGrid.appendChild(card);
    }
  });

  container.appendChild(statsGrid);

  // Footnote from last row
  const lastRow = rows[rows.length - 1];
  if (lastRow && rows.length > 3) {
    const footnote = document.createElement('div');
    footnote.className = 'coverage-footnote';
    footnote.innerHTML = lastRow.querySelector('div')?.innerHTML || lastRow.textContent;
    container.appendChild(footnote);
  }

  block.textContent = '';
  block.appendChild(container);
}
