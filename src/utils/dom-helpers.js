/**
 * Add CSS to the page
 */
export function addCss(cssString) {
  const head = document.getElementsByTagName('head')[0];
  const newCss = document.createElement('style');
  newCss.type = "text/css";
  newCss.innerHTML = cssString;
  head.appendChild(newCss);
}

/**
 * Copy text to clipboard
 */
export function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
  } else {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
}

/**
 * Show status message
 */
export function showStatus(message, type = 'info', duration = 3000) {
  // You can implement this as a toast notification
  console.log(`[${type.toUpperCase()}]`, message);
  // TODO: Implement proper toast notifications
}

/**
 * Update status bar (from original codebase)
 */
export function status(description, level) {
  const statusElement = document.getElementById('status-description');
  if (!statusElement) return;

  statusElement.innerText = description;

  const statusBar = document.getElementById('status-bar');
  if (!statusBar) return;

  statusBar.className = '';
  if (level) {
    statusBar.classList.add(level);
  }
}

/**
 * Alias for copyToClipboard for backwards compatibility
 */
export const copyTextToClipboard = copyToClipboard;
