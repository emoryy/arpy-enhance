/**
 * Quick Filter Module
 * Handles quick filtering of favorites list
 */

/**
 * Apply quick filter to favorites list
 * Filters list items based on text content matching
 */
export function applyQuickFilter() {
  const filterInput = document.querySelector('.quick-filter-input');
  if (!filterInput) return;

  const term = filterInput.value?.toLowerCase();
  document.querySelectorAll("#favorites-list li").forEach((li) => {
    if (!term || li.textContent.toLowerCase().includes(term) || li.querySelector('input')?.value?.toLowerCase().includes(term)) {
      li.style.display = '';
    } else {
      li.style.display = 'none';
    }
  });
}

/**
 * Setup quick filter input listener
 */
export function setupQuickFilter() {
  const filterInput = document.querySelector('.quick-filter-input');
  if (filterInput) {
    filterInput.addEventListener('input', applyQuickFilter);
  }
}
