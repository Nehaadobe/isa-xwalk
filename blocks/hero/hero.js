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
  let isFirstTextRow = true;

  rows.forEach((row, index) => {
    const cols = [...row.querySelectorAll(':scope > div')];

    // First row: image
    if (index === 0) {
      const picture = cols[0]?.querySelector('picture');
      const img = cols[0]?.querySelector('img');
      if (picture) {
        heroImage = picture;
      } else if (img) {
        heroImage = img;
      }
      return;
    }

    // Check if row contains links (CTA buttons)
    const hasLinks = cols[0]?.querySelector('a');

    if (hasLinks) {
      // CTA button row
      cols.forEach((col) => {
        const links = col.querySelectorAll('a');
        links.forEach((link) => {
          const btn = document.createElement('a');
          btn.href = link.href;
          btn.className = 'hero-btn';
          btn.textContent = link.textContent;
          heroCTAs.appendChild(btn);
        });
      });
    } else {
      // Text content row
      const textContent = cols[0];
      if (textContent) {
        const html = textContent.innerHTML.trim();
        if (html) {
          if (isFirstTextRow) {
            // Main headline - parse and structure it
            const headline = document.createElement('h1');
            headline.innerHTML = html;
            heroText.appendChild(headline);
            isFirstTextRow = false;
          } else {
            // Other text rows
            const para = document.createElement('p');
            para.innerHTML = html;
            heroText.appendChild(para);
          }
        }
      }
    }
  });

  // Build hero structure
  block.textContent = '';

  if (heroImage) {
    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'hero-image';
    imageWrapper.appendChild(heroImage);
    block.appendChild(imageWrapper);
  }

  heroContent.appendChild(heroText);
  if (heroCTAs.children.length > 0) {
    heroContent.appendChild(heroCTAs);
  }

  block.appendChild(heroContent);
}
