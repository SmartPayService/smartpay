
function handleDemoSubmit(evt, formName){
    evt.preventDefault();
    const form = evt.target;
    const data = {};
    for(let el of form.elements){
        if(!el.name) continue;
        if(el.type === 'checkbox' || el.type === 'radio') { if(el.checked) data[el.name]=el.value; }
        else data[el.name] = el.value;
    }
    console.log('Demo submit - ' + formName, data);
    alert('Demo submit for ' + formName + '\nCheck console for submitted values.');
    form.reset();
    return false;
}
