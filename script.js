let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const prioritySelect = document.getElementById('prioritySelect');
    
    if (taskInput.value.trim() === '') return;

    const task = {
        id: Date.now(),
        text: taskInput.value,
        completed: false,
        priority: prioritySelect.value,
        date: new Date().toLocaleDateString()
    };

    tasks.push(task);
    saveTasks();
    renderTasks();
    taskInput.value = '';
}

function toggleTask(id) {
    tasks = tasks.map(task => 
        task.id === id ? {...task, completed: !task.completed} : task
    );
    saveTasks();
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

function filterTasks(filter) {
    currentFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase() === filter) {
            btn.classList.add('active');
        }
    });
    renderTasks();
}

function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    let filteredTasks = tasks;
    if (currentFilter === 'active') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }

    filteredTasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskElement.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} 
                onclick="toggleTask(${task.id})">
            <span class="task-text">${task.text}</span>
            <span class="priority-badge priority-${task.priority}">
                ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
            <span class="date">${task.date}</span>
            <button class="delete-btn" onclick="deleteTask(${task.id})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        taskList.appendChild(taskElement);
    });
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Initial render
renderTasks();

// Enter key support for adding tasks
document.getElementById('taskInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});


// Add at the beginning of the file
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.getElementById('theme-toggle').checked = savedTheme === 'dark';
}

function toggleTheme(e) {
    const isDark = e.target.checked;
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Add after your existing event listeners
document.getElementById('theme-toggle').addEventListener('change', toggleTheme);
initTheme();