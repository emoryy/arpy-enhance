/**
 * Batch Submission Module
 * Handles batch work hour entry submission
 */

import { parseBatchData } from '../parser/batch-parser.js';
import { DEBUG } from '../constants.js';
import { favorites } from '../favorites/favorites-manager.js';
import { monacoEditorInstance } from '../monaco/monaco-setup.js';

// External dependencies (will be set by main.js)
let status = null;

// Cancellation flag for stopping submission
let isCancelled = false;

/**
 * Initialize batch submit module with dependencies
 */
export function initBatchSubmitModule(deps) {
  status = deps.status;
}

/**
 * Setup batch submit button handler
 */
export function setupBatchSubmitButton() {
  const $submitButton = $("#submit-batch-button");
  const $stopButton = $("#stop-batch-button");

  // Stop button click handler
  $stopButton.on("click", function() {
    isCancelled = true;
  });

  $submitButton.button().on("click", async function() {
    const $button = $(this);

    // Prevent double-click while saving
    if ($button.prop('disabled')) {
      return;
    }

    // Reset cancellation flag
    isCancelled = false;

    // Set loading state
    $button.prop('disabled', true);
    $button.addClass('loading');
    $button.find('.btn-icon').addClass('spinning');

    // Show stop button
    $stopButton.show();

    console.log("batch button pressed");
    if (status) {
      status('');
    }
    const editorValue = monacoEditorInstance ? monacoEditorInstance.getValue() : document.getElementById('batch-textarea').value;
    const parsedBatchData = (await parseBatchData(editorValue, favorites, { nometa: !DEBUG, silent: true })).data;

    const progressElement = window.document.getElementById("enhance-progress");
    progressElement.style.display = "block";
    const progressElementBar = window.document.getElementById("enhance-progress-bar");
    progressElementBar.style.width = `0%`;

    let i = 0;
    const total = parsedBatchData.length;

    // Get the text span to update
    const $btnText = $button.find('.btn-text');
    const originalText = $btnText.text();

    /**
     * Reset UI to initial state
     */
    const resetUI = function() {
      $button.prop('disabled', false);
      $button.removeClass('loading');
      $button.find('.btn-icon').removeClass('spinning');
      $btnText.text(originalText);
      progressElement.style.display = "none";
      $stopButton.hide();
    };

    const postBatch = function() {
      // Check if cancelled
      if (isCancelled) {
        if (status) {
          status(`Megszakítva: ${i}/${total} elküldve`);
        }
        resetUI();
        return;
      }

      // Update button text with progress
      $btnText.text(` ${i} / ${total}`);

      if (status) {
        status(`Ready: ${i}/${total}`);
      }
      progressElementBar.style.width = `${i / total * 100}%`;
      i++;
      if (parsedBatchData.length) {
        if (!DEBUG) {
          $.post('/timelog', parsedBatchData.shift(), postBatch);
        } else {
          window.setTimeout(() => {
            console.log(parsedBatchData.shift());
            postBatch();
          }, 300);
        }
      } else {
        if (!DEBUG) {
          window.location.reload();
        } else {
          // Re-enable button in debug mode (page doesn't reload)
          resetUI();
        }
      }
    };
    postBatch();
  });
}
