// ==UserScript==
// @name         Redmine Hammy Version select enhance
// @namespace    hu.emoryy
// @version      0.2
// @description  Enhance version select inputs on Redmine
// @author       Barta Gábor
// @include      https://redmine.dbx.hu/*
// @icon         https://icons.duckduckgo.com/ip2/dbx.hu.ico
// @updateURL    https://github.com/emoryy/arpy-enhance/raw/master/RedmineVersionSelectEnhance.user.js
// @downloadURL  https://github.com/emoryy/arpy-enhance/raw/master/RedmineVersionSelectEnhance.user.js
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const STORAGE_KEY = 'selectSortingDirection';

  // Helper to check if a string is a version number
  function isVersion(str) {
    return /^\d+(\.\d+)*$/.test(str.trim());
  }

  // Check if a version is a "main version" (e.g., 3-part version numbers)
  function isMainVersion(str) {
    const versionMatch = str.match(/(?:^|\s)(?:[\w\s-]*-?\s*)\b\d+\.\d+\.\d+\b(?:\s|$)/); // Match main version patterns
    return versionMatch !== null;
  }

  // Parse version numbers naturally
  function naturalCompare(a, b) {
    const reg = /(\d+)|(\D+)/g;
    const aParts = String(a).match(reg);
    const bParts = String(b).match(reg);
    while (aParts.length && bParts.length) {
      const aPart = aParts.shift();
      const bPart = bParts.shift();
      if (!isNaN(aPart) && !isNaN(bPart)) {
        const diff = Number(aPart) - Number(bPart);
        if (diff !== 0) return diff;
      } else if (aPart !== bPart) {
        return aPart.localeCompare(bPart);
      }
    }
    return aParts.length - bParts.length;
  }

  // Sort options within an optgroup
  function sortOptgroup(optgroup, ascending) {
    const options = Array.from(optgroup.querySelectorAll('option'));

    options.sort((a, b) => {
      const aText = a.textContent.replace(/^.* - /, '').trim(); // Remove project name
      const bText = b.textContent.replace(/^.* - /, '').trim();
      const aIsVersion = isVersion(aText);
      const bIsVersion = isVersion(bText);

      if (aIsVersion && bIsVersion) {
        const comparison = naturalCompare(aText, bText);
        return ascending ? comparison : -comparison;
      } else if (aIsVersion) {
        return -1;
      } else if (bIsVersion) {
        return 1;
      } else {
        return aText.localeCompare(bText) * (ascending ? 1 : -1);
      }
    });

    options.forEach(option => {
      optgroup.appendChild(option);
      if (isMainVersion(option.textContent)) {
        option.style.fontWeight = 'bold';
        option.style.backgroundColor = '#f8f8f8';
      } else {
        option.style.fontWeight = '';
        option.style.backgroundColor = '';
      }
    });
  }

  // Save sorting state to localStorage
  function saveState(ascending) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ascending));
  }

  // Load sorting state from localStorage
  function loadState() {
    const state = localStorage.getItem(STORAGE_KEY);
    return state !== null ? JSON.parse(state) : false; // Default descending
  }

  // Main function to sort a select
  function sortSelect(select, ascending = true) {
    select.querySelectorAll('optgroup').forEach(optgroup => {
      sortOptgroup(optgroup, ascending);
    });
    saveState(ascending);
  }

  // Add sorting button for a specific select
  function addSortingButton(select) {
    const container = select.closest('span, td, div') || document.body;
    const target = container.querySelector('.icon-add, .icon-toggle-plus') || container;

    const sortButton = document.createElement('a');
    sortButton.type = 'button';
    sortButton.classList.add('icon-only');
    sortButton.style.cursor = 'pointer';
    sortButton.style.marginLeft = '4px';
    sortButton.title = 'Sort versions';

    let ascending = loadState();
    updateButtonState(sortButton, ascending);

    sortButton.addEventListener('click', (event) => {
      event.preventDefault();
      ascending = !ascending;
      sortSelect(select, ascending);
      updateButtonState(sortButton, ascending);
    });

    sortSelect(select, ascending);

    target.parentNode.insertBefore(sortButton, target);
  }

  // Update button state for sorting direction
  function updateButtonState(button, ascending) {
    button.classList.toggle('icon-sorted-asc', ascending);
    button.classList.toggle('icon-sorted-desc', !ascending);
  }

  // Observe for dynamically added select elements
  function observeDocument() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          console.log("mutation node", node);
          if (node.nodeType === 1) {
            let matchedNode;
            if (node.matches('#issue_fixed_version_id') || node.matches('.value[id*="fixed_version_id"]')) {
              matchedNode = node;
            } else {
              matchedNode = node.querySelector('#issue_fixed_version_id, .value[id*="fixed_version_id"]');
            }
            if (matchedNode) {
              enhanceSelect(matchedNode);
            }
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Enhance a specific select element
  function enhanceSelect(select) {
    if (!select.dataset.enhanced) {
      addSortingButton(select);
      select.dataset.enhanced = 'true';
    }
  }

  // Initial setup
  document.querySelectorAll('#issue_fixed_version_id, .value[id*="fixed_version_id"]').forEach(enhanceSelect);
  observeDocument();
})();
