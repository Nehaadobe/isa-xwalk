/**
 * SKI ISA Coverage Block
 * Displays coverage statistics for Commercial and Medicare Part D with tabs
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  // Create coverage structure
  const coverageWrapper = document.createElement('div');
  coverageWrapper.className = 'ski-isa-coverage-wrapper';

  // Title section
  const titleSection = document.createElement('div');
  titleSection.className = 'ski-isa-coverage-title';

  // Tabs section
  const tabsSection = document.createElement('div');
  tabsSection.className = 'ski-isa-coverage-tabs';

  // Stats container
  const statsContainer = document.createElement('div');
  statsContainer.className = 'ski-isa-coverage-stats';

  // Benefits section
  const benefitsSection = document.createElement('div');
  benefitsSection.className = 'ski-isa-coverage-benefits';

  rows.forEach((row, index) => {
    const cols = [...row.querySelectorAll(':scope > div')];

    // Row 0: Main title/headline
    if (index === 0 && cols[0]) {
      const titleContent = cols[0].textContent?.trim() || '';
      titleSection.innerHTML = `<h2>${titleContent}</h2>`;
    }

    // Row 1: Tabs (Overview, National, Local)
    if (index === 1 && cols.length >= 3) {
      const tab1 = cols[0]?.textContent?.trim() || 'Overview';
      const tab2 = cols[1]?.textContent?.trim() || 'National';
      const tab3 = cols[2]?.textContent?.trim() || 'Local';

      tabsSection.innerHTML = `
        <button class="ski-isa-coverage-tab" data-tab="overview">${tab1}</button>
        <button class="ski-isa-coverage-tab active" data-tab="national">${tab2}</button>
        <button class="ski-isa-coverage-tab" data-tab="local">${tab3}</button>
      `;
    }

    // Row 2: Commercial coverage stat
    if (index === 2) {
      const statCard = document.createElement('div');
      statCard.className = 'ski-isa-coverage-stat-card commercial';

      const label = cols[0]?.textContent?.trim() || 'Commercial';
      const percentage = cols[1]?.textContent?.trim() || '99%';
      const description = cols[2]?.textContent?.trim() || 'Preferred Coverage';

      statCard.innerHTML = `
        <h3 class="stat-label">${label}</h3>
        <div class="stat-percentage">
          <span class="stat-number">${percentage.replace('%', '')}</span>
          <span class="stat-symbol">%</span>
        </div>
        <div class="stat-description">${description.replace(/<sup>.*?<\/sup>/g, '')}</div>
      `;
      statsContainer.appendChild(statCard);
    }

    // Row 3: Medicare Part D coverage stat
    if (index === 3) {
      const statCard = document.createElement('div');
      statCard.className = 'ski-isa-coverage-stat-card medicare';

      const label = cols[0]?.textContent?.trim() || 'Medicare Part D';
      const percentage = cols[1]?.textContent?.trim() || '97%';
      const description = cols[2]?.textContent?.trim() || 'Preferred Coverage';

      statCard.innerHTML = `
        <h3 class="stat-label">${label}</h3>
        <div class="stat-percentage">
          <span class="stat-number">${percentage.replace('%', '')}</span>
          <span class="stat-symbol">%</span>
        </div>
        <div class="stat-description">${description.replace(/<sup>.*?<\/sup>/g, '')}</div>
      `;
      statsContainer.appendChild(statCard);
    }

    // Row 4: Benefits list
    if (index === 4 && cols[0]) {
      benefitsSection.innerHTML = cols[0].innerHTML;
    }
  });

  // Add default tabs if not found in content
  if (tabsSection.innerHTML === '') {
    tabsSection.innerHTML = `
      <button class="ski-isa-coverage-tab" data-tab="overview">Overview</button>
      <button class="ski-isa-coverage-tab active" data-tab="national">National</button>
      <button class="ski-isa-coverage-tab" data-tab="local">Local</button>
    `;
  }

  // Tab click functionality
  tabsSection.querySelectorAll('.ski-isa-coverage-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      tabsSection.querySelectorAll('.ski-isa-coverage-tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  // Left column (title + tabs)
  const leftColumn = document.createElement('div');
  leftColumn.className = 'ski-isa-coverage-left';
  leftColumn.appendChild(titleSection);
  leftColumn.appendChild(tabsSection);

  // Right column (stats + benefits)
  const rightColumn = document.createElement('div');
  rightColumn.className = 'ski-isa-coverage-right';
  rightColumn.appendChild(statsContainer);
  rightColumn.appendChild(benefitsSection);

  coverageWrapper.appendChild(leftColumn);
  coverageWrapper.appendChild(rightColumn);

  block.textContent = '';
  block.appendChild(coverageWrapper);
}
