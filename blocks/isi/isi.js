export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  // Create ISI structure
  const isiContainer = document.createElement('div');
  isiContainer.className = 'isi-container';

  // Create header with toggle
  const isiHeader = document.createElement('div');
  isiHeader.className = 'isi-header';

  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'isi-toggle';
  toggleBtn.setAttribute('aria-expanded', 'false');
  toggleBtn.innerHTML = '<span class="isi-toggle-icon"></span>';

  isiHeader.appendChild(toggleBtn);

  // Create content wrapper
  const isiContent = document.createElement('div');
  isiContent.className = 'isi-content';

  rows.forEach((row) => {
    const cols = [...row.querySelectorAll(':scope > div')];
    const sectionTitle = cols[0]?.textContent?.trim();
    const sectionContent = cols[1] || cols[0];

    const section = document.createElement('div');
    section.className = 'isi-section';

    if (cols.length > 1) {
      const title = document.createElement('h3');
      title.className = 'isi-section-title';
      title.textContent = sectionTitle;
      section.appendChild(title);

      const content = document.createElement('div');
      content.className = 'isi-section-content';
      content.innerHTML = sectionContent.innerHTML;
      section.appendChild(content);
    } else {
      section.innerHTML = sectionContent.innerHTML;
    }

    isiContent.appendChild(section);
  });

  // Toggle functionality
  toggleBtn.addEventListener('click', () => {
    const isExpanded = block.classList.toggle('expanded');
    toggleBtn.setAttribute('aria-expanded', isExpanded);
  });

  isiContainer.appendChild(isiHeader);
  isiContainer.appendChild(isiContent);

  block.textContent = '';
  block.appendChild(isiContainer);
}
