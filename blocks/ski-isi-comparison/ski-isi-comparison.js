/**
 * SKI ISI Comparison Block
 * Head-to-head comparison data display
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  // Create comparison container
  const container = document.createElement('div');
  container.className = 'ski-isi-comparison-container';

  // First row is typically the title
  const titleRow = rows[0];
  if (titleRow) {
    const title = document.createElement('h2');
    title.className = 'comparison-title';
    title.innerHTML = titleRow.textContent.trim();
    container.appendChild(title);
  }

  // Create comparison table
  const table = document.createElement('div');
  table.className = 'comparison-table';

  rows.slice(1).forEach((row, index) => {
    const cols = [...row.querySelectorAll(':scope > div')];
    const tableRow = document.createElement('div');
    tableRow.className = index === 0 ? 'comparison-row header' : 'comparison-row';

    cols.forEach((col, colIndex) => {
      const cell = document.createElement('div');
      cell.className = `comparison-cell ${colIndex === 0 ? 'label' : 'value'}`;
      cell.innerHTML = col.innerHTML;
      tableRow.appendChild(cell);
    });

    table.appendChild(tableRow);
  });

  container.appendChild(table);
  block.textContent = '';
  block.appendChild(container);
}
