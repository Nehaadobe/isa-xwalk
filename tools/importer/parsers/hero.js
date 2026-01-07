/**
 * Hero Block Parser
 * Parses pharmaceutical slide hero sections
 * Supports content mapping for image-based slides where text is embedded in images
 */

export function parseHeroBlock(slideElement, document, viewContent = {}) {
  const heroImage = slideElement.querySelector('img.slide');

  if (!heroImage) return null;

  const block = {
    name: 'Hero',
    rows: [],
  };

  // Get the main slide image
  const imageSrc = heroImage.src || heroImage.dataset.src;
  if (imageSrc) {
    // Row 1: Background image
    block.rows.push([`![Hero Background](${imageSrc})`]);

    // Row 2: Headline text (from content mapping or extracted)
    const overlayText = extractOverlayText(slideElement);
    const headline = viewContent.heroHeadline || '';
    const subhead = viewContent.heroSubhead || '';
    const bodyText = viewContent.heroText || overlayText || '';

    // Build formatted content
    let textContent = '';
    if (headline) {
      textContent += `**${headline}**\n`;
    }
    if (subhead) {
      textContent += `# ${subhead}\n`;
    }
    if (bodyText) {
      textContent += `\n${bodyText}`;
    }

    if (textContent) {
      block.rows.push([textContent.trim()]);
    }

    // Row 3: CTA buttons from content mapping
    if (viewContent.buttons && viewContent.buttons.length > 0) {
      const buttonLinks = viewContent.buttons.map((btn) => {
        return `[${btn.label}](${btn.link})`;
      }).join('\n');
      block.rows.push([buttonLinks]);
    }
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
