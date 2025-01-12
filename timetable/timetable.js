let classes = [];
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
let timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
let currentEditingCell = null;

function toggleTheme() {
  document.body.classList.toggle('dark-theme');
  const themeToggle = document.querySelector('.theme-toggle');
  if (document.body.classList.contains('dark-theme')) {
    themeToggle.innerHTML = '<i class="fas fa-adjust"></i> Toggle Theme';
  } else {
    themeToggle.innerHTML = '<i class="fas fa-adjust"></i> Toggle Theme';
  }
}

function displayTimetable() {
  const timetableGrid = document.getElementById('timetableGrid');
  timetableGrid.innerHTML = '';

  // Add header row
  const headerRow = document.createElement('div');
  headerRow.className = 'timetable-cell timetable-header';
  headerRow.textContent = 'Time';
  timetableGrid.appendChild(headerRow);

  days.forEach(day => {
    const dayCell = document.createElement('div');
    dayCell.className = 'timetable-cell timetable-header';
    dayCell.textContent = day;
    timetableGrid.appendChild(dayCell);
  });

  // Add time slots and classes
  timeSlots.forEach(time => {
    const timeCell = document.createElement('div');
    timeCell.className = 'timetable-cell timetable-time';
    timeCell.textContent = time;
    timeCell.onclick = () => editTimeSlot(time);
    timetableGrid.appendChild(timeCell);

    days.forEach(day => {
      const classCell = document.createElement('div');
      classCell.className = 'timetable-cell';
      const classForThisSlot = classes.find(cls => 
        cls.day === day && 
        cls.startTime <= time && 
        cls.endTime > time
      );
      if (classForThisSlot) {
        classCell.textContent = classForThisSlot.subject;
        classCell.style.backgroundColor = 'var(--card-bg)';
      }
      classCell.onclick = () => openEditModal(day, time);
      timetableGrid.appendChild(classCell);
    });
  });
}

function editTimeSlot(time) {
  const newTime = prompt("Enter new time (HH:MM format):", time);
  if (newTime && /^([01]\d|2[0-3]):([0-5]\d)$/.test(newTime)) {
    const index = timeSlots.indexOf(time);
    if (index !== -1) {
      timeSlots[index] = newTime;
      timeSlots.sort();
      displayTimetable();
    }
  } else if (newTime) {
    alert("Invalid time format. Please use HH:MM.");
  }
}

function openEditModal(day, time) {
  currentEditingCell = { day, time };
  const modal = document.getElementById('editModal');
  const editSubject = document.getElementById('editSubject');
  const editStartTime = document.getElementById('editStartTime');
  const editEndTime = document.getElementById('editEndTime');

  const existingClass = classes.find(cls => cls.day === day && cls.startTime <= time && cls.endTime > time);

  if (existingClass) {
    editSubject.value = existingClass.subject;
    editStartTime.value = existingClass.startTime;
    editEndTime.value = existingClass.endTime;
  } else {
    editSubject.value = '';
    editStartTime.value = time;
    editEndTime.value = timeSlots[timeSlots.indexOf(time) + 1] || '';
  }

  modal.style.display = 'block';
}

function saveEdit() {
  const subject = document.getElementById('editSubject').value;
  const startTime = document.getElementById('editStartTime').value;
  const endTime = document.getElementById('editEndTime').value;

  if (subject && startTime && endTime) {
    const existingClassIndex = classes.findIndex(cls => 
      cls.day === currentEditingCell.day && 
      cls.startTime <= currentEditingCell.time && 
      cls.endTime > currentEditingCell.time
    );

    if (existingClassIndex !== -1) {
      classes[existingClassIndex] = { ...classes[existingClassIndex], subject, startTime, endTime };
    } else {
      classes.push({ subject, day: currentEditingCell.day, startTime, endTime });
    }

    document.getElementById('editModal').style.display = 'none';
    displayTimetable();
  } else {
    alert('Please fill in all fields.');
  }
}

function deleteClass() {
  const existingClassIndex = classes.findIndex(cls => 
    cls.day === currentEditingCell.day && 
    cls.startTime <= currentEditingCell.time && 
    cls.endTime > currentEditingCell.time
  );

  if (existingClassIndex !== -1) {
    classes.splice(existingClassIndex, 1);
    document.getElementById('editModal').style.display = 'none';
    displayTimetable();
  }
}

function generateTimetable() {
  // Sort classes by start time
  classes.sort((a, b) => a.startTime.localeCompare(b.startTime));
  const suggestions = [];
  
  for (let i = 1; i < classes.length; i++) {
    const prevEnd = new Date(`1970-01-01T${classes[i - 1].endTime}:00`);
    const currStart = new Date(`1970-01-01T${classes[i].startTime}:00`);
    const breakTime = (currStart - prevEnd) / (1000 * 60);
    
    if (breakTime < 15 && classes[i - 1].day === classes[i].day) {
      suggestions.push(`Consider adding a 15-minute break between ${classes[i - 1].subject} and ${classes[i].subject} on ${classes[i].day}`);
    }
  }
  
  // Check for long study sessions and suggest breaks
  classes.forEach(cls => {
    const start = new Date(`1970-01-01T${cls.startTime}:00`);
    const end = new Date(`1970-01-01T${cls.endTime}:00`);
    const duration = (end - start) / (1000 * 60);
    
    if (duration > 120) {
      suggestions.push(`The ${cls.subject} session on ${cls.day} is longer than 2 hours. Consider adding a short break in between.`);
    }
  });
  
  // Display suggestions
  const suggestionsList = document.getElementById('suggestionsList');
  suggestionsList.innerHTML = '';
  suggestions.forEach(suggestion => {
    const li = document.createElement('li');
    li.textContent = suggestion;
    suggestionsList.appendChild(li);
  });
  
  displayTimetable();
}

// Close modal when clicking on <span> (x)
document.getElementsByClassName('close')[0].onclick = function() {
  document.getElementById('editModal').style.display = 'none';
}

// Close modal when clicking outside of it
window.onclick = function(event) {
  const modal = document.getElementById('editModal');
  if (event.target == modal) {
    modal.style.display = 'none';
  }
}

// Initialize empty timetable
displayTimetable();