/**
 * Timelog Form Helpers
 * Drives the original project / todo list / todo item dropdowns of the timelog form
 */

const OPTION_WAIT_TIMEOUT_MS = 10000;
const OPTION_POLL_INTERVAL_MS = 50;

function hasOption($select, value) {
  return Array.from($select[0].options).some((option) => option.value == value);
}

function waitForOption($select, value) {
  return new Promise((resolve, reject) => {
    const startedAt = Date.now();
    const check = () => {
      if (hasOption($select, value)) {
        resolve();
      } else if (Date.now() - startedAt > OPTION_WAIT_TIMEOUT_MS) {
        reject(new Error(`Option ${value} did not appear in #${$select.attr('id')}`));
      } else {
        setTimeout(check, OPTION_POLL_INTERVAL_MS);
      }
    };
    check();
  });
}

/**
 * Select a project / todo list / todo item in the timelog form.
 *
 * Goes through Arpy's own change chain (project -> todo lists via AJAX -> todo items via AJAX)
 * instead of filling the options itself, because Arpy also appends an "Új todo..." option to the
 * todo item dropdown and binds it to the selected todo list.
 */
export async function setTimelogCategory(projectId, todoListId, todoItemId) {
  const $project = $('#project_id');
  const $todoList = $('#todo_list_id');
  const $todoItem = $('#todo_item_id');

  // A level is (re)selected when it changes or when the next level has not been loaded for it yet
  if ($project.val() != projectId || !hasOption($todoList, todoListId)) {
    $project.val(projectId).trigger('change');
  }
  if ($todoList.val() != todoListId || !hasOption($todoItem, todoItemId)) {
    await waitForOption($todoList, todoListId);
    $todoList.val(todoListId).trigger('change');
  }
  await waitForOption($todoItem, todoItemId);
  $todoItem.val(todoItemId).trigger('change');
}
