/**
 * SKI ISI Efficacy Block
 * Displays PASI efficacy results with visual bars
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  const container = document.createElement('div');
  container.className = 'ski-isi-efficacy-container';

  // Title from first row
  if (rows[0]) {
    const title = document.createElement('h2');
    title.className = 'efficacy-title';
    title.innerHTML = rows[0].textContent.trim();
    container.appendChild(title);
  }

  // Create efficacy bars
  const barsContainer = document.createElement('div');
  barsContainer.className = 'efficacy-bars';

  rows.slice(1).forEach((row) => {
    const cols = [...row.querySelectorAll(':scope > div')];
    if (cols.length >= 2) {
      const label = cols[0]?.textContent?.trim() || '';
      const value = cols[1]?.textContent?.trim() || '';
      const description = cols[2]?.innerHTML || '';

      const numValue = parseInt(value.replace('%', ''), 10) || 0;

      const barItem = document.createElement('div');
      barItem.className = 'efficacy-bar-item';
      barItem.innerHTML = `
        <div class="bar-label">${label}</div>
        <div class="bar-wrapper">
          <div class="bar-fill" style="width: ${numValue}%">
            <span class="bar-value">${value}</span>
          </div>
        </div>
        ${description ? `<div class="bar-description">${description}</div>` : ''}
      `;
      barsContainer.appendChild(barItem);
    }
  });

  container.appendChild(barsContainer);
  block.textContent = '';
  block.appendChild(container);
}
