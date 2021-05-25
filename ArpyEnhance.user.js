// ==UserScript==
// @name         ArpyEnhance
// @namespace    hu.emoryy
// @version      0.7
// @description  enhances Arpy
// @author       Emoryy
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js
// @include      http://arpy.dbx.hu/timelog*
// @downloadURL  https://github.com/emoryy/arpy-enhance/raw/master/ArpyEnhance.user.js
// ==/UserScript==

(function() {
  'use strict';

  const debug = false;

  document.getElementById('person').disabled = false;

  let favorites = [];
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
    }
    #batch-textarea {
      border: 1px solid #ccc;
      border-radius: 3px;
      width: 892px;
      font-family: "monospace";
      transition: height 0.5s;
      height: 500px;
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
    #preview-container h3 {
      margin-bottom: 0;
    }
    #preview-container h3:first-child {
      margin-top: 0;
    }
    #preview-container td,
    #preview-container th {
      font-size: 15px;
      font-family: monospace;
      text-align: left;

      padding: 4px;
    }
    #preview-container td:first-child {
      padding-left: 20px;
    }
    #preview-container table {
      margin-left: -10px;
      margin-bottom: 10px;
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
    #content {
      //width: 100%;
      padding: 0;
    }
    #preview-container {

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
    #time_entry_container {

    }
    #favorites-container {
    }
    #favorites-list li input {
      width: 80px;
    }
    #favorites-list {
      margin: 0;
      list-style: none;
    }
    #favorites-list li {
      padding: 3px;
    }
    #favorites-list li .label {
      padding-top: 3px;
      background: #00CC9F;
      text-shadow: 1px 1px 1px rgba(0,0,0,0.8);
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
    status.innerHTML = description;
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
    const projectDropdown = document.getElementById('project_id');
    const projectOption = projectDropdown.querySelector(`option[value="${fav.project_id.value}"]`);
    const categoryLabel = projectOption ? projectOption.parentElement.getAttribute('label') : '?';
    const labelParts = [
      categoryLabel,
      fav.project_id && fav.project_id.label,
      fav.todo_list_id && fav.todo_list_id.label || '-',
      fav.todo_item_id && fav.todo_item_id.label || '-'
    ];
    const newLi = $(`
      <li>
        ${labelParts.map((part) => `<span class="label label-info">${part}</span>`).join("\n")}
      </li>
    `);
    const labelInput = $('<input placeholder="- címke helye -">');
    labelInput.val(fav.label);
    labelInput.change(function(...args) {
      console.log(args);
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

  try { favorites = JSON.parse(window.localStorage.favorites); } catch(e) { }

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

A fenti legelső példában a taszk 1 a lenyílókban aktuálisan kiválasztott kategóriákat fogja megkapni, a taszk 2 és taszk 3 a demo címkével ellátott kedvenc kategóriáit, a taszk 4 pedig az insnet kategóriáit.

A címkék hatása mindig a következő ugyanolyan típusú (kategória vagy dátum) címkéig érvényes. Nincs megkötés, hogy először dátum aztán kategória címkét kell használni, vagy fordítva. Tehát mondhatjuk akár azt is, hogy először napokra csoportosítva és azon belül pedig kategóriánként bontva visszük fel az adatokat, de akár azt is, hogy először projektek szerint csoportosítunk, és ezen belül adjuk meg a napokat:

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
    `<button class="btn btn-primary btn-large" type="button" id="submit-batch-button">Mentés!</button>&nbsp;`
  );
  $("#time_entry_description").after(
    `<textarea id="batch-textarea" placeholder="${placeholderText}" class="textarea ui-widget-content ui-corner-all"></textarea>`
  );
  //$("#time_entry_container").wrap(`<div id="arpy-enhance-container"></div>`);
  $("#time_entry_container").after(`<div id="preview-container" class="well"></div>`);
  $("#time_entry_container").before(`<div id="favorites-container" class="well"><ul id="favorites-list"></ul></div>`);

  $("#todo_item_id").after(
    '<button class="btn btn-primary btn-sm" type="button" id="add-fav-button"><span class="i">★</span> Fav</button>'
  );
  $("#add-fav-button").button().on( "click", addNewFavorite);


  renderFavs();

  $("#batch-textarea").on('focus', function(){
    $(this).addClass('active');
  });
  if (window.localStorage.batchTextareaSavedValue) {
    document.getElementById('batch-textarea').value = window.localStorage.batchTextareaSavedValue;
    updatePreview();
  }


  function parseBatchData() {
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

  function updatePreview() {
    const result = parseBatchData();
    const previewContainer = document.getElementById("preview-container");
    previewContainer.innerHTML = "";
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
    ["dates", "labels"].forEach((sumType) => {
      const data = result.summarizedData[sumType];
      const title = document.createElement("h3");
      title.innerText = {
        dates: "Napi bontás",
        labels: "Projekt/kategória szerint"
      }[sumType];
      previewContainer.appendChild(title);
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

  document.getElementById('batch-textarea').addEventListener('input', function(ev) {
    window.localStorage.batchTextareaSavedValue = ev.target.value;
    updatePreview();
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

