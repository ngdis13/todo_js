const form = document.querySelector("#form");
const taskInput = document.querySelector("#taskInput");
const tasksList = document.querySelector("#tasksList");
const emptyList = document.querySelector("#emptyList");

const dateList = document.querySelector("#dateList");
const openCalendar = document.querySelector("#openCalendar");
const calendarInput = document.querySelector("#calendarInput");
const selectedDateDisplay = document.querySelector('#selectedDateDisplay');

let tasks = [];
let selectedDate = new Date().toISOString().split("T")[0];

if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  renderTasksForDate();
}

checkEmptyList();
updateSelectedDateDisplay();

form.addEventListener("submit", addTask);
tasksList.addEventListener("click", deleteTask);
tasksList.addEventListener("click", doneTask);
dateList.addEventListener("click", renderDateList);

function updateSelectedDateDisplay(){
  if (selectedDate){
    const date = new Date(selectedDate);

    if(!isNaN(date.getTime())){
      const options = {year: 'numeric', month: 'long', day: 'numeric'};
      const formatDate = date.toLocaleDateString('ru-RU', options);
      selectedDateDisplay.textContent = `Выбрана дата: ${formatDate}`
    } 
  } else {
    selectedDateDisplay.textContent = "Выберите дату"
  }
  

}

function renderDateLine(startDateString) {
  dateList.innerHTML = "";

  let startDate = new Date(startDateString);

  for (let i = 0; i < 6; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

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
  console.log(tasksForDate)
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

function checkEmptyList(taskForDate) {
  const tasksToCheck = taskForDate || tasks.filter(task => task.date === selectedDate);
  const emptyListEl = document.querySelector("#emptyList");

  if (tasksToCheck.length === 0) {
    emptyListEl.classList.remove("none"); 
  } else {
    emptyListEl.classList.add("none"); 
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


function renderDateList(event) {
  const dateItem = event.target.closest(".date-item");
  if (dateItem) {
    selectedDate = dateItem.dataset.date;
    updateSelectedDateDisplay();
    renderDateLine(selectedDate);
    renderTasksForDate();
  }
}

openCalendar.addEventListener("click", () => {
  // calendarInput.showPicker();
  if (typeof calendarInput.showPicker === 'function'){
    calendarInput.showPicker();
  } else {
    calendarInput.focus()
  }
});

calendarInput.addEventListener("change", () => {
  selectedDate = calendarInput.value;
  updateSelectedDateDisplay();
  renderDateLine(selectedDate);
  renderTasksForDate();
});

renderDateLine(selectedDate);
renderTasksForDate();
