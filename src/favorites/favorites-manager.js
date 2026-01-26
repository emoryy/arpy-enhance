/**
 * Favorites Manager Module
 * Manages favorite project/category combinations
 */

import { getStorageJSON, setStorageJSON } from '../utils/storage.js';

// Favorites array - will be populated from localStorage
export let favorites = [];

// Sort order state
let favoriteSortOrder = localStorage.getItem('arpyEnhanceFavoriteSortOrder') || 'default';
let favoriteSortReversed = localStorage.getItem('arpyEnhanceFavoriteSortReversed') === 'true';

// External dependencies (will be set by main.js)
let status = null;
let copyTextToClipboard = null;
let fetchAndCache = null;
let applyQuickFilter = null;

/**
 * Initialize favorites manager with dependencies
 */
export function initFavoritesManager(deps) {
  status = deps.status;
  copyTextToClipboard = deps.copyTextToClipboard;
  fetchAndCache = deps.fetchAndCache;
  applyQuickFilter = deps.applyQuickFilter;
}

/**
 * Load favorites from localStorage
 */
export function loadFavorites() {
  const stored = getStorageJSON('favorites');
  if (stored) {
    favorites.length = 0;
    favorites.push(...stored);
  }
  return favorites;
}

/**
 * Save favorites to localStorage
 */
export function saveFavorites() {
  setStorageJSON('favorites', favorites);
}

/**
 * Get full label parts for a favorite (category / project / list / item)
 */
export function getFullLabelPartsForFav(fav) {
  const projectDropdown = document.getElementById('project_id');
  const projectOption = projectDropdown.querySelector(`option[value="${fav.project_id.value}"]`);
  const categoryLabel = projectOption ? projectOption.parentElement.getAttribute('label') : '?';
  return [
    categoryLabel,
    fav.project_id?.label,
    fav.todo_list_id?.label || '-',
    fav.todo_item_id?.label || '-'
  ];
}

/**
 * Find todo data by full label string
 */
export function findTodoDataByFullLabelString(_fullLabelString) {
  // first try find it among favorites
  function removeDays(str) {
    return str.replace(/\W?\(\d+(,\d+)? nap\)\W?/,"").replace(/\W?\(\d+(\.\d+)?d\)\W?/,"").replace(/  +/g, ' ');
  }
  const fullLabelString = removeDays(_fullLabelString);
  const favorite = favorites.find((fav) => {
    const fullLabelForFav = removeDays(getFullLabelPartsForFav(fav).join(" / ")).trim();
    return fullLabelString === fullLabelForFav
  });
  return favorite;
}

/**
 * Add a new favorite from the current form data
 */
export function addNewFavorite() {
  const formData = $('form[action="/timelog"]').serializeArray();
  const fav = {
    label: '',
    id: `${new Date().getTime()}${(Math.round(Math.random() * 1000))}`
  };
  let saveable = true;
  ["project_id", "todo_list_id", "todo_item_id"].forEach(
    (propName) => {
      const formDataItem = formData.find((item) => item.name === propName);
      if (formDataItem) {
        fav[propName] = {
          label: $(`form[action="/timelog"] [value="${formDataItem.value}"]`).html(),
          value: formDataItem.value
        };
      }
    }
  );
  if (!saveable) {
    return status("Nincs meghatározva a projekt/kategória!", "error");
  }
  favorites.push(fav);
  saveFavorites();
  displayFavoriteElement(fav);
}

/**
 * Update a favorite's label
 */
function updateFav(id, label) {
  const fav = favorites.find((f) => f.id === id);
  fav.label = label ? label : "";
  saveFavorites();
}

/**
 * Check validity of all favorites
 */
export async function checkFavoritesValidity() {
  console.log("Starting full validation of favorites...");
  const projectOptions = new Map(
    Array.from(document.querySelectorAll('#project_id option')).map((opt) => [opt.value, opt])
  );

  const validationPromises = favorites.map(async (fav) => {
    // Assume the favorite is valid until a check fails
    fav.isInvalid = false;

    // 1. Check if the Project exists in the main dropdown.
    if (!fav.project_id?.value || !projectOptions.has(fav.project_id.value)) {
      fav.isInvalid = true;
      return; // Stop checking if the project is gone
    }

    // A favorite with only a project is valid at this point.
    // If there's no todo_list_id, we're done with this favorite.
    if (!fav.todo_list_id?.value) {
      return;
    }

    // 2. Fetch and check if the Todo List exists for that project.
    const todoLists = await fetchAndCache(
      `/get_todo_lists?project_id=${fav.project_id.value}&show_completed=false`,
      `projectId-${fav.project_id.value}`
    );

    // Note: Using '==' for loose comparison as IDs can be string/number
    const todoListExists = todoLists.some((list) => list.id == fav.todo_list_id.value);
    if (!todoListExists) {
      fav.isInvalid = true;
      return; // Stop checking if the list is gone
    }

    // A favorite with a project + list is valid at this point.
    // If there's no todo_item_id, we're done.
    if (!fav.todo_item_id?.value) {
      return;
    }

    // 3. Fetch and check if the Todo Item exists for that list.
    const todoItems = await fetchAndCache(
      `/get_todo_items?todo_list_id=${fav.todo_list_id.value}&show_completed=false`,
      `todoListId-${fav.todo_list_id.value}`
    );

    const todoItemExists = todoItems.some(item => item.id == fav.todo_item_id.value);
    if (!todoItemExists) {
      fav.isInvalid = true;
    }
  });

  // Wait for all the asynchronous validation checks to complete.
  await Promise.all(validationPromises);
  console.log("Favorite validation complete.");
}

/**
 * Helper function to remove element from array
 */
function remove(array, element) {
  return array.filter(e => e !== element);
}

/**
 * Display a favorite element in the favorites list
 */
function displayFavoriteElement(fav) {
  const labelParts = getFullLabelPartsForFav(fav);
  const newLi = $(`
    <li>
      ${labelParts.map((part) => `<span class="label label-info">${part}</span>`).join("\n")}
    </li>
  `);
  if (fav.isInvalid) {
    newLi.prepend('<span class="label label-important" title="Ez a kategória már nem létezik vagy lezárásra került.">LEZÁRT</span> ');
  }
  const labelInput = $('<input placeholder="- címke helye -">');
  labelInput.val(fav.label);
  labelInput.change(function() {
    updateFav(fav.id, this.value);
  });
  newLi.prepend(labelInput);

  const copyButton = $('<button title="Másolás vágólapra" class="btn btn-mini" type="button">📋</button>');
  copyButton.button().on("click", () => copyTextToClipboard(labelParts.join(" / ")));
  const removeButton = $('<button title="Törlés" class="btn btn-mini delete" type="button">&#10006;</button>');
  removeButton.button().on("click", function() {
    if (window.confirm(`Biztosan törölni akarod ezt az elemet?\n${labelParts.join(" / ")}`)) {
      removeFav(fav.id);
    }
  });

  newLi.append(copyButton);
  newLi.append(removeButton);
  $('#favorites-list').append(newLi);
}

/**
 * Setup favorite sorting controls
 */
export function setupFavoriteSorting() {
  const sortControls = document.getElementById('fav-sort-controls');
  sortControls.addEventListener('click', (e) => {
    const button = e.target.closest('button');
    if (!button) {
      return;
    }

    const newSortOrder = button.dataset.sort;
    if (newSortOrder === favoriteSortOrder) {
      // Clicking the same button - toggle reverse
      favoriteSortReversed = !favoriteSortReversed;
      localStorage.setItem('arpyEnhanceFavoriteSortReversed', favoriteSortReversed);
    } else {
      // Clicking a different button - change sort order and reset reverse
      favoriteSortOrder = newSortOrder;
      favoriteSortReversed = false;
      localStorage.setItem('arpyEnhanceFavoriteSortOrder', newSortOrder);
      localStorage.setItem('arpyEnhanceFavoriteSortReversed', 'false');
    }
    renderFavs();
    if (applyQuickFilter) {
      applyQuickFilter();
    }
  });
}

/**
 * Render all favorites
 */
export function renderFavs() {
  $('#favorites-list').empty();

  const favoritesToRender = [...favorites]; // Create a copy to avoid modifying the original add-order

  if (favoriteSortOrder === 'label') {
    favoritesToRender.sort((a, b) => (a.label || '').localeCompare(b.label || '', 'hu'));
  } else if (favoriteSortOrder === 'category') {
    favoritesToRender.sort((a, b) => {
      const fullLabelA = getFullLabelPartsForFav(a).join(' / ');
      const fullLabelB = getFullLabelPartsForFav(b).join(' / ');
      return fullLabelA.localeCompare(fullLabelB, 'hu');
    });
  }
  // 'default' order requires no sorting, as we're using the original array's order.

  // Apply reverse if needed
  if (favoriteSortReversed) {
    favoritesToRender.reverse();
  }

  favoritesToRender.forEach(displayFavoriteElement);

  // Update the active state on the sort buttons and add sort direction indicator
  $('#fav-sort-controls .btn').removeClass('active btn-primary sort-asc sort-desc');
  const activeButton = $(`#fav-sort-controls .btn[data-sort="${favoriteSortOrder}"]`);
  activeButton.addClass('active btn-primary');

  // Add sort direction class for CSS pseudo-element (for all sort types including default)
  activeButton.addClass(favoriteSortReversed ? 'sort-desc' : 'sort-asc');
}

/**
 * Remove a favorite by ID
 */
function removeFav(id) {
  const fav = favorites.find((f) => f.id === id);
  const remaining = remove(favorites, fav);
  favorites.length = 0;
  favorites.push(...remaining);

  saveFavorites();
  renderFavs();
  if (applyQuickFilter) {
    applyQuickFilter();
  }
}

/**
 * Update clear button visibility based on invalid favorites count
 */
export function updateClearButtonVisibility() {
  const invalidCount = favorites.filter((fav) => fav.isInvalid).length;
  const clearButton = $('#clear-invalid-favs-button');
  if (invalidCount > 0) {
    clearButton.text(`✖ [${invalidCount}]`).show();
  } else {
    clearButton.hide();
  }
}

/**
 * Setup clear invalid button click handler
 */
export function setupClearInvalidButton() {
  $('#clear-invalid-favs-button').on('click', () => {
    const invalidFavs = favorites.filter((fav) => fav.isInvalid);
    if (invalidFavs.length === 0) {
      return; // Safety check
    }

    if (window.confirm(`Biztosan törölni akarod a(z) ${invalidFavs.length} lejárt kedvencet?`)) {
      // Keep only the valid favorites
      const validFavs = favorites.filter((fav) => !fav.isInvalid);
      favorites.length = 0;
      favorites.push(...validFavs);
      saveFavorites();
      renderFavs();
      updateClearButtonVisibility(); // Re-check visibility, which will hide the button
      if (applyQuickFilter) {
        applyQuickFilter();
      }
    }
  });
}
