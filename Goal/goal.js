let goals = JSON.parse(localStorage.getItem('goals')) || [];

function addGoal() {
  const goalInput = document.getElementById('goalInput').value;
  const dueDate = document.getElementById('dueDate').value;
  const priority = document.getElementById('priority').value;
  const targetProgress = document.getElementById('targetProgress').value;
  
  if (goalInput && dueDate && priority && targetProgress) {
    const newGoal = { 
      goal: goalInput, 
      dueDate: dueDate, 
      priority: priority, 
      targetProgress: parseInt(targetProgress),
      currentProgress: 0,
      completed: false 
    };
    goals.push(newGoal);
    saveToLocalStorage();
    document.getElementById('goalForm').reset();
    displayGoals();
    updateProgressBoard();
    updateTargetFeatures();
    generateReport();
  } else {
    alert('Please fill in all fields.');
  }
}

function saveToLocalStorage() {
  localStorage.setItem('goals', JSON.stringify(goals));
}

function displayGoals() {
  const goalList = document.getElementById('goalList');
  goalList.innerHTML = '';

  goals.forEach((goal, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${goal.goal} (Due: ${goal.dueDate}, Priority: ${goal.priority}, Progress: ${goal.currentProgress}/${goal.targetProgress}%)</span>
      <div>
        <input type="range" min="0" max="${goal.targetProgress}" value="${goal.currentProgress}" onchange="updateProgress(${index}, this.value)">
        <button onclick="deleteGoal(${index})">Delete</button>
      </div>
    `;
    goalList.appendChild(li);
  });
}

function updateProgress(index, value) {
  goals[index].currentProgress = parseInt(value);
  if (goals[index].currentProgress >= goals[index].targetProgress) {
    goals[index].completed = true;
  } else {
    goals[index].completed = false;
  }
  saveToLocalStorage();
  displayGoals();
  updateProgressBoard();
  updateTargetFeatures();
  generateReport();
}

function deleteGoal(index) {
  goals.splice(index, 1);
  saveToLocalStorage();
  displayGoals();
  updateProgressBoard();
  updateTargetFeatures();
  generateReport();
}

/**
 * Updates the progress board based on the current state of the goals.
 * This updates the overall progress, as well as the progress for each priority level.
 */
function updateProgressBoard() {
  let totalProgress = 0;
  let totalTarget = 0;
  let highPriorityProgress = 0;
  let highPriorityTarget = 0;
  let mediumPriorityProgress = 0;
  let mediumPriorityTarget = 0;
  let lowPriorityProgress = 0;
  let lowPriorityTarget = 0;

  goals.forEach(goal => {
    totalProgress += goal.currentProgress;
    totalTarget += goal.targetProgress;

    switch(goal.priority) {
      case 'High':
        highPriorityProgress += goal.currentProgress;
        highPriorityTarget += goal.targetProgress;
        break;
      case 'Medium':
        mediumPriorityProgress += goal.currentProgress;
        mediumPriorityTarget += goal.targetProgress;
        break;
      case 'Low':
        lowPriorityProgress += goal.currentProgress;
        lowPriorityTarget += goal.targetProgress;
        break;
    }
  });

  updateProgressCircle('overallProgressText', totalProgress, totalTarget);
  updateProgressCircle('highPriorityText', highPriorityProgress, highPriorityTarget);
  updateProgressCircle('mediumPriorityText', mediumPriorityProgress, mediumPriorityTarget);
  updateProgressCircle('lowPriorityText', lowPriorityProgress, lowPriorityTarget);
}

function updateProgressCircle(id, progress, target) {
  const percentage = target > 0 ? (progress / target) * 100 : 0;
  const circle = document.querySelector(`#${id}`).parentNode.querySelector('.progress-ring-circle');
  const radius = circle.r.baseVal.value;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  circle.style.strokeDasharray = `${circumference} ${circumference}`;
  circle.style.strokeDashoffset = offset;

  document.getElementById(id).textContent = `${Math.round(percentage)}%`;
}

function updateTargetFeatures() {
  const targetFeatures = document.getElementById('targetFeatures');
  targetFeatures.innerHTML = '';

  goals.forEach(goal => {
    const feature = document.createElement('div');
    feature.className = 'target-feature-item';
    const progressPercentage = (goal.currentProgress / goal.targetProgress) * 100;
    const status = progressPercentage >= 100 ? 'Completed' : progressPercentage >= 50 ? 'On Track' : 'Behind';
    feature.innerHTML = `
      <h3>${goal.goal}</h3>
      <p><strong>Target:</strong> ${goal.targetProgress}%</p>
      <p><strong>Current:</strong> ${goal.currentProgress}%</p>
      <p><strong>Due:</strong> ${goal.dueDate}</p>
      <p><strong>Priority:</strong> ${goal.priority}</p>
      <p><strong>Status:</strong> ${status}</p>
    `;
    targetFeatures.appendChild(feature);
  });
}

function generateReport() {
  const report = document.getElementById('goalReport');
  report.innerHTML = '';

  const totalGoals = goals.length;
  const completedGoals = goals.filter(goal => goal.completed).length;
  const onTrackGoals = goals.filter(goal => !goal.completed && goal.currentProgress >= goal.targetProgress * 0.5).length;
  const behindGoals = goals.filter(goal => !goal.completed && goal.currentProgress < goal.targetProgress * 0.5).length;

  report.innerHTML = `
    <p>Total Goals: ${totalGoals}</p>
    <p>Completed Goals: ${completedGoals}</p>
    <p>On Track Goals: ${onTrackGoals}</p>
    <p>Behind Goals: ${behindGoals}</p>
  `;
}

function toggleTheme() {
  document.body.classList.toggle('dark-theme');
  const themeIcon = document.querySelector('.theme-toggle i');
  if (document.body.classList.contains('dark-theme')) {
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
  } else {
    themeIcon.classList.remove('fa-sun');
    themeIcon.classList.add('fa-moon');
  }
}

displayGoals();
updateProgressBoard();
updateTargetFeatures();
generateReport();