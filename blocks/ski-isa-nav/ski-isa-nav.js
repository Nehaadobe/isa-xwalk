/**
 * SKI ISA Navigation Block
 * Displays bottom navigation tabs for ISA sections
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  // Create nav structure
  const navWrapper = document.createElement('nav');
  navWrapper.className = 'ski-isa-nav-wrapper';
  navWrapper.setAttribute('role', 'navigation');
  navWrapper.setAttribute('aria-label', 'ISA Navigation');

  // Nav items container
  const navItems = document.createElement('ul');
  navItems.className = 'ski-isa-nav-items';

  rows.forEach((row) => {
    const cols = [...row.querySelectorAll(':scope > div')];

    cols.forEach((col) => {
      const link = col.querySelector('a');
      const text = col.textContent?.trim();

      if (text) {
        const navItem = document.createElement('li');
        navItem.className = 'ski-isa-nav-item';

        if (link) {
          const navLink = document.createElement('a');
          navLink.href = link.href;
          navLink.className = 'ski-isa-nav-link';
          navLink.textContent = text;

          // Check if this is the active item
          const currentPath = window.location.pathname;
          if (link.href.includes(currentPath) || link.href.endsWith(currentPath)) {
            navLink.classList.add('active');
            navLink.setAttribute('aria-current', 'page');
          }

          navItem.appendChild(navLink);
        } else {
          const navText = document.createElement('span');
          navText.className = 'ski-isa-nav-text';
          navText.textContent = text;
          navItem.appendChild(navText);
        }

        navItems.appendChild(navItem);
      }
    });
  });

  navWrapper.appendChild(navItems);

  block.textContent = '';
  block.appendChild(navWrapper);
}
