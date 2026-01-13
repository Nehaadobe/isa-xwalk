/**
 * SKI ISA Hero Block
 * Displays the SKYRIZI branded hero header with logo, navigation, and ISI toggle
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  // Create top bar with "tap here" ISI toggle - read from content rows
  const topBar = document.createElement('div');
  topBar.className = 'ski-isa-hero-topbar';

  // Process ISI lines from markdown (rows 1 and 2)
  const isiLines = [];
  rows.forEach((row, index) => {
    if (index >= 1) {
      const cols = [...row.querySelectorAll(':scope > div')];
      if (cols.length >= 2) {
        const toggleText = cols[0]?.textContent?.trim() || '';
        const contentDiv = cols[1];
        if (toggleText.toLowerCase().includes('tap')) {
          // Extract text and link from content
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

  // Build top bar HTML from content or use defaults
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
    // Fallback default content
    topBar.innerHTML = `
      <div class="topbar-line">
        <button class="topbar-toggle" aria-label="Toggle SKYRIZI ISI">Tap here</button>
        <span class="topbar-text">for SKYRIZI Indications and additional Important Safety Information.</span>
        <a href="https://www.rxabbvie.com/pdf/skyrizi_pi.pdf" target="_blank" class="topbar-link">See accompanying Full Prescribing Information</a>
      </div>
      <div class="topbar-line">
        <button class="topbar-toggle" aria-label="Toggle HUMIRA ISI">Tap here</button>
        <span class="topbar-text">for HUMIRA Indications and Important Safety Information, including BOXED WARNING on Serious Infections and Malignancy.</span>
        <a href="https://www.rxabbvie.com/pdf/humira.pdf" target="_blank" class="topbar-link">See accompanying Full Prescribing Information</a>
      </div>
    `;
  }

  // Create collapsible Safety Info panel
  const safetyInfo = document.createElement('div');
  safetyInfo.className = 'ski-isa-hero-safety-info collapsed';
  safetyInfo.innerHTML = `
    <button class="safety-info-toggle" aria-label="Toggle Safety Info" aria-expanded="false">
      <span class="toggle-icon">+</span>
    </button>
    <div class="safety-info-content">
      <h1 class="safety-info-title">Safety Considerations and Indication<span class="plural">s</span><sup>1</sup></h1>

      <div class="safety-info-skyrizi">
        <h2>SKYRIZI Safety Considerations</h2>
        <p>SKYRIZI is contraindicated in patients with a history of serious hypersensitivity reaction to risankizumab-rzaa or any of its excipients. Serious hypersensitivity reactions, including anaphylaxis, have been reported with use of SKYRIZI. If a serious hypersensitivity reaction occurs, discontinue SKYRIZI and initiate appropriate therapy immediately. SKYRIZI may increase the risk of infection. Instruct patients to report signs or symptoms of clinically important infection during treatment. Should such an infection occur, discontinue SKYRIZI until infection resolves. Evaluate patients for tuberculosis infection prior to initiating treatment with SKYRIZI. Avoid use of live vaccines in SKYRIZI patients.</p>

        <h2>SKYRIZI Indications</h2>
        <p><strong class="blue">Plaque Psoriasis (Ps):</strong><br>SKYRIZI is indicated for the treatment of moderate to severe plaque psoriasis in adults who are candidates for systemic therapy or phototherapy.</p>
        <p><strong class="blue">Psoriatic Arthritis (PsA):</strong><br>SKYRIZI is indicated for the treatment of active psoriatic arthritis in adults.</p>
      </div>

      <div class="safety-info-humira">
        <h2>HUMIRA Safety Considerations</h2>
        <h2>Serious Infections</h2>
        <p><strong>Patients treated with HUMIRA (adalimumab) are at increased risk for developing serious infections that may lead to hospitalization or death. These infections include active tuberculosis (TB), reactivation of latent TB, invasive fungal infections, and bacterial, viral, and other infections due to opportunistic pathogens. Most patients who developed these infections were taking concomitant immunosuppressants such as methotrexate or corticosteroids.</strong></p>

        <h2>Malignancies</h2>
        <p><strong>Lymphoma, including a rare type of T-cell lymphoma, and other malignancies, some fatal, have been reported in patients treated with TNF blockers, including HUMIRA.</strong></p>

        <h2>Other Serious Adverse Reactions</h2>
        <p>Patients treated with HUMIRA also may be at risk for other serious adverse reactions, including anaphylaxis, hepatitis B virus reactivation, demyelinating disease, cytopenias, pancytopenia, heart failure, and a lupus-like syndrome.</p>

        <h2>HUMIRA Indications</h2>
        <p><strong>Plaque Psoriasis:</strong> HUMIRA is indicated for the treatment of adult patients with moderate to severe chronic plaque psoriasis who are candidates for systemic therapy or phototherapy, and when other systemic therapies are medically less appropriate. HUMIRA should only be administered to patients who will be closely monitored and have regular follow-up visits with a physician.</p>
        <p><strong>Psoriatic Arthritis:</strong> HUMIRA is indicated, alone or in combination with non-biologic DMARDs, for reducing signs and symptoms, inhibiting the progression of structural damage, and improving physical function in adult patients with active psoriatic arthritis.</p>
      </div>
    </div>
  `;

  // Create hero structure
  const heroWrapper = document.createElement('div');
  heroWrapper.className = 'ski-isa-hero-wrapper';

  // Logo section
  const logoSection = document.createElement('div');
  logoSection.className = 'ski-isa-hero-logo';

  // Navigation icons
  const navIcons = document.createElement('div');
  navIcons.className = 'ski-isa-hero-nav';
  navIcons.innerHTML = `
    <button class="ski-isa-hero-nav-icon home-icon" aria-label="Home">
      <svg width="24" height="24" viewBox="0 0 34 34" fill="none">
        <path d="M4.128 14.797L17 3.322l12.872 11.475V29.75h-8.581V18.417h-8.582V29.75H4.128V14.797z" fill="rgba(255,255,255,0.4)"/>
        <path d="M17 1.417L2.697 14.167 0 16.572l1.01 1.005 1.687-1.505v15.095H14.14V19.833h5.722v11.334h11.442V16.072l1.687 1.505L34 16.572l-2.697-2.405L17 1.417zM4.128 14.797L17 3.322l12.872 11.475V29.75h-8.581V18.417h-8.582V29.75H4.128V14.797z" fill="#fff"/>
      </svg>
    </button>
    <button class="ski-isa-hero-nav-icon all-icon" aria-label="All Content">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="7" height="7" rx="1" fill="#fff"/>
        <rect x="14" y="3" width="7" height="7" rx="1" fill="#fff"/>
        <rect x="3" y="14" width="7" height="7" rx="1" fill="#fff"/>
        <rect x="14" y="14" width="7" height="7" rx="1" fill="#fff"/>
      </svg>
    </button>
    <button class="ski-isa-hero-nav-icon segment-menu" aria-label="Segment Menu">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2">
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
      <span class="segment-label">C</span>
    </button>
  `;

  // Row 0: Logo image
  const firstRow = rows[0];
  if (firstRow) {
    const cols = [...firstRow.querySelectorAll(':scope > div')];
    const content = cols[0];
    const picture = content?.querySelector('picture');
    const img = content?.querySelector('img');
    if (picture) {
      logoSection.appendChild(picture.cloneNode(true));
    } else if (img) {
      logoSection.appendChild(img.cloneNode(true));
    }
  }

  // Add brand subtitle
  const brandSubtitle = document.createElement('span');
  brandSubtitle.className = 'brand-subtitle';
  brandSubtitle.textContent = '(risankizumab-rzaa)';
  logoSection.appendChild(brandSubtitle);

  heroWrapper.appendChild(logoSection);
  heroWrapper.appendChild(navIcons);

  // Add toggle functionality for Safety Info panel
  const safetyToggle = safetyInfo.querySelector('.safety-info-toggle');
  safetyToggle.addEventListener('click', () => {
    const isCollapsed = safetyInfo.classList.contains('collapsed');
    safetyInfo.classList.toggle('collapsed');
    safetyToggle.setAttribute('aria-expanded', isCollapsed ? 'true' : 'false');
    safetyToggle.querySelector('.toggle-icon').textContent = isCollapsed ? '−' : '+';
  });

  // Add toggle functionality for top bar ISI links
  topBar.querySelectorAll('.topbar-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      // Expand the safety info panel
      safetyInfo.classList.remove('collapsed');
      safetyToggle.setAttribute('aria-expanded', 'true');
      safetyToggle.querySelector('.toggle-icon').textContent = '−';
      // Scroll to safety info
      safetyInfo.scrollIntoView({ behavior: 'smooth' });
    });
  });

  block.textContent = '';
  block.appendChild(topBar);
  block.appendChild(safetyInfo);
  block.appendChild(heroWrapper);
}
