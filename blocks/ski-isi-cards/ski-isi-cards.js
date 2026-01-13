/**
 * SKI ISI Cards Block
 * Display content in card grid layout
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  const container = document.createElement('div');
  container.className = 'ski-isi-cards-container';

  rows.forEach((row) => {
    const cols = [...row.querySelectorAll(':scope > div')];

    const card = document.createElement('div');
    card.className = 'ski-isi-card';

    // Check for image
    const picture = cols[0]?.querySelector('picture');
    const img = cols[0]?.querySelector('img');

    if (picture || img) {
      const imageWrapper = document.createElement('div');
      imageWrapper.className = 'card-image';
      imageWrapper.appendChild(picture ? picture.cloneNode(true) : img.cloneNode(true));
      card.appendChild(imageWrapper);

      // Content is in second column
      if (cols[1]) {
        const content = document.createElement('div');
        content.className = 'card-content';
        content.innerHTML = cols[1].innerHTML;
        card.appendChild(content);
      }
    } else {
      // No image - all content
      const content = document.createElement('div');
      content.className = 'card-content';
      cols.forEach((col) => {
        content.innerHTML += col.innerHTML;
      });
      card.appendChild(content);
    }

    container.appendChild(card);
  });

  block.textContent = '';
  block.appendChild(container);
}
