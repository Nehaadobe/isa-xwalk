export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  // Create tabs structure
  const tabsNav = document.createElement('div');
  tabsNav.className = 'tabs-nav';

  const tabsContent = document.createElement('div');
  tabsContent.className = 'tabs-content';

  rows.forEach((row, index) => {
    const cols = [...row.querySelectorAll(':scope > div')];
    const tabTitle = cols[0]?.textContent?.trim() || `Tab ${index + 1}`;
    const tabContent = cols[1] || cols[0];

    // Create tab button
    const tabBtn = document.createElement('button');
    tabBtn.className = `tab-btn${index === 0 ? ' active' : ''}`;
    tabBtn.textContent = tabTitle;
    tabBtn.setAttribute('data-tab', index);
    tabBtn.setAttribute('role', 'tab');
    tabBtn.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    tabsNav.appendChild(tabBtn);

    // Create tab panel
    const tabPanel = document.createElement('div');
    tabPanel.className = `tab-panel${index === 0 ? ' active' : ''}`;
    tabPanel.setAttribute('data-tab', index);
    tabPanel.setAttribute('role', 'tabpanel');
    if (cols.length > 1) {
      tabPanel.innerHTML = tabContent.innerHTML;
    }
    tabsContent.appendChild(tabPanel);
  });

  // Add click handlers
  tabsNav.addEventListener('click', (e) => {
    if (e.target.classList.contains('tab-btn')) {
      const tabIndex = e.target.getAttribute('data-tab');

      // Update buttons
      tabsNav.querySelectorAll('.tab-btn').forEach((btn) => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      e.target.classList.add('active');
      e.target.setAttribute('aria-selected', 'true');

      // Update panels
      tabsContent.querySelectorAll('.tab-panel').forEach((panel) => {
        panel.classList.remove('active');
      });
      tabsContent.querySelector(`.tab-panel[data-tab="${tabIndex}"]`).classList.add('active');
    }
  });

  block.textContent = '';
  block.setAttribute('role', 'tablist');
  block.appendChild(tabsNav);
  block.appendChild(tabsContent);
}
