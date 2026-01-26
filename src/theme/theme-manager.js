/**
 * Theme Manager Module
 * Handles light/dark theme switching
 * Original lines 104-122 from ArpyEnhance.user.js
 */

import { settingsManager } from '../settings/settings-manager.js';

let currentTheme = settingsManager.get('theme');
let monacoEditorInstance = null;

/**
 * Set the Monaco editor instance (will be called from Monaco module)
 */
export function setMonacoEditorInstance(instance) {
  monacoEditorInstance = instance;
}

/**
 * Apply theme to the document
 */
export function applyTheme(theme) {
  currentTheme = theme;
  settingsManager.set('theme', theme);
  document.documentElement.setAttribute('data-theme', theme);
  settingsManager.save();

  // Update Monaco theme if editor exists
  if (monacoEditorInstance && typeof monaco !== 'undefined') {
    const monacoTheme = theme === 'dark' ? 'arpy-dark' : 'arpy-light-vibrant';
    monaco.editor.setTheme(monacoTheme);
  }
}

/**
 * Toggle between light and dark theme
 */
export function toggleTheme() {
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  applyTheme(newTheme);
  return newTheme;
}

/**
 * Get current theme
 */
export function getCurrentTheme() {
  return currentTheme;
}

/**
 * Initialize theme on page load
 */
export function initTheme() {
  applyTheme(currentTheme);
}
