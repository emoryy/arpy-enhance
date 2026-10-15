// URLs and External Resources
export const MONACO_CSS_URL = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.49.0/min/vs/editor/editor.main.css';
export const ORIGINAL_BOTTOM_OFFSET_PX = 90;

// Default Settings
export const DEFAULT_SETTINGS = {
  redmineApiKey: '',
  redmineCacheTtlHours: 24,
  theme: 'light',
  favsMaximized: false,
  panelsSwapped: false,
  showProgressIndicator: true,
  showEditorHourIndicator: true,
  showDayNameInEditor: false,
  showReviewedDays: false,
  targetWorkHours: 8,
  maxDisplayHours: 12
};

// Storage Keys
export const SETTINGS_STORAGE_KEY = 'arpyEnhanceSettings';
export const THEME_STORAGE_KEY = 'arpyEnhanceTheme';
export const REDMINE_CACHE_STORAGE_KEY = 'arpyEnhanceRedmineCache';
export const BATCH_TEXTAREA_STORAGE_KEY = 'batchTextareaSavedValue';
export const FAVORITE_SORT_ORDER_KEY = 'arpyEnhanceFavoriteSortOrder';
export const FAVORITE_SORT_REVERSED_KEY = 'arpyEnhanceFavoriteSortReversed';
export const ACTIVE_TAB_KEY = 'arpyEnhanceActiveTab';
export const FAVS_MAXED_KEY = 'arpyEnhanceFavsMaxed';
export const PANELS_SWAPPED_KEY = 'arpyEnhancePanelsSwapped';
export const TOP_PANEL_VH_KEY = 'arpyEnhanceTopPanelVh';
export const LAST_SEEN_VERSION_KEY = 'arpyEnhanceLastSeenVersion';

// Debug mode
export const DEBUG = false;

// Reviewed day marker after a date label, e.g. "07-01 ✓" (or typed as "07-01 ok")
export const REVIEWED_MARKER = '✓';
export const REVIEWED_MARKER_RE = /^(✓|✔|ok)$/i;
export const DATE_LINE_RE = /^\s*(\d{4}-\d{2}-\d{2}|\d{2}-\d{2})(?:\s+(✓|✔|ok))?\s*$/i;
