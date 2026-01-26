/**
 * Settings Modal Module
 * Settings popup UI and handlers
 */

import { settingsManager } from '../settings/settings-manager.js';
import { ORIGINAL_BOTTOM_OFFSET_PX } from '../constants.js';

// External dependencies (will be set by main.js)
let applyTheme = null;
let updatePreview = null;
let updateMonacoLayout = null;

/**
 * Initialize settings modal module with dependencies
 */
export function initSettingsModalModule(deps) {
  applyTheme = deps.applyTheme;
  updatePreview = deps.updatePreview;
  updateMonacoLayout = deps.updateMonacoLayout;
}

/**
 * Create and inject settings modal HTML
 */
export function createSettingsModal() {
  $("body").append(`
    <div class="modal" id="settingsModal" tabindex="-1" role="dialog" aria-labelledby="settingsModalLabel" aria-hidden="true" style="display: none;">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
        <h3 id="settingsModalLabel">Beállítások</h3>
      </div>
      <div class="modal-body">
        <form id="settings-form" class="form-horizontal">
          <div class="control-group">
            <label class="control-label" for="setting-redmine-api-key">Redmine API-kulcs</label>
            <div class="controls">
              <input type="text" id="setting-redmine-api-key" class="input-xlarge" placeholder="Redmine API-kulcs">
              <span class="help-block">A Redmine ticketek adatainak automatikus lekéréséhez szükséges.</span>
            </div>
          </div>

          <div class="control-group">
            <label class="control-label" for="setting-cache-ttl">Redmine-gyorsítótár érvényessége (órában)</label>
            <div class="controls">
              <input type="number" id="setting-cache-ttl" class="input-small" min="1" max="168" value="24">
              <span class="help-block">A Redmine-adatok gyorsítótárazásának időtartama órában.</span>
            </div>
          </div>

          <div class="control-group">
            <label class="control-label">Téma</label>
            <div class="controls">
              <label class="radio inline">
                <input type="radio" name="setting-theme" value="light" id="setting-theme-light"> Világos
              </label>
              <label class="radio inline">
                <input type="radio" name="setting-theme" value="dark" id="setting-theme-dark"> Sötét
              </label>
            </div>
          </div>

          <div class="control-group">
            <label class="control-label" for="setting-target-hours">Napi cél munkaidő</label>
            <div class="controls">
              <input type="number" id="setting-target-hours" class="input-small" min="1" max="24" step="0.5" value="8">
              <span class="help-block">A napi munkaidő célszáma (alapértelmezetten 8).</span>
            </div>
          </div>

          <div class="control-group">
            <label class="control-label" for="setting-max-hours">A folyamatjelző maximuma</label>
            <div class="controls">
              <input type="number" id="setting-max-hours" class="input-small" min="1" max="24" step="0.5" value="12">
              <span class="help-block">Maximum hány munkaóra jelenjen meg a napi folyamatjelzőn, túlóra esetén. Ez egy vizuális beállítás, mely nem befolyásolja az elszámolt órákat (alapértelmezetten 12).</span>
            </div>
          </div>

          <div class="control-group">
            <label class="control-label">Egyéb beállítások</label>
            <div class="controls">
              <label class="checkbox">
                <input type="checkbox" id="setting-show-progress"> Napi folyamatjelző mutatása az előnézet panelen
              </label>
              <label class="checkbox">
                <input type="checkbox" id="setting-show-editor-hours"> Óra-összesítő mutatása a szerkesztőben
              </label>
              <label class="checkbox">
                <input type="checkbox" id="setting-favs-maximized"> Kedvencek panel maximalizálása
              </label>
              <label class="checkbox">
                <input type="checkbox" id="setting-panels-swapped"> Előnézet és szerkesztő panelek felcserélése
              </label>
            </div>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button class="btn" data-dismiss="modal" aria-hidden="true">Mégsem</button>
        <button class="btn btn-primary" id="save-settings-button">Mentés</button>
      </div>
    </div>
  `);

  // Attach save button handler
  document.getElementById('save-settings-button').addEventListener('click', saveSettingsFromModal);
}

/**
 * Load current settings into modal form
 */
export function loadSettingsToModal() {
  const settings = settingsManager.getSettings();
  document.getElementById('setting-redmine-api-key').value = settings.redmineApiKey || '';
  document.getElementById('setting-cache-ttl').value = settings.redmineCacheTtlHours;
  document.getElementById(`setting-theme-${settings.theme}`).checked = true;
  document.getElementById('setting-target-hours').value = settings.targetWorkHours;
  document.getElementById('setting-max-hours').value = settings.maxDisplayHours;
  document.getElementById('setting-show-progress').checked = settings.showProgressIndicator;
  document.getElementById('setting-show-editor-hours').checked = settings.showEditorHourIndicator;
  document.getElementById('setting-favs-maximized').checked = settings.favsMaximized;
  document.getElementById('setting-panels-swapped').checked = settings.panelsSwapped;
}

/**
 * Save settings from modal form
 */
export function saveSettingsFromModal() {
  const settings = settingsManager.getSettings();

  const oldTheme = settings.theme;
  const oldTargetHours = settings.targetWorkHours;
  const oldMaxHours = settings.maxDisplayHours;
  const oldShowEditorHours = settings.showEditorHourIndicator;
  const oldShowProgress = settings.showProgressIndicator;
  const oldFavsMaximized = settings.favsMaximized;
  const oldPanelsSwapped = settings.panelsSwapped;

  // Save each setting using the settingsManager.set() method
  settingsManager.set('redmineApiKey', document.getElementById('setting-redmine-api-key').value);
  settingsManager.set('redmineCacheTtlHours', parseInt(document.getElementById('setting-cache-ttl').value));
  settingsManager.set('theme', document.querySelector('input[name="setting-theme"]:checked').value);
  settingsManager.set('targetWorkHours', parseFloat(document.getElementById('setting-target-hours').value));
  settingsManager.set('maxDisplayHours', parseFloat(document.getElementById('setting-max-hours').value));
  settingsManager.set('showProgressIndicator', document.getElementById('setting-show-progress').checked);
  settingsManager.set('showEditorHourIndicator', document.getElementById('setting-show-editor-hours').checked);
  settingsManager.set('favsMaximized', document.getElementById('setting-favs-maximized').checked);
  settingsManager.set('panelsSwapped', document.getElementById('setting-panels-swapped').checked);

  // Get updated settings for comparison
  const newSettings = settingsManager.getSettings();

  // Apply changes that need immediate effect
  if (oldTheme !== newSettings.theme && applyTheme) {
    applyTheme(newSettings.theme);
  }

  // Update CSS variables
  document.documentElement.style.setProperty('--target-hours', newSettings.targetWorkHours);
  document.documentElement.style.setProperty('--max-hours', newSettings.maxDisplayHours);

  // Re-render if certain settings changed
  if ((oldTargetHours !== newSettings.targetWorkHours ||
      oldMaxHours !== newSettings.maxDisplayHours ||
      oldShowEditorHours !== newSettings.showEditorHourIndicator ||
      oldShowProgress !== newSettings.showProgressIndicator) && updatePreview) {
    updatePreview();
  }

  // Handle maximize state change
  if (oldFavsMaximized !== newSettings.favsMaximized) {
    const favoritesPanel = document.querySelector("#favorites-container");
    const wrapper = document.querySelector("#editor-preview-wrapper");
    const maximizeButton = document.querySelector('#maximize-button');

    if (newSettings.favsMaximized) {
      favoritesPanel.classList.add('maximalized');
      maximizeButton.innerHTML = "◱";
      wrapper.style.height = '85vh';
      favoritesPanel.style.height = '';
      favoritesPanel.style.maxHeight = '';
      localStorage.setItem('arpyEnhanceFavsMaxed', 'true');
    } else {
      favoritesPanel.classList.remove('maximalized');
      maximizeButton.innerHTML = "⬍";
      const savedVh = parseFloat(localStorage.getItem('arpyEnhanceTopPanelVh') || '20');
      const bottomVh = 100 - savedVh;
      favoritesPanel.style.height = `${savedVh}vh`;
      favoritesPanel.style.maxHeight = `${savedVh}vh`;
      wrapper.style.height = `calc(${bottomVh}vh - ${ORIGINAL_BOTTOM_OFFSET_PX}px)`;
      localStorage.removeItem('arpyEnhanceFavsMaxed');
    }
    if (updateMonacoLayout) {
      setTimeout(updateMonacoLayout, 50);
    }
  }

  // Handle panel swap state change
  if (oldPanelsSwapped !== newSettings.panelsSwapped) {
    const timelogPage = document.querySelector("#timelog-page");
    if (newSettings.panelsSwapped) {
      timelogPage.classList.add('panels-swapped');
      localStorage.setItem('arpyEnhancePanelsSwapped', 'true');
    } else {
      timelogPage.classList.remove('panels-swapped');
      localStorage.removeItem('arpyEnhancePanelsSwapped');
    }
  }

  $('#settingsModal').modal('hide');
}

/**
 * Show settings modal
 */
export function showSettingsModal() {
  $('#settingsModal').modal('show');
  loadSettingsToModal();
}
