
function register() {
    const email = document.getElementById("regEmail").value;
    const pass = document.getElementById("regPassword").value;
    if (!email || !pass) { alert("Please fill all fields"); return; }
    localStorage.setItem("spUser", JSON.stringify({email: email.toLowerCase(), pass}));
    localStorage.setItem("spLoggedIn", "true");
    window.location.href = "dashboard.html";
}

function login() {
    const email = document.getElementById("loginEmail").value;
    const pass = document.getElementById("loginPassword").value;
    const user = JSON.parse(localStorage.getItem("spUser"));
    if (!user || email.toLowerCase() !== user.email || pass !== user.pass) {
        alert("Invalid credentials");
        return;
    }
    localStorage.setItem("spLoggedIn", "true");
    window.location.href = "dashboard.html";
}

function requireAuth() {
    if (localStorage.getItem("spLoggedIn") !== "true") {
        window.location.href = "login.html";
    }
}

function logout() {
    localStorage.removeItem("spLoggedIn");
    window.location.href = "index.html";
}
