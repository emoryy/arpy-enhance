/**
 * Monaco Editor Decorations Module
 * Handles inline decorations showing hour totals on date lines
 */

import { settingsManager } from '../settings/settings-manager.js';
import { monacoEditorInstance } from './monaco-setup.js';

// Track decorations collection
let editorDecorationsCollection = null;

/**
 * Update editor decorations with hour indicators on date lines
 * @param {Object} summarizedData - Parsed data with date summaries
 */
export function updateEditorDecorations(summarizedData) {
  if (!monacoEditorInstance) {
    console.log('No monaco editor instance');
    return;
  }

  const model = monacoEditorInstance.getModel();
  if (!model) {
    console.log('No monaco model');
    return;
  }

  const settings = settingsManager.getSettings();

  // Clear decorations if the setting is disabled
  if (!settings.showEditorHourIndicator) {
    if (editorDecorationsCollection) {
      editorDecorationsCollection.clear();
    }
    return;
  }

  const decorations = [];
  const dateData = summarizedData.dates || {};
  console.log('Updating editor decorations, dateData:', dateData);

  const TARGET_WORK_HOURS = settings.targetWorkHours;
  const MAX_DISPLAY_HOURS = settings.maxDisplayHours;

  // Find all date lines in the editor
  const lineCount = model.getLineCount();
  for (let lineNumber = 1; lineNumber <= lineCount; lineNumber++) {
    const lineContent = model.getLineContent(lineNumber).trim();

    // Check if this line is a date label (matches YYYY-MM-DD or MM-DD)
    const dateMatch = lineContent.match(/^(\d{4}-\d{2}-\d{2}|\d{2}-\d{2})$/);
    if (dateMatch) {
      const dateStr = dateMatch[1];
      // Normalize to YYYY-MM-DD format if needed
      const fullDate = dateStr.length === 5
        ? `${moment().year()}-${dateStr}`
        : dateStr;

      const dayData = dateData[fullDate];
      if (dayData) {
        const sum = dayData.sum;
        const isOkay = sum >= TARGET_WORK_HOURS;
        const percentage = Math.min((sum / MAX_DISPLAY_HOURS) * 100, 100);
        const targetPercentage = (TARGET_WORK_HOURS / MAX_DISPLAY_HOURS) * 100;

        // Create inline decoration with sum and progress indicator
        // Calculate based on TARGET_WORK_HOURS (8h), with half-hour resolution
        const hoursInTarget = Math.min(sum, TARGET_WORK_HOURS);
        const overtimeHours = Math.max(0, sum - TARGET_WORK_HOURS);

        // Build progress bar with 1h = full square, 0.5h = half square
        let filledBar = '';
        const fullHours = Math.floor(hoursInTarget);
        const hasHalfHour = (hoursInTarget % 1) >= 0.5;

        filledBar = '\u25A0'.repeat(fullHours); // ■ BLACK SQUARE
        if (hasHalfHour) {
          filledBar += '\u25AA'; // ▪ BLACK SMALL SQUARE
        }

        const emptySquares = TARGET_WORK_HOURS - Math.ceil(hoursInTarget);
        const emptyBar = '\u25AB'.repeat(emptySquares); // ▫ WHITE SMALL SQUARE

        // Overtime
        let overtimeBar = '';
        if (overtimeHours > 0) {
          const overtimeFullHours = Math.floor(overtimeHours);
          const overtimeHasHalf = (overtimeHours % 1) >= 0.5;
          overtimeBar = '\u25A0'.repeat(overtimeFullHours); // ■ BLACK SQUARE
          if (overtimeHasHalf) {
            overtimeBar += '\u25AA'; // ▪ BLACK SMALL SQUARE
          }
        }
        const progressDisplay = `\u3010${filledBar}${emptyBar}\u3011${overtimeBar}`; // 【 and 】
        const lineLength = model.getLineContent(lineNumber).length;

        console.log(`Adding decoration for line ${lineNumber}: ${fullDate}, sum: ${sum}h`);

        decorations.push({
          range: new monaco.Range(lineNumber, 1, lineNumber, lineLength + 1),
          options: {
            after: {
              content: `  ${sum}h ${progressDisplay}`,
              inlineClassName: isOkay ? 'date-decoration okay' : 'date-decoration'
            }
          }
        });
      }
    }
  }

  console.log(`Total decorations created: ${decorations.length}`);

  // Apply decorations
  if (editorDecorationsCollection) {
    editorDecorationsCollection.clear();
  }
  editorDecorationsCollection = monacoEditorInstance.createDecorationsCollection(decorations);
}
