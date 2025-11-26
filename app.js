/* RGFlow SPA — Auth (obrigatório) + LocalStorage DB + UI interactions + Charts */

/* Helpers */
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

const LS_USER = 'rg_user_v2';
const LS_DB = 'rg_db_v2'; // {clients:[], atendimentos:[], documentos:[], tarefas:[]}

/* ---------- AUTH ---------- */
const defaultUser = { email: 'admin@rgflow.com', pass: '123456' };

function getUser() {
  try { return JSON.parse(localStorage.getItem(LS_USER)); } catch(e){ return null; }
}
function setUser(u) { localStorage.setItem(LS_USER, JSON.stringify(u)); }
function clearUser() { localStorage.removeItem(LS_USER); }

function showLogin() {
  $('#screen-login').classList.remove('hidden');
  $('#screen-app').classList.add('hidden');
}
function showApp() {
  $('#screen-login').classList.add('hidden');
  $('#screen-app').classList.remove('hidden');
}

function initAuth() {
  const stored = getUser();
  if (stored && stored.logged) { showApp(); initApp(); }
  else { showLogin(); }

  $('#form-login').addEventListener('submit', e => {
    e.preventDefault();
    const email = $('#login-email').value.trim().toLowerCase();
    const pass = $('#login-pass').value;
    if (email === defaultUser.email && pass === defaultUser.pass) {
      setUser({ email, logged: true });
      showApp();
      initApp();
    } else {
      $('#login-error').textContent = 'E-mail ou senha inválidos. (Use admin@rgflow.com / 123456)';
      $('#login-pass').value = '';
    }
  });

  $('#toggle-pw').addEventListener('click', () => {
    const inp = $('#login-pass');
    inp.type = inp.type === 'password' ? 'text' : 'password';
  });
}

/* ---------- DB (localStorage) ---------- */
function readDB() {
  const raw = localStorage.getItem(LS_DB);
  if (!raw) {
    const seed = { clients: [], atendimentos: [], documentos: [], tarefas: [] };
    localStorage.setItem(LS_DB, JSON.stringify(seed));
    return seed;
  }
  return JSON.parse(raw);
}
function writeDB(db) { localStorage.setItem(LS_DB, JSON.stringify(db)); }

/* ---------- UI Navigation ---------- */
function setActiveNav(route) {
  $$('.nav-link').forEach(n => n.classList.remove('active'));
  const el = [...$$('.nav-link')].find(a => a.dataset.route === route);
  if (el) el.classList.add('active');
}
function showView(route) {
  $('#page-title').textContent = route[0].toUpperCase() + route.slice(1);
  $('#page-sub').textContent = {
    dashboard: 'Visão geral do sistema',
    atendimentos: 'Gerencie atendimentos e arquivos',
    tarefas: 'Tarefas e prazos',
    documentos: 'Arquivos enviados',
    relatorios: 'Relatórios e exportações'
  }[route] || '';
  $$('.view').forEach(v => v.classList.add('hidden'));
  const target = $(`#view-${route}`);
  if (target) target.classList.remove('hidden');
  setActiveNav(route);
}

/* wire nav */
function initNav() {
  $$('.nav-link').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const r = a.dataset.route;
      showView(r);
      renderAll();
    });
  });
  $('#logout').addEventListener('click', () => {
    if (confirm('Deseja sair?')) { clearUser(); location.reload(); }
  });
  $('#btn-logout-inline').addEventListener('click', ()=> { clearUser(); location.reload(); });
  $('#btn-new').addEventListener('click', ()=> { showView('atendimentos'); openModalAtt(); });
}

/* ---------- Dashboard + Charts ---------- */
let charts = {};
function renderDashboard() {
  const db = readDB();
  $('#card-clients').textContent = db.clients.length;
  $('#card-atend').textContent = db.atendimentos.length;
  $('#card-docs').textContent = db.documentos.length;
  $('#card-tasks').textContent = db.tarefas.length;

  const concluded = db.tarefas.filter(t => t.done).length;
  const rate = db.tarefas.length ? Math.round(concluded / db.tarefas.length * 100) : 0;
  $('#rate-text').textContent = rate + '%';
  $('#rate-bar').style.width = rate + '%';

  // Pie & bar charts (if elements exist)
  const pieEl = document.getElementById('chart-pie');
  const barEl = document.getElementById('chart-bar');
  if (pieEl && barEl) {
    const pieCtx = pieEl.getContext('2d');
    const barCtx = barEl.getContext('2d');

    const pending = db.tarefas.filter(t => !t.done).length;
    const overdue = db.tarefas.filter(t => t.due && new Date(t.due) < new Date() && !t.done).length;

    if (charts.pie) charts.pie.destroy();
    charts.pie = new Chart(pieCtx, {
      type: 'doughnut',
      data: {
        labels: ['Concluídas','Pendentes','Atrasadas'],
        datasets: [{ data: [concluded, pending, overdue], backgroundColor: ['#10b981','#f59e0b','#ef4444'] }]
      },
      options: { plugins: { legend: { position: 'bottom' } } }
    });

    if (charts.bar) charts.bar.destroy();
    charts.bar = new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'],
        datasets: [{ label: 'Atendimentos', data: [2,4,6,3,5,4,2], backgroundColor: '#2b6fd6' }]
      },
      options: { scales: { y: { beginAtZero: true } }, plugins: { legend: { display: false } } }
    });
  }
}

/* ---------- Atendimentos (CRUD + upload) ---------- */
function renderAtendimentos() {
  const db = readDB();
  const list = db.atendimentos.slice().reverse();
  const container = $('#list-atendimentos');
  container.innerHTML = '';
  if (!list.length) { container.innerHTML = '<div class="card muted">Nenhum atendimento.</div>'; return; }
  list.forEach(a => {
    const div = document.createElement('div');
    div.className = 'list-item animate-pop';
    div.innerHTML = `
      <div>
        <div style="font-weight:700">${a.client || '—'}</div>
        <div class="meta">${(a.desc||'').slice(0,120)}</div>
        <div class="small muted">${new Date(a.created).toLocaleString()}</div>
      </div>
      <div>
        <button class="btn" data-id="${a.id}" data-act="view">Ver</button>
        <button class="btn" data-id="${a.id}" data-act="files">Arquivos</button>
        <button class="btn" data-id="${a.id}" data-act="del">Excluir</button>
      </div>
    `;
    container.appendChild(div);
  });

  // handlers
  container.querySelectorAll('button').forEach(b => {
    b.addEventListener('click', async (ev) => {
      const id = b.dataset.id;
      const act = b.dataset.act;
      const db = readDB();
      const idx = db.atendimentos.findIndex(x => x.id === id);
      if (act === 'view') {
        const it = db.atendimentos[idx];
        alert(`Atendimento: ${it.client}\n\n${it.desc || '(sem descrição)'}`);
      }
      if (act === 'files') {
        const it = db.atendimentos[idx];
        if (!it.files || !it.files.length) return alert('Nenhum arquivo anexado.');
        it.files.forEach(f => {
          const bytes = atob(f.data.split(',')[1]);
          const ia = new Uint8Array(bytes.length);
          for(let i=0;i<bytes.length;i++) ia[i]=bytes.charCodeAt(i);
          const blob = new Blob([ia], { type: f.type || 'application/octet-stream' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a'); a.href = url; a.download = f.name; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
        });
      }
      if (act === 'del') {
        if (!confirm('Excluir atendimento?')) return;
        db.atendimentos.splice(idx,1); writeDB(db); renderAtendimentos(); renderDashboard();
      }
    });
  });
}

/* modal open/close */
function openModalAtt() { $('#modal-att').classList.remove('hidden'); }
function closeModalAtt() { $('#modal-att').classList.add('hidden'); }

function initAtendimentos() {
  $('#btn-create-atendimento').addEventListener('click', openModalAtt);
  $('#close-att').addEventListener('click', closeModalAtt);
  $('#save-att').addEventListener('click', async () => {
    const client = $('#att-client').value.trim();
    const desc = $('#att-desc').value.trim();
    const filesInput = $('#att-files');
    const files = [];
    for (const f of filesInput.files) files.push({ name: f.name, type: f.type, size: f.size, data: await toBase64(f) });
    if (!client) return alert('Informe o cliente.');
    const db = readDB();
    db.atendimentos.push({ id: genId(), client, desc, files, created: new Date().toISOString() });
    writeDB(db);
    $('#att-client').value = ''; $('#att-desc').value = ''; $('#att-files').value = null;
    closeModalAtt(); renderAtendimentos(); renderDashboard();
  });

  $('#search-atendimento').addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    const db = readDB();
    const filtered = db.atendimentos.filter(a => (a.client||'').toLowerCase().includes(q) || (a.desc||'').toLowerCase().includes(q));
    const container = $('#list-atendimentos'); container.innerHTML = '';
    filtered.slice().reverse().forEach(a => {
      const div = document.createElement('div');
      div.className = 'list-item';
      div.innerHTML = `<div><div style="font-weight:700">${a.client}</div><div class="meta">${(a.desc||'').slice(0,120)}</div></div><div class="small muted">${new Date(a.created).toLocaleString()}</div>`;
      container.appendChild(div);
    });
  });
}

/* ---------- Documents ---------- */
async function initDocuments() {
  $('#upload-docs').addEventListener('click', async () => {
    const inp = $('#doc-files');
    if (!inp.files.length) return alert('Selecione arquivos');
    const db = readDB();
    for (const f of inp.files) {
      db.documentos.push({ id: genId(), name: f.name, type: f.type, size: f.size, data: await toBase64(f), uploaded: new Date().toISOString() });
    }
    writeDB(db); inp.value = null; renderDocumentos(); renderDashboard();
  });
}

function renderDocumentos() {
  const db = readDB();
  const list = db.documentos.slice().reverse();
  const box = $('#docs-list'); box.innerHTML = '';
  if (!list.length) { box.innerHTML = '<div class="card muted">Nenhum documento.</div>'; return; }
  list.forEach(d => {
    const div = document.createElement('div');
    div.className = 'list-item';
    div.innerHTML = `<div><div style="font-weight:700">${d.name}</div><div class="meta">${(d.size/1024).toFixed(1)} KB • ${d.type}</div></div>
      <div><button class="btn" data-id="${d.id}" data-act="download">Baixar</button><button class="btn" data-id="${d.id}" data-act="del">Excluir</button></div>`;
    box.appendChild(div);
  });

  box.querySelectorAll('button').forEach(b => {
    b.addEventListener('click', () => {
      const id = b.dataset.id; const act = b.dataset.act;
      const db = readDB(); const idx = db.documentos.findIndex(x => x.id === id);
      if (act === 'download') {
        const d = db.documentos[idx];
        const bytes = atob(d.data.split(',')[1]); const ia = new Uint8Array(bytes.length);
        for (let i=0;i<bytes.length;i++) ia[i]=bytes.charCodeAt(i);
        const blob = new Blob([ia], { type: d.type }); const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = d.name; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
      }
      if (act === 'del') {
        if (!confirm('Excluir documento?')) return;
        db.documentos.splice(idx,1); writeDB(db); renderDocumentos(); renderDashboard();
      }
    });
  });
}

/* ---------- Tarefas ---------- */
function initTarefas() {
  $('#add-task').addEventListener('click', ()=> {
    const txt = $('#new-task-input').value.trim(); if (!txt) return alert('Digite a tarefa');
    const db = readDB(); db.tarefas.push({ id: genId(), title: txt, done: false, created: new Date().toISOString() });
    writeDB(db); $('#new-task-input').value=''; renderTarefas(); renderDashboard();
  });
}

function renderTarefas() {
  const db = readDB();
  const box = $('#tasks-list'); box.innerHTML = '';
  if (!db.tarefas.length) { box.innerHTML = '<div class="muted">Nenhuma tarefa.</div>'; return; }
  db.tarefas.slice().reverse().forEach(t => {
    const div = document.createElement('div'); div.className='list-item';
    div.innerHTML = `<div>${t.title}<div class="meta small muted">${new Date(t.created).toLocaleString()}</div></div>
      <div><button class="btn" data-id="${t.id}" data-act="toggle">${t.done? 'Reabrir' : 'Concluir'}</button><button class="btn" data-id="${t.id}" data-act="del">Excluir</button></div>`;
    box.appendChild(div);
  });
  box.querySelectorAll('button').forEach(b => {
    b.addEventListener('click', ()=> {
      const id = b.dataset.id; const act = b.dataset.act; const db = readDB(); const idx = db.tarefas.findIndex(x=>x.id===id);
      if (act==='toggle'){ db.tarefas[idx].done = !db.tarefas[idx].done; writeDB(db); renderTarefas(); renderDashboard(); }
      if (act==='del'){ if (confirm('Excluir tarefa?')){ db.tarefas.splice(idx,1); writeDB(db); renderTarefas(); renderDashboard(); } }
    });
  });
}

/* ---------- Reports (CSV / charts) ---------- */
function renderReports() {
  const db = readDB();
  const ctxLineEl = document.getElementById('chart-line');
  if (ctxLineEl) {
    const ctxLine = ctxLineEl.getContext('2d');
    if (charts.line) charts.line.destroy();
    charts.line = new Chart(ctxLine, { type:'line', data:{ labels:['Jan','Fev','Mar','Abr','Mai','Jun'], datasets:[{ label:'Atendimentos', data:[2,4,6,3,5, db.atendimentos.length ], borderColor:'#2b6fd6', fill:false }] }, options:{ plugins:{ legend:{ display:false } } } });
  }

  const ctxDonutEl = document.getElementById('chart-donut');
  if (ctxDonutEl) {
    const ctxDonut = ctxDonutEl.getContext('2d');
    if (charts.donut) charts.donut.destroy();
    charts.donut = new Chart(ctxDonut, { type:'doughnut', data:{ labels:['Tarefas','Documentos','Atendimentos'], datasets:[{ data:[db.tarefas.length, db.documentos.length, db.atendimentos.length], backgroundColor:['#10b981','#f59e0b','#2b6fd6'] }] }, options:{ plugins:{ legend:{ position:'bottom' } } } });
  }
}

/* ---------- Utilities ---------- */
function genId(){ return Math.random().toString(36).slice(2,9); }
function toBase64(file){ return new Promise(res => { const r = new FileReader(); r.onload = ()=> res(r.result); r.readAsDataURL(file); }); }

/* ---------- Render all ---------- */
function renderAll(){
  renderDashboard(); renderAtendimentos(); renderDocumentos(); renderTarefas(); renderReports();
}

/* ---------- Init app after login ---------- */
function initApp(){
  initNav(); initAtendimentos(); initDocuments(); initTarefas();
  renderAll();
  showView('dashboard');

  // quick actions
  $('#forgot').addEventListener('click', (e)=>{ e.preventDefault(); alert('Solicitação enviada — verifique seu e-mail.'); });

  // export CSV
  $('#export-csv').addEventListener('click', ()=> {
    const db = readDB();
    let csv = 'id,client,desc,created\n';
    db.atendimentos.forEach(a => csv += `${a.id},"${(a.client||'').replace(/"/g,'""')}","${(a.desc||'').replace(/"/g,'""')}",${a.created}\n`);
    const blob = new Blob([csv], { type: 'text/csv' }); const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download='atendimentos.csv'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  });

  // close modal clicking outside
  $('#modal-att').addEventListener('click', (e) => { if (e.target.id === 'modal-att') closeModalAtt(); });
}

/* ---------- Init (auth) ---------- */
initAuth();
