document.addEventListener('DOMContentLoaded', loadTasksFromStorage);

const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const taskText = input.value.trim();
  if (taskText === '') return;

  createTaskElement(taskText);
  saveTaskToStorage(taskText);
  input.value = '';
});

function createTaskElement(text, completed = false) {
    const li = document.createElement('li');
    li.className = 'task';
    if (completed) li.classList.add('completed');
  
    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = text;
  
    // Контейнер за бутоните
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';
  
    const doneBtn = document.createElement('button');
    doneBtn.innerHTML = '✔️';
    doneBtn.title = 'Завършена';
    doneBtn.addEventListener('click', () => {
      li.classList.toggle('completed');
      updateTaskStatus(text);
    });
  
    const editBtn = document.createElement('button');
    editBtn.innerHTML = '✏️';
    editBtn.title = 'Редактирай';
    editBtn.addEventListener('click', () => {
      const newText = prompt('Редактирай задачата:', span.textContent);
      if (newText && newText.trim() !== '') {
        updateTaskText(text, newText.trim());
        span.textContent = newText.trim();
      }
    });
  
    const delBtn = document.createElement('button');
    delBtn.innerHTML = '🗑️';
    delBtn.title = 'Изтрий';
    delBtn.addEventListener('click', () => {
      li.remove();
      deleteTaskFromStorage(text);
    });
  
    // Добавяме бутоните към групата
    buttonGroup.appendChild(doneBtn);
    buttonGroup.appendChild(editBtn);
    buttonGroup.appendChild(delBtn);
  
    // Добавяме всичко към задачата
    li.appendChild(span);
    li.appendChild(buttonGroup);
    taskList.appendChild(li);
  }
  
  
  

function saveTaskToStorage(taskText) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push({ text: taskText, completed: false });
  localStorage.setItem('tasks', JSON.stringify(tasks));
  updateTaskCounter();
}

function deleteTaskFromStorage(taskText) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks = tasks.filter(task => task.text !== taskText);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  updateTaskCounter();
}

function updateTaskStatus(taskText) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const updated = tasks.map(task => {
    if (task.text === taskText) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });
  localStorage.setItem('tasks', JSON.stringify(updated));
  updateTaskCounter();
}

function updateTaskText(oldText, newText) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updated = tasks.map(task => {
      if (task.text === oldText) {
        return { ...task, text: newText };
      }
      return task;
    });
    localStorage.setItem('tasks', JSON.stringify(updated));
    updateTaskCounter();
  }
  

function loadTasksFromStorage() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach(task => {
    createTaskElement(task.text, task.completed);
  });
  updateTaskCounter();
}

function updateTaskCounter() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const total = tasks.length;
    const remaining = tasks.filter(task => !task.completed).length;
  
    const counter = document.getElementById('task-counter');
    counter.textContent = `Задачи: ${total} | Оставащи: ${remaining}`;
  }
  
  const filterButtons = document.querySelectorAll('.filter-btn');

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // Активен бутон
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    filterTasks(filter);
  });
});
function filterTasks(filter) {
    const allTasks = document.querySelectorAll('.task');
  
    allTasks.forEach(task => {
      const isCompleted = task.classList.contains('completed');
  
      if (filter === 'all') {
        task.style.display = 'flex';
      } else if (filter === 'completed') {
        task.style.display = isCompleted ? 'flex' : 'none';
      } else if (filter === 'active') {
        task.style.display = !isCompleted ? 'flex' : 'none';
      }
    });
  }
  