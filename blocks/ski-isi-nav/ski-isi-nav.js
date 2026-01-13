/**
 * SKI ISI Navigation Block
 * Bottom navigation bar for SKYRIZI pages
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  // Create nav wrapper
  const navWrapper = document.createElement('nav');
  navWrapper.className = 'ski-isi-nav-wrapper';
  navWrapper.setAttribute('role', 'navigation');
  navWrapper.setAttribute('aria-label', 'Page navigation');

  // Extract links from first row
  const firstRow = rows[0];
  if (firstRow) {
    const links = firstRow.querySelectorAll('a');
    links.forEach((link) => {
      const navItem = document.createElement('a');
      navItem.href = link.href;
      navItem.textContent = link.textContent.trim();
      navItem.className = 'ski-isi-nav-item';

      // Mark active based on current URL
      if (window.location.pathname.includes(link.getAttribute('href'))) {
        navItem.classList.add('active');
        navItem.setAttribute('aria-current', 'page');
      }

      navWrapper.appendChild(navItem);
    });
  }

  block.textContent = '';
  block.appendChild(navWrapper);
}
