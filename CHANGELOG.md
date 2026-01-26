# Changelog

All notable changes to ArpyEnhance will be documented in this file.

## [0.16.0] - 2025-01-26

### Added
- **Monaco Editor**: Integrated Monaco editor for batch entry with syntax highlighting and autocompletion
- **Dark Mode**: Full dark theme support with toggle switch in navbar
- **Settings Modal**: Configurable settings including target work hours, max display hours, and Redmine API key
- **Advanced Selector**: New UI for selecting favorites with three-column hierarchical view and fuzzy search
- **Redmine Cache with TTL**: Cached Redmine ticket data persists to localStorage with 24-hour expiration
- **Manual Reload Button**: Reload individual Redmine tickets from preview with refresh button
- **Resizable Panels**: Drag to resize top/bottom panels, with maximize button for favorites
- **Panel Swap**: Swap position of favorites and editor panels
- **Quick Filter**: Filter favorites list by typing
- **Favorites Validation**: Detect and highlight closed/invalid category favorites
- **Progress Indicator**: Visual progress bar when loading Redmine tickets and project data

### Changed
- **Complete Code Modularization**: Refactored from single file to modular structure with Vite build system
- **Logo Embedded**: Logo now embedded as base64 instead of external imgur link

## [0.15] - Previous Release

Initial tracked version with batch entry, Redmine integration, and favorites system.
