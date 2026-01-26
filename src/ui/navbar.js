/**
 * Navbar Module
 * Handles navbar injection and theme toggle
 */

import logoUrl from '../assets/logo.png';

// External dependencies (will be set by main.js)
let getCurrentTheme = null;
let toggleTheme = null;
let showSettingsModal = null;

/**
 * Initialize navbar module with dependencies
 */
export function initNavbarModule(deps) {
  getCurrentTheme = deps.getCurrentTheme;
  toggleTheme = deps.toggleTheme;
  showSettingsModal = deps.showSettingsModal;
}

/**
 * Inject ArpyEnhance navbar
 */
export function injectNavbar() {
  const navbarInner = document.querySelector('.navbar-inner .container');
  const mainNav = document.querySelector('.navbar .nav:not(.pull-right)');

  if (!navbarInner || !mainNav) {
    return;
  }

  const currentTheme = getCurrentTheme();
  const arpyEnhanceNav = document.createElement('ul');
  arpyEnhanceNav.className = 'nav arpy-enhance-nav';
  arpyEnhanceNav.innerHTML = `
    <li class="arpy-enhance-brand">
      <img src="${logoUrl}" alt="ArpyEnhance" class="brand-logo">
      <span class="brand-text">ArpyEnhance</span>
    </li>
    <li>
      <a href="#" id="settings-button" class="arpy-enhance-settings-btn">
        <span class="settings-icon">⚙</span>
        <span>Beállítások</span>
      </a>
    </li>
    <li class="theme-toggle-container">
      <label class="theme-toggle-switch">
        <input type="checkbox" id="theme-toggle-checkbox" ${currentTheme === 'dark' ? 'checked' : ''}>
        <span class="theme-slider">
          <svg class="theme-icon-light" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="5" fill="currentColor"/>
            <path d="M12 1v3M12 20v3M22 12h-3M5 12H2M19.07 4.93l-2.12 2.12M7.05 16.95l-2.12 2.12M19.07 19.07l-2.12-2.12M7.05 7.05L4.93 4.93" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <svg class="theme-icon-dark" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor"/>
          </svg>
        </span>
      </label>
    </li>
  `;

  // Insert after main nav
  mainNav.parentNode.insertBefore(arpyEnhanceNav, mainNav.nextSibling);

  // Settings button click handler
  document.getElementById('settings-button').addEventListener('click', (e) => {
    e.preventDefault();
    if (showSettingsModal) {
      showSettingsModal();
    }
  });

  // Theme toggle checkbox change handler
  document.getElementById('theme-toggle-checkbox').addEventListener('change', (e) => {
    if (toggleTheme) {
      toggleTheme();
    }
  });
}
