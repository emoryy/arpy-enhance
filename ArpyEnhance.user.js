// ==UserScript==
// @name         ArpyEnhance
// @namespace    hu.emoryy
// @version      0.2
// @description  enhances Arpy
// @author       Emoryy
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js
// @include      http://arpy.dbx.hu/timelog*
// ==/UserScript==

/* jshint ignore:start */
var inline_src = (<><![CDATA[
/* jshint ignore:end */
    /* jshint esnext: false */
    /* jshint esversion: 6 */

  (function() {
    'use strict';
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
          //if (!formDataItem || !formDataItem.value) {
            //saveable = false;
          //} else {
          if (formDataItem) {
            fav[propName] = {
              label: $(`form[action="/timelog"] [value="${formDataItem.value}"]`).html(),
              value: formDataItem.value
            };
          }
          //}
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
      const newLi = $(`<li> 
           <span class="label label-info">${fav.project_id && fav.project_id.label}</span>
           <span class="label label-info">${fav.todo_list_id && fav.todo_list_id.label || '-'}</span>
           <span class="label label-info">${fav.todo_item_id && fav.todo_item_id.label || '-'}</span>
         </li>`);
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
demo:
  10-02 1.5 taszk leírás 2
  10-03 2.5 taszk leírás 3
insnet:
  10-04 8.0 taszk leírás 4

A munkaidő bejegyzéseket soronként kell megadni, egy sor formátuma a következő:

12-26 4.0 Ez itt a leírás szövege
- vagy -
2016-12-26 3.0 Ez itt a leírás szövege

A sorokat az első két előforduló szóköz osztja 3 részre.
1. Dátum/idő. Az év opcionális, ha nincs megadva, akkor automatikusan az aktuális év lesz érvényes a sorra.
2. Munkaórák száma. Ez lehet egész szám vagy tizedes tört ponttal jelölve.
3. Leírás szövege. (A sor teljes hátralévő része)

Kategóriák meghatározása:
Alapesetben minden sorra a fenti lenyílókban aktuálisan kiválasztott értékek lesznek érvényesek.
A gyakrabban használt kategóriákat el lehet menteni a kedvencek közé a ★Fav gombbal.
A hozzáadás után a kedvenceket címkével kell ellátni, mert ezekkel tudunk hivatkozni rájuk.

Az input szövegben a címkéket külön sorba kell írni, a címke után pedig kettőspontot kell rakni.
A fenti gyors példában a taszk 1 a lenyílókban aktuálisan kiválasztott kategóriákat fogja megkapni, a taszk 2 és taszk 3 a demo címkével ellátott kedvenc kategóriáit, a taszk 4 pedig az insnet kategóriáit.

A szöveget tetszés szerint lehet tagolni üres sorokkal, a sorokat pedig bármennyi szóközzel beljebb lehet igazítani, a feldolgozó ezeket figyelmen kívül hagyja.
`.replace(/\n/g, "\n");

    $("#time_entry_submit").before('<span id="status"></span>&nbsp;');
    $("#time_entry_submit").before('<button class="btn btn-primary btn-large" type="button" id="submit-batch-button">Mentés!</button>&nbsp;');
    $("#time_entry_description").after(`<textarea id="batch-textarea" placeholder="${placeholderText}" class="textarea ui-widget-content ui-corner-all"></textarea>`);
    $("#time_entry_container").append('<div id="favorites-container"><ul id="favorites-list" class="well"></ul></div>');
    $("#todo_item_id").after('<button class="btn btn-primary btn-sm" type="button" id="add-fav-button"><span class="i">★</span> Fav</button>');
    $("#add-fav-button").button().on( "click", addNewFavorite);

    renderFavs();
    $("#batch-textarea").on('focus', function(){
      $(this).addClass('active');
    });
    $("#submit-batch-button").button().on( "click", function() {
      console.log("batch button pressed");
      status('');
      const textareaValue = $('#batch-textarea').val();
      if(!textareaValue || !(textareaValue.trim())) {
        status("Üres batch data", "error");
        return;
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

      let currentProjectData = null;
      if (Object.keys(projectData).length === 3) {
        currentProjectData = projectData;
      }
      let everythingIsOk = true;
      const parsedBatchData = textareaValue.match(/[^\r\n]+/g).map(function(line) {
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine[0] === '#') {
          return;
        }
        const lineParts = trimmedLine.replace(/\s\s+/g, ' ').split(' ');
        if ((lineParts[0].indexOf(':') === lineParts[0].length - 1)) {
          // we have a projectinfo label
          const label = lineParts[0].split(':')[0];
          const fav = favorites.find((f) => f.label === label);
          if (fav) {
            currentProjectData = {
              project_id: fav.project_id.value,
              todo_list_id: fav.todo_list_id.value,
              todo_item_id: fav.todo_item_id.value
            };
            console.log('currentProjectData', currentProjectData);
          }
          if (lineParts.length === 1) { // it was only a label
            return;
          } else { // it was on the beginning of a line, we can process further
            lineParts.shift();
          }
        } else if (lineParts.length === 1) {
          return;
        }

        if (!currentProjectData) {
          everythingIsOk = false;
          return;
        }

        // Assembling batchItem

        const dateStr = lineParts.shift();
        const formattedParsedDate = moment(dateStr, ['YYYY-MM-DD', 'MM-DD']).format('YYYY-MM-DD');
        console.log('formattedParsedDate', formattedParsedDate);
        const hours = lineParts.shift();
        const description = lineParts.join(' ');

        return Object.assign({},
          genericFormData,
          currentProjectData,
          {
            'time_entry[date]': formattedParsedDate,
            'time_entry[hours]': hours,
            'time_entry[description]': description
          }
        );
      }).filter((item) => !!item);

      if (!everythingIsOk) {
        return status("Nincs meghatározva a projekt/kategória!", "error");
      }

      let i = 0;
      const total = parsedBatchData.length;
      //console.log('parsedBatchData', parsedBatchData);
      parsedBatchData.forEach(function(bd) {
        console.log(bd.project_id, bd.todo_list_id, bd.todo_item_id, bd["time_entry[date]"], bd["time_entry[hours]"], bd["time_entry[description]"]);
      });
      const postBatch = function(data, textStatus, jqXHR) {
        status(`Ready: ${i}/${total}`);
        i++;
        if(parsedBatchData.length) {
          $.post('/timelog', parsedBatchData.shift(), postBatch);
        } else {
          window.location.reload();
        }
      };
      postBatch();
    });
  })();
/* jshint ignore:start */
]]></>).toString();
var c = Babel.transform(inline_src, { presets: [ "es2015", "es2016" ] });
eval(c.code);
