/**
 * SKI ISI Indications Block
 * Displays medical indications list
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  const container = document.createElement('div');
  container.className = 'ski-isi-indications-container';

  // Title from first row
  if (rows[0]) {
    const title = document.createElement('h2');
    title.className = 'indications-title';
    title.textContent = rows[0].querySelector('div')?.textContent?.trim() || 'INDICATIONS';
    container.appendChild(title);
  }

  // Indications list
  const list = document.createElement('div');
  list.className = 'indications-list';

  rows.slice(1, -1).forEach((row) => {
    const cols = [...row.querySelectorAll(':scope > div')];
    if (cols.length >= 2) {
      const condition = cols[0]?.textContent?.trim() || '';
      const description = cols[1]?.innerHTML || '';

      if (condition && description) {
        const item = document.createElement('div');
        item.className = 'indication-item';
        item.innerHTML = `
          <strong class="indication-condition">${condition}</strong>
          <span class="indication-description">${description}</span>
        `;
        list.appendChild(item);
      }
    }
  });

  container.appendChild(list);

  // PI link from last row
  const lastRow = rows[rows.length - 1];
  if (lastRow) {
    const piLink = document.createElement('div');
    piLink.className = 'indications-pi-link';
    piLink.innerHTML = lastRow.querySelector('div')?.innerHTML || '';
    container.appendChild(piLink);
  }

  block.textContent = '';
  block.appendChild(container);
}
