/*
 * Venclexta Pharma Site Import Script
 * Converts SSWeaver pharmaceutical presentations to AEM Edge Delivery Services
 *
 * Hero model fields: image, imageAlt, text
 * Block table structure must match model columns
 */

const VIEW_CONTENT = {
  heroHeadline: 'VENCLEXTA + AZACITIDINE',
  heroSubhead: 'WAS PROVEN TO HELP NEWLY DIAGNOSED AML PATIENTS LIVE LONGER',
  heroStats: 'Median Overall Survival\n\nVEN+AZA 14.7 months vs AZA 9.6 months\n\n95% CI: (11.9, 18.7) 95% CI: (7.4, 12.7)\n\nOS: HR=0.66; 95% CI: (0.52, 0.85); P<0.001',
  heroDescription: 'VIALE-A was a randomized (2:1), multicenter, double-blind, placebo-controlled, phase 3 study that evaluated the efficacy and safety of VENCLEXTA in combination with azacitidine (VEN+AZA; N=286) vs placebo with azacitidine (PBO+AZA; N=145) in adults with newly diagnosed AML who were ≥75 years of age, or with comorbidities that precluded the use of intensive induction chemotherapy.',
  buttons: [
    { label: 'National Comprehensive Cancer Network (NCCN)', link: '/nccn' },
    { label: 'Study Design', link: '/aml-study' },
    { label: 'Overall Survival', link: '/aml-efficacy' },
    { label: 'Remission (CR and CR+CRi)', link: '/aml-efficacy' },
    { label: 'Transfusion Independence', link: '/aml-efficacy' },
    { label: 'Early Assessment With Bone Marrow Biopsy', link: '/aml-management' },
  ],
};

const ISI_SECTIONS = [
  { title: 'Indication', content: 'VENCLEXTA is indicated in combination with azacitidine, or decitabine, or low-dose cytarabine for the treatment of newly diagnosed acute myeloid leukemia (AML) in adults 75 years or older, or who have comorbidities that preclude use of intensive induction chemotherapy.' },
  { title: 'Tumor Lysis Syndrome', content: 'Tumor lysis syndrome (TLS), including fatal events and renal failure requiring dialysis, has occurred in patients treated with VENCLEXTA.' },
  { title: 'Neutropenia', content: 'Grade 3 or 4 neutropenia occurred in patients treated with VENCLEXTA in combination with azacitidine or decitabine. Monitor blood counts and for signs of infection; manage as medically appropriate.' },
  { title: 'Infections', content: 'Fatal and serious infections such as pneumonia and sepsis have occurred in patients treated with VENCLEXTA. Monitor patients for signs and symptoms of infection and treat promptly.' },
  { title: 'Embryo-Fetal Toxicity', content: 'VENCLEXTA may cause embryo-fetal harm when administered to a pregnant woman. Advise females of reproductive potential to use effective contraception during treatment and for at least 30 days after the last dose.' },
  { title: 'Drug Interactions', content: 'Concomitant use with strong or moderate CYP3A inhibitors or P-gp inhibitors increases VENCLEXTA exposure, which may increase VENCLEXTA toxicities, including risk of TLS.' },
];

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
 * Main transform - exports as object with transform method
 */
export default {
  transform: ({ document, url, html, params }) => {
    // eslint-disable-next-line no-console
    console.log('[VENCLEXTA IMPORT] Transform called with URL:', url);

    // Get the slide image before clearing
    const slideImg = document.querySelector('.ssweaverSlide img.slide');
    const imgSrc = slideImg?.src || '';

    // eslint-disable-next-line no-console
    console.log('[VENCLEXTA IMPORT] Found slide image:', imgSrc);

    // Clear the body completely
    const { body } = document;
    body.innerHTML = '';

    // --- HERO BLOCK ---
    // Model has 3 fields: image (reference), imageAlt (text), text (richtext)
    // Table structure must be ONE ROW with 3 COLUMNS:
    // | Hero |
    // | image | imageAlt | text |

    // Column 1: image
    const img = document.createElement('img');
    img.src = imgSrc || '/content/dam/venclexta/aml-home.png';
    img.alt = 'AML Hero Banner';

    // Column 2: imageAlt (plain text)
    const imageAlt = 'AML Hero Banner';

    // Column 3: text (richtext content)
    const textContent = document.createElement('div');

    // Headline as strong
    const headline = document.createElement('p');
    const headlineStrong = document.createElement('strong');
    headlineStrong.textContent = VIEW_CONTENT.heroHeadline;
    headline.appendChild(headlineStrong);
    textContent.appendChild(headline);

    // Subhead as h1
    const subhead = document.createElement('h1');
    subhead.textContent = VIEW_CONTENT.heroSubhead;
    textContent.appendChild(subhead);

    // Stats paragraphs
    VIEW_CONTENT.heroStats.split('\n\n').forEach((line) => {
      const p = document.createElement('p');
      p.textContent = line;
      textContent.appendChild(p);
    });

    // Description
    const descP = document.createElement('p');
    descP.textContent = VIEW_CONTENT.heroDescription;
    textContent.appendChild(descP);

    // CTA buttons as paragraph with links
    VIEW_CONTENT.buttons.forEach((btn) => {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = btn.link;
      a.textContent = btn.label;
      p.appendChild(a);
      textContent.appendChild(p);
    });

    // Single row with 3 columns matching the 3 model fields
    const heroRows = [[img, imageAlt, textContent]];

    body.appendChild(createBlock(document, 'Hero', heroRows));

    // --- SECTION BREAK ---
    body.appendChild(document.createElement('hr'));

    // --- ISI CONTENT (as default content) ---
    ISI_SECTIONS.forEach((section) => {
      const titleP = document.createElement('p');
      const titleStrong = document.createElement('strong');
      titleStrong.textContent = section.title;
      titleP.appendChild(titleStrong);
      body.appendChild(titleP);

      const contentP = document.createElement('p');
      contentP.textContent = section.content;
      body.appendChild(contentP);
    });

    // PI link
    const piP = document.createElement('p');
    piP.appendChild(document.createTextNode('Please see accompanying full '));
    const piLink = document.createElement('a');
    piLink.href = 'https://www.rxabbvie.com/pdf/venclexta.pdf';
    piLink.textContent = 'Prescribing Information';
    piP.appendChild(piLink);
    piP.appendChild(document.createTextNode('.'));
    body.appendChild(piP);

    // Trademark
    const tmP = document.createElement('p');
    tmP.textContent = 'VENCLEXTA® and its design are registered trademarks of AbbVie Inc.';
    body.appendChild(tmP);

    // --- SECTION BREAK ---
    body.appendChild(document.createElement('hr'));

    // --- METADATA BLOCK ---
    body.appendChild(createBlock(document, 'Metadata', [
      ['title', 'Venclexta AML Home - US-VEN-250060'],
      ['description', 'Clinical efficacy and safety information for newly diagnosed AML patients'],
    ]));

    // Return array of { element, path }
    return [{
      element: body,
      path: '/venclexta/aml-home',
    }];
  },
};
