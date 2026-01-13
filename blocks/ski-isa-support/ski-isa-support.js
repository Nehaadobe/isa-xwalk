/**
 * SKI ISA Support Block
 * Displays SKYRIZI Complete patient support program information with 3-column cards
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  // Create support structure
  const supportWrapper = document.createElement('div');
  supportWrapper.className = 'ski-isa-support-wrapper';

  // Title section
  const titleSection = document.createElement('div');
  titleSection.className = 'ski-isa-support-title';
  titleSection.innerHTML = '<h2>Encourage your patients to enroll in</h2>';

  // Program logo placeholder
  const programSection = document.createElement('div');
  programSection.className = 'ski-isa-support-program';
  programSection.innerHTML = `
    <img src="./images/skyrizi-complete-logo.svg" alt="SKYRIZI Complete" onerror="this.style.display='none'">
  `;

  // Cards container
  const cardsContainer = document.createElement('div');
  cardsContainer.className = 'ski-isa-support-cards';

  // Card definitions with icons
  const cardData = [
    {
      icon: 'affordability',
      title: 'AFFORDABILITY',
      description: 'Eligible commercially insured patients may pay as little as $5 per quarterly dose§',
    },
    {
      icon: 'support',
      title: 'ONE-TO-ONE SUPPORT',
      description: 'Insurance Specialists to help navigate insurance and Nurse Ambassadors∥ to help patients start and stay on therapy',
    },
    {
      icon: 'bridge',
      title: 'BRIDGE PROGRAM ELIGIBILITY',
      description: 'No-cost product available for eligible patients in the event of a denial in coverage due to step-therapy requirement¶',
    },
  ];

  // CTA section
  const ctaSection = document.createElement('div');
  ctaSection.className = 'ski-isa-support-cta';

  // Footnotes section
  const footnotesSection = document.createElement('div');
  footnotesSection.className = 'ski-isa-support-footnotes';

  rows.forEach((row, index) => {
    const cols = [...row.querySelectorAll(':scope > div')];

    // Row 0: Title
    if (index === 0 && cols[0]) {
      const titleText = cols[0].textContent?.trim();
      if (titleText && titleText.length > 0 && !titleText.includes('AFFORDABILITY')) {
        titleSection.innerHTML = `<h2>${titleText}</h2>`;
      }
    }

    // Parse card content from rows
    if (cols.length >= 1) {
      const content = cols[cols.length - 1]?.innerHTML || '';
      const textContent = cols[cols.length - 1]?.textContent || '';

      // Extract title and description from content like "**TITLE** description text"
      if (textContent.includes('AFFORDABILITY') && !textContent.includes('‡Advanced')) {
        const match = content.match(/<strong>(.*?)<\/strong>\s*(.*)/i);
        if (match) {
          cardData[0].title = match[1].toUpperCase();
          cardData[0].description = match[2].replace(/<[^>]*>/g, '').trim();
        }
      } else if ((textContent.toLowerCase().includes('one-to-one') || textContent.includes('Insurance Specialists')) && !textContent.includes('‡Advanced')) {
        const match = content.match(/<strong>(.*?)<\/strong>\s*(.*)/i);
        if (match) {
          cardData[1].title = match[1].toUpperCase();
          cardData[1].description = match[2].replace(/<[^>]*>/g, '').trim();
        }
      } else if (textContent.includes('BRIDGE') && !textContent.includes('‡Advanced')) {
        const match = content.match(/<strong>(.*?)<\/strong>\s*(.*)/i);
        if (match) {
          cardData[2].title = match[1].toUpperCase();
          cardData[2].description = match[2].replace(/<[^>]*>/g, '').trim();
        }
      }

      // Check for CTA link
      const link = cols[0]?.querySelector('a') || cols[cols.length - 1]?.querySelector('a');
      if (link && link.textContent.includes('FIND OUT')) {
        const ctaBtn = document.createElement('a');
        ctaBtn.href = link.href;
        ctaBtn.className = 'ski-isa-support-btn';
        ctaBtn.textContent = link.textContent;
        ctaSection.appendChild(ctaBtn);
      }

      // Check for footnotes
      if (textContent.includes('‡Advanced systemics')) {
        footnotesSection.innerHTML = `<p>${textContent}</p>`;
      }
    }
  });

  // Create the cards
  cardData.forEach((data) => {
    const card = document.createElement('div');
    card.className = 'ski-isa-support-card';

    const iconClass = data.icon === 'affordability' ? 'affordability' : '';

    card.innerHTML = `
      <div class="support-card-icon ${iconClass}">
        ${data.icon === 'affordability' ? '' : getSupportIcon(data.icon)}
      </div>
      <div class="support-card-content">
        <h5 class="support-card-title">${data.title}</h5>
        <p class="support-card-description">${data.description}</p>
      </div>
    `;

    cardsContainer.appendChild(card);
  });

  supportWrapper.appendChild(titleSection);
  supportWrapper.appendChild(programSection);
  supportWrapper.appendChild(cardsContainer);
  supportWrapper.appendChild(ctaSection);
  supportWrapper.appendChild(footnotesSection);

  block.textContent = '';
  block.appendChild(supportWrapper);
}

function getSupportIcon(type) {
  if (type === 'support') {
    return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>`;
  }
  if (type === 'bridge') {
    return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
    </svg>`;
  }
  return '';
}
