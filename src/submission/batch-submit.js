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
  $("#submit-batch-button").button().on("click", async function() {
    console.log("batch button pressed");
    if (status) {
      status('');
    }
    const editorValue = monacoEditorInstance ? monacoEditorInstance.getValue() : document.getElementById('batch-textarea').value;
    const parsedBatchData = (await parseBatchData(editorValue, favorites, { nometa: !DEBUG })).data;

    const progressElement = window.document.getElementById("enhance-progress");
    progressElement.style.display = "block";
    const progressElementBar = window.document.getElementById("enhance-progress-bar");
    progressElementBar.style.width = `0%`;

    let i = 0;
    const total = parsedBatchData.length;

    const postBatch = function() {
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
          }, 10);
        }
      } else {
        if (!DEBUG) { window.location.reload(); }
      }
    };
    postBatch();
  });
}
