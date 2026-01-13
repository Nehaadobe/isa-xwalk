/**
 * SKI ISI Safety Block
 * Displays important safety information sections
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  const container = document.createElement('div');
  container.className = 'ski-isi-safety-container';

  rows.forEach((row, index) => {
    const cols = [...row.querySelectorAll(':scope > div')];

    if (index === 0) {
      // Title row
      const title = document.createElement('h2');
      title.className = 'safety-section-title';
      title.innerHTML = cols[0]?.innerHTML || '';
      container.appendChild(title);
    } else if (cols.length >= 2) {
      // Content rows with heading and text
      const section = document.createElement('div');
      section.className = 'safety-section';

      const heading = cols[0]?.textContent?.trim() || '';
      const content = cols[1]?.innerHTML || '';

      if (heading) {
        section.innerHTML = `
          <h3 class="safety-heading">${heading}</h3>
          <div class="safety-content">${content}</div>
        `;
      } else {
        section.innerHTML = `<div class="safety-content">${content}</div>`;
      }

      container.appendChild(section);
    } else if (cols.length === 1) {
      // Single column - paragraph or list
      const section = document.createElement('div');
      section.className = 'safety-section';
      section.innerHTML = `<div class="safety-content">${cols[0]?.innerHTML || ''}</div>`;
      container.appendChild(section);
    }
  });

  block.textContent = '';
  block.appendChild(container);
}
