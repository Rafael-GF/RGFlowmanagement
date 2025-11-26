// ==================== APP STATE ====================
const AppState = {
    currentPage: 'dashboard',
    user: null,
    darkMode: false
};


// ==================== UTILITY FUNCTIONS ====================
function showPage(pageName) {
    // Hide all page contents
    document.querySelectorAll('.page-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Show selected page
    const pageContent = document.getElementById(`${pageName}Content`);
    if (pageContent) {
        pageContent.classList.add('active');
    }
    
    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === pageName) {
            link.classList.add('active');
        }
    });
    
    AppState.currentPage = pageName;
}

function showToast(message, type = 'success') {
    // Simple toast notification (can be enhanced)
    alert(message);
}

// ==================== LOGIN FUNCTIONALITY ====================
function initLogin() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.getElementById('passwordToggle');
    const forgotPassword = document.getElementById('forgotPassword');
    const requestAccess = document.getElementById('requestAccess');
    
    // Password toggle
    passwordToggle.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        passwordToggle.querySelector('i').className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
    });
    
    // Login form submit
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = emailInput.value;
        const password = passwordInput.value;
        
        if (email && password.length >= 6) {
            // Simulate login
            AppState.user = {
                name: 'Admin RGFlow',
                email: email
            };
            
            // Switch to app
            document.getElementById('loginPage').classList.remove('active');
            document.getElementById('appPage').classList.add('active');
            
            // Initialize charts
            initCharts();
            
            showToast('Login realizado com sucesso!');
        } else {
            showToast('Por favor, preencha todos os campos corretamente', 'error');
        }
    });
    
    // Forgot password
    forgotPassword.addEventListener('click', (e) => {
        e.preventDefault();
        showToast('Link de recuperação enviado para seu e-mail', 'info');
    });
    
    // Request access
    requestAccess.addEventListener('click', (e) => {
        e.preventDefault();
        showToast('Solicitação de acesso enviada', 'info');
    });
}

// ==================== NAVIGATION ====================
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            showPage(page);
        });
    });
}

// ==================== CHARTS ====================
// ... (O código dos gráficos será mantido, mas será necessário garantir que as cores se adaptem ao modo noturno)
// Por simplicidade e foco na funcionalidade, vou manter as cores fixas no JS, mas o CSS já está preparado para o modo noturno.
function drawPieChart() {
    const canvas = document.getElementById('pieChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width = 300;
    const height = canvas.height = 300;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 90;
    const innerRadius = 55;
    
    const data = [
        { label: 'Concluídas', value: 1, color: '#10B981' },
        { label: 'Em Andamento', value: 2, color: '#06B6D4' },
        { label: 'Pendentes', value: 0, color: '#F59E0B' },
        { label: 'Atrasadas', value: 1, color: '#EF4444' }
    ];
    
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = -Math.PI / 2;
    
    ctx.clearRect(0, 0, width, height);
    
    data.forEach(item => {
        const sliceAngle = (item.value / total) * 2 * Math.PI;
        
        // Draw slice
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
        ctx.closePath();
        ctx.fillStyle = item.color;
        ctx.fill();
        
        currentAngle += sliceAngle;
    });
    
    // Draw legend
    const legend = document.getElementById('pieLegend');
    if (legend) {
        legend.innerHTML = '';
        data.forEach(item => {
            const legendItem = document.createElement('div');
            legendItem.className = 'legend-item';
            legendItem.innerHTML = `
                <div class="legend-dot" style="background: ${item.color}"></div>
                <span>${item.label}: ${item.value}</span>
            `;
            legend.appendChild(legendItem);
        });
    }
}

function drawBarChart() {
    const canvas = document.getElementById('barChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width = 600;
    const height = canvas.height = 300;
    const padding = 50;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    const data = [
        { day: 'Seg', atrasadas: 1, concluidas: 6, pendentes: 3 },
        { day: 'Ter', atrasadas: 2, concluidas: 9, pendentes: 3 },
        { day: 'Qua', atrasadas: 1, concluidas: 7, pendentes: 5 },
        { day: 'Qui', atrasadas: 1, concluidas: 7, pendentes: 2 },
        { day: 'Sex', atrasadas: 3, concluidas: 5, pendentes: 2 },
        { day: 'Sáb', atrasadas: 1, concluidas: 3, pendentes: 6 },
        { day: 'Dom', atrasadas: 3, concluidas: 2, pendentes: 2 }
    ];
    
    const maxValue = 12;
    const barWidth = (chartWidth / data.length) / 4;
    const gap = barWidth * 0.3;
    
    ctx.clearRect(0, 0, width, height);
    
    // Draw grid
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
        const y = padding + (chartHeight / 4) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }
    
    // Draw bars
    data.forEach((item, index) => {
        const x = padding + (chartWidth / data.length) * index + (chartWidth / data.length - barWidth * 3 - gap * 2) / 2;
        
        // Atrasadas (red)
        const atrasadasHeight = (item.atrasadas / maxValue) * chartHeight;
        ctx.fillStyle = '#EF4444';
        ctx.fillRect(x, padding + chartHeight - atrasadasHeight, barWidth, atrasadasHeight);
        
        // Concluídas (green)
        const concluidasHeight = (item.concluidas / maxValue) * chartHeight;
        ctx.fillStyle = '#10B981';
        ctx.fillRect(x + barWidth + gap, padding + chartHeight - concluidasHeight, barWidth, concluidasHeight);
        
        // Pendentes (yellow)
        const pendentesHeight = (item.pendentes / maxValue) * chartHeight;
        ctx.fillStyle = '#F59E0B';
        ctx.fillRect(x + barWidth * 2 + gap * 2, padding + chartHeight - pendentesHeight, barWidth, pendentesHeight);
        
        // Day label
        ctx.fillStyle = '#6B7280';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(item.day, x + (barWidth * 3 + gap * 2) / 2, height - padding + 20);
    });
    
    // Legend
    const legendData = [
        { label: 'Atrasadas', color: '#EF4444' },
        { label: 'Concluídas', color: '#10B981' },
        { label: 'Pendentes', color: '#F59E0B' }
    ];
    
    let legendX = padding;
    const legendY = padding - 25;
    
    legendData.forEach(item => {
        ctx.fillStyle = item.color;
        ctx.fillRect(legendX, legendY, 12, 12);
        ctx.fillStyle = '#6B7280';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(item.label, legendX + 18, legendY + 10);
        legendX += ctx.measureText(item.label).width + 40;
    });
}

function drawReportPieChart() {
    const canvas = document.getElementById('reportPieChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width = 350;
    const height = canvas.height = 350;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 100;
    const innerRadius = 60;
    
    const data = [
        { label: 'Concluídas', value: 1, color: '#10B981', percent: '25%' },
        { label: 'Em Andamento', value: 2, color: '#06B6D4', percent: '50%' },
        { label: 'Pendentes', value: 0, color: '#F59E0B', percent: '0%' },
        { label: 'Atrasadas', value: 1, color: '#EF4444', percent: '25%' }
    ];
    
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = -Math.PI / 2;
    
    ctx.clearRect(0, 0, width, height);
    
    data.forEach(item => {
        const sliceAngle = (item.value / total) * 2 * Math.PI;
        
        // Draw slice
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
        ctx.closePath();
        ctx.fillStyle = item.color;
        ctx.fill();
        
        // Draw label
        if (item.value > 0) {
            const labelAngle = currentAngle + sliceAngle / 2;
            const labelRadius = radius + 30;
            const labelX = centerX + Math.cos(labelAngle) * labelRadius;
            const labelY = centerY + Math.sin(labelAngle) * labelRadius;
            
            ctx.fillStyle = item.color;
            ctx.font = '13px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(`${item.label} ${item.percent}`, labelX, labelY);
        }
        
        currentAngle += sliceAngle;
    });
    
    // Draw legend
    const legend = document.getElementById('reportPieLegend');
    if (legend) {
        legend.innerHTML = '';
        data.forEach(item => {
            const legendItem = document.createElement('div');
            legendItem.className = 'legend-item';
            legendItem.innerHTML = `
                <div class="legend-dot" style="background: ${item.color}"></div>
                <span>${item.label}: ${item.value}</span>
            `;
            legend.appendChild(legendItem);
        });
    }
}

function drawHorizontalBarChart() {
    const canvas = document.getElementById('horizontalBarChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width = 500;
    const height = canvas.height = 300;
    const padding = 100;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding;
    
    const data = [
        { label: 'Novos', value: 1, color: '#2B5797' },
        { label: 'Em Andamento', value: 0.8, color: '#06B6D4' },
        { label: 'Aguardando', value: 1, color: '#F59E0B' },
        { label: 'Concluídos', value: 0.2, color: '#10B981' }
    ];
    
    const barHeight = chartHeight / data.length / 1.5;
    const gap = (chartHeight - barHeight * data.length) / (data.length + 1);
    
    ctx.clearRect(0, 0, width, height);
    
    data.forEach((item, index) => {
        const y = gap + (barHeight + gap) * index;
        const barWidth = item.value * chartWidth;
        
        // Draw bar
        ctx.fillStyle = item.color;
        ctx.fillRect(padding, y, barWidth, barHeight);
        
        // Draw label
        ctx.fillStyle = '#6B7280';
        ctx.font = '13px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(item.label, padding - 10, y + barHeight / 2 + 5);
    });
    
    // Draw scale
    ctx.fillStyle = '#9CA3AF';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    for (let i = 0; i <= 4; i++) {
        const x = padding + (chartWidth / 4) * i;
        const value = (i * 0.25).toFixed(2);
        ctx.fillText(value, x, height - 10);
        
        // Grid line
        ctx.strokeStyle = '#E5E7EB';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height - 30);
        ctx.stroke();
    }
}

function initCharts() {
    // Re-draw charts to ensure they are visible after login
    if (document.getElementById('pieChart')) drawPieChart();
    if (document.getElementById('barChart')) drawBarChart();
    if (document.getElementById('reportPieChart')) drawReportPieChart();
    if (document.getElementById('horizontalBarChart')) drawHorizontalBarChart();
}


// ==================== DARK MODE ====================
function initDarkMode() {
    const darkModeBtn = document.getElementById('darkModeBtn');
    
    // Check for saved preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        AppState.darkMode = true;
    }
    
    // Initial icon state
    const icon = darkModeBtn.querySelector('i');
    icon.className = AppState.darkMode ? 'fas fa-sun' : 'fas fa-moon';
    
    darkModeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        AppState.darkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', AppState.darkMode);
        
        icon.className = AppState.darkMode ? 'fas fa-sun' : 'fas fa-moon';
        
        // Re-draw charts to apply potential color changes (if implemented)
        initCharts();
    });
}

// ==================== BUTTON ACTIONS ====================
function initButtonActions() {
    // Novo Atendimento (Dashboard)
    const novoAtendimentoBtn = document.querySelector('#dashboardContent .btn-success');
    if (novoAtendimentoBtn) {
        novoAtendimentoBtn.addEventListener('click', () => {
            showPage('atendimentos');
            showToast('Redirecionando para o formulário de Novo Atendimento', 'info');
        });
    }
    
    // Novo Atendimento (Atendimentos)
    const novoAtendimentoPageBtn = document.querySelector('#atendimentosContent .btn-light');
    if (novoAtendimentoPageBtn) {
        novoAtendimentoPageBtn.addEventListener('click', () => {
            showToast('Abrindo formulário de Novo Atendimento (Simulação)', 'info');
            // Aqui você poderia resetar o formulário
        });
    }
    
    // Enviar Documento (Documentos)
    const enviarDocumentoBtn = document.querySelector('#documentosContent .btn-success');
    if (enviarDocumentoBtn) {
        enviarDocumentoBtn.addEventListener('click', () => {
            // Simula a abertura da janela de seleção de arquivos
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.multiple = true;
            fileInput.click();
            
            fileInput.addEventListener('change', () => {
                showToast(`Simulação: ${fileInput.files.length} arquivo(s) selecionado(s) para upload.`, 'success');
            });
        });
    }
    
    // Nova Tarefa (Tarefas)
    const novaTarefaBtn = document.getElementById('novaTarefaBtn');
    if (novaTarefaBtn) {
        novaTarefaBtn.addEventListener('click', () => {
            showToast('Abrindo modal/formulário para Nova Tarefa (Simulação)', 'info');
        });
    }
    
    // Ações da Tabela de Tarefas (Simulação)
    document.querySelectorAll('.tasks-table .icon-btn-small').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = e.currentTarget.querySelector('i').classList[1];
            const taskTitle = e.currentTarget.closest('tr').querySelector('.task-title').textContent;
            
            if (action === 'fa-eye') {
                showToast(`Visualizando detalhes da tarefa: "${taskTitle}"`, 'info');
            } else if (action === 'fa-edit') {
                showToast(`Editando tarefa: "${taskTitle}"`, 'info');
            } else if (action === 'fa-trash') {
                showToast(`Excluindo tarefa: "${taskTitle}" (Simulação)`, 'error');
            }
        });
    });
    
    // Ações da Lista de Documentos (Simulação)
    document.querySelectorAll('.doc-item .icon-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = e.currentTarget.querySelector('i').classList[1];
            const docTitle = e.currentTarget.closest('.doc-item').querySelector('h4').textContent;
            
            if (action === 'fa-eye') {
                showToast(`Visualizando documento: "${docTitle}"`, 'info');
            } else if (action === 'fa-download') {
                showToast(`Baixando documento: "${docTitle}" (Simulação)`, 'success');
            } else if (action === 'fa-share-alt') {
                showToast(`Compartilhando documento: "${docTitle}" (Simulação)`, 'info');
            } else if (action === 'fa-trash') {
                showToast(`Excluindo documento: "${docTitle}" (Simulação)`, 'error');
            }
        });
    });
}

// ==================== NOTIFICATIONS ====================
function initNotifications() {
    const notificationBtn = document.getElementById('notificationBtn');
    
    notificationBtn.addEventListener('click', () => {
        showToast('Você tem 2 notificações não lidas', 'info');
    });
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize login
    initLogin();
    
    // Initialize navigation
    initNavigation();
    
    // Initialize dark mode
    initDarkMode();
    
    // Initialize notifications
    initNotifications();
    
    // Initialize button actions
    initButtonActions();
    
    // Show login page by default
    document.getElementById('loginPage').classList.add('active');
});
