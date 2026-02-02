// ====== FUNÇÕES GERAIS ======

// Atualizar ano atual no rodapé
function updateCurrentYear() {
    const currentYear = new Date().getFullYear();
    document.getElementById('currentYear').textContent = currentYear;
}

// ====== CONTADOR INTERATIVO ======
let counter = 0;
const counterValue = document.getElementById('counterValue');
const decrementBtn = document.getElementById('decrementBtn');
const resetBtn = document.getElementById('resetBtn');
const incrementBtn = document.getElementById('incrementBtn');

function updateCounter() {
    counterValue.textContent = counter;
    // Mudar cor conforme valor
    if (counter > 0) {
        counterValue.style.color = '#4fc3a1'; // Verde
    } else if (counter < 0) {
        counterValue.style.color = '#e74c3c'; // Vermelho
    } else {
        counterValue.style.color = 'var(--secondary-color)'; // Azul padrão
    }
}

// Event listeners do contador
decrementBtn.addEventListener('click', () => {
    counter--;
    updateCounter();
});

incrementBtn.addEventListener('click', () => {
    counter++;
    updateCounter();
});

resetBtn.addEventListener('click', () => {
    counter = 0;
    updateCounter();
});

// ====== LISTA DE TAREFAS ======
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
let tasks = [];

// Carregar tarefas do localStorage, se existirem
function loadTasks() {
    if (localStorage.getItem('tasks')) {
        tasks = JSON.parse(localStorage.getItem('tasks'));
        renderTasks();
    }
}

// Adicionar nova tarefa
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') {
        taskInput.focus();
        return;
    }
    
    const task = {
        id: Date.now(),
        text: taskText,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    tasks.push(task);
    saveTasks();
    renderTasks();
    taskInput.value = '';
    taskInput.focus();
}

// Deletar tarefa
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

// Alternar status da tarefa
function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return {...task, completed: !task.completed};
        }
        return task;
    });
    saveTasks();
    renderTasks();
}

// Salvar tarefas no localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Renderizar lista de tarefas
function renderTasks() {
    taskList.innerHTML = '';
    
    if (tasks.length === 0) {
        taskList.innerHTML = '<p class="empty-tasks">Nenhuma tarefa adicionada. Comece adicionando uma tarefa acima!</p>';
        return;
    }
    
    // Ordenar tarefas (não completadas primeiro)
    const sortedTasks = [...tasks].sort((a, b) => {
        if (a.completed && !b.completed) return 1;
        if (!a.completed && b.completed) return -1;
        return 0;
    });
    
    sortedTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        
        li.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
            <button class="task-delete" data-id="${task.id}" title="Excluir tarefa">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        // Adicionar eventos
        const checkbox = li.querySelector('.task-checkbox');
        const deleteBtn = li.querySelector('.task-delete');
        
        checkbox.addEventListener('change', () => toggleTask(task.id));
        deleteBtn.addEventListener('click', () => {
            if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
                deleteTask(task.id);
            }
        });
        
        taskList.appendChild(li);
    });
}

// Event listeners da lista de tarefas
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

// ====== MODAL ======
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelBtn = document.getElementById('cancelBtn');
const modalOverlay = document.getElementById('modalOverlay');
const loginForm = document.getElementById('loginForm');

// Abrir modal
openModalBtn.addEventListener('click', () => {
    modalOverlay.classList.add('active');
    document.getElementById('username').focus();
});

// Fechar modal
function closeModal() {
    modalOverlay.classList.remove('active');
    loginForm.reset();
}

// Event listeners do modal
closeModalBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
});

// Fechar modal com ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeModal();
    }
});

// Enviar formulário
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    // Validação básica
    if (!username) {
        alert('Por favor, insira um nome de usuário.');
        document.getElementById('username').focus();
        return;
    }
    
    // Simulação de login
    alert(`Login realizado com sucesso!\n\nUsuário: ${username}\n\nEsta é uma demonstração - os dados não são armazenados em servidor.`);
    closeModal();
});

// ====== MUDANÇA DE TEMA ======
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');

// Verificar preferência do sistema
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Verificar tema salvo no localStorage
const savedTheme = localStorage.getItem('theme');

// Aplicar tema salvo ou preferência do sistema
function applySavedTheme() {
    if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
        document.body.classList.add('dark-theme');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        document.body.classList.remove('dark-theme');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
}

// Alternar tema
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    
    if (document.body.classList.contains('dark-theme')) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
    }
});

// ====== INICIALIZAÇÃO ======
function init() {
    updateCurrentYear();
    updateCounter();
    loadTasks();
    applySavedTheme();
    
    // Adicionar algumas tarefas de exemplo se estiver vazio
    if (tasks.length === 0) {
        const exampleTasks = [
            "Estudar JavaScript",
            "Criar projeto de portfólio",
            "Aprender Git e GitHub"
        ];
        
        // Não adiciona automaticamente, só mostra mensagem
        console.log('Lista de tarefas vazia. Adicione algumas tarefas!');
    }
}

// Inicializar aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', init);