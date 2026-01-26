# ArpyEnhance Userscript - Understanding and Documentation

## Overview
ArpyEnhance is a userscript that enhances a work hours reporting form in a classical server-rendered Bootstrap-based web application (Arpy). It provides batch entry capabilities with a compact syntax and automatic integration with Redmine ticket management.

## Project Structure

**IMPORTANT**: This project uses a modularized structure with a build process.

### Source Files
- **Source directory**: `src/` - Contains all modularized source code
  - `src/main.js` - Main entry point, initializes all modules
  - `src/ui/` - UI components and DOM setup
    - `dom-setup.js` - Creates DOM structure
    - `panel-manager.js` - Panel layout management
    - `navbar.js` - Top navigation bar
    - `settings-modal.js` - Settings modal
    - `help-modal.js` - Help dialog
  - `src/favorites/` - Favorites management
    - `favorites-manager.js` - Core favorites logic
    - `quick-filter.js` - Quick filter functionality
    - `advanced-selector.js` - Advanced selector UI
  - `src/monaco/` - Monaco editor integration
  - `src/parser/` - Batch data parsing logic
  - `src/preview/` - Preview generation
  - `src/submission/` - Batch submission logic
  - `src/redmine/` - Redmine integration
  - `src/cache/` - Caching functionality
  - `src/theme/` - Theme management
  - `src/settings/` - Settings management
  - `src/utils/` - Utility functions
  - `src/styles/all.css` - All CSS styles (uses CSS nesting)
  - `src/constants.js` - Constants and configuration

### Build Process
- **Build tool**: Vite with vite-plugin-monkey
- **Commands**:
  - `npm run build` - Build for production (outputs to `dist/ArpyEnhance.user.js`)
  - `npm run dev` - Build with watch mode (rebuilds on file changes)
- **Output**: `ArpyEnhance.user.js` is auto-generated in the project root

### ⚠️ CRITICAL: Do NOT Edit Generated Files
- **ArpyEnhance.user.js** is a **GENERATED** file - changes will be overwritten on next build
- **Always** edit source files in `src/` directory
- You may run `npm run build` after making changes, if the user didn't yet start it themself in their own terminal
- The generated file is what gets loaded by the userscript manager

### Development Workflow
1. Edit source files in `src/` directory
2. Run `npm run build` (or `npm run dev` for watch mode)
3. Reload the userscript in your browser
4. Test changes

## Key Features

### 1. Batch Work Hour Entry
- Users can compose multiple work hour entries using a compact syntax instead of submitting them one-by-one
- Supports date labels, category labels, and flexible formatting
- Monaco Editor integration for syntax highlighting and autocompletion

### 2. Redmine Integration
- **Ticket Detection**: Automatically detects Redmine ticket numbers (format: `#1234` or `1234`) in work hour entry descriptions
- **Category Auto-assignment**: Fetches Redmine tickets and parses the "Arpy jelentés" custom field to automatically determine which category/project to assign
- **Visual Feedback**: Detected tickets are linked in the preview table with visual indicators for automatic label assignment
- **Cache with TTL**: Redmine data is cached for 24 hours (configurable) to reduce API calls
- **Manual Reload**: Each Redmine ticket link has a reload button (↻) to force refresh the ticket data

### 3. Favorites System
- Save frequently used project/category combinations as favorites
- Label favorites for quick reference
- Validation system to detect closed/invalid categories
- Sorting options: default (add order), by label, by category

### 4. Preview System
- Real-time preview of parsed entries
- Two views: by date and by project/category
- Visual day progress bars
- Statistics (sum, average, missing hours)
- Highlights 8+ hour days

## Cache Implementation (v0.17+)

### Redmine Cache with TTL
- **Location**: `src/redmine/redmine-cache.js`
- **TTL Constant**: `REDMINE_CACHE_TTL_MS = 24 * 60 * 60 * 1000` (24 hours, configurable in `src/constants.js`)
- **Persistence**: `localStorage.arpyEnhanceRedmineCache` - persists across page reloads
- **Storage Structure**: In-memory object backed by localStorage, storing resolved data and timestamp
  ```javascript
  {
    [issueNumber]: {
      data: RedmineIssueData,
      timestamp: number
    }
  }
  ```
- **Key Functions**:
  - `loadRedmineCacheFromStorage()`: Loads cache from localStorage, auto-cleans expired entries
  - `saveRedmineCacheToStorage()`: Persists cache to localStorage
  - `isRedmineCacheExpired(issueNumber)`: Checks if cache entry is expired
  - `fetchRedmineIssue(issueNumber, forceReload)`: Fetches with cache management
  - `reloadRedmineTicket(issueNumber)`: Force reloads and updates preview
- **Features**:
  - Automatic expiration after 24 hours
  - Persisted to localStorage (survives page reloads)
  - Automatic cleanup of expired entries on load
  - Manual reload via button in preview
  - Cache bypass with `forceReload` parameter

### Arpy Cache
- **Location**: `src/cache/arpy-cache.js`
- **Storage**: In-memory object for todo lists and items
- **Used by**: `fetchAndCache()` function
- **Purpose**: Caches project todo lists and items

## Entry Syntax Format

```
# Comment line
10-01 1.0 task description
category_label
  10-02 1.5 another task
  - 2.0 #1234 ticket task (uses last date)
```

### Components:
1. **Date**: `YYYY-MM-DD` or `MM-DD` (year optional), or `-` for last date label
2. **Hours**: Decimal number (e.g., `1.0`, `2.5`, `8.0`)
3. **Description**: Free text, optionally starting with ticket number
4. **Labels**: Single-word lines that set date or category context

## Recent Enhancements (v0.17)

### 1. Cache TTL (Time To Live) - ✅ IMPLEMENTED
- ✅ Added timestamp-based expiration for Redmine cache entries
- ✅ Default: 24 hours (configurable via `REDMINE_CACHE_TTL_MS` constant on line 22)
- ✅ Automatic expiration checking on cache retrieval
- ✅ Automatic refetch when expired
- ✅ Persisted to localStorage (survives page reloads)
- ✅ Automatic cleanup of expired entries on load
- **Implementation**:
  - Cache structure stores `{ data, timestamp }` objects
  - `loadRedmineCacheFromStorage()` loads and cleans cache on startup
  - `saveRedmineCacheToStorage()` persists cache to localStorage after updates
  - `isRedmineCacheExpired()` function checks if entry is older than TTL
  - `fetchRedmineIssue()` handles cache logic with optional force reload

### 2. Manual Reload Button - ✅ IMPLEMENTED
- ✅ Small icon button (↻) next to each Redmine ticket link in preview table
- ✅ Button forces refresh of specific ticket from Redmine
- ✅ Updates cache with new data
- ✅ Re-parses and updates preview after reload
- ✅ Visual feedback during reload operation (loading state, disabled button)
- **Implementation**:
  - Button added in preview table generation (line 1896-1916)
  - CSS styling for button (line 183-204)
  - Uses `reloadRedmineTicket()` function to force reload and update

## Technical Notes

### API Endpoints:
- Redmine: `https://redmine.dbx.hu/issues/{issueNumber}.json`
- Arpy Todo Lists: `/get_todo_lists?project_id={id}&show_completed=false`
- Arpy Todo Items: `/get_todo_items?todo_list_id={id}&show_completed=false`
- Submit: `/timelog` (POST)

### Authentication:
- Redmine: Uses `X-Redmine-API-Key` header from `localStorage.REDMINE_API_KEY`

### Storage:
- `localStorage.favorites`: Saved favorite categories
- `localStorage.batchTextareaSavedValue`: Saved textarea content
- `localStorage.REDMINE_API_KEY`: Redmine API key
- `localStorage.arpyEnhanceRedmineCache`: Cached Redmine issue data with timestamps (v0.17+)
- `localStorage.arpyEnhanceFavoriteSortOrder`: Favorite sort preference
- `localStorage.arpyEnhanceActiveTab`: Active preview tab
- `localStorage.arpyEnhanceFavsMaxed`: Favorites panel maximized state
- `localStorage.arpyEnhancePanelsSwapped`: Panel swap state
- `localStorage.arpyEnhanceTopPanelVh`: Top panel height

### Known Issues:
- ~~Cache persists only during page session (no localStorage persistence)~~ ✅ FIXED in v0.17: Cache persisted to localStorage
- ~~No cache invalidation mechanism~~ ✅ FIXED in v0.17: TTL-based expiration implemented
- ~~No way to manually refresh Redmine data~~ ✅ FIXED in v0.17: Manual reload button added

### Implementation Notes (v0.17):
- The reload button only appears for Redmine issues (numeric IDs), not for YouTrack issues
- Cache expiration is checked automatically on every fetch attempt
- Manual reload bypasses cache and forces fresh API call
- Loading state prevents multiple simultaneous reloads of the same ticket
- Cache is persisted to localStorage and survives page reloads
- Expired entries are automatically cleaned up when cache is loaded from localStorage

General guidelines and informations:
- You can see the original html page content before modification and the css that the app loads in the arpy-original folder
- Use CSS nesting
- you don't increment the version number by yourself, unless asked to do so
