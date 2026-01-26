/**
 * Monaco Layout Helper
 * Handles Monaco editor layout updates
 * Original lines 124-133 from ArpyEnhance.user.js
 */

let monacoEditorInstance = null;

/**
 * Set the Monaco editor instance
 */
export function setMonacoInstance(instance) {
  monacoEditorInstance = instance;
}

/**
 * Helper function to update Monaco layout with explicit dimensions
 */
export function updateMonacoLayout() {
  if (monacoEditorInstance) {
    const editorContainer = document.getElementById('monaco-editor-container');
    if (editorContainer) {
      const rect = editorContainer.getBoundingClientRect();
      monacoEditorInstance.layout({ width: rect.width, height: rect.height });
    }
  }
}
