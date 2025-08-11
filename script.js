
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
    const ul = modal.querySelector('.details');
    ul.innerHTML = '';
    for(const k in data){
        const li = document.createElement('li');
        li.textContent = k + ': ' + data[k];
        ul.appendChild(li);
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
    doc.setFontSize(18);
    doc.setTextColor(11,105,255);
    doc.text('SmartPay Receipt', 20, 20);
    doc.setFontSize(12);
    doc.setTextColor(0,0,0);
    doc.text('Service: ' + service, 20, 36);
    let y = 48;
    for(const k in data){
        const line = k + ': ' + data[k];
        doc.text(line, 20, y);
        y += 8;
        if(y > 270){ doc.addPage(); y = 20; }
    }
    doc.text('Date: ' + new Date().toLocaleString(), 20, y+6);
    doc.text('Transaction ID: TXN' + Math.floor(Math.random()*1000000), 20, y+14);
    doc.save(service.replace(/\s+/g, '_') + '_receipt.pdf');
    closeModal();
}
