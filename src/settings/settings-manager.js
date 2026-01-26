import { DEFAULT_SETTINGS } from '../constants.js';
import { getStorageItem, setStorageItem, getStorageJSON, setStorageJSON } from '../utils/storage.js';

/**
 * Simple settings manager using direct localStorage access
 * No complex migration - just use the original localStorage keys
 */
export class SettingsManager {
  /**
   * Get a setting value
   * @param {string} key - Setting key
   * @param {*} defaultValue - Default value if not found
   */
  get(key) {
    const keyMap = {
      'redmineApiKey': 'REDMINE_API_KEY',
      'redmineCacheTtlHours': 'arpyEnhanceRedmineCacheTtlHours',
      'theme': 'arpyEnhanceTheme',
      'favsMaximized': 'arpyEnhanceFavsMaxed',
      'panelsSwapped': 'arpyEnhancePanelsSwapped',
      'showProgressIndicator': 'arpyEnhanceShowProgressIndicator',
      'showEditorHourIndicator': 'arpyEnhanceShowEditorHourIndicator',
      'targetWorkHours': 'arpyEnhanceTargetWorkHours',
      'maxDisplayHours': 'arpyEnhanceMaxDisplayHours'
    };

    const storageKey = keyMap[key] || key;
    const defaultValue = DEFAULT_SETTINGS[key];

    // Handle different value types
    if (key === 'redmineCacheTtlHours' || key === 'targetWorkHours' || key === 'maxDisplayHours') {
      const val = getStorageItem(storageKey);
      return val ? parseFloat(val) : defaultValue;
    } else if (key === 'favsMaximized' || key === 'panelsSwapped' || key === 'showProgressIndicator' || key === 'showEditorHourIndicator') {
      const val = getStorageItem(storageKey);
      if (val === null) return defaultValue;
      return val === 'true';
    } else {
      return getStorageItem(storageKey) || defaultValue;
    }
  }

  /**
   * Set a setting value
   */
  set(key, value) {
    const keyMap = {
      'redmineApiKey': 'REDMINE_API_KEY',
      'redmineCacheTtlHours': 'arpyEnhanceRedmineCacheTtlHours',
      'theme': 'arpyEnhanceTheme',
      'favsMaximized': 'arpyEnhanceFavsMaxed',
      'panelsSwapped': 'arpyEnhancePanelsSwapped',
      'showProgressIndicator': 'arpyEnhanceShowProgressIndicator',
      'showEditorHourIndicator': 'arpyEnhanceShowEditorHourIndicator',
      'targetWorkHours': 'arpyEnhanceTargetWorkHours',
      'maxDisplayHours': 'arpyEnhanceMaxDisplayHours'
    };

    const storageKey = keyMap[key] || key;

    // Handle boolean values
    if (typeof value === 'boolean') {
      setStorageItem(storageKey, value ? 'true' : 'false');
    } else {
      setStorageItem(storageKey, String(value));
    }
  }

  /**
   * Load settings (no-op for backwards compatibility)
   */
  load() {
    // Settings are loaded on-demand via get()
  }

  /**
   * Save settings (no-op for backwards compatibility)
   */
  save() {
    // Settings are saved immediately via set()
  }

  /**
   * Get all settings as an object
   */
  getSettings() {
    return {
      redmineApiKey: this.get('redmineApiKey'),
      redmineCacheTtlHours: this.get('redmineCacheTtlHours'),
      theme: this.get('theme'),
      favsMaximized: this.get('favsMaximized'),
      panelsSwapped: this.get('panelsSwapped'),
      showProgressIndicator: this.get('showProgressIndicator'),
      showEditorHourIndicator: this.get('showEditorHourIndicator'),
      targetWorkHours: this.get('targetWorkHours'),
      maxDisplayHours: this.get('maxDisplayHours')
    };
  }

  /**
   * Get computed values
   */
  getRedmineCacheTtlMs() {
    return this.get('redmineCacheTtlHours') * 60 * 60 * 1000;
  }
}

// Create and export a singleton instance
export const settingsManager = new SettingsManager();
