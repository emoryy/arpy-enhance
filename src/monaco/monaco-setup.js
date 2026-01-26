/**
 * Monaco Editor Setup Module
 * Initializes Monaco editor with custom language and themes
 */

import { MONACO_CSS_URL } from '../constants.js';
import { updateMonacoLayout, setMonacoInstance } from './monaco-layout.js';
import { getCurrentTheme, setMonacoEditorInstance } from '../theme/theme-manager.js';
import { favorites, getFullLabelPartsForFav } from '../favorites/favorites-manager.js';

export let monacoEditorInstance = null;

// External dependencies (will be set by main.js)
let updatePreview = null;

/**
 * Initialize Monaco editor module with dependencies
 */
export function initMonacoEditorModule(deps) {
  updatePreview = deps.updatePreview;
}

/**
 * Setup Arpy custom language and themes for Monaco
 */
function setupArpyLanguageAndTheme() {
  // --- Define Language ---
  monaco.languages.register({ id: 'arpy-log' });

  monaco.languages.setMonarchTokensProvider('arpy-log', {
    defaultToken: "invalid",

    tokenizer: {
      root: [
        // Rule 1: Comment lines
        [/^\s*#.*$/, "comment"],

        // Rule 2: Date Label lines (must be the only thing on the line)
        [/^\s*(\d{4}-\d{2}-\d{2}|\d{2}-\d{2})\s*$/, "date.label"],

        // Rule 3: Category Label lines (must be the only thing on the line)
        [/^\s*\S+\s*$/, "category.label"],

        // Rule 4: Work Hour Entry lines. Match the start and transition to a dedicated parser.
        [
          /^\s*(-|\d{4}-\d{2}-\d{2}|\d{2}-\d{2})/,
          {
            cases: {
              "-": { token: "delimiter", next: "@expect_number" },
              "@default": { token: "date.entry", next: "@expect_number" },
            },
          },
        ],
      ],

      expect_number: [
        // After the date/dash, we expect mandatory whitespace, then a number.
        [/\s+/, ""], // Consume whitespace, assign no token.
        [/(\d+([,.]\d+)?)/, { token: "number", next: "@expect_description" }],

        // If we don't find whitespace and a number, the rest of the line is invalid.
        [/.*$/, { token: "invalid", next: "@popall" }],
      ],

      expect_description: [
        // The remainder of the line is the description.
        // This state will now correctly handle an optional ticket number at the start.

        // Consume the single space separating the number from the description.
        [/\s/, ""],

        // Look for a ticket number at the beginning of the description.
        [/#\d+/, { token: "ticket.number", next: "@description_rest" }],

        // If no ticket number is found, transition immediately to parse the rest.
        // The empty regex acts as a fall-through.
        ["", { token: "", next: "@description_rest" }],
      ],

      description_rest: [
        // Whatever is left on the line is the description text.
        [/.*$/, { token: "description", next: "@popall" }],
      ],
    },
  });

  // --- Define Vibrant Light Theme (with a new color for ticket numbers) ---
  monaco.editor.defineTheme('arpy-light-vibrant', {
    base: 'vs',
    inherit: false,
    rules: [
      {
        token: "comment",
        foreground: "#6e6e6eff",
        background: "#000000ff",
        fontStyle: "italic"
      }, // Vibrant Green
      { token: "date.label", foreground: "#008000", fontStyle: "bold" }, // Bright Blue
      {
        token: "category.label",
        foreground: "#9400D3",
        fontStyle: "bold",
      }, // Dark Violet
      { token: "date.entry", foreground: "#008000", fontStyle: "bold" },
      { token: "delimiter", foreground: "#008000", fontStyle: "bold" },
      { token: "number", foreground: "#008fe2ff", fontStyle: "bold" },
      { token: "ticket.number", foreground: "#ff3c00ff" },
      { token: "description", foreground: "#222222" },
      { token: "invalid", foreground: "#a93f3fff", fontStyle: "bold" },
    ].map((rule) => {
      if (rule.foreground) {
        rule.foreground = rule.foreground.replace(/^#/, '');
      }
      if (rule.background) {
        rule.background = rule.background.replace(/^#/, '');
      }
      return rule;
    }),
    colors: {
      "editor.background": "#FFFFFF",
      "editor.foreground": "#222222",
      'editor.wordHighlightBackground': '#e9e9e9ff',
      "editorGutter.background": "#FFFFFF",
      "editorCursor.foreground": "#000000",
      "editor.lineHighlightBackground": "#00000000",
      "editor.lineHighlightBorder": "#00000000",
      "editor.selectionBackground": "#ADD6FF",
      "editorWidget.background": "#F3F3F3",
      "editorWidget.border": "#C8C8C8",
      "editorSuggestWidget.background": "#F3F3F3",
      "editorSuggestWidget.foreground": "#222222",
      "editorSuggestWidget.selectedBackground": "#0076c0ff",
      "editorSuggestWidget.selectedForeground": "#ffffffff",
      "editorSuggestWidget.highlightForeground": "#0076c0ff",
      "list.focusHighlightForeground": "#ffffff",
      "editorHoverWidget.background": "#F3F3F3",
      "input.background": "#FFFFFF",
      "input.foreground": "#222222",
      "input.border": "#C8C8C8",
      "list.hoverBackground": "#E8E8E8",
      "list.activeSelectionBackground": "#6dc7ffff",
      "scrollbarSlider.background": "#C8C8C8",
      "scrollbarSlider.hoverBackground": "#B0B0B0",
      "scrollbarSlider.activeBackground": "#989898",
    },
  });

  // --- Define Dark Theme ---
  monaco.editor.defineTheme('arpy-dark', {
    base: 'vs-dark',
    inherit: false,
    rules: [
      {
        token: "comment",
        foreground: "#888888",
        fontStyle: "italic"
      },
      { token: "date.label", foreground: "#4ec9b0", fontStyle: "bold" },
      {
        token: "category.label",
        foreground: "#c586c0",
        fontStyle: "bold",
      },
      { token: "date.entry", foreground: "#4ec9b0", fontStyle: "bold" },
      { token: "delimiter", foreground: "#4ec9b0", fontStyle: "bold" },
      { token: "number", foreground: "#569cd6", fontStyle: "bold" },
      { token: "ticket.number", foreground: "#f48771" },
      { token: "description", foreground: "#cccccc" },
      { token: "invalid", foreground: "#f48771", fontStyle: "bold" },
    ].map((rule) => {
      if (rule.foreground) {
        rule.foreground = rule.foreground.replace(/^#/, '');
      }
      if (rule.background) {
        rule.background = rule.background.replace(/^#/, '');
      }
      return rule;
    }),
    colors: {
      "editor.background": "#1a1a1a",
      "editor.foreground": "#cccccc",
      'editor.wordHighlightBackground': '#2d2d2d',
      "editorGutter.background": "#1a1a1a",
      "editorCursor.foreground": "#ffffff",
      "editor.lineHighlightBackground": "#00000000",
      "editor.lineHighlightBorder": "#00000000",
      "editor.selectionBackground": "#264f78",
      "editorWidget.background": "#252525",
      "editorWidget.border": "#454545",
      "editorSuggestWidget.background": "#252525",
      "editorSuggestWidget.foreground": "#cccccc",
      "editorSuggestWidget.selectedBackground": "#1277baff",
      "editorSuggestWidget.selectedForeground": "#ffffff",
      "editorSuggestWidget.highlightForeground": "#199bf1ff",
      "list.focusHighlightForeground": "#ffffff",
      "editorHoverWidget.background": "#252525",
      "input.background": "#2a2a2a",
      "input.foreground": "#cccccc",
      "input.border": "#3c3c3c",
      "list.hoverBackground": "#2a2a2a",
      "list.activeSelectionBackground": "#094771",
      "scrollbarSlider.background": "#454545",
      "scrollbarSlider.hoverBackground": "#5a5a5a",
      "scrollbarSlider.activeBackground": "#6a6a6a",
    },
  });
}

/**
 * Some crazy piece of code made by ChatGPT to resize the suggestion popups
 * dynamically to maximum available width
 */
function stretchSuggestWidgetContinuously(editor, opts = {}) {
  const dom = editor.getDomNode();
  if (!dom) {
    return;
  }

  const MIN_WIDTH = opts.minWidth || 200;
  const RIGHT_MARGIN = typeof opts.rightMargin === 'number' ? opts.rightMargin : 4;

  let widgetObserver = null;

  function stretchWidget(widget) {
    if (!widget || widget.style.display === 'none') {
      return;
    }

    const editorRect = dom.getBoundingClientRect();
    const widgetRect = widget.getBoundingClientRect();
    const minimap = dom.querySelector('.minimap');
    const minimapLeft = minimap ? minimap.getBoundingClientRect().left : editorRect.right;

    let available = Math.floor(Math.min(editorRect.right, minimapLeft) - widgetRect.left - RIGHT_MARGIN);
    if (available < MIN_WIDTH) {
      available = MIN_WIDTH;
    }

    widget.style.width = available + 'px';
    widget.style.maxWidth = available + 'px';

    const inner = widget.querySelector('.suggest-widget-container');
    if (inner) {
      inner.style.width = '100%';
      inner.style.maxWidth = '100%';
    }
  }

  // observe when the suggest widget is inserted
  const mo = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (!(node instanceof HTMLElement)) {
          continue;
        }
        if (node.classList && node.classList.contains('suggest-widget')) {
          const widget = node;

          // stretch immediately
          requestAnimationFrame(() => stretchWidget(widget));

          // observe widget subtree to catch every update Monaco does
          if (widgetObserver) {
            widgetObserver.disconnect();
          }
          widgetObserver = new MutationObserver(() => stretchWidget(widget));
          widgetObserver.observe(widget, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] });

          return;
        }
      }
    }
  });
  mo.observe(dom.ownerDocument.body, { childList: true, subtree: true });

  // also react to editor resizing/scrolling
  const disposables = [];
  const recomputeIfOpen = () => {
    const widget = dom.querySelector('.editor-widget.suggest-widget');
    if (widget) {
      stretchWidget(widget);
    }
  };
  disposables.push(editor.onDidLayoutChange(recomputeIfOpen));
  disposables.push(editor.onDidScrollChange(recomputeIfOpen));
  disposables.push(editor.onDidChangeCursorPosition(recomputeIfOpen));

  const resizeObserver = new ResizeObserver(recomputeIfOpen);
  resizeObserver.observe(dom);

  return {
    dispose() {
      mo.disconnect();
      if (widgetObserver) {
        widgetObserver.disconnect();
      }
      resizeObserver.disconnect();
      disposables.forEach(d => d && d.dispose && d.dispose());
    }
  };
}

/**
 * Initialize Monaco editor
 */
export function initializeMonacoEditor() {
  // Load Monaco CSS
  const cssLink = document.createElement('link');
  cssLink.rel = 'stylesheet';
  cssLink.href = MONACO_CSS_URL;
  document.head.appendChild(cssLink);

  const loaderScript = document.createElement('script');
  loaderScript.src = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.49.0/min/vs/loader.js';
  document.head.appendChild(loaderScript);

  loaderScript.onload = () => {
    unsafeWindow.require.config({
      paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.49.0/min/vs' }
    });
    unsafeWindow.require(['vs/editor/editor.main'], () => {
      const originalTextarea = document.getElementById('batch-textarea');
      const editorContainer = document.createElement('div');
      editorContainer.id = 'monaco-editor-container';
      editorContainer.style.flex = '1 1 0';

      originalTextarea.parentElement.insertBefore(editorContainer, originalTextarea);
      originalTextarea.style.display = 'none';

      // 1. Define everything first.
      setupArpyLanguageAndTheme();

      // 2. Create the editor directly with the final theme.
      const monacoTheme = getCurrentTheme() === 'dark' ? 'arpy-dark' : 'arpy-light-vibrant';
      const editor = monaco.editor.create(editorContainer, {
        value: originalTextarea.value,
        language: 'arpy-log',
        theme: monacoTheme,
        automaticLayout: false,
        wordWrap: 'on',
        fontSize: 14,
        fontFamily: 'monospace',
        wordBasedSuggestions: false,
        tabSize: 2,
        insertSpaces: true,
      });
      const watcher = stretchSuggestWidgetContinuously(editor, { minWidth: 240, rightMargin: 8 });

      // 3. Assign instance and attach the update listener.
      monacoEditorInstance = editor;
      setMonacoInstance(editor);
      setMonacoEditorInstance(editor);

      // Manual layout on explicit events only
      let resizeRAF;
      window.addEventListener('resize', () => {
        if (resizeRAF) {
          cancelAnimationFrame(resizeRAF);
        }
        resizeRAF = requestAnimationFrame(updateMonacoLayout);
      });

      monaco.languages.registerCompletionItemProvider('plaintext', {
        provideCompletionItems: () => {
          return { suggestions: [] };
        }
      });

      monaco.languages.registerCompletionItemProvider('arpy-log', {
        provideCompletionItems: function(model, position) {
          const wordInfo = model.getWordUntilPosition(position);
          const lineContent = model.getLineContent(position.lineNumber);
          const textBeforeWord = lineContent.substring(0, wordInfo.startColumn - 1);

          // Only trigger if the text on the line BEFORE the current word is whitespace.
          if (textBeforeWord.trim() !== '') {
            return {
              suggestions: []
            };
          }

          const suggestions = favorites
            // Filter out favorites that don't have a label.
            .filter((fav) => fav.label && fav.label.trim() !== '')
            // Filter suggestions to match what the user has started typing.
            .filter((fav) => {
              const needle = wordInfo.word.toLowerCase();
              const labelMatch = fav.label.toLowerCase().includes(needle);
              const descMatch = getFullLabelPartsForFav(fav).join(' / ').toLowerCase().includes(needle);
              return labelMatch || descMatch;
            })
            .map((fav) => {
              const range = {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: wordInfo.startColumn,
                endColumn: wordInfo.endColumn
              };
              const fullLabel = getFullLabelPartsForFav(fav).join(' / ');
              return {
                label: {
                  label: fav.label,
                  description: fullLabel
                },
                kind: monaco.languages.CompletionItemKind.Enum,
                insertText: fav.label,
                filterText: `${fav.label} ${fullLabel}`,
                documentation: fullLabel,
                range: range
              };
            });
          return { suggestions: suggestions };
        }
      });
      editor.onDidChangeModelContent(() => {
        const currentValue = editor.getValue();
        originalTextarea.value = currentValue;

        unsafeWindow.localStorage.batchTextareaSavedValue = currentValue;
        if (unsafeWindow.inputTimeout) {
          clearTimeout(unsafeWindow.inputTimeout);
        }
        unsafeWindow.inputTimeout = setTimeout(() => {
          if (updatePreview) {
            updatePreview();
          }
        }, 500);
      });

      // Trigger initial preview if there's content
      if (originalTextarea.value && updatePreview) {
        updatePreview();
      }
    });
  };

  loaderScript.onerror = () => {
    console.error("ArpyEnhance: Failed to load Monaco Editor's loader.js.");
  };
}

/**
 * Get Monaco editor instance
 */
export function getMonacoInstance() {
  return monacoEditorInstance;
}
