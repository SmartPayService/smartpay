
// banks_search.js - simple searchable filter for <select name="bank">
document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('select[name="bank"]').forEach(function(sel){
        // create search input
        var wrapper = document.createElement('div');
        wrapper.className = 'bank-search-wrapper';
        var input = document.createElement('input');
        input.type = 'search';
        input.placeholder = 'Search bank...';
        input.className = 'bank-search-input';
        sel.parentNode.insertBefore(wrapper, sel);
        wrapper.appendChild(input);
        wrapper.appendChild(sel);
        input.addEventListener('input', function(){
            var q = this.value.toLowerCase().trim();
            var options = sel.options;
            for(var i=0;i<options.length;i++){
                var opt = options[i];
                var txt = (opt.text||'').toLowerCase();
                // keep placeholder option visible when empty
                if(opt.value === '') { opt.style.display = ''; continue; }
                if(q === '' || txt.indexOf(q) !== -1){
                    opt.style.display = '';
                } else {
                    opt.style.display = 'none';
                }
            }
        });
    });
});
