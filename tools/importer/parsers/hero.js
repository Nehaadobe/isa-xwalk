/**
 * Hero Block Parser
 * Parses pharmaceutical slide hero sections
 */

export function parseHeroBlock(slideElement, document) {
  const heroImage = slideElement.querySelector('img.slide');

  if (!heroImage) return null;

  const block = {
    name: 'Hero',
    rows: [],
  };

  // Get the main slide image
  const imageSrc = heroImage.src || heroImage.dataset.src;
  if (imageSrc) {
    const img = document.createElement('img');
    img.src = imageSrc;
    img.alt = 'Hero image';

    // Extract any overlay text from the slide
    const overlayText = extractOverlayText(slideElement);

    block.rows.push([img, overlayText || '']);
  }

  return block;
}

/**
 * Extract text content from slide overlays
 */
function extractOverlayText(slideElement) {
  const textElements = slideElement.querySelectorAll('h1, h2, h3, p, .headline, .subheadline');
  const texts = [];

  textElements.forEach((el) => {
    const text = el.textContent.trim();
    if (text) texts.push(text);
  });

  return texts.join('\n');
}
