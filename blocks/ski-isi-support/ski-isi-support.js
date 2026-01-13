/**
 * SKI ISI Support Block
 * Displays patient support program cards
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  const container = document.createElement('div');
  container.className = 'ski-isi-support-container';

  // Title from first row
  if (rows[0]) {
    const titleSection = document.createElement('div');
    titleSection.className = 'support-header';
    titleSection.innerHTML = `
      <span class="support-title">${rows[0].querySelector('div')?.textContent?.trim() || ''}</span>
      <span class="support-program">SKYRIZI Complete<sup>&reg;</sup></span>
    `;
    container.appendChild(titleSection);
  }

  // Cards grid
  const cardsGrid = document.createElement('div');
  cardsGrid.className = 'support-cards-grid';

  const iconMap = {
    '$5': '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><text x="12" y="16" text-anchor="middle" font-size="10" fill="currentColor">$5</text></svg>',
    'support': '<svg viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/></svg>',
    'bridge': '<svg viewBox="0 0 24 24" fill="none"><path d="M6 21H3v-2h2v-3H3v-2h2V7H3V5h3c1.1 0 2 .9 2 2v1h8V7c0-1.1.9-2 2-2h3v2h-2v7h2v2h-2v3h2v2h-3c-1.1 0-2-.9-2-2v-1H8v1c0 1.1-.9 2-2 2z" fill="currentColor"/></svg>',
  };

  rows.slice(1, -2).forEach((row) => {
    const cols = [...row.querySelectorAll(':scope > div')];
    if (cols.length >= 2) {
      const iconKey = cols[0]?.textContent?.trim() || '';
      const content = cols[1]?.innerHTML || '';

      const card = document.createElement('div');
      card.className = 'support-card';

      const iconHtml = iconMap[iconKey] || `<span class="icon-text">${iconKey}</span>`;

      card.innerHTML = `
        <div class="card-icon">${iconHtml}</div>
        <div class="card-content">${content}</div>
      `;
      cardsGrid.appendChild(card);
    }
  });

  container.appendChild(cardsGrid);

  // CTA button from second to last row
  const ctaRow = rows[rows.length - 2];
  if (ctaRow) {
    const link = ctaRow.querySelector('a');
    if (link) {
      const cta = document.createElement('div');
      cta.className = 'support-cta';
      cta.innerHTML = `<a href="${link.href}" class="cta-button">${link.textContent}</a>`;
      container.appendChild(cta);
    }
  }

  // Footnotes from last row
  const footnoteRow = rows[rows.length - 1];
  if (footnoteRow && !footnoteRow.querySelector('a')) {
    const footnote = document.createElement('div');
    footnote.className = 'support-footnotes';
    footnote.innerHTML = footnoteRow.querySelector('div')?.innerHTML || '';
    container.appendChild(footnote);
  }

  block.textContent = '';
  block.appendChild(container);
}
