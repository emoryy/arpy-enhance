/**
 * ArpyEnhance - Main Entry Point
 * Enhanced Arpy work hour reporting userscript
 */

// Import styles
import './styles/all.css';

// Import assets
import logoUrl from './assets/logo.png';

// Import core modules
import { settingsManager } from './settings/settings-manager.js';
import { DEBUG } from './constants.js';

// Import theme management
import { initTheme, getCurrentTheme, toggleTheme, applyTheme } from './theme/theme-manager.js';

// Import cache modules
import { loadRedmineCacheFromStorage, reloadRedmineTicket } from './redmine/redmine-cache.js';
import { fetchAndCache } from './cache/arpy-cache.js';

// Import favorites
import {
  loadFavorites,
  checkFavoritesValidity,
  renderFavs,
  setupFavoriteSorting,
  setupClearInvalidButton,
  updateClearButtonVisibility,
  initFavoritesManager,
  addNewFavorite
} from './favorites/favorites-manager.js';
import { applyQuickFilter, setupQuickFilter } from './favorites/quick-filter.js';
import { initAdvancedSelector, setupAdvancedSelector } from './favorites/advanced-selector.js';

// Import UI components
import { injectNavbar, initNavbarModule } from './ui/navbar.js';
import { createSettingsModal, showSettingsModal, initSettingsModalModule } from './ui/settings-modal.js';
import { createHelpModal, setupHelpModalButton, getHelpText } from './ui/help-modal.js';
import { initializeDOMStructure } from './ui/dom-setup.js';
import { initializePanels, initPanelManager } from './ui/panel-manager.js';

// Import Monaco editor
import { initializeMonacoEditor, initMonacoEditorModule } from './monaco/monaco-setup.js';
import { updateMonacoLayout } from './monaco/monaco-layout.js';

// Import preview
import { updatePreview } from './preview/preview-manager.js';

// Import batch submit
import { setupBatchSubmitButton, initBatchSubmitModule } from './submission/batch-submit.js';

// Import utilities
import { copyTextToClipboard, status } from './utils/dom-helpers.js';

// Initialize
(function() {
  'use strict';

  if (DEBUG) {
    console.log('ArpyEnhance initializing...');
  }

  // === Core Setup ===

  // Load settings
  settingsManager.load();

  if (DEBUG) {
    console.log('Settings loaded:', settingsManager.getSettings());
  }

  // Set up favicon
  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    link.setAttribute("type", "image/x-icon");
    document.getElementsByTagName('head')[0].appendChild(link);
  }
  link.href = logoUrl;

  // Enable person dropdown
  const personDropdown = document.getElementById('person');
  if (personDropdown) {
    personDropdown.disabled = false;
  }

  // Set moment locale
  if (typeof moment !== 'undefined') {
    moment.locale("hu");
  }

  // === Initialize Theme ===
  initTheme();

  // === Initialize Cache ===
  loadRedmineCacheFromStorage();

  // === Create DOM Structure ===
  initializeDOMStructure(getHelpText());

  // === Initialize Favorites with dependencies ===
  initFavoritesManager({
    status,
    copyTextToClipboard,
    fetchAndCache,
    applyQuickFilter
  });

  loadFavorites();
  setupFavoriteSorting();
  setupClearInvalidButton();
  setupQuickFilter();

  // === Initialize Advanced Selector ===
  initAdvancedSelector({
    fetchAndCache,
    applyQuickFilter
  });
  setupAdvancedSelector();

  // Check favorites validity and render when done (non-blocking)
  checkFavoritesValidity().then(() => {
    renderFavs();
    updateClearButtonVisibility();
  });

  // === Initialize Monaco Editor Module ===
  initMonacoEditorModule({
    updatePreview
  });

  // === Initialize Navbar ===
  initNavbarModule({
    getCurrentTheme,
    toggleTheme,
    showSettingsModal
  });
  injectNavbar();

  // === Initialize Settings Modal ===
  initSettingsModalModule({
    applyTheme,
    updatePreview,
    updateMonacoLayout
  });
  createSettingsModal();

  // === Initialize Help Modal ===
  createHelpModal();
  setupHelpModalButton();

  // === Initialize Panel Manager ===
  initPanelManager({
    updateMonacoLayout
  });
  initializePanels();

  // === Initialize Batch Submit ===
  initBatchSubmitModule({
    status
  });
  setupBatchSubmitButton();

  // === Set up form container ===
  const formTopContentContainer = document.createElement('div');
  Array.from(document.querySelectorAll('#time_entry_container form > input, #time_entry_container form > select, #time_entry_container form > button')).forEach((el) => formTopContentContainer.appendChild(el));
  document.querySelector("#time_entry_container form").prepend(formTopContentContainer);

  // === Set up batch textarea focus handler ===
  $("#batch-textarea").on('focus', function(){
    $(this).addClass('active');
  });

  // === Restore saved textarea value and trigger preview ===
  if (window.localStorage.batchTextareaSavedValue) {
    document.getElementById('batch-textarea').value = window.localStorage.batchTextareaSavedValue;
    updatePreview();
  }

  // === Add favorite button handler ===
  $("#add-fav-button").button().on("click", addNewFavorite);

  // === Initialize Monaco Editor ===
  initializeMonacoEditor();

  console.log('ArpyEnhance v0.18 loaded successfully!');
})();
