// ==UserScript==
// @name         ArpyEnhance
// @namespace    hu.emoryy
// @version      0.17
// @author       Emoryy
// @description  enhances Arpy
// @license      ISC
// @icon         https://icons.duckduckgo.com/ip2/dbx.hu.ico
// @homepage     https://github.com/emoryy/arpy-enhance#readme
// @homepageURL  https://github.com/emoryy/arpy-enhance#readme
// @source       https://github.com/emoryy/arpy-enhance.git
// @supportURL   https://github.com/emoryy/arpy-enhance/issues
// @downloadURL  https://github.com/emoryy/arpy-enhance/raw/master/ArpyEnhance.user.js
// @match        http://arpy.dbx.hu/timelog*
// @match        https://arpy.dbx.hu/timelog*
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js
// @grant        GM_addStyle
// @grant        unsafeWindow
// ==/UserScript==

(r=>{if(typeof GM_addStyle=="function"){GM_addStyle(r);return}const e=document.createElement("style");e.textContent=r,document.head.append(e)})(' :root{--target-hours: 8;--max-hours: 12}:root,[data-theme=light]{--bg-primary: #ffffff;--bg-secondary: #efefef;--bg-tertiary: #dddddd;--bg-panel: #efefef;--bg-hover: #e0e0e0;--bg-active: #d0d0d0;--input-bg: #ffffff;--input-bg-focus: #ffffff;--text-primary: #333333;--text-secondary: #666666;--text-inverse: #ffffff;--border-light: #ddd;--border-medium: #ccc;--border-dark: #999;--border-darker: #777;--panel-header-start: #e8e8e8;--panel-header-end: #d0d0d0;--panel-header-border: #999;--panel-header-text: #333;--table-bg: #ddd;--table-sum-bg: #555;--table-sum-text: #fff;--table-separator: #f5f5f5;--preview-sticky-bg: rgb(213,210,210);--fav-label-0: #00CC9F;--fav-label-1: #00ACB3;--fav-label-2: #0088B2;--fav-label-3: #046399;--status-valid: rgb(32,131,79);--status-valid-text: rgb(224,255,239);--status-closed: rgb(135,195,165);--status-invalid: rgb(171,221,196);--status-error: #B94A48;--preview-okay-bg: rgb(32,131,79);--preview-okay-td-bg: color-mix(in srgb, var(--preview-okay-bg), white 74%);--preview-okay-bar-bg: rgb(135,195,165);--preview-okay-text: rgb(224,255,239);--preview-missing-text: #B94A48;--progress-bg: rgba(255,255,255,.4);--btn-primary: #0088CC;--btn-disabled: #aaa;--btn-delete: #B94A48;--btn-regular-bg: #e0e0e0;--btn-regular-hover: #d0d0d0;--redmine-auto-label: rgba(255,77,77,.49);--resizer-default: #aaa;--resizer-hover: #444;--reload-btn-bg: #f5f5f5;--reload-btn-border: #999;--reload-btn-hover: #e0e0e0;--text-shadow: rgba(0,0,0,.8)}[data-theme=dark]{--bg-primary: #1a1a1a;--bg-secondary: #252525;--bg-tertiary: #2d2d2d;--bg-panel: #2a2a2a;--bg-hover: #353535;--bg-active: #404040;--input-bg: #252525;--input-bg-focus: #1a1a1a;--text-primary: #e0e0e0;--text-secondary: #a0a0a0;--text-inverse: #1a1a1a;--border-light: #404040;--border-medium: #505050;--border-dark: #606060;--border-darker: #707070;--panel-header-start: #2d2d2d;--panel-header-end: #252525;--panel-header-border: #505050;--panel-header-text: #e0e0e0;--table-bg: #353535;--table-sum-bg: #505050;--table-sum-text: #e0e0e0;--table-separator: #2a2a2a;--preview-sticky-bg: #2d2d2d;--fav-label-0: #00a37f;--fav-label-1: #008a93;--fav-label-2: #006a92;--fav-label-3: #034379;--status-valid: rgb(28,101,69);--status-valid-text: rgb(200,255,220);--status-closed: rgb(65,105,90);--status-invalid: rgb(75,115,100);--status-error: #d95a58;--preview-okay-bg: rgb(28,101,69);--preview-okay-td-bg: color-mix(in srgb, var(--preview-okay-bg), black 36%);--preview-okay-bar-bg: rgb(65,105,90);--preview-okay-text: rgb(200,255,220);--preview-missing-text: #d95a58;--progress-bg: rgba(0,0,0,.2);--btn-primary: #0077b3;--btn-disabled: #555;--btn-delete: #c85a58;--btn-regular-bg: #3a3a3a;--btn-regular-hover: #454545;--redmine-auto-label: rgba(255,97,97,.3);--resizer-default: #555;--resizer-hover: #777;--reload-btn-bg: #353535;--reload-btn-border: #606060;--reload-btn-hover: #404040;--text-shadow: rgba(0,0,0,.9)}body{background-color:var(--bg-primary)!important}#timelog_page_wrapper{background-color:var(--bg-tertiary)!important}#time_entry_container,#project_select_container,.enhanced-container{background-color:var(--bg-panel)!important;border-color:var(--border-light)!important}[data-theme=dark] #timelog_page_wrapper,[data-theme=dark] #timelog_page_wrapper *{color:var(--text-primary)}[data-theme=dark] pre{background-color:var(--bg-secondary)!important;color:var(--text-primary)!important}[data-theme=dark] input,[data-theme=dark] select,[data-theme=dark] textarea,[data-theme=dark] .dropdown-toggle{background-color:var(--input-bg)!important;color:var(--text-primary)!important;border-color:var(--border-medium)!important}[data-theme=dark] input:focus,[data-theme=dark] select:focus,[data-theme=dark] textarea:focus{background-color:var(--input-bg-focus)!important;border-color:var(--border-dark)!important}[data-theme=dark] option,[data-theme=dark] optgroup{background-color:var(--bg-secondary)!important;color:var(--text-primary)!important}[data-theme=dark] input[type=checkbox],[data-theme=dark] input[type=radio]{opacity:.9;cursor:pointer}[data-theme=dark] .btn:not(.btn-primary):not(.btn-danger){background-color:var(--btn-regular-bg)!important;background-image:none!important;color:var(--text-primary)!important;border-color:var(--border-darker)!important;text-shadow:none!important;box-shadow:inset 0 1px #ffffff1a,0 1px 2px #0000004d!important}[data-theme=dark] .btn:not(.btn-primary):not(.btn-danger):hover,[data-theme=dark] .btn:not(.btn-primary):not(.btn-danger):focus{background-color:var(--btn-regular-hover)!important;background-image:none!important;color:var(--text-primary)!important;box-shadow:inset 0 1px #ffffff1a,0 1px 2px #0000004d!important}[data-theme=dark] .btn:not(.btn-primary):not(.btn-danger):active,[data-theme=dark] .btn:not(.btn-primary):not(.btn-danger).active{background-color:var(--btn-regular-hover)!important;box-shadow:inset 0 2px 4px #0006,0 1px 2px #00000080!important}[data-theme=dark] .btn-primary{background-color:var(--btn-primary)!important;background-image:linear-gradient(to bottom,#09d,#0077b3)!important;background-position:0 0!important;background-size:100% 100%!important;color:#fff!important;text-shadow:0 -1px 0 rgba(0,0,0,.3)!important;border-color:#005580!important;box-shadow:inset 0 1px #fff3,0 1px 2px #00000080!important;transition:none!important}[data-theme=dark] .btn-primary:hover,[data-theme=dark] .btn-primary:focus{background-color:#08c!important;background-image:linear-gradient(to bottom,#08c,#069)!important;background-position:0 0!important;background-size:100% 100%!important;color:#fff!important;box-shadow:inset 0 1px #fff3,0 1px 2px #00000080!important;transition:none!important}[data-theme=dark] .btn-primary:active,[data-theme=dark] .btn-primary.active{background-color:#069!important;background-image:linear-gradient(to bottom,#069,#005580)!important;box-shadow:inset 0 2px 4px #0006,0 1px 2px #00000080!important}[data-theme=dark] .btn-danger{background-color:var(--btn-delete)!important;background-image:linear-gradient(to bottom,#d95a58,#b94a48)!important;color:#fff!important;text-shadow:0 -1px 0 rgba(0,0,0,.3)!important;border-color:#9a3a38!important;box-shadow:inset 0 1px #fff3,0 1px 2px #00000080!important}[data-theme=dark] .btn-danger:hover,[data-theme=dark] .btn-danger:focus{background-color:#c85a58!important;background-image:linear-gradient(to bottom,#c85a58,#a04846)!important;color:#fff!important;box-shadow:inset 0 1px #fff3,0 1px 2px #00000080!important}[data-theme=dark] .btn-danger:active,[data-theme=dark] .btn-danger.active{background-color:#a04846!important;background-image:linear-gradient(to bottom,#a04846,#8a3836)!important;box-shadow:inset 0 2px 4px #0006,0 1px 2px #00000080!important}[data-theme=dark] .time_log_table .btn i{filter:invert()}.table{background-color:var(--bg-secondary)!important;color:var(--text-primary)!important}.table th{background-color:var(--bg-tertiary)!important;color:var(--text-primary)!important;border-color:var(--border-light)!important}.table td{background-color:var(--bg-secondary)!important;color:var(--text-primary)!important;border-color:var(--border-light)!important}.table-striped tbody tr:nth-child(odd) td{background-color:var(--bg-panel)!important}.table tbody tr:hover td{background-color:var(--bg-hover)!important}#time_log{color:var(--text-primary)!important}#time_log .headline{background-color:var(--bg-tertiary)!important;color:var(--text-primary)!important}#time_log .week,#time_log .day{color:var(--text-primary)!important}#time_log .hours_orange{color:var(--btn-primary)!important}.modal{background-color:var(--bg-panel)!important;color:var(--text-primary)!important}.modal-header,.modal-body,.modal-footer{background-color:var(--bg-panel)!important;color:var(--text-primary)!important;border-color:var(--border-light)!important}#timelog_page_wrapper a{color:var(--btn-primary)!important}#timelog_page_wrapper a:hover{color:var(--text-primary)!important}.dropdown-menu{background-color:var(--bg-secondary)!important;border-color:var(--border-dark)!important}.dropdown-menu li>a{color:var(--text-primary)!important}.dropdown-menu li>a:hover{background-color:var(--bg-hover)!important}#preview-tabs,.nav-tabs{background-color:var(--bg-secondary)!important;border-bottom:1px solid var(--border-light)!important}#preview-tabs a,.nav-tabs a{color:var(--text-primary)!important;background-color:transparent!important;border-color:transparent!important}#preview-tabs a.active,#preview-tabs a:hover,.nav-tabs li.active a,.nav-tabs a:hover{background-color:var(--bg-panel)!important;border-color:var(--border-light) var(--border-light) transparent!important;color:var(--text-primary)!important}.label,.badge{text-shadow:none!important}.well{background-color:var(--bg-panel)!important;border-color:var(--border-light)!important}.alert{background-color:var(--bg-tertiary)!important;color:var(--text-primary)!important;border-color:var(--border-light)!important;text-shadow:none!important}.pagination a{background-color:var(--bg-secondary)!important;color:var(--text-primary)!important;border-color:var(--border-medium)!important}.pagination a:hover,.pagination .active a{background-color:var(--bg-hover)!important}.popover,.tooltip-inner{background-color:var(--bg-panel)!important;color:var(--text-primary)!important;border-color:var(--border-dark)!important}[class^=icon-],[class*=" icon-"]{opacity:.9}#content{margin-top:5px;width:100%;padding:0}#timelog-page{display:flex;flex-wrap:wrap;align-items:flex-start}#timelog-page #favorites-container{flex:1 1 100%;width:auto!important}#timelog-page #editor-preview-wrapper{flex:1 1 100%;display:flex;flex-wrap:nowrap;gap:10px;margin:10px 10px 0;min-width:0}#timelog-page #time_entry_container{flex:1 1 0;min-width:0}#timelog-page #time_entry_container .description{display:flex}#timelog-page #time_entry_container #batch-textarea{flex:1 1 auto}#timelog-page #preview-container{flex:1 1 0;min-width:0;position:relative}#timelog-page #preview-container h3{padding:0 10px;position:sticky;top:0;background:var(--preview-sticky-bg);z-index:1;margin-bottom:0;font-variant:small-caps}#timelog-page #preview-container h3:first-child{margin-top:0}#timelog-page #preview-container th{white-space:nowrap}#timelog-page #preview-container td,#timelog-page #preview-container th{background-color:var(--table-bg);color:var(--text-primary)}#timelog-page #preview-container td a,#timelog-page #preview-container th a{font-weight:700}#timelog-page #preview-container .sum-row{border-top:10px solid var(--table-separator)}#timelog-page #preview-container .sum-row td,#timelog-page #preview-container .sum-row th{background-color:var(--table-sum-bg);color:var(--table-sum-text)}#timelog-page #preview-container .is-automatic-label td:first-child{position:relative;background:var(--redmine-auto-label)!important}#timelog-page #preview-container .is-automatic-label td:first-child:before{content:"\u{1F48E}";filter:hue-rotate(130deg);display:inline-block;position:absolute;left:-1px;top:4px;font-size:13px}#timelog-page #preview-container tr td:first-child,#timelog-page #preview-container th{max-width:100px;overflow:hidden}#timelog-page #preview-container td,#timelog-page #preview-container th{font-size:15px;font-family:monospace;text-align:left;padding:4px}#timelog-page #preview-container .redmine-reload-btn{margin-left:4px;padding:0 4px;font-size:11px;line-height:1;vertical-align:middle;min-width:auto}#timelog-page #preview-container .redmine-reload-btn.loading{opacity:.6;cursor:wait}#timelog-page #preview-container td:nth-child(3){white-space:nowrap}#timelog-page #preview-container td:first-child{padding-left:15px;white-space:nowrap}#timelog-page #preview-container table{margin-bottom:10px}#batch-textarea{border:1px solid var(--border-medium);border-radius:3px;width:892px;font-family:"monospace";transition:height .5s;background-color:var(--bg-primary);color:var(--text-primary)}#status{display:inline-block;text-align:right;font-size:16px;overflow:hidden;height:32px;line-height:32px;vertical-align:middle;margin-right:20px}#status.error{color:#8b0000;text-transform:uppercase}#time_entry_hours,#time_entry_submit,#time_entry_date,#time_entry_description,#time_entry_issue_number{display:none}#add-fav-button{vertical-align:middle;margin-bottom:10px;margin-left:10px}.i{font-size:16px}.enhanced-container{margin:0 auto 20px;padding:20px 0 2px 55px;background-color:var(--bg-panel);border:1px solid var(--border-light);border-radius:5px}#arpy-enhance-container{width:100%;display:flex}#time_entry_container,#favorites-container,#preview-container{flex:0 1 auto;margin:10px;border-radius:5px}#time_entry_container,#favorites-container,#preview-container{padding:0!important;display:flex;flex-direction:column}#editor-preview-wrapper>#time_entry_container,#editor-preview-wrapper>#preview-container{height:100%;margin:0!important}.panel-header{display:flex;align-items:center;justify-content:space-between;padding:4px 10px;background:linear-gradient(to bottom,var(--panel-header-start),var(--panel-header-end));border-bottom:1px solid var(--panel-header-border);border-radius:5px 5px 0 0;min-height:28px;flex-shrink:0}.panel-content{flex:1;overflow:auto;padding:10px;min-height:0;min-width:0}#favorites-container .panel-content{padding:10px}#time_entry_container .panel-content{display:flex;flex-direction:column;overflow:hidden}#time_entry_container form,#time_entry_container .description{flex:1;min-height:0;min-width:0;display:flex;flex-direction:column}#monaco-editor-container{min-height:0;height:100%;width:100%;max-width:100%;overflow:hidden;border:1px solid var(--border-medium)}.date-decoration{color:var(--text-secondary)!important;font-weight:700;opacity:1;font-family:monospace;font-size:.9em}[data-theme=light] .date-decoration.okay{color:#20834f!important;opacity:.8}[data-theme=dark] .date-decoration.okay{color:#4ade80!important;opacity:.8}.missing-entry-error{color:var(--preview-missing-text)!important}.panel-header-title{font-weight:600;font-size:13px;color:var(--panel-header-text);margin:0;padding:0;line-height:20px;text-transform:uppercase;letter-spacing:.5px}.panel-header-actions{display:flex;align-items:center;gap:8px}.panel-header-actions .btn{height:24px;line-height:1.2;padding:2px 6px;font-size:13px}#favorites-container .panel-content::-webkit-scrollbar,#preview-container .panel-content::-webkit-scrollbar{width:12px;background-color:var(--bg-secondary)}#favorites-container .panel-content::-webkit-scrollbar-thumb,#preview-container .panel-content::-webkit-scrollbar-thumb{background-color:var(--border-dark);border-radius:6px}#favorites-container .panel-content::-webkit-scrollbar-thumb:hover,#preview-container .panel-content::-webkit-scrollbar-thumb:hover{background-color:var(--border-darker)}#time_entry_container .lastrow{width:initial!important;margin-top:10px;white-space:nowrap}#favorites-container{max-height:20vh;position:relative}#favorites-container.maximalized{height:auto!important;max-height:none!important}#favorites-list{margin:0;list-style:none;color:var(--text-primary)}#favorites-list li{padding:2px;display:flex;align-items:center;column-gap:4px;color:var(--text-primary)}#favorites-list li .label{padding-top:3px;background:var(--fav-label-0);text-shadow:1px 1px 1px var(--text-shadow);color:#fff}#favorites-list li input{width:80px}#favorites-list li .label+.label{background:var(--fav-label-1)}#favorites-list li .label+.label+.label{background:var(--fav-label-2)}#favorites-list li .label+.label+.label+.label{background:var(--fav-label-3)}#favorites-list li input{padding:0 5px!important;border:1px solid transparent;background:transparent;margin-right:4px}#favorites-list li input:hover,#favorites-list li input:focus{border:1px solid var(--border-darker);background:var(--bg-primary)}#favorites-list button,#favorites-list .btn-mini{min-width:20px;font-size:11px;padding:1px 5px;vertical-align:top;margin-right:5px}#favorites-list li .label-important{margin-right:5px;background-color:var(--status-error);cursor:help}#open-help-dialog{margin-right:10px}#helpModal{top:10%;margin-left:-500px;margin-top:0;width:1000px}#helpModal .modal-body{max-height:80vh}#settingsModal{top:10%;margin-left:-350px;margin-top:0;width:700px}#settingsModal .modal-body{max-height:80vh;overflow-y:auto}#settingsModal .control-group{margin-bottom:20px}#settingsModal .help-block{font-size:11px;color:var(--text-secondary);margin-top:5px}#settingsModal input[type=text],#settingsModal input[type=number]{background-color:var(--input-bg);color:var(--text-primary);border-color:var(--border-medium)}#settingsModal .radio.inline,#settingsModal .checkbox{color:var(--text-primary)}.nav.arpy-enhance-nav{margin-left:30px!important;padding:0 15px 0 7px;border-radius:4px;background:linear-gradient(135deg,#00cc9f,#0088b2);box-shadow:0 2px 4px #0003;display:flex;align-items:center}.nav.arpy-enhance-nav .arpy-enhance-brand{padding:0 12px 0 0;display:flex;align-items:center;gap:8px;height:100%;border-right:1px solid rgba(255,255,255,.3)}.nav.arpy-enhance-nav .arpy-enhance-brand .brand-logo{height:36px;width:auto;display:block}.nav.arpy-enhance-nav .arpy-enhance-brand .brand-text{font-weight:700;font-size:16px;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,.3);letter-spacing:.5px;line-height:1}.nav.arpy-enhance-nav li{border-right:none;display:flex;align-items:center}.nav.arpy-enhance-nav .arpy-enhance-settings-btn,.nav.arpy-enhance-nav .arpy-enhance-theme-btn{display:flex;align-items:center;gap:6px;padding:10px 14px!important;color:#fff!important;text-shadow:0 1px 2px rgba(0,0,0,.3);font-weight:700;transition:background-color .2s ease}.nav.arpy-enhance-nav .arpy-enhance-settings-btn:hover,.nav.arpy-enhance-nav .arpy-enhance-settings-btn:focus,.nav.arpy-enhance-nav .arpy-enhance-theme-btn:hover,.nav.arpy-enhance-nav .arpy-enhance-theme-btn:focus{background-color:#ffffff26!important;color:#fff!important}.nav.arpy-enhance-nav .arpy-enhance-settings-btn .settings-icon,.nav.arpy-enhance-nav .arpy-enhance-settings-btn .theme-icon,.nav.arpy-enhance-nav .arpy-enhance-theme-btn .settings-icon,.nav.arpy-enhance-nav .arpy-enhance-theme-btn .theme-icon{font-size:20px;line-height:1}.nav.arpy-enhance-nav .arpy-enhance-settings-btn span:not(.theme-icon):not(.settings-icon),.nav.arpy-enhance-nav .arpy-enhance-theme-btn span:not(.theme-icon):not(.settings-icon){font-size:13px}[data-theme=dark] .arpy-enhance-nav{background:linear-gradient(135deg,#00a37f,#006a92);box-shadow:0 2px 4px #0006}#helpModal .modal-body pre{font-size:14px}.preview-visualisation-th{position:relative}.preview-visualisation-th:before{content:"";position:absolute;left:calc((var(--target-hours) / var(--max-hours)) * 100%);top:0;bottom:0;width:2px;background-color:#0006;z-index:10;pointer-events:none}.preview-visualisation-th .progress{margin:0;height:16px;position:relative;background:transparent;overflow:hidden;display:flex}.preview-visualisation-th .progress .bar{height:100%;font-size:10px;color:#eee;text-align:left;line-height:16px;border-radius:4px;box-shadow:inset -2px 0 #ffffff4d,inset 2px 0 #0000004d;border-right:2px solid rgba(0,0,0,.5);flex-shrink:0}.preview-visualisation-th .progress .bar.bar-has-overlay{position:relative}.preview-visualisation-th .progress .bar .bar-overlay{position:absolute;top:0;left:0;right:0;bottom:0;pointer-events:none;border-radius:4px}.preview-visualisation-th .progress .bar:last-child{border-right:none;box-shadow:inset 2px 0 #0000004d}.preview-visualisation-th .progress .bar span{padding-left:4px;font-weight:700;position:relative;z-index:1}.preview-visualisation-th .progress.progress-success{filter:hue-rotate(35deg)}#time_entry_container{display:flex;flex-direction:column}#time_entry_container form{margin-bottom:0;display:flex;flex-direction:column;flex:1 1 auto}#time_entry_container form .description{flex:1 1 100%}#time_entry_container form>br{display:none}#time_entry_container>form,#time_entry_container .description{min-height:0}.quick-filter-container{display:flex;align-items:center;gap:6px}.quick-filter-container input{padding:2px 5px;border-radius:3px;border:1px solid var(--btn-disabled);font-size:12px;height:22px;background-color:var(--bg-primary);color:var(--text-primary)}#fav-sort-controls .btn.active{background-color:var(--btn-primary);color:var(--text-inverse);text-shadow:none}#fav-sort-controls .btn.active.sort-asc:after{content:" \u25B2"}#fav-sort-controls .btn.active.sort-desc:after{content:" \u25BC"}ul.preview-tabs{margin-left:-20px;margin-right:-10px;background-color:var(--bg-secondary)!important;border-bottom:1px solid var(--border-light)!important}ul.preview-tabs li:first-child{margin-left:20px}ul.preview-tabs li{cursor:pointer}ul.preview-tabs li a{color:var(--text-primary)!important;background-color:transparent!important}ul.preview-tabs li.active a{background-color:var(--bg-panel)!important;border-color:var(--border-light)!important;border-bottom-color:transparent!important}.statistics{display:flex;justify-content:space-around;font-family:monospace;font-weight:700;color:var(--text-primary)}.okay th{background:var(--preview-okay-bg)!important;color:var(--preview-okay-text)!important}.okay th:first-child:before{content:""}.okay td{background:var(--preview-okay-td-bg)!important;color:var(--text-primary)!important}.okay a{color:var(--btn-primary)!important;font-weight:700}#minimal-vertical-resizer{position:absolute;bottom:-14px;left:0;width:100%;height:4px;background-color:transparent;border-top:1px solid transparent;border-bottom:1px solid transparent;cursor:ns-resize;z-index:99;transition:background-color .2s ease;display:flex;justify-content:center;justify-items:center;align-items:center}#minimal-vertical-resizer:before{content:"";width:20%;height:0;border-top:4px solid var(--resizer-default)}#minimal-vertical-resizer:hover:before{border-top:4px solid var(--resizer-hover)}#favorites-container.maximalized #minimal-vertical-resizer{display:none}#favorites-container.maximalized+#editor-preview-wrapper{height:85vh!important}.monaco-editor .suggest-widget .monaco-list-row .label-name{flex:0 0 auto;min-width:0;margin-right:6px;white-space:nowrap}.monaco-editor .suggest-widget .monaco-list-row .label-description{flex:1 1 auto;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#timelog-page{position:relative}#timelog-page #favorites-container{order:1}#timelog-page #editor-preview-wrapper{order:2}#timelog-page #month_selector{order:3}#timelog-page #time_log{order:4}#time_entry_container,#preview-container{position:relative}.panel-swap-button{padding:2px 6px;font-size:14px;line-height:1}#timelog-page.panels-swapped #editor-preview-wrapper #time_entry_container{order:2}#timelog-page.panels-swapped #editor-preview-wrapper #preview-container{order:1} ');

(function () {
  'use strict';

  const MONACO_CSS_URL = "https://cdn.jsdelivr.net/npm/monaco-editor@0.49.0/min/vs/editor/editor.main.css";
  const ORIGINAL_BOTTOM_OFFSET_PX = 90;
  const DEFAULT_SETTINGS = {
    redmineApiKey: "",
    redmineCacheTtlHours: 24,
    theme: "light",
    favsMaximized: false,
    panelsSwapped: false,
    showProgressIndicator: true,
    showEditorHourIndicator: true,
    targetWorkHours: 8,
    maxDisplayHours: 12
  };
  const SETTINGS_STORAGE_KEY = "arpyEnhanceSettings";
  function getStorageItem(key) {
    return unsafeWindow.localStorage.getItem(key);
  }
  function setStorageItem(key, value) {
    unsafeWindow.localStorage.setItem(key, value);
  }
  function getStorageJSON(key, defaultValue = null) {
    try {
      const item = getStorageItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error(`Failed to parse JSON from localStorage key: ${key}`, e);
      return defaultValue;
    }
  }
  function setStorageJSON(key, value) {
    try {
      setStorageItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Failed to stringify JSON for localStorage key: ${key}`, e);
    }
  }
  class SettingsManager {
    constructor() {
      this.settings = { ...DEFAULT_SETTINGS };
      this.listeners = [];
    }
    /**
     * Load settings from localStorage
     */
    load() {
      const stored = getStorageJSON(SETTINGS_STORAGE_KEY);
      if (stored) {
        this.settings = { ...DEFAULT_SETTINGS, ...stored };
      }
      this.migrateOldSettings();
    }
    /**
     * Migrate old localStorage keys to new settings system
     */
    migrateOldSettings() {
      if (unsafeWindow.localStorage.REDMINE_API_KEY && !this.settings.redmineApiKey) {
        this.settings.redmineApiKey = unsafeWindow.localStorage.REDMINE_API_KEY;
      }
      const oldTheme = getStorageItem("arpyEnhanceTheme");
      if (oldTheme && this.settings.theme === DEFAULT_SETTINGS.theme) {
        this.settings.theme = oldTheme;
      }
      if (getStorageItem("arpyEnhanceFavsMaxed") === "true") {
        this.settings.favsMaximized = true;
      }
      if (getStorageItem("arpyEnhancePanelsSwapped") === "true") {
        this.settings.panelsSwapped = true;
      }
    }
    /**
     * Save settings to localStorage
     */
    save() {
      setStorageJSON(SETTINGS_STORAGE_KEY, this.settings);
      unsafeWindow.localStorage.REDMINE_API_KEY = this.settings.redmineApiKey;
      this.notifyListeners();
    }
    /**
     * Get a setting value
     */
    get(key) {
      return this.settings[key];
    }
    /**
     * Set a setting value
     */
    set(key, value) {
      this.settings[key] = value;
    }
    /**
     * Update multiple settings at once
     */
    update(newSettings) {
      this.settings = { ...this.settings, ...newSettings };
    }
    /**
     * Get all settings
     */
    getAll() {
      return { ...this.settings };
    }
    /**
     * Add a listener for settings changes
     */
    addListener(callback) {
      this.listeners.push(callback);
    }
    /**
     * Remove a listener
     */
    removeListener(callback) {
      this.listeners = this.listeners.filter((l) => l !== callback);
    }
    /**
     * Notify all listeners of settings change
     */
    notifyListeners() {
      this.listeners.forEach((callback) => callback(this.settings));
    }
    /**
     * Get computed values
     */
    getRedmineCacheTtlMs() {
      return this.settings.redmineCacheTtlHours * 60 * 60 * 1e3;
    }
  }
  const settingsManager = new SettingsManager();
  let currentTheme = settingsManager.get("theme");
  let monacoEditorInstance$4 = null;
  function setMonacoEditorInstance(instance) {
    monacoEditorInstance$4 = instance;
  }
  function applyTheme$1(theme) {
    currentTheme = theme;
    settingsManager.set("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    settingsManager.save();
    if (monacoEditorInstance$4 && typeof monaco !== "undefined") {
      const monacoTheme = theme === "dark" ? "arpy-dark" : "arpy-light-vibrant";
      monaco.editor.setTheme(monacoTheme);
    }
  }
  function toggleTheme$1() {
    const newTheme = currentTheme === "light" ? "dark" : "light";
    applyTheme$1(newTheme);
    return newTheme;
  }
  function getCurrentTheme$1() {
    return currentTheme;
  }
  function initTheme() {
    applyTheme$1(currentTheme);
  }
  const REDMINE_CACHE_STORAGE_KEY = "arpyEnhanceRedmineCache";
  const redmineCache = {};
  function loadRedmineCacheFromStorage() {
    try {
      const stored = getStorageJSON(REDMINE_CACHE_STORAGE_KEY);
      if (stored) {
        const now = Date.now();
        const ttl = settingsManager.getRedmineCacheTtlMs();
        Object.entries(stored).forEach(([issueNumber, entry]) => {
          if (entry.timestamp && now - entry.timestamp <= ttl) {
            redmineCache[issueNumber] = entry;
          }
        });
      }
    } catch (e) {
      console.error("Failed to load Redmine cache from localStorage:", e);
    }
  }
  function saveRedmineCacheToStorage() {
    try {
      setStorageJSON(REDMINE_CACHE_STORAGE_KEY, redmineCache);
    } catch (e) {
      console.error("Failed to save Redmine cache to localStorage:", e);
    }
  }
  function isRedmineCacheExpired(issueNumber) {
    const cacheEntry = redmineCache[issueNumber];
    if (!cacheEntry || !cacheEntry.timestamp) {
      return true;
    }
    const now = Date.now();
    const ttl = settingsManager.getRedmineCacheTtlMs();
    return now - cacheEntry.timestamp > ttl;
  }
  async function fetchRedmineIssue(issueNumber, forceReload = false) {
    const REDMINE_API_KEY2 = settingsManager.get("redmineApiKey");
    if (!REDMINE_API_KEY2 || !(issueNumber == null ? void 0 : issueNumber.match(/^\d+$/))) {
      return null;
    }
    if (!forceReload && redmineCache[issueNumber] && !isRedmineCacheExpired(issueNumber)) {
      return redmineCache[issueNumber].data;
    }
    const response = await fetch(`https://redmine.dbx.hu/issues/${issueNumber}.json`, {
      headers: {
        "Content-Type": "application/json",
        "X-Redmine-API-Key": REDMINE_API_KEY2
      }
    });
    const data = await response.json();
    redmineCache[issueNumber] = {
      data,
      timestamp: Date.now()
    };
    saveRedmineCacheToStorage();
    return data;
  }
  async function reloadRedmineTicket$1(issueNumber, updatePreviewCallback) {
    if (!issueNumber) {
      return;
    }
    await fetchRedmineIssue(issueNumber, true);
    if (updatePreviewCallback) {
      await updatePreviewCallback();
    }
  }
  let favorites = [];
  let favoriteSortOrder = localStorage.getItem("arpyEnhanceFavoriteSortOrder") || "default";
  let favoriteSortReversed = localStorage.getItem("arpyEnhanceFavoriteSortReversed") === "true";
  let copyTextToClipboard$1 = null;
  let fetchAndCache$1 = null;
  let applyQuickFilter$1 = null;
  function initFavoritesManager(deps) {
    copyTextToClipboard$1 = deps.copyTextToClipboard;
    fetchAndCache$1 = deps.fetchAndCache;
    applyQuickFilter$1 = deps.applyQuickFilter;
  }
  function loadFavorites() {
    const stored = getStorageJSON("favorites");
    if (stored) {
      favorites.length = 0;
      favorites.push(...stored);
    }
    return favorites;
  }
  function saveFavorites() {
    setStorageJSON("favorites", favorites);
  }
  function getFullLabelPartsForFav(fav) {
    var _a, _b, _c;
    const projectDropdown = document.getElementById("project_id");
    const projectOption = projectDropdown.querySelector(`option[value="${fav.project_id.value}"]`);
    const categoryLabel = projectOption ? projectOption.parentElement.getAttribute("label") : "?";
    return [
      categoryLabel,
      (_a = fav.project_id) == null ? void 0 : _a.label,
      ((_b = fav.todo_list_id) == null ? void 0 : _b.label) || "-",
      ((_c = fav.todo_item_id) == null ? void 0 : _c.label) || "-"
    ];
  }
  function addNewFavorite() {
    const formData = $('form[action="/timelog"]').serializeArray();
    const fav = {
      label: "",
      id: `${(/* @__PURE__ */ new Date()).getTime()}${Math.round(Math.random() * 1e3)}`
    };
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
    favorites.push(fav);
    saveFavorites();
    displayFavoriteElement(fav);
  }
  function updateFav(id, label) {
    const fav = favorites.find((f) => f.id === id);
    fav.label = label ? label : "";
    saveFavorites();
  }
  async function checkFavoritesValidity() {
    console.log("Starting full validation of favorites...");
    const projectOptions = new Map(
      Array.from(document.querySelectorAll("#project_id option")).map((opt) => [opt.value, opt])
    );
    const validationPromises = favorites.map(async (fav) => {
      var _a, _b, _c;
      fav.isInvalid = false;
      if (!((_a = fav.project_id) == null ? void 0 : _a.value) || !projectOptions.has(fav.project_id.value)) {
        fav.isInvalid = true;
        return;
      }
      if (!((_b = fav.todo_list_id) == null ? void 0 : _b.value)) {
        return;
      }
      const todoLists = await fetchAndCache$1(
        `/get_todo_lists?project_id=${fav.project_id.value}&show_completed=false`,
        `projectId-${fav.project_id.value}`
      );
      const todoListExists = todoLists.some((list) => list.id == fav.todo_list_id.value);
      if (!todoListExists) {
        fav.isInvalid = true;
        return;
      }
      if (!((_c = fav.todo_item_id) == null ? void 0 : _c.value)) {
        return;
      }
      const todoItems = await fetchAndCache$1(
        `/get_todo_items?todo_list_id=${fav.todo_list_id.value}&show_completed=false`,
        `todoListId-${fav.todo_list_id.value}`
      );
      const todoItemExists = todoItems.some((item) => item.id == fav.todo_item_id.value);
      if (!todoItemExists) {
        fav.isInvalid = true;
      }
    });
    await Promise.all(validationPromises);
    console.log("Favorite validation complete.");
  }
  function remove(array, element) {
    return array.filter((e) => e !== element);
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
    copyButton.button().on("click", () => copyTextToClipboard$1(labelParts.join(" / ")));
    const removeButton = $('<button title="Törlés" class="btn btn-mini delete" type="button">&#10006;</button>');
    removeButton.button().on("click", function() {
      if (window.confirm(`Biztosan törölni akarod ezt az elemet?
${labelParts.join(" / ")}`)) {
        removeFav(fav.id);
      }
    });
    newLi.append(copyButton);
    newLi.append(removeButton);
    $("#favorites-list").append(newLi);
  }
  function setupFavoriteSorting() {
    const sortControls = document.getElementById("fav-sort-controls");
    sortControls.addEventListener("click", (e) => {
      const button = e.target.closest("button");
      if (!button) {
        return;
      }
      const newSortOrder = button.dataset.sort;
      if (newSortOrder === favoriteSortOrder) {
        favoriteSortReversed = !favoriteSortReversed;
        localStorage.setItem("arpyEnhanceFavoriteSortReversed", favoriteSortReversed);
      } else {
        favoriteSortOrder = newSortOrder;
        favoriteSortReversed = false;
        localStorage.setItem("arpyEnhanceFavoriteSortOrder", newSortOrder);
        localStorage.setItem("arpyEnhanceFavoriteSortReversed", "false");
      }
      renderFavs();
      if (applyQuickFilter$1) {
        applyQuickFilter$1();
      }
    });
  }
  function renderFavs() {
    $("#favorites-list").empty();
    const favoritesToRender = [...favorites];
    if (favoriteSortOrder === "label") {
      favoritesToRender.sort((a, b) => (a.label || "").localeCompare(b.label || "", "hu"));
    } else if (favoriteSortOrder === "category") {
      favoritesToRender.sort((a, b) => {
        const fullLabelA = getFullLabelPartsForFav(a).join(" / ");
        const fullLabelB = getFullLabelPartsForFav(b).join(" / ");
        return fullLabelA.localeCompare(fullLabelB, "hu");
      });
    }
    if (favoriteSortReversed) {
      favoritesToRender.reverse();
    }
    favoritesToRender.forEach(displayFavoriteElement);
    $("#fav-sort-controls .btn").removeClass("active btn-primary sort-asc sort-desc");
    const activeButton = $(`#fav-sort-controls .btn[data-sort="${favoriteSortOrder}"]`);
    activeButton.addClass("active btn-primary");
    activeButton.addClass(favoriteSortReversed ? "sort-desc" : "sort-asc");
  }
  function removeFav(id) {
    const fav = favorites.find((f) => f.id === id);
    const remaining = remove(favorites, fav);
    favorites.length = 0;
    favorites.push(...remaining);
    saveFavorites();
    renderFavs();
    if (applyQuickFilter$1) {
      applyQuickFilter$1();
    }
  }
  function updateClearButtonVisibility() {
    const invalidCount = favorites.filter((fav) => fav.isInvalid).length;
    const clearButton = $("#clear-invalid-favs-button");
    if (invalidCount > 0) {
      clearButton.text(`✖ [${invalidCount}]`).show();
    } else {
      clearButton.hide();
    }
  }
  function setupClearInvalidButton() {
    $("#clear-invalid-favs-button").on("click", () => {
      const invalidFavs = favorites.filter((fav) => fav.isInvalid);
      if (invalidFavs.length === 0) {
        return;
      }
      if (window.confirm(`Biztosan törölni akarod a(z) ${invalidFavs.length} lejárt kedvencet?`)) {
        const validFavs = favorites.filter((fav) => !fav.isInvalid);
        favorites.length = 0;
        favorites.push(...validFavs);
        saveFavorites();
        renderFavs();
        updateClearButtonVisibility();
        if (applyQuickFilter$1) {
          applyQuickFilter$1();
        }
      }
    });
  }
  let getCurrentTheme = null;
  let toggleTheme = null;
  let showSettingsModal$1 = null;
  function initNavbarModule(deps) {
    getCurrentTheme = deps.getCurrentTheme;
    toggleTheme = deps.toggleTheme;
    showSettingsModal$1 = deps.showSettingsModal;
  }
  function injectNavbar() {
    const navbarInner = document.querySelector(".navbar-inner .container");
    const mainNav = document.querySelector(".navbar .nav:not(.pull-right)");
    if (!navbarInner || !mainNav) {
      return;
    }
    const currentTheme2 = getCurrentTheme();
    const arpyEnhanceNav = document.createElement("ul");
    arpyEnhanceNav.className = "nav arpy-enhance-nav";
    arpyEnhanceNav.innerHTML = `
    <li class="arpy-enhance-brand">
      <img src="https://i.imgur.com/SqmJMvz.png" alt="ArpyEnhance" class="brand-logo">
      <span class="brand-text">ArpyEnhance</span>
    </li>
    <li>
      <a href="#" id="settings-button" class="arpy-enhance-settings-btn">
        <span class="settings-icon">⚙</span>
        <span>Beállítások</span>
      </a>
    </li>
    <li>
      <a href="#" id="theme-toggle-nav-button" class="arpy-enhance-theme-btn">
        <span class="theme-icon">${currentTheme2 === "dark" ? "☾" : "☀"}</span>
        <span>Téma</span>
      </a>
    </li>
  `;
    mainNav.parentNode.insertBefore(arpyEnhanceNav, mainNav.nextSibling);
    document.getElementById("settings-button").addEventListener("click", (e) => {
      e.preventDefault();
      if (showSettingsModal$1) {
        showSettingsModal$1();
      }
    });
    document.getElementById("theme-toggle-nav-button").addEventListener("click", (e) => {
      e.preventDefault();
      if (toggleTheme) {
        toggleTheme();
      }
      const themeIcon = document.querySelector("#theme-toggle-nav-button .theme-icon");
      if (themeIcon) {
        const newTheme = getCurrentTheme();
        themeIcon.textContent = newTheme === "dark" ? "☾" : "☀";
      }
    });
  }
  let applyTheme = null;
  let updatePreview$2 = null;
  let updateMonacoLayout$1 = null;
  function initSettingsModalModule(deps) {
    applyTheme = deps.applyTheme;
    updatePreview$2 = deps.updatePreview;
    updateMonacoLayout$1 = deps.updateMonacoLayout;
  }
  function createSettingsModal() {
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
    document.getElementById("save-settings-button").addEventListener("click", saveSettingsFromModal);
  }
  function loadSettingsToModal() {
    const settings = settingsManager.getSettings();
    document.getElementById("setting-redmine-api-key").value = settings.redmineApiKey || "";
    document.getElementById("setting-cache-ttl").value = settings.redmineCacheTtlHours;
    document.getElementById(`setting-theme-${settings.theme}`).checked = true;
    document.getElementById("setting-target-hours").value = settings.targetWorkHours;
    document.getElementById("setting-max-hours").value = settings.maxDisplayHours;
    document.getElementById("setting-show-progress").checked = settings.showProgressIndicator;
    document.getElementById("setting-show-editor-hours").checked = settings.showEditorHourIndicator;
    document.getElementById("setting-favs-maximized").checked = settings.favsMaximized;
    document.getElementById("setting-panels-swapped").checked = settings.panelsSwapped;
  }
  function saveSettingsFromModal() {
    const settings = settingsManager.getSettings();
    const oldTheme = settings.theme;
    const oldTargetHours = settings.targetWorkHours;
    const oldMaxHours = settings.maxDisplayHours;
    const oldShowEditorHours = settings.showEditorHourIndicator;
    const oldFavsMaximized = settings.favsMaximized;
    const oldPanelsSwapped = settings.panelsSwapped;
    settings.redmineApiKey = document.getElementById("setting-redmine-api-key").value;
    settings.redmineCacheTtlHours = parseInt(document.getElementById("setting-cache-ttl").value);
    settings.theme = document.querySelector('input[name="setting-theme"]:checked').value;
    settings.targetWorkHours = parseFloat(document.getElementById("setting-target-hours").value);
    settings.maxDisplayHours = parseFloat(document.getElementById("setting-max-hours").value);
    settings.showProgressIndicator = document.getElementById("setting-show-progress").checked;
    settings.showEditorHourIndicator = document.getElementById("setting-show-editor-hours").checked;
    settings.favsMaximized = document.getElementById("setting-favs-maximized").checked;
    settings.panelsSwapped = document.getElementById("setting-panels-swapped").checked;
    settingsManager.saveSettings();
    if (oldTheme !== settings.theme && applyTheme) {
      applyTheme(settings.theme);
    }
    document.documentElement.style.setProperty("--target-hours", settings.targetWorkHours);
    document.documentElement.style.setProperty("--max-hours", settings.maxDisplayHours);
    if ((oldTargetHours !== settings.targetWorkHours || oldMaxHours !== settings.maxDisplayHours || oldShowEditorHours !== settings.showEditorHourIndicator) && updatePreview$2) {
      updatePreview$2();
    }
    if (oldFavsMaximized !== settings.favsMaximized) {
      const favoritesPanel = document.querySelector("#favorites-container");
      const wrapper = document.querySelector("#editor-preview-wrapper");
      const maximizeButton = document.querySelector("#maximize-button");
      if (settings.favsMaximized) {
        favoritesPanel.classList.add("maximalized");
        maximizeButton.innerHTML = "◱";
        wrapper.style.height = "85vh";
        favoritesPanel.style.height = "";
        favoritesPanel.style.maxHeight = "";
        localStorage.setItem("arpyEnhanceFavsMaxed", "true");
      } else {
        favoritesPanel.classList.remove("maximalized");
        maximizeButton.innerHTML = "⬍";
        const savedVh = parseFloat(localStorage.getItem("arpyEnhanceTopPanelVh") || "20");
        const bottomVh = 100 - savedVh;
        favoritesPanel.style.height = `${savedVh}vh`;
        favoritesPanel.style.maxHeight = `${savedVh}vh`;
        wrapper.style.height = `calc(${bottomVh}vh - ${ORIGINAL_BOTTOM_OFFSET_PX}px)`;
        localStorage.removeItem("arpyEnhanceFavsMaxed");
      }
      if (updateMonacoLayout$1) {
        setTimeout(updateMonacoLayout$1, 50);
      }
    }
    if (oldPanelsSwapped !== settings.panelsSwapped) {
      const timelogPage = document.querySelector("#timelog-page");
      if (settings.panelsSwapped) {
        timelogPage.classList.add("panels-swapped");
        localStorage.setItem("arpyEnhancePanelsSwapped", "true");
      } else {
        timelogPage.classList.remove("panels-swapped");
        localStorage.removeItem("arpyEnhancePanelsSwapped");
      }
    }
    $("#settingsModal").modal("hide");
  }
  function showSettingsModal() {
    $("#settingsModal").modal("show");
    loadSettingsToModal();
  }
  let monacoEditorInstance$3 = null;
  function setMonacoInstance(instance) {
    monacoEditorInstance$3 = instance;
  }
  function updateMonacoLayout() {
    if (monacoEditorInstance$3) {
      const editorContainer = document.getElementById("monaco-editor-container");
      if (editorContainer) {
        const rect = editorContainer.getBoundingClientRect();
        monacoEditorInstance$3.layout({ width: rect.width, height: rect.height });
      }
    }
  }
  let monacoEditorInstance$2 = null;
  let updatePreview$1 = null;
  function initMonacoEditorModule(deps) {
    updatePreview$1 = deps.updatePreview;
  }
  function setupArpyLanguageAndTheme() {
    monaco.languages.register({ id: "arpy-log" });
    monaco.languages.setMonarchTokensProvider("arpy-log", {
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
                "@default": { token: "date.entry", next: "@expect_number" }
              }
            }
          ]
        ],
        expect_number: [
          // After the date/dash, we expect mandatory whitespace, then a number.
          [/\s+/, ""],
          // Consume whitespace, assign no token.
          [/(\d+([,.]\d+)?)/, { token: "number", next: "@expect_description" }],
          // If we don't find whitespace and a number, the rest of the line is invalid.
          [/.*$/, { token: "invalid", next: "@popall" }]
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
          ["", { token: "", next: "@description_rest" }]
        ],
        description_rest: [
          // Whatever is left on the line is the description text.
          [/.*$/, { token: "description", next: "@popall" }]
        ]
      }
    });
    monaco.editor.defineTheme("arpy-light-vibrant", {
      base: "vs",
      inherit: false,
      rules: [
        {
          token: "comment",
          foreground: "#6e6e6eff",
          background: "#000000ff",
          fontStyle: "italic"
        },
        // Vibrant Green
        { token: "date.label", foreground: "#008000", fontStyle: "bold" },
        // Bright Blue
        {
          token: "category.label",
          foreground: "#9400D3",
          fontStyle: "bold"
        },
        // Dark Violet
        { token: "date.entry", foreground: "#008000", fontStyle: "bold" },
        { token: "delimiter", foreground: "#008000", fontStyle: "bold" },
        { token: "number", foreground: "#008fe2ff", fontStyle: "bold" },
        { token: "ticket.number", foreground: "#ff3c00ff" },
        { token: "description", foreground: "#222222" },
        { token: "invalid", foreground: "#a93f3fff", fontStyle: "bold" }
      ].map((rule) => {
        if (rule.foreground) {
          rule.foreground = rule.foreground.replace(/^#/, "");
        }
        if (rule.background) {
          rule.background = rule.background.replace(/^#/, "");
        }
        return rule;
      }),
      colors: {
        "editor.background": "#FFFFFF",
        "editor.foreground": "#222222",
        "editor.wordHighlightBackground": "#e9e9e9ff",
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
        "scrollbarSlider.activeBackground": "#989898"
      }
    });
    monaco.editor.defineTheme("arpy-dark", {
      base: "vs-dark",
      inherit: false,
      rules: [
        {
          token: "comment",
          foreground: "#888888",
          fontStyle: "italic"
        },
        { token: "date.label", foreground: "#4ec9b0", fontStyle: "bold" },
        {
          token: "category.label",
          foreground: "#c586c0",
          fontStyle: "bold"
        },
        { token: "date.entry", foreground: "#4ec9b0", fontStyle: "bold" },
        { token: "delimiter", foreground: "#4ec9b0", fontStyle: "bold" },
        { token: "number", foreground: "#569cd6", fontStyle: "bold" },
        { token: "ticket.number", foreground: "#f48771" },
        { token: "description", foreground: "#cccccc" },
        { token: "invalid", foreground: "#f48771", fontStyle: "bold" }
      ].map((rule) => {
        if (rule.foreground) {
          rule.foreground = rule.foreground.replace(/^#/, "");
        }
        if (rule.background) {
          rule.background = rule.background.replace(/^#/, "");
        }
        return rule;
      }),
      colors: {
        "editor.background": "#1a1a1a",
        "editor.foreground": "#cccccc",
        "editor.wordHighlightBackground": "#2d2d2d",
        "editorGutter.background": "#1a1a1a",
        "editorCursor.foreground": "#ffffff",
        "editor.lineHighlightBackground": "#00000000",
        "editor.lineHighlightBorder": "#00000000",
        "editor.selectionBackground": "#264f78",
        "editorWidget.background": "#252525",
        "editorWidget.border": "#454545",
        "editorSuggestWidget.background": "#252525",
        "editorSuggestWidget.foreground": "#cccccc",
        "editorSuggestWidget.selectedBackground": "#1277baff",
        "editorSuggestWidget.selectedForeground": "#ffffff",
        "editorSuggestWidget.highlightForeground": "#199bf1ff",
        "list.focusHighlightForeground": "#ffffff",
        "editorHoverWidget.background": "#252525",
        "input.background": "#2a2a2a",
        "input.foreground": "#cccccc",
        "input.border": "#3c3c3c",
        "list.hoverBackground": "#2a2a2a",
        "list.activeSelectionBackground": "#094771",
        "scrollbarSlider.background": "#454545",
        "scrollbarSlider.hoverBackground": "#5a5a5a",
        "scrollbarSlider.activeBackground": "#6a6a6a"
      }
    });
  }
  function stretchSuggestWidgetContinuously(editor, opts = {}) {
    const dom = editor.getDomNode();
    if (!dom) {
      return;
    }
    const MIN_WIDTH = opts.minWidth || 200;
    const RIGHT_MARGIN = typeof opts.rightMargin === "number" ? opts.rightMargin : 4;
    let widgetObserver = null;
    function stretchWidget(widget) {
      if (!widget || widget.style.display === "none") {
        return;
      }
      const editorRect = dom.getBoundingClientRect();
      const widgetRect = widget.getBoundingClientRect();
      const minimap = dom.querySelector(".minimap");
      const minimapLeft = minimap ? minimap.getBoundingClientRect().left : editorRect.right;
      let available = Math.floor(Math.min(editorRect.right, minimapLeft) - widgetRect.left - RIGHT_MARGIN);
      if (available < MIN_WIDTH) {
        available = MIN_WIDTH;
      }
      widget.style.width = available + "px";
      widget.style.maxWidth = available + "px";
      const inner = widget.querySelector(".suggest-widget-container");
      if (inner) {
        inner.style.width = "100%";
        inner.style.maxWidth = "100%";
      }
    }
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (!(node instanceof HTMLElement)) {
            continue;
          }
          if (node.classList && node.classList.contains("suggest-widget")) {
            const widget = node;
            requestAnimationFrame(() => stretchWidget(widget));
            if (widgetObserver) {
              widgetObserver.disconnect();
            }
            widgetObserver = new MutationObserver(() => stretchWidget(widget));
            widgetObserver.observe(widget, { childList: true, subtree: true, attributes: true, attributeFilter: ["style"] });
            return;
          }
        }
      }
    });
    mo.observe(dom.ownerDocument.body, { childList: true, subtree: true });
    const disposables = [];
    const recomputeIfOpen = () => {
      const widget = dom.querySelector(".editor-widget.suggest-widget");
      if (widget) {
        stretchWidget(widget);
      }
    };
    disposables.push(editor.onDidLayoutChange(recomputeIfOpen));
    disposables.push(editor.onDidScrollChange(recomputeIfOpen));
    disposables.push(editor.onDidChangeCursorPosition(recomputeIfOpen));
    const resizeObserver = new ResizeObserver(recomputeIfOpen);
    resizeObserver.observe(dom);
    return {
      dispose() {
        mo.disconnect();
        if (widgetObserver) {
          widgetObserver.disconnect();
        }
        resizeObserver.disconnect();
        disposables.forEach((d) => d && d.dispose && d.dispose());
      }
    };
  }
  function initializeMonacoEditor() {
    const cssLink = document.createElement("link");
    cssLink.rel = "stylesheet";
    cssLink.href = MONACO_CSS_URL;
    document.head.appendChild(cssLink);
    const loaderScript = document.createElement("script");
    loaderScript.src = "https://cdn.jsdelivr.net/npm/monaco-editor@0.49.0/min/vs/loader.js";
    document.head.appendChild(loaderScript);
    loaderScript.onload = () => {
      unsafeWindow.require.config({
        paths: { "vs": "https://cdn.jsdelivr.net/npm/monaco-editor@0.49.0/min/vs" }
      });
      unsafeWindow.require(["vs/editor/editor.main"], () => {
        const originalTextarea = document.getElementById("batch-textarea");
        const editorContainer = document.createElement("div");
        editorContainer.id = "monaco-editor-container";
        editorContainer.style.flex = "1 1 0";
        originalTextarea.parentElement.insertBefore(editorContainer, originalTextarea);
        originalTextarea.style.display = "none";
        setupArpyLanguageAndTheme();
        const monacoTheme = getCurrentTheme$1() === "dark" ? "arpy-dark" : "arpy-light-vibrant";
        const editor = monaco.editor.create(editorContainer, {
          value: originalTextarea.value,
          language: "arpy-log",
          theme: monacoTheme,
          automaticLayout: false,
          wordWrap: "on",
          fontSize: 14,
          fontFamily: "monospace",
          wordBasedSuggestions: false,
          tabSize: 2,
          insertSpaces: true
        });
        stretchSuggestWidgetContinuously(editor, { minWidth: 240, rightMargin: 8 });
        monacoEditorInstance$2 = editor;
        setMonacoInstance(editor);
        setMonacoEditorInstance(editor);
        let resizeRAF;
        window.addEventListener("resize", () => {
          if (resizeRAF) {
            cancelAnimationFrame(resizeRAF);
          }
          resizeRAF = requestAnimationFrame(updateMonacoLayout);
        });
        monaco.languages.registerCompletionItemProvider("plaintext", {
          provideCompletionItems: () => {
            return { suggestions: [] };
          }
        });
        monaco.languages.registerCompletionItemProvider("arpy-log", {
          provideCompletionItems: function(model, position) {
            const wordInfo = model.getWordUntilPosition(position);
            const lineContent = model.getLineContent(position.lineNumber);
            const textBeforeWord = lineContent.substring(0, wordInfo.startColumn - 1);
            if (textBeforeWord.trim() !== "") {
              return {
                suggestions: []
              };
            }
            const suggestions = favorites.filter((fav) => fav.label && fav.label.trim() !== "").filter((fav) => {
              const needle = wordInfo.word.toLowerCase();
              const labelMatch = fav.label.toLowerCase().includes(needle);
              const descMatch = getFullLabelPartsForFav(fav).join(" / ").toLowerCase().includes(needle);
              return labelMatch || descMatch;
            }).map((fav) => {
              const range = {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: wordInfo.startColumn,
                endColumn: wordInfo.endColumn
              };
              const fullLabel = getFullLabelPartsForFav(fav).join(" / ");
              return {
                label: {
                  label: fav.label,
                  description: fullLabel
                },
                kind: monaco.languages.CompletionItemKind.Enum,
                insertText: fav.label,
                filterText: `${fav.label} ${fullLabel}`,
                documentation: fullLabel,
                range
              };
            });
            return { suggestions };
          }
        });
        editor.onDidChangeModelContent(() => {
          const currentValue = editor.getValue();
          originalTextarea.value = currentValue;
          unsafeWindow.localStorage.batchTextareaSavedValue = currentValue;
          if (unsafeWindow.inputTimeout) {
            clearTimeout(unsafeWindow.inputTimeout);
          }
          unsafeWindow.inputTimeout = setTimeout(() => {
            if (updatePreview$1) {
              updatePreview$1();
            }
          }, 500);
        });
        if (originalTextarea.value && updatePreview$1) {
          updatePreview$1();
        }
      });
    };
    loaderScript.onerror = () => {
      console.error("ArpyEnhance: Failed to load Monaco Editor's loader.js.");
    };
  }
  async function parseBatchData(textareaValue, favorites2, options = {}) {
    if (!textareaValue || !textareaValue.trim()) {
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
    };
    const parsedBatchData = (await Promise.all(textareaValue.match(/[^\r\n]+/g).map(async function(line, lineNumber) {
      var _a;
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine[0] === "#") {
        return;
      }
      const lineParts = trimmedLine.replace(/\s\s+/g, " ").split(" ");
      if (lineParts.length === 1) {
        const maybeDate = moment(lineParts[0], ["YYYY-MM-DD", "MM-DD"], true);
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
          const fav = favorites2.find((f) => f.label === labelFromLine);
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
      let currentLabel = localCurrentProjectData && localCurrentProjectData.label || "";
      console.log("initial current label", currentLabel);
      function parseDateStr(dateStr2) {
        const momentizedDate = moment(dateStr2, ["YYYY-MM-DD", "MM-DD"], true);
        if (!momentizedDate.isValid()) {
          errors.push(`${lineNumber + 1}. sor: hibás dátumformátum!`);
          return null;
        }
        return momentizedDate;
      }
      const dateStr = lineParts.shift();
      let parsedDate;
      if (dateStr === "-") {
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
      const formattedDate = parsedDate.format("YYYY-MM-DD");
      const hours = lineParts.shift();
      let issueNumber;
      function getIssueNumber(i) {
        if (!issueNumber && /(^#\d+$)|(^[A-Z0-9]+-\d+$)/.test(lineParts[i])) {
          issueNumber = lineParts[i].match(/#?(.+)/)[1];
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
      if (REDMINE_API_KEY && (issueNumber == null ? void 0 : issueNumber.match(/^\d+$/))) {
        updateAsyncProgress("issue", "start");
        const json = await fetchRedmineIssue(issueNumber);
        updateAsyncProgress("issue", "end");
        const arpyField = (_a = json.issue.custom_fields) == null ? void 0 : _a.find(({ name }) => name === "Arpy jelentés");
        rmProjectName = json.issue.project.name;
        if (arpyField == null ? void 0 : arpyField.value) {
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
            };
          } else {
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
                  };
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
      const description = lineParts.join(" ").replace(/^- /, "");
      const outputDataObject = Object.assign(
        {},
        genericFormData,
        {
          project_id: (externallyFetchedProjectData == null ? void 0 : externallyFetchedProjectData.project_id) || (localCurrentProjectData == null ? void 0 : localCurrentProjectData.project_id),
          todo_list_id: (externallyFetchedProjectData == null ? void 0 : externallyFetchedProjectData.todo_list_id) || (localCurrentProjectData == null ? void 0 : localCurrentProjectData.todo_list_id),
          todo_item_id: (externallyFetchedProjectData == null ? void 0 : externallyFetchedProjectData.todo_item_id) || (localCurrentProjectData == null ? void 0 : localCurrentProjectData.todo_item_id),
          "time_entry[date]": formattedDate,
          "time_entry[hours]": hours,
          "time_entry[description]": description
        }
      );
      if (issueNumber) {
        outputDataObject["time_entry[issue_number]"] = issueNumber;
      }
      if (!options.nometa) {
        outputDataObject.label = currentLabel;
        outputDataObject.isAutomaticLabel = !!externallyFetchedProjectData;
        outputDataObject.arpyField = externallyFetchedProjectData == null ? void 0 : externallyFetchedProjectData.arpyField;
        outputDataObject.rmProjectName = rmProjectName;
      }
      const parsedHours = Number.parseFloat(hours);
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
  let monacoEditorInstance$1 = null;
  let reloadRedmineTicket = null;
  let updateEditorDecorations = null;
  function initPreviewManager(deps) {
    monacoEditorInstance$1 = deps.monacoEditorInstance;
    reloadRedmineTicket = deps.reloadRedmineTicket;
    updateEditorDecorations = deps.updateEditorDecorations;
  }
  async function updatePreview() {
    const savedActiveTab = localStorage.getItem("arpyEnhanceActiveTab") || "dates";
    const previewContent = document.getElementById("preview-content");
    const prevScrollTop = previewContent.scrollTop;
    const editorValue = monacoEditorInstance$1 ? monacoEditorInstance$1.getValue() : document.getElementById("batch-textarea").value;
    const result = await parseBatchData(editorValue);
    if (result.summarizedData && updateEditorDecorations) {
      updateEditorDecorations(result.summarizedData);
    }
    previewContent.innerHTML = "";
    if (result.errors) {
      const list = document.createElement("ul");
      previewContent.appendChild(list);
      result.errors.forEach((error) => {
        const errorItem = document.createElement("li");
        errorItem.innerHTML = error;
        list.appendChild(errorItem);
      });
    }
    if (!result.summarizedData) {
      return;
    }
    const previewTabs = document.createElement("ul");
    previewTabs.classList.add("preview-tabs", "nav", "nav-tabs");
    previewContent.appendChild(previewTabs);
    ["dates", "labels"].forEach((sumType, i) => {
      const previewTab = document.createElement("li");
      const previewTabA = document.createElement("a");
      previewTabA.src = "#";
      previewTab.appendChild(previewTabA);
      const previewTabContentContainer = document.createElement("div");
      if (sumType === savedActiveTab) {
        previewTab.classList.add("active");
      } else {
        previewTabContentContainer.style.display = "none";
      }
      previewTabContentContainer.classList.add("preview-tab-content");
      const data = result.summarizedData[sumType];
      previewTabA.innerText = {
        dates: "Napi bontás",
        labels: "Projekt/kategória szerint"
      }[sumType];
      previewTab.addEventListener("click", () => {
        localStorage.setItem("arpyEnhanceActiveTab", sumType);
        document.querySelectorAll(".preview-tab-content").forEach(
          (element) => element.style.display = "none"
        );
        Array.from(previewTabs.querySelectorAll("li")).forEach((tab) => {
          tab.classList.remove("active");
        });
        previewTab.classList.add("active");
        previewTabContentContainer.style.display = "";
      });
      previewTabs.appendChild(previewTab);
      const stats = document.createElement("div");
      stats.classList.add("statistics");
      previewTabContentContainer.appendChild(stats);
      const table = document.createElement("table");
      previewTabContentContainer.appendChild(table);
      previewContent.appendChild(previewTabContentContainer);
      let dayHours = [];
      const settings = settingsManager.getSettings();
      const TARGET_WORK_HOURS = settings.targetWorkHours;
      const MAX_DISPLAY_HOURS = settings.maxDisplayHours;
      const REDMINE_API_KEY2 = settings.redmineApiKey;
      Object.entries(data).forEach(([key, value], i2, dataEntries) => {
        if (sumType === "dates" && dataEntries[i2 - 1]) {
          const date = moment(key, "YYYY-MM-DD");
          let prevDate = moment(dataEntries[i2 - 1][0], "YYYY-MM-DD").add(1, "d");
          while (date.format("YYYY-MM-DD") !== prevDate.format("YYYY-MM-DD")) {
            const tr = document.createElement("tr");
            tr.classList.add("sum-row");
            const th = document.createElement("th");
            tr.appendChild(th);
            th.innerText = prevDate.format("YYYY-MM-DD");
            const d = prevDate.get("d");
            const th2 = document.createElement("th");
            th2.setAttribute("colspan", 2);
            th2.setAttribute("title", "Hiányzó bejegyzések");
            th2.innerText = prevDate.toDate().toLocaleDateString("hu", { weekday: "long" });
            if (d !== 0 && d !== 6) {
              th2.classList.add("missing-entry-error");
              th.classList.add("missing-entry-error");
            }
            tr.appendChild(th2);
            table.appendChild(tr);
            prevDate.add(1, "d");
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
        catTh.setAttribute("title", value.entries[0].label);
        sumRow.appendChild(catTh);
        const sumTh = document.createElement("th");
        sumTh.innerHTML = value.sum;
        const isOkay = value.sum >= TARGET_WORK_HOURS;
        if (isOkay) {
          sumRow.classList.add("okay");
        }
        sumRow.appendChild(sumTh);
        if (sumType === "dates" && settings.showProgressIndicator) {
          const visualisationTh = document.createElement("th");
          visualisationTh.setAttribute("colspan", 2);
          visualisationTh.classList.add("preview-visualisation-th");
          let cumulativePercentage = 0;
          const overtimeThreshold = TARGET_WORK_HOURS / MAX_DISPLAY_HOURS * 100;
          visualisationTh.innerHTML = `
        <div class="progress ${isOkay ? "progress-success" : ""}">
          ${value.entries.map((row) => {
          const hours = parseFloat(row["time_entry[hours]"]);
          const percentage = hours / MAX_DISPLAY_HOURS * 100;
          const startPos = cumulativePercentage;
          const endPos = cumulativePercentage + percentage;
          cumulativePercentage = endPos;
          let overlayStyle = "";
          if (endPos > overtimeThreshold) {
            if (startPos < overtimeThreshold) {
              const crossPoint = (overtimeThreshold - startPos) / percentage * 100;
              overlayStyle = `background: linear-gradient(to right, transparent ${crossPoint}%, rgba(234, 17, 168, 0.66) ${crossPoint}%);`;
            } else {
              overlayStyle = `background: rgba(234, 17, 168, 0.66);`;
            }
          }
          return `
            <div
              class="bar ${overlayStyle ? "bar-has-overlay" : ""}"
              title="${hours} - ${row["time_entry[description]"]}"
              style="width: ${percentage}%"
            >
              ${overlayStyle ? `<div class="bar-overlay" style="${overlayStyle}"></div>` : ""}
              <span>${hours}</span>
            </div>
            `;
        }).join("")}
        </div>
      `;
          sumRow.appendChild(visualisationTh);
          dayHours.push(value.sum);
        }
        value.entries.forEach((row, j, rows) => {
          const tr = document.createElement("tr");
          if (value.sum >= 8) {
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
          Object.entries(row).forEach(([key2, value2]) => {
            if (![
              "time_entry[date]",
              "time_entry[hours]",
              "time_entry[description]",
              "time_entry[issue_number]"
            ].includes(key2)) {
              return;
            }
            const cell = document.createElement("td");
            if (!(key2 === "time_entry[date]" && sumType === "dates")) {
              if (key2 === "time_entry[issue_number]" && value2) {
                let url;
                let prefix = "";
                let isRedmineIssue = false;
                let issueNumber;
                if (/^#?\d+$/.test(value2)) {
                  issueNumber = value2.match(/^#?(.+)/)[1];
                  url = `https://redmine.dbx.hu/issues/${issueNumber}`;
                  prefix = "#";
                  isRedmineIssue = true;
                } else if (/^[A-Z0-9]+-\d+$/.test(value2)) {
                  url = `https://youtrack.dbx.hu/issue/${value2}`;
                }
                cell.innerHTML = `
                <a href="${url}" target="_blank">
                  ${prefix}${value2}
                </a>
              `;
                if (isRedmineIssue && REDMINE_API_KEY2 && reloadRedmineTicket) {
                  const reloadBtn = document.createElement("button");
                  reloadBtn.className = "btn redmine-reload-btn";
                  reloadBtn.innerHTML = "&#8635;";
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
                cell.innerHTML = value2;
              }
            } else {
              cell.innerHTML = `${row.label}${row.rmProjectName ? `(${row.rmProjectName})` : ""}`;
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
      `;
      }
    });
    previewContent.scrollTop = prevScrollTop;
  }
  let monacoEditorInstance = null;
  let status$1 = null;
  function initBatchSubmitModule(deps) {
    monacoEditorInstance = deps.monacoEditorInstance;
    status$1 = deps.status;
  }
  function setupBatchSubmitButton() {
    $("#submit-batch-button").button().on("click", async function() {
      console.log("batch button pressed");
      if (status$1) {
        status$1("");
      }
      const editorValue = monacoEditorInstance ? monacoEditorInstance.getValue() : document.getElementById("batch-textarea").value;
      const parsedBatchData = (await parseBatchData(editorValue, { nometa: true })).data;
      const progressElement = window.document.getElementById("enhance-progress");
      progressElement.style.display = "block";
      const progressElementBar = window.document.getElementById("enhance-progress-bar");
      progressElementBar.style.width = `0%`;
      let i = 0;
      const total = parsedBatchData.length;
      const postBatch = function() {
        if (status$1) {
          status$1(`Ready: ${i}/${total}`);
        }
        progressElementBar.style.width = `${i / total * 100}%`;
        i++;
        if (parsedBatchData.length) {
          {
            $.post("/timelog", parsedBatchData.shift(), postBatch);
          }
        } else {
          {
            window.location.reload();
          }
        }
      };
      postBatch();
    });
  }
  function copyToClipboard(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
  }
  function status(description, level) {
    const statusElement = document.getElementById("status-description");
    if (!statusElement) return;
    statusElement.innerText = description;
    const statusBar = document.getElementById("status-bar");
    if (!statusBar) return;
    statusBar.className = "";
    if (level) {
      statusBar.classList.add(level);
    }
  }
  const copyTextToClipboard = copyToClipboard;
  let fetchAndCache = null;
  let applyQuickFilter = null;
  (async function() {
    settingsManager.load();
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      link.setAttribute("type", "image/x-icon");
      document.getElementsByTagName("head")[0].appendChild(link);
    }
    link.href = "https://i.imgur.com/XqJTK1c.png";
    const personDropdown = document.getElementById("person");
    if (personDropdown) {
      personDropdown.disabled = false;
    }
    if (typeof moment !== "undefined") {
      moment.locale("hu");
    }
    initTheme();
    loadRedmineCacheFromStorage();
    initFavoritesManager({
      copyTextToClipboard,
      fetchAndCache,
      // TODO: extract this
      applyQuickFilter
      // TODO: extract this
    });
    loadFavorites();
    await checkFavoritesValidity();
    renderFavs();
    setupFavoriteSorting();
    setupClearInvalidButton();
    updateClearButtonVisibility();
    initPreviewManager({
      monacoEditorInstance: monacoEditorInstance$2,
      reloadRedmineTicket: reloadRedmineTicket$1,
      updateEditorDecorations: null
      // TODO: extract this function
    });
    initMonacoEditorModule({
      updatePreview
    });
    initNavbarModule({
      getCurrentTheme: getCurrentTheme$1,
      toggleTheme: toggleTheme$1,
      showSettingsModal
    });
    injectNavbar();
    initSettingsModalModule({
      applyTheme: applyTheme$1,
      updatePreview,
      updateMonacoLayout
    });
    createSettingsModal();
    initBatchSubmitModule({
      monacoEditorInstance: monacoEditorInstance$2,
      status
    });
    setupBatchSubmitButton();
    const formTopContentContainer = document.createElement("div");
    Array.from(document.querySelectorAll("#time_entry_container form > input, #time_entry_container form > select, #time_entry_container form > button")).forEach((el) => formTopContentContainer.appendChild(el));
    document.querySelector("#time_entry_container form").prepend(formTopContentContainer);
    $("#batch-textarea").on("focus", function() {
      $(this).addClass("active");
    });
    if (window.localStorage.batchTextareaSavedValue) {
      document.getElementById("batch-textarea").value = window.localStorage.batchTextareaSavedValue;
      updatePreview();
    }
    $("#add-to-favs-button").button().on("click", addNewFavorite);
    initializeMonacoEditor();
    console.log("ArpyEnhance v0.18 loaded successfully!");
  })();

})();