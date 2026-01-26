/**
 * Preview Manager Module
 * Handles preview rendering and tabs
 */

import { parseBatchData } from '../parser/batch-parser.js';
import { settingsManager } from '../settings/settings-manager.js';
import { favorites } from '../favorites/favorites-manager.js';
import { monacoEditorInstance } from '../monaco/monaco-setup.js';
import { reloadRedmineTicket } from '../redmine/redmine-cache.js';
import { updateEditorDecorations } from '../monaco/monaco-decorations.js';

/**
 * Update preview panel with parsed data
 */
export async function updatePreview() {
  const savedActiveTab = localStorage.getItem('arpyEnhanceActiveTab') || 'dates';
  const previewContent = document.getElementById("preview-content");
  const prevScrollTop = previewContent.scrollTop;
  const editorValue = monacoEditorInstance ? monacoEditorInstance.getValue() : document.getElementById('batch-textarea').value;
  const result = await parseBatchData(editorValue, favorites);

  // Update editor decorations with parsed data
  if (result.summarizedData && updateEditorDecorations) {
    updateEditorDecorations(result.summarizedData);
  }

  previewContent.innerHTML = "";
  if (result.errors) {
    const errorWrapper = document.createElement("div");
    errorWrapper.className = "preview-errors-wrapper";

    const errorTitle = document.createElement("div");
    errorTitle.className = "preview-errors-title";
    errorTitle.textContent = "Hibák az elemzés során:";
    errorWrapper.appendChild(errorTitle);

    const list = document.createElement("ul");
    list.className = "preview-errors-list";
    errorWrapper.appendChild(list);

    result.errors.forEach((error) => {
      const errorItem = document.createElement("li");
      errorItem.className = "preview-error-item";
      errorItem.innerHTML = error;
      list.appendChild(errorItem);
    });

    previewContent.appendChild(errorWrapper);
  }
  if (!result.summarizedData) {
    return;
  }
  const previewTabs = document.createElement('ul');
  previewTabs.classList.add('preview-tabs', 'nav', 'nav-tabs');
  previewContent.appendChild(previewTabs);

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
    previewContent.appendChild(previewTabContentContainer);
    let dayHours = [];

    const settings = settingsManager.getSettings();
    const TARGET_WORK_HOURS = settings.targetWorkHours;
    const MAX_DISPLAY_HOURS = settings.maxDisplayHours;
    const REDMINE_API_KEY = settings.redmineApiKey;

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
            th2.classList.add('missing-entry-error');
            th.classList.add('missing-entry-error');
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
      const isOkay = value.sum >= TARGET_WORK_HOURS;
      // Only apply "okay" coloring for date grouping (not for category grouping)
      if (isOkay && sumType === "dates") {
        sumRow.classList.add("okay");
      }
      sumRow.appendChild(sumTh);

      // Track day hours for statistics (regardless of progress indicator visibility)
      if (sumType === "dates") {
        dayHours.push(value.sum);
      }

      if (sumType === "dates" && settings.showProgressIndicator) {
        const visualisationTh = document.createElement("th");
        visualisationTh.setAttribute("colspan", 2);
        visualisationTh.classList.add("preview-visualisation-th");
        let cumulativePercentage = 0;
        const overtimeThreshold = (TARGET_WORK_HOURS / MAX_DISPLAY_HOURS) * 100;

        visualisationTh.innerHTML = `
        <div class="progress ${isOkay ? 'progress-success' : ''}">
          ${value.entries.map((row) => {
            const hours = parseFloat(row["time_entry[hours]"]);
            const percentage = (hours / MAX_DISPLAY_HOURS) * 100;
            const startPos = cumulativePercentage;
            const endPos = cumulativePercentage + percentage;
            cumulativePercentage = endPos;

            // Check if this bar crosses into overtime zone
            let overlayStyle = '';
            if (endPos > overtimeThreshold) {
              if (startPos < overtimeThreshold) {
                // Bar crosses the threshold - calculate where to start the red tint
                const crossPoint = ((overtimeThreshold - startPos) / percentage) * 100;
                overlayStyle = `background: linear-gradient(to right, transparent ${crossPoint}%, rgba(234, 17, 168, 0.66) ${crossPoint}%);`;
              } else {
                // Bar is entirely in overtime zone
                overlayStyle = `background: rgba(234, 17, 168, 0.66);`;
              }
            }

            return `
            <div
              class="bar ${overlayStyle ? 'bar-has-overlay' : ''}"
              title="${hours} - ${row["time_entry[description]"]}"
              style="width: ${percentage}%"
            >
              ${overlayStyle ? `<div class="bar-overlay" style="${overlayStyle}"></div>` : ''}
              <span>${hours}</span>
            </div>
            `;
          }).join('')}
        </div>
      `;
        sumRow.appendChild(visualisationTh);
      }

      value.entries.forEach((row, j, rows) => {
        const tr = document.createElement("tr");
        // Only apply "okay" coloring for date grouping (not for category grouping)
        if (value.sum >= 8.0 && sumType === "dates") {
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
              if (isRedmineIssue && REDMINE_API_KEY && reloadRedmineTicket) {
                const reloadBtn = document.createElement("button");
                reloadBtn.className = "btn redmine-reload-btn";
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

  previewContent.scrollTop = prevScrollTop;
}
