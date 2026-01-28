// ==UserScript==
// @name         ArpyEnhance
// @namespace    hu.emoryy
// @version      0.16.1
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

(function () {
  'use strict';

  const d=new Set;const importCSS = async e=>{d.has(e)||(d.add(e),(t=>{typeof GM_addStyle=="function"?GM_addStyle(t):(document.head||document.documentElement).appendChild(document.createElement("style")).append(t);})(e));};

  const allCss = ':root{--target-hours: 8;--max-hours: 12}:root,[data-theme=light]{--bg-primary: #ffffff;--bg-secondary: #efefef;--bg-tertiary: #dddddd;--bg-panel: #efefef;--bg-hover: #e0e0e0;--bg-active: #d0d0d0;--input-bg: #ffffff;--input-bg-focus: #ffffff;--text-primary: #333333;--text-secondary: #666666;--text-inverse: #ffffff;--text-accent: #0097e3;--border-light: #ddd;--border-medium: #ccc;--border-dark: #999;--border-darker: #777;--panel-header-start: #e8e8e8;--panel-header-end: #d0d0d0;--panel-header-border: #c2c2c2;--panel-header-text: #333;--table-bg: #ddd;--table-sum-bg: #555;--table-sum-text: #fff;--table-separator: #f5f5f5;--preview-sticky-bg: rgb(213,210,210);--fav-label-0: #00CC9F;--fav-label-1: #00ACB3;--fav-label-2: #0088B2;--fav-label-3: #046399;--status-valid: rgb(32,131,79);--status-valid-text: rgb(224,255,239);--status-closed: rgb(135,195,165);--status-invalid: rgb(171,221,196);--status-error: #B94A48;--preview-okay-bg: rgb(32,131,79);--preview-okay-td-bg: color-mix(in srgb, var(--preview-okay-bg), white 74%);--preview-okay-bar-bg: rgb(135,195,165);--preview-okay-text: rgb(224,255,239);--preview-missing-text: #B94A48;--progress-bg: rgba(255,255,255,.4);--btn-primary: #0088CC;--btn-disabled: #aaa;--btn-delete: #B94A48;--btn-regular-bg: #e0e0e0;--btn-regular-hover: #d0d0d0;--redmine-auto-label: rgba(255,77,77,.49);--resizer-default: #aaa;--resizer-hover: #444;--reload-btn-bg: #f5f5f5;--reload-btn-border: #999;--reload-btn-hover: #e0e0e0;--text-shadow: rgba(0,0,0,.8)}[data-theme=dark]{--bg-primary: #1a1a1a;--bg-secondary: #252525;--bg-tertiary: #2d2d2d;--bg-panel: #2a2a2a;--bg-hover: #353535;--bg-active: #404040;--input-bg: #252525;--input-bg-focus: #1a1a1a;--text-primary: #e0e0e0;--text-secondary: #a0a0a0;--text-inverse: #1a1a1a;--text-accent: #4ac0fb;--border-light: #404040;--border-medium: #505050;--border-dark: #606060;--border-darker: #707070;--panel-header-start: #2d2d2d;--panel-header-end: #252525;--panel-header-border: #404040;--panel-header-text: #e0e0e0;--table-bg: #353535;--table-sum-bg: #505050;--table-sum-text: #e0e0e0;--table-separator: #2a2a2a;--preview-sticky-bg: #2d2d2d;--fav-label-0: #00a37f;--fav-label-1: #008a93;--fav-label-2: #006a92;--fav-label-3: #034379;--status-valid: rgb(28,101,69);--status-valid-text: rgb(200,255,220);--status-closed: rgb(65,105,90);--status-invalid: rgb(75,115,100);--status-error: #d95a58;--preview-okay-bg: rgb(28,101,69);--preview-okay-td-bg: color-mix(in srgb, var(--preview-okay-bg), black 36%);--preview-okay-bar-bg: rgb(65,105,90);--preview-okay-text: rgb(200,255,220);--preview-missing-text: #d95a58;--progress-bg: rgba(0,0,0,.2);--btn-primary: #0077b3;--btn-disabled: #555;--btn-delete: #c85a58;--btn-regular-bg: #3a3a3a;--btn-regular-hover: #454545;--redmine-auto-label: rgba(255,97,97,.3);--resizer-default: #555;--resizer-hover: #777;--reload-btn-bg: #353535;--reload-btn-border: #606060;--reload-btn-hover: #404040;--text-shadow: rgba(0,0,0,.9)}body{background-color:var(--bg-primary)!important}#timelog_page_wrapper{background-color:var(--bg-tertiary)!important}.navbar-inner .container{width:auto!important;display:flex;justify-content:center}@media screen and (max-width:1282px){body{padding-top:80px!important}}#time_entry_container,#project_select_container,.enhanced-container{background-color:var(--bg-panel)!important;border-color:var(--border-light)!important}[data-theme=dark] #timelog_page_wrapper,[data-theme=dark] #timelog_page_wrapper *{color:var(--text-primary)}[data-theme=dark] pre{background-color:var(--bg-secondary)!important;color:var(--text-primary)!important}[data-theme=dark] input,[data-theme=dark] select,[data-theme=dark] textarea,[data-theme=dark] .dropdown-toggle{background-color:var(--input-bg)!important;color:var(--text-primary)!important;border-color:var(--border-medium)!important}[data-theme=dark] input:focus,[data-theme=dark] select:focus,[data-theme=dark] textarea:focus{background-color:var(--input-bg-focus)!important;border-color:var(--border-dark)!important}[data-theme=dark] option,[data-theme=dark] optgroup{background-color:var(--bg-secondary)!important;color:var(--text-primary)!important}[data-theme=dark] input[type=checkbox],[data-theme=dark] input[type=radio]{opacity:.9;cursor:pointer}[data-theme=dark] .btn:not(.btn-primary):not(.btn-danger){background-color:var(--btn-regular-bg)!important;background-image:none!important;color:var(--text-primary)!important;border-color:var(--border-darker)!important;text-shadow:none!important;box-shadow:inset 0 1px #ffffff1a,0 1px 2px #0000004d!important}[data-theme=dark] .btn:not(.btn-primary):not(.btn-danger):hover,[data-theme=dark] .btn:not(.btn-primary):not(.btn-danger):focus{background-color:var(--btn-regular-hover)!important;background-image:none!important;color:var(--text-primary)!important;box-shadow:inset 0 1px #ffffff1a,0 1px 2px #0000004d!important}[data-theme=dark] .btn:not(.btn-primary):not(.btn-danger):active,[data-theme=dark] .btn:not(.btn-primary):not(.btn-danger).active{background-color:var(--btn-regular-hover)!important;box-shadow:inset 0 2px 4px #0006,0 1px 2px #00000080!important}[data-theme=dark] .btn-primary{background-color:var(--btn-primary)!important;background-image:linear-gradient(to bottom,#09d,#0077b3)!important;background-position:0 0!important;background-size:100% 100%!important;color:#fff!important;text-shadow:0 -1px 0 rgba(0,0,0,.3)!important;border-color:#005580!important;box-shadow:inset 0 1px #fff3,0 1px 2px #00000080!important;transition:none!important}[data-theme=dark] .btn-primary:hover,[data-theme=dark] .btn-primary:focus{background-color:#08c!important;background-image:linear-gradient(to bottom,#08c,#069)!important;background-position:0 0!important;background-size:100% 100%!important;color:#fff!important;box-shadow:inset 0 1px #fff3,0 1px 2px #00000080!important;transition:none!important}[data-theme=dark] .btn-primary:active,[data-theme=dark] .btn-primary.active{background-color:#069!important;background-image:linear-gradient(to bottom,#069,#005580)!important;box-shadow:inset 0 2px 4px #0006,0 1px 2px #00000080!important}[data-theme=dark] .btn-danger{background-color:var(--btn-delete)!important;background-image:linear-gradient(to bottom,#d95a58,#b94a48)!important;color:#fff!important;text-shadow:0 -1px 0 rgba(0,0,0,.3)!important;border-color:#9a3a38!important;box-shadow:inset 0 1px #fff3,0 1px 2px #00000080!important}[data-theme=dark] .btn-danger:hover,[data-theme=dark] .btn-danger:focus{background-color:#c85a58!important;background-image:linear-gradient(to bottom,#c85a58,#a04846)!important;color:#fff!important;box-shadow:inset 0 1px #fff3,0 1px 2px #00000080!important}[data-theme=dark] .btn-danger:active,[data-theme=dark] .btn-danger.active{background-color:#a04846!important;background-image:linear-gradient(to bottom,#a04846,#8a3836)!important;box-shadow:inset 0 2px 4px #0006,0 1px 2px #00000080!important}[data-theme=dark] .time_log_table .btn i{filter:invert()}[data-theme=dark] #time_log .headline{background-color:var(--bg-secondary)!important}[data-theme=dark] #time_log a{color:#4da6ff!important}[data-theme=dark] #time_log a:hover{color:#66b3ff!important}[data-theme=dark] #time_log .hours_orange{background-color:#502b20!important;color:#ff7100!important;text-shadow:0 0 2px rgba(255,145,0,.5)}[data-theme=dark] .modal-footer{border-top-color:var(--border-light)!important;box-shadow:inset 0 1px 0 var(--border-light)!important}.table{background-color:var(--bg-secondary)!important;color:var(--text-primary)!important}.table th{background-color:var(--bg-tertiary)!important;color:var(--text-primary)!important;border-color:var(--border-light)!important}.table td{background-color:var(--bg-secondary)!important;color:var(--text-primary)!important;border-color:var(--border-light)!important}.table-striped tbody tr:nth-child(odd) td{background-color:var(--bg-panel)!important}.table tbody tr:hover td{background-color:var(--bg-hover)!important}#time_log{color:var(--text-primary)!important}#time_log .headline{background-color:var(--bg-tertiary)!important;color:var(--text-primary)!important;padding:8px 12px;border-radius:4px;margin-top:0}#time_log .week,#time_log .day,#time_log .hours_blue{color:var(--text-primary)!important}#time_log .hours_orange{color:#1a1a1a!important;font-weight:700;text-shadow:0 0 1px rgba(255,255,255,.3)}#month_selector #date{color:var(--text-primary)!important}.modal{background-color:var(--bg-panel)!important;color:var(--text-primary)!important}.modal-header,.modal-body,.modal-footer{background-color:var(--bg-panel)!important;color:var(--text-primary)!important;border-color:var(--border-light)!important}.modal-header .close{color:var(--text-primary)!important;opacity:.6;text-shadow:none!important}.modal-header .close:hover{opacity:.9}#timelog_page_wrapper a{color:var(--btn-primary)!important}#timelog_page_wrapper a:hover{color:var(--text-primary)!important}.dropdown-menu{background-color:var(--bg-secondary)!important;border-color:var(--border-dark)!important}.dropdown-menu li>a{color:var(--text-primary)!important}.dropdown-menu li>a:hover{background-color:var(--bg-hover)!important}#preview-tabs,.nav-tabs{background-color:var(--bg-secondary)!important;border-bottom:1px solid var(--border-light)!important}#preview-tabs a,.nav-tabs a{color:var(--text-primary)!important;background-color:transparent!important;border-color:transparent!important}#preview-tabs a.active,#preview-tabs a:hover,.nav-tabs li.active a,.nav-tabs a:hover{background-color:var(--bg-panel)!important;border-color:var(--border-light) var(--border-light) transparent!important;color:var(--text-primary)!important}.label,.badge{text-shadow:none!important}.panel{background-color:var(--bg-panel)!important;border:1px solid var(--border-light)!important;box-shadow:inset 0 1px 1px #0000000d}.alert{background-color:var(--bg-tertiary)!important;color:var(--text-primary)!important;border-color:var(--border-light)!important;text-shadow:none!important}.pagination a{background-color:var(--bg-secondary)!important;color:var(--text-primary)!important;border-color:var(--border-medium)!important}.pagination a:hover,.pagination .active a{background-color:var(--bg-hover)!important}.popover,.tooltip-inner{background-color:var(--bg-panel)!important;color:var(--text-primary)!important;border-color:var(--border-dark)!important}[class^=icon-],[class*=" icon-"]{opacity:.9}#content{margin-top:5px;width:100%;padding:0}#timelog-page{display:flex;flex-wrap:wrap;align-items:flex-start;justify-content:center}#timelog-page #favorites-container{flex:1 1 100%}#timelog-page #month-timelog-container{flex:0 0 1200px;width:1200px}#timelog-page #editor-preview-wrapper{flex:1 1 100%;display:flex;flex-wrap:nowrap;gap:10px;margin:10px 10px 0;min-width:0}#timelog-page #time_entry_container{flex:1 1 0;min-width:0}#timelog-page #time_entry_container .description{display:flex}#timelog-page #time_entry_container #batch-textarea{flex:1 1 auto}#timelog-page #preview-container{flex:1 1 0;min-width:0;position:relative}#timelog-page #preview-container h3{padding:0 10px;position:sticky;top:0;background:var(--preview-sticky-bg);z-index:1;margin-bottom:0;font-variant:small-caps}#timelog-page #preview-container h3:first-child{margin-top:0}#timelog-page #preview-container th{white-space:nowrap}#timelog-page #preview-container td,#timelog-page #preview-container th{background-color:var(--table-bg);color:var(--text-primary)}:is(#timelog-page #preview-container td,#timelog-page #preview-container th) a{color:var(--text-accent);font-weight:700}#timelog-page #preview-container .sum-row{border-top:10px solid var(--table-separator)}#timelog-page #preview-container .sum-row td,#timelog-page #preview-container .sum-row th{background-color:var(--table-sum-bg);color:var(--table-sum-text)}#timelog-page #preview-container .is-automatic-label td:first-child{position:relative;background:var(--redmine-auto-label)!important}#timelog-page #preview-container .is-automatic-label td:first-child:before{content:"💎";filter:hue-rotate(130deg);display:inline-block;position:absolute;left:-1px;top:4px;font-size:13px}#timelog-page #preview-container tr td:first-child,#timelog-page #preview-container th{max-width:100px;overflow:hidden}#timelog-page #preview-container td,#timelog-page #preview-container th{font-size:15px;font-family:monospace;text-align:left;padding:4px}#timelog-page #preview-container .redmine-reload-btn{margin-left:4px;padding:0 4px;font-size:11px;line-height:1;vertical-align:middle;min-width:auto}#timelog-page #preview-container .redmine-reload-btn.loading{opacity:.6;cursor:wait}#timelog-page #preview-container td:nth-child(3){white-space:nowrap}#timelog-page #preview-container td:first-child{padding-left:15px;white-space:nowrap}#timelog-page #preview-container table{margin-bottom:10px}#timelog-page #preview-container .async-progress-wrapper{padding:40px 20px;text-align:center}#timelog-page #preview-container .async-progress-title{font-size:18px;font-weight:600;color:var(--text-primary);margin-bottom:30px}#timelog-page #preview-container .async-progress-item{margin-bottom:20px}#timelog-page #preview-container .async-progress-item:last-child{margin-bottom:0}#timelog-page #preview-container .async-progress-label{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;font-size:14px;color:var(--text-secondary)}#timelog-page #preview-container .async-progress-type{font-weight:500}#timelog-page #preview-container .async-progress-count{font-family:monospace;font-weight:600;color:var(--btn-primary)}#timelog-page #preview-container .async-progress-bar-container{width:100%;height:8px;background-color:var(--bg-tertiary);border-radius:4px;overflow:hidden}#timelog-page #preview-container .async-progress-bar{height:100%;background:linear-gradient(90deg,var(--btn-primary),#00CC9F);border-radius:4px;transition:width .3s ease}#timelog-page #preview-container .preview-errors-wrapper{padding:20px;margin:20px;background-color:#b94a481a;border-left:4px solid var(--status-error);border-radius:4px}#timelog-page #preview-container .preview-errors-title{font-size:16px;font-weight:600;color:var(--status-error);margin-bottom:15px}#timelog-page #preview-container .preview-errors-list{list-style:none;padding:0;margin:0}#timelog-page #preview-container .preview-error-item{padding:8px 0;color:var(--text-primary);border-bottom:1px solid rgba(185,74,72,.2)}#timelog-page #preview-container .preview-error-item:last-child{border-bottom:none}#timelog-page #preview-container .preview-error-item b{color:var(--status-error);font-weight:600}#batch-textarea{border:1px solid var(--border-medium);border-radius:3px;width:892px;font-family:"monospace";transition:height .5s;background-color:var(--bg-primary);color:var(--text-primary)}#status{display:inline-block;text-align:right;font-size:16px;overflow:hidden;height:32px;line-height:32px;vertical-align:middle;margin-right:20px}#status.error{color:#8b0000;text-transform:uppercase}#time_entry_hours,#time_entry_submit,#time_entry_date,#time_entry_description,#time_entry_issue_number{display:none}#add-fav-button{vertical-align:middle;margin-bottom:10px;margin-left:10px}.i{font-size:16px}.enhanced-container{margin:0 auto 20px;padding:20px 0 2px 55px;background-color:var(--bg-panel);border:1px solid var(--border-light);border-radius:5px}#arpy-enhance-container{width:100%;display:flex}.panel{flex:0 1 auto;margin:10px;border-radius:5px;padding:0!important;display:flex;flex-direction:column}#editor-preview-wrapper>.panel{height:100%;margin:0!important}.panel-header{display:flex;align-items:center;justify-content:space-between;padding:4px 10px;background:linear-gradient(to bottom,var(--panel-header-start),var(--panel-header-end));border-bottom:1px solid var(--panel-header-border);border-radius:5px 5px 0 0;min-height:28px;flex-shrink:0}.panel-content{flex:1;overflow:auto;padding:10px;min-height:0;min-width:0}#favorites-container .panel-content{padding:10px}#time_entry_container .panel-content{display:flex;flex-direction:column;overflow:hidden}#time_entry_container form,#time_entry_container .description{flex:1;min-height:0;min-width:0;display:flex;flex-direction:column}#monaco-editor-container{min-height:0;height:100%;width:100%;max-width:100%;overflow:hidden;border:1px solid var(--border-medium)}.date-decoration{color:var(--text-secondary)!important;font-weight:700;opacity:1;font-family:monospace;font-size:.9em}[data-theme=light] .date-decoration.okay{color:#20834f!important;opacity:.8}[data-theme=dark] .date-decoration.okay{color:#4ade80!important;opacity:.8}.missing-entry-error{color:var(--preview-missing-text)!important}.panel-header-title{font-weight:600;font-size:13px;color:var(--panel-header-text);margin:0;padding:0;line-height:20px;text-transform:uppercase;letter-spacing:.5px}.panel-header-actions{display:flex;align-items:center;gap:8px}.panel-header-actions .btn{height:24px;line-height:1.2;padding:2px 6px;font-size:13px}::-webkit-scrollbar{width:12px;background-color:var(--bg-secondary)}::-webkit-scrollbar-thumb{background-color:var(--border-dark);border-radius:6px}::-webkit-scrollbar-thumb:hover{background-color:var(--border-darker)}#time_entry_container .lastrow{width:initial!important;margin-top:10px;white-space:nowrap}#favorites-container{max-height:20vh;position:relative}#favorites-container.maximalized{height:auto!important;max-height:none!important}#favorites-list{margin:0;list-style:none;color:var(--text-primary)}#favorites-list li{padding:2px;display:flex;align-items:center;column-gap:4px;color:var(--text-primary)}#favorites-list li .label{padding-top:3px;background:var(--fav-label-0);text-shadow:1px 1px 1px var(--text-shadow);color:#fff}#favorites-list li input{width:80px}#favorites-list li .label+.label{background:var(--fav-label-1)}#favorites-list li .label+.label+.label{background:var(--fav-label-2)}#favorites-list li .label+.label+.label+.label{background:var(--fav-label-3)}#favorites-list li input{padding:0 5px!important;border:1px solid transparent;background:transparent;margin-right:4px}#favorites-list li input:hover,#favorites-list li input:focus{border:1px solid var(--border-darker);background:var(--bg-primary)}#favorites-list button,#favorites-list .btn-mini{min-width:20px;font-size:11px;padding:1px 5px;vertical-align:top;margin-right:5px}#favorites-list li .label-important{margin-right:5px;background-color:var(--status-error);cursor:help}#open-help-dialog{margin-right:10px}#helpModal{top:10%;margin-left:-500px;margin-top:0;width:1000px}#helpModal .modal-body{max-height:80vh}#settingsModal{top:10%;margin-left:-350px;margin-top:0;width:700px}#settingsModal .modal-body{max-height:80vh;overflow-y:auto}#settingsModal .control-group{margin-bottom:20px}#settingsModal .help-block{font-size:11px;color:var(--text-secondary);margin-top:5px}#settingsModal input[type=text],#settingsModal input[type=number]{background-color:var(--input-bg);color:var(--text-primary);border-color:var(--border-medium)}#settingsModal .radio.inline,#settingsModal .checkbox{color:var(--text-primary)}.nav.arpy-enhance-nav{margin-left:30px!important;padding:0 7px;border-radius:4px;background:linear-gradient(135deg,#00cc9f,#0088b2);box-shadow:0 2px 4px #0003;display:flex;align-items:center}.nav.arpy-enhance-nav .arpy-enhance-brand{padding:0 12px 0 5px;display:flex;align-items:center;gap:8px;height:100%;border-right:1px solid rgba(255,255,255,.3)}.nav.arpy-enhance-nav .arpy-enhance-brand .brand-logo{height:36px;width:auto;display:block}.nav.arpy-enhance-nav .arpy-enhance-brand .brand-text{font-weight:700;font-size:16px;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,.3);letter-spacing:.5px;line-height:1}.nav.arpy-enhance-nav li{border-right:none;display:flex;align-items:center}.nav.arpy-enhance-nav .arpy-enhance-settings-btn{display:flex;align-items:center;gap:6px;padding:10px 14px!important;color:#fff!important;text-shadow:0 1px 2px rgba(0,0,0,.3);font-weight:700;transition:background-color .2s ease}.nav.arpy-enhance-nav .arpy-enhance-settings-btn:hover,.nav.arpy-enhance-nav .arpy-enhance-settings-btn:focus{background-color:#ffffff26!important;color:#fff!important}.nav.arpy-enhance-nav .arpy-enhance-settings-btn .settings-icon{font-size:20px;line-height:1}.nav.arpy-enhance-nav .arpy-enhance-settings-btn span:not(.settings-icon){font-size:13px}.nav.arpy-enhance-nav .theme-toggle-container{padding:0 12px}.nav.arpy-enhance-nav .theme-toggle-switch{position:relative;display:inline-block;width:60px;height:28px;margin:0;cursor:pointer}.nav.arpy-enhance-nav .theme-toggle-switch input[type=checkbox]{opacity:0;width:0;height:0}.nav.arpy-enhance-nav .theme-toggle-switch .theme-slider{position:absolute;inset:0;background-color:#ffffff40;border-radius:28px;transition:all .3s ease;display:flex;align-items:center;padding:0;box-shadow:inset 0 1px 3px #0000004d}.nav.arpy-enhance-nav .theme-toggle-switch .theme-slider:before{content:"";position:absolute;height:22px;width:22px;left:3px;top:3px;background-color:#fff;border-radius:50%;transition:transform .3s ease;box-shadow:0 2px 4px #0000004d;z-index:1}.nav.arpy-enhance-nav .theme-toggle-switch .theme-slider .theme-icon-light,.nav.arpy-enhance-nav .theme-toggle-switch .theme-slider .theme-icon-dark{position:absolute;width:16px;height:16px;top:6px;z-index:2;transition:all .3s ease}.nav.arpy-enhance-nav .theme-toggle-switch .theme-slider .theme-icon-light{left:6px;color:#006450f2;filter:drop-shadow(0 0 1px rgba(255,255,255,.5))}.nav.arpy-enhance-nav .theme-toggle-switch .theme-slider .theme-icon-dark{right:6px;color:#fffffff2;filter:drop-shadow(0 1px 1px rgba(0,0,0,.3))}.nav.arpy-enhance-nav .theme-toggle-switch input:checked+.theme-slider{background-color:#ffffff59}.nav.arpy-enhance-nav .theme-toggle-switch input:checked+.theme-slider:before{transform:translate(32px)}.nav.arpy-enhance-nav .theme-toggle-switch input:checked+.theme-slider .theme-icon-light{color:#fffffff2;filter:drop-shadow(0 1px 1px rgba(0,0,0,.3))}.nav.arpy-enhance-nav .theme-toggle-switch input:checked+.theme-slider .theme-icon-dark{color:#006450f2;filter:drop-shadow(0 0 1px rgba(255,255,255,.5))}.nav.arpy-enhance-nav .theme-toggle-switch:hover .theme-slider{background-color:#ffffff4d}.nav.arpy-enhance-nav .theme-toggle-switch input:checked+.theme-slider:hover{background-color:#fff6}[data-theme=dark] .arpy-enhance-nav{background:linear-gradient(135deg,#00a37f,#006a92);box-shadow:0 2px 4px #0006}#helpModal .modal-body pre{font-size:14px}.preview-visualisation-th{position:relative}.preview-visualisation-th:before{content:"";position:absolute;left:calc((var(--target-hours) / var(--max-hours)) * 100%);top:0;bottom:0;width:2px;background-color:#0006;z-index:10;pointer-events:none}.preview-visualisation-th .progress{margin:0;height:16px;position:relative;background:transparent;overflow:hidden;display:flex}.preview-visualisation-th .progress .bar{height:100%;font-size:10px;color:#eee;text-align:left;line-height:16px;border-radius:4px;box-shadow:inset -2px 0 #ffffff4d,inset 2px 0 #0000004d;border-right:2px solid rgba(0,0,0,.5);flex-shrink:0}.preview-visualisation-th .progress .bar.bar-has-overlay{position:relative}.preview-visualisation-th .progress .bar .bar-overlay{position:absolute;inset:0;pointer-events:none;border-radius:4px}.preview-visualisation-th .progress .bar:last-child{border-right:none;box-shadow:inset 2px 0 #0000004d}.preview-visualisation-th .progress .bar span{padding-left:4px;font-weight:700;position:relative;z-index:1}.preview-visualisation-th .progress.progress-success{filter:hue-rotate(35deg)}#time_entry_container{display:flex;flex-direction:column}#time_entry_container form{margin-bottom:0;display:flex;flex-direction:column;flex:1 1 auto}#time_entry_container form .description{flex:1 1 100%}#time_entry_container form>br{display:none}#time_entry_container>form,#time_entry_container .description{min-height:0}.quick-filter-container{display:flex;align-items:center;gap:6px}.quick-filter-container input{padding:2px 5px;border-radius:3px;border:1px solid var(--btn-disabled);font-size:12px;height:22px;background-color:var(--bg-primary);color:var(--text-primary)}#fav-sort-controls .btn.active{background-color:var(--btn-primary);color:var(--text-inverse);text-shadow:none}#fav-sort-controls .btn.active.sort-asc:after{content:" ▲"}#fav-sort-controls .btn.active.sort-desc:after{content:" ▼"}ul.preview-tabs{margin-left:-20px;margin-right:-10px;background-color:var(--bg-secondary)!important;border-bottom:1px solid var(--border-light)!important}ul.preview-tabs li:first-child{margin-left:20px}ul.preview-tabs li{cursor:pointer}ul.preview-tabs li a{color:var(--text-primary)!important;background-color:transparent!important}ul.preview-tabs li.active a{background-color:var(--bg-panel)!important;border-color:var(--border-light)!important;border-bottom-color:transparent!important}.statistics{display:flex;justify-content:space-around;font-family:monospace;font-weight:700;color:var(--text-primary)}.okay th{background:var(--preview-okay-bg)!important;color:var(--preview-okay-text)!important}.okay th:first-child:before{content:""}.okay td{background:var(--preview-okay-td-bg)!important;color:var(--text-primary)!important}.okay a{color:var(--text-accent)!important;font-weight:700}#minimal-vertical-resizer{position:absolute;bottom:-14px;left:0;width:100%;height:4px;background-color:transparent;border-top:1px solid transparent;border-bottom:1px solid transparent;cursor:ns-resize;z-index:99;transition:background-color .2s ease;display:flex;justify-content:center;justify-items:center;align-items:center}#minimal-vertical-resizer:before{content:"";width:20%;height:0;border-top:4px solid var(--resizer-default)}#minimal-vertical-resizer:hover:before{border-top:4px solid var(--resizer-hover)}#favorites-container.maximalized #minimal-vertical-resizer{display:none}#favorites-container.maximalized+#editor-preview-wrapper{height:85vh!important}.monaco-editor .suggest-widget .monaco-list-row .label-name{flex:0 0 auto;min-width:0;margin-right:6px;white-space:nowrap}.monaco-editor .suggest-widget .monaco-list-row .label-description{flex:1 1 auto;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#timelog-page{position:relative}.panel-swap-button{padding:2px 6px;font-size:14px;line-height:1}#timelog-page.panels-swapped #editor-preview-wrapper #time_entry_container{order:2}#timelog-page.panels-swapped #editor-preview-wrapper #preview-container{order:1}#month-timelog-container .panel-content{display:flex;flex-direction:column;gap:20px}#month_selector{text-align:center;padding:10px 0;margin-top:10px;margin-bottom:0}#month_selector p{margin:0}#time_log{width:100%}#advanced-selector-trigger{margin-left:8px;padding:2px 8px;font-size:14px;font-weight:700}#favorites-container{position:relative}.advanced-selector-dropdown{position:absolute;top:40px;left:20px;right:20px;border:1px solid var(--border-medium);border-top:2px solid var(--btn-primary);border-radius:4px;background:var(--bg-primary);box-shadow:0 4px 12px #0003;z-index:1000;display:flex;flex-direction:column}.advanced-selector-search-bar{border-bottom:1px solid var(--border-light);background:var(--bg-secondary);border-radius:4px 4px 0 0;box-sizing:border-box;padding:10px;display:flex}.advanced-selector-search-input{flex:1 1 100%;padding:12px 14px!important;border:2px solid var(--border-medium)!important;border-radius:4px;background:var(--bg-primary)!important;color:var(--text-primary)!important;font-size:20px!important;line-height:1.4!important}.advanced-selector-search-input:focus{outline:none;border-color:var(--btn-primary)!important;background:var(--input-bg-focus)!important;box-shadow:0 0 0 2px color-mix(in srgb,var(--btn-primary),transparent 80%)!important}.advanced-selector-search-input::placeholder{color:var(--text-secondary)!important;opacity:.85}.advanced-selector-content{display:flex;flex-direction:row;gap:10px;padding:10px;max-height:60vh;flex:1}.advanced-selector-section{flex:1;min-width:0;border:1px solid var(--border-light);border-radius:4px;padding:8px;background:var(--bg-secondary);display:flex;flex-direction:column}.advanced-selector-section .advanced-selector-section-title{font-weight:700;color:var(--text-primary);margin-bottom:8px;padding-bottom:4px;border-bottom:1px solid var(--border-medium);flex-shrink:0}.advanced-selector-list{display:flex;flex-direction:column;gap:4px;overflow-y:auto;flex:1;padding-right:4px}.advanced-selector-category-header{font-weight:700;color:var(--text-secondary);font-size:12px;margin-top:8px;margin-bottom:4px;padding-left:4px;text-transform:uppercase}.advanced-selector-category-header:first-child{margin-top:0}.advanced-selector-item{display:flex;justify-content:space-between;align-items:center;padding:6px 8px;border:2px solid transparent;border-radius:3px;background:var(--bg-primary);cursor:pointer;transition:background-color .2s,border-color .2s}.advanced-selector-item:hover{background:var(--bg-hover);border-color:var(--border-medium)}.advanced-selector-item.selected{background:var(--bg-active);border-color:var(--btn-primary)}.advanced-selector-item.in-favorites{background:color-mix(in srgb,var(--status-valid),var(--bg-primary) 85%)}.advanced-selector-item .advanced-selector-item-label{flex:1;color:var(--text-primary);font-size:13px}.advanced-selector-item .advanced-selector-item-actions{display:flex;gap:4px;margin-left:8px}.advanced-selector-item .advanced-selector-item-actions .btn{padding:2px 6px;font-size:12px;min-width:24px}.advanced-selector-loading,.advanced-selector-empty,.advanced-selector-error,.advanced-selector-info{padding:12px;text-align:center;color:var(--text-secondary);font-weight:700;font-size:22px}.advanced-selector-info{opacity:.8;line-height:1.5}.advanced-selector-error{color:var(--status-error)}';
  importCSS(allCss);
  const logoUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAKvUExURf///wECAQABAAAAAAAAAQEBAQABAQgGCA4HEhcLGjAZNWZHRnBUUFY6OCUYJ04sTFcraVYtb2UzepZVh/2mrP+nsDkoJYlYT5FtbWU0gYhNhPahpv+osWw1fWswTwsKDLZ5euuYpHtFiGo2gTQpOI5UbbNtjdKOjNeHl3M2eXk4d+GOoa9pc0k3Ni0sTCUlKikqNfOdpQMDAh0gKBocIxMVGxcaJP+oq8p8l3IzZKleheKOmnVjWYpEeXw5dtOGoRYVGA0OErdoiYM6cjEjHBwSDgMCA0ozKA8RFiUZF86Qc8WbhrKKdY1nU5ZHdeiVmHY+gaZ2Z+e9o/rew//ly/vhxqeJdoY8c4k7bTY2ONSvl9vItHhvZ5V5aXdXSzY8SElCO8erlde7pPXWu/Xdw+axlsl2ivymphQMDEZGR7inlNjEre7ZwP/pze7HrE8pK5pDa9mWerBUcJc+Z5M9a/fgx+vTu9mjiZZoVKdJapAtWcm5pqx0WrZ7ZM13iPimmJWFeMWHbf2qnv6ppFRRVOnMs8pkarCXhteIieuXjCgSE1hDN7pMXVQpK5ianrqDatRzb8FaZrZKXmdDOf/p0uXe17RKWszCuO2Rc/emhvytjv+yjP6xkdmTduuGaOV6Y9plV9ZbUsxWVv+4jP+0g/mpeeh2W01jhj1RddRnU/+ze2iHtj1VhE9somJfbNpcTvWZbFp7tORpU/OkcL6GXU5VaWeKwklklkVZd1h1puFfTeRhTVhymFRulTVJdelkTM1XSFFuo0Rekf+yd/J/XKVIN1d4sCg3WBwkOPCDXS5BakJaiaM5Y5Q+L2Z4jnqbxR0oQyw+aJkvY5K02IKl0HWUuyw9ZDVDWT1AQio0SIGjz3GEmZq+5WiEqneQrqPH7Yiq1DZIaVJpimF+pX+hzNT8VVoAAAABdFJOUwBA5thmAAAAAWJLR0QAiAUdSAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+oBGhIlFw1NLjEAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjUtMTItMDRUMjI6NDU6MTArMDA6MDCZnym8AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDI1LTEyLTA0VDIyOjQ1OjEwKzAwOjAw6MKRAAAAACh0RVh0ZGF0ZTp0aW1lc3RhbXAAMjAyNi0wMS0yNlQxODozNzoyMyswMDowMMeVjukAAAwHSURBVFjDnZiJW1NXGsaVECMEDEIaUJBAlUUKTZBgUBbZlwSISIKEfUeggwSUPUICEVEstDoVRRAcEUqoCI4TIiGO2BoaWyOUQKGDU9A/ZL5z7yWiVcf25YGEPE9+z/tt555ztmz5oLaakUjmZLI5iWS2dctf1TaSOWW7hSWVamVFpVrv2E4hk7b9FQrFwpJms9PWjv4JiE63s7GhWVpQ/iSLRGHYO9ju2rVrJ223o5MTItnZ7tmzx9bGmUEhfTyGae3i6uT6qa3tXlvLfW7uHh4enq67gbN/v9dnrt4+TNLHYtwdkQk7mq3N55YsNtI+n89pNgCy86V/4ujiQzH7v5gDZAs3wNA/oTu577Bks/w4HH/QQQ6Hw7Kk7Xeng7i+DhbmBz7MMaNY7vzUlY4STHdgszGISZwdNE8uItEDDll+2BRpOw1SfBhAToFWbNabHH+mv18QHZFcg0NCaNs/kClzCxuo1K69R5ycPGg4JtSECQtjUvxZLmCXHh4SEhHhbPFeEtly5y5Mu30DaXhYoRug0MgoSnQ0059F8+AGBkcgucWYv4dDDfgU4+zde5hKpIfgxMbZ8/jxCTHMWH8O1fcwxkl0Ffi8k2ROc3U6chQwtjTaPrYfgoTijmKZjKRjyUKhKCWUAtG5HY9IBU4glyvweUd0JB8BlOrIUWhCGoct9uNs2GH5MKzSACMUpmdkZkUx/fZFpKamJnqiPvBk/IFE2uHphBX2qO2enZbZ2eyD4CQ2lJXjkJubly/EVFAgLLRnctiHAFRUjPWB94m3umDrCRfoQpy0hybOzhb7sfyZJaVlX/wNJDSpnMfwZ51MTQ0HTjG3uKiCRnmzM8lWTgSIHrB/BzsbicUq3czAlC/J8uecTK305RZDg4dXVZ1ivJFwksXuI/QNuX/ORiR2qLgM+/Lp6ur8AhEWmii/pjaMQ6sT0IuLuYLKU1VVVfVRm4Oj0GyPuvtyCZIbi8Nms/xjWQ1EavKrq6sLhPBHlFzTGMpxDiwGTmAlYKoqKt0omzONFhs7wpSTNyuUw4llhrFKhW8ruUYax3HgAsizDnHqzjQ1ve6BAxSbvXuBBKaw4XZhocFi+oc2/wEkqpFFclwAdKaiCn68BfKWFhfmJkOIg0xh3eHB8g+LDYuN3ZGLci2C/EDlqoXo5XQhj8Hy4DoWVaCozjS1tMjlry1RaHtx0P49Xu4wlIH7ABQby8xAHhpaxTlBDs0NeQWKhuagHIZ9DEPg642iOitAGLm8JYnIkhlj91Gcg7T7iKMjFQILCwttAEOlOeIcRlzUCZ82UVlOVFxMTAzDWoDSXHlOjjAtLU3t3ufxJ4K5G/2I++79OGe/l9dh16CMNp+wMHE1TEVbWXVuSoJ9o7RQmNeYkJAkk11wrsSSjNtpOne2o+Mi3ksnPKAVXQPsvIACHC+vYIeGsvQSZslpKL2oIUOc82WzRJIv5NdeiHTI6Myk1kOSW8APmOn66uuvOzrqKXhkWK3ojp7uwQjjFXIoMz4+rzS0FTWhovnLS5mX0xXHykVtbVZZfy9NyrSqOIfsIEwHwnR0fIPFRrLaaES6r+dhYIU4N6cVpqSLW7F6lzW0XUlPFxWUi/j8ttIrbZJM6rkWEIoJx4BOorqRvZ1M00EvDnRPjHBuU8jsczMwR0KR6HR1XqFCqBDlSvn5okJJSlY7MlP5NRJAvjrb1V1Lhm484cGlb5avpxuAOstKSwo22lCRViAsEOZ18vKFyYXxWe3tyAyiIMjVaz3XZdCT2+KgCbkgE4kraK7mdSrSrfI3Rv4YhlTIauCT8nhrzAyCtF+9dv16z7VrPZK4bdDWwXaH3T0/c3Wk4zRYaRwacuOb8xWijQHD31TLJAiUcvGbjg4CAroG6rkaSQIQ1j3HMVwg4Iq5XI/m9IaMsrfXotPxvEKhqDDT3gS5fg0D9fRciyHBM8jLpJDjwYmHwwM8BQ6lX5QVvMW5fDm3U1JeXpNZc/21IK6rSNbmW6IJUAhSRAT6PZ4Y7FNWUCDaRKnOVyRfzkvqlUhqMq9ex77c3t3d3XfjRld/f//AwEUyASIwmGBpP8TJyc1VbALlxTdKapI6e3t7a+y7us6ePXtzswAUjYMIzHFQcHBiYuKhUIpPTO6mJIkUhTypDDi9fPubN9+iDOAgWjioqKgoIMATFBgYKBAIXKyYQZltb2Q7mV+DOJI26VUUUx8R08AARoLQyFSs5sUtm+WYwMkob3tzbeQXShAohfcPTD23bg0ODmLI2/39F6H81thoIOEQ9OIyNNxckLK5bsnlaRioJvPb7sFbiHSL0AhoEMpPinHEOC0bpGLfwDOtytFMYVu1aULycvkwsklSKa8m4eZA/40+gL3m3BoZjDSDERFw6QSk2FHgWVRZV+E8pPzuTnlDLgFKSystbbhyJb1NKuPxk/r6xwbG+gF2d9DkqDdqK1rXuHSIp9gxMCC8MvEUEk05Pj4cnxyfRswalqPk5GOQovjOW4N9E2NI/RO3u++NYPonWtnISVwUTXhdYmoqhqmqv/+v8XGVVbkiiZ+8kepj/JQUKL8koRdMDN693b/BAmMjIwlorSU5F4UnAoTAnKqoc54ER+pWfnKafcrGCnCsM7OT19sbb9/fjcVDoB48eDAFMGu0sG2zeA0BjPe5IM30OEh76Vh+56WscsJSMixFvb21jWP9NwYJ1MTYgymkh//GHyMU51MYp+pUVV2RQO4xqXz0CEAzB7Py86Qx1rmmmVNIZAmDfWNjE3exxDy++/3DBwj18Af8wWZ+EjeDYeTypKEnT9QAeqSbTVDwpIw4U3j5ktrOWyNQtakbgxjp8d0fHwJn6iL+qDWzAEPoAYwwco/7SrVKPf7d+Lhexw6qkXUyTmThO7/kQtmlLoipb2ps6vbdx8AB3ftxYoqIDIutovJckxyTA2R6+iliDet07CypTBYTHZnJT0vjS2svOf/UDX3TPTH1YKpv8PFjAvVztGkTYcLIk54ZIC6VVqsaVz2f04mpjTyZdXR0VNz58yyx9/x8HQrq7gRkBkwRpBjTvobp0mLi/LJgVD8Zn9Hpxx8tLmqXfvWx7+VlnYiOplxaXpbWzc9/NUKQHkwQphpf77RI1rihJgfgrBgRaXRZNa7XL2qzS0pqeyWN1gz7BLaO2jU/P9+FFWziIQgztckQZCkJWWpK+O0/CysLhlXjtEqt1Y6PAmk0u7U1S4bm/oJ4mU11rp//qRurF0aaAFJt9ObNKKNdLm8PevHf31dAytXVtdGZRbVKP6rVIhIkSiKNEy/rliZp9fN19wA0gpGmHn7Pi3xjp03Okp8LWsE4CwtGjXFVr118qtYOq/Ta4ezWO61WCVR29vLi7PS6j3P9WSw3kCeEumj+1oY9684vGxyj8aXhpW5Or3yqVakXR4fFv7a2lpSUiHXa52uayfu0+q7HOAlAP7+1Yd9CCsP9rECuUXCvNDqdWq2dUar1M2tiEJwFdFqdbn16evWOs5Tw9PCHqD8cJEnLRuQH46wYXioNQ8uTyqejQNSrloBTUsLSafXLw+vr6y+Mz4Ia76GCfXv+HccjcrZhAecsAEltNK49R8Py6tWQXqUruXOn5KBOiyyBJ41x5TeEuvfuox95yYBzQCtKjfHl8rpSOW1YMExqVUv3W8V+y/rROd3k9NC0RvNy5ZdntfcuvO8Imb1qwDlAWlUrh9YMr1aVKwvGtVEVnJdYz/Uz2sUlzfS6BrT6+7NI8nsPtewXBAZ5UmuWlAsGw6uVBaV+RiUWs5/PqYb1uiHNNAJphtjmHziu+z0DxAqW9ZVVzfA68c9LveqpmDU7p3o6N7eGYTTD/h+82CCF3TfgnlDCh9Y2Ip0Gkt/s4qOZOS1Y0mjWl//fBclWMvsZ2MGcrE4vGXHOwqsh7XewtjxRLWoXhzXTwwfJBz7ikmVpFeUIple9pEGv2PtJ7aNxWF7m9NBLsx939XOAFJatQT21opycJJIEIP0wPBKe6uee+3/8DdIBEpM9uQodtA6thZM0i1pYNR/pn8dGk/7UnZaZeRj7/vr68gs824al2cXF5dmDFHOzP3/NZkYiM5mz2Uv3Jycnsw8ymX/tss50Z0ciR4PIJNK2D9fpf5NyoMnSjTrvAAAAAElFTkSuQmCC";
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
get(key) {
      const keyMap = {
        "redmineApiKey": "REDMINE_API_KEY",
        "redmineCacheTtlHours": "arpyEnhanceRedmineCacheTtlHours",
        "theme": "arpyEnhanceTheme",
        "favsMaximized": "arpyEnhanceFavsMaxed",
        "panelsSwapped": "arpyEnhancePanelsSwapped",
        "showProgressIndicator": "arpyEnhanceShowProgressIndicator",
        "showEditorHourIndicator": "arpyEnhanceShowEditorHourIndicator",
        "targetWorkHours": "arpyEnhanceTargetWorkHours",
        "maxDisplayHours": "arpyEnhanceMaxDisplayHours"
      };
      const storageKey = keyMap[key] || key;
      const defaultValue = DEFAULT_SETTINGS[key];
      if (key === "redmineCacheTtlHours" || key === "targetWorkHours" || key === "maxDisplayHours") {
        const val = getStorageItem(storageKey);
        return val ? parseFloat(val) : defaultValue;
      } else if (key === "favsMaximized" || key === "panelsSwapped" || key === "showProgressIndicator" || key === "showEditorHourIndicator") {
        const val = getStorageItem(storageKey);
        if (val === null) return defaultValue;
        return val === "true";
      } else {
        return getStorageItem(storageKey) || defaultValue;
      }
    }
set(key, value) {
      const keyMap = {
        "redmineApiKey": "REDMINE_API_KEY",
        "redmineCacheTtlHours": "arpyEnhanceRedmineCacheTtlHours",
        "theme": "arpyEnhanceTheme",
        "favsMaximized": "arpyEnhanceFavsMaxed",
        "panelsSwapped": "arpyEnhancePanelsSwapped",
        "showProgressIndicator": "arpyEnhanceShowProgressIndicator",
        "showEditorHourIndicator": "arpyEnhanceShowEditorHourIndicator",
        "targetWorkHours": "arpyEnhanceTargetWorkHours",
        "maxDisplayHours": "arpyEnhanceMaxDisplayHours"
      };
      const storageKey = keyMap[key] || key;
      if (typeof value === "boolean") {
        setStorageItem(storageKey, value ? "true" : "false");
      } else {
        setStorageItem(storageKey, String(value));
      }
    }
load() {
    }
save() {
    }
getSettings() {
      return {
        redmineApiKey: this.get("redmineApiKey"),
        redmineCacheTtlHours: this.get("redmineCacheTtlHours"),
        theme: this.get("theme"),
        favsMaximized: this.get("favsMaximized"),
        panelsSwapped: this.get("panelsSwapped"),
        showProgressIndicator: this.get("showProgressIndicator"),
        showEditorHourIndicator: this.get("showEditorHourIndicator"),
        targetWorkHours: this.get("targetWorkHours"),
        maxDisplayHours: this.get("maxDisplayHours")
      };
    }
getRedmineCacheTtlMs() {
      return this.get("redmineCacheTtlHours") * 60 * 60 * 1e3;
    }
  }
  const settingsManager = new SettingsManager();
  let currentTheme = settingsManager.get("theme");
  let monacoEditorInstance$2 = null;
  function setMonacoEditorInstance(instance) {
    monacoEditorInstance$2 = instance;
  }
  function applyTheme$1(theme) {
    currentTheme = theme;
    settingsManager.set("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    settingsManager.save();
    if (monacoEditorInstance$2 && typeof monaco !== "undefined") {
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
    const REDMINE_API_KEY = settingsManager.get("redmineApiKey");
    if (!REDMINE_API_KEY || !issueNumber?.match(/^\d+$/)) {
      return null;
    }
    if (!forceReload && redmineCache[issueNumber] && !isRedmineCacheExpired(issueNumber)) {
      return redmineCache[issueNumber].data;
    }
    const response = await fetch(`https://redmine.dbx.hu/issues/${issueNumber}.json`, {
      headers: {
        "Content-Type": "application/json",
        "X-Redmine-API-Key": REDMINE_API_KEY
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
  async function reloadRedmineTicket(issueNumber, updatePreviewCallback) {
    if (!issueNumber) {
      return;
    }
    await fetchRedmineIssue(issueNumber, true);
    if (updatePreviewCallback) {
      await updatePreviewCallback();
    }
  }
  const arpyCache = {};
  function fetchAndCache$2(url, cacheKey) {
    let promise = arpyCache[cacheKey];
    if (!promise) {
      promise = fetch(url).then((response) => {
        if (!response.ok) {
          console.warn(`Failed to fetch ${url}, status: ${response.status}`);
          return [];
        }
        return response.json();
      }).catch((error) => {
        console.error(`Error fetching ${url}:`, error);
        delete arpyCache[cacheKey];
        return [];
      });
      arpyCache[cacheKey] = promise;
    }
    return promise;
  }
  let favorites = [];
  let favoriteSortOrder = localStorage.getItem("arpyEnhanceFavoriteSortOrder") || "default";
  let favoriteSortReversed = localStorage.getItem("arpyEnhanceFavoriteSortReversed") === "true";
  let copyTextToClipboard$1 = null;
  let fetchAndCache$1 = null;
  let applyQuickFilter$2 = null;
  function initFavoritesManager(deps) {
    copyTextToClipboard$1 = deps.copyTextToClipboard;
    fetchAndCache$1 = deps.fetchAndCache;
    applyQuickFilter$2 = deps.applyQuickFilter;
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
    const projectDropdown = document.getElementById("project_id");
    const projectOption = projectDropdown.querySelector(`option[value="${fav.project_id.value}"]`);
    const categoryLabel = projectOption ? projectOption.parentElement.getAttribute("label") : "?";
    return [
      categoryLabel,
      fav.project_id?.label,
      fav.todo_list_id?.label || "-",
      fav.todo_item_id?.label || "-"
    ];
  }
  function addNewFavorite() {
    const formData = $('form[action="/timelog"]').serializeArray();
    const fav = {
      label: "",
      id: `${( new Date()).getTime()}${Math.round(Math.random() * 1e3)}`
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
      fav.isInvalid = false;
      if (!fav.project_id?.value || !projectOptions.has(fav.project_id.value)) {
        fav.isInvalid = true;
        return;
      }
      if (!fav.todo_list_id?.value) {
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
      if (!fav.todo_item_id?.value) {
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
      if (applyQuickFilter$2) {
        applyQuickFilter$2();
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
    if (applyQuickFilter$2) {
      applyQuickFilter$2();
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
        if (applyQuickFilter$2) {
          applyQuickFilter$2();
        }
      }
    });
  }
  function applyQuickFilter$1() {
    const filterInput = document.querySelector(".quick-filter-input");
    if (!filterInput) return;
    const term = filterInput.value?.toLowerCase();
    document.querySelectorAll("#favorites-list li").forEach((li) => {
      if (!term || li.textContent.toLowerCase().includes(term) || li.querySelector("input")?.value?.toLowerCase().includes(term)) {
        li.style.display = "";
      } else {
        li.style.display = "none";
      }
    });
  }
  function setupQuickFilter() {
    const filterInput = document.querySelector(".quick-filter-input");
    if (filterInput) {
      filterInput.addEventListener("input", applyQuickFilter$1);
    }
  }
  let selectedProjectId = null;
  let selectedTodoListId = null;
  let selectedTodoItemIds = new Set();
  let isDropdownOpen = false;
  let allProjects = [];
  let loadedTodoLists = [];
  let loadedTodoItems = [];
  let fetchAndCache = null;
  let applyQuickFilter = null;
  let searchDebounceTimer = null;
  let previousSearchTerms = ["", "", ""];
  function fuzzyMatchScore(text, pattern) {
    if (!pattern) return 1;
    if (!text) return 0;
    const textLower = text.toLowerCase();
    const patternLower = pattern.toLowerCase();
    if (textLower.startsWith(patternLower)) {
      return 1e3 + pattern.length;
    }
    const words = textLower.split(/[\s\-_\/]/);
    for (const word of words) {
      if (word.startsWith(patternLower)) {
        return 500 + pattern.length;
      }
    }
    let score = 0;
    let patternIdx = 0;
    let consecutiveMatches = 0;
    for (let i = 0; i < textLower.length && patternIdx < patternLower.length; i++) {
      if (textLower[i] === patternLower[patternIdx]) {
        patternIdx++;
        consecutiveMatches++;
        score += consecutiveMatches * 2;
        score += 100 - i;
      } else {
        consecutiveMatches = 0;
      }
    }
    if (patternIdx < patternLower.length) {
      return 0;
    }
    return score;
  }
  function fuzzyFilter(items, pattern) {
    if (!pattern) return items;
    const scored = items.map((item) => {
      const text = item.label || item.name || item.content || "";
      const score = fuzzyMatchScore(text, pattern);
      return { item, score };
    }).filter((result) => result.score > 0).sort((a, b) => b.score - a.score);
    return scored.map((result) => result.item);
  }
  function initAdvancedSelector(deps) {
    fetchAndCache = deps.fetchAndCache;
    applyQuickFilter = deps.applyQuickFilter;
  }
  function setupAdvancedSelector() {
    const triggerBtn = document.getElementById("advanced-selector-trigger");
    const dropdown = document.getElementById("advanced-selector-dropdown");
    const searchInput = document.getElementById("advanced-selector-search");
    if (!triggerBtn || !dropdown || !searchInput) {
      console.error("Advanced selector elements not found");
      return;
    }
    triggerBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleDropdown();
    });
    document.addEventListener("click", (e) => {
      if (isDropdownOpen && !dropdown.contains(e.target)) {
        closeDropdown();
      }
    });
    dropdown.addEventListener("click", (e) => {
      e.stopPropagation();
    });
    searchInput.addEventListener("input", (e) => {
      clearTimeout(searchDebounceTimer);
      searchDebounceTimer = setTimeout(() => {
        handleUnifiedSearch(e.target.value);
      }, 300);
    });
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleEnterKey();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        navigateItems("down");
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        navigateItems("up");
      } else if (e.key === "Escape") {
        e.preventDefault();
        closeDropdown();
      }
    });
    loadProjects();
  }
  function toggleDropdown() {
    if (isDropdownOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  }
  function openDropdown() {
    const dropdown = document.getElementById("advanced-selector-dropdown");
    const searchInput = document.getElementById("advanced-selector-search");
    dropdown.style.display = "block";
    isDropdownOpen = true;
    loadProjects();
    setTimeout(() => {
      if (searchInput) {
        searchInput.focus();
      }
    }, 100);
  }
  function closeDropdown() {
    const dropdown = document.getElementById("advanced-selector-dropdown");
    const searchInput = document.getElementById("advanced-selector-search");
    dropdown.style.display = "none";
    isDropdownOpen = false;
    if (searchInput) {
      searchInput.value = "";
    }
    previousSearchTerms = ["", "", ""];
  }
  function handleEnterKey() {
    const selectedItem = document.querySelector("#advanced-selector-items .advanced-selector-item.selected");
    if (!selectedItem) return;
    const addBtn = selectedItem.querySelector(".btn-success");
    const removeBtn = selectedItem.querySelector(".btn-danger");
    if (addBtn) {
      addBtn.click();
    } else if (removeBtn) {
      removeBtn.click();
    }
  }
  function navigateItems(direction) {
    const itemsContainer = document.getElementById("advanced-selector-items");
    const items = Array.from(itemsContainer.querySelectorAll(".advanced-selector-item"));
    if (items.length === 0) return;
    const currentSelected = items.findIndex((item) => item.classList.contains("selected"));
    let newIndex;
    if (currentSelected === -1) {
      newIndex = direction === "down" ? 0 : items.length - 1;
    } else {
      if (direction === "down") {
        newIndex = Math.min(currentSelected + 1, items.length - 1);
      } else {
        newIndex = Math.max(currentSelected - 1, 0);
      }
    }
    items.forEach((item) => item.classList.remove("selected"));
    items[newIndex].classList.add("selected");
    items[newIndex].scrollIntoView({ block: "nearest", behavior: "smooth" });
  }
  async function handleUnifiedSearch(searchString, preserveItemId = null) {
    const terms = searchString.trim().split(/\s+/).filter((t) => t.length > 0);
    const currentTerms = [terms[0] || "", terms[1] || "", terms[2] || ""];
    const term0Changed = currentTerms[0] !== previousSearchTerms[0];
    const term1Changed = currentTerms[1] !== previousSearchTerms[1];
    const term2Changed = currentTerms[2] !== previousSearchTerms[2];
    if (terms.length === 0) {
      selectedProjectId = null;
      selectedTodoListId = null;
      selectedTodoItemIds.clear();
      renderProjects(allProjects);
      document.getElementById("advanced-selector-categories").innerHTML = "";
      document.getElementById("advanced-selector-items").innerHTML = "";
      previousSearchTerms = ["", "", ""];
      return;
    }
    const matchingProjects = fuzzyFilter(allProjects, terms[0]);
    renderProjects(matchingProjects);
    if (matchingProjects.length > 0) {
      let projectToSelect;
      if (term0Changed || !selectedProjectId) {
        projectToSelect = matchingProjects[0];
        selectedProjectId = projectToSelect.value;
        selectedTodoListId = null;
        selectedTodoItemIds.clear();
      } else {
        projectToSelect = matchingProjects.find((p) => p.value == selectedProjectId);
        if (!projectToSelect) {
          projectToSelect = matchingProjects[0];
          selectedProjectId = projectToSelect.value;
          selectedTodoListId = null;
          selectedTodoItemIds.clear();
        }
      }
      document.querySelectorAll("#advanced-selector-projects .advanced-selector-item").forEach((el) => {
        el.classList.remove("selected");
      });
      const projectItem = document.querySelector(`#advanced-selector-projects .advanced-selector-item[data-id="${selectedProjectId}"]`);
      if (projectItem) {
        projectItem.classList.add("selected");
      }
      const needToLoadLists = term0Changed || loadedTodoLists.length === 0 || !document.querySelector("#advanced-selector-categories .advanced-selector-item");
      if (needToLoadLists) {
        document.getElementById("advanced-selector-categories").innerHTML = '<div class="advanced-selector-loading">Betöltés...</div>';
        document.getElementById("advanced-selector-items").innerHTML = "";
        await loadTodoLists(selectedProjectId);
      }
      if (terms.length >= 2) {
        const matchingLists = fuzzyFilter(loadedTodoLists, terms[1]);
        renderTodoLists(matchingLists);
        if (matchingLists.length > 0) {
          let listToSelect;
          if (term0Changed || term1Changed || !selectedTodoListId) {
            listToSelect = matchingLists[0];
            selectedTodoListId = listToSelect.id;
            selectedTodoItemIds.clear();
          } else {
            listToSelect = matchingLists.find((l) => l.id == selectedTodoListId);
            if (!listToSelect) {
              listToSelect = matchingLists[0];
              selectedTodoListId = listToSelect.id;
              selectedTodoItemIds.clear();
            }
          }
          document.querySelectorAll("#advanced-selector-categories .advanced-selector-item").forEach((el) => {
            el.classList.remove("selected");
          });
          const listItem = document.querySelector(`#advanced-selector-categories .advanced-selector-item[data-id="${selectedTodoListId}"]`);
          if (listItem) {
            listItem.classList.add("selected");
          }
          const needToLoadItems = term0Changed || term1Changed || loadedTodoItems.length === 0 || !document.querySelector("#advanced-selector-items .advanced-selector-item");
          if (needToLoadItems) {
            document.getElementById("advanced-selector-items").innerHTML = '<div class="advanced-selector-loading">Betöltés...</div>';
            await loadTodoItems(selectedTodoListId);
          }
          if (terms.length >= 3) {
            const matchingItems = fuzzyFilter(loadedTodoItems, terms[2]);
            renderTodoItems(matchingItems);
            if (matchingItems.length > 0) {
              const currentSelectedItem = document.querySelector("#advanced-selector-items .advanced-selector-item.selected");
              const currentSelectedItemId = currentSelectedItem ? currentSelectedItem.dataset.id : null;
              if (term0Changed || term1Changed || term2Changed || !currentSelectedItemId) {
                document.querySelectorAll("#advanced-selector-items .advanced-selector-item").forEach((el) => {
                  el.classList.remove("selected");
                });
                const itemToSelect = preserveItemId ? matchingItems.find((item) => item.id == preserveItemId) || matchingItems[0] : matchingItems[0];
                const itemElement = document.querySelector(`#advanced-selector-items .advanced-selector-item[data-id="${itemToSelect.id}"]`);
                if (itemElement) {
                  itemElement.classList.add("selected");
                }
              } else {
                const stillExists = matchingItems.find((item) => item.id == currentSelectedItemId);
                if (!stillExists) {
                  document.querySelectorAll("#advanced-selector-items .advanced-selector-item").forEach((el) => {
                    el.classList.remove("selected");
                  });
                  const itemElement = document.querySelector(`#advanced-selector-items .advanced-selector-item[data-id="${matchingItems[0].id}"]`);
                  if (itemElement) {
                    itemElement.classList.add("selected");
                  }
                }
              }
            }
          } else {
            renderTodoItems(loadedTodoItems);
            if (loadedTodoItems.length > 0) {
              const currentSelectedItem = document.querySelector("#advanced-selector-items .advanced-selector-item.selected");
              const currentSelectedItemId = currentSelectedItem ? currentSelectedItem.dataset.id : null;
              if (term0Changed || term1Changed || !currentSelectedItemId) {
                const itemToSelect = preserveItemId ? loadedTodoItems.find((item) => item.id == preserveItemId) || loadedTodoItems[0] : loadedTodoItems[0];
                const itemElement = document.querySelector(`#advanced-selector-items .advanced-selector-item[data-id="${itemToSelect.id}"]`);
                if (itemElement) {
                  itemElement.classList.add("selected");
                }
              }
            }
          }
        } else {
          selectedTodoListId = null;
          selectedTodoItemIds.clear();
          document.getElementById("advanced-selector-items").innerHTML = "";
        }
      } else {
        renderTodoLists(loadedTodoLists);
        if (loadedTodoLists.length > 0) {
          if (term0Changed || !selectedTodoListId) {
            const firstList = loadedTodoLists[0];
            selectedTodoListId = firstList.id;
            selectedTodoItemIds.clear();
          }
          const listExists = loadedTodoLists.find((l) => l.id == selectedTodoListId);
          if (!listExists) {
            selectedTodoListId = loadedTodoLists[0].id;
            selectedTodoItemIds.clear();
          }
          const listItem = document.querySelector(`#advanced-selector-categories .advanced-selector-item[data-id="${selectedTodoListId}"]`);
          if (listItem) {
            listItem.classList.add("selected");
          }
          const needToLoadItems = term0Changed || loadedTodoItems.length === 0 || !document.querySelector("#advanced-selector-items .advanced-selector-item");
          if (needToLoadItems) {
            document.getElementById("advanced-selector-items").innerHTML = '<div class="advanced-selector-loading">Betöltés...</div>';
            await loadTodoItems(selectedTodoListId);
          }
          if (loadedTodoItems.length > 0) {
            renderTodoItems(loadedTodoItems);
            const currentSelectedItem = document.querySelector("#advanced-selector-items .advanced-selector-item.selected");
            const currentSelectedItemId = currentSelectedItem ? currentSelectedItem.dataset.id : null;
            if (term0Changed || !currentSelectedItemId) {
              const itemToSelect = preserveItemId ? loadedTodoItems.find((item) => item.id == preserveItemId) || loadedTodoItems[0] : loadedTodoItems[0];
              const itemElement = document.querySelector(`#advanced-selector-items .advanced-selector-item[data-id="${itemToSelect.id}"]`);
              if (itemElement) {
                itemElement.classList.add("selected");
              }
            }
          } else {
            renderTodoItems(loadedTodoItems);
          }
        } else {
          selectedTodoListId = null;
          selectedTodoItemIds.clear();
          document.getElementById("advanced-selector-items").innerHTML = "";
        }
      }
    } else {
      selectedProjectId = null;
      selectedTodoListId = null;
      selectedTodoItemIds.clear();
      document.getElementById("advanced-selector-categories").innerHTML = "";
      document.getElementById("advanced-selector-items").innerHTML = "";
    }
    previousSearchTerms = currentTerms;
  }
  function loadProjects() {
    const projectSelect = document.getElementById("project_id");
    if (!projectSelect) {
      console.error("Project selector not found");
      return;
    }
    allProjects = [];
    const optgroups = projectSelect.querySelectorAll("optgroup");
    optgroups.forEach((optgroup) => {
      const categoryLabel = optgroup.getAttribute("label");
      const options = optgroup.querySelectorAll("option");
      options.forEach((option) => {
        if (!option.value) return;
        allProjects.push({
          value: option.value,
          label: option.textContent,
          categoryLabel
        });
      });
    });
    renderProjects(allProjects);
  }
  function renderProjects(projects) {
    const projectsContainer = document.getElementById("advanced-selector-projects");
    projectsContainer.innerHTML = "";
    const byCategory = {};
    projects.forEach((project) => {
      if (!byCategory[project.categoryLabel]) {
        byCategory[project.categoryLabel] = [];
      }
      byCategory[project.categoryLabel].push(project);
    });
    Object.keys(byCategory).forEach((categoryLabel) => {
      const categoryHeader = document.createElement("div");
      categoryHeader.className = "advanced-selector-category-header";
      categoryHeader.textContent = categoryLabel;
      projectsContainer.appendChild(categoryHeader);
      byCategory[categoryLabel].forEach((project) => {
        const item = createSelectableItem({
          id: project.value,
          label: project.label,
          type: "project",
          categoryLabel: project.categoryLabel
        });
        projectsContainer.appendChild(item);
      });
    });
  }
  async function loadTodoLists(projectId) {
    const categoriesContainer = document.getElementById("advanced-selector-categories");
    categoriesContainer.innerHTML = '<div class="advanced-selector-loading">Betöltés...</div>';
    try {
      loadedTodoLists = await fetchAndCache(
        `/get_todo_lists?project_id=${projectId}&show_completed=false`,
        `projectId-${projectId}`
      );
      renderTodoLists(loadedTodoLists);
    } catch (error) {
      console.error("Error loading todo lists:", error);
      document.getElementById("advanced-selector-categories").innerHTML = '<div class="advanced-selector-error">Hiba történt a betöltés során</div>';
    }
  }
  function renderTodoLists(todoLists) {
    const categoriesContainer = document.getElementById("advanced-selector-categories");
    categoriesContainer.innerHTML = "";
    if (todoLists.length === 0) {
      categoriesContainer.innerHTML = '<div class="advanced-selector-empty">Nincs elérhető kategória</div>';
      return;
    }
    todoLists.forEach((list) => {
      const item = createSelectableItem({
        id: list.id,
        label: list.name,
        type: "todoList"
      });
      categoriesContainer.appendChild(item);
    });
  }
  async function loadTodoItems(todoListId) {
    const itemsContainer = document.getElementById("advanced-selector-items");
    itemsContainer.innerHTML = '<div class="advanced-selector-loading">Betöltés...</div>';
    try {
      loadedTodoItems = await fetchAndCache(
        `/get_todo_items?todo_list_id=${todoListId}&show_completed=false`,
        `todoListId-${todoListId}`
      );
      renderTodoItems(loadedTodoItems);
    } catch (error) {
      console.error("Error loading todo items:", error);
      document.getElementById("advanced-selector-items").innerHTML = '<div class="advanced-selector-error">Hiba történt a betöltés során</div>';
    }
  }
  function renderTodoItems(todoItems) {
    const itemsContainer = document.getElementById("advanced-selector-items");
    itemsContainer.innerHTML = "";
    if (todoItems.length === 0) {
      itemsContainer.innerHTML = '<div class="advanced-selector-empty">Nincs elérhető elem</div>';
      return;
    }
    todoItems.forEach((item) => {
      const itemElement = createSelectableItem({
        id: item.id,
        label: item.content,
        type: "todoItem",
        multiSelect: true
      });
      itemsContainer.appendChild(itemElement);
    });
  }
  function createSelectableItem(config) {
    const { id, label, type, categoryLabel, multiSelect } = config;
    const item = document.createElement("div");
    item.className = "advanced-selector-item";
    item.dataset.id = id;
    item.dataset.type = type;
    item.dataset.label = label;
    if (categoryLabel) {
      item.dataset.categoryLabel = categoryLabel;
    }
    const isInFavorites = checkIfInFavorites(type, id);
    if (isInFavorites) {
      item.classList.add("in-favorites");
    }
    const itemLabel = document.createElement("span");
    itemLabel.className = "advanced-selector-item-label";
    itemLabel.textContent = label;
    item.appendChild(itemLabel);
    if (type === "todoItem") {
      const actions = document.createElement("div");
      actions.className = "advanced-selector-item-actions";
      if (isInFavorites) {
        const removeBtn = document.createElement("button");
        removeBtn.className = "btn btn-mini btn-danger";
        removeBtn.textContent = "−";
        removeBtn.title = "Eltávolítás a kedvencekből";
        removeBtn.onclick = (e) => {
          e.stopPropagation();
          removeFromFavorites(type, id);
        };
        actions.appendChild(removeBtn);
      } else {
        const addBtn = document.createElement("button");
        addBtn.className = "btn btn-mini btn-success";
        addBtn.textContent = "+";
        addBtn.title = "Hozzáadás a kedvencekhez";
        addBtn.onclick = (e) => {
          e.stopPropagation();
          addToFavorites(item);
        };
        actions.appendChild(addBtn);
      }
      item.appendChild(actions);
    }
    item.addEventListener("click", () => {
      handleItemClick(type, id, item, multiSelect);
    });
    return item;
  }
  function handleItemClick(type, id, itemElement, multiSelect) {
    if (type === "project") {
      document.querySelectorAll("#advanced-selector-projects .advanced-selector-item").forEach((el) => {
        el.classList.remove("selected");
      });
      itemElement.classList.add("selected");
      selectedProjectId = id;
      selectedTodoListId = null;
      selectedTodoItemIds.clear();
      document.getElementById("advanced-selector-categories").innerHTML = "";
      document.getElementById("advanced-selector-items").innerHTML = "";
      loadTodoLists(id);
    } else if (type === "todoList") {
      document.querySelectorAll("#advanced-selector-categories .advanced-selector-item").forEach((el) => {
        el.classList.remove("selected");
      });
      itemElement.classList.add("selected");
      selectedTodoListId = id;
      selectedTodoItemIds.clear();
      document.getElementById("advanced-selector-items").innerHTML = "";
      loadTodoItems(id);
    } else if (type === "todoItem" && multiSelect) {
      itemElement.classList.toggle("selected");
      if (itemElement.classList.contains("selected")) {
        selectedTodoItemIds.add(id);
      } else {
        selectedTodoItemIds.delete(id);
      }
    }
  }
  function checkIfInFavorites(type, id) {
    if (type === "project") {
      return favorites.some((fav) => fav.project_id?.value == id && !fav.todo_list_id);
    } else if (type === "todoList") {
      return favorites.some(
        (fav) => fav.project_id?.value == selectedProjectId && fav.todo_list_id?.value == id && !fav.todo_item_id
      );
    } else if (type === "todoItem") {
      return favorites.some(
        (fav) => fav.project_id?.value == selectedProjectId && fav.todo_list_id?.value == selectedTodoListId && fav.todo_item_id?.value == id
      );
    }
    return false;
  }
  function addToFavorites(itemElement) {
    const type = itemElement.dataset.type;
    const id = itemElement.dataset.id;
    const label = itemElement.dataset.label;
    if (type === "project") {
      const fav = {
        label: "",
        id: `${( new Date()).getTime()}${Math.round(Math.random() * 1e3)}`,
        project_id: {
          label,
          value: id
        }
      };
      favorites.push(fav);
    } else if (type === "todoList") {
      if (!selectedProjectId) return;
      const projectSelect = document.getElementById("project_id");
      const projectOption = projectSelect.querySelector(`option[value="${selectedProjectId}"]`);
      const fav = {
        label: "",
        id: `${( new Date()).getTime()}${Math.round(Math.random() * 1e3)}`,
        project_id: {
          label: projectOption.textContent,
          value: selectedProjectId
        },
        todo_list_id: {
          label,
          value: id
        }
      };
      favorites.push(fav);
    } else if (type === "todoItem") {
      if (!selectedProjectId || !selectedTodoListId) return;
      const projectSelect = document.getElementById("project_id");
      const projectOption = projectSelect.querySelector(`option[value="${selectedProjectId}"]`);
      const todoListElement = document.querySelector(`#advanced-selector-categories .advanced-selector-item.selected`);
      const todoListLabel = todoListElement ? todoListElement.dataset.label : "";
      const itemsToAdd = selectedTodoItemIds.size > 0 ? Array.from(selectedTodoItemIds) : [id];
      itemsToAdd.forEach((itemId) => {
        const itemEl = document.querySelector(`#advanced-selector-items .advanced-selector-item[data-id="${itemId}"]`);
        const itemLabel = itemEl ? itemEl.dataset.label : "";
        const fav = {
          label: "",
          id: `${( new Date()).getTime()}${Math.round(Math.random() * 1e3)}`,
          project_id: {
            label: projectOption.textContent,
            value: selectedProjectId
          },
          todo_list_id: {
            label: todoListLabel,
            value: selectedTodoListId
          },
          todo_item_id: {
            label: itemLabel,
            value: itemId
          }
        };
        favorites.push(fav);
      });
    }
    saveFavorites();
    renderFavs();
    if (applyQuickFilter) {
      applyQuickFilter();
    }
    refreshCurrentView();
  }
  function removeFromFavorites(type, id) {
    let indicesToRemove = [];
    if (type === "project") {
      indicesToRemove = favorites.map((fav, index) => fav.project_id?.value == id && !fav.todo_list_id ? index : -1).filter((index) => index !== -1);
    } else if (type === "todoList") {
      indicesToRemove = favorites.map(
        (fav, index) => fav.project_id?.value == selectedProjectId && fav.todo_list_id?.value == id && !fav.todo_item_id ? index : -1
      ).filter((index) => index !== -1);
    } else if (type === "todoItem") {
      indicesToRemove = favorites.map(
        (fav, index) => fav.project_id?.value == selectedProjectId && fav.todo_list_id?.value == selectedTodoListId && fav.todo_item_id?.value == id ? index : -1
      ).filter((index) => index !== -1);
    }
    indicesToRemove.reverse().forEach((index) => {
      favorites.splice(index, 1);
    });
    saveFavorites();
    renderFavs();
    if (applyQuickFilter) {
      applyQuickFilter();
    }
    refreshCurrentView();
  }
  function refreshCurrentView() {
    const searchInput = document.getElementById("advanced-selector-search");
    const currentSearch = searchInput ? searchInput.value : "";
    const currentlySelectedItem = document.querySelector("#advanced-selector-items .advanced-selector-item.selected");
    const selectedItemId = currentlySelectedItem ? currentlySelectedItem.dataset.id : null;
    if (currentSearch) {
      handleUnifiedSearch(currentSearch, selectedItemId);
    } else {
      if (selectedProjectId) {
        loadProjects();
        if (selectedTodoListId) {
          loadTodoLists(selectedProjectId).then(() => {
            const todoListItem = document.querySelector(`#advanced-selector-categories .advanced-selector-item[data-id="${selectedTodoListId}"]`);
            if (todoListItem) {
              todoListItem.classList.add("selected");
              loadTodoItems(selectedTodoListId);
            }
          });
        }
      } else {
        loadProjects();
      }
    }
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
      <img src="${logoUrl}" alt="ArpyEnhance" class="brand-logo">
      <span class="brand-text">ArpyEnhance</span>
    </li>
    <li>
      <a href="#" id="settings-button" class="arpy-enhance-settings-btn">
        <span class="settings-icon">⚙</span>
        <span>Beállítások</span>
      </a>
    </li>
    <li class="theme-toggle-container">
      <label class="theme-toggle-switch">
        <input type="checkbox" id="theme-toggle-checkbox" ${currentTheme2 === "dark" ? "checked" : ""}>
        <span class="theme-slider">
          <svg class="theme-icon-light" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="5" fill="currentColor"/>
            <path d="M12 1v3M12 20v3M22 12h-3M5 12H2M19.07 4.93l-2.12 2.12M7.05 16.95l-2.12 2.12M19.07 19.07l-2.12-2.12M7.05 7.05L4.93 4.93" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <svg class="theme-icon-dark" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor"/>
          </svg>
        </span>
      </label>
    </li>
  `;
    mainNav.parentNode.insertBefore(arpyEnhanceNav, mainNav.nextSibling);
    document.getElementById("settings-button").addEventListener("click", (e) => {
      e.preventDefault();
      if (showSettingsModal$1) {
        showSettingsModal$1();
      }
    });
    document.getElementById("theme-toggle-checkbox").addEventListener("change", (e) => {
      if (toggleTheme) {
        toggleTheme();
      }
    });
  }
  let applyTheme = null;
  let updatePreview$2 = null;
  let updateMonacoLayout$2 = null;
  function initSettingsModalModule(deps) {
    applyTheme = deps.applyTheme;
    updatePreview$2 = deps.updatePreview;
    updateMonacoLayout$2 = deps.updateMonacoLayout;
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
    const oldShowProgress = settings.showProgressIndicator;
    const oldFavsMaximized = settings.favsMaximized;
    const oldPanelsSwapped = settings.panelsSwapped;
    settingsManager.set("redmineApiKey", document.getElementById("setting-redmine-api-key").value);
    settingsManager.set("redmineCacheTtlHours", parseInt(document.getElementById("setting-cache-ttl").value));
    settingsManager.set("theme", document.querySelector('input[name="setting-theme"]:checked').value);
    settingsManager.set("targetWorkHours", parseFloat(document.getElementById("setting-target-hours").value));
    settingsManager.set("maxDisplayHours", parseFloat(document.getElementById("setting-max-hours").value));
    settingsManager.set("showProgressIndicator", document.getElementById("setting-show-progress").checked);
    settingsManager.set("showEditorHourIndicator", document.getElementById("setting-show-editor-hours").checked);
    settingsManager.set("favsMaximized", document.getElementById("setting-favs-maximized").checked);
    settingsManager.set("panelsSwapped", document.getElementById("setting-panels-swapped").checked);
    const newSettings = settingsManager.getSettings();
    if (oldTheme !== newSettings.theme && applyTheme) {
      applyTheme(newSettings.theme);
    }
    document.documentElement.style.setProperty("--target-hours", newSettings.targetWorkHours);
    document.documentElement.style.setProperty("--max-hours", newSettings.maxDisplayHours);
    if ((oldTargetHours !== newSettings.targetWorkHours || oldMaxHours !== newSettings.maxDisplayHours || oldShowEditorHours !== newSettings.showEditorHourIndicator || oldShowProgress !== newSettings.showProgressIndicator) && updatePreview$2) {
      updatePreview$2();
    }
    if (oldFavsMaximized !== newSettings.favsMaximized) {
      const favoritesPanel = document.querySelector("#favorites-container");
      const wrapper = document.querySelector("#editor-preview-wrapper");
      const maximizeButton = document.querySelector("#maximize-button");
      if (newSettings.favsMaximized) {
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
      if (updateMonacoLayout$2) {
        setTimeout(updateMonacoLayout$2, 50);
      }
    }
    if (oldPanelsSwapped !== newSettings.panelsSwapped) {
      const timelogPage = document.querySelector("#timelog-page");
      if (newSettings.panelsSwapped) {
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
  const HELP_TEXT = `-- Formátum help --
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
Ha egy kategória címke neve elejére vagy a végére / vagy \\ karaktert rakunk, akkor csak a közvetlenül utána következő sorra lesz érvényes.

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
  function createHelpModal() {
    const helpModalHTML = `
    <div class="modal" id="helpModal" tabindex="-1" role="dialog" aria-labelledby="helpModalLabel" aria-hidden="true" style="display: none;">
    <div class="modal-header">
      <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
      <h3 id="myModalLabel">Formátum help</h3>
    </div>
    <div class="modal-body">
      <pre>${HELP_TEXT}</pre>
    </div>
    </div>
  `;
    $("body").append(helpModalHTML);
  }
  function setupHelpModalButton() {
    $("#open-help-dialog").button().on("click", () => {
      $("#helpModal").modal();
    });
  }
  function getHelpText() {
    return HELP_TEXT;
  }
  function createProgressIndicator() {
    $("#time_entry_submit").before(`
    <span id="status"></span>&nbsp;
    <div id="enhance-progress" class="progress progress-striped active" style="display: none;">
      <div id="enhance-progress-bar" class="bar"></div>
    </div>
  `);
  }
  function createBatchSubmitButton() {
    $("#time_entry_submit").before(
      `<button class="btn btn-sm" type="button" id="open-help-dialog" title="Formátum help"><span class="i">❓</span></button>`
    );
    $("#time_entry_submit").before(
      `<button class="btn ${"btn-primary"} btn-large" type="button" id="submit-batch-button">Mentés!</button>&nbsp;`
    );
  }
  function createFavoriteAddButton() {
    $("#todo_item_id").after(
      '<button class="btn btn-primary btn-sm" type="button" id="add-fav-button"><span class="i">★</span> Fav</button>'
    );
  }
  function createBatchTextarea(placeholderText) {
    $("#time_entry_description").after(
      `<textarea id="batch-textarea" placeholder="${placeholderText}" class="textarea ui-widget-content ui-corner-all" spellcheck="false"></textarea>`
    );
  }
  function wrapTimeEntryContainer() {
    const timeEntryContainer = document.getElementById("time_entry_container");
    timeEntryContainer.classList.add("panel");
    const timeEntryContent = document.createElement("div");
    timeEntryContent.className = "panel-content";
    while (timeEntryContainer.firstChild) {
      timeEntryContent.appendChild(timeEntryContainer.firstChild);
    }
    timeEntryContainer.appendChild(timeEntryContent);
    $("#time_entry_container").prepend(`
    <div class="panel-header">
      <div class="panel-header-title">Szerkesztő</div>
      <div class="panel-header-actions">
        <button type="button" class="btn btn-mini panel-swap-button" title="Panelek cseréje">⬌</button>
      </div>
    </div>
  `);
  }
  function createPreviewContainer() {
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
  function wrapEditorAndPreview() {
    $("#time_entry_container, #preview-container").wrapAll('<div id="editor-preview-wrapper"></div>');
  }
  function wrapMonthAndTimeLog() {
    $("#month_selector, #time_log").wrapAll('<div id="month-timelog-container" class="panel"></div>');
    $("#month-timelog-container").prepend(`
    <div class="panel-header">
      <div class="panel-header-title">Időnapló</div>
    </div>
  `);
    const container = document.getElementById("month-timelog-container");
    const panelContent = document.createElement("div");
    panelContent.className = "panel-content";
    const monthSelector = document.getElementById("month_selector");
    const timeLog = document.getElementById("time_log");
    if (monthSelector) panelContent.appendChild(monthSelector);
    if (timeLog) panelContent.appendChild(timeLog);
    container.appendChild(panelContent);
  }
  function createFavoritesContainer() {
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
          placeholder="Fuzzy keresés: első szó ⯈ projekt, második szó ⯈ todo lista, harmadik szó ⯈ todo elem (pl: &quot;ham ált fejl&quot;)"
          autocomplete="off"
        />
      </div>
      <div class="advanced-selector-content">
        <div class="advanced-selector-section">
          <div class="advanced-selector-section-title">Projektek</div>
          <div id="advanced-selector-projects" class="advanced-selector-list"></div>
        </div>
        <div class="advanced-selector-section">
          <div class="advanced-selector-section-title">TODO Listák</div>
          <div id="advanced-selector-categories" class="advanced-selector-list">
            <div class="advanced-selector-info">2. szó szűri ezt a listát</div>
          </div>
        </div>
        <div class="advanced-selector-section">
          <div class="advanced-selector-section-title">TODO elemek</div>
          <div id="advanced-selector-items" class="advanced-selector-list">
            <div class="advanced-selector-info">3. szó szűri ezt a listát<br>↑↓ navigáció, Enter hozzáadás</div>
          </div>
        </div>
      </div>
    </div>
  </div>`);
  }
  function initializeDOMStructure(helpText) {
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
  let updateMonacoLayout$1 = null;
  function initPanelManager(deps) {
    updateMonacoLayout$1 = deps.updateMonacoLayout;
  }
  function setupMinimalResizing() {
    const topPanel = document.getElementById("favorites-container");
    const bottomWrapper = document.getElementById("editor-preview-wrapper");
    if (!topPanel || !bottomWrapper) {
      return;
    }
    const resizer = document.createElement("div");
    resizer.id = "minimal-vertical-resizer";
    topPanel.appendChild(resizer);
    const STORAGE_KEY = "arpyEnhanceTopPanelVh";
    const DEFAULT_TOP_VH = 20;
    const applyVhHeights = (topVh) => {
      if (typeof topVh !== "number" || isNaN(topVh)) {
        return;
      }
      const constrainedTopVh = Math.max(2, Math.min(topVh, 90));
      const bottomVh = 100 - constrainedTopVh;
      topPanel.style.height = `${constrainedTopVh}vh`;
      topPanel.style.maxHeight = `${constrainedTopVh}vh`;
      const bottomHeightCss = `calc(${bottomVh}vh - ${ORIGINAL_BOTTOM_OFFSET_PX}px)`;
      bottomWrapper.style.height = bottomHeightCss;
    };
    const savedVh = unsafeWindow.localStorage.getItem(STORAGE_KEY);
    if (!topPanel.classList.contains("maximalized")) {
      applyVhHeights(savedVh ? parseFloat(savedVh) : DEFAULT_TOP_VH);
    }
    resizer.addEventListener("mousedown", (e) => {
      e.preventDefault();
      const computedStyle = window.getComputedStyle(topPanel);
      const verticalPadding = parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom);
      const verticalBorder = parseFloat(computedStyle.borderTopWidth) + parseFloat(computedStyle.borderBottomWidth);
      const nonContentHeight = verticalPadding + verticalBorder;
      const startY_px = e.clientY;
      const startTopContentHeight_px = topPanel.offsetHeight - nonContentHeight;
      const viewportHeight_px = window.innerHeight;
      let moveRAF;
      const handleMouseMove = (moveEvent) => {
        const deltaY_px = moveEvent.clientY - startY_px;
        const newTopContentHeight_px = startTopContentHeight_px + deltaY_px;
        const newTop_vh = newTopContentHeight_px / viewportHeight_px * 100;
        applyVhHeights(newTop_vh);
        if (moveRAF) {
          cancelAnimationFrame(moveRAF);
        }
        if (updateMonacoLayout$1) {
          moveRAF = requestAnimationFrame(updateMonacoLayout$1);
        }
      };
      const handleMouseUp = () => {
        const finalContentHeight_px = topPanel.offsetHeight - nonContentHeight;
        const final_vh = finalContentHeight_px / window.innerHeight * 100;
        localStorage.setItem(STORAGE_KEY, final_vh.toFixed(2));
        if (updateMonacoLayout$1) {
          setTimeout(updateMonacoLayout$1, 50);
        }
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    });
  }
  function setupMaximalizeState() {
    if (unsafeWindow.localStorage.getItem("arpyEnhanceFavsMaxed") === "true") {
      const favoritesPanel = document.querySelector("#favorites-container");
      const wrapper = document.querySelector("#editor-preview-wrapper");
      const maximizeButton = document.querySelector("#maximize-button");
      if (favoritesPanel && wrapper && maximizeButton) {
        favoritesPanel.classList.add("maximalized");
        maximizeButton.innerHTML = "◱";
        wrapper.style.height = "85vh";
        favoritesPanel.style.height = "";
        favoritesPanel.style.maxHeight = "";
      }
    }
  }
  function setupPanelSwapState() {
    if (unsafeWindow.localStorage.getItem("arpyEnhancePanelsSwapped") === "true") {
      const timelogPage = document.querySelector("#timelog-page");
      if (timelogPage) {
        timelogPage.classList.add("panels-swapped");
      }
    }
  }
  function setupMaximizeButton() {
    const maximizeButton = document.querySelector("#maximize-button");
    if (!maximizeButton) {
      return;
    }
    maximizeButton.addEventListener("click", function() {
      const favoritesPanel = document.querySelector("#favorites-container");
      const wrapper = document.querySelector("#editor-preview-wrapper");
      if (!favoritesPanel || !wrapper) {
        return;
      }
      favoritesPanel.classList.toggle("maximalized");
      if (favoritesPanel.classList.contains("maximalized")) {
        localStorage.setItem("arpyEnhanceFavsMaxed", "true");
        maximizeButton.innerHTML = "◱";
        wrapper.style.height = "85vh";
        favoritesPanel.style.height = "";
        favoritesPanel.style.maxHeight = "";
      } else {
        localStorage.removeItem("arpyEnhanceFavsMaxed");
        maximizeButton.innerHTML = "⬍";
        const savedVh = parseFloat(localStorage.getItem("arpyEnhanceTopPanelVh") || "20");
        const bottomVh = 100 - savedVh;
        favoritesPanel.style.height = `${savedVh}vh`;
        favoritesPanel.style.maxHeight = `${savedVh}vh`;
        wrapper.style.height = `calc(${bottomVh}vh - ${ORIGINAL_BOTTOM_OFFSET_PX}px)`;
      }
      if (updateMonacoLayout$1) {
        setTimeout(updateMonacoLayout$1, 50);
      }
    });
  }
  function setupPanelSwapButtons() {
    const panelSwapButtons = document.querySelectorAll(".panel-swap-button");
    panelSwapButtons.forEach((button) => {
      button.addEventListener("click", function() {
        const timelogPage = document.querySelector("#timelog-page");
        if (!timelogPage) {
          return;
        }
        timelogPage.classList.toggle("panels-swapped");
        if (timelogPage.classList.contains("panels-swapped")) {
          localStorage.setItem("arpyEnhancePanelsSwapped", "true");
        } else {
          localStorage.removeItem("arpyEnhancePanelsSwapped");
        }
      });
    });
  }
  function initializePanels() {
    setupMinimalResizing();
    setupMaximalizeState();
    setupPanelSwapState();
    setupMaximizeButton();
    setupPanelSwapButtons();
  }
  let monacoEditorInstance$1 = null;
  function setMonacoInstance(instance) {
    monacoEditorInstance$1 = instance;
  }
  function updateMonacoLayout() {
    if (monacoEditorInstance$1) {
      const editorContainer = document.getElementById("monaco-editor-container");
      if (editorContainer) {
        const rect = editorContainer.getBoundingClientRect();
        monacoEditorInstance$1.layout({ width: rect.width, height: rect.height });
      }
    }
  }
  let monacoEditorInstance = null;
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
[/^\s*#.*$/, "comment"],
[/^\s*(\d{4}-\d{2}-\d{2}|\d{2}-\d{2})\s*$/, "date.label"],
[/^\s*\S+\s*$/, "category.label"],
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
[/\s+/, ""],
[/(\d+([,.]\d+)?)/, { token: "number", next: "@expect_description" }],
[/.*$/, { token: "invalid", next: "@popall" }]
        ],
        expect_description: [


[/\s/, ""],
[/#\d+/, { token: "ticket.number", next: "@description_rest" }],

["", { token: "", next: "@description_rest" }]
        ],
        description_rest: [
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
{ token: "date.label", foreground: "#008000", fontStyle: "bold" },
{
          token: "category.label",
          foreground: "#9400D3",
          fontStyle: "bold"
        },
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
        monacoEditorInstance = editor;
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
  let asyncStatus = {
    start: {},
    end: {}
  };
  let currentParseGeneration = 0;
  function resetAsyncProgress() {
    asyncStatus = {
      start: {},
      end: {}
    };
    currentParseGeneration++;
    return currentParseGeneration;
  }
  function updateAsyncProgress(type, status2, generation) {
    if (generation !== currentParseGeneration) {
      return;
    }
    asyncStatus[status2][type] = (asyncStatus[status2][type] || 0) + 1;
    const previewContent = document.getElementById("preview-content");
    if (previewContent) {
      const progressHTML = Object.entries(asyncStatus.start).map(([type2, count]) => {
        const completed = asyncStatus.end[type2] || 0;
        const percentage = completed / count * 100;
        const typeLabel = {
          "issue": "Redmine ticketek",
          "todoList": "Projekt listák",
          "todoItems": "Projekt elemek"
        }[type2] || type2;
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
  function findTodoDataByFullLabelString(_fullLabelString, favorites2) {
    function removeDays(str) {
      return str.replace(/\W?\(\d+(,\d+)? nap\)\W?/, "").replace(/\W?\(\d+(\.\d+)?d\)\W?/, "").replace(/  +/g, " ");
    }
    const fullLabelString = removeDays(_fullLabelString);
    const favorite = favorites2.find((fav) => {
      const fullLabelForFav = removeDays(getFullLabelPartsForFav(fav).join(" / ")).trim();
      return fullLabelString === fullLabelForFav;
    });
    return favorite;
  }
  async function parseBatchData(textareaValue, favorites2, options = {}) {
    const parseGeneration = resetAsyncProgress();
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
    const lines = textareaValue.split(/\r?\n/);
    const parsedBatchData = (await Promise.all(lines.map(async function(line, lineNumber) {
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
      const REDMINE_API_KEY = settingsManager.get("redmineApiKey");
      if (REDMINE_API_KEY && issueNumber?.match(/^\d+$/)) {
        updateAsyncProgress("issue", "start", parseGeneration);
        try {
          const json = await fetchRedmineIssue(issueNumber);
          if (json?.issue) {
            const arpyField = json.issue.custom_fields?.find(({ name }) => name === "Arpy jelentés");
            rmProjectName = json.issue.project.name;
            if (arpyField?.value) {
              const arpyFieldValue = arpyField.value.trim();
              console.group("SEARCH FAV FOR", arpyField.value);
              try {
                console.log("SEARCH FAV FOR", arpyField.value);
                const fav = findTodoDataByFullLabelString(arpyFieldValue, favorites2);
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
                    updateAsyncProgress("todoList", "start", parseGeneration);
                    const todoListResponse = await fetchAndCache$2(
                      `/get_todo_lists?project_id=${projectId}&show_completed=false`,
                      `projectId-${projectId}`
                    );
                    updateAsyncProgress("todoList", "end", parseGeneration);
                    const todoList = todoListResponse.find(({ name }) => name === arpyParts[2]);
                    console.log("todoList", projectId, todoList);
                    if (todoList) {
                      updateAsyncProgress("todoItems", "start", parseGeneration);
                      const todoItems = await fetchAndCache$2(
                        `/get_todo_items?todo_list_id=${todoList.id}&show_completed=false`,
                        `todoListId-${todoList.id}`
                      );
                      updateAsyncProgress("todoItems", "end", parseGeneration);
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
              } finally {
                console.groupEnd("SEARCH FAV FOR", arpyField.value);
              }
            }
          }
        } catch (e) {
          console.error(`Failed to fetch Redmine issue #${issueNumber}:`, e);
        } finally {
          updateAsyncProgress("issue", "end", parseGeneration);
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
          project_id: externallyFetchedProjectData?.project_id || localCurrentProjectData?.project_id,
          todo_list_id: externallyFetchedProjectData?.todo_list_id || localCurrentProjectData?.todo_list_id,
          todo_item_id: externallyFetchedProjectData?.todo_item_id || localCurrentProjectData?.todo_item_id,
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
        outputDataObject.arpyField = externallyFetchedProjectData?.arpyField;
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
  let editorDecorationsCollection = null;
  function updateEditorDecorations(summarizedData) {
    if (!monacoEditorInstance) {
      console.log("No monaco editor instance");
      return;
    }
    const model = monacoEditorInstance.getModel();
    if (!model) {
      console.log("No monaco model");
      return;
    }
    const settings = settingsManager.getSettings();
    if (!settings.showEditorHourIndicator) {
      if (editorDecorationsCollection) {
        editorDecorationsCollection.clear();
      }
      return;
    }
    const decorations = [];
    const dateData = summarizedData.dates || {};
    console.log("Updating editor decorations, dateData:", dateData);
    const TARGET_WORK_HOURS = settings.targetWorkHours;
    settings.maxDisplayHours;
    const lineCount = model.getLineCount();
    for (let lineNumber = 1; lineNumber <= lineCount; lineNumber++) {
      const lineContent = model.getLineContent(lineNumber).trim();
      const dateMatch = lineContent.match(/^(\d{4}-\d{2}-\d{2}|\d{2}-\d{2})$/);
      if (dateMatch) {
        const dateStr = dateMatch[1];
        const fullDate = dateStr.length === 5 ? `${moment().year()}-${dateStr}` : dateStr;
        const dayData = dateData[fullDate];
        if (dayData) {
          const sum = dayData.sum;
          const isOkay = sum >= TARGET_WORK_HOURS;
          const hoursInTarget = Math.min(sum, TARGET_WORK_HOURS);
          const overtimeHours = Math.max(0, sum - TARGET_WORK_HOURS);
          let filledBar = "";
          const fullHours = Math.floor(hoursInTarget);
          const hasHalfHour = hoursInTarget % 1 >= 0.5;
          filledBar = "■".repeat(fullHours);
          if (hasHalfHour) {
            filledBar += "▪";
          }
          const emptySquares = TARGET_WORK_HOURS - Math.ceil(hoursInTarget);
          const emptyBar = "▫".repeat(emptySquares);
          let overtimeBar = "";
          if (overtimeHours > 0) {
            const overtimeFullHours = Math.floor(overtimeHours);
            const overtimeHasHalf = overtimeHours % 1 >= 0.5;
            overtimeBar = "■".repeat(overtimeFullHours);
            if (overtimeHasHalf) {
              overtimeBar += "▪";
            }
          }
          const progressDisplay = `【${filledBar}${emptyBar}】${overtimeBar}`;
          const lineLength = model.getLineContent(lineNumber).length;
          console.log(`Adding decoration for line ${lineNumber}: ${fullDate}, sum: ${sum}h`);
          decorations.push({
            range: new monaco.Range(lineNumber, 1, lineNumber, lineLength + 1),
            options: {
              after: {
                content: `  ${sum}h ${progressDisplay}`,
                inlineClassName: isOkay ? "date-decoration okay" : "date-decoration"
              }
            }
          });
        }
      }
    }
    console.log(`Total decorations created: ${decorations.length}`);
    if (editorDecorationsCollection) {
      editorDecorationsCollection.clear();
    }
    editorDecorationsCollection = monacoEditorInstance.createDecorationsCollection(decorations);
  }
  async function updatePreview() {
    const savedActiveTab = localStorage.getItem("arpyEnhanceActiveTab") || "dates";
    const previewContent = document.getElementById("preview-content");
    const prevScrollTop = previewContent.scrollTop;
    const editorValue = monacoEditorInstance ? monacoEditorInstance.getValue() : document.getElementById("batch-textarea").value;
    const result = await parseBatchData(editorValue, favorites);
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
      const REDMINE_API_KEY = settings.redmineApiKey;
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
        if (isOkay && sumType === "dates") {
          sumRow.classList.add("okay");
        }
        sumRow.appendChild(sumTh);
        if (sumType === "dates") {
          dayHours.push(value.sum);
        }
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
        }
        value.entries.forEach((row, j, rows) => {
          const tr = document.createElement("tr");
          if (value.sum >= 8 && sumType === "dates") {
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
                if (isRedmineIssue && REDMINE_API_KEY && reloadRedmineTicket) {
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
  let status$1 = null;
  function initBatchSubmitModule(deps) {
    status$1 = deps.status;
  }
  function setupBatchSubmitButton() {
    $("#submit-batch-button").button().on("click", async function() {
      console.log("batch button pressed");
      if (status$1) {
        status$1("");
      }
      const editorValue = monacoEditorInstance ? monacoEditorInstance.getValue() : document.getElementById("batch-textarea").value;
      const parsedBatchData = (await parseBatchData(editorValue, favorites, { nometa: true })).data;
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
  (function() {
    settingsManager.load();
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      link.setAttribute("type", "image/x-icon");
      document.getElementsByTagName("head")[0].appendChild(link);
    }
    link.href = logoUrl;
    const personDropdown = document.getElementById("person");
    if (personDropdown) {
      personDropdown.disabled = false;
    }
    if (typeof moment !== "undefined") {
      moment.locale("hu");
    }
    initTheme();
    loadRedmineCacheFromStorage();
    initializeDOMStructure(getHelpText());
    initFavoritesManager({
      copyTextToClipboard,
      fetchAndCache: fetchAndCache$2,
      applyQuickFilter: applyQuickFilter$1
    });
    loadFavorites();
    setupFavoriteSorting();
    setupClearInvalidButton();
    setupQuickFilter();
    initAdvancedSelector({
      fetchAndCache: fetchAndCache$2,
      applyQuickFilter: applyQuickFilter$1
    });
    setupAdvancedSelector();
    checkFavoritesValidity().then(() => {
      renderFavs();
      updateClearButtonVisibility();
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
    createHelpModal();
    setupHelpModalButton();
    initPanelManager({
      updateMonacoLayout
    });
    initializePanels();
    initBatchSubmitModule({
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
    $("#add-fav-button").button().on("click", addNewFavorite);
    initializeMonacoEditor();
    console.log("ArpyEnhance v0.18 loaded successfully!");
  })();

})();