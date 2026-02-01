const initialTasks = [
    { id: 1, title: "Design System Architecture", tag: "Work", date: "today", completed: false },
    { id: 2, title: "Finalize Project Orion Deck", tag: "Work", date: "today", completed: true },
    { id: 3, title: "Prepare UI Assets for Dev", tag: "Personal", date: "tomorrow", completed: false },
    { id: 4, title: "Review feedback from Stakeholders", tag: "Work", date: "2 days", completed: false },
    { id: 5, title: "Client Sync Meeting", tag: "Work", date: "tomorrow", completed: false }
];

let tasks = [...initialTasks];

function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const item = document.createElement('div');
        item.className = `task-item ${task.completed ? 'completed' : ''}`;

        const tagClass = task.tag.toLowerCase() === 'work' ? 'tag-work' : 'tag-personal';

        item.innerHTML = `
            <div class="checkbox" onclick="toggleTask(${task.id})"></div>
            <div class="task-info">
                <div class="task-title">${task.title}</div>
                <div class="task-meta">
                    <span class="tag ${tagClass}">${task.tag}</span>
                    <span>•</span>
                    <span>Due ${task.date}</span>
                </div>
            </div>
            <div style="color: var(--text-muted); cursor: pointer;">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="10" cy="5" r="1.5" fill="currentColor"/>
                    <circle cx="10" cy="10" r="1.5" fill="currentColor"/>
                    <circle cx="10" cy="15" r="1.5" fill="currentColor"/>
                </svg>
            </div>
        `;
        taskList.appendChild(item);
    });
}

window.toggleTask = function (id) {
    tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    renderTasks();
    updateStats();
};


const modalOverlay = document.getElementById('modalOverlay');
const taskTitleInput = document.getElementById('taskTitleInput');
const submitTaskBtn = document.getElementById('submitTask');
const closeModalBtn = document.getElementById('closeModal');
const addTaskBtn = document.getElementById('addTaskBtn');
const catBtns = document.querySelectorAll('.cat-btn');

let selectedCategory = 'Work';

// Category Selection
catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        catBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedCategory = btn.dataset.category;
    });
});

// Modal Controls
addTaskBtn.addEventListener('click', () => {
    modalOverlay.classList.add('active');
    taskTitleInput.focus();
});

closeModalBtn.addEventListener('click', () => {
    modalOverlay.classList.remove('active');
    taskTitleInput.value = '';
});

modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
        taskTitleInput.value = '';
    }
});

submitTaskBtn.addEventListener('click', () => {
    const title = taskTitleInput.value.trim();
    if (title) {
        const newTask = {
            id: Date.now(),
            title: title,
            tag: selectedCategory,
            date: "today",
            completed: false
        };
        tasks.unshift(newTask);
        renderTasks();
        updateStats();

        modalOverlay.classList.remove('active');
        taskTitleInput.value = '';
    }
});


// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateStats();
    renderTasks();
});

function updateStats() {
    const today = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    const dateString = today.toLocaleDateString('en-US', options);

    // Update Calendar Card
    const calendarCard = document.querySelector('.calendar-card');
    if (calendarCard) {
        calendarCard.innerHTML = `
            <div style="font-weight: 600; margin-bottom: 4px;">${today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
            <div style="font-size: 0.875rem; color: var(--text-muted);">${dateString}</div>
        `;
    }

    // Update Greeting
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const remainingTasks = totalTasks - completedTasks;

    const welcomeMsg = document.querySelector('.welcome-msg p');
    if (welcomeMsg) {
        welcomeMsg.textContent = `You have ${remainingTasks} tasks to complete today.`;
    }

    // Update Stat Cards
    const stats = document.querySelectorAll('.stat-value');
    if (stats.length > 0) {
        const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        stats[0].textContent = `${percentage}%`;
    }
}
