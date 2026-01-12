/**
 * SKI ISA Safety Block
 * Displays safety considerations and important safety information
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  // Create safety structure
  const safetyWrapper = document.createElement('div');
  safetyWrapper.className = 'ski-isa-safety-wrapper';

  // Header with toggle
  const header = document.createElement('div');
  header.className = 'ski-isa-safety-header';

  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'ski-isa-safety-toggle';
  toggleBtn.setAttribute('aria-expanded', 'true');
  toggleBtn.innerHTML = '<span class="toggle-icon">+</span>';

  // Content container
  const contentContainer = document.createElement('div');
  contentContainer.className = 'ski-isa-safety-content';

  // Sections container
  const sectionsContainer = document.createElement('div');
  sectionsContainer.className = 'ski-isa-safety-sections';

  rows.forEach((row, index) => {
    const cols = [...row.querySelectorAll(':scope > div')];

    // Row 0: Main title
    if (index === 0 && cols[0]) {
      const title = document.createElement('h2');
      title.className = 'ski-isa-safety-title';
      title.innerHTML = cols[0].innerHTML;
      header.appendChild(title);
    }

    // Subsequent rows: Safety sections
    if (index >= 1 && cols.length >= 1) {
      const section = document.createElement('div');
      section.className = 'ski-isa-safety-section';

      // If two columns, first is title, second is content
      if (cols.length >= 2) {
        const sectionTitle = document.createElement('h3');
        sectionTitle.className = 'safety-section-title';
        sectionTitle.textContent = cols[0]?.textContent?.trim() || '';

        const sectionContent = document.createElement('div');
        sectionContent.className = 'safety-section-content';
        sectionContent.innerHTML = cols[1]?.innerHTML || '';

        section.appendChild(sectionTitle);
        section.appendChild(sectionContent);
      } else {
        // Single column - just content
        section.innerHTML = cols[0]?.innerHTML || '';
      }

      sectionsContainer.appendChild(section);
    }
  });

  header.appendChild(toggleBtn);
  contentContainer.appendChild(sectionsContainer);

  // Toggle functionality
  toggleBtn.addEventListener('click', () => {
    const isExpanded = block.classList.toggle('collapsed');
    toggleBtn.setAttribute('aria-expanded', !isExpanded);
    toggleBtn.querySelector('.toggle-icon').textContent = isExpanded ? '+' : '-';
  });

  safetyWrapper.appendChild(header);
  safetyWrapper.appendChild(contentContainer);

  block.textContent = '';
  block.appendChild(safetyWrapper);
}
