
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
    modal.querySelector('p').textContent = 'Transaction simulated successfully.';
    modal.classList.add('show');
    setTimeout(()=>{ modal.classList.remove('show'); form.reset(); }, 1800);
    return false;
}
function closeModal(){ document.getElementById('successModal').classList.remove('show'); }
