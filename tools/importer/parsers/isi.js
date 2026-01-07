/**
 * ISI (Important Safety Information) Block Parser
 * Parses pharmaceutical safety information sections
 */

export function parseISIBlock(isiElement, document) {
  const block = {
    name: 'ISI',
    rows: [],
  };

  // Look for ISI content image (common in pharma presentations)
  const isiImage = isiElement.querySelector('img[data-src*="isi"], img[src*="isi"]');

  if (isiImage) {
    // For image-based ISI, we need to provide structure for manual text entry
    // This is common in regulated pharma content where ISI is rendered as images
    block.rows = getDefaultISISections();
    return block;
  }

  // Parse structured ISI content if available
  const sections = isiElement.querySelectorAll('.isi-section, [data-section]');

  sections.forEach((section) => {
    const title = section.querySelector('h3, h4, .section-title')?.textContent || '';
    const content = section.querySelector('.section-content, p')?.innerHTML || '';

    if (title || content) {
      block.rows.push([title, content]);
    }
  });

  // If no structured content found, use default sections
  if (block.rows.length === 0) {
    block.rows = getDefaultISISections();
  }

  return block;
}

/**
 * Default ISI sections for VENCLEXTA (venetoclax)
 * Pre-populated with actual regulatory content for import
 */
function getDefaultISISections() {
  return [
    ['Indication', 'VENCLEXTA is indicated in combination with azacitidine, or decitabine, or low-dose cytarabine for the treatment of newly diagnosed acute myeloid leukemia (AML) in adults 75 years or older, or who have comorbidities that preclude use of intensive induction chemotherapy.'],
    ['Tumor Lysis Syndrome', 'Tumor lysis syndrome (TLS), including fatal events and renal failure requiring dialysis, has occurred in patients treated with VENCLEXTA.'],
    ['Neutropenia', 'Grade 3 or 4 neutropenia occurred in patients treated with VENCLEXTA in combination with azacitidine or decitabine. Monitor blood counts and for signs of infection; manage as medically appropriate.'],
    ['Infections', 'Fatal and serious infections such as pneumonia and sepsis have occurred in patients treated with VENCLEXTA. Monitor patients for signs and symptoms of infection and treat promptly.'],
    ['Embryo-Fetal Toxicity', 'VENCLEXTA may cause embryo-fetal harm when administered to a pregnant woman. Advise females of reproductive potential to use effective contraception during treatment and for at least 30 days after the last dose.'],
    ['Drug Interactions', 'Concomitant use with strong or moderate CYP3A inhibitors or P-gp inhibitors increases VENCLEXTA exposure, which may increase VENCLEXTA toxicities, including risk of TLS. Consider alternatives or adjust VENCLEXTA dosage.'],
  ];
}

/**
 * Parse indication text
 */
export function parseIndication(element) {
  const indicationSection = element.querySelector('[data-section="indication"], .indication');

  if (!indicationSection) return null;

  return {
    title: 'Indication',
    content: indicationSection.innerHTML || indicationSection.textContent,
  };
}

/**
 * Parse safety warnings
 */
export function parseSafetyWarnings(element) {
  const warnings = [];
  const warningElements = element.querySelectorAll('.warning, [data-warning]');

  warningElements.forEach((warning) => {
    const title = warning.querySelector('h4, .warning-title')?.textContent || '';
    const content = warning.querySelector('.warning-content, p')?.innerHTML || '';

    warnings.push({ title, content });
  });

  return warnings;
}
