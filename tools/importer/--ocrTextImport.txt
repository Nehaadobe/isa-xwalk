/*
 * Venclexta Pharma Site Import Script with OCR Support
 * Extracts text from image-based SSWeaver presentations using Tesseract.js
 * Falls back to static content mapping if OCR fails
 *
 * Hero model fields: image, imageAlt, text
 */

/* global Tesseract */

// Fallback content mapping (used when OCR fails or for validation)
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
 * Load Tesseract.js dynamically
 */
async function loadTesseract() {
  if (typeof Tesseract !== 'undefined') {
    return Tesseract;
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@4/dist/tesseract.min.js';
    script.onload = () => {
      console.log('[OCR] Tesseract.js loaded successfully');
      resolve(window.Tesseract);
    };
    script.onerror = () => {
      console.warn('[OCR] Failed to load Tesseract.js, using fallback content');
      reject(new Error('Failed to load Tesseract.js'));
    };
    document.head.appendChild(script);
  });
}

/**
 * Perform OCR on an image
 * @param {string} imageSrc - Image URL or data URL
 * @returns {Promise<string>} - Extracted text
 */
async function performOCR(imageSrc) {
  try {
    const tesseract = await loadTesseract();

    console.log('[OCR] Starting OCR on image:', imageSrc);

    const result = await tesseract.recognize(imageSrc, 'eng', {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          console.log(`[OCR] Progress: ${Math.round(m.progress * 100)}%`);
        }
      },
    });

    console.log('[OCR] OCR completed, confidence:', result.data.confidence);
    return result.data.text;
  } catch (error) {
    console.error('[OCR] OCR failed:', error.message);
    return null;
  }
}

/**
 * Parse OCR text into structured content
 * @param {string} ocrText - Raw OCR text
 * @returns {Object} - Structured content
 */
function parseOCRText(ocrText) {
  if (!ocrText) return null;

  const lines = ocrText.split('\n').filter((line) => line.trim());
  const content = {
    headline: '',
    subhead: '',
    stats: [],
    description: '',
    buttons: [],
  };

  // Pattern matching for pharmaceutical content
  lines.forEach((line) => {
    const trimmed = line.trim();

    // Look for VENCLEXTA headline
    if (trimmed.includes('VENCLEXTA') && trimmed.includes('AZACITIDINE')) {
      content.headline = trimmed;
    }
    // Look for "PATIENTS LIVE LONGER" or similar
    else if (trimmed.includes('PATIENTS') && trimmed.includes('LONGER')) {
      content.subhead = trimmed;
    }
    // Look for statistical data (contains months, CI, HR)
    else if (trimmed.includes('months') || trimmed.includes('CI:') || trimmed.includes('HR=')) {
      content.stats.push(trimmed);
    }
    // Look for VIALE-A study description
    else if (trimmed.includes('VIALE-A') || trimmed.includes('randomized')) {
      content.description += trimmed + ' ';
    }
    // Look for button labels
    else if (
      trimmed.includes('Overall Survival')
      || trimmed.includes('Remission')
      || trimmed.includes('Safety')
      || trimmed.includes('Study Design')
    ) {
      content.buttons.push(trimmed);
    }
  });

  return content;
}

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
 * Build text content element from extracted or fallback content
 */
function buildTextContent(doc, content) {
  const textContent = doc.createElement('div');

  // Headline
  const headline = doc.createElement('p');
  const headlineStrong = doc.createElement('strong');
  headlineStrong.textContent = content.headline || VIEW_CONTENT.heroHeadline;
  headline.appendChild(headlineStrong);
  textContent.appendChild(headline);

  // Subhead
  const subhead = doc.createElement('h1');
  subhead.textContent = content.subhead || VIEW_CONTENT.heroSubhead;
  textContent.appendChild(subhead);

  // Stats
  const statsText = content.stats?.length > 0
    ? content.stats.join('\n\n')
    : VIEW_CONTENT.heroStats;

  statsText.split('\n\n').forEach((line) => {
    const p = doc.createElement('p');
    p.textContent = line;
    textContent.appendChild(p);
  });

  // Description
  const descP = doc.createElement('p');
  descP.textContent = content.description?.trim() || VIEW_CONTENT.heroDescription;
  textContent.appendChild(descP);

  // CTA buttons
  VIEW_CONTENT.buttons.forEach((btn) => {
    const p = doc.createElement('p');
    const a = doc.createElement('a');
    a.href = btn.link;
    a.textContent = btn.label;
    p.appendChild(a);
    textContent.appendChild(p);
  });

  return textContent;
}

/**
 * Main transform with OCR support
 */
export default {
  /**
   * onLoad hook - preload Tesseract.js
   */
  onLoad: async ({ document, url, params }) => {
    console.log('[VENCLEXTA IMPORT] onLoad - preloading OCR engine');
    try {
      await loadTesseract();
      console.log('[VENCLEXTA IMPORT] OCR engine ready');
    } catch (e) {
      console.log('[VENCLEXTA IMPORT] OCR not available, will use fallback content');
    }
  },

  /**
   * Main transform function
   */
  transform: async ({ document, url, html, params }) => {
    console.log('[VENCLEXTA IMPORT] Transform called with URL:', url);

    // Get the slide image
    const slideImg = document.querySelector('.ssweaverSlide img.slide');
    const imgSrc = slideImg?.src || '';
    console.log('[VENCLEXTA IMPORT] Found slide image:', imgSrc);

    // Try OCR extraction
    let extractedContent = null;
    if (imgSrc) {
      console.log('[VENCLEXTA IMPORT] Attempting OCR extraction...');
      const ocrText = await performOCR(imgSrc);
      if (ocrText) {
        console.log('[VENCLEXTA IMPORT] OCR Text:', ocrText.substring(0, 200) + '...');
        extractedContent = parseOCRText(ocrText);
      }
    }

    // Use OCR content or fall back to static mapping
    const content = extractedContent || {
      headline: VIEW_CONTENT.heroHeadline,
      subhead: VIEW_CONTENT.heroSubhead,
      stats: VIEW_CONTENT.heroStats.split('\n\n'),
      description: VIEW_CONTENT.heroDescription,
    };

    console.log('[VENCLEXTA IMPORT] Using content:', extractedContent ? 'OCR extracted' : 'Static fallback');

    // Clear the body
    const { body } = document;
    body.innerHTML = '';

    // --- HERO BLOCK ---
    // Row 1: image
    const img = document.createElement('img');
    img.src = imgSrc || '/content/dam/venclexta/aml-home.png';
    img.alt = 'AML Hero Banner';

    // Row 2: imageAlt
    const imageAlt = 'AML Hero Banner';

    // Row 3: text (richtext)
    const textContent = buildTextContent(document, content);

    // Single column - 3 rows
    const heroRows = [
      [img],
      [imageAlt],
      [textContent],
    ];

    body.appendChild(createBlock(document, 'Hero', heroRows));

    // --- SECTION BREAK ---
    body.appendChild(document.createElement('hr'));

    // --- ISI CONTENT ---
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

    return [{
      element: body,
      path: '/venclexta/aml-home',
    }];
  },
};
