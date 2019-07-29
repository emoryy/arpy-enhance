// ==UserScript==
// @name         ArpyEnhance
// @namespace    hu.destr4ct
// @version      0.1
// @description  try to take over the world!
// @author       Emoryy
// @include      http://arpy.dbx.hu/timelog*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';
  function addCss(cssString) {
    var head = document.getElementsByTagName('head')[0];
    if(!head) return;
    var newCss = document.createElement('style');
    newCss.type = "text/css";
    newCss.innerHTML = cssString;
    head.appendChild(newCss);
  }
  addCss (`
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
    }
  `);

  function status(description, level) {
    $('#status').html(description);
    $('#status').attr('class', level);
  }

  $("#time_entry_submit").before('<span id="status"></span>&nbsp;');
  $("#time_entry_submit").before('<button class="btn btn-primary btn-large" type="button" id="submit-batch-button">Batch!</button>&nbsp;');
  $("#time_entry_description").after('<textarea id="batch-textarea" placeholder="batch data, format: MM-DD 0.0 this is the description" class="textarea ui-widget-content ui-corner-all"></textarea>');
  $("#batch-textarea").on('focus', function(){
    $(this).addClass('active');
  });
  $("#submit-batch-button").button().on( "click", function() {
    console.log("batch button pressed");
    var errors = 0;
    var textareaValue = $('#batch-textarea').val();
    if(!textareaValue || !(textareaValue.trim())) {
      status("üres batch data", "error");
      errors++;
    }
    var genericFormData = $('form[action="/timelog"]').serializeArray();

    genericFormData.forEach(function(item) {
      if (["project_id","todo_list_id","todo_item_id"].some(function(name) {return name === item.name}) && !item.value) {
        status("nincs kiválasztva a projekt/kategória", "error");
        errors++;
      }
    });
    if(errors > 0){
      return;
    }

    var batchLines =  textareaValue.match(/[^\r\n]+/g);
    var parsedBatchData = batchLines.map(function(line) {
      var batchItem = {};
      genericFormData.forEach(function(item) {
        batchItem[item.name] = item.value;
      });
      var lineElements = line.split(' ');
      var dateStr = lineElements.shift();
      batchItem['time_entry[date]'] = dateStr.length === 5 ? (new Date()).getFullYear()+'-'+dateStr : dateStr ;
      batchItem['time_entry[hours]'] = lineElements.shift();
      batchItem['time_entry[description]'] = lineElements.join(' ');
      return batchItem;
    });
    var i = 0;
    var total = parsedBatchData.length;
    var postBatch = function(data, textStatus, jqXHR) {
      status("Ready: " + i + '/' + total, "");
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