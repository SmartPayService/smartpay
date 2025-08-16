
// Small enhancement: demo balance ticker on homepage
(function(){
  const el = document.getElementById('demoBalance');
  if(!el) return;
  let val = 4250;
  setInterval(()=>{ val = val + Math.random()*10 - 5; el.textContent = val.toFixed(2); }, 1800);
})();
