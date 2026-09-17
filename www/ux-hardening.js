(function(){
  'use strict';
  const native=!!(window.Capacitor&&window.Capacitor.isNativePlatform&&window.Capacitor.isNativePlatform());
  const android=native&&window.Capacitor.getPlatform&&window.Capacitor.getPlatform()==='android';
  const UX=window.NutriSportUX=window.NutriSportUX||{};
  let toastTimer=0;
  UX.toast=function(message){
    let el=document.getElementById('ns-ux-toast');
    if(!el){el=document.createElement('div');el.id='ns-ux-toast';el.setAttribute('role','status');el.setAttribute('aria-live','polite');document.body.appendChild(el);}
    el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2200);
  };
  function authReady(){return !!window.firebaseAuth && !!window.firebaseAuth.currentUser;}
  function setState(){
    const ready=!!window.firebaseAuth;
    const user=ready?window.firebaseAuth.currentUser:null;
    document.documentElement.dataset.nsAuthReady=ready?'1':'0';
    document.documentElement.dataset.nsSignedIn=user?'1':'0';
    document.documentElement.dataset.nsAndroid=android?'1':'0';
  }
  function enhanceGuest(){
    const btn=[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='Continuar como invitado');
    if(!btn||document.getElementById('ns-guest-note'))return;
    const note=document.createElement('div');note.id='ns-guest-note';note.textContent='Invitado: tu progreso queda guardado en este dispositivo.';btn.insertAdjacentElement('afterend',note);
  }
  function touchTargets(){
    document.querySelectorAll('button').forEach(b=>{if(!b.dataset.nsTouch){b.dataset.nsTouch='1';b.addEventListener('pointerup',()=>{b.classList.add('ns-tap');setTimeout(()=>b.classList.remove('ns-tap'),140)},{passive:true});}});
  }
  function cleanStatus(){
    const el=document.getElementById('ns-net-status');if(el)el.setAttribute('role','status');
  }
  function run(){setState();enhanceGuest();touchTargets();cleanStatus();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
  try{window.firebaseAuth?.onAuthStateChanged(()=>{setState();});}catch(e){}
  document.addEventListener('visibilitychange',()=>{if(!document.hidden){setState();touchTargets();}});
  new MutationObserver(()=>{enhanceGuest();touchTargets();cleanStatus();}).observe(document.body,{childList:true,subtree:true});
  setInterval(setState,1500);
})();
