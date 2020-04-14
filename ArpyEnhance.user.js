// ==UserScript==
// @name         ArpyEnhance
// @namespace    hu.emoryy
// @version      0.4
// @description  enhances Arpy
// @author       Emoryy
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js
// @include      http://arpy.dbx.hu/timelog*
// @downloadURL  https://github.com/emoryy/arpy-enhance/raw/master/ArpyEnhance.user.js
// ==/UserScript==

/* jshint ignore:start */
var inline_src = (<><![CDATA[
  /* jshint ignore:end */
  /* jshint esnext: false */
  /* jshint esversion: 6 */

  (function() {
    'use strict';

    const debug = false;

    let favorites = [];
    function addCss(cssString) {
      const head = document.getElementsByTagName('head')[0];
      const newCss = document.createElement('style');
      newCss.type = "text/css";
      newCss.innerHTML = cssString;
      head.appendChild(newCss);
    }
    addCss(`
      #batch-textarea {
        border: 1px solid #ccc;
        border-radius: 3px;
        width: 892px;
        font-family: "monospace";
        transition: height 0.5s;
        height: 40px;
      }
      #batch-textarea.active {
        height: 250px;
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
      #time_entry_hours, #time_entry_submit, #time_entry_date, #time_entry_description {
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
      #favorites-container {
      }
      #favorites-list {
        list-style: none;
        margin-left: -40px;
        margin-right: 20px;
      }
      #favorites-list li {
        padding: 3px;
      }

      #favorites-list li input{
        padding: 0 5px !important;
        border: 1px solid transparent;
        background: transparent;
      }
      #favorites-list li input:hover, #favorites-list li input:focus {
        border: 1px solid #777;
        background: white;
      }
#preview-container {
  position: absolute;
  top: 60px;
  left: 50%;
  margin-left: 520px;
  white-space: nowrap;
}
#preview-container td,
#preview-container th {
  font-size: 9px;
  font-family: monospace;
  text-align: left;
  line-height: 10px;
}
#preview-container td:first-child {
  padding-left: 5px;
}
#preview-container table {
  margin-left: -10px;
  margin-bottom: 10px;
}

    `);

    function status(description, level) {
      $('#status').html(description);
      $('#status').attr('class', level);
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

    function saveFavorites() {
      window.localStorage.favorites = JSON.stringify(favorites);
    }

    function updateFav(id, label) {
      const fav = favorites.find((f) => f.id === id);
      fav.label = label ? label : "";
      saveFavorites();
    }

    function remove(array, element) {
      return array.filter(e => e !== element);
    }

    function displayFavoriteElement(fav) {
      const newLi = $(`
        <li>
          <span class="label label-info">${fav.project_id && fav.project_id.label}</span>
          <span class="label label-info">${fav.todo_list_id && fav.todo_list_id.label || '-'}</span>
          <span class="label label-info">${fav.todo_item_id && fav.todo_item_id.label || '-'}</span>
        </li>
      `);
      const labelInput = $('<input placeholder="- címke helye -">');
      labelInput.val(fav.label);
      labelInput.change(function(...args) {
        console.log(args);
        updateFav(fav.id, this.value);
      });
      newLi.prepend(labelInput);
      const removeButton = $('<button class="btn btn-mini" type="button">&times;</button>');
      removeButton.button().on("click", function() {
        removeFav(fav.id);
      });
      newLi.append(removeButton);
      $('#favorites-list').append(newLi);
    }

    function renderFavs() {
      $('#favorites-list').empty();
      favorites.forEach(displayFavoriteElement);
    }

    function removeFav(id) {
      const fav = favorites.find((f) => f.id === id);
      favorites = remove(favorites, fav);
      saveFavorites();
      renderFavs();
    }

    try {
      favorites = JSON.parse(window.localStorage.favorites);
    } catch(e) {
    }

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

A fenti gyors példában a taszk 1 a lenyílókban aktuálisan kiválasztott kategóriákat fogja megkapni, a taszk 2 és taszk 3 a demo címkével ellátott kedvenc kategóriáit, a taszk 4 pedig az insnet kategóriáit.
A címkék hatása mindig a következő ugyanolyan típusú (kategória vagy dátum) címkéig érvényes.


`.replace(/\n/g, "\n");

    $("#time_entry_submit").before(`
      <span id="status"></span>&nbsp;
      <div id="enhance-progress" class="progress progress-striped active" style="display: none;">
        <div id="enhance-progress-bar" class="bar"></div>
      </div>
    `);
    $("#time_entry_submit").before(
      `<button class="btn btn-primary btn-large" type="button" id="preview-button">Előnézet</button>
      <button class="btn btn-primary btn-large" type="button" id="submit-batch-button">Mentés!</button>&nbsp;`
    );
    $("#time_entry_description").after(
      `<textarea id="batch-textarea" placeholder="${placeholderText}" class="textarea ui-widget-content ui-corner-all"></textarea>`
    );
    $("#time_entry_container").append(
      `<div id="preview-container" class="well"></div>
<div id="favorites-container"><ul id="favorites-list" class="well"></ul></div>`
    );
    $("#todo_item_id").after(
      '<button class="btn btn-primary btn-sm" type="button" id="add-fav-button"><span class="i">★</span> Fav</button>'
    );
    $("#add-fav-button").button().on( "click", addNewFavorite);


    renderFavs();
    $("#batch-textarea").on('focus', function(){
      $(this).addClass('active');
    });

    const parseBatchData = function() {
      const textareaValue = $('#batch-textarea').val();
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
      let currentProjectData = null;
      if (Object.keys(projectData).length === 3) {
        currentProjectData = projectData;
      }
      const errors = [];

      const summarizedData = {
        labels: {
        },
        dates: {
        }
      }
      const parsedBatchData = textareaValue.match(/[^\r\n]+/g).map(function(line, lineNumber) {
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
            const fav = favorites.find((f) => f.label === lineParts[0]);
            if (fav) {
              currentProjectData = {
                label: fav.label,
                project_id: fav.project_id.value,
                todo_list_id: fav.todo_list_id.value,
                todo_item_id: fav.todo_item_id.value
              };

            }
          }
          return;
        }

        const label = (currentProjectData && currentProjectData.label) || "";

        if (!currentProjectData) {
          errors.push(`${lineNumber + 1}. sor: Kategória információ hiányzik`);
          return;
        }

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
          if (!currentDate) {
            errors.push(`${lineNumber + 1}. sor: dátum címke hiányzik!`);
            return;
          }
          parsedDate = currentDate;
        } else {
          parsedDate = parseDateStr(dateStr);
          if (!parsedDate) {
            return;
          }
        }
        const formattedDate = parsedDate.format('YYYY-MM-DD');

        const hours = lineParts.shift();
        const description = lineParts.join(' ');

        const outputDataObject = Object.assign({},
          genericFormData,
          {
            project_id: currentProjectData.project_id,
            todo_list_id: currentProjectData.todo_list_id,
            todo_item_id: currentProjectData.todo_item_id,
            'time_entry[date]': formattedDate,
            'time_entry[hours]': hours,
            'time_entry[description]': description
          }
        );

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

        let byLabel = summarizedData.labels[label];
        if (!byLabel) {
          byLabel = {
            sum: 0,
            entries: []
          };
          summarizedData.labels[label] = byLabel;
        }
        byLabel.sum += parsedHours;
        byLabel.entries.push(outputDataObject);

        return outputDataObject;
      }).filter((item) => !!item);

      if (errors.length) {
        return { errors };
      }

      //console.log('parsedBatchData', parsedBatchData);
      //parsedBatchData.forEach(function(bd) {
      //  console.log(bd.project_id, bd.todo_list_id, bd.todo_item_id, bd["time_entry[date]"], bd["time_entry[hours]"], bd["time_entry[description]"]);
      //});

      return { data: parsedBatchData, summarizedData };
    }

    document.getElementById('batch-textarea').addEventListener('input', function(ev) {
      const result = parseBatchData();
      console.log("result", result);
      const previewContainer = document.getElementById("preview-container");
      previewContainer.innerHTML = "";
      if (result.errors) {
        const list = document.createElement("ul");
        previewContainer.appendChild(list);

        errors.forEach((error) => {
          const errorItem = document.createElement("li");
          errorItem.innerHTML = error;
          list.appendChild(errorItem);
        });
      }
      if (result.summarizedData) {
        ["dates", "labels"].forEach((sumType) => {
          const data = result.summarizedData[sumType];
          const table = document.createElement("table");

          previewContainer.appendChild(table);
          Object.entries(data).forEach(([key, value]) => {
            const sumRow = document.createElement("tr");
            table.appendChild(sumRow);
            const catTh = document.createElement("th");
            catTh.innerHTML = key;
            sumRow.appendChild(catTh);
            const sumTh = document.createElement("th");
            sumTh.innerHTML = value.sum;
            sumRow.appendChild(sumTh);

            value.entries.forEach((row, i) => {
              //let header;
              /*if (i === 0) {
                header = document.createElement("tr");
                table.appendChild(header);
              }*/
              const tr = document.createElement("tr");
              table.appendChild(tr);
              Object.entries(row).forEach(([key, value]) => {
                if (!["time_entry[date]", "time_entry[hours]", "time_entry[description]"].includes(key)) {
                  return;
                }
                /*if (i === 0) {
                  const th = document.createElement("th");
                  th.innerHTML = key;
                  header.appendChild(th);
                }*/
                const cell = document.createElement("td");
                cell.innerHTML = value;
                tr.appendChild(cell);
              });
            });
          });

        });

      }
    });

    $("#preview-button").button().on( "click", function() {
      const parseResult = parseBatchData();
      console.log("parsedBatchData", parseResult);
    });

    $("#submit-batch-button").button().on( "click", function() {
      console.log("batch button pressed");
      status('');
      const parsedBatchData = parseBatchData().data;

      const progressElement = window.document.getElementById("enhance-progress");
      progressElement.style.display = "block";
      const progressElementBar = window.document.getElementById("enhance-progress-bar");
      progressElementBar.style.width = `0%`;

      let i = 0;
      const total = parsedBatchData.length;

      const postBatch = function(data, textStatus, jqXHR) {
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


  })();
/* jshint ignore:start */
]]></>).toString();
var c = Babel.transform(inline_src, { presets: [ "es2015", "es2016" ] });
eval(c.code);
