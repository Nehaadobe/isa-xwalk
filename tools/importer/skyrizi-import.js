/**
 * SKYRIZI ISA Page Import Script
 * Converts SKYRIZI pharmaceutical ISA presentations to AEM Edge Delivery Services
 *
 * Block mappings:
 * - ski-isa-hero: Brand header with logo and title
 * - ski-isa-coverage: Commercial/Medicare coverage statistics
 * - ski-isa-support: SKYRIZI Complete patient support program
 * - ski-isa-safety: Safety considerations and important safety information
 * - ski-isa-indications: Drug indications for various conditions
 * - ski-isa-nav: Bottom navigation tabs
 */

// SKYRIZI ISA Content
const ISA_CONTENT = {
  brand: {
    name: 'SKYRIZI',
    genericName: 'risankizumab-rzaa',
    logo: '/content/dam/skyrizi/logo-skyrizi-gray.png',
  },

  indications: {
    title: 'INDICATIONS AND IMPORTANT SAFETY INFORMATION FOR SKYRIZI',
    conditions: [
      {
        name: 'Plaque Psoriasis',
        description: 'SKYRIZI is indicated for the treatment of moderate to severe plaque psoriasis in adults who are candidates for systemic therapy or phototherapy.',
      },
      {
        name: 'Psoriatic Arthritis',
        description: 'SKYRIZI is indicated for the treatment of active psoriatic arthritis in adults.',
      },
      {
        name: 'Crohn\'s Disease',
        description: 'SKYRIZI is indicated for the treatment of moderately to severely active Crohn\'s disease in adults.',
      },
    ],
  },

  safety: {
    title: 'Important Safety Information',
    sections: [
      {
        title: 'Hypersensitivity Reactions',
        content: 'SKYRIZI is contraindicated in patients with a history of serious hypersensitivity reaction to risankizumab-rzaa or any of the excipients. Serious hypersensitivity reactions, including anaphylaxis, have been reported with the use of SKYRIZI. If a serious hypersensitivity reaction occurs, discontinue SKYRIZI and initiate appropriate therapy immediately.',
      },
      {
        title: 'Infection',
        content: 'SKYRIZI may increase the risk of infection. Do not initiate treatment with SKYRIZI in patients with a clinically important active infection until it resolves or is adequately treated. In patients with a chronic infection or a history of recurrent infection, consider the risks and benefits prior to prescribing SKYRIZI.',
      },
      {
        title: 'Tuberculosis (TB)',
        content: 'Prior to initiating treatment with SKYRIZI, evaluate for TB infection and consider treatment in patients with latent or active TB for whom an adequate course of treatment cannot be confirmed. Monitor patients for signs and symptoms of active TB during and after SKYRIZI treatment. Do not administer SKYRIZI to patients with active TB.',
      },
      {
        title: 'Hepatotoxicity in Treatment of Crohn\'s Disease',
        content: 'Drug-induced liver injury was reported in a patient with Crohn\'s disease who was hospitalized for a rash during induction dosing of SKYRIZI. For the treatment of Crohn\'s disease, evaluate liver enzymes and bilirubin at baseline and during induction (12 weeks); monitor thereafter according to routine patient management.',
      },
      {
        title: 'Administration of Vaccines',
        content: 'Avoid use of live vaccines in patients treated with SKYRIZI. Medications that interact with the immune system may increase the risk of infection following administration of live vaccines. Prior to initiating SKYRIZI, complete all age-appropriate vaccinations according to current immunization guidelines.',
      },
      {
        title: 'Adverse Reactions',
        content: 'Most common (≥1%) adverse reactions associated with SKYRIZI in plaque psoriasis and psoriatic arthritis include upper respiratory infections, headache, fatigue, injection site reactions, and tinea infections.',
      },
    ],
    piLink: 'https://www.rxabbvie.com/pdf/skyrizi_pi.pdf',
  },

  coverage: {
    title: 'for Ps & PsA SKYRIZI Patients: Preferred NATIONAL Coverage & Exceptional Support',
    commercial: {
      label: 'Commercial',
      percentage: '99%',
      description: 'PREFERRED COVERAGE',
    },
    medicare: {
      label: 'Medicare Part D',
      percentage: '97%',
      description: 'PREFERRED COVERAGE',
    },
    benefits: [
      'With no advanced systemic failure required',
      'At the lowest branded co-pay/coinsurance tier',
    ],
    footnote: 'National Commercial and Medicare Part D Formulary coverage under the pharmacy benefit as of December 2023.',
  },

  support: {
    title: 'Encourage your patients to enroll in',
    cards: [
      {
        title: 'AFFORDABILITY',
        description: 'Eligible commercially insured patients may pay as little as $5 per quarterly dose',
      },
      {
        title: 'One-to-one support',
        description: 'Insurance Specialists to help navigate insurance and Nurse Ambassadors to help patients start and stay on therapy',
      },
      {
        title: 'BRIDGE PROGRAM ELIGIBILITY',
        description: 'No-cost product available for eligible patients in the event of a denial in coverage due to step-therapy requirement',
      },
    ],
    ctaText: 'FIND OUT MORE',
    ctaLink: '/skyrizi-complete',
  },

  navigation: [
    { label: 'OVERVIEW', link: '/overview' },
    { label: 'DRC', link: '/drc' },
    { label: 'JOINTS', link: '/joints' },
    { label: 'H2H/SWITCH DATA', link: '/h2h-switch-data' },
    { label: 'DOSING', link: '/dosing' },
    { label: 'SAFETY', link: '/safety' },
    { label: 'ACCESS', link: '/access', active: true },
    { label: 'SUMMARY', link: '/summary' },
  ],
};

/**
 * Create a block table with proper structure
 */
function createBlock(doc, name, rows) {
  const table = doc.createElement('table');

  // Block name row
  const tr1 = doc.createElement('tr');
  const th = doc.createElement('th');
  th.colSpan = rows[0]?.length || 1;
  th.textContent = name;
  tr1.appendChild(th);
  table.appendChild(tr1);

  // Content rows
  rows.forEach((row) => {
    const tr = doc.createElement('tr');
    const cells = Array.isArray(row) ? row : [row];
    cells.forEach((cell) => {
      const td = doc.createElement('td');
      if (typeof cell === 'string') {
        td.innerHTML = cell;
      } else if (cell && cell.nodeType) {
        td.appendChild(cell);
      }
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });

  return table;
}

/**
 * Create a section break
 */
function createSectionBreak(doc) {
  return doc.createElement('hr');
}

/**
 * Build SKI ISA Hero block
 */
function buildHeroBlock(doc) {
  const logoImg = doc.createElement('img');
  logoImg.src = ISA_CONTENT.brand.logo;
  logoImg.alt = ISA_CONTENT.brand.name;

  const headline = doc.createElement('div');
  headline.innerHTML = `<h1>${ISA_CONTENT.indications.title} <span class="simple">(${ISA_CONTENT.brand.genericName})</span><sup>1</sup></h1>`;

  return createBlock(doc, 'Ski Isa Hero', [
    [logoImg],
    [headline],
  ]);
}

/**
 * Build SKI ISA Safety block
 */
function buildSafetyBlock(doc) {
  const rows = [[`<h2>${ISA_CONTENT.safety.title}</h2>`]];

  ISA_CONTENT.safety.sections.forEach((section) => {
    rows.push([section.title, `<p>${section.content}</p>`]);
  });

  return createBlock(doc, 'Ski Isa Safety', rows);
}

/**
 * Build SKI ISA Indications block
 */
function buildIndicationsBlock(doc) {
  const rows = [['<h2>INDICATIONS</h2>']];

  ISA_CONTENT.indications.conditions.forEach((condition) => {
    rows.push([`<strong>${condition.name}:</strong>`, `<p>${condition.description}</p>`]);
  });

  // Add PI link
  rows.push([`<p>Please see <a href="${ISA_CONTENT.safety.piLink}">Full Prescribing Information</a>.</p>`]);

  return createBlock(doc, 'Ski Isa Indications', rows);
}

/**
 * Build SKI ISA Coverage block
 */
function buildCoverageBlock(doc) {
  const rows = [
    [`<h2>${ISA_CONTENT.coverage.title}</h2>`],
    [ISA_CONTENT.coverage.commercial.label, ISA_CONTENT.coverage.commercial.percentage, ISA_CONTENT.coverage.commercial.description],
    [ISA_CONTENT.coverage.medicare.label, ISA_CONTENT.coverage.medicare.percentage, ISA_CONTENT.coverage.medicare.description],
    [`<h2>Preferred coverage means SKYRIZI is AVAILABLE:</h2><ul>${ISA_CONTENT.coverage.benefits.map((b) => `<li>${b}</li>`).join('')}</ul><p>${ISA_CONTENT.coverage.footnote}</p>`],
  ];

  return createBlock(doc, 'Ski Isa Coverage', rows);
}

/**
 * Build SKI ISA Support block
 */
function buildSupportBlock(doc) {
  const rows = [
    [`<h2>${ISA_CONTENT.support.title}</h2>`],
  ];

  ISA_CONTENT.support.cards.forEach((card) => {
    rows.push(['', `<h5>${card.title}</h5><p>${card.description}</p>`]);
  });

  rows.push([`<a href="${ISA_CONTENT.support.ctaLink}">${ISA_CONTENT.support.ctaText}</a>`]);

  return createBlock(doc, 'Ski Isa Support', rows);
}

/**
 * Build SKI ISA Nav block
 */
function buildNavBlock(doc) {
  const navItems = ISA_CONTENT.navigation.map((item) => {
    if (item.active) {
      return `<a href="${item.link}" class="active">${item.label}</a>`;
    }
    return `<a href="${item.link}">${item.label}</a>`;
  });

  return createBlock(doc, 'Ski Isa Nav', [[navItems.join(' ')]]);
}

/**
 * Main transform function
 */
export default {
  transform: ({ document, url, html, params }) => {
    // eslint-disable-next-line no-console
    console.log('[SKYRIZI IMPORT] Transform called with URL:', url);

    const { body } = document;
    body.innerHTML = '';

    // Build page structure with SKI ISA blocks

    // --- SKI ISA HERO ---
    body.appendChild(buildHeroBlock(document));

    // --- SECTION BREAK ---
    body.appendChild(createSectionBreak(document));

    // --- SKI ISA SAFETY ---
    body.appendChild(buildSafetyBlock(document));

    // --- SECTION BREAK ---
    body.appendChild(createSectionBreak(document));

    // --- SKI ISA INDICATIONS ---
    body.appendChild(buildIndicationsBlock(document));

    // --- SECTION BREAK ---
    body.appendChild(createSectionBreak(document));

    // --- SKI ISA COVERAGE ---
    body.appendChild(buildCoverageBlock(document));

    // --- SECTION BREAK ---
    body.appendChild(createSectionBreak(document));

    // --- SKI ISA SUPPORT ---
    body.appendChild(buildSupportBlock(document));

    // --- SECTION BREAK ---
    body.appendChild(createSectionBreak(document));

    // --- SKI ISA NAV ---
    body.appendChild(buildNavBlock(document));

    // --- SECTION BREAK ---
    body.appendChild(createSectionBreak(document));

    // --- METADATA BLOCK ---
    body.appendChild(createBlock(document, 'Metadata', [
      ['title', 'SKYRIZI Access - US-SKZD-230597'],
      ['description', 'SKYRIZI access, coverage, and patient support information for healthcare providers'],
      ['og:image', ISA_CONTENT.brand.logo],
    ]));

    return [{
      element: body,
      path: '/skyrizi/access',
    }];
  },
};
