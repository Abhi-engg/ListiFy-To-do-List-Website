let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
const tasks = {};

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const monthYear = document.getElementById("monthYear");
const calendarDates = document.getElementById("calendarDates");

function generateCalendar() {
  calendarDates.innerHTML = "";
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement("div");
    calendarDates.appendChild(emptyCell);
  }

  for (let date = 1; date <= daysInMonth; date++) {
    const dateCell = document.createElement("div");
    const dateKey = `${currentYear}-${currentMonth + 1}-${date}`;
    dateCell.innerText = date;

    if (tasks[dateKey]) {
      dateCell.classList.add("event");
      const taskIndicator = document.createElement("span");
      taskIndicator.classList.add("task-indicator");
      dateCell.appendChild(taskIndicator);
      dateCell.addEventListener("click", () => showTasks(dateKey));
    } else {
      dateCell.addEventListener("click", () => openModal(dateKey));
    }

    calendarDates.appendChild(dateCell);
  }

  monthYear.innerText = `${monthNames[currentMonth]} ${currentYear}`;
}

function prevMonth() {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  generateCalendar();
}

function nextMonth() {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  generateCalendar();
}

function openModal(dateKey) {
  const modal = document.getElementById("eventModal");
  modal.style.display = "flex";
  modal.setAttribute("data-date", dateKey);
}

function closeModal() {
  document.getElementById("eventModal").style.display = "none";
  document.getElementById("eventName").value = "";
}

function addEvent() {
  const modal = document.getElementById("eventModal");
  const dateKey = modal.getAttribute("data-date");
  const eventName = document.getElementById("eventName").value;

  if (eventName) {
    if (!tasks[dateKey]) {
      tasks[dateKey] = [];
    }
    tasks[dateKey].push(eventName);
    closeModal();
    generateCalendar();
  }
}

function showTasks(dateKey) {
  const taskList = tasks[dateKey] || [];
  const taskListHTML = taskList.map(task => `<li>${task}</li>`).join('');
  
  alert(`Tasks for ${dateKey}:\n\n${taskListHTML}`);
}

function toggleTheme() {
  document.body.classList.toggle('dark-theme');
  const themeIcon = document.querySelector('.theme-toggle i');
  themeIcon.classList.toggle('fa-moon');
  themeIcon.classList.toggle('fa-sun');
}

generateCalendar();