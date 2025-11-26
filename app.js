// Autenticação fixa
const USER = "admin@rgflow.com";
const PASS = "123456";

const loginPage = document.getElementById("loginPage");
const pages = document.querySelectorAll(".page");
const menuBtns = document.querySelectorAll(".menu-btn");

function showPage(id) {
  pages.forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// Login
document.getElementById("loginBtn").onclick = () => {
  const email = loginEmail.value.trim();
  const senha = loginSenha.value.trim();

  if (email === USER && senha === PASS) {
    loginPage.classList.remove("active");
    showPage("dashboard");
    loadData();
  } else {
    alert("Credenciais inválidas");
  }
};

// Navegação
menuBtns.forEach(btn => {
  btn.addEventListener("click", () => showPage(btn.dataset.page));
});

// Logout
document.getElementById("logoutBtn").onclick = () => {
  location.reload();
};

// -----------------
// LocalStorage Fake DB
// -----------------

function getData(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function renderList(key, ulElement) {
  const data = getData(key);
  ulElement.innerHTML = "";

  data.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item}
      <button class="btn" style="padding: 6px;" data-index="${index}">Excluir</button>
    `;
    ulElement.appendChild(li);

    li.querySelector("button").onclick = () => {
      data.splice(index, 1);
      saveData(key, data);
      renderList(key, ulElement);
      loadData();
    };
  });
}

// -----------------
// Renderizações
// -----------------

function loadData() {
  const clientes = getData("clientes");
  const processos = getData("processos");
  const docs = getData("documentos");

  document.getElementById("countClientes").innerText = clientes.length;
  document.getElementById("countProcessos").innerText = processos.length;
  document.getElementById("countDocumentos").innerText = docs.length;

  renderList("clientes", document.getElementById("listaClientes"));
  renderList("processos", document.getElementById("listaProcessos"));
  renderList("documentos", document.getElementById("listaDocumentos"));

  renderGrafico(processos.length, docs.length);
}

// -----------------
// Dashboard — Gráfico
// -----------------

let grafico;
function renderGrafico(proc, docs) {
  const ctx = document.getElementById("graficoProcessos");

  if (grafico) grafico.destroy();

  grafico = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Processos", "Documentos"],
      datasets: [
        {
          label: "Quantidade",
          data: [proc, docs],
        },
      ],
    },
    options: {
      responsive: true,
    },
  });
}

// -----------------
// Botões de adicionar
// -----------------

document.getElementById("addClienteBtn").onclick = () => {
  const val = novoCliente.value.trim();
  if (!val) return;

  const data = getData("clientes");
  data.push(val);
  saveData("clientes", data);
  loadData();
  novoCliente.value = "";
};

document.getElementById("addProcessoBtn").onclick = () => {
  const val = novoProcesso.value.trim();
  if (!val) return;

  const data = getData("processos");
  data.push(val);
  saveData("processos", data);
  loadData();
  novoProcesso.value = "";
};

document.getElementById("addDocumentoBtn").onclick = () => {
  const val = novoDocumento.value.trim();
  if (!val) return;

  const data = getData("documentos");
  data.push(val);
  saveData("documentos", data);
  loadData();
  novoDocumento.value = "";
};
