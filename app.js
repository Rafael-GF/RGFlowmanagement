// LOGIN
const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", () => {
  const email = document.getElementById("loginEmail").value;
  const pwd = document.getElementById("loginPassword").value;

  if (email.trim() === "" || pwd.trim() === "") {
    alert("Preencha e-mail e senha");
    return;
  }

  document.getElementById("loginPage").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");
});

// PAGE SWITCHING
const navButtons = document.querySelectorAll(".nav-btn");
const pages = document.querySelectorAll(".page");

navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    
    // remove highlight
    navButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    // hide all pages
    pages.forEach(p => p.classList.add("hidden"));
    
    // show selected page
    const target = document.getElementById(btn.dataset.page);
    target.classList.remove("hidden");
  });
});
