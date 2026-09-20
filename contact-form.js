(function(){
  'use strict';
  function initForm(form){
    if(!form || form.dataset.ntnReady==='1') return;
    form.dataset.ntnReady='1';
    form.addEventListener('submit', async function(e){
      e.preventDefault();
      var button=form.querySelector('button[type="submit"]');
      var status=form.querySelector('.ntn-form-status');
      var oldText=button ? button.textContent : '';
      if(status){ status.textContent=''; status.className='ntn-form-status'; }
      if(button){ button.disabled=true; button.textContent='Odesílám…'; }
      try{
        var response=await fetch('/api/contact.php', {method:'POST', body:new FormData(form), credentials:'same-origin', headers:{'Accept':'application/json'}});
        var data=await response.json().catch(function(){ return {}; });
        if(!response.ok || !data.ok) throw new Error(data.message || 'Zprávu se nepodařilo odeslat.');
        form.reset();
        if(status){ status.textContent=data.message || 'Zpráva byla odeslána. Děkujeme.'; status.className='ntn-form-status success'; }
      }catch(err){
        if(status){ status.textContent=err && err.message ? err.message : 'Zprávu se nepodařilo odeslat.'; status.className='ntn-form-status error'; }
      }finally{
        if(button){ button.disabled=false; button.textContent=oldText; }
      }
    });
  }
  function init(){ document.querySelectorAll('.ntn-inline-contact-form').forEach(initForm); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
