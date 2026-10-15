/**
 * DOM Setup Module
 * Creates and injects UI structure into the page
 */

import { DEBUG } from '../constants.js';

/**
 * Create progress indicator elements
 */
export function createProgressIndicator() {
  $("#time_entry_submit").before(`
    <span id="status"></span>&nbsp;
    <div id="enhance-progress" class="progress progress-striped active" style="display: none;">
      <div id="enhance-progress-bar" class="bar"></div>
    </div>
  `);
}

/**
 * Create batch submit button and help button
 */
export function createBatchSubmitButton() {
  $("#time_entry_submit").before(
    `<button class="btn btn-danger btn-large" type="button" id="stop-batch-button" style="display: none;"><i class="icon-stop icon-white"></i><span class="btn-text"> Stop</span></button>`
  );
  $("#time_entry_submit").before(
    `<button class="btn btn-warning btn-large" type="button" id="resume-batch-button" style="display: none;"><i class="icon-play icon-white"></i><span class="btn-text"> Folytatás</span></button>`
  );
  $("#time_entry_submit").before(
    `<button class="btn btn-sm" type="button" id="open-help-dialog" title="Formátum help"><span class="i">❓</span></button>`
  );
  $("#time_entry_submit").before(
    `<button class="btn ${DEBUG ? "btn-danger" : "btn-primary"} btn-large" type="button" id="submit-batch-button"><span class="btn-icon"><i class="icon-ok icon-white"></i></span><span class="btn-text"> Mentés!</span></button>&nbsp;`
  );
}

/**
 * Create favorite add button
 */
export function createFavoriteAddButton() {
  $("#project_id").before(
    '<button class="btn btn-primary btn-sm" type="button" id="pick-category-button" title="Projekt / todo lista / todo kiválasztása keresővel">🔍</button>'
  );
  $("#todo_item_id").after(
    '<button class="btn btn-primary btn-sm" type="button" id="add-fav-button"><span class="i">★</span> Fav</button>'
  );
}

/**
 * Create batch textarea with help text
 * @param {string} placeholderText - Help text for textarea placeholder
 */
export function createBatchTextarea(placeholderText) {
  $("#time_entry_description").after(
    `<textarea id="batch-textarea" placeholder="${placeholderText}" class="textarea ui-widget-content ui-corner-all" spellcheck="false"></textarea>`
  );
}

/**
 * Wrap time entry container content in panel structure
 */
export function wrapTimeEntryContainer() {
  // Add panel class to time_entry_container
  const timeEntryContainer = document.getElementById('time_entry_container');
  timeEntryContainer.classList.add('panel');

  // Wrap time_entry_container content in panel-content
  const timeEntryContent = document.createElement('div');
  timeEntryContent.className = 'panel-content';
  while (timeEntryContainer.firstChild) {
    timeEntryContent.appendChild(timeEntryContainer.firstChild);
  }
  timeEntryContainer.appendChild(timeEntryContent);

  // Add panel header
  $("#time_entry_container").prepend(`
    <div class="panel-header">
      <div class="panel-header-title">Szerkesztő</div>
      <div class="panel-header-actions">
        <button type="button" class="btn btn-mini panel-swap-button" title="Panelek cseréje">⬌</button>
      </div>
    </div>
  `);
}

/**
 * Create preview container
 */
export function createPreviewContainer() {
  $("#time_entry_container").after(`<div id="preview-container" class="panel">
    <div class="panel-header">
      <div class="panel-header-title">Előnézet</div>
      <div class="panel-header-actions">
        <button type="button" class="btn btn-mini panel-swap-button" title="Panelek cseréje">⬌</button>
      </div>
    </div>
    <div class="panel-content" id="preview-content"></div>
  </div>`);
}

/**
 * Wrap editor and preview in container
 */
export function wrapEditorAndPreview() {
  $("#time_entry_container, #preview-container").wrapAll('<div id="editor-preview-wrapper"></div>');
}

/**
 * Wrap month selector and time log in a panel
 */
export function wrapMonthAndTimeLog() {
  // Wrap both elements in a single container (no "well" class)
  $("#month_selector, #time_log").wrapAll('<div id="month-timelog-container" class="panel"></div>');

  // Add panel header
  $("#month-timelog-container").prepend(`
    <div class="panel-header">
      <div class="panel-header-title">Időnapló</div>
    </div>
  `);

  // Wrap content
  const container = document.getElementById('month-timelog-container');
  const panelContent = document.createElement('div');
  panelContent.className = 'panel-content';

  // Move month_selector and time_log into panel-content
  const monthSelector = document.getElementById('month_selector');
  const timeLog = document.getElementById('time_log');
  if (monthSelector) panelContent.appendChild(monthSelector);
  if (timeLog) panelContent.appendChild(timeLog);

  container.appendChild(panelContent);
}

/**
 * Create favorites container
 */
export function createFavoritesContainer() {
  $("#timelog-page").prepend(`<div id="favorites-container" class="panel">
    <div class="panel-header">
      <div class="panel-header-title">
        Kategóriák
        <button id="advanced-selector-trigger" type="button" class="btn btn-mini btn-primary" title="Projekt kategória kiválasztó">
          Projekt / Todo lista / Todo választó ⯆
        </button>
      </div>
      <div class="panel-header-actions">
        <div class="quick-filter-container">
          <div id="fav-sort-controls" class="btn-group">
            <button type="button" class="btn btn-mini" data-sort="default" title="Eredeti sorrend (hozzáadás szerint)">
              Alapértelmezett
            </button>
            <button type="button" class="btn btn-mini" data-sort="label" title="Címke szerint ABC sorrendbe">
              Címke
            </button>
            <button type="button" class="btn btn-mini" data-sort="category" title="Kategória szerint ABC sorrendbe">
              Kategória
            </button>
          </div>
          <button id="clear-invalid-favs-button" type="button" class="btn btn-mini btn-danger" title="Az összes lezárt / nem létező kategóriára hivatkozó (pirossal jelölt) kedvenc törlése." style="display: none;">
            ✖
          </button>
          <button id="export-favs-button" type="button" class="btn btn-mini" title="Kedvencek mentése JSON fájlba">
            Export
          </button>
          <button id="import-favs-button" type="button" class="btn btn-mini" title="Kedvencek betöltése JSON fájlból. A meglévőkkel összefésüli: létező címkét nem ír felül, ütköző címkét kihagy.">
            Import
          </button>
          <input id="import-favs-input" type="file" accept=".json,application/json" style="display: none;">
          <input class="quick-filter-input" placeholder="Gyorsszűrés">
          <button id="maximize-button" type="button" class="btn btn-mini" data-sort="label" style="font-size: 16px;" title="Teljes magasság">
            ⬍
          </button>
        </div>
      </div>
    </div>
    <div class="panel-content">
      <ul id="favorites-list"></ul>
    </div>
    <div id="advanced-selector-dropdown" class="advanced-selector-dropdown" style="display: none;">
      <div class="advanced-selector-search-bar">
        <input
          type="text"
          id="advanced-selector-search"
          class="advanced-selector-search-input"
          placeholder="Keresés szavanként, pl. ham ált fejl"
          autocomplete="off"
        />
      </div>
      <div class="advanced-selector-content">
        <div class="advanced-selector-section">
          <div class="advanced-selector-section-title">
            <span class="advanced-selector-step">1</span>
            <span>Projektek</span>
            <span class="advanced-selector-step-hint">1. szó szűri</span>
          </div>
          <div id="advanced-selector-projects" class="advanced-selector-list"></div>
        </div>
        <div class="advanced-selector-section">
          <div class="advanced-selector-section-title">
            <span class="advanced-selector-step">2</span>
            <span>Todo listák</span>
            <span class="advanced-selector-step-hint">2. szó szűri</span>
          </div>
          <div id="advanced-selector-categories" class="advanced-selector-list">
            <div class="advanced-selector-info">Válassz projektet</div>
          </div>
        </div>
        <div class="advanced-selector-section">
          <div class="advanced-selector-section-title">
            <span class="advanced-selector-step">3</span>
            <span>Todo elemek</span>
            <span class="advanced-selector-step-hint">3. szó szűri</span>
          </div>
          <div id="advanced-selector-items" class="advanced-selector-list">
            <div class="advanced-selector-info">Válassz todo listát</div>
          </div>
        </div>
      </div>
      <div class="advanced-selector-footer">
        <span id="advanced-selector-mode-label" class="advanced-selector-mode-label">Kedvencek kezelése</span>
        <span><kbd>↑</kbd> <kbd>↓</kbd> navigáció</span>
        <span><kbd>Enter</kbd> <span id="advanced-selector-enter-action">hozzáadás / eltávolítás</span></span>
        <span><kbd>Esc</kbd> bezárás</span>
      </div>
    </div>
  </div>`);
}

/**
 * Initialize all DOM structure
 * @param {string} helpText - Help text for textarea placeholder
 */
export function initializeDOMStructure(helpText) {
  createProgressIndicator();
  createBatchSubmitButton();
  createBatchTextarea(helpText);
  createFavoriteAddButton();
  wrapTimeEntryContainer();
  createPreviewContainer();
  wrapEditorAndPreview();
  createFavoritesContainer();
  wrapMonthAndTimeLog();
}
