/* Simple SPA + fake-auth + storage for demo */
const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);

// ---------- Auth (front-end simulated) ----------
const defaultUser = {email:'admin@rgflow.com', pass:'123456'};
const LS_USER_KEY = 'rg_user';
const LS_DATA_KEY = 'rg_data_v1';

function getStoredUser(){ return JSON.parse(localStorage.getItem(LS_USER_KEY)); }
function setStoredUser(u){ localStorage.setItem(LS_USER_KEY, JSON.stringify(u)); }
function clearUser(){ localStorage.removeItem(LS_USER_KEY); }

function showLogin(){ $('#screen-login').classList.remove('hidden'); $('#screen-app').classList.add('hidden'); }
function showApp(){ $('#screen-login').classList.add('hidden'); $('#screen-app').classList.remove('hidden'); }

function initAuth(){
  const stored = getStoredUser();
  if(stored && stored.logged) { showApp(); initApp(); } else { showLogin(); }
  // login
  $('#form-login').addEventListener('submit', e=>{
    e.preventDefault();
    const email = $('#login-email').value.trim();
    const pass = $('#login-pass').value;
    // simple check: either default user or any email with pass length >=4
    if((email === defaultUser.email && pass === defaultUser.pass) || pass.length>=4){
      setStoredUser({email, logged:true});
      showApp(); initApp();
    } else {
      alert('E-mail ou senha inválidos (use admin@rgflow.com / 123456 ou qualquer senha >=4 chars).');
    }
  });

  $('#toggle-pw').addEventListener('click', ()=>{
    const inp = $('#login-pass');
    inp.type = inp.type === 'password' ? 'text' : 'password';
  });
}

// ---------- Storage for app data ----------
function loadData(){
  const raw = localStorage.getItem(LS_DATA_KEY);
  if(raw) return JSON.parse(raw);
  const initial = {
    atendimentos: [],
    tarefas: [],
    documentos: []
  };
  localStorage.setItem(LS_DATA_KEY, JSON.stringify(initial));
  return initial;
}
function saveData(data){ localStorage.setItem(LS_DATA_KEY, JSON.stringify(data)); }

// ---------- SPA Navigation ----------
function setActiveNav(route){
  $$('.nav-link').forEach(a=> a.classList.remove('active'));
  const el = document.querySelector(`.nav-link[data-route="${route}"]`);
  if(el) el.classList.add('active');
}
function showView(route){
  // title
  $('#page-title').textContent = route.charAt(0).toUpperCase() + route.slice(1);
  // hide all views
  $$('.view').forEach(v=> v.classList.add('hidden'));
  const view = $(`#view-${route}`);
  if(view) view.classList.remove('hidden');
  setActiveNav(route);
}

function initNav(){
  $$('.nav-link').forEach(a=>{
    a.addEventListener('click', e=>{
      e.preventDefault();
      const r = a.dataset.route;
      showView(r);
      renderAll(); // refresh content
    });
  });
  $('#logout').addEventListener('click', ()=>{
    if(confirm('Deseja sair?')){ clearUser(); location.reload(); }
  });
  $('#btn-new').addEventListener('click', ()=> {
    showView('atendimentos');
    openModalAtt();
  });
}

// ---------- Dashboard rendering & charts ----------
let charts = {};
function renderDashboard(){
  const data = loadData();
  const atend = data.atendimentos || [];
  const tarefas = data.tarefas || [];

  $('#stat-new').textContent = atend.length;
  const pending = tarefas.filter(t=> !t.done).length;
  $('#stat-pending').textContent = pending;
  $('#stat-running').textContent = tarefas.filter(t=> t.status==='andamento').length || 0;
  $('#stat-forwarded').textContent = atend.filter(a=>a.forwarded).length || 0;
  $('#stat-overdue').textContent = tarefas.filter(t=> t.due && new Date(t.due) < new Date() && !t.done).length || 0;

  const concluded = tarefas.filter(t=> t.done).length;
  const rate = tarefas.length ? Math.round(concluded / tarefas.length * 100) : 0;
  $('#rate-text').textContent = rate + '%';
  $('#rate-bar').style.width = rate + '%';

  // charts
  const pieCtx = document.getElementById('chart-pie').getContext('2d');
  const barCtx = document.getElementById('chart-bar').getContext('2d');

  // pie: tasks distribution (concluded, pending, overdue)
  const concludedCount = concluded;
  const pendingCount = pending;
  const overdueCount = $('#stat-overdue').textContent * 1 || 0;

  if(charts.pie) charts.pie.destroy();
  charts.pie = new Chart(pieCtx, {
    type:'doughnut',
    data:{
      labels:['Concluídas','Pendentes','Atrasadas'],
      datasets:[{data:[concludedCount,pendingCount,overdueCount], backgroundColor:['#10b981','#f59e0b','#ef4444']}]
    },
    options:{plugins:{legend:{position:'bottom'}}}
  });

  // bar: simple weekly mock
  if(charts.bar) charts.bar.destroy();
  charts.bar = new Chart(barCtx, {
    type:'bar',
    data:{
      labels:['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'],
      datasets:[
        {label:'Concluídas', data:[2,6,5,9,6,3,2], backgroundColor:'#10b981'},
        {label:'Pendentes', data:[3,2,4,2,5,1,1], backgroundColor:'#f59e0b'},
        {label:'Atrasadas', data:[0,1,0,0,1,0,0], backgroundColor:'#ef4444'}
      ]
    },
    options:{scales:{y:{beginAtZero:true}}, plugins:{legend:{position:'bottom'}}}
  });
}

// ---------- Atendimentos ----------
function renderAtendimentos(){
  const data = loadData();
  const list = data.atendimentos || [];
  const container = $('#list-atendimentos');
  container.innerHTML = '';
  if(list.length===0){ container.innerHTML = '<div class="card muted">Nenhum atendimento ainda.</div>'; return; }
  list.slice().reverse().forEach(item=>{
    const div = document.createElement('div');
    div.className='list-item';
    div.innerHTML = `
      <div>
        <div style="font-weight:700">${item.client || '—'}</div>
        <div class="meta">${item.desc ? item.desc.slice(0,120) : ''}</div>
      </div>
      <div style="text-align:right">
        <div class="muted small">${new Date(item.created).toLocaleString()}</div>
        <div style="margin-top:8px">
          <button class="btn" data-id="${item.id}" data-action="view">Ver</button>
          <button class="btn" data-id="${item.id}" data-action="download">Arquivos</button>
        </div>
      </div>
    `;
    container.appendChild(div);
  });

  // attach handlers
  container.querySelectorAll('button').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const id = btn.dataset.id;
      const action = btn.dataset.action;
      const data = loadData();
      const item = data.atendimentos.find(a=>a.id===id);
      if(action==='view'){ alert(`Atendimento: ${item.client}\n\n${item.desc}`); }
      if(action==='download'){
        if(!item.files || item.files.length===0){ alert('Nenhum arquivo anexado.'); return; }
        item.files.forEach(f=>{
          // create blob and download
          const bytes = atob(f.data.split(',')[1]);
          const ia = new Uint8Array(bytes.length);
          for(let i=0;i<bytes.length;i++) ia[i]=bytes.charCodeAt(i);
          const blob = new Blob([ia], {type: f.type||'application/octet-stream'});
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a'); a.href=url; a.download = f.name; document.body.appendChild(a); a.click();
          a.remove(); URL.revokeObjectURL(url);
        });
      }
    });
  });
}

// modal logic
function openModalAtt(){ $('#modal-att').classList.remove('hidden'); }
function closeModalAtt(){ $('#modal-att').classList.add('hidden'); }

function initAtendimentos(){
  $('#btn-create-atendimento').addEventListener('click', openModalAtt);
  $('#close-att').addEventListener('click', closeModalAtt);
  $('#save-att').addEventListener('click', async ()=>{
    const client = $('#att-client').value.trim();
    const desc = $('#att-desc').value.trim();
    const filesInput = $('#att-files');
    const files = [];
    for(const f of filesInput.files){
      files.push({name:f.name,type:f.type,size:f.size,data:await toBase64(f)});
    }
    const data = loadData();
    const item = {id:genId(), client, desc, files, created:new Date().toISOString(), forwarded:false};
    data.atendimentos.push(item);
    saveData(data);
    closeModalAtt();
    $('#att-client').value=''; $('#att-desc').value=''; $('#att-files').value=null;
    renderAtendimentos(); renderDashboard();
  });
}

// helper convert file to base64
function toBase64(file){ return new Promise(res=>{
  const r = new FileReader();
  r.onload = ()=> res(r.result);
  r.readAsDataURL(file);
}); }

// ---------- Tarefas ----------
function renderTarefas(){
  const data = loadData();
  const list = data.tarefas || [];
  const container = $('#tasks-list');
  container.innerHTML = '';
  if(list.length===0) { container.innerHTML = '<div class="muted">Nenhuma tarefa.</div>'; return; }
  list.slice().reverse().forEach(t=>{
    const div = document.createElement('div');
    div.className='list-item';
    div.innerHTML = `
      <div>
        <div style="font-weight:700">${t.title}</div>
        <div class="meta">${t.due? 'Vence: '+t.due : ''}</div>
      </div>
      <div>
        <button class="btn" data-id="${t.id}" data-act="toggle">${t.done? 'Reabrir' : 'Concluir'}</button>
        <button class="btn" data-id="${t.id}" data-act="del">Excluir</button>
      </div>
    `;
    container.appendChild(div);
  });

  container.querySelectorAll('button').forEach(b=>{
    b.addEventListener('click', ()=>{
      const id = b.dataset.id; const act=b.dataset.act;
      const data = loadData();
      const i = data.tarefas.findIndex(x=>x.id===id);
      if(i<0) return;
      if(act==='toggle'){ data.tarefas[i].done = !data.tarefas[i].done; saveData(data); renderTarefas(); renderDashboard(); }
      if(act==='del'){ if(confirm('Excluir tarefa?')){ data.tarefas.splice(i,1); saveData(data); renderTarefas(); renderDashboard(); } }
    });
  });
}

function initTarefas(){
  $('#add-task').addEventListener('click', ()=>{
    const txt = $('#new-task-input').value.trim();
    if(!txt) return alert('Digite o nome da tarefa');
    const data = loadData();
    data.tarefas.push({id:genId(), title:txt, done:false, created:new Date().toISOString()});
    saveData(data); $('#new-task-input').value=''; renderTarefas(); renderDashboard();
  });
}

// ---------- Documentos ----------
function renderDocumentos(){
  const data = loadData();
  const list = data.documentos || [];
  const container = $('#docs-list');
  container.innerHTML = '';
  if(list.length===0){ container.innerHTML = '<div class="muted">Nenhum documento.</div>'; return; }
  list.slice().reverse().forEach(doc=>{
    const div = document.createElement('div'); div.className='list-item';
    div.innerHTML = `
      <div>
        <div style="font-weight:700">${doc.name}</div>
        <div class="meta">${(doc.size/1024).toFixed(2)} KB • ${doc.type}</div>
      </div>
      <div>
        <button class="btn" data-id="${doc.id}" data-act="download">Baixar</button>
        <button class="btn" data-id="${doc.id}" data-act="del">Excluir</button>
      </div>
    `;
    container.appendChild(div);
  });

  container.querySelectorAll('button').forEach(b=>{
    b.addEventListener('click', ()=>{
      const id = b.dataset.id; const act=b.dataset.act;
      const data = loadData();
      const idx = data.documentos.findIndex(d=>d.id===id);
      if(idx<0) return;
      if(act==='download'){
        const d = data.documentos[idx];
        const bytes = atob(d.data.split(',')[1]); const ia = new Uint8Array(bytes.length);
        for(let i=0;i<bytes.length;i++) ia[i]=bytes.charCodeAt(i);
        const blob = new Blob([ia], {type:d.type});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href=url; a.download=d.name; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
      }
      if(act==='del'){ if(confirm('Excluir documento?')){ data.documentos.splice(idx,1); saveData(data); renderDocumentos(); renderDashboard(); } }
    });
  });
}

function initDocuments(){
  $('#upload-docs').addEventListener('click', async ()=>{
    const inp = $('#doc-files');
    if(!inp.files.length) return alert('Selecione ao menos um arquivo.');
    const data = loadData();
    for(const f of inp.files){
      data.documentos.push({id:genId(), name:f.name, type:f.type, size:f.size, data: await toBase64(f), uploaded:new Date().toISOString()});
    }
    saveData(data); inp.value=null; renderDocumentos(); renderDashboard();
  });
}

// ---------- Reports ----------
function renderReports(){
  // simple line & donut using Chart.js with mock data from storage
  const data = loadData();
  const atend = data.atendimentos.length || 0;
  const tarefas = data.tarefas.length || 0;
  const docs = data.documentos.length || 0;

  const ctxLine = document.getElementById('chart-line').getContext('2d');
  if(charts.line) charts.line.destroy();
  charts.line = new Chart(ctxLine, {
    type:'line',
    data:{
      labels:['Jan','Fev','Mar','Abr','Mai','Jun'],
      datasets:[{label:'Atendimentos', data:[3,5,6,4,7,atend], borderColor:'#2b6fd6', fill:false}]
    },
    options:{plugins:{legend:{display:false}}}
  });

  const ctxDonut = document.getElementById('chart-donut').getContext('2d');
  if(charts.donut) charts.donut.destroy();
  charts.donut = new Chart(ctxDonut, {
    type:'doughnut',
    data:{labels:['Tarefas','Documentos','Atendimentos'], datasets:[{data:[tarefas,docs,atend], backgroundColor:['#10b981','#f59e0b','#2b6fd6']}]},
    options:{plugins:{legend:{position:'bottom'}}}
  });
}

// ---------- Utilities ----------
function genId(){ return Math.random().toString(36).slice(2,9); }

// main render
function renderAll(){
  renderDashboard(); renderAtendimentos(); renderTarefas(); renderDocumentos(); renderReports();
}

// init app after login
function initApp(){
  initNav();
  initAtendimentos();
  initTarefas();
  initDocuments();
  initTarefas();
  renderAll();

  // route default
  showView('dashboard');

  // simple interactions
  $('#request-access').addEventListener('click', (e)=>{ e.preventDefault(); alert('Solicitação enviada — entraremos em contato.'); });
  $('#search-atendimento').addEventListener('input', (e)=>{
    const q = e.target.value.toLowerCase();
    const data = loadData();
    const filtered = data.atendimentos.filter(a => (a.client||'').toLowerCase().includes(q) || (a.desc||'').toLowerCase().includes(q));
    // quick render
    const container = $('#list-atendimentos'); container.innerHTML='';
    filtered.slice().reverse().forEach(item=>{
      const div = document.createElement('div'); div.className='list-item';
      div.innerHTML = `<div><div style="font-weight:700">${item.client}</div><div class="meta">${item.desc}</div></div>
      <div>${new Date(item.created).toLocaleString()}</div>`;
      container.appendChild(div);
    });
  });

  document.getElementById('export-csv').addEventListener('click', ()=>{
    const data = loadData();
    // export atendimentos
    let csv = 'id,client,desc,created\\n';
    data.atendimentos.forEach(a=> csv += `${a.id},"${(a.client||'').replace(/"/g,'""')}","${(a.desc||'').replace(/"/g,'""')}",${a.created}\\n`);
    const blob = new Blob([csv], {type:'text/csv'}); const url=URL.createObjectURL(blob);
    const a=document.createElement('a'); a.href=url; a.download='atendimentos.csv'; document.body.appendChild(a); a.click(); a.remove();
  });

  // close modal when clicking outside
  document.getElementById('modal-att').addEventListener('click', (e)=>{
    if(e.target.id === 'modal-att') closeModalAtt();
  });
}

// ---------- Init ----------
initAuth();
