/**
 * Hero Block Decorator
 * Model structure: image, imageAlt, text
 * Row 0: image (reference)
 * Row 1: imageAlt (text)
 * Row 2: text (richtext with headline, stats, CTAs)
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  // Create hero structure
  const heroContent = document.createElement('div');
  heroContent.className = 'hero-content';

  const heroText = document.createElement('div');
  heroText.className = 'hero-text';

  const heroCTAs = document.createElement('div');
  heroCTAs.className = 'hero-ctas';

  let heroImage = null;
  let imageAlt = '';

  rows.forEach((row, index) => {
    const cols = [...row.querySelectorAll(':scope > div')];
    const content = cols[0];

    // Row 0: Background image
    if (index === 0) {
      const picture = content?.querySelector('picture');
      const img = content?.querySelector('img');
      if (picture) {
        heroImage = picture;
      } else if (img) {
        heroImage = img;
      }
      return;
    }

    // Row 1: Image alt text (for accessibility)
    if (index === 1) {
      imageAlt = content?.textContent?.trim() || '';
      return;
    }

    // Row 2: Richtext content (headline, stats, CTAs)
    if (index === 2 && content) {
      // Process all content elements
      const elements = content.querySelectorAll('p, h1, h2, h3, strong');

      elements.forEach((el) => {
        // Check if element contains links (CTA buttons)
        const link = el.querySelector('a');
        if (link) {
          const btn = document.createElement('a');
          btn.href = link.href;
          btn.className = 'hero-btn';
          btn.textContent = link.textContent;
          heroCTAs.appendChild(btn);
        } else if (el.tagName === 'H1' || el.tagName === 'H2' || el.tagName === 'H3') {
          // Headline elements
          const headline = document.createElement('h1');
          headline.innerHTML = el.innerHTML;
          heroText.appendChild(headline);
        } else if (el.tagName === 'P') {
          // Paragraph content (stats, description)
          const para = document.createElement('p');
          para.innerHTML = el.innerHTML;
          heroText.appendChild(para);
        }
      });

      // If no structured elements found, use innerHTML directly
      if (heroText.children.length === 0 && heroCTAs.children.length === 0) {
        heroText.innerHTML = content.innerHTML;
      }
    }
  });

  // Build hero structure
  block.textContent = '';

  // Add background image with alt text
  if (heroImage) {
    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'hero-image';
    if (imageAlt && heroImage.querySelector('img')) {
      heroImage.querySelector('img').alt = imageAlt;
    } else if (imageAlt && heroImage.tagName === 'IMG') {
      heroImage.alt = imageAlt;
    }
    imageWrapper.appendChild(heroImage);
    block.appendChild(imageWrapper);
  }

  heroContent.appendChild(heroText);
  if (heroCTAs.children.length > 0) {
    heroContent.appendChild(heroCTAs);
  }

  block.appendChild(heroContent);
}
