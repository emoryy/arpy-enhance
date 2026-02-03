/**
 * Batch Data Parser Module
 * Parses batch work hour entry syntax
 * Original lines 2739-3032 from ArpyEnhance.user.js
 */

import { fetchRedmineIssue } from '../redmine/redmine-cache.js';
import { settingsManager } from '../settings/settings-manager.js';
import { getFullLabelPartsForFav } from '../favorites/favorites-manager.js';
import { fetchAndCache } from '../cache/arpy-cache.js';

// Async progress tracking
let asyncStatus = {
  start: {},
  end: {},
};

// Generation ID to track which parse run callbacks belong to
let currentParseGeneration = 0;

/**
 * Reset async progress tracking and return new generation ID
 */
function resetAsyncProgress() {
  asyncStatus = {
    start: {},
    end: {},
  };
  currentParseGeneration++;
  return currentParseGeneration;
}

/**
 * Update async progress display (for Redmine/Arpy API fetches)
 * Only updates if the generation matches the current parse run
 */
function updateAsyncProgress(type, status, generation, silent = false) {
  // Ignore updates from stale parse runs
  if (generation !== currentParseGeneration) {
    return;
  }

  // Skip UI updates if in silent mode (e.g., during submission)
  if (silent) {
    return;
  }

  asyncStatus[status][type] = (asyncStatus[status][type] || 0) + 1;
  const previewContent = document.getElementById("preview-content");
  if (previewContent) {
    const progressHTML = Object.entries(asyncStatus.start).map(([type, count]) => {
      const completed = asyncStatus.end[type] || 0;
      const percentage = (completed / count) * 100;
      const typeLabel = {
        'issue': 'Redmine ticketek',
        'todoList': 'Projekt listák',
        'todoItems': 'Projekt elemek'
      }[type] || type;

      return `
        <div class="async-progress-item">
          <div class="async-progress-label">
            <span class="async-progress-type">${typeLabel}</span>
            <span class="async-progress-count">${completed}/${count}</span>
          </div>
          <div class="async-progress-bar-container">
            <div class="async-progress-bar" style="width: ${percentage}%"></div>
          </div>
        </div>
      `;
    }).join("");

    previewContent.innerHTML = `
      <div class="async-progress-wrapper">
        <div class="async-progress-title">Adatok betöltése...</div>
        ${progressHTML}
      </div>
    `;
  }
}

/**
 * Find todo data by full label string (from Redmine "Arpy jelentés" field)
 * @param {string} _fullLabelString - Full label string to search for
 * @param {Array} favorites - Favorites array to search in
 */
function findTodoDataByFullLabelString(_fullLabelString, favorites) {
  // Helper to remove day indicators
  function removeDays(str) {
    return str.replace(/\W?\(\d+(,\d+)? nap\)\W?/,"").replace(/\W?\(\d+(\.\d+)?d\)\W?/,"").replace(/  +/g, ' ');
  }

  const fullLabelString = removeDays(_fullLabelString);
  const favorite = favorites.find((fav) => {
    const fullLabelForFav = removeDays(getFullLabelPartsForFav(fav).join(" / ")).trim();
    return fullLabelString === fullLabelForFav;
  });

  return favorite;
}

/**
 * Parse batch data from textarea
 * @param {string} textareaValue - Raw text from textarea
 * @param {Array} favorites - Favorites list
 * @param {Object} options - Parsing options
 * @returns {Promise<Object>} Parsed data with entries and summary
 */
export async function parseBatchData(textareaValue, favorites, options = {}) {
    // Reset async progress tracking and get generation ID for this parse run
    const parseGeneration = resetAsyncProgress();
    const silent = options.silent || false;

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
    // Split by newlines to preserve actual line numbers (including empty lines)
    const lines = textareaValue.split(/\r?\n/);
    const parsedBatchData = (await Promise.all(lines.map(async function(line, lineNumber) {
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
      const REDMINE_API_KEY = settingsManager.get('redmineApiKey');
      if (REDMINE_API_KEY && issueNumber?.match(/^\d+$/)) {
        updateAsyncProgress("issue", "start", parseGeneration, silent);
        try {
          const json = await fetchRedmineIssue(issueNumber);

          if (json?.issue) {
            const arpyField = json.issue.custom_fields?.find(({ name }) => name === "Arpy jelentés");
            rmProjectName = json.issue.project.name;
            if (arpyField?.value) {
              // kategória / todo megkeresése
              // először a fav-ok között keressük
              const arpyFieldValue = arpyField.value.trim();
              console.group("SEARCH FAV FOR", arpyField.value);
              try {
                console.log("SEARCH FAV FOR", arpyField.value);
                const fav = findTodoDataByFullLabelString(arpyFieldValue, favorites);
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
                  updateAsyncProgress("todoList", "start", parseGeneration, silent);
                  const todoListResponse = await fetchAndCache(
                    `/get_todo_lists?project_id=${projectId}&show_completed=false`,
                    `projectId-${projectId}`
                  );
                  updateAsyncProgress("todoList", "end", parseGeneration, silent);

                  const todoList = todoListResponse.find(({ name }) => name === arpyParts[2]);
                  console.log("todoList", projectId, todoList);
                  if (todoList) {
                    updateAsyncProgress("todoItems", "start", parseGeneration, silent);
                    const todoItems = await fetchAndCache(
                      `/get_todo_items?todo_list_id=${todoList.id}&show_completed=false`,
                      `todoListId-${todoList.id}`
                    );
                    updateAsyncProgress("todoItems", "end", parseGeneration, silent);
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
              } finally {
                console.groupEnd("SEARCH FAV FOR", arpyField.value);
              }
            }
          }
        } catch (e) {
          console.error(`Failed to fetch Redmine issue #${issueNumber}:`, e);
        } finally {
          updateAsyncProgress("issue", "end", parseGeneration, silent);
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
