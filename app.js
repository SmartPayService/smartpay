let balance = 0;

function login(){
  const u = document.getElementById('username').value;
  const p = document.getElementById('password').value;
  if((u === 'agent' && p === '1234') || (u === 'admin' && p === '1234')){
    window.location.href = u === 'admin' ? 'admin.html' : 'dashboard.html';
  } else {
    alert('Invalid credentials');
  }
}

function addMoney(){
  balance += 100;
  document.getElementById('balance').innerText = balance;
  localStorage.setItem('wallet', balance);
}

function makeRecharge(){
  if(balance >= 50){
    balance -= 50;
    document.getElementById('balance').innerText = balance;
    localStorage.setItem('wallet', balance);
    alert('Recharge successful! PDF receipt generated.');
    // placeholder for jsPDF receipt generation
  } else {
    alert('Insufficient Balance');
  }
}

window.onload = () => {
  if(document.getElementById('balance')){
    const saved = localStorage.getItem('wallet');
    if(saved){ balance = parseInt(saved); document.getElementById('balance').innerText = balance; }
  }
};