/**
 * Advanced Selector Module
 * Provides an advanced UI for selecting and managing favorites with multi-select capability
 */

import { favorites, saveFavorites, renderFavs, getFullLabelPartsForFav } from './favorites-manager.js';

// State management
let selectedProjectId = null;
let selectedTodoListId = null;
let selectedTodoItemIds = new Set(); // Multi-select for items
let isDropdownOpen = false;

// Data cache for search
let allProjects = [];
let loadedTodoLists = [];
let loadedTodoItems = [];

// External dependencies
let fetchAndCache = null;
let applyQuickFilter = null;

// Debounce timer
let searchDebounceTimer = null;

// Previous search terms to track changes per column
let previousSearchTerms = ['', '', ''];

/**
 * Fuzzy match with scoring
 * Returns score (higher = better match), or 0 if no match
 * Scoring prioritizes:
 * - Exact prefix match (highest)
 * - Word boundary matches
 * - Consecutive character matches
 * - Earlier matches in string
 */
function fuzzyMatchScore(text, pattern) {
  if (!pattern) return 1;
  if (!text) return 0;

  const textLower = text.toLowerCase();
  const patternLower = pattern.toLowerCase();

  // Check for exact prefix match (best match)
  if (textLower.startsWith(patternLower)) {
    return 1000 + pattern.length;
  }

  // Check for word boundary match
  const words = textLower.split(/[\s\-_\/]/);
  for (const word of words) {
    if (word.startsWith(patternLower)) {
      return 500 + pattern.length;
    }
  }

  // Fuzzy match with scoring
  let score = 0;
  let patternIdx = 0;
  let consecutiveMatches = 0;

  for (let i = 0; i < textLower.length && patternIdx < patternLower.length; i++) {
    if (textLower[i] === patternLower[patternIdx]) {
      patternIdx++;
      consecutiveMatches++;
      // Bonus for consecutive matches
      score += consecutiveMatches * 2;
      // Bonus for early matches
      score += (100 - i);
    } else {
      consecutiveMatches = 0;
    }
  }

  // Return 0 if pattern not fully matched
  if (patternIdx < patternLower.length) {
    return 0;
  }

  return score;
}

/**
 * Filter and sort array by fuzzy matching score
 */
function fuzzyFilter(items, pattern) {
  if (!pattern) return items;

  // Score and filter
  const scored = items
    .map(item => {
      const text = item.label || item.name || item.content || '';
      const score = fuzzyMatchScore(text, pattern);
      return { item, score };
    })
    .filter(result => result.score > 0)
    .sort((a, b) => b.score - a.score); // Sort by score descending

  return scored.map(result => result.item);
}

/**
 * Initialize advanced selector with dependencies
 */
export function initAdvancedSelector(deps) {
  fetchAndCache = deps.fetchAndCache;
  applyQuickFilter = deps.applyQuickFilter;
}

/**
 * Setup advanced selector event handlers
 */
export function setupAdvancedSelector() {
  const triggerBtn = document.getElementById('advanced-selector-trigger');
  const dropdown = document.getElementById('advanced-selector-dropdown');
  const searchInput = document.getElementById('advanced-selector-search');

  if (!triggerBtn || !dropdown || !searchInput) {
    console.error('Advanced selector elements not found');
    return;
  }

  // Toggle dropdown
  triggerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDropdown();
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (isDropdownOpen && !dropdown.contains(e.target)) {
      closeDropdown();
    }
  });

  // Prevent dropdown from closing when clicking inside
  dropdown.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // Search input handler with debounce
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
      handleUnifiedSearch(e.target.value);
    }, 300); // 300ms debounce
  });

  // Keyboard navigation handler
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleEnterKey();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      navigateItems('down');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      navigateItems('up');
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeDropdown();
    }
  });

  // Focus search input when dropdown opens
  // (will be called from openDropdown)

  // Initial load
  loadProjects();
}

/**
 * Toggle dropdown visibility
 */
function toggleDropdown() {
  if (isDropdownOpen) {
    closeDropdown();
  } else {
    openDropdown();
  }
}

/**
 * Open dropdown
 */
function openDropdown() {
  const dropdown = document.getElementById('advanced-selector-dropdown');
  const searchInput = document.getElementById('advanced-selector-search');
  dropdown.style.display = 'block';
  isDropdownOpen = true;
  loadProjects();

  // Focus search input
  setTimeout(() => {
    if (searchInput) {
      searchInput.focus();
    }
  }, 100);
}

/**
 * Close dropdown
 */
function closeDropdown() {
  const dropdown = document.getElementById('advanced-selector-dropdown');
  const searchInput = document.getElementById('advanced-selector-search');
  dropdown.style.display = 'none';
  isDropdownOpen = false;

  // Clear search input
  if (searchInput) {
    searchInput.value = '';
  }

  // Reset search terms tracking for fresh state on reopen
  previousSearchTerms = ['', '', ''];
}

/**
 * Handle Enter key - add/remove selected item from favorites
 */
function handleEnterKey() {
  const selectedItem = document.querySelector('#advanced-selector-items .advanced-selector-item.selected');
  if (!selectedItem) return;

  const addBtn = selectedItem.querySelector('.btn-success');
  const removeBtn = selectedItem.querySelector('.btn-danger');

  if (addBtn) {
    addBtn.click();
  } else if (removeBtn) {
    removeBtn.click();
  }
}

/**
 * Navigate through items in the third column with arrow keys
 */
function navigateItems(direction) {
  const itemsContainer = document.getElementById('advanced-selector-items');
  const items = Array.from(itemsContainer.querySelectorAll('.advanced-selector-item'));

  if (items.length === 0) return;

  const currentSelected = items.findIndex(item => item.classList.contains('selected'));

  let newIndex;
  if (currentSelected === -1) {
    // No selection - select first or last
    newIndex = direction === 'down' ? 0 : items.length - 1;
  } else {
    // Move selection
    if (direction === 'down') {
      newIndex = Math.min(currentSelected + 1, items.length - 1);
    } else {
      newIndex = Math.max(currentSelected - 1, 0);
    }
  }

  // Update selection
  items.forEach(item => item.classList.remove('selected'));
  items[newIndex].classList.add('selected');

  // Scroll into view
  items[newIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

/**
 * Handle unified fuzzy search across all three columns
 * Search terms are space-separated: "term1 term2 term3"
 * - term1 filters projects
 * - term2 filters todo lists (after selecting first matching project)
 * - term3 filters todo items (after selecting first matching list)
 * Only changes selection for a column if its corresponding search term changed.
 * @param {string} searchString - The search query
 * @param {string} [preserveItemId] - Optional item ID to preserve selection
 */
async function handleUnifiedSearch(searchString, preserveItemId = null) {
  const terms = searchString.trim().split(/\s+/).filter(t => t.length > 0);

  // Pad terms array to 3 elements for comparison
  const currentTerms = [terms[0] || '', terms[1] || '', terms[2] || ''];

  // Check which terms changed
  const term0Changed = currentTerms[0] !== previousSearchTerms[0];
  const term1Changed = currentTerms[1] !== previousSearchTerms[1];
  const term2Changed = currentTerms[2] !== previousSearchTerms[2];

  if (terms.length === 0) {
    // No search terms - show all projects, clear other columns
    selectedProjectId = null;
    selectedTodoListId = null;
    selectedTodoItemIds.clear();
    renderProjects(allProjects);
    document.getElementById('advanced-selector-categories').innerHTML = '';
    document.getElementById('advanced-selector-items').innerHTML = '';
    previousSearchTerms = ['', '', ''];
    return;
  }

  // Term 1: Filter projects
  const matchingProjects = fuzzyFilter(allProjects, terms[0]);
  renderProjects(matchingProjects);

  if (matchingProjects.length > 0) {
    // Only auto-select project if term 0 changed, or no project is currently selected
    let projectToSelect;
    if (term0Changed || !selectedProjectId) {
      projectToSelect = matchingProjects[0];
      selectedProjectId = projectToSelect.value;
      // When project changes, reset downstream selections
      selectedTodoListId = null;
      selectedTodoItemIds.clear();
    } else {
      // Keep current selection if it's still in the filtered list
      projectToSelect = matchingProjects.find(p => p.value == selectedProjectId);
      if (!projectToSelect) {
        // Current selection no longer matches, select first
        projectToSelect = matchingProjects[0];
        selectedProjectId = projectToSelect.value;
        selectedTodoListId = null;
        selectedTodoItemIds.clear();
      }
    }

    // Update project selection UI
    document.querySelectorAll('#advanced-selector-projects .advanced-selector-item').forEach(el => {
      el.classList.remove('selected');
    });
    const projectItem = document.querySelector(`#advanced-selector-projects .advanced-selector-item[data-id="${selectedProjectId}"]`);
    if (projectItem) {
      projectItem.classList.add('selected');
    }

    // Load todo lists for the selected project (if project changed or lists not loaded)
    const needToLoadLists = term0Changed || loadedTodoLists.length === 0 ||
      !document.querySelector('#advanced-selector-categories .advanced-selector-item');

    if (needToLoadLists) {
      document.getElementById('advanced-selector-categories').innerHTML = '<div class="advanced-selector-loading">Betöltés...</div>';
      document.getElementById('advanced-selector-items').innerHTML = '';
      await loadTodoLists(selectedProjectId);
    }

    // Handle term 2 (todo list filtering)
    if (terms.length >= 2) {
      // Term 2 exists: Filter todo lists
      const matchingLists = fuzzyFilter(loadedTodoLists, terms[1]);
      renderTodoLists(matchingLists);

      if (matchingLists.length > 0) {
        // Only auto-select list if term 1 changed, or project changed, or no list selected
        let listToSelect;
        if (term0Changed || term1Changed || !selectedTodoListId) {
          listToSelect = matchingLists[0];
          selectedTodoListId = listToSelect.id;
          selectedTodoItemIds.clear();
        } else {
          // Keep current selection if it's still in the filtered list
          listToSelect = matchingLists.find(l => l.id == selectedTodoListId);
          if (!listToSelect) {
            // Current selection no longer matches, select first
            listToSelect = matchingLists[0];
            selectedTodoListId = listToSelect.id;
            selectedTodoItemIds.clear();
          }
        }

        // Update list selection UI
        document.querySelectorAll('#advanced-selector-categories .advanced-selector-item').forEach(el => {
          el.classList.remove('selected');
        });
        const listItem = document.querySelector(`#advanced-selector-categories .advanced-selector-item[data-id="${selectedTodoListId}"]`);
        if (listItem) {
          listItem.classList.add('selected');
        }

        // Load todo items for the selected list (if list changed or items not loaded)
        const needToLoadItems = term0Changed || term1Changed || loadedTodoItems.length === 0 ||
          !document.querySelector('#advanced-selector-items .advanced-selector-item');

        if (needToLoadItems) {
          document.getElementById('advanced-selector-items').innerHTML = '<div class="advanced-selector-loading">Betöltés...</div>';
          await loadTodoItems(selectedTodoListId);
        }

        // Handle term 3 (todo item filtering)
        if (terms.length >= 3) {
          // Term 3 exists: Filter todo items
          const matchingItems = fuzzyFilter(loadedTodoItems, terms[2]);
          renderTodoItems(matchingItems);

          if (matchingItems.length > 0) {
            // Only auto-select item if any term changed, or no item selected
            const currentSelectedItem = document.querySelector('#advanced-selector-items .advanced-selector-item.selected');
            const currentSelectedItemId = currentSelectedItem ? currentSelectedItem.dataset.id : null;

            if (term0Changed || term1Changed || term2Changed || !currentSelectedItemId) {
              // Clear other item selections
              document.querySelectorAll('#advanced-selector-items .advanced-selector-item').forEach(el => {
                el.classList.remove('selected');
              });

              // Select preserved item if exists, otherwise first item
              const itemToSelect = preserveItemId
                ? matchingItems.find(item => item.id == preserveItemId) || matchingItems[0]
                : matchingItems[0];

              const itemElement = document.querySelector(`#advanced-selector-items .advanced-selector-item[data-id="${itemToSelect.id}"]`);
              if (itemElement) {
                itemElement.classList.add('selected');
              }
            } else {
              // Keep current selection if it's still in the filtered list
              const stillExists = matchingItems.find(item => item.id == currentSelectedItemId);
              if (!stillExists) {
                // Current selection no longer matches, select first
                document.querySelectorAll('#advanced-selector-items .advanced-selector-item').forEach(el => {
                  el.classList.remove('selected');
                });
                const itemElement = document.querySelector(`#advanced-selector-items .advanced-selector-item[data-id="${matchingItems[0].id}"]`);
                if (itemElement) {
                  itemElement.classList.add('selected');
                }
              }
            }
          }
        } else {
          // No term 3: Show all items (unfiltered)
          renderTodoItems(loadedTodoItems);

          if (loadedTodoItems.length > 0) {
            // Only auto-select if project or list changed
            const currentSelectedItem = document.querySelector('#advanced-selector-items .advanced-selector-item.selected');
            const currentSelectedItemId = currentSelectedItem ? currentSelectedItem.dataset.id : null;

            if (term0Changed || term1Changed || !currentSelectedItemId) {
              // Select preserved item if exists, otherwise first item
              const itemToSelect = preserveItemId
                ? loadedTodoItems.find(item => item.id == preserveItemId) || loadedTodoItems[0]
                : loadedTodoItems[0];

              const itemElement = document.querySelector(`#advanced-selector-items .advanced-selector-item[data-id="${itemToSelect.id}"]`);
              if (itemElement) {
                itemElement.classList.add('selected');
              }
            }
          }
        }
      } else {
        // No matching lists - clear items
        selectedTodoListId = null;
        selectedTodoItemIds.clear();
        document.getElementById('advanced-selector-items').innerHTML = '';
      }
    } else {
      // No term 2: Show all todo lists (unfiltered)
      renderTodoLists(loadedTodoLists);

      if (loadedTodoLists.length > 0) {
        // Only auto-select list if project changed or no list selected
        if (term0Changed || !selectedTodoListId) {
          const firstList = loadedTodoLists[0];
          selectedTodoListId = firstList.id;
          selectedTodoItemIds.clear();
        }

        // Verify current selection is still valid
        const listExists = loadedTodoLists.find(l => l.id == selectedTodoListId);
        if (!listExists) {
          selectedTodoListId = loadedTodoLists[0].id;
          selectedTodoItemIds.clear();
        }

        const listItem = document.querySelector(`#advanced-selector-categories .advanced-selector-item[data-id="${selectedTodoListId}"]`);
        if (listItem) {
          listItem.classList.add('selected');
        }

        // Load items for the selected list
        const needToLoadItems = term0Changed || loadedTodoItems.length === 0 ||
          !document.querySelector('#advanced-selector-items .advanced-selector-item');

        if (needToLoadItems) {
          document.getElementById('advanced-selector-items').innerHTML = '<div class="advanced-selector-loading">Betöltés...</div>';
          await loadTodoItems(selectedTodoListId);
        }

        // Auto-select item only if project changed
        if (loadedTodoItems.length > 0) {
          renderTodoItems(loadedTodoItems);

          const currentSelectedItem = document.querySelector('#advanced-selector-items .advanced-selector-item.selected');
          const currentSelectedItemId = currentSelectedItem ? currentSelectedItem.dataset.id : null;

          if (term0Changed || !currentSelectedItemId) {
            // Select preserved item if exists, otherwise first item
            const itemToSelect = preserveItemId
              ? loadedTodoItems.find(item => item.id == preserveItemId) || loadedTodoItems[0]
              : loadedTodoItems[0];

            const itemElement = document.querySelector(`#advanced-selector-items .advanced-selector-item[data-id="${itemToSelect.id}"]`);
            if (itemElement) {
              itemElement.classList.add('selected');
            }
          }
        } else {
          renderTodoItems(loadedTodoItems);
        }
      } else {
        selectedTodoListId = null;
        selectedTodoItemIds.clear();
        document.getElementById('advanced-selector-items').innerHTML = '';
      }
    }
  } else {
    // No matching projects - clear everything
    selectedProjectId = null;
    selectedTodoListId = null;
    selectedTodoItemIds.clear();
    document.getElementById('advanced-selector-categories').innerHTML = '';
    document.getElementById('advanced-selector-items').innerHTML = '';
  }

  // Update previous terms for next comparison
  previousSearchTerms = currentTerms;
}

/**
 * Load projects from the existing project selector
 */
function loadProjects() {
  const projectSelect = document.getElementById('project_id');
  if (!projectSelect) {
    console.error('Project selector not found');
    return;
  }

  // Build projects array from select element
  allProjects = [];
  const optgroups = projectSelect.querySelectorAll('optgroup');

  optgroups.forEach(optgroup => {
    const categoryLabel = optgroup.getAttribute('label');
    const options = optgroup.querySelectorAll('option');

    options.forEach(option => {
      if (!option.value) return; // Skip empty options

      allProjects.push({
        value: option.value,
        label: option.textContent,
        categoryLabel: categoryLabel
      });
    });
  });

  // Initial render
  renderProjects(allProjects);
}

/**
 * Render projects to the projects container
 */
function renderProjects(projects) {
  const projectsContainer = document.getElementById('advanced-selector-projects');
  projectsContainer.innerHTML = '';

  // Group by category
  const byCategory = {};
  projects.forEach(project => {
    if (!byCategory[project.categoryLabel]) {
      byCategory[project.categoryLabel] = [];
    }
    byCategory[project.categoryLabel].push(project);
  });

  // Render each category
  Object.keys(byCategory).forEach(categoryLabel => {
    // Create category header
    const categoryHeader = document.createElement('div');
    categoryHeader.className = 'advanced-selector-category-header';
    categoryHeader.textContent = categoryLabel;
    projectsContainer.appendChild(categoryHeader);

    // Add projects in this category
    byCategory[categoryLabel].forEach(project => {
      const item = createSelectableItem({
        id: project.value,
        label: project.label,
        type: 'project',
        categoryLabel: project.categoryLabel
      });

      projectsContainer.appendChild(item);
    });
  });
}

/**
 * Load todo lists for a selected project
 */
async function loadTodoLists(projectId) {
  const categoriesContainer = document.getElementById('advanced-selector-categories');
  categoriesContainer.innerHTML = '<div class="advanced-selector-loading">Betöltés...</div>';

  try {
    loadedTodoLists = await fetchAndCache(
      `/get_todo_lists?project_id=${projectId}&show_completed=false`,
      `projectId-${projectId}`
    );

    renderTodoLists(loadedTodoLists);
  } catch (error) {
    console.error('Error loading todo lists:', error);
    document.getElementById('advanced-selector-categories').innerHTML = '<div class="advanced-selector-error">Hiba történt a betöltés során</div>';
  }
}

/**
 * Render todo lists to the categories container
 */
function renderTodoLists(todoLists) {
  const categoriesContainer = document.getElementById('advanced-selector-categories');
  categoriesContainer.innerHTML = '';

  if (todoLists.length === 0) {
    categoriesContainer.innerHTML = '<div class="advanced-selector-empty">Nincs elérhető kategória</div>';
    return;
  }

  todoLists.forEach(list => {
    const item = createSelectableItem({
      id: list.id,
      label: list.name,
      type: 'todoList'
    });

    categoriesContainer.appendChild(item);
  });
}

/**
 * Load todo items for a selected todo list
 */
async function loadTodoItems(todoListId) {
  const itemsContainer = document.getElementById('advanced-selector-items');
  itemsContainer.innerHTML = '<div class="advanced-selector-loading">Betöltés...</div>';

  try {
    loadedTodoItems = await fetchAndCache(
      `/get_todo_items?todo_list_id=${todoListId}&show_completed=false`,
      `todoListId-${todoListId}`
    );

    renderTodoItems(loadedTodoItems);
  } catch (error) {
    console.error('Error loading todo items:', error);
    document.getElementById('advanced-selector-items').innerHTML = '<div class="advanced-selector-error">Hiba történt a betöltés során</div>';
  }
}

/**
 * Render todo items to the items container
 */
function renderTodoItems(todoItems) {
  const itemsContainer = document.getElementById('advanced-selector-items');
  itemsContainer.innerHTML = '';

  if (todoItems.length === 0) {
    itemsContainer.innerHTML = '<div class="advanced-selector-empty">Nincs elérhető elem</div>';
    return;
  }

  todoItems.forEach(item => {
    const itemElement = createSelectableItem({
      id: item.id,
      label: item.content,
      type: 'todoItem',
      multiSelect: true
    });

    itemsContainer.appendChild(itemElement);
  });
}

/**
 * Create a selectable item element
 */
function createSelectableItem(config) {
  const { id, label, type, categoryLabel, multiSelect } = config;

  const item = document.createElement('div');
  item.className = 'advanced-selector-item';
  item.dataset.id = id;
  item.dataset.type = type;
  item.dataset.label = label;
  if (categoryLabel) {
    item.dataset.categoryLabel = categoryLabel;
  }

  // Check if this item is already in favorites
  const isInFavorites = checkIfInFavorites(type, id);
  if (isInFavorites) {
    item.classList.add('in-favorites');
  }

  // Create item content
  const itemLabel = document.createElement('span');
  itemLabel.className = 'advanced-selector-item-label';
  itemLabel.textContent = label;
  item.appendChild(itemLabel);

  // Only show action buttons for todo items
  if (type === 'todoItem') {
    const actions = document.createElement('div');
    actions.className = 'advanced-selector-item-actions';

    if (isInFavorites) {
      // Show remove button
      const removeBtn = document.createElement('button');
      removeBtn.className = 'btn btn-mini btn-danger';
      removeBtn.textContent = '−';
      removeBtn.title = 'Eltávolítás a kedvencekből';
      removeBtn.onclick = (e) => {
        e.stopPropagation();
        removeFromFavorites(type, id);
      };
      actions.appendChild(removeBtn);
    } else {
      // Show add button
      const addBtn = document.createElement('button');
      addBtn.className = 'btn btn-mini btn-success';
      addBtn.textContent = '+';
      addBtn.title = 'Hozzáadás a kedvencekhez';
      addBtn.onclick = (e) => {
        e.stopPropagation();
        addToFavorites(item);
      };
      actions.appendChild(addBtn);
    }

    item.appendChild(actions);
  }

  // Handle item click
  item.addEventListener('click', () => {
    handleItemClick(type, id, item, multiSelect);
  });

  return item;
}

/**
 * Handle item click for selection
 */
function handleItemClick(type, id, itemElement, multiSelect) {
  if (type === 'project') {
    // Single select - clear other selections
    document.querySelectorAll('#advanced-selector-projects .advanced-selector-item').forEach(el => {
      el.classList.remove('selected');
    });
    itemElement.classList.add('selected');

    selectedProjectId = id;
    selectedTodoListId = null;
    selectedTodoItemIds.clear();

    // Clear categories and items
    document.getElementById('advanced-selector-categories').innerHTML = '';
    document.getElementById('advanced-selector-items').innerHTML = '';

    // Load todo lists
    loadTodoLists(id);
  } else if (type === 'todoList') {
    // Single select - clear other selections
    document.querySelectorAll('#advanced-selector-categories .advanced-selector-item').forEach(el => {
      el.classList.remove('selected');
    });
    itemElement.classList.add('selected');

    selectedTodoListId = id;
    selectedTodoItemIds.clear();

    // Clear items
    document.getElementById('advanced-selector-items').innerHTML = '';

    // Load todo items
    loadTodoItems(id);
  } else if (type === 'todoItem' && multiSelect) {
    // Multi select - toggle selection
    itemElement.classList.toggle('selected');

    if (itemElement.classList.contains('selected')) {
      selectedTodoItemIds.add(id);
    } else {
      selectedTodoItemIds.delete(id);
    }
  }
}

/**
 * Check if a specific item is already in favorites
 */
function checkIfInFavorites(type, id) {
  if (type === 'project') {
    return favorites.some(fav => fav.project_id?.value == id && !fav.todo_list_id);
  } else if (type === 'todoList') {
    return favorites.some(fav =>
      fav.project_id?.value == selectedProjectId &&
      fav.todo_list_id?.value == id &&
      !fav.todo_item_id
    );
  } else if (type === 'todoItem') {
    return favorites.some(fav =>
      fav.project_id?.value == selectedProjectId &&
      fav.todo_list_id?.value == selectedTodoListId &&
      fav.todo_item_id?.value == id
    );
  }
  return false;
}

/**
 * Add item(s) to favorites
 */
function addToFavorites(itemElement) {
  const type = itemElement.dataset.type;
  const id = itemElement.dataset.id;
  const label = itemElement.dataset.label;

  if (type === 'project') {
    const fav = {
      label: '',
      id: `${new Date().getTime()}${Math.round(Math.random() * 1000)}`,
      project_id: {
        label: label,
        value: id
      }
    };
    favorites.push(fav);
  } else if (type === 'todoList') {
    if (!selectedProjectId) return;

    const projectSelect = document.getElementById('project_id');
    const projectOption = projectSelect.querySelector(`option[value="${selectedProjectId}"]`);

    const fav = {
      label: '',
      id: `${new Date().getTime()}${Math.round(Math.random() * 1000)}`,
      project_id: {
        label: projectOption.textContent,
        value: selectedProjectId
      },
      todo_list_id: {
        label: label,
        value: id
      }
    };
    favorites.push(fav);
  } else if (type === 'todoItem') {
    if (!selectedProjectId || !selectedTodoListId) return;

    const projectSelect = document.getElementById('project_id');
    const projectOption = projectSelect.querySelector(`option[value="${selectedProjectId}"]`);

    const todoListElement = document.querySelector(`#advanced-selector-categories .advanced-selector-item.selected`);
    const todoListLabel = todoListElement ? todoListElement.dataset.label : '';

    // Add all selected items if multi-select is active
    const itemsToAdd = selectedTodoItemIds.size > 0 ? Array.from(selectedTodoItemIds) : [id];

    itemsToAdd.forEach(itemId => {
      const itemEl = document.querySelector(`#advanced-selector-items .advanced-selector-item[data-id="${itemId}"]`);
      const itemLabel = itemEl ? itemEl.dataset.label : '';

      const fav = {
        label: '',
        id: `${new Date().getTime()}${Math.round(Math.random() * 1000)}`,
        project_id: {
          label: projectOption.textContent,
          value: selectedProjectId
        },
        todo_list_id: {
          label: todoListLabel,
          value: selectedTodoListId
        },
        todo_item_id: {
          label: itemLabel,
          value: itemId
        }
      };
      favorites.push(fav);
    });
  }

  saveFavorites();
  renderFavs();
  if (applyQuickFilter) {
    applyQuickFilter();
  }

  // Refresh the current view to update indicators
  refreshCurrentView();
}

/**
 * Remove item from favorites
 */
function removeFromFavorites(type, id) {
  let indicesToRemove = [];

  if (type === 'project') {
    indicesToRemove = favorites
      .map((fav, index) => (fav.project_id?.value == id && !fav.todo_list_id ? index : -1))
      .filter(index => index !== -1);
  } else if (type === 'todoList') {
    indicesToRemove = favorites
      .map((fav, index) =>
        (fav.project_id?.value == selectedProjectId &&
         fav.todo_list_id?.value == id &&
         !fav.todo_item_id) ? index : -1
      )
      .filter(index => index !== -1);
  } else if (type === 'todoItem') {
    indicesToRemove = favorites
      .map((fav, index) =>
        (fav.project_id?.value == selectedProjectId &&
         fav.todo_list_id?.value == selectedTodoListId &&
         fav.todo_item_id?.value == id) ? index : -1
      )
      .filter(index => index !== -1);
  }

  // Remove in reverse order to maintain indices
  indicesToRemove.reverse().forEach(index => {
    favorites.splice(index, 1);
  });

  saveFavorites();
  renderFavs();
  if (applyQuickFilter) {
    applyQuickFilter();
  }

  // Refresh the current view to update indicators
  refreshCurrentView();
}

/**
 * Refresh the current view to update favorite indicators
 * Preserves the current search state and selection
 */
function refreshCurrentView() {
  // Get current search value
  const searchInput = document.getElementById('advanced-selector-search');
  const currentSearch = searchInput ? searchInput.value : '';

  // Store currently selected item ID to restore after refresh
  const currentlySelectedItem = document.querySelector('#advanced-selector-items .advanced-selector-item.selected');
  const selectedItemId = currentlySelectedItem ? currentlySelectedItem.dataset.id : null;

  // If there's a search, re-run it to refresh with preserved filter
  if (currentSearch) {
    handleUnifiedSearch(currentSearch, selectedItemId);
  } else {
    // No search - just reload the view
    if (selectedProjectId) {
      loadProjects();
      if (selectedTodoListId) {
        loadTodoLists(selectedProjectId).then(() => {
          // Re-select the selected todo list
          const todoListItem = document.querySelector(`#advanced-selector-categories .advanced-selector-item[data-id="${selectedTodoListId}"]`);
          if (todoListItem) {
            todoListItem.classList.add('selected');
            loadTodoItems(selectedTodoListId);
          }
        });
      }
    } else {
      loadProjects();
    }
  }
}
