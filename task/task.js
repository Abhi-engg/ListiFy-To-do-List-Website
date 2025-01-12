let tasks = [];
        const categories = ['work', 'personal', 'shopping', 'exams', 'project', 'extra'];

        function addTask() {
            const input = document.getElementById('newTask');
            const category = document.getElementById('taskCategory');
            const taskText = input.value.trim();
            if (taskText) {
                const task = {
                    id: Date.now(),
                    text: taskText,
                    completed: false,
                    priority: 'medium',
                    dueDate: new Date().toISOString().split('T')[0],
                    category: category.value
                };
                tasks.push(task);
                renderTasks();
                input.value = '';
            }
        }

        function renderTasks() {
            const categoryContainer = document.getElementById('categoryContainer');
            categoryContainer.innerHTML = '';

            categories.forEach(category => {
                const categoryTasks = tasks.filter(task => task.category === category);
                const categoryElement = document.createElement('div');
                categoryElement.className = 'category';
                categoryElement.innerHTML = `
                    <h2>${category.charAt(0).toUpperCase() + category.slice(1)}</h2>
                    <ul class="task-list">
                        ${categoryTasks.map(task => `
                            <li class="task-item ${task.completed ? 'completed' : ''}">
                                <div class="priority-indicator priority-${task.priority}"></div>
                                <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleComplete(${task.id})">
                                <span class="task-text">${task.text}</span>
                                <small>Due: ${task.dueDate}</small>
                                <div class="task-actions">
                                    <button onclick="changePriority(${task.id})"><i class="fas fa-flag"></i></button>
                                    <button onclick="editTask(${task.id})"><i class="fas fa-edit"></i></button>
                                    <button onclick="deleteTask(${task.id})"><i class="fas fa-trash-alt"></i></button>
                                </div>
                            </li>
                        `).join('')}
                    </ul>
                `;
                categoryContainer.appendChild(categoryElement);
            });
        }

        function toggleComplete(id) {
            const task = tasks.find(t => t.id === id);
            if (task) {
                task.completed = !task.completed;
                renderTasks();
            }
        }

        function editTask(id) {
            const task = tasks.find(t => t.id === id);
            if (task) {
                const newText = prompt('Edit task:', task.text);
                if (newText !== null) {
                    task.text = newText;
                    renderTasks();
                }
            }
        }

        function deleteTask(id) {
            if (confirm('Are you sure you want to delete this task?')) {
                tasks = tasks.filter(t => t.id !== id);
                renderTasks();
            }
        }

        function changePriority(id) {
            const task = tasks.find(t => t.id === id);
            if (task) {
                const priorities = ['low', 'medium', 'high'];
                const currentIndex = priorities.indexOf(task.priority);
                task.priority = priorities[(currentIndex + 1) % priorities.length];
                renderTasks();
            }
        }

        function filterTasks(filter) {
            const buttons = document.querySelectorAll('.filter-btn');
            buttons.forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');

            const taskItems = document.querySelectorAll('.task-item');
            taskItems.forEach(item => {
                switch(filter) {
                    case 'active':
                        item.style.display = item.classList.contains('completed') ? 'none' : 'flex';
                        break;
                    case 'completed':
                        item.style.display = item.classList.contains('completed') ? 'flex' : 'none';
                        break;
                    default:
                        item.style.display = 'flex';
                }
            });
        }

        function filterByDate() {
            const dateFilter = document.getElementById('dueDateFilter').value;
            const taskItems = document.querySelectorAll('.task-item');
            taskItems.forEach(item => {
                const taskDate = item.querySelector('small').textContent.split(': ')[1];
                item.style.display = taskDate === dateFilter ? 'flex' : 'none';
            });
        }

        function changeLayout(layout) {
            const container = document.querySelector('.category-container');
            const buttons = document.querySelectorAll('.layout-toggle button');
            
            buttons.forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');

            container.className = `category-container ${layout}-layout`;
        }

        function toggleTheme() {
            document.body.classList.toggle('dark-theme');
            const themeIcon = document.querySelector('.theme-toggle i');
            themeIcon.classList.toggle('fa-moon');
            themeIcon.classList.toggle('fa-sun');
        }

        function changeColor(color) {
            document.documentElement.style.setProperty('--primary-color', color);
        }

        // Initial render
        renderTasks();