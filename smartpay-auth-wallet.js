/* SmartPay: Simple Auth Gate + Wallet (dummy) - v1.0
   Drop-in script to:
   1) Hide wallet & protected sections unless logged in
   2) Provide a dummy wallet with add-balance and history
   Storage: localStorage (keys: sp_user, sp_wallet)
*/

(function () {
  const $ = (sel, ctx=document) => ctx.querySelector(sel);
  const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

  const Auth = {
    current() {
      try { return JSON.parse(localStorage.getItem('sp_user')) || null; } catch(e){ return null; }
    },
    login({mobile, name}) {
      const user = { id: 'u_'+Date.now(), mobile, name: name || 'Partner', createdAt: Date.now() };
      localStorage.setItem('sp_user', JSON.stringify(user));
      if (!localStorage.getItem('sp_wallet')) {
        localStorage.setItem('sp_wallet', JSON.stringify({ balance: 0, history: [] }));
      }
      return user;
    },
    logout() {
      localStorage.removeItem('sp_user');
      // keep wallet or clear? By default we keep user-specific; clear for demo:
      localStorage.removeItem('sp_wallet');
    },
    require(onFailRedirect) {
      if (!this.current()) {
        if (onFailRedirect) window.location.href = onFailRedirect;
        return false;
      }
      return true;
    }
  };

  const Wallet = {
    get() {
      try { return JSON.parse(localStorage.getItem('sp_wallet')) || {balance:0,history:[]}; } catch(e){ return {balance:0,history:[]}; }
    },
    save(w) { localStorage.setItem('sp_wallet', JSON.stringify(w)); },
    add(amount, note) {
      amount = Number(amount);
      if (!Number.isFinite(amount) || amount <= 0) throw new Error('Invalid amount');
      const w = this.get();
      w.balance = Math.round((w.balance + amount) * 100) / 100;
      w.history.unshift({ id: 'tx_'+Date.now(), type:'CREDIT', amount, note: note || 'Added to wallet', at: new Date().toISOString() });
      this.save(w);
      return w;
    }
  };

  function formatINR(n){
    try{
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(n);
    }catch(e){ return '₹ '+(Number(n).toFixed(2)); }
  }

  function render() {
    const user = Auth.current();
    // Toggle protected blocks
    $$('.sp-protected').forEach(el => {
      el.style.display = user ? '' : 'none';
    });
    $$('.sp-public').forEach(el => {
      el.style.display = user ? 'none' : '';
    });

    // Render name
    const nameEl = $('[data-sp="user-name"]');
    if (nameEl) nameEl.textContent = user ? (user.name || 'Partner') : '';

    // Render wallet balance
    const balEl = $('[data-sp="wallet-balance"]');
    if (balEl) {
      const bal = Wallet.get().balance;
      balEl.textContent = formatINR(bal);
    }

    // Render history
    const histBody = $('[data-sp="wallet-history"]');
    if (histBody) {
      const {history} = Wallet.get();
      histBody.innerHTML = history.length ?
        history.map(h => `<tr><td>${h.type}</td><td>${formatINR(h.amount)}</td><td>${h.note||''}</td><td>${new Date(h.at).toLocaleString()}</td></tr>`).join('')
        : '<tr><td colspan="4" style="text-align:center; opacity:.7;">No transactions yet</td></tr>';
    }
  }

  // Hook up buttons/forms if present
  function bind() {
    // Demo login form
    const loginForm = $('#sp-login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e)=>{
        e.preventDefault();
        const mobile = loginForm.mobile.value.trim();
        const name = loginForm.name.value.trim();
        if (!/^[6-9]\d{9}$/.test(mobile)) { alert('Enter a valid 10-digit Indian mobile number'); return; }
        Auth.login({mobile, name});
        render();
        const redir = loginForm.getAttribute('data-success-redirect');
        if (redir) window.location.href = redir;
      });
    }

    // Logout
    const logoutBtns = $$('.sp-logout');
    logoutBtns.forEach(btn => btn.addEventListener('click', ()=>{
      Auth.logout();
      render();
    }));

    // Add balance form (modal or inline)
    const addForm = $('#sp-add-balance-form');
    if (addForm) {
      addForm.addEventListener('submit', (e)=>{
        e.preventDefault();
        try{
          const amt = addForm.amount.value;
          const note = addForm.note.value.trim();
          Wallet.add(amt, note);
          addForm.reset();
          render();
          alert('Amount added to wallet successfully');
        }catch(err){
          alert(err.message || 'Failed to add amount');
        }
      });
    }
  }

  // Route guard helper: add `data-sp-guard="/login.html"` to <body> on protected pages
  function guard() {
    const redir = document.body && document.body.getAttribute('data-sp-guard');
    if (redir) Auth.require(redir);
  }

  document.addEventListener('DOMContentLoaded', function(){
    guard();
    bind();
    render();
  });

  // Expose for debugging
  window.SmartPay = { Auth, Wallet, formatINR };
})();
