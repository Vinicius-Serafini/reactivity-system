import { computed, observableOf } from "./lib/factories.js";

/** 
 * @typedef {Object} Todo
 * @property {string} id
 * @property {string} title
 * @property {string} description
 */


/** @type {import('./lib/entities.js').ObservableOf<Array<Todo>>} */
const todoList = observableOf([]);

const todoListSearch = observableOf('');

const todoListEl = document.getElementById("todo-list");

/** @param {string} id  */
function removeTodo(id) {
  todoList.update((list) => list.filter((item) => item.id !== id));
}

/**
 * 
 * @param {Omit<Todo, 'id'>} todo 
 */
function createTodo(todo) {
  const id = Math.random().toString(36).substring(2, 9);

  todoList.update((list) => list.concat({ ...todo, id }));
}

const filteredTodoList = computed(() => {
  const list = todoList.get();

  if (!todoListSearch.get()) {
    return list;
  }

  return list.filter((item) => item.title.toLowerCase().includes(todoListSearch.get().toLowerCase()));
});

document.getElementById('todo__input-search').addEventListener('input', (event) => {
  todoListSearch.update(event.target.value || '');
});

filteredTodoList.subscribe((list) => {
  todoListEl.innerHTML = "";
  list.forEach((todo) => {
    todoListEl.appendChild(createTodoListItem(todo));
  });
});

/**
 * 
 * @param {Todo} todo 
 * @returns {HTMLLIElement}
 */
function createTodoListItem(todo) {

  const li = document.createElement("li",);
  li.classList.add('todo__list-item');
  li.dataset.id = todo.id;

  const title = document.createElement("p");
  title.classList.add("todo__list-item-title");
  title.textContent = todo.title;

  const description = document.createElement("p");
  description.classList.add("todo__list-item-description");
  description.textContent = todo.description;

  const removeButton = document.createElement("button");
  removeButton.classList.add("todo__list-item-remove");
  removeButton.textContent = "X";
  removeButton.addEventListener("click", () => {
    removeTodo(todo.id);
  });

  li.appendChild(removeButton);
  li.appendChild(title);
  li.appendChild(description);

  return li;
}


/** @type {HTMLDialogElement} */
const todoDialog = document.getElementById("todo-dialog");

document.getElementById('todo-create-fab').addEventListener('click', () => {
  todoDialog.showModal();
});

document.getElementById('todo-dialog__close').addEventListener('click', () => {
  todoDialog.close();
});

document.getElementById('todo-dialog__form').addEventListener("submit", (event) => {
  event.preventDefault(); // We don't want to submit this fake form
  const form = new FormData(event.target);

  createTodo({
    title: form.get('title'),
    description: form.get('description')
  });

  event.target.reset();
  todoDialog.close();
});