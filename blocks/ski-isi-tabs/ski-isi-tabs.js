/**
 * SKI ISI Tabs Block
 * Tabbed content interface
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  const container = document.createElement('div');
  container.className = 'ski-isi-tabs-container';

  // Create tabs header
  const tabsHeader = document.createElement('div');
  tabsHeader.className = 'tabs-header';

  // Create tabs content
  const tabsContent = document.createElement('div');
  tabsContent.className = 'tabs-content';

  rows.forEach((row, index) => {
    const cols = [...row.querySelectorAll(':scope > div')];
    const tabLabel = cols[0]?.textContent?.trim() || `Tab ${index + 1}`;
    const tabContent = cols[1]?.innerHTML || cols[0]?.innerHTML || '';

    // Create tab button
    const tabButton = document.createElement('button');
    tabButton.className = `tab-button ${index === 0 ? 'active' : ''}`;
    tabButton.textContent = tabLabel;
    tabButton.setAttribute('data-tab', index);
    tabButton.setAttribute('role', 'tab');
    tabButton.setAttribute('aria-selected', index === 0 ? 'true' : 'false');

    // Create tab panel
    const tabPanel = document.createElement('div');
    tabPanel.className = `tab-panel ${index === 0 ? 'active' : ''}`;
    tabPanel.setAttribute('data-tab', index);
    tabPanel.setAttribute('role', 'tabpanel');
    tabPanel.innerHTML = tabContent;

    tabButton.addEventListener('click', () => {
      // Deactivate all
      tabsHeader.querySelectorAll('.tab-button').forEach((btn) => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      tabsContent.querySelectorAll('.tab-panel').forEach((panel) => {
        panel.classList.remove('active');
      });

      // Activate clicked
      tabButton.classList.add('active');
      tabButton.setAttribute('aria-selected', 'true');
      tabPanel.classList.add('active');
    });

    tabsHeader.appendChild(tabButton);
    tabsContent.appendChild(tabPanel);
  });

  container.appendChild(tabsHeader);
  container.appendChild(tabsContent);
  block.textContent = '';
  block.appendChild(container);
}
