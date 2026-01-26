/**
 * Get item from localStorage
 */
export function getStorageItem(key) {
  return unsafeWindow.localStorage.getItem(key);
}

/**
 * Set item in localStorage
 */
export function setStorageItem(key, value) {
  unsafeWindow.localStorage.setItem(key, value);
}

/**
 * Remove item from localStorage
 */
export function removeStorageItem(key) {
  unsafeWindow.localStorage.removeItem(key);
}

/**
 * Get JSON from localStorage
 */
export function getStorageJSON(key, defaultValue = null) {
  try {
    const item = getStorageItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Failed to parse JSON from localStorage key: ${key}`, e);
    return defaultValue;
  }
}

/**
 * Set JSON to localStorage
 */
export function setStorageJSON(key, value) {
  try {
    setStorageItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to stringify JSON for localStorage key: ${key}`, e);
  }
}
