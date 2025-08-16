
// Populate navbar buttons based on login state
(function(){
  const area = document.getElementById('authArea');
  if(!area) return;
  const raw = localStorage.getItem('sp_user');
  if(!raw){
    area.innerHTML = `
      <a href="register.html" class="btn btn-light rounded-4"><i class="bi bi-person-plus me-2"></i>Register</a>
      <a href="login.html" class="btn btn-outline-light rounded-4"><i class="bi bi-box-arrow-in-right me-2"></i>Login</a>
    `;
  } else {
    const user = JSON.parse(raw);
    area.innerHTML = `
      <a href="dashboard.html" class="btn btn-light rounded-4"><i class="bi bi-wallet2 me-2"></i>Wallet</a>
      <a href="dashboard.html" class="btn btn-outline-light rounded-4"><i class="bi bi-grid me-2"></i>Services</a>
      <button id="logoutBtn" class="btn btn-outline-light rounded-4"><i class="bi bi-box-arrow-right me-2"></i>Logout</button>
    `;
    document.getElementById('logoutBtn').addEventListener('click', function(){
      localStorage.removeItem('sp_user');
      window.location.href = 'index.html';
    });
  }
})();
