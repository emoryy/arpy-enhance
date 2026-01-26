/**
 * Arpy Cache Module
 * Caches Arpy API responses (todo lists, todo items)
 */

// In-memory cache for Arpy API responses
const arpyCache = {};

/**
 * Fetch data from Arpy API with caching
 * @param {string} url - API endpoint URL
 * @param {string} cacheKey - Unique cache key
 * @returns {Promise<Array>} - Cached or fresh data
 */
export function fetchAndCache(url, cacheKey) {
  let promise = arpyCache[cacheKey];
  if (!promise) {
    promise = fetch(url).then((response) => {
      if (!response.ok) {
        // If the server returns an error (e.g., 404), treat it as an empty list
        console.warn(`Failed to fetch ${url}, status: ${response.status}`);
        return [];
      }
      return response.json();
    }).catch((error) => {
      console.error(`Error fetching ${url}:`, error);
      delete arpyCache[cacheKey]; // Remove failed requests from cache
      return []; // Return an empty array on failure
    });
    arpyCache[cacheKey] = promise;
  }
  return promise;
}

/**
 * Clear the Arpy cache
 */
export function clearArpyCache() {
  Object.keys(arpyCache).forEach(key => delete arpyCache[key]);
}

/**
 * Get cache status (for debugging)
 */
export function getArpyCacheStatus() {
  return {
    keys: Object.keys(arpyCache),
    count: Object.keys(arpyCache).length
  };
}
