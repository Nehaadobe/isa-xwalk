/**
 * SKI ISI Chart Block
 * Displays data visualizations and charts
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  const container = document.createElement('div');
  container.className = 'ski-isi-chart-container';

  // Title from first row
  if (rows[0]) {
    const title = document.createElement('h2');
    title.className = 'chart-title';
    title.innerHTML = rows[0].textContent.trim();
    container.appendChild(title);
  }

  // Chart visualization area
  const chartArea = document.createElement('div');
  chartArea.className = 'chart-area';

  // Create bars from data rows
  const barsWrapper = document.createElement('div');
  barsWrapper.className = 'chart-bars';

  rows.slice(1).forEach((row) => {
    const cols = [...row.querySelectorAll(':scope > div')];
    if (cols.length >= 2) {
      const label = cols[0]?.textContent?.trim() || '';
      const value = cols[1]?.textContent?.trim() || '';
      const color = cols[2]?.textContent?.trim() || '#10a4de';

      const numValue = parseInt(value.replace('%', ''), 10) || 0;

      const barGroup = document.createElement('div');
      barGroup.className = 'chart-bar-group';
      barGroup.innerHTML = `
        <div class="bar-label">${label}</div>
        <div class="bar-track">
          <div class="bar-fill" style="width: ${numValue}%; background: ${color};">
            <span class="bar-value">${value}</span>
          </div>
        </div>
      `;
      barsWrapper.appendChild(barGroup);
    }
  });

  chartArea.appendChild(barsWrapper);
  container.appendChild(chartArea);

  block.textContent = '';
  block.appendChild(container);
}
