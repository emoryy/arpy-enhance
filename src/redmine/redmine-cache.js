/**
 * Redmine Cache Module
 * Manages caching of Redmine issue data with TTL
 * Original lines 135-220 from ArpyEnhance.user.js
 */

import { settingsManager } from '../settings/settings-manager.js';
import { getStorageJSON, setStorageJSON } from '../utils/storage.js';

const REDMINE_CACHE_STORAGE_KEY = 'arpyEnhanceRedmineCache';
const redmineCache = {};

/**
 * Load Redmine cache from localStorage and clean expired entries
 */
export function loadRedmineCacheFromStorage() {
  try {
    const stored = getStorageJSON(REDMINE_CACHE_STORAGE_KEY);
    if (stored) {
      const now = Date.now();
      const ttl = settingsManager.getRedmineCacheTtlMs();

      // Clean expired entries and load valid ones
      Object.entries(stored).forEach(([issueNumber, entry]) => {
        if (entry.timestamp && (now - entry.timestamp) <= ttl) {
          redmineCache[issueNumber] = entry;
        }
      });
    }
  } catch (e) {
    console.error('Failed to load Redmine cache from localStorage:', e);
  }
}

/**
 * Save Redmine cache to localStorage
 */
export function saveRedmineCacheToStorage() {
  try {
    setStorageJSON(REDMINE_CACHE_STORAGE_KEY, redmineCache);
  } catch (e) {
    console.error('Failed to save Redmine cache to localStorage:', e);
  }
}

/**
 * Check if a Redmine cache entry is expired
 */
export function isRedmineCacheExpired(issueNumber) {
  const cacheEntry = redmineCache[issueNumber];
  if (!cacheEntry || !cacheEntry.timestamp) {
    return true;
  }
  const now = Date.now();
  const ttl = settingsManager.getRedmineCacheTtlMs();
  return (now - cacheEntry.timestamp) > ttl;
}

/**
 * Fetch Redmine issue data with cache management
 */
export async function fetchRedmineIssue(issueNumber, forceReload = false) {
  const REDMINE_API_KEY = settingsManager.get('redmineApiKey');

  if (!REDMINE_API_KEY || !issueNumber?.match(/^\d+$/)) {
    return null;
  }

  // Check if we should use cache
  if (!forceReload && redmineCache[issueNumber] && !isRedmineCacheExpired(issueNumber)) {
    return redmineCache[issueNumber].data;
  }

  // Fetch fresh data
  const response = await fetch(`https://redmine.dbx.hu/issues/${issueNumber}.json`, {
    headers: {
      "Content-Type": "application/json",
      "X-Redmine-API-Key": REDMINE_API_KEY
    }
  });
  const data = await response.json();

  // Store in cache with timestamp
  redmineCache[issueNumber] = {
    data: data,
    timestamp: Date.now()
  };

  // Persist to localStorage
  saveRedmineCacheToStorage();

  return data;
}

/**
 * Force reload a specific Redmine ticket and update preview
 * Note: updatePreview will be injected/imported separately
 */
export async function reloadRedmineTicket(issueNumber, updatePreviewCallback) {
  if (!issueNumber) {
    return;
  }

  // Force reload from API
  await fetchRedmineIssue(issueNumber, true);

  // Update the preview if callback provided
  if (updatePreviewCallback) {
    await updatePreviewCallback();
  }
}
