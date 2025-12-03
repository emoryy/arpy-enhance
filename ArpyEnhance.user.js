// ==UserScript==
// @name         ArpyEnhance
// @namespace    hu.emoryy
// @version      0.17
// @description  enhances Arpy
// @author       Emoryy
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js
// @resource     MONACO_CSS https://cdn.jsdelivr.net/npm/monaco-editor@0.49.0/min/vs/editor/editor.main.css
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        unsafeWindow
// @include      http://arpy.dbx.hu/timelog*
// @include      https://arpy.dbx.hu/timelog*
// @downloadURL  https://github.com/emoryy/arpy-enhance/raw/master/ArpyEnhance.user.js
// @icon         https://icons.duckduckgo.com/ip2/dbx.hu.ico
// ==/UserScript==

(function() {
  'use strict';

  const REDMINE_API_KEY = unsafeWindow.localStorage.REDMINE_API_KEY;
  const REDMINE_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    link.setAttribute("type", "image/x-icon");
    document.getElementsByTagName('head')[0].appendChild(link);
  }
  link.href = "https://i.imgur.com/XqJTK1c.png";

  const debug = false;

  document.getElementById('person').disabled = false;

  moment.locale("hu");

  let favorites = [];
  let monacoEditorInstance = null;
  let favoriteSortOrder = unsafeWindow.localStorage.getItem('arpyEnhanceFavoriteSortOrder') || 'default';

  const redmineCache = {};
  const arpyCache = {};

  // Load Redmine cache from localStorage and clean expired entries
  function loadRedmineCacheFromStorage() {
    try {
      const stored = unsafeWindow.localStorage.getItem('arpyEnhanceRedmineCache');
      if (stored) {
        const parsedCache = JSON.parse(stored);
        const now = Date.now();

        // Clean expired entries and load valid ones
        Object.entries(parsedCache).forEach(([issueNumber, entry]) => {
          if (entry.timestamp && (now - entry.timestamp) <= REDMINE_CACHE_TTL_MS) {
            redmineCache[issueNumber] = entry;
          }
        });
      }
    } catch (e) {
      console.error('Failed to load Redmine cache from localStorage:', e);
    }
  }

  // Save Redmine cache to localStorage
  function saveRedmineCacheToStorage() {
    try {
      unsafeWindow.localStorage.setItem('arpyEnhanceRedmineCache', JSON.stringify(redmineCache));
    } catch (e) {
      console.error('Failed to save Redmine cache to localStorage:', e);
    }
  }

  // Check if a Redmine cache entry is expired
  function isRedmineCacheExpired(issueNumber) {
    const cacheEntry = redmineCache[issueNumber];
    if (!cacheEntry || !cacheEntry.timestamp) {
      return true;
    }
    const now = Date.now();
    return (now - cacheEntry.timestamp) > REDMINE_CACHE_TTL_MS;
  }

  // Fetch Redmine issue data with cache management
  async function fetchRedmineIssue(issueNumber, forceReload = false) {
    if (!REDMINE_API_KEY || !issueNumber?.match(/^\d+$/)) {
      return null;
    }

    // Check if we should use cache (data is already resolved in cache)
    if (!forceReload && redmineCache[issueNumber] && !isRedmineCacheExpired(issueNumber)) {
      return redmineCache[issueNumber].data;
    }

    // Fetch fresh data
    const response = await fetch(`https://redmine.dbx.hu/issues/${issueNumber}.json`, {
      headers: {
        "Content-Type": "application/json",
        "X-Redmine-API-Key": REDMINE_API_KEY
      }
    });
    const data = await response.json();

    // Store in cache with timestamp
    redmineCache[issueNumber] = {
      data: data,
      timestamp: Date.now()
    };

    // Persist to localStorage
    saveRedmineCacheToStorage();

    return data;
  }

  // Force reload a specific Redmine ticket and update preview
  async function reloadRedmineTicket(issueNumber) {
    if (!issueNumber) {
      return;
    }

    // Force reload from API
    await fetchRedmineIssue(issueNumber, true);

    // Update the preview
    await updatePreview();
  }

  function addCss(cssString) {
    const head = document.getElementsByTagName('head')[0];
    const newCss = document.createElement('style');
    newCss.type = "text/css";
    newCss.innerHTML = cssString;
    head.appendChild(newCss);
  }
  addCss(`
    #content {
      margin-top: 5px;
      width: 100%;
      padding: 0;
    }
    #timelog-page {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      #favorites-container {
        flex: 1 1 100%;
        width: auto !important;
      }
      #time_entry_container {
        flex: 1 1 45%;
        .description {
          display: flex;
        }
        #batch-textarea {
          flex: 1 1 auto;
        }
      }
      #preview-container {
        flex: 1 1 45%;
        position: relative;
        h3 {
          padding: 0 10px;
          position: sticky;
          top: 0;
          background: rgb(213,210,210);
          z-index: 1;
          margin-bottom: 0;
          font-variant: small-caps;
          &:first-child {
            margin-top: 0;
          }
        }
        th {
          white-space: nowrap;
        }
        td, th {
          background-color: #ddd;
          a {
            font-weight: bold;
          }
        }
        .sum-row {
          border-top: 10px solid #f5f5f5;
          td, th {
            background-color: #555;
            color: white;
          }
        }
        .is-automatic-label td:first-child {
          position: relative;
          background: rgba(255,77,77,0.49) !important;
          &:before {
            content: "💎";
            filter: hue-rotate(130deg);
            display: inline-block;
            position: absolute;
            left: -1px;
            top: 4px;
            font-size: 13px;
          }
        }
        tr td:first-child,
        th {
          max-width: 100px;
          overflow: hidden;
        }
        td,
        th {
          font-size: 15px;
          font-family: monospace;
          text-align: left;
          padding: 4px;
        }
        .redmine-reload-btn {
          margin-left: 4px;
          padding: 0px 4px;
          font-size: 11px;
          line-height: 1.2;
          border: 1px solid #999;
          background: #f5f5f5;
          border-radius: 3px;
          cursor: pointer;
          vertical-align: middle;
          &:hover {
            background: #e0e0e0;
            border-color: #666;
          }
          &:active {
            background: #d0d0d0;
          }
          &.loading {
            opacity: 0.6;
            cursor: wait;
          }
        }
        td:nth-child(3) {
          white-space: nowrap;
        }
        td:first-child {
          padding-left: 15px;
          white-space: nowrap;
        }
        table {
          margin-left: -10px;
          margin-bottom: 10px;
        }
      }
    }
    #batch-textarea {
      border: 1px solid #ccc;
      border-radius: 3px;
      width: 892px;
      font-family: "monospace";
      transition: height 0.5s;
    }
    #status {
      display: inline-block;
      width: 500px;
      text-align: right;
      font-size: 16px;
      overflow: hidden;
      height: 32px;
      line-height: 32px;
      vertical-align: middle;
      margin-right: 20px;
    }
    #status.error {
      color: darkred;
      text-transform: uppercase;
    }
    #time_entry_hours, #time_entry_submit, #time_entry_date, #time_entry_description, #time_entry_issue_number {
      display: none;
    }
    #add-fav-button {
      vertical-align: middle;
      margin-bottom: 10px;
      margin-left: 10px;
    }
    .i {
      font-size: 16px;
    }

    .enhanced-container {
      margin: 0px auto 20px auto;
      padding: 20px 0px 2px 55px;
      background-color: #efefef;
      border: 1px solid #DDD;
      border-radius: 5px;
    }
    #arpy-enhance-container {
      width: 100%;
      display: flex;
    }
    #time_entry_container,
    #favorites-container,
    #preview-container
    {
      flex: 0 1 auto;
      padding: 10px;
      margin: 10px;
      border-radius: 5px;
    }
    #preview-container {
      padding-left: 20px;
    }
    #preview-container, #time_entry_container {
      height: calc(80vh - 130px);
      overflow: auto;
    }
    #time_entry_container .lastrow {
      width: initial !important;
      margin-top: 10px;
    }
    #favorites-container {
      max-height: 20vh;
      display: flex;
      flex-direction: column;
      position: relative;
      &.maximalized {
        max-height: none !important;
      }
    }
    #favorites-list li input {
      width: 80px;
    }
    #favorites-list {
      margin: 0;
      margin-bottom: -10px;
      list-style: none;
      flex-grow: 1;
      overflow-y: auto;
      min-height: 0;
      li {
        padding: 2px;
        display: flex;
        align-items: center;
        column-gap: 4px;
        .label {
          padding-top: 3px;
          background: #00CC9F;
          text-shadow: 1px 1px 1px rgba(0,0,0,0.8);
        }
      }
    }
    #favorites-list li .label + .label {
      background: #00ACB3;
    }
    #favorites-list li .label + .label + .label{
      background: #0088B2;
    }
    #favorites-list li .label + .label + .label + .label{
      background: #046399;
    }
    #favorites-list li input{
      padding: 0 5px !important;
      border: 1px solid transparent;
      background: transparent;
      margin-right: 4px;
    }
    #favorites-list li input:hover, #favorites-list li input:focus {
      border: 1px solid #777;
      background: white;
    }
    #favorites-list .btn {
      color: #666;
      padding: 1px 5px;
      vertical-align: top;
      margin-right: 5px;
    }

    #favorites-list li .label-important {
      margin-right: 5px;
      background-color: #B94A48;
      cursor: help;
    }

    #open-help-dialog {
      margin-right: 10px;
    }
    #helpModal {
      top: 10%;
      margin-left: -500px;
      margin-top: 0;
      width: 1000px;
    }
    #helpModal .modal-body {
      max-height: 80vh;
    }
    #helpModal .modal-body pre {
      font-size: 14px;
    }

    .preview-visualisation-block {
      margin: 2px;
      background-color: #aaa;
      border-radius: 4px;
      height: 20px;
      display: flex;
      align-content: center;
      align-items: center;

      span {
        padding-left: 4px;
        font-size: 10px;
        color: black;
        font-weight: normal;
      }
    }
    .preview-visualisation {
      display: flex;
    }
    .preview-visualisation-th {
      position: relative;
    }
    .preview-visualisation-th:before {
      content: " ";
      position: absolute;
      top: 6px;
      left: 0px;
      border-right: 4px solid black;
      height: 20px;
      display: block;
      pointer-events: none;
      width: 432px;
    }
    #time_entry_container {
      display: flex;
      flex-direction: column;
      form {
        margin-bottom: 0;
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;
        .description {
          flex: 1 1 100%;
        }
        & > br {
          display: none;
        }
      }
    }
    #time_entry_container > form,
    #time_entry_container .description {
      min-height: 0;
    }
    .quick-filter-container {
      position: absolute;
      right: 35px;
      top: 10px;
      width: auto;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 10px;
      padding: 5px 7px;
      background: #ddd;
      border-radius: 7px;
      z-index: 2;
      input {
        padding-left: 5px;
        border-radius: 5px;
        border: 1px solid #aaa;
      }
    }
    #fav-sort-controls .btn.active {
      background-color: #0088CC;
      color: white;
      text-shadow: none;
      &:after {
        content: " ▼";
      }
    }
    ul.preview-tabs {
      margin-left: -20px;
      margin-right: -10px;
      li:first-child {
        margin-left: 20px;
      }
      li {
        cursor: pointer;
      }
    }
    .statistics {
      display: flex;
      justify-content: space-around;
      font-family: monospace;
      font-weight: bold;
    }
    .okay {
      th {
        background: rgb(32,131,79) !important;
        color: rgb(224,255,239) !important;
        &:first-child:before {
          content: "";
        }
      }
      .preview-visualisation-block {
        background: rgb(135,195,165) !important;
      }
      td {
        background: rgb(171,221,196) !important;
      }
    }
    #minimal-vertical-resizer {
      position: absolute;
      bottom: -14px;
      left: 0;
      width: 100%;
      height: 4px;
      background-color: transparent;
      border-top: 1px solid transparent;
      border-bottom: 1px solid transparent;
      cursor: ns-resize;
      z-index: 99;
      transition: background-color 0.2s ease;
      display: flex;
      justify-content: center;
      justify-items: center;
      align-items: center;
      &:before {
        content: "";
        width: 20%;
        height: 0;
        border-top: 4px solid #aaa;
      }
      &:hover:before {
        border-top: 4px solid #444;
      }
    }
    #favorites-container.maximalized #minimal-vertical-resizer {
      display: none;
    }
    #favorites-container.maximalized + #time_entry_container {
      height: 85vh !important;
    }
    #favorites-container.maximalized ~ #preview-container {
      height: 85vh !important;
    }

    .suggest-widget .monaco-list .monaco-list-row {
      width: max-content !important;
      min-width: 100% !important;
    }
    #timelog-page {
      position: relative;
      #favorites-container {
        order: 1;
      }
      #time_entry_container {
        order: 2;
      }
      #preview-container {
        order: 3;
      }
      #month_selector {
        order: 4;
      }
      #time_log {
        order: 5;
      }
    }
    #time_entry_container,
    #preview-container {
      position: relative;
    }
    .panel-swap-button {
      position: absolute;
      top: 10px;
      right: 10px;
      padding: 2px 4px;
      cursor: pointer;
      font-size: 16px;
      line-height: 1;
      transition: background-color 0.2s;
      z-index: 5;
      &:hover {
        background: #ccc;
      }
    }
    #timelog-page.panels-swapped {
      #time_entry_container {
        order: 3;
      }
      #preview-container {
        order: 2;
      }
    }
  `);

  function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      const msg = successful ? 'successful' : 'unsuccessful';
      console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
  }
  function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
      fallbackCopyTextToClipboard(text);
      return;
    }
    navigator.clipboard.writeText(text).then(function() {
      console.log('Async: Copying to clipboard was successful!');
    }, function(err) {
      console.error('Async: Could not copy text: ', err);
    });
  }

  function status(description, level) {
    const statusElement = document.getElementById('status');
    statusElement.innerHTML = description;
    $('#status').attr('class', level);
  }

  const asyncStatus = {
    start: {},
    end: {},
  };

  function updateAsyncProgress(type, status) {
    asyncStatus[status][type] = (asyncStatus[status][type] || 0) + 1;
    const previewContainer = document.getElementById("preview-container");
    previewContainer.innerHTML = Object.entries(asyncStatus.start).map(([type, count]) => `<div>${type}: ${asyncStatus.end[type] || 0}/${count}</div>`).join("\n");
  }

  function fetchAndCache(url, cacheKey) {
    let promise = arpyCache[cacheKey];
    if (!promise) {
      promise = fetch(url).then((response) => {
        if (!response.ok) {
          // If the server returns an error (e.g., 404), treat it as an empty list
          console.warn(`Failed to fetch ${url}, status: ${response.status}`);
          return [];
        }
        return response.json();
      }).catch((error) => {
        console.error(`Error fetching ${url}:`, error);
        delete arpyCache[cacheKey]; // Remove failed requests from cache
        return []; // Return an empty array on failure
      });
      arpyCache[cacheKey] = promise;
    }
    return promise;
  }

  function addNewFavorite() {
    const formData = $('form[action="/timelog"]').serializeArray();
    const fav = {
      label: '',
      id: `${new Date().getTime()}${(Math.round(Math.random() * 1000))}`
    };
    let saveable = true;
    ["project_id", "todo_list_id", "todo_item_id"].forEach(
      (propName) => {
        const formDataItem = formData.find((item) => item.name === propName);
        if (formDataItem) {
          fav[propName] = {
            label: $(`form[action="/timelog"] [value="${formDataItem.value}"]`).html(),
            value: formDataItem.value
          };
        }
      }
    );
    if (!saveable) {
      return status("Nincs meghatározva a projekt/kategória!", "error");
    }
    favorites.push(fav);
    saveFavorites();
    displayFavoriteElement(fav);
  }

  function getFullLabelPartsForFav(fav) {
    const projectDropdown = document.getElementById('project_id');
    const projectOption = projectDropdown.querySelector(`option[value="${fav.project_id.value}"]`);
    const categoryLabel = projectOption ? projectOption.parentElement.getAttribute('label') : '?';
    return [
      categoryLabel,
      fav.project_id?.label,
      fav.todo_list_id?.label || '-',
      fav.todo_item_id?.label || '-'
    ];
  }

  function findTodoDataByFullLabelString(_fullLabelString) {
    // first try find it among favorites
    function removeDays(str) {
      return str.replace(/\W?\(\d+(,\d+)? nap\)\W?/,"").replace(/\W?\(\d+(\.\d+)?d\)\W?/,"").replace(/  +/g, ' ');
    }
    const fullLabelString = removeDays(_fullLabelString);
    const favorite = favorites.find((fav) => {
      const fullLabelForFav = removeDays(getFullLabelPartsForFav(fav).join(" / ")).trim();
      // console.log("fullLabel of fav", fav.label, fullLabelForFav);
      // console.log("fullLabel of input", fullLabelString);
      // console.log("Egyezés?", fullLabelString === fullLabelForFav)
      return fullLabelString === fullLabelForFav
    });
    return favorite;
  }

  function saveFavorites() {
    unsafeWindow.localStorage.favorites = JSON.stringify(favorites);
  }

  function updateFav(id, label) {
    const fav = favorites.find((f) => f.id === id);
    fav.label = label ? label : "";
    saveFavorites();
  }

  async function checkFavoritesValidity() {
    console.log("Starting full validation of favorites...");
    const projectOptions = new Map(
      Array.from(document.querySelectorAll('#project_id option')).map((opt) => [opt.value, opt])
    );

    const validationPromises = favorites.map(async (fav) => {
      // Assume the favorite is valid until a check fails
      fav.isInvalid = false;

      // 1. Check if the Project exists in the main dropdown.
      if (!fav.project_id?.value || !projectOptions.has(fav.project_id.value)) {
        fav.isInvalid = true;
        return; // Stop checking if the project is gone
      }

      // A favorite with only a project is valid at this point.
      // If there's no todo_list_id, we're done with this favorite.
      if (!fav.todo_list_id?.value) {
        return;
      }

      // 2. Fetch and check if the Todo List exists for that project.
      const todoLists = await fetchAndCache(
        `/get_todo_lists?project_id=${fav.project_id.value}&show_completed=false`,
        `projectId-${fav.project_id.value}`
      );

      // Note: Using '==' for loose comparison as IDs can be string/number
      const todoListExists = todoLists.some((list) => list.id == fav.todo_list_id.value);
      if (!todoListExists) {
        fav.isInvalid = true;
        return; // Stop checking if the list is gone
      }

      // A favorite with a project + list is valid at this point.
      // If there's no todo_item_id, we're done.
      if (!fav.todo_item_id?.value) {
        return;
      }

      // 3. Fetch and check if the Todo Item exists for that list.
      const todoItems = await fetchAndCache(
        `/get_todo_items?todo_list_id=${fav.todo_list_id.value}&show_completed=false`,
        `todoListId-${fav.todo_list_id.value}`
      );

      const todoItemExists = todoItems.some(item => item.id == fav.todo_item_id.value);
      if (!todoItemExists) {
        fav.isInvalid = true;
      }
    });

    // Wait for all the asynchronous validation checks to complete.
    await Promise.all(validationPromises);
    console.log("Favorite validation complete.");
  }

  function remove(array, element) {
    return array.filter(e => e !== element);
  }

  function displayFavoriteElement(fav) {
    const labelParts = getFullLabelPartsForFav(fav);
    const newLi = $(`
      <li>
        ${labelParts.map((part) => `<span class="label label-info">${part}</span>`).join("\n")}
      </li>
    `);
    if (fav.isInvalid) {
      newLi.prepend('<span class="label label-important" title="Ez a kategória már nem létezik vagy lezárásra került.">LEZÁRT</span> ');
    }
    const labelInput = $('<input placeholder="- címke helye -">');
    labelInput.val(fav.label);
    labelInput.change(function() {
      updateFav(fav.id, this.value);
    });
    newLi.prepend(labelInput);

    const copyButton = $('<button title="Másolás vágólapra" class="btn btn-mini" type="button">📋</button>');
    copyButton.button().on("click", () => copyTextToClipboard(labelParts.join(" / ")));
    const removeButton = $('<button title="Törlés" class="btn btn-mini delete" type="button">&#10006;</button>');
    removeButton.button().on("click", function() {
      if (window.confirm(`Biztosan törölni akarod ezt az elemet?\n${labelParts.join(" / ")}`)) {
        removeFav(fav.id);
      }
    });

    newLi.append(copyButton);
    newLi.append(removeButton);
    $('#favorites-list').append(newLi);
  }

  function setupFavoriteSorting() {
    const sortControls = document.getElementById('fav-sort-controls');
    sortControls.addEventListener('click', (e) => {
      const button = e.target.closest('button');
      if (!button) {
        return;
      }

      const newSortOrder = button.dataset.sort;
      if (newSortOrder !== favoriteSortOrder) {
        favoriteSortOrder = newSortOrder;
        localStorage.setItem('arpyEnhanceFavoriteSortOrder', newSortOrder);
        renderFavs();
        applyQuickFilter();
      }
    });
  }

  function renderFavs() {
    $('#favorites-list').empty();

    const favoritesToRender = [...favorites]; // Create a copy to avoid modifying the original add-order

    if (favoriteSortOrder === 'label') {
      favoritesToRender.sort((a, b) => (a.label || '').localeCompare(b.label || '', 'hu'));
    } else if (favoriteSortOrder === 'category') {
      favoritesToRender.sort((a, b) => {
        const fullLabelA = getFullLabelPartsForFav(a).join(' / ');
        const fullLabelB = getFullLabelPartsForFav(b).join(' / ');
        return fullLabelA.localeCompare(fullLabelB, 'hu');
      });
    }
    // 'default' order requires no sorting, as we're using the original array's order.

    favoritesToRender.forEach(displayFavoriteElement);

    // Update the active state on the sort buttons
    $('#fav-sort-controls .btn').removeClass('active');
    $(`#fav-sort-controls .btn[data-sort="${favoriteSortOrder}"]`).addClass('active');
  }

  function removeFav(id) {
    const fav = favorites.find((f) => f.id === id);
    favorites = remove(favorites, fav);
    saveFavorites();
    renderFavs();
    applyQuickFilter();
  }

  function updateClearButtonVisibility() {
    const invalidCount = favorites.filter((fav) => fav.isInvalid).length;
    const clearButton = $('#clear-invalid-favs-button');
    if (invalidCount > 0) {
      clearButton.text(`✖ [${invalidCount}]`).show();
    } else {
      clearButton.hide();
    }
  }

  // This function sets up the click event for the new button.
  function setupClearInvalidButton() {
    $('#clear-invalid-favs-button').on('click', () => {
      const invalidFavs = favorites.filter((fav) => fav.isInvalid);
      if (invalidFavs.length === 0) {
        return; // Safety check
      }

      if (window.confirm(`Biztosan törölni akarod a(z) ${invalidFavs.length} lejárt kedvencet?`)) {
        // Keep only the valid favorites
        favorites = favorites.filter((fav) => !fav.isInvalid);
        saveFavorites();
        renderFavs();
        updateClearButtonVisibility(); // Re-check visibility, which will hide the button
        applyQuickFilter();
      }
    });
  }

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
  }

  function initializeMonacoEditor() {
    const monacoCss = GM_getResourceText('MONACO_CSS');
    GM_addStyle(monacoCss);

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
        editorContainer.style.flex = '1 1 auto';
        editorContainer.style.border = '1px solid #ccc';

        originalTextarea.parentElement.insertBefore(editorContainer, originalTextarea);
        originalTextarea.style.display = 'none';

        // 1. Define everything first. Our theme is now robust.
        setupArpyLanguageAndTheme();

        // 2. Create the editor directly with the final theme.
        const editor = monaco.editor.create(editorContainer, {
          value: originalTextarea.value,
          language: 'arpy-log',
          theme: 'arpy-light-vibrant',
          automaticLayout: true,
          wordWrap: 'on',
          fontSize: 14,
          fontFamily: 'monospace',
          wordBasedSuggestions: false,
          tabSize: 2,
          insertSpaces: true,
        });

        // 3. Assign instance and attach the update listener.
        monacoEditorInstance = editor;

      let lastDimensions = { width: 0, height: 0 };
      const editorParent = document.querySelector('#time_entry_container .description');
      const editorObserver = new ResizeObserver((entries) => {
        const { width, height } = entries[0].contentRect;
        if (width !== lastDimensions.width || height !== lastDimensions.height) {
          lastDimensions = { width, height };
          if (monacoEditorInstance) {
            monacoEditorInstance.layout({ width, height });
          }
        }
      });

      editorObserver.observe(editorParent);

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

          // NEW LOGIC: Only trigger if the text on the line BEFORE the current word is whitespace.
          if (textBeforeWord.trim() !== '') {
            return { suggestions: [] };
          }

          const suggestions = favorites
            // Filter out favorites that don't have a label.
            .filter((fav) => fav.label && fav.label.trim() !== '')
            // Filter suggestions to match what the user has started typing.
            .filter((fav) => fav.label.toLowerCase().includes(wordInfo.word.toLowerCase()))
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
                // detail: getFullLabelPartsForFav(fav).join(' / '),
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
          unsafeWindow.inputTimeout = setTimeout(() => updatePreview(), 500);
        });

        // Trigger initial preview if there's content
        if (originalTextarea.value) {
          updatePreview();
        }
      });
    };

    loaderScript.onerror = () => {
      console.error("ArpyEnhance: Failed to load Monaco Editor's loader.js.");
    };
  }

  function setupMinimalResizing() {
    const topPanel = document.getElementById('favorites-container');
    const bottomPanel1 = document.getElementById('time_entry_container');
    const bottomPanel2 = document.getElementById('preview-container');

    if (!topPanel || !bottomPanel1 || !bottomPanel2) {
      return;
    }

    const resizer = document.createElement('div');
    resizer.id = 'minimal-vertical-resizer';
    topPanel.appendChild(resizer);

    const STORAGE_KEY = 'arpyEnhanceTopPanelVh';
    const ORIGINAL_BOTTOM_OFFSET_PX = 130; // The original offset from CSS
    const DEFAULT_TOP_VH = 20;

    const applyVhHeights = (topVh) => {
      if (typeof topVh !== 'number' || isNaN(topVh)) {
        return;
      }

      const constrainedTopVh = Math.max(2, Math.min(topVh, 90));
      const bottomVh = 100 - constrainedTopVh;

      topPanel.style.maxHeight = `${constrainedTopVh}vh`;
      const bottomHeightCss = `calc(${bottomVh}vh - ${ORIGINAL_BOTTOM_OFFSET_PX}px)`;
      bottomPanel1.style.height = bottomHeightCss;
      bottomPanel2.style.height = bottomHeightCss;
    };

    const savedVh = unsafeWindow.localStorage.getItem(STORAGE_KEY);
    applyVhHeights(savedVh ? parseFloat(savedVh) : DEFAULT_TOP_VH);

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

      const handleMouseMove = (moveEvent) => {
        const deltaY_px = moveEvent.clientY - startY_px;
        // The new height is the starting content height plus the mouse delta.
        const newTopContentHeight_px = startTopContentHeight_px + deltaY_px;
        // Convert the content height to vh.
        const newTop_vh = (newTopContentHeight_px / viewportHeight_px) * 100;

        applyVhHeights(newTop_vh);
      };

      const handleMouseUp = () => {
        // On release, do the same conversion before saving.
        const finalContentHeight_px = topPanel.offsetHeight - nonContentHeight;
        const final_vh = (finalContentHeight_px / window.innerHeight) * 100;
        localStorage.setItem(STORAGE_KEY, final_vh.toFixed(2));

        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    });
  }

  try { favorites = JSON.parse(window.localStorage.favorites); } catch(e) { }

  // Load Redmine cache from localStorage
  loadRedmineCacheFromStorage();

  const placeholderText = `-- Formátum help --
Gyors példa:

10-01 1.0 taszk leírás 1
demo
  10-02 1.5 taszk leírás 2
  10-03 2.5 taszk leírás 3
# ez egy komment sor
insnet
  10-04 8.0 taszk leírás 4

A munkaidő bejegyzéseket soronként kell megadni. Az inputot tetszés szerint lehet tagolni üres sorokkal, a sorokat pedig bármennyi szóközzel beljebb lehet igazítani, a feldolgozó ezeket figyelmen kívül hagyja. #-vel kezdődő sor kommentnek számít. Csak a soreleji # számít kommentnek.
Munkaidő bejegyzést tartalmazó sor formátuma a következő:

12-26 4.0 Ez itt a leírás szövege
- vagy -
2016-12-26 3.0 Ez itt a leírás szövege

A sorokat az első két előforduló szóköz osztja 3 részre (a soreleji behúzás nem számít).

1. Dátum/idő.
YYYY-MM-DD vagy MM-DD, az év tehát opcionális. Ha nincs megadva, akkor automatikusan az aktuális év lesz érvényes a sorra.

2. Munkaórák száma.
Ez lehet egész szám vagy tizedes tört ponttal jelölve.

3. Leírás szövege.
Ez a sor teljes hátralévő része, a közben előforduló szóközökkel együtt.
A leírás első szava opcionálisan lehet Redmine/Youtrack issue azonosító. Ezt a feldolgozó automatikusan felismeri. Az előnézet szekcióban a sikeres felismerést az jelzi, hogy meg is jelenik egy link az issue-hoz. Az issue azonosítót a backend felé a külön erre szolgáló mezőben küldjük be, tehát ez explicit külön lesz letárolva, és az elmentett munkaidő bejegyzéseknél is látszódni fog. Abban az esetben ha a leírás rész csak egy szó, és ez pont issue azonosító is egyben, akkor ezt issue azonosítóként és leírásként is beküldjük.

Dátumcímkék használata

A dátumokat meg lehet adni címkeként is.
Ha munkaidő bejegyzést tartalmazó sorban szimplán csak egy kötőjelet adunk meg dátum helyett, akkor a legutóbbi dátum címke értéke lesz érvényes rá.
Egy sorban a sor elején explicit módon megadott dátum nem íródik felül címke értékkel.
Ha kötőjeles dátumos sor előtt nem szerepelt még dátumcímke, akkor a mai nap lesz megadva dátumként.

példa:
# ez a mai napon volt
- 2.4 nahát
10-12
- 2.4 ötös taszk
- 1.4 hatos taszk
10-11 3.2 előtte való napon történt
- 2.0 még egy taszk 10-12-re

Kategóriák:
Alapesetben minden sorra a fenti legördülő mezőkben aktuálisan kiválasztott értékek lesznek érvényesek.
A gyakrabban használt kategóriákat el lehet menteni a kedvencek közé a ★Fav gombbal.
A hozzáadás után a kedvenceket címkével kell ellátni, mert ezekkel tudunk hivatkozni rájuk.

A fenti legelső példában a taszk 1 a lenyílókban aktuálisan kiválasztott kategóriákat fogja megkapni, a taszk 2 és taszk 3 a demo címkével ellátott kedvenc kategóriáit, a taszk 4 pedig az insnet kategóriáit.

A címkék hatása alapértelmezetten a következő ugyanolyan típusú (kategória vagy dátum) címkéig érvényes.
Ha egy kategória címke neve elejére vagy a végére / vagy \ karaktert rakunk, akkor csak a közvetlenül utána következő sorra lesz érvényes.

Nincs megkötés, hogy először dátum aztán kategória címkét kell használni, vagy fordítva. Tehát mondhatjuk akár azt is, hogy először napokra csoportosítva és azon belül pedig kategóriánként bontva visszük fel az adatokat, de akár azt is, hogy először projektek szerint csoportosítunk, és ezen belül adjuk meg a napokat:

10-11
insnet
  - 2.4 nahát
  - 2.0 ööö...
ciggar
  - 2.8 dejó

10-12
insnet
  - 1.0 na még
ciggar
  - 1.8 na még ez is


-VAGY-

insnet
10-11
  - 2.4 nahát
  - 2.0 ööö...
10-12
  - 1.0 na még

ciggar
10-11
  - 2.8 dejó
10-12
  - 1.8 na még ez is

`.replace(/\n/g, "\n");

  $("#time_entry_submit").before(`
    <span id="status"></span>&nbsp;
    <div id="enhance-progress" class="progress progress-striped active" style="display: none;">
      <div id="enhance-progress-bar" class="bar"></div>
    </div>
  `);
  $("#time_entry_submit").before(
    `<button class="btn ${debug ? "btn-danger" : "btn-primary"} btn-large" type="button" id="submit-batch-button">Mentés!</button>&nbsp;`
  );
  $("#time_entry_description").after(
    `<textarea id="batch-textarea" placeholder="${placeholderText}" class="textarea ui-widget-content ui-corner-all" spellcheck="false"></textarea>`
  );
  //$("#time_entry_container").wrap(`<div id="arpy-enhance-container"></div>`);
  $("#time_entry_container").after(`<div id="preview-container" class="well"></div>`);
  $("#time_entry_container").prepend(`<button type="button" class="btn btn-mini panel-swap-button" title="Panelek cseréje">⬌</button>`);
  $("#preview-container").prepend(`<button type="button" class="btn btn-mini panel-swap-button" title="Panelek cseréje">⬌</button>`);
  $("#time_entry_container").before(`<div id="favorites-container" class="well">
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
      <input class="quick-filter-input" placeholder="Gyorsszűrés">
      <button id="maximize-button" type="button" class="btn btn-mini" data-sort="label" style="font-size: 18px;" title="Teljes magasság">
        ⬍
      </button>
    </div>
    <ul id="favorites-list"></ul>
  </div>`);

  // Apply quick filter to favorites list
  function applyQuickFilter() {
    const filterInput = document.querySelector('.quick-filter-input');
    if (!filterInput) return;

    const term = filterInput.value?.toLowerCase();
    document.querySelectorAll("#favorites-list li").forEach((li) => {
      if (!term || li.textContent.toLowerCase().includes(term) || li.querySelector('input')?.value?.toLowerCase().includes(term)) {
        li.style.display = '';
      } else {
        li.style.display = 'none';
      }
    });
  }

  document.querySelector('.quick-filter-input').addEventListener('input', applyQuickFilter);

  const maximizeButton = document.querySelector('#maximize-button');

  function setupMaximalizeState() {
    if (unsafeWindow.localStorage.getItem('arpyEnhanceFavsMaxed') === 'true') {
      const favoritesPanel = document.querySelector("#favorites-container");
      favoritesPanel.classList.add('maximalized');
      maximizeButton.innerHTML = "◱";
    }
  }

  function setupPanelSwapState() {
    if (unsafeWindow.localStorage.getItem('arpyEnhancePanelsSwapped') === 'true') {
      const timelogPage = document.querySelector("#timelog-page");
      timelogPage.classList.add('panels-swapped');
    }
  }

  maximizeButton.addEventListener('click', function() {
    const favoritesPanel = document.querySelector("#favorites-container");
    favoritesPanel.classList.toggle('maximalized');
    if (favoritesPanel.classList.contains('maximalized')) {
      localStorage.setItem('arpyEnhanceFavsMaxed', 'true');
      maximizeButton.innerHTML = "◱";
    } else {
      localStorage.removeItem('arpyEnhanceFavsMaxed');
      maximizeButton.innerHTML = "⬍";
    }
  });

  const panelSwapButtons = document.querySelectorAll('.panel-swap-button');
  panelSwapButtons.forEach(button => {
    button.addEventListener('click', function() {
      const timelogPage = document.querySelector("#timelog-page");
      timelogPage.classList.toggle('panels-swapped');
      if (timelogPage.classList.contains('panels-swapped')) {
        localStorage.setItem('arpyEnhancePanelsSwapped', 'true');
      } else {
        localStorage.removeItem('arpyEnhancePanelsSwapped');
      }
    });
  });

  setupMaximalizeState();
  setupPanelSwapState();

  setupMinimalResizing();

  setupFavoriteSorting();

  $("#todo_item_id").after(
    '<button class="btn btn-primary btn-sm" type="button" id="add-fav-button"><span class="i">★</span> Fav</button>'
  );
  $("#add-fav-button").button().on( "click", addNewFavorite);

  checkFavoritesValidity().then(() => {
    renderFavs();
    updateClearButtonVisibility();
  });
  setupClearInvalidButton();

  // add help text popup and button
  $("#submit-batch-button").before(
    '<button class="btn btn-sm" type="button" id="open-help-dialog" title="Formátum help"><span class="i">❓</span></button>'
  );
  $("#open-help-dialog").button().on( "click", () => {
    $('#helpModal').modal();
  });


  $("body").append(`
    <div class="modal" id="helpModal" tabindex="-1" role="dialog" aria-labelledby="helpModalLabel" aria-hidden="true" style="display: none;">
    <div class="modal-header">
      <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
      <h3 id="myModalLabel">Formátum help</h3>
    </div>
    <div class="modal-body">
      <pre>
        ${placeholderText}
      </pre>
    </div>
    </div>
  `);



  $("#batch-textarea").on('focus', function(){
    $(this).addClass('active');
  });

  if (window.localStorage.batchTextareaSavedValue) {
    document.getElementById('batch-textarea').value = window.localStorage.batchTextareaSavedValue;
    updatePreview();
  }

  async function parseBatchData(textareaValue, options = { }) {
    // const textareaValue = $('#batch-textarea').val();

    if(!textareaValue || !(textareaValue.trim())) {
      return { errors: ["no data"] };
    }
    const genericFormDataSerialized = $('form[action="/timelog"]').serializeArray();
    const projectData = {};
    const genericFormData = {};
    genericFormDataSerialized.forEach(function(formItem) {
      if (["project_id", "todo_list_id", "todo_item_id"].includes(formItem.name)) {
        projectData[formItem.name] = formItem.value;
      } else {
        genericFormData[formItem.name] = formItem.value;
      }
    });

    let currentDate = moment();
    let currentProjectData = [];
    let shouldPopProjectData = false;
    if (Object.keys(projectData).length === 3) {
      currentProjectData.push(projectData);
    }
    const errors = [];

    const summarizedData = {
      labels: {},
      dates: {}
    }
    const parsedBatchData = (await Promise.all(textareaValue.match(/[^\r\n]+/g).map(async function(line, lineNumber) {
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine[0] === '#') {
        return;
      }
      const lineParts = trimmedLine.replace(/\s\s+/g, ' ').split(' ');

      if (lineParts.length === 1) {
        const maybeDate = moment(lineParts[0], ['YYYY-MM-DD', 'MM-DD'], true);
        if (maybeDate.isValid()) {
          currentDate = maybeDate;
        } else {
          let labelFromLine = lineParts[0];

          const matches = labelFromLine.match(/^(\/|\\)?(.*?)(\/|\\)?$/);
          const hasSlash = matches[1] || matches[3];
          if (hasSlash) {
            shouldPopProjectData = true;
            labelFromLine = matches[2];
          }
          const fav = favorites.find((f) => f.label === labelFromLine);
          if (fav) {
            if (fav.isInvalid) {
              errors.push(`${lineNumber + 1}. sor: A(z) "<b>${fav.label}</b>" címke egy lezárt/nem létező kategóriára hivatkozik!`);
            }
            currentProjectData.push({
              label: fav.label,
              project_id: fav.project_id.value,
              todo_list_id: fav.todo_list_id.value,
              todo_item_id: fav.todo_item_id.value
            });
          }
        }
        return;
      }
      let localCurrentDate = currentDate;
      let localCurrentProjectData = shouldPopProjectData ? currentProjectData.pop() : currentProjectData[currentProjectData.length - 1];
      if (shouldPopProjectData) {
        shouldPopProjectData = false;
      }
      let currentLabel = (localCurrentProjectData && localCurrentProjectData.label) || "";
      console.log("initial current label", currentLabel);

      function parseDateStr(dateStr) {
        const momentizedDate = moment(dateStr, ['YYYY-MM-DD', 'MM-DD'], true);
        if (!momentizedDate.isValid()) {
          errors.push(`${lineNumber + 1}. sor: hibás dátumformátum!`);
          return null;
        }
        return momentizedDate;
      }

      // Assembling batchItem

      const dateStr = lineParts.shift();
      let parsedDate;
      if (dateStr === '-') {
        if (!localCurrentDate) {
          errors.push(`${lineNumber + 1}. sor: dátum címke hiányzik!`);
          return;
        }
        parsedDate = localCurrentDate;
      } else {
        parsedDate = parseDateStr(dateStr);
        if (!parsedDate) {
          return;
        }
      }
      const formattedDate = parsedDate.format('YYYY-MM-DD');

      const hours = lineParts.shift();
      let issueNumber;
      function getIssueNumber(i) {
        if (!issueNumber && /(^#\d+$)|(^[A-Z0-9]+-\d+$)/.test(lineParts[i])) {
          issueNumber = lineParts[i].match(/#?(.+)/)[1]; // szám kinyerése
          if (lineParts.length > 1 && i === 0) {
            lineParts.shift();
          }
        }
      }
      getIssueNumber(0);
      getIssueNumber(1);
      getIssueNumber(2);

      let externallyFetchedProjectData;
      let rmProjectName;
      if (REDMINE_API_KEY && issueNumber?.match(/^\d+$/)) {
        updateAsyncProgress("issue", "start");
        const json = await fetchRedmineIssue(issueNumber);
        updateAsyncProgress("issue", "end");

        const arpyField = json.issue.custom_fields?.find(({ name }) => name === "Arpy jelentés");
        rmProjectName = json.issue.project.name;
        if (arpyField?.value) {
          // kategória / todo megkeresése
          // először a fav-ok között keressük
          const arpyFieldValue = arpyField.value.trim();
          console.group("SEARCH FAV FOR", arpyField.value);
          console.log("SEARCH FAV FOR", arpyField.value);
          const fav = findTodoDataByFullLabelString(arpyFieldValue);
          console.groupEnd("SEARCH FAV FOR", arpyField.value);
          if (fav) {
            console.log("FOUND FAV FOR", arpyField.value, fav);
            currentLabel = fav.label;
            if (!fav.label) {
              console.log("no label for", arpyFieldValue);
            }
            externallyFetchedProjectData = {
              project_id: fav.project_id.value,
              todo_list_id: fav.todo_list_id.value,
              todo_item_id: fav.todo_item_id.value,
              arpyField: arpyField.value
            }
          } else {
            // aztán a lenyílók értékei között
            const arpyParts = arpyFieldValue.trim().split(" / ");
            console.log("arpyParts", arpyParts);
            let projectOption = Array.from(document.querySelectorAll(`#project_id optgroup[label="${arpyParts[0]}"] option`)).find(
              (option) => option.innerText === arpyParts[1]
            );
            if (!projectOption) {
              projectOption = Array.from(document.querySelectorAll(`#project_id optgroup option`)).find(
                (option) => option.innerText === arpyParts[0]
              );
            }
            if (projectOption) {
              const projectId = projectOption.value;
              updateAsyncProgress("todoList", "start");
              let todoListPromise = arpyCache[`projectId-${projectId}`];
              if (!todoListPromise) {
                todoListPromise = fetch(`/get_todo_lists?project_id=${projectId}&show_completed=false`).then((response) => response.json());
                arpyCache[`projectId-${projectId}`] = todoListPromise;
              }
              const todoListResponse = await todoListPromise;
              updateAsyncProgress("todoList", "end");

              const todoList = todoListResponse.find(({ name }) => name === arpyParts[2]);
              console.log("todoList", projectId, todoList);
              if (todoList) {
                let todoItemsPromise = arpyCache[`todoListId-${todoList.id}`];

                updateAsyncProgress("todoItems", "start");
                if (!todoItemsPromise) {
                  todoItemsPromise = fetch(`/get_todo_items?todo_list_id=${todoList.id}&show_completed=false`).then((response) => response.json());
                  arpyCache[`todoListId-${todoList.id}`] = todoItemsPromise;
                }
                const todoItems = await todoItemsPromise;
                updateAsyncProgress("todoItems", "end");
                console.log("todoItems", projectId, todoList.id, todoItems);
                const lastPart = arpyParts[4] ? `${arpyParts[3]} / ${arpyParts[4]}` : arpyParts[3];
                const todoItem = todoItems.find(
                  ({ content }) => content === lastPart
                );
                if (todoItem) {
                  currentLabel = arpyField.value;
                  externallyFetchedProjectData = {
                    label: arpyField.value,
                    project_id: projectId,
                    todo_list_id: todoList.id,
                    todo_item_id: todoItem.id,
                    arpyField: arpyField.value
                  }
                }
              }
            } else {
              console.log("not found for", arpyParts);
            }
          }
        }
      }

      if (!localCurrentProjectData && !externallyFetchedProjectData) {
        errors.push(`${lineNumber + 1}. sor: Kategória információ hiányzik`);
        return;
      }

      const description = lineParts.join(' ').replace(/^- /,''); // ha az issue szám után kötőjel volt " - ", akkor ez kiszedi
      const outputDataObject = Object.assign({},
        genericFormData,
        {
          project_id: externallyFetchedProjectData?.project_id || localCurrentProjectData?.project_id,
          todo_list_id: externallyFetchedProjectData?.todo_list_id || localCurrentProjectData?.todo_list_id,
          todo_item_id: externallyFetchedProjectData?.todo_item_id || localCurrentProjectData?.todo_item_id,
          'time_entry[date]': formattedDate,
          'time_entry[hours]': hours,
          'time_entry[description]': description
        }
      );

      if (issueNumber) {
        outputDataObject["time_entry[issue_number]"] = issueNumber;
      }


      if (!options.nometa) {
        outputDataObject.label = currentLabel;
        outputDataObject.isAutomaticLabel = !!externallyFetchedProjectData;
        outputDataObject.arpyField = externallyFetchedProjectData?.arpyField;
        outputDataObject.rmProjectName = rmProjectName;
      }

      const parsedHours = Number.parseFloat(hours);

      // append summarized data by date

      let byDate = summarizedData.dates[formattedDate];
      if (!byDate) {
        byDate = {
          sum: 0,
          entries: []
        };
        summarizedData.dates[formattedDate] = byDate;
      }
      byDate.sum += parsedHours;
      byDate.entries.push(outputDataObject);

      // append summarized data by label

      let byLabel = summarizedData.labels[currentLabel];
      if (!byLabel) {
        byLabel = {
          sum: 0,
          entries: []
        };
        summarizedData.labels[currentLabel] = byLabel;
      }
      byLabel.sum += parsedHours;
      byLabel.entries.push(outputDataObject);

      return outputDataObject;
    }))).filter((item) => !!item);

    console.log("READY");

    if (errors.length) {
      return { errors };
    }

    // dátum alapján csoportosított adatok sorbarendezése
    summarizedData.dates = Object.entries(summarizedData.dates).sort((a, b) => {
      if (a[0] < b[0]) {
        return -1;
      }
      if (a[0] > b[0]) {
        return 1;
      }
      return 0;
    }).reduce((acc, cur) => (acc[cur[0]] = cur[1], acc), {});

    Object.entries(summarizedData.labels).forEach(([label, object]) => {
      summarizedData.labels[label].entries = object.entries.sort((a, b) => {
        const aDate = a["time_entry[date]"];
        const bDate = b["time_entry[date]"];
        if (aDate < bDate) {
          return -1;
        }
        if (aDate > bDate) {
          return 1;
        }
        return 0;
      });
    });

    return { data: parsedBatchData, summarizedData };
  }

  async function updatePreview() {
    const savedActiveTab = unsafeWindow.localStorage.getItem('arpyEnhanceActiveTab') || 'dates';
    const previewContainer = document.getElementById("preview-container");
    const prevScrollTop = previewContainer.scrollTop;
    const editorValue = monacoEditorInstance ? monacoEditorInstance.getValue() : document.getElementById('batch-textarea').value;
    const result = await parseBatchData(editorValue);
    previewContainer.innerHTML = "";
    const mainTitle = document.createElement("h4");
    mainTitle.innerHTML = "Előnézet";
    mainTitle.style = "font-variant: small-caps;";
    previewContainer.appendChild(mainTitle);
    if (result.errors) {
      const list = document.createElement("ul");
      previewContainer.appendChild(list);

      result.errors.forEach((error) => {
        const errorItem = document.createElement("li");
        errorItem.innerHTML = error;
        list.appendChild(errorItem);
      });
    }
    if (!result.summarizedData) {
      return;
    }
    const previewTabs = document.createElement('ul');
    previewTabs.classList.add('preview-tabs', 'nav', 'nav-tabs');
    previewContainer.appendChild(previewTabs);

    ["dates", "labels"].forEach((sumType, i) => {

      const previewTab = document.createElement('li');
      const previewTabA = document.createElement('a');
      previewTabA.src = "#";
      previewTab.appendChild(previewTabA);

      const previewTabContentContainer = document.createElement('div');
      if (sumType === savedActiveTab) {
        previewTab.classList.add('active');
      } else {
        previewTabContentContainer.style.display = 'none';
      }

      previewTabContentContainer.classList.add("preview-tab-content")
      const data = result.summarizedData[sumType];
      previewTabA.innerText = {
        dates: "Napi bontás",
        labels: "Projekt/kategória szerint"
      }[sumType];

      previewTab.addEventListener('click', () => {
         localStorage.setItem('arpyEnhanceActiveTab', sumType);
        document.querySelectorAll('.preview-tab-content').forEach(
          (element) => element.style.display = 'none'
        );
        Array.from(previewTabs.querySelectorAll('li')).forEach((tab) => {
          tab.classList.remove('active');
        });
        previewTab.classList.add('active');
        previewTabContentContainer.style.display = '';
      });
      previewTabs.appendChild(previewTab);

      const stats = document.createElement("div");
      stats.classList.add('statistics');
      previewTabContentContainer.appendChild(stats);
      const table = document.createElement("table");
      previewTabContentContainer.appendChild(table);
      previewContainer.appendChild(previewTabContentContainer);
      let dayHours = [];

      Object.entries(data).forEach(([key, value], i, dataEntries) => {
        // hiányzó napok berakása
        if (sumType === "dates" && dataEntries[i - 1]) {

          const date = moment(key, "YYYY-MM-DD");
          let prevDate = moment(dataEntries[i - 1][0], "YYYY-MM-DD").add(1, 'd');
          while (date.format("YYYY-MM-DD") !== prevDate.format("YYYY-MM-DD")) {
            const tr = document.createElement("tr");
            tr.classList.add("sum-row");
            const th = document.createElement("th");
            tr.appendChild(th);
            th.innerText = prevDate.format("YYYY-MM-DD");
            const d = prevDate.get('d');
            const th2 = document.createElement("th");
            th2.setAttribute("colspan", 2);
            th2.setAttribute("title", "Hiányzó bejegyzések");
            th2.innerText = prevDate.toDate().toLocaleDateString("hu", { weekday: 'long' });
            if (d !== 0 && d !== 6) {
              th2.style.color = "red";
              th.style.color = "red";
            }
            tr.appendChild(th2);
            table.appendChild(tr);
            prevDate.add(1, 'd');
          }
        }

        const sumRow = document.createElement("tr");
        sumRow.classList.add("sum-row");
        table.appendChild(sumRow);
        const catTh = document.createElement("th");
        catTh.innerHTML = key;
        if (value.entries[0].isAutomaticLabel) {
          catTh.classList.add("is-automatic-label");
        }
        catTh.setAttribute("title", value.entries[0].label)
        sumRow.appendChild(catTh);
        const sumTh = document.createElement("th");
        sumTh.innerHTML = value.sum;
        if (value.sum >= 8.0) {
          sumRow.classList.add("okay");
        }
        sumRow.appendChild(sumTh);
        if (sumType === "dates") {
          const visualisationTh = document.createElement("th");
          visualisationTh.setAttribute("colspan", 2);
          visualisationTh.classList.add("preview-visualisation-th");
          visualisationTh.innerHTML = `
          <div class="preview-visualisation">
            ${value.entries.map((row) => `
              <div
                class="preview-visualisation-block"
                title="${row["time_entry[hours]"]} ${row["time_entry[description]"]}"
                style="width: ${54 * parseFloat(row["time_entry[hours]"]) - 4}px"
              >
                <span>${row["time_entry[hours]"]}</span>
              </div>
            `).join('')}
          </div>
        `;
          sumRow.appendChild(visualisationTh);
          dayHours.push(value.sum);
        }

        value.entries.forEach((row, j, rows) => {
          const tr = document.createElement("tr");
          if (value.sum >= 8.0) {
            tr.classList.add("okay");
          }
          if (j === rows.length - 1) {
            tr.classList.add("section-last-row");
          }
          table.appendChild(tr);
          if (row.isAutomaticLabel) {
            tr.classList.add("is-automatic-label");
          }
          tr.setAttribute("title", row.label);
          Object.entries(row).forEach(([key, value]) => {
            if (![
              "time_entry[date]",
              "time_entry[hours]",
              "time_entry[description]",
              "time_entry[issue_number]",
            ].includes(key)) {
              return;
            }
            const cell = document.createElement("td");
            if (!(key === "time_entry[date]" && sumType === "dates")) {
              if (key === "time_entry[issue_number]" && value) {
                let url;
                let prefix = '';
                let isRedmineIssue = false;
                let issueNumber;
                if (/^#?\d+$/.test(value)) {
                  issueNumber = value.match(/^#?(.+)/)[1];
                  url = `https://redmine.dbx.hu/issues/${issueNumber}`;
                  prefix = "#";
                  isRedmineIssue = true;
                } else if (/^[A-Z0-9]+-\d+$/.test(value)) {
                  url = `https://youtrack.dbx.hu/issue/${value}`;
                }

                cell.innerHTML = `
                  <a href="${url}" target="_blank">
                    ${prefix}${value}
                  </a>
                `;

                // Add reload button for Redmine issues
                if (isRedmineIssue && REDMINE_API_KEY) {
                  const reloadBtn = document.createElement("button");
                  reloadBtn.className = "redmine-reload-btn";
                  reloadBtn.innerHTML = "&#8635;"; // Reload icon
                  reloadBtn.title = "Redmine ticket újratöltése";
                  reloadBtn.setAttribute("data-issue-number", issueNumber);
                  reloadBtn.addEventListener("click", async function(e) {
                    e.preventDefault();
                    const btn = e.currentTarget;
                    btn.classList.add("loading");
                    btn.disabled = true;
                    try {
                      await reloadRedmineTicket(issueNumber);
                    } finally {
                      btn.classList.remove("loading");
                      btn.disabled = false;
                    }
                  });
                  cell.appendChild(reloadBtn);
                }
              } else {
                cell.innerHTML = value;
              }
            } else {
              cell.innerHTML = `${row.label}${row.rmProjectName ? `(${row.rmProjectName})`: '' }`;
            }

            tr.appendChild(cell);
          });
        });
      });

      if (sumType === "dates") {
        const szum = dayHours.reduce((a, c) => a + c, 0);
        stats.innerHTML = `
          <div>szum = ${szum}</div>
          <div>munkanapok száma = ${dayHours.length}</div>
          <div>napi átlag = ${(szum / dayHours.length).toFixed(2)}</div>
          <div>hiányzó = ${(dayHours.length * 8 - szum).toFixed(2)}</div>
        `
      }

    });

    previewContainer.scrollTop = prevScrollTop;
  }

  const formTopContentContainer = document.createElement('div');
  Array.from(document.querySelectorAll('#time_entry_container form > input, #time_entry_container form > select, #time_entry_container form > button')).forEach((el) => formTopContentContainer.appendChild(el));
  document.querySelector("#time_entry_container form").prepend(formTopContentContainer);
  $("#submit-batch-button").button().on( "click", async function() {
    console.log("batch button pressed");
    status('');
    const editorValue = monacoEditorInstance ? monacoEditorInstance.getValue() : document.getElementById('batch-textarea').value;
    const parsedBatchData = (await parseBatchData(editorValue, { nometa: !debug })).data;

    const progressElement = window.document.getElementById("enhance-progress");
    progressElement.style.display = "block";
    const progressElementBar = window.document.getElementById("enhance-progress-bar");
    progressElementBar.style.width = `0%`;

    let i = 0;
    const total = parsedBatchData.length;

    const postBatch = function() {
      status(`Ready: ${i}/${total}`);
      progressElementBar.style.width = `${i / total * 100}%`;
      i++;
      if (parsedBatchData.length) {
        if (!debug) {
          $.post('/timelog', parsedBatchData.shift(), postBatch);
        } else {
          window.setTimeout(() => {
            console.log(parsedBatchData.shift());
            postBatch();
          }, 10);
        }
      } else {
        if (!debug) { window.location.reload(); }
      }
    };
    postBatch();
  });

  initializeMonacoEditor()

}());
