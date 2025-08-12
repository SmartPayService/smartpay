
function submitForm(e, service){
  e.preventDefault();
  const form = e.target;
  const data = {};
  for(const el of form.elements){
    if(!el.name) continue;
    data[el.name]=el.value;
  }
  window._lastReceipt = {service:service,data:data};
  if(window.jspdf && window.jspdf.jsPDF){
    const doc = new window.jspdf.jsPDF();
    doc.setFillColor(11,105,255);
    doc.rect(0,0,210,25,'F');
    doc.setTextColor(255,255,255);
    doc.setFontSize(14);
    doc.text('SmartPay Receipt',14,17);
    doc.setTextColor(0,0,0);
    doc.setFontSize(11);
    let y=36;
    doc.text('Service: '+service,14,y); y+=8;
    for(const k in data){ doc.text(k+': '+(data[k]||''),14,y); y+=8; if(y>280){doc.addPage(); y=20;} }
    doc.text('Date: '+new Date().toLocaleString(),14,y+8);
    doc.text('Transaction ID: TXN'+Math.floor(Math.random()*1000000),14,y+16);
    doc.save(service.replace(/\s+/g,'_')+'_receipt.pdf');
  } else {
    alert('Receipt generation not available in this environment.');
  }
  return false;
}
