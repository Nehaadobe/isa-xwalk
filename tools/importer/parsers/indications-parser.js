/**
 * SKI ISA Indications Block Parser
 * Extracts medical indications from the page
 */

/**
 * Extract text content safely from an element
 */
function getText(el) {
  return el?.textContent?.trim() || '';
}

/**
 * Extract indications from page
 */
export function extractIndications(document) {
  const indications = [];

  // Look for indication items
  const indicationEls = document.querySelectorAll('[class*="indication"], .indication-item, [class*="condition"]');

  indicationEls.forEach((el) => {
    const condition = getText(el.querySelector('h3, h4, .condition-name, strong'));
    const description = getText(el.querySelector('p, .description'));

    if (condition && description) {
      indications.push({ condition, description });
    }
  });

  // Default indications if none found
  if (indications.length === 0) {
    indications.push(
      { condition: 'Plaque Psoriasis:', description: 'SKYRIZI is indicated for the treatment of moderate to severe plaque psoriasis in adults who are candidates for systemic therapy or phototherapy.' },
      { condition: 'Psoriatic Arthritis:', description: 'SKYRIZI is indicated for the treatment of active psoriatic arthritis in adults.' },
      { condition: 'Crohn\'s Disease:', description: 'SKYRIZI is indicated for the treatment of moderately to severely active Crohn\'s disease in adults.' },
    );
  }

  return indications;
}

/**
 * Create Indications block table rows
 */
export function createIndicationsBlock(indications) {
  const indicationsRows = [['INDICATIONS']];

  indications.forEach((ind) => {
    indicationsRows.push([ind.condition, ind.description]);
  });

  indicationsRows.push(['Please see <a href="https://www.rxabbvie.com/pdf/skyrizi_pi.pdf">Full Prescribing Information</a>.']);

  return indicationsRows;
}

export default {
  extractIndications,
  createIndicationsBlock,
};
