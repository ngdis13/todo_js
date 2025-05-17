const form = document.querySelector("#form");
const taskInput = document.querySelector("#taskInput");
const tasksList = document.querySelector("#tasksList");
const emptyList = document.querySelector("#emptyList");

const dateList = document.querySelector("#dateList");
const openCalendar = document.querySelector("#openCalendar");
const calendarInput = document.querySelector("#calendarInput");

let tasks = [];
let selectedDate = new Date().toISOString().split("T")[0];

if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  renderTasksForDate();
}

checkEmptyList();

form.addEventListener("submit", addTask);
tasksList.addEventListener("click", deleteTask);
tasksList.addEventListener("click", doneTask);

function renderDateLine() {
  dateList.innerHTML = "";
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateStr = date.toISOString().split("T")[0];
    const dayName = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"][date.getDay()];
    const dateNum = date.getDate();
    const isSelected = dateStr === selectedDate ? "date-item--selected" : "";
    const dateHTML = `
      <li class="date-item ${isSelected}" data-date="${dateStr}">
        <span class="date-item__day">${dayName}</span>
        <span class="date-item__date">${dateNum}</span>
      </li>`;
    dateList.insertAdjacentHTML("beforeend", dateHTML);
  }
}

function renderTasksForDate(){
  tasksList.innerHTML = '';
  const tasksForDate = tasks.filter(task => task.date === selectedDate);
  tasksForDate.forEach(task => renderTask(task));
  checkEmptyList(tasksForDate);
}

function addTask(event) {
  event.preventDefault();
  const taskText = taskInput.value;

  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
    date: selectedDate
  };

  tasks.push(newTask);
  saveLocalStorage();
  renderTasksForDate();

  taskInput.value = "";
  taskInput.focus();
}

function deleteTask(event) {
  if (event.target.dataset.action !== "delete") {
    return;
  }
  const parentNode = event.target.closest(".list-group-item");
  const id = Number(parentNode.id);
  tasks = tasks.filter(task => task.id !== id);
  saveLocalStorage();
  renderTasksForDate();
}

function doneTask(event) {
  if (event.target.dataset.action === "done") {
    const parentNode = event.target.closest(".list-group-item");
    const id = Number(parentNode.id);
    const task = tasks.find(task => task.id === id);
    task.done = !task.done;
    saveLocalStorage();
    renderTasksForDate();
  }
}

function checkEmptyList() {
  if (tasks.length === 0) {
    const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
      <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
      <div class="empty-list__title">Список дел пуст</div>
    </li>`;
    tasksList.insertAdjacentHTML("afterbegin", emptyListHTML);
  }

  if (tasks.length > 0) {
    const emptyListEl = document.querySelector("#emptyList");
    emptyListEl ? emptyListEl.remove() : null;
  }
}

function saveLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTask(task) {
  const cssClass = task.done ? "task-title task-title--done" : "task-title";
  const taskHTML = `
    <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
      <span class="${cssClass}">${task.text}</span>
      <div class="task-item__buttons">
        <button type="button" data-action="done" class="btn-action">
          <img src="./img/tick.svg" alt="Done" width="18" height="18">
        </button>
        <button type="button" data-action="delete" class="btn-action">
          <img src="./img/cross.svg" alt="Delete" width="18" height="18">
        </button>
      </div>
    </li>`;

  tasksList.insertAdjacentHTML("beforeend", taskHTML);
}

dateList.addEventListener("click", renderDateList);

function renderDateList(event) {
  const dateItem = event.target.closest(".date-item");
  if (dateItem) {
    selectedDate = dateItem.dataset.date;
    renderDateLine();
    renderTasksForDate();
  }
}

openCalendar.addEventListener("click", () => {
  calendarInput.showPicker();
});

calendarInput.addEventListener("change", () => {
  selectedDate = calendarInput.value;
  renderDateLine();
  renderTasksForDate();
});

renderDateLine();
renderTasksForDate();
