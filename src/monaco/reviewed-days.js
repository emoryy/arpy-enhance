/**
 * Reviewed Days Module
 * A date label followed by a marker ("07-01 ✓", or "07-01 ok") declares the
 * day reviewed: its entries are greyed out in the editor, and a CodeLens above
 * every date label toggles the marker. Opt-in via the "showReviewedDays" setting;
 * the marker syntax itself is always accepted by the parser.
 */

import { DATE_LINE_RE, REVIEWED_MARKER } from '../constants.js';
import { settingsManager } from '../settings/settings-manager.js';

let reviewedDecorationsCollection = null;
let reviewedEditor = null;
let codeLensChangeEmitter = null;

function isEnabled() {
  return settingsManager.get('showReviewedDays');
}

/**
 * Find date label lines and the line range each day block spans
 * (up to the line before the next date label).
 */
function findDayBlocks(model) {
  const blocks = [];
  const lineCount = model.getLineCount();
  for (let lineNumber = 1; lineNumber <= lineCount; lineNumber++) {
    const match = model.getLineContent(lineNumber).match(DATE_LINE_RE);
    if (match) {
      if (blocks.length) {
        blocks[blocks.length - 1].endLine = lineNumber - 1;
      }
      blocks.push({ dateLine: lineNumber, endLine: lineCount, date: match[1], reviewed: !!match[2] });
    }
  }
  return blocks;
}

/**
 * Grey out the entries of reviewed days and mark the whole block in the gutter
 */
export function updateReviewedDecorations(editor) {
  const model = editor?.getModel();
  if (!model) {
    return;
  }
  const decorations = [];
  const blocks = isEnabled() ? findDayBlocks(model) : [];
  blocks.filter((block) => block.reviewed).forEach((block) => {
    decorations.push({
      range: new monaco.Range(block.dateLine, 1, block.endLine, 1),
      options: { isWholeLine: true, linesDecorationsClassName: 'arpy-reviewed-gutter' },
    });
    // The date line itself stays fully visible as the day's header.
    if (block.endLine > block.dateLine) {
      decorations.push({
        range: new monaco.Range(block.dateLine + 1, 1, block.endLine, model.getLineMaxColumn(block.endLine)),
        options: { inlineClassName: 'arpy-reviewed-day' },
      });
    }
  });
  if (reviewedDecorationsCollection) {
    reviewedDecorationsCollection.clear();
  }
  reviewedDecorationsCollection = editor.createDecorationsCollection(decorations);
}

/**
 * Add or remove the reviewed marker on a date label line
 */
export function toggleReviewedDay(editor, lineNumber) {
  const model = editor.getModel();
  const line = model.getLineContent(lineNumber);
  const match = line.match(DATE_LINE_RE);
  if (!match) {
    return;
  }
  const indent = line.match(/^\s*/)[0];
  const newLine = match[2] ? `${indent}${match[1]}` : `${indent}${match[1]} ${REVIEWED_MARKER}`;
  editor.pushUndoStop();
  editor.executeEdits('arpy-reviewed-day', [{
    range: new monaco.Range(lineNumber, 1, lineNumber, model.getLineMaxColumn(lineNumber)),
    text: newLine,
  }]);
  editor.pushUndoStop();
}

/**
 * Register the CodeLens that toggles the reviewed marker above each date label
 */
export function registerReviewedCodeLens(editor) {
  reviewedEditor = editor;
  codeLensChangeEmitter = new monaco.Emitter();
  const commandId = editor.addCommand(0, (_accessor, lineNumber) => toggleReviewedDay(editor, lineNumber), '');
  monaco.languages.registerCodeLensProvider('arpy-log', {
    onDidChange: codeLensChangeEmitter.event,
    provideCodeLenses(model) {
      if (!isEnabled()) {
        return { lenses: [], dispose() {} };
      }
      const lenses = findDayBlocks(model).map((block) => ({
        range: new monaco.Range(block.dateLine, 1, block.dateLine, 1),
        command: {
          id: commandId,
          title: block.reviewed ? '✓ átnézve (visszavonás)' : '☐ megjelölés átnézettként',
          arguments: [block.dateLine],
        },
      }));
      return { lenses, dispose() {} };
    },
    resolveCodeLens(_model, lens) {
      return lens;
    },
  });
}

/**
 * Re-apply decorations and CodeLenses after the setting changed
 */
export function refreshReviewedDays() {
  if (!reviewedEditor) {
    return;
  }
  updateReviewedDecorations(reviewedEditor);
  codeLensChangeEmitter?.fire(undefined);
}
