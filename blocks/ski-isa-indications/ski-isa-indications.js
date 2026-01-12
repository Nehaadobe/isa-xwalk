/**
 * SKI ISA Indications Block
 * Displays SKYRIZI indications for different conditions
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  // Create indications structure
  const indicationsWrapper = document.createElement('div');
  indicationsWrapper.className = 'ski-isa-indications-wrapper';

  // Title section
  const titleSection = document.createElement('div');
  titleSection.className = 'ski-isa-indications-title';

  // Indications list
  const indicationsList = document.createElement('div');
  indicationsList.className = 'ski-isa-indications-list';

  // PI Link section
  const piSection = document.createElement('div');
  piSection.className = 'ski-isa-indications-pi';

  rows.forEach((row, index) => {
    const cols = [...row.querySelectorAll(':scope > div')];

    // Row 0: Title
    if (index === 0 && cols[0]) {
      const title = document.createElement('h2');
      title.innerHTML = cols[0].innerHTML;
      titleSection.appendChild(title);
    }

    // Subsequent rows: Indications
    if (index >= 1 && cols.length >= 2) {
      const indication = document.createElement('div');
      indication.className = 'ski-isa-indication-item';

      const conditionName = cols[0]?.textContent?.trim() || '';
      const description = cols[1]?.innerHTML || '';

      // Check if it's a PI link row (contains "Please see" or similar)
      if (conditionName.toLowerCase().includes('please see') ||
          conditionName.toLowerCase().includes('prescribing')) {
        piSection.innerHTML = `<p>${cols[0]?.innerHTML || ''} ${cols[1]?.innerHTML || ''}</p>`;
      } else {
        indication.innerHTML = `
          <h3 class="indication-condition">${conditionName}</h3>
          <div class="indication-description">${description}</div>
        `;
        indicationsList.appendChild(indication);
      }
    } else if (index >= 1 && cols.length === 1) {
      // Single column - check if it's PI link or general content
      const content = cols[0]?.innerHTML || '';
      if (content.toLowerCase().includes('prescribing information') ||
          content.toLowerCase().includes('please see')) {
        piSection.innerHTML = cols[0]?.innerHTML || '';
      } else {
        const indication = document.createElement('div');
        indication.className = 'ski-isa-indication-item';
        indication.innerHTML = content;
        indicationsList.appendChild(indication);
      }
    }
  });

  indicationsWrapper.appendChild(titleSection);
  indicationsWrapper.appendChild(indicationsList);
  if (piSection.innerHTML) {
    indicationsWrapper.appendChild(piSection);
  }

  block.textContent = '';
  block.appendChild(indicationsWrapper);
}
