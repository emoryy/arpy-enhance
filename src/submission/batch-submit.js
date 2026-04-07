/**
 * Batch Submission Module
 * Handles batch work hour entry submission
 */

import { parseBatchData } from '../parser/batch-parser.js';
import { DEBUG } from '../constants.js';
import { favorites } from '../favorites/favorites-manager.js';
import { monacoEditorInstance } from '../monaco/monaco-setup.js';
import { status } from '../utils/dom-helpers.js';

// Countdown timer reference
let countdownTimer = null;

// Cancellation flag for stopping submission
let isCancelled = false;

// Retry configuration
const MAX_RETRIES = 5;
const RETRY_BASE_DELAY_MS = 2000;

// State preserved for resume functionality
let pendingBatchState = null;

function clearCountdown() {
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
}

function showRetryStatus(attempt, maxRetries, delayMs, httpStatus) {
  const targetTime = Date.now() + delayMs;
  const updateCountdown = () => {
    const remaining = Math.max(0, Math.ceil((targetTime - Date.now()) / 1000));
    status(
      `<span class="status-retry"><i class="icon-warning-sign"></i> Hiba (HTTP ${httpStatus}) &mdash; ` +
      `újrapróbálás <strong>${attempt}/${maxRetries}</strong>, ` +
      `<span class="status-countdown">${remaining}s</span></span>`,
      'error',
      { html: true }
    );
  };
  clearCountdown();
  updateCountdown();
  countdownTimer = setInterval(updateCountdown, 1000);
}

/**
 * Setup batch submit button handler
 */
export function setupBatchSubmitButton() {
  const $submitButton = $("#submit-batch-button");
  const $stopButton = $("#stop-batch-button");
  const $resumeButton = $("#resume-batch-button");

  // Stop button click handler
  $stopButton.on("click", function() {
    isCancelled = true;
  });

  // Resume button click handler
  $resumeButton.on("click", function() {
    if (!pendingBatchState) return;
    $resumeButton.hide();
    const { remaining, completed, total } = pendingBatchState;
    pendingBatchState = null;
    startBatchSubmission($submitButton, $stopButton, $resumeButton, remaining, completed, total);
  });

  $submitButton.button().on("click", async function() {
    const $button = $(this);

    // Prevent double-click while saving
    if ($button.prop('disabled')) {
      return;
    }

    console.log("batch button pressed");
    status('');
    const editorValue = monacoEditorInstance ? monacoEditorInstance.getValue() : document.getElementById('batch-textarea').value;
    const parsedBatchData = (await parseBatchData(editorValue, favorites, { nometa: !DEBUG, silent: true })).data;

    pendingBatchState = null;
    $resumeButton.hide();
    startBatchSubmission($button, $stopButton, $resumeButton, parsedBatchData, 0, parsedBatchData.length);
  });
}

/**
 * Post a single entry with retry logic (exponential backoff)
 * Returns a promise that resolves on success, rejects if retries exhausted or cancelled.
 */
function postWithRetry(entryData, onRetryStatus) {
  return new Promise((resolve, reject) => {
    let attempt = 0;

    const tryPost = function() {
      if (isCancelled) {
        reject('cancelled');
        return;
      }

      attempt++;

      if (DEBUG) {
        window.setTimeout(() => {
          console.log(entryData);
          resolve();
        }, 300);
        return;
      }

      $.post('/timelog', entryData)
        .done(() => resolve())
        .fail((jqXHR) => {
          if (isCancelled) {
            reject('cancelled');
            return;
          }
          if (attempt >= MAX_RETRIES) {
            reject('max_retries');
            return;
          }
          const delay = RETRY_BASE_DELAY_MS * Math.pow(2, attempt - 1);
          if (onRetryStatus) {
            onRetryStatus(attempt, MAX_RETRIES, delay, jqXHR.status);
          }
          waitWithCancelCheck(delay).then(tryPost).catch(() => reject('cancelled'));
        });
    };

    tryPost();
  });
}

/**
 * Wait for a delay, but check cancellation periodically so the stop button stays responsive.
 */
function waitWithCancelCheck(delayMs) {
  return new Promise((resolve, reject) => {
    const checkInterval = 200;
    let elapsed = 0;

    const tick = function() {
      if (isCancelled) {
        reject();
        return;
      }
      elapsed += checkInterval;
      if (elapsed >= delayMs) {
        resolve();
      } else {
        window.setTimeout(tick, checkInterval);
      }
    };

    window.setTimeout(tick, Math.min(checkInterval, delayMs));
  });
}

/**
 * Run the batch submission loop
 */
function startBatchSubmission($button, $stopButton, $resumeButton, remaining, completed, total) {
  isCancelled = false;

  // Set loading state
  $button.prop('disabled', true);
  $button.addClass('loading');
  $button.find('.btn-icon').addClass('spinning');
  $stopButton.show();

  const progressElement = window.document.getElementById("enhance-progress");
  progressElement.style.display = "block";
  const progressElementBar = window.document.getElementById("enhance-progress-bar");

  const $btnText = $button.find('.btn-text');
  const originalText = $btnText.text();

  const resetUI = function() {
    $button.prop('disabled', false);
    $button.removeClass('loading');
    $button.find('.btn-icon').removeClass('spinning');
    $btnText.text(originalText);
    progressElement.style.display = "none";
    $stopButton.hide();
  };

  const updateProgress = function() {
    $btnText.text(` ${completed} / ${total}`);
    progressElementBar.style.width = `${completed / total * 100}%`;
    status(`${completed}/${total} elküldve`);
  };

  const postNext = async function() {
    updateProgress();

    if (!remaining.length) {
      if (!DEBUG) {
        window.location.reload();
      } else {
        resetUI();
      }
      return;
    }

    const entry = remaining[0];
    try {
      await postWithRetry(entry, (attempt, maxRetries, delay, httpStatus) => {
        showRetryStatus(attempt, maxRetries, delay, httpStatus);
        $btnText.html(` ${completed} / ${total} <i class="icon-warning-sign icon-white"></i>`);
      });
      clearCountdown();
      remaining.shift();
      completed++;
      postNext();
    } catch (reason) {
      clearCountdown();
      if (reason === 'cancelled') {
        status(`Megszakítva: ${completed}/${total} elküldve`);
        pendingBatchState = { remaining, completed, total };
        resetUI();
        $resumeButton.show();
      } else if (reason === 'max_retries') {
        status(
          `<span class="status-retry"><i class="icon-remove-sign"></i> Sikertelen küldés <strong>${MAX_RETRIES}</strong> próbálkozás után. ` +
          `<strong>${completed}/${total}</strong> elküldve.</span>`,
          'error',
          { html: true }
        );
        pendingBatchState = { remaining, completed, total };
        resetUI();
        $resumeButton.show();
      }
    }
  };

  postNext();
}
