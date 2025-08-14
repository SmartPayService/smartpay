
// Auth helpers
const SP_AUTH_KEY="sp_logged_in";const SP_USER_KEY="sp_user";
function requireLogin(){if(!localStorage.getItem(SP_AUTH_KEY)){window.location.href="login.html?next="+encodeURIComponent(location.pathname.split('/').pop());}}
function doLogout(){localStorage.removeItem(SP_AUTH_KEY);localStorage.removeItem(SP_USER_KEY);location.href="login.html";}
function setAuthed(name,email){localStorage.setItem(SP_AUTH_KEY,"1");localStorage.setItem(SP_USER_KEY,JSON.stringify({name,email}));}
function authedUser(){try{return JSON.parse(localStorage.getItem(SP_USER_KEY)||"null");}catch(e){return null;}}
function makeTxnId(){return 'SP'+Math.random().toString(36).slice(2,8).toUpperCase()+Date.now().toString().slice(-6);}
// Receipt
async function generateReceiptPDF(data){
  const container=document.createElement('div');container.style.padding='16px';container.style.fontFamily='Inter, Arial, sans-serif';
  container.innerHTML=`
  <div style="border:1px solid #cdd6e1;border-radius:12px;padding:20px;">
   <div style="display:flex;justify-content:space-between;align-items:center;">
    <div><h2 style="margin:0;color:#0d6efd;">SmartPay Receipt</h2>
      <div style="font-size:12px;color:#6b7280;">Txn ID: ${data.txnId}</div></div>
    <div style="text-align:right;font-size:12px;color:#6b7280;">
      <div>${new Date().toLocaleString()}</div>
      <div>Partner: ${authedUser()?.name || "Guest"}</div>
    </div>
   </div><hr>
   <table style="width:100%;font-size:14px;border-collapse:collapse">
    ${Object.entries(data.lines).map(([k,v])=>`<tr><td style="padding:6px 4px;color:#374151;width:40%">${k}</td><td style="padding:6px 4px;color:#111827;font-weight:600;">${v}</td></tr>`).join('')}
   </table><hr>
   <div style="display:flex;justify-content:space-between;font-weight:700;"><span>Total</span><span>₹${data.total}</span></div>
   <div style="margin-top:12px;font-size:12px;color:#6b7280;">This is a system generated receipt for testing.</div>
  </div>`;
  const opt={margin:6,filename:data.file||'SmartPay_Receipt.pdf',html2canvas:{scale:2},jsPDF:{unit:'mm',format:'a4',orientation:'portrait'}};
  return html2pdf().from(container).set(opt).save();
}
