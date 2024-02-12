const taskInput = document.getElementById("task-input");
const dateInput = document.getElementById("date-input");
const addBtn = document.getElementById("add-button");
const editBtn = document.getElementById("edit-button");
const alertMessage = document.getElementById("alert-message");
const todoBody = document.querySelector("tbody");
const DeleteAllBtn = document.getElementById("delete-all-button");
const filterBtn = document.querySelectorAll(".filter-todos");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

const generateId = () => {
  return Math.round(
    Math.random() * Math.random() * Math.pow(10, 15)
  ).toString();
};

const showAlert = (message, type) => {
  alertMessage.innerHTML = "";
  const alert = document.createElement("p");
  alert.innerText = message;
  alert.classList.add("alert");
  alert.classList.add(`alert-${type}`);
  alertMessage.append(alert);

  setTimeout(() => {
    alert.style.display = "none";
  }, 2000);
};

const displayTodos = (data) => {
  const todoList = data || todos;
  todoBody.innerHTML = "";

  if (!todoList.length) {
    todoBody.innerHTML = "<tr><td colspan='4'>Not Todo Found!</td></tr>";
    return;
  }

  todoList.map((todo) => {
    todoBody.innerHTML += `
    <tr>
      <td>${todo.task}</td>
      <td>${todo.date || "No Date"}</td>
      <td>${todo.completed ? "completed" : "pending"}</td>
      <td>
        <button onclick="editHandler('${todo.id}')">Edit</button>
        <button onclick="toggleHandler('${todo.id}')">
          ${todo.completed ? "Undo" : "Do"}
        </button>
        <button onclick="deleteHandler('${todo.id}')">Delete</button>
      </td>
    </tr>`;
  });
};

const saveLocalStorage = () => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

const addHandler = () => {
  const task = taskInput.value;
  const date = dateInput.value;
  const todo = {
    id: generateId(),
    completed: false,
    task,
    date,
  };

  if (task) {
    todos.push(todo);
    saveLocalStorage();
    displayTodos();
    taskInput.value = "";
    dateInput.value = "";
    showAlert("todo added successfully", "success");
  } else {
    showAlert("please enter a todo!", "error");
  }
};

const deleteAllHandler = () => {
  if (todos.length) {
    todos = [];
    saveLocalStorage();
    displayTodos();
    showAlert("All todos cleared successfully", "success");
  } else {
    showAlert("No todos to clear!", "error");
  }
};

const deleteHandler = (id) => {
  const newTodos = todos.filter((item) => item.id !== id);
  todos = newTodos;
  saveLocalStorage();
  displayTodos();
  showAlert("todo deleted successfully", "success");
};

const toggleHandler = (id) => {
  const todo = todos.find((item) => item.id === id);
  todo.completed = !todo.completed;
  saveLocalStorage();
  displayTodos();
  showAlert("Todo status changed successfully", "success");
};

const editHandler = (id) => {
  const todo = todos.find((item) => item.id === id);
  taskInput.value = todo.task;
  dateInput.value = todo.date;
  addBtn.style.display = "none";
  editBtn.style.display = "inline-block";
  // editBtn.dataset.id = id;
};

const applyEditHandler = (event) => {
  const id = event.target.dataset.id;
  const todo = todos.find((item) => item.id === id);
  todo.task = taskInput.value;
  todo.date = dateInput.value;
  taskInput.value = "";
  dateInput.value = "";
  addBtn.style.display = "inline-block";
  editBtn.style.display = "none";
  displayTodos();
  saveLocalStorage();
  showAlert("todo edited successfully", "success");
};

const filterHandler = (event) => {
  let filteredTodos = null;
  const filter = event.target.dataset.filter;

  filterBtn.forEach((btn) =>
    btn.dataset.filter === filter
      ? btn.classList.add("btn-add")
      : btn.classList.remove("btn-add")
  );

  switch (filter) {
    case "pending":
      filteredTodos = todos.filter((todo) => todo.completed === false);
      break;
    case "completed":
      filteredTodos = todos.filter((todo) => todo.completed === true);
      break;
    default:
      filteredTodos = todos;
      break;
  }
  displayTodos(filteredTodos);
};

filterBtn.forEach((button) => {
  button.addEventListener("click", filterHandler);
});

window.addEventListener("load", () => displayTodos());
addBtn.addEventListener("click", addHandler);
DeleteAllBtn.addEventListener("click", deleteAllHandler);
editBtn.addEventListener("click", applyEditHandler);
