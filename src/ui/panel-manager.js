/**
 * Panel Manager Module
 * Handles panel resizing, maximizing, and swapping
 */

import { ORIGINAL_BOTTOM_OFFSET_PX } from '../constants.js';

// External dependencies (will be set by main.js)
let updateMonacoLayout = null;

/**
 * Initialize panel manager with dependencies
 */
export function initPanelManager(deps) {
  updateMonacoLayout = deps.updateMonacoLayout;
}

/**
 * Setup panel resizing with mouse drag
 */
export function setupMinimalResizing() {
  const topPanel = document.getElementById('favorites-container');
  const bottomWrapper = document.getElementById('editor-preview-wrapper');

  if (!topPanel || !bottomWrapper) {
    return;
  }

  const resizer = document.createElement('div');
  resizer.id = 'minimal-vertical-resizer';
  topPanel.appendChild(resizer);

  const STORAGE_KEY = 'arpyEnhanceTopPanelVh';
  const DEFAULT_TOP_VH = 20;

  const applyVhHeights = (topVh) => {
    if (typeof topVh !== 'number' || isNaN(topVh)) {
      return;
    }

    const constrainedTopVh = Math.max(2, Math.min(topVh, 90));
    const bottomVh = 100 - constrainedTopVh;

    topPanel.style.height = `${constrainedTopVh}vh`;
    topPanel.style.maxHeight = `${constrainedTopVh}vh`;
    const bottomHeightCss = `calc(${bottomVh}vh - ${ORIGINAL_BOTTOM_OFFSET_PX}px)`;
    bottomWrapper.style.height = bottomHeightCss;
  };

  const savedVh = unsafeWindow.localStorage.getItem(STORAGE_KEY);
  // Only apply vh heights if not in maximized mode
  if (!topPanel.classList.contains('maximalized')) {
    applyVhHeights(savedVh ? parseFloat(savedVh) : DEFAULT_TOP_VH);
  }

  resizer.addEventListener('mousedown', (e) => {
    e.preventDefault();

    // Get the computed style to read the panel's padding and border.
    const computedStyle = window.getComputedStyle(topPanel);
    const verticalPadding = parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom);
    const verticalBorder = parseFloat(computedStyle.borderTopWidth) + parseFloat(computedStyle.borderBottomWidth);
    const nonContentHeight = verticalPadding + verticalBorder;

    const startY_px = e.clientY;
    // Get the panel's full outer height, then subtract the padding and border to get the true content height.
    const startTopContentHeight_px = topPanel.offsetHeight - nonContentHeight;
    const viewportHeight_px = window.innerHeight;

    let moveRAF;
    const handleMouseMove = (moveEvent) => {
      const deltaY_px = moveEvent.clientY - startY_px;
      // The new height is the starting content height plus the mouse delta.
      const newTopContentHeight_px = startTopContentHeight_px + deltaY_px;
      // Convert the content height to vh.
      const newTop_vh = (newTopContentHeight_px / viewportHeight_px) * 100;

      applyVhHeights(newTop_vh);

      // Update Monaco layout continuously during drag (throttled via RAF)
      if (moveRAF) {
        cancelAnimationFrame(moveRAF);
      }
      if (updateMonacoLayout) {
        moveRAF = requestAnimationFrame(updateMonacoLayout);
      }
    };

    const handleMouseUp = () => {
      // On release, do the same conversion before saving.
      const finalContentHeight_px = topPanel.offsetHeight - nonContentHeight;
      const final_vh = (finalContentHeight_px / window.innerHeight) * 100;
      localStorage.setItem(STORAGE_KEY, final_vh.toFixed(2));

      // Update Monaco editor layout after resize
      if (updateMonacoLayout) {
        setTimeout(updateMonacoLayout, 50);
      }

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  });
}

/**
 * Setup maximize state restoration
 */
export function setupMaximalizeState() {
  if (unsafeWindow.localStorage.getItem('arpyEnhanceFavsMaxed') === 'true') {
    const favoritesPanel = document.querySelector("#favorites-container");
    const wrapper = document.querySelector("#editor-preview-wrapper");
    const maximizeButton = document.querySelector('#maximize-button');

    if (favoritesPanel && wrapper && maximizeButton) {
      favoritesPanel.classList.add('maximalized');
      maximizeButton.innerHTML = "◱";
      // Set wrapper to 85vh and clear favorites height constraints
      wrapper.style.height = '85vh';
      favoritesPanel.style.height = '';
      favoritesPanel.style.maxHeight = '';
    }
  }
}

/**
 * Setup panel swap state restoration
 */
export function setupPanelSwapState() {
  if (unsafeWindow.localStorage.getItem('arpyEnhancePanelsSwapped') === 'true') {
    const timelogPage = document.querySelector("#timelog-page");
    if (timelogPage) {
      timelogPage.classList.add('panels-swapped');
    }
  }
}

/**
 * Setup maximize button click handler
 */
export function setupMaximizeButton() {
  const maximizeButton = document.querySelector('#maximize-button');
  if (!maximizeButton) {
    return;
  }

  maximizeButton.addEventListener('click', function() {
    const favoritesPanel = document.querySelector("#favorites-container");
    const wrapper = document.querySelector("#editor-preview-wrapper");

    if (!favoritesPanel || !wrapper) {
      return;
    }

    favoritesPanel.classList.toggle('maximalized');
    if (favoritesPanel.classList.contains('maximalized')) {
      localStorage.setItem('arpyEnhanceFavsMaxed', 'true');
      maximizeButton.innerHTML = "◱";
      // Set wrapper to 85vh and clear favorites height constraints
      wrapper.style.height = '85vh';
      favoritesPanel.style.height = '';
      favoritesPanel.style.maxHeight = '';
    } else {
      localStorage.removeItem('arpyEnhanceFavsMaxed');
      maximizeButton.innerHTML = "⬍";
      // Restore the vh-based heights from saved value
      const savedVh = parseFloat(localStorage.getItem('arpyEnhanceTopPanelVh') || '20');
      const bottomVh = 100 - savedVh;
      favoritesPanel.style.height = `${savedVh}vh`;
      favoritesPanel.style.maxHeight = `${savedVh}vh`;
      wrapper.style.height = `calc(${bottomVh}vh - ${ORIGINAL_BOTTOM_OFFSET_PX}px)`;
    }

    // Adjust Monaco editor after panel resize
    if (updateMonacoLayout) {
      setTimeout(updateMonacoLayout, 50);
    }
  });
}

/**
 * Setup panel swap buttons
 */
export function setupPanelSwapButtons() {
  const panelSwapButtons = document.querySelectorAll('.panel-swap-button');
  panelSwapButtons.forEach(button => {
    button.addEventListener('click', function() {
      const timelogPage = document.querySelector("#timelog-page");
      if (!timelogPage) {
        return;
      }

      timelogPage.classList.toggle('panels-swapped');
      if (timelogPage.classList.contains('panels-swapped')) {
        localStorage.setItem('arpyEnhancePanelsSwapped', 'true');
      } else {
        localStorage.removeItem('arpyEnhancePanelsSwapped');
      }
    });
  });
}

/**
 * Initialize all panel management features
 */
export function initializePanels() {
  setupMinimalResizing();
  setupMaximalizeState();
  setupPanelSwapState();
  setupMaximizeButton();
  setupPanelSwapButtons();
}
