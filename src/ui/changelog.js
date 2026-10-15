/**
 * Changelog Module
 * Shows CHANGELOG.md in a modal and notifies the user once after an update
 */

import changelogMarkdown from '../../CHANGELOG.md?raw';
import { version as CURRENT_VERSION } from '../../package.json';
import { LAST_SEEN_VERSION_KEY, BATCH_TEXTAREA_STORAGE_KEY, REDMINE_CACHE_STORAGE_KEY } from '../constants.js';
import logoUrl from '../assets/logo.png';

// Versions newer than this were not seen by the user when the page loaded
let lastSeenVersionAtLoad = null;

function compareVersions(a, b) {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const diff = (pa[i] || 0) - (pb[i] || 0);
    if (diff) {
      return Math.sign(diff);
    }
  }
  return 0;
}

function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderInline(text) {
  return escapeHtml(text)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

/**
 * Covers the subset of Markdown used by CHANGELOG.md: ### headings, "- " list items, paragraphs
 */
function renderMarkdownBlock(markdown) {
  const html = [];
  let inList = false;
  markdown.split(/\r?\n/).forEach((line) => {
    const listItem = line.match(/^\s*- (.*)$/);
    if (!listItem && inList) {
      html.push('</ul>');
      inList = false;
    }
    if (listItem) {
      if (!inList) {
        html.push('<ul>');
        inList = true;
      }
      html.push(`<li>${renderInline(listItem[1])}</li>`);
    } else if (line.startsWith('### ')) {
      html.push(`<h5>${renderInline(line.slice(4))}</h5>`);
    } else if (line.trim()) {
      html.push(`<p>${renderInline(line)}</p>`);
    }
  });
  if (inList) {
    html.push('</ul>');
  }
  return html.join('');
}

/**
 * Released versions from CHANGELOG.md, newest first. [Unreleased] is left out.
 * @returns {{version: string, date: string, body: string}[]}
 */
function parseChangelog() {
  return changelogMarkdown
    .split(/^## /m)
    .slice(1)
    .map((section) => {
      const [heading, ...rest] = section.split(/\r?\n/);
      const match = heading.match(/^\[([^\]]+)\](?:\s*-\s*(.*))?/);
      return match && { version: match[1], date: (match[2] || '').trim(), body: rest.join('\n') };
    })
    .filter((release) => release && /^\d+(\.\d+)*$/.test(release.version));
}

function isExistingInstall() {
  return ['favorites', BATCH_TEXTAREA_STORAGE_KEY, REDMINE_CACHE_STORAGE_KEY, 'REDMINE_API_KEY']
    .some((key) => localStorage.getItem(key) !== null);
}

/**
 * Last version whose changes the user has seen. Installs that predate this feature have no stored
 * value: they count as updated from the release before the current one, fresh installs as up to date.
 */
function readLastSeenVersion(releases) {
  try {
    const stored = localStorage.getItem(LAST_SEEN_VERSION_KEY);
    if (stored) {
      return stored;
    }
    if (isExistingInstall()) {
      const previous = releases.find((release) => compareVersions(release.version, CURRENT_VERSION) < 0);
      return previous ? previous.version : '0';
    }
    localStorage.setItem(LAST_SEEN_VERSION_KEY, CURRENT_VERSION);
  } catch (e) {
    console.warn('ArpyEnhance: could not read the last seen version', e);
  }
  return CURRENT_VERSION;
}

function markCurrentVersionSeen() {
  try {
    localStorage.setItem(LAST_SEEN_VERSION_KEY, CURRENT_VERSION);
  } catch (e) {
    console.warn('ArpyEnhance: could not store the last seen version', e);
  }
  document.getElementById('changelog-button')?.classList.remove('has-unseen');
  hideUpdateNotice();
}

function renderReleases(releases) {
  const isNew = (release) => compareVersions(release.version, lastSeenVersionAtLoad) > 0
    && compareVersions(release.version, CURRENT_VERSION) <= 0;
  const newReleases = releases.filter(isNew);
  const olderReleases = releases.filter((release) => !isNew(release));

  const renderRelease = (release, highlighted) => `
    <section class="changelog-release${highlighted ? ' is-new' : ''}">
      <header class="changelog-release-header">
        <span class="changelog-version">${escapeHtml(release.version)}</span>
        ${release.date ? `<span class="changelog-date">${escapeHtml(release.date)}</span>` : ''}
        ${highlighted ? '<span class="changelog-new-badge">új</span>' : ''}
      </header>
      ${renderMarkdownBlock(release.body)}
    </section>
  `;

  return [
    ...newReleases.map((release) => renderRelease(release, true)),
    newReleases.length && olderReleases.length ? '<h4 class="changelog-older-title">Korábbi verziók</h4>' : '',
    ...olderReleases.map((release) => renderRelease(release, false)),
  ].join('');
}

/**
 * Create and inject the changelog modal
 */
function createChangelogModal(releases) {
  $("body").append(`
    <div class="modal" id="changelogModal" tabindex="-1" role="dialog" aria-labelledby="changelogModalLabel" aria-hidden="true" style="display: none;">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
        <h3 id="changelogModalLabel">Újdonságok <small>telepített verzió: ${escapeHtml(CURRENT_VERSION)}</small></h3>
      </div>
      <div class="modal-body">
        ${renderReleases(releases)}
      </div>
    </div>
  `);
}

function showUpdateNotice() {
  const notice = document.createElement('div');
  notice.id = 'changelog-update-notice';
  notice.setAttribute('role', 'status');
  notice.innerHTML = `
    <img src="${logoUrl}" alt="" class="changelog-notice-logo">
    <div class="changelog-notice-text">
      <div class="changelog-notice-title">ArpyEnhance frissült</div>
      <div class="changelog-notice-version">${escapeHtml(lastSeenVersionAtLoad === '0' ? '' : `${lastSeenVersionAtLoad} → `)}${escapeHtml(CURRENT_VERSION)}</div>
      <button type="button" class="btn btn-small btn-primary changelog-notice-open">Mi változott?</button>
    </div>
    <button type="button" class="close changelog-notice-close" title="Bezárás" aria-label="Bezárás">×</button>
  `;
  notice.querySelector('.changelog-notice-open').addEventListener('click', showChangelogModal);
  notice.querySelector('.changelog-notice-close').addEventListener('click', markCurrentVersionSeen);
  document.body.appendChild(notice);
}

function hideUpdateNotice() {
  document.getElementById('changelog-update-notice')?.remove();
}

/**
 * Show the changelog modal; opening it counts as having seen the current version
 */
export function showChangelogModal() {
  $('#changelogModal').modal('show');
  markCurrentVersionSeen();
}

/**
 * Build the modal and, after an update, the notice and the unseen marker on the navbar button.
 * Call after the navbar has been injected.
 */
export function initChangelog() {
  const releases = parseChangelog();
  lastSeenVersionAtLoad = readLastSeenVersion(releases);
  createChangelogModal(releases);

  if (compareVersions(CURRENT_VERSION, lastSeenVersionAtLoad) > 0) {
    document.getElementById('changelog-button')?.classList.add('has-unseen');
    showUpdateNotice();
  }
}
