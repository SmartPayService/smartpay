
/* app.js - handles form submit, modal and receipt creation */
function submitForm(e, title){
    e.preventDefault();
    const form = e.target;
    const data = {};
    for(const el of form.elements){
        if(!el.name) continue;
        data[el.name] = el.value;
    }
    console.log('Submitted', title, data);
    const modal = document.getElementById('successModal');
    modal.querySelector('h2').textContent = title + ' — Success';
    const details = modal.querySelector('.details');
    details.innerHTML = '';
    for(const k in data){
        const div = document.createElement('div');
        div.textContent = k + ': ' + data[k];
        details.appendChild(div);
    }
    window._lastReceipt = {service: title, data: data};
    modal.classList.add('show');
    return false;
}
function closeModal(){ document.getElementById('successModal').classList.remove('show'); }
function downloadReceipt(){
    const obj = window._lastReceipt || {};
    const service = obj.service || 'Service';
    const data = obj.data || {};
    const doc = new window.jspdf.jsPDF();
    // header
    doc.setFillColor(11,105,255);
    doc.rect(0,0,210,26,'F');
    doc.setTextColor(255,255,255);
    doc.setFontSize(14);
    doc.text('SmartPay Receipt', 14, 18);
    doc.setTextColor(0,0,0);
    doc.setFontSize(11);
    let y = 36;
    doc.text('Service: ' + service, 14, y); y+=8;
    for(const k in data){
        const line = k + ': ' + data[k];
        doc.text(line, 14, y); y += 8;
        if(y > 280){ doc.addPage(); y = 20; }
    }
    doc.text('Date: ' + new Date().toLocaleString(), 14, y+6);
    doc.text('Transaction ID: TXN' + Math.floor(Math.random()*1000000), 14, y+14);
    doc.save(service.replace(/\s+/g, '_') + '_receipt.pdf');
    closeModal();
}
