
/* app.js - handle forms and jsPDF receipts */
function handleSubmit(evt, serviceName){
    evt.preventDefault();
    const form = evt.target;
    const formData = new FormData(form);
    const data = {};
    for(const [k,v] of formData.entries()){
        data[k]=v;
    }
    // simulated API placeholder - if form.dataset.api provided, you can call it here
    // Auto-generate receipt PDF and download
    generateReceiptPDF(serviceName, data);
    // show bootstrap modal success if present
    const successModal = document.getElementById('successModal');
    if(successModal){
        const title = successModal.querySelector('.modal-title');
        const body = successModal.querySelector('.modal-body');
        title.textContent = serviceName + ' — Success';
        body.innerHTML = '<p class="small-muted">Your transaction was successful. Receipt downloading...</p>';
        var modal = new bootstrap.Modal(successModal);
        modal.show();
        setTimeout(()=> modal.hide(), 2200);
    } else {
        alert('Success — receipt downloaded.');
    }
    return false;
}

function generateReceiptPDF(serviceName, data){
    try{
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        // header
        doc.setFillColor(11,105,255);
        doc.rect(0,0,210,25,'F');
        doc.setTextColor(255,255,255);
        doc.setFontSize(14);
        doc.text('SmartPay Receipt', 14, 17);
        doc.setTextColor(0,0,0);
        doc.setFontSize(11);
        let y = 36;
        doc.text('Service: ' + serviceName, 14, y); y += 8;
        for(const k in data){
            const line = k + ': ' + data[k];
            doc.text(line, 14, y); y += 8;
            if(y > 280){ doc.addPage(); y = 20; }
        }
        doc.text('Date: ' + new Date().toLocaleString(), 14, y+8);
        doc.text('Transaction ID: TXN' + Math.floor(Math.random()*1000000), 14, y+16);
        const fname = (serviceName.replace(/\s+/g,'_') + '_receipt.pdf');
        doc.save(fname);
    }catch(e){
        console.error('PDF error', e);
        alert('Receipt generation failed');
    }
}
