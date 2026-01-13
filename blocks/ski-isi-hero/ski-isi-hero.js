/**
 * SKI ISI Hero Block
 * Shared header component with logo, ISI toggle, and navigation icons
 * Used across all SKYRIZI pages
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  // Create top bar with ISI toggles
  const topBar = document.createElement('div');
  topBar.className = 'ski-isi-hero-topbar';

  // Extract ISI lines from content rows
  const isiLines = [];
  rows.forEach((row, index) => {
    if (index >= 1) {
      const cols = [...row.querySelectorAll(':scope > div')];
      if (cols.length >= 2) {
        const toggleText = cols[0]?.textContent?.trim() || '';
        const contentDiv = cols[1];
        if (toggleText.toLowerCase().includes('tap')) {
          const link = contentDiv?.querySelector('a');
          const textContent = contentDiv?.textContent?.replace(link?.textContent || '', '').trim() || '';
          isiLines.push({
            toggle: toggleText,
            text: textContent,
            linkText: link?.textContent || '',
            linkHref: link?.href || '',
          });
        }
      }
    }
  });

  // Build top bar from content
  if (isiLines.length > 0) {
    isiLines.forEach((line) => {
      const lineDiv = document.createElement('div');
      lineDiv.className = 'topbar-line';
      lineDiv.innerHTML = `
        <button class="topbar-toggle" aria-label="Toggle ISI">${line.toggle}</button>
        <span class="topbar-text">${line.text}</span>
        ${line.linkHref ? `<a href="${line.linkHref}" target="_blank" class="topbar-link">${line.linkText}</a>` : ''}
      `;
      topBar.appendChild(lineDiv);
    });
  } else {
    // Default ISI content
    topBar.innerHTML = `
      <div class="topbar-line">
        <button class="topbar-toggle" aria-label="Toggle SKYRIZI ISI">Tap here</button>
        <span class="topbar-text">for SKYRIZI Indications and additional Important Safety Information.</span>
        <a href="https://www.rxabbvie.com/pdf/skyrizi_pi.pdf" target="_blank" class="topbar-link">See Full Prescribing Information</a>
      </div>
    `;
  }

  // Create collapsible Safety Info panel
  const safetyPanel = document.createElement('div');
  safetyPanel.className = 'ski-isi-hero-safety collapsed';
  safetyPanel.innerHTML = `
    <button class="safety-toggle" aria-label="Toggle Safety Info" aria-expanded="false">
      <span class="toggle-icon">+</span>
    </button>
    <div class="safety-content">
      <h2 class="safety-title">Safety Considerations and Indications<sup>1</sup></h2>
      <div class="safety-body">
        <h3>SKYRIZI Safety Considerations</h3>
        <p>SKYRIZI is contraindicated in patients with a history of serious hypersensitivity reaction to risankizumab-rzaa or any of its excipients.</p>
        <h3>SKYRIZI Indications</h3>
        <p><strong>Plaque Psoriasis:</strong> SKYRIZI is indicated for the treatment of moderate to severe plaque psoriasis in adults who are candidates for systemic therapy or phototherapy.</p>
        <p><strong>Psoriatic Arthritis:</strong> SKYRIZI is indicated for the treatment of active psoriatic arthritis in adults.</p>
        <p><strong>Crohn's Disease:</strong> SKYRIZI is indicated for the treatment of moderately to severely active Crohn's disease in adults.</p>
      </div>
    </div>
  `;

  // Create hero wrapper with logo and nav
  const heroWrapper = document.createElement('div');
  heroWrapper.className = 'ski-isi-hero-wrapper';

  // Logo section
  const logoSection = document.createElement('div');
  logoSection.className = 'ski-isi-hero-logo';

  // Get logo from first row
  const firstRow = rows[0];
  if (firstRow) {
    const cols = [...firstRow.querySelectorAll(':scope > div')];
    const picture = cols[0]?.querySelector('picture');
    const img = cols[0]?.querySelector('img');
    if (picture) {
      logoSection.appendChild(picture.cloneNode(true));
    } else if (img) {
      logoSection.appendChild(img.cloneNode(true));
    }
  }

  // Add brand subtitle
  const subtitle = document.createElement('span');
  subtitle.className = 'brand-subtitle';
  subtitle.textContent = '(risankizumab-rzaa)';
  logoSection.appendChild(subtitle);

  // Navigation icons
  const navIcons = document.createElement('div');
  navIcons.className = 'ski-isi-hero-nav';
  navIcons.innerHTML = `
    <button class="nav-icon home" aria-label="Home">
      <svg width="24" height="24" viewBox="0 0 34 34" fill="none">
        <path d="M4.128 14.797L17 3.322l12.872 11.475V29.75h-8.581V18.417h-8.582V29.75H4.128V14.797z" fill="rgba(255,255,255,0.4)"/>
        <path d="M17 1.417L2.697 14.167 0 16.572l1.01 1.005 1.687-1.505v15.095H14.14V19.833h5.722v11.334h11.442V16.072l1.687 1.505L34 16.572l-2.697-2.405L17 1.417zM4.128 14.797L17 3.322l12.872 11.475V29.75h-8.581V18.417h-8.582V29.75H4.128V14.797z" fill="#fff"/>
      </svg>
    </button>
    <button class="nav-icon grid" aria-label="All Content">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="7" height="7" rx="1" fill="#fff"/>
        <rect x="14" y="3" width="7" height="7" rx="1" fill="#fff"/>
        <rect x="3" y="14" width="7" height="7" rx="1" fill="#fff"/>
        <rect x="14" y="14" width="7" height="7" rx="1" fill="#fff"/>
      </svg>
    </button>
    <button class="nav-icon menu" aria-label="Menu">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2">
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
    </button>
  `;

  heroWrapper.appendChild(logoSection);
  heroWrapper.appendChild(navIcons);

  // Toggle functionality
  const safetyToggle = safetyPanel.querySelector('.safety-toggle');
  safetyToggle?.addEventListener('click', () => {
    const isCollapsed = safetyPanel.classList.contains('collapsed');
    safetyPanel.classList.toggle('collapsed');
    safetyToggle.setAttribute('aria-expanded', isCollapsed ? 'true' : 'false');
    safetyToggle.querySelector('.toggle-icon').textContent = isCollapsed ? '−' : '+';
  });

  // Top bar toggles expand safety panel
  topBar.querySelectorAll('.topbar-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      safetyPanel.classList.remove('collapsed');
      safetyToggle?.setAttribute('aria-expanded', 'true');
      const icon = safetyToggle?.querySelector('.toggle-icon');
      if (icon) icon.textContent = '−';
      safetyPanel.scrollIntoView({ behavior: 'smooth' });
    });
  });

  block.textContent = '';
  block.appendChild(topBar);
  block.appendChild(safetyPanel);
  block.appendChild(heroWrapper);
}
