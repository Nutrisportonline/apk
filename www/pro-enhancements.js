(function(){
  'use strict';
  const UID_PRO='6oRhKb66WdNrc0ZJnD4dpjo3E4i2';
  const EMAIL_PRO='luisangelesquerra@gmail.com';
  const FOODS=[
    ['Avena','Desayuno',389,16.9,66,6.9],['Huevo','Proteínas',143,12.6,1.1,9.5],['Claras de huevo','Proteínas',52,10.9,0.7,0.2],['Pechuga de pollo','Proteínas',165,31,0,3.6],['Pavo','Proteínas',135,29,0,1.6],['Atún en agua','Proteínas',116,26,0,0.8],['Salmón','Proteínas',208,20,0,13],['Carne de res magra','Proteínas',170,26,0,7],['Yogur griego natural','Lácteos',59,10.3,3.6,0.4],['Leche baja en grasa','Lácteos',47,3.4,4.8,1.5],['Frijoles cocidos','Legumbres',127,8.7,22.8,0.5],['Lentejas cocidas','Legumbres',116,9,20,0.4],['Arroz cocido','Carbohidratos',130,2.7,28.2,0.3],['Tortilla de maíz','Carbohidratos',218,5.7,44.6,2.9],['Papa cocida','Carbohidratos',87,1.9,20.1,0.1],['Camote','Carbohidratos',86,1.6,20.1,0.1],['Quinoa cocida','Carbohidratos',120,4.4,21.3,1.9],['Pan integral','Carbohidratos',247,13,41,4.2],['Plátano','Frutas',89,1.1,22.8,0.3],['Manzana','Frutas',52,0.3,13.8,0.2],['Naranja','Frutas',47,0.9,11.8,0.1],['Fresas','Frutas',32,0.7,7.7,0.3],['Aguacate','Grasas',160,2,8.5,14.7],['Almendras','Grasas',579,21.2,21.6,49.9],['Aceite de oliva','Grasas',884,0,0,100],['Brócoli','Verduras',34,2.8,7,0.4],['Espinaca','Verduras',23,2.9,3.6,0.4],['Jitomate','Verduras',18,0.9,3.9,0.2],['Nopales','Verduras',16,1.4,3.3,0.1],['Pepino','Verduras',15,0.7,3.6,0.1]
  ];
  const ROUTINES={
    perder:{title:'Quema + fuerza',days:['Lunes • Fuerza cuerpo completo','Martes • Cardio moderado','Miércoles • Fuerza cuerpo completo','Jueves • Recuperación activa','Viernes • Fuerza + core','Sábado • Cardio opcional','Domingo • Descanso'],ex:['Sentadilla 3×10-12','Press o flexiones 3×8-12','Remo 3×10-12','Peso muerto rumano 3×8-10','Plancha 3×30-45 s']},
    ganar:{title:'Hipertrofia progresiva',days:['Lunes • Tren superior','Martes • Tren inferior','Miércoles • Recuperación','Jueves • Tren superior','Viernes • Tren inferior','Sábado • Cardio suave/movilidad','Domingo • Descanso'],ex:['Press de pecho 3×8-12','Remo 3×8-12','Press hombro 3×8-12','Sentadilla 3×8-12','Peso muerto rumano 3×8-12','Elevaciones de pantorrilla 3×12-15']},
    definicion:{title:'Definición + fuerza',days:['Lunes • Fuerza + core','Martes • Cardio moderado','Miércoles • Fuerza','Jueves • Movilidad','Viernes • Fuerza + intervalos','Sábado • Caminata','Domingo • Descanso'],ex:['Sentadilla 3×8-12','Flexiones 3×8-15','Remo 3×10-12','Zancadas 3×10/lado','Plancha lateral 3×30 s/lado']},
    mantener:{title:'Salud y rendimiento',days:['Lunes • Fuerza','Martes • Cardio','Miércoles • Movilidad','Jueves • Fuerza','Viernes • Cardio','Sábado • Actividad recreativa','Domingo • Descanso'],ex:['Sentadilla 3×10','Flexiones 3×8-12','Remo 3×10','Puente de glúteo 3×12','Plancha 3×30-45 s']}
  };
  function profile(){
    try{
      const u=window.firebaseAuth&&window.firebaseAuth.currentUser;
      if(!u) return null;
      const raw=localStorage.getItem('nutritrack_v2_'+u.uid);
      const d=raw?JSON.parse(raw):{}; return {...(d.profile||{}),uid:u.uid,email:(u.email||d.profile?.email||'').toLowerCase()};
    }catch(e){return null;}
  }
  function isPro(p){return !!p&&(p.uid===UID_PRO||p.email===EMAIL_PRO||p.isPremium===true||p.plan==='pro');}
  function calc(p){
    const b=10*p.weight+6.25*p.height-5*p.age+(p.gender==='M'?5:-161);
    const t=b*(Number(p.activity)||1.55);
    const mult={perder:.8,mantener:1,ganar:1.15,definicion:.9,personalizado:Number(p.customFactor)||1}[p.goal]||1;
    const target=Math.round(t*mult);
    const protein=Math.round(Math.max(1.2*p.weight, Math.min(1.8*p.weight, p.goal==='ganar'?1.6*p.weight:1.4*p.weight)));
    const fat=Math.round((target*.27)/9);
    const carbs=Math.max(80,Math.round((target-protein*4-fat*9)/4));
    const water=Math.round(p.weight*30);
    return {b,t,target,protein,fat,carbs,water};
  }
  function esc(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  function meal(p,c){
    const goal=p.goal||'mantener';
    const scale=Math.max(.7,Math.min(1.5,c.target/2200));
    const portions={
      perder:[['Avena',40],['Yogur griego natural',170],['Fresas',150],['Pechuga de pollo',150],['Arroz cocido',120],['Brócoli',150],['Huevo',2],['Tortilla de maíz',2],['Aguacate',50]],
      ganar:[['Avena',70],['Leche baja en grasa',250],['Plátano',120],['Pechuga de pollo',180],['Arroz cocido',180],['Brócoli',150],['Huevo',3],['Tortilla de maíz',3],['Aguacate',70]],
      definicion:[['Claras de huevo',180],['Avena',35],['Fresas',150],['Pechuga de pollo',170],['Papa cocida',180],['Ensalada de brócoli',150],['Atún en agua',120],['Tortilla de maíz',2],['Aguacate',40]],
      mantener:[['Avena',50],['Yogur griego natural',170],['Plátano',100],['Pechuga de pollo',160],['Arroz cocido',150],['Brócoli',150],['Huevo',2],['Tortilla de maíz',2],['Aguacate',60]]
    }[goal]||[];
    return portions.map(x=>[x[0],Math.round(x[1]*scale)]);
  }
  function foodRows(items){
    return items.map(([name,g])=>{const f=FOODS.find(x=>x[0]===name)||FOODS.find(x=>name.startsWith(x[0])); if(!f)return `<li>${esc(name)} — ${g} g</li>`; return `<li><b>${esc(name)}</b> · ${g} g <span>${Math.round(f[2]*g/100)} kcal</span></li>`}).join('');
  }
  function shopping(items){
    const base={}; for(const [n,g] of items){base[n]=(base[n]||0)+g*7;} return Object.entries(base).map(([n,g])=>`<span>${esc(n)} <b>${Math.round(g/10)*10} g</b></span>`).join('');
  }
  function build(p){
    const c=calc(p), r=ROUTINES[p.goal]||ROUTINES.mantener, meals=meal(p,c);
    const goalText={perder:'reducir peso gradualmente',ganar:'favorecer ganancia de masa muscular',definicion:'reducir grasa manteniendo fuerza',mantener:'mantener peso y rendimiento',personalizado:'seguir tu objetivo personalizado'}[p.goal]||'mejorar hábitos';
    const days=r.days.map((x,i)=>`<div class="nsp-day"><b>${esc(x.split(' • ')[0])}</b><span>${esc(x.split(' • ')[1])}</span>${i<5?`<small>${esc(r.ex[i%r.ex.length])}</small>`:''}</div>`).join('');
    return `<section id="ns-pro-studio" class="ns-studio">
      <div class="ns-pro-hero"><div><div class="ns-kicker">NUTRISPORT PRO • COACH PERSONAL</div><h2>Tu estrategia, calculada para ti</h2><p>Objetivo: <b>${esc(goalText)}</b>. Las cifras son estimaciones orientativas y el plan prioriza hábitos sostenibles.</p></div><div class="ns-orb" aria-hidden="true">✦</div></div>
      <div class="ns-pro-summary" aria-label="Resumen de tu plan"><div><b>${c.target}</b><span>kcal estimadas</span></div><div><b>${c.protein} g</b><span>proteína</span></div><div><b>${c.carbs} g</b><span>carbohidratos</span></div><div><b>${c.water} ml</b><span>agua de referencia</span></div></div>
      <button class="ns-pro-toggle" type="button" aria-expanded="false" data-ns-pro-toggle="1">Ver Coach PRO completo ↓</button>
      <div class="ns-pro-details" aria-hidden="true">
        <div class="ns-grid ns-two"><article><div class="ns-title">🍽️ Menú inteligente</div><p class="ns-muted">Ejemplo de un día adaptado a tu objetivo. Puedes intercambiar alimentos equivalentes.</p><ul class="ns-foods">${foodRows(meals)}</ul><div class="ns-note">Tip: prioriza verduras, frutas, granos integrales y fuentes variadas de proteína; ajusta cantidades según evolución y apetito.</div></article>
        <article><div class="ns-title">🏋️ Ruta de entrenamiento</div><p class="ns-muted">Combinación semanal diseñada alrededor de tu objetivo.</p><div class="ns-days">${days}</div><div class="ns-note">Meta general: 150–300 min/semana de actividad moderada y fuerza al menos 2 días para adultos, progresando de forma gradual.</div></article></div>
        <div class="ns-grid ns-two"><article><div class="ns-title">🛒 Lista de compras • 7 días</div><div class="ns-shopping">${shopping(meals)}</div><button class="ns-copy" data-ns-copy="shopping">Copiar lista</button></article>
        <article><div class="ns-title">🧠 Smart Coach</div><div class="ns-coach"><div>⚡ Si te cuesta llegar a proteína: reparte una fuente proteica en 3–4 comidas.</div><div>🥦 Si buscas reducir peso: aumenta alimentos de baja densidad energética como verduras y fruta entera.</div><div>💪 Si buscas ganar músculo: combina fuerza progresiva con suficiente energía, proteína y recuperación.</div><div>😴 El sueño y la recuperación también forman parte del plan.</div></div></article></div>
        <div class="ns-disclaimer">NutriSport ofrece orientación general, no diagnóstico ni tratamiento médico. Si tienes una enfermedad, tomas medicamentos, estás embarazada/o o tienes necesidades nutricionales especiales, consulta a un profesional.</div>
      </div>
    </section>`;
  }
  function normalGuide(p){
    const c=calc(p); return `<section id="ns-free-guide" class="ns-free"><div><b>Tu guía NutriSport</b><span>${c.target} kcal estimadas · ${c.water} ml de agua como referencia</span></div><p>Registra tus comidas, agua y actividad para conocer tus hábitos. <b>PRO</b> desbloquea menú personalizado, lista de compras, rutinas por objetivo y análisis avanzado.</p></section>`;
  }
  function inject(){
    const p=profile(); if(!p)return;
    const root=document.getElementById('root'); if(!root)return;
    const body=root.querySelector('.max-w-\\[980px\\]')||root.querySelector('[class*="max-w-[980px]"]');
    if(!body)return;
    const isDash=Array.from(document.querySelectorAll('button')).some(b=>b.className.includes('bg-[#22c55e]')&&b.textContent.trim()==='Inicio');
    const existing=document.getElementById('ns-pro-studio'); const free=document.getElementById('ns-free-guide');
    if(isDash){
      if(isPro(p)){if(!existing){body.insertAdjacentHTML('beforeend',build(p));bind();}} else {if(!free)body.insertAdjacentHTML('beforeend',normalGuide(p));}
    } else {existing?.remove();free?.remove();}
  }
  function bind(){
    document.querySelectorAll('[data-ns-copy="shopping"]').forEach(b=>{if(b.dataset.bound)return;b.dataset.bound='1';b.onclick=async()=>{const t=b.parentElement.querySelector('.ns-shopping')?.innerText||'';try{await navigator.clipboard?.writeText(t);b.textContent='✓ Copiado';window.NutriSportUX?.toast?.('Lista copiada');setTimeout(()=>b.textContent='Copiar lista',1500)}catch(e){window.NutriSportUX?.toast?.('No se pudo copiar automáticamente.')}}});
    document.querySelectorAll('[data-ns-pro-toggle]').forEach(b=>{if(b.dataset.bound)return;b.dataset.bound='1';b.onclick=()=>{const d=b.parentElement.querySelector('.ns-pro-details');const open=!!d?.classList.toggle('is-open');b.setAttribute('aria-expanded',open?'true':'false');d?.setAttribute('aria-hidden',open?'false':'true');b.textContent=open?'Ocultar Coach PRO ↑':'Ver Coach PRO completo ↓';if(open)d?.scrollIntoView({behavior:'smooth',block:'start'});}});
  }
  function explainRegistration(){
    const map=[['Edad','Tu edad en años. Se usa para estimar tus necesidades energéticas.'],['Peso kg','Tu peso actual en kilogramos.'],['Altura cm','Tu estatura en centímetros.'],['Actividad física','Elige el nivel que más se parezca a una semana normal: incluye ejercicio y movimiento habitual.'],['Objetivo','El resultado que buscas: perder peso, mantenerlo, ganar masa o hacer definición.']];
    document.querySelectorAll('input,select').forEach(el=>{if(el.dataset.nsHelp)return;const ph=el.placeholder||'';let hit=map.find(x=>ph.includes(x[0])||((el.parentElement?.innerText||'').includes(x[0])));if(!hit)return;el.dataset.nsHelp='1';const s=document.createElement('div');s.className='ns-field-help';s.textContent=hit[1];el.insertAdjacentElement('afterend',s)});
  }
  function hideDebug(){document.querySelectorAll('div').forEach(el=>{const t=(el.innerText||'').trim();if(t.startsWith('Namespace por hash')||t.startsWith('Intento Firestore config')||t.startsWith('Servidor:'))el.style.display='none';});}
  function improveDelete(){
    const old=window.eliminarPerfil; if(window.__nsDeleteImproved)return; window.__nsDeleteImproved=true;
    window.eliminarPerfil=async function(){
      const user=window.firebaseAuth?.currentUser;if(!user){alert('No hay una sesión activa.');return;}
      if(!confirm('¿Eliminar definitivamente tu cuenta y tus datos? Esta acción no se puede deshacer.'))return;
      if(prompt('Escribe ELIMINAR para confirmar:')!=='ELIMINAR')return;
      try{
        try{await user.delete();}
        catch(e){
          if(e.code==='auth/requires-recent-login'){
            if(user.providerData?.some(x=>x.providerId==='google.com')) {
              if(window.Capacitor?.getPlatform?.()==='android'){
                const np=window.Capacitor?.Plugins?.FirebaseAuthentication;
                if(!np?.signInWithGoogle) throw e;
                const rr=await np.signInWithGoogle({useCredentialManager:true,skipNativeAuth:true});
                const tok=rr?.credential?.idToken; if(!tok) throw e;
                await firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(tok,rr?.credential?.accessToken||null));
              } else await user.reauthenticateWithPopup(new firebase.auth.GoogleAuthProvider());
            } else {const pw=prompt('Por seguridad, vuelve a escribir tu contraseña para confirmar la eliminación:');if(!pw)throw e;await user.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(user.email,pw));}
            await user.delete();
          } else throw e;
        }
        try{await firebase.firestore().doc('users/'+user.uid).delete()}catch(e){}
        Object.keys(localStorage).filter(k=>k.includes(user.uid)||k.startsWith('nutritrack')||k.startsWith('nutrisport')||k.startsWith('customFoods')||k.startsWith('customEx')).forEach(k=>localStorage.removeItem(k));
        alert('Tu cuenta y sus datos locales fueron eliminados.');location.reload();
      }catch(e){alert('No se pudo eliminar la cuenta: '+(e.message||e.code||'error'))}
    }
  }
  function style(){if(document.getElementById('ns-super-style'))return;const s=document.createElement('style');s.id='ns-super-style';s.textContent=`
  .ns-studio{margin:20px 0 120px;border:1px solid rgba(245,158,11,.25);border-radius:24px;padding:18px;background:radial-gradient(circle at 90% 0%,rgba(34,197,94,.13),transparent 35%),linear-gradient(135deg,#111a12,#0b110b);box-shadow:0 20px 60px rgba(0,0,0,.28)}
  .ns-pro-hero{display:flex;justify-content:space-between;gap:16px;align-items:center;padding:8px 2px 18px}.ns-kicker{font-size:10px;letter-spacing:.16em;font-weight:900;color:#fbbf24}.ns-pro-hero h2{font-size:25px;font-weight:900;margin:5px 0}.ns-pro-hero p,.ns-muted{font-size:12px;color:rgba(255,255,255,.58);line-height:1.55}.ns-orb{width:58px;height:58px;border-radius:20px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#fbbf24,#22c55e);color:#071007;font-size:28px;font-weight:900;box-shadow:0 0 35px rgba(245,158,11,.2)}
  .ns-grid{display:grid;gap:12px}.ns-metrics{grid-template-columns:repeat(4,minmax(0,1fr));margin:0 0 12px}.ns-metrics>div{padding:13px;border:1px solid rgba(255,255,255,.07);border-radius:16px;background:rgba(0,0,0,.18)}.ns-metrics small,.ns-metrics span{display:block;color:rgba(255,255,255,.43);font-size:10px}.ns-metrics strong{display:block;font-size:22px;margin:3px 0}.ns-two{grid-template-columns:repeat(2,minmax(0,1fr));margin-top:12px}.ns-two article{padding:15px;border:1px solid rgba(255,255,255,.07);border-radius:18px;background:rgba(0,0,0,.16)}.ns-title{font-size:15px;font-weight:900}.ns-foods{margin:10px 0;padding:0;list-style:none}.ns-foods li{display:flex;justify-content:space-between;gap:10px;padding:7px 0;border-bottom:1px solid rgba(255,255,255,.05);font-size:11px}.ns-foods li span{color:#4ade80;white-space:nowrap}.ns-note{font-size:10px;color:rgba(255,255,255,.45);line-height:1.5;padding-top:9px}.ns-days{display:grid;gap:6px;margin-top:10px}.nsp-day{padding:8px 9px;border-radius:11px;background:#0a100a;border:1px solid #1c2a1c;font-size:11px}.nsp-day span{margin-left:5px;color:#4ade80}.nsp-day small{display:block;color:rgba(255,255,255,.48);margin-top:4px}.ns-shopping{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin:10px 0}.ns-shopping span{font-size:10px;padding:8px;border-radius:9px;background:#0a100a;border:1px solid #1c2a1c}.ns-shopping b{display:block;color:#4ade80;margin-top:2px}.ns-copy{padding:8px 11px;border-radius:10px;background:#22c55e;color:#061006;font-weight:900;font-size:11px}.ns-coach{display:grid;gap:8px;margin-top:10px}.ns-coach div{font-size:11px;line-height:1.5;padding:9px;border-radius:10px;background:#0a100a;border:1px solid #1c2a1c}.ns-free{margin:20px 0 120px;padding:15px;border:1px solid rgba(34,197,94,.18);border-radius:18px;background:linear-gradient(135deg,rgba(34,197,94,.07),rgba(0,0,0,.15))}.ns-free>div{display:flex;justify-content:space-between;gap:10px;font-size:13px}.ns-free>div span{font-size:10px;color:rgba(255,255,255,.48)}.ns-free p{font-size:11px;color:rgba(255,255,255,.55);line-height:1.5;margin-top:8px}.ns-disclaimer{font-size:9px;color:rgba(255,255,255,.32);margin-top:12px;line-height:1.5}.ns-field-help{font-size:10px;line-height:1.35;color:rgba(255,255,255,.42);margin:-5px 2px 3px;grid-column:span 2}
  @media(max-width:700px){.ns-metrics{grid-template-columns:repeat(2,minmax(0,1fr))}.ns-two{grid-template-columns:1fr}.ns-pro-hero h2{font-size:21px}.ns-shopping{grid-template-columns:1fr}.ns-field-help{grid-column:span 2}}
  `;document.head.appendChild(s)}
  style();
  const obs=new MutationObserver(()=>{explainRegistration();hideDebug();improveDelete();inject();});
  obs.observe(document.body,{childList:true,subtree:true});
  setInterval(()=>{explainRegistration();hideDebug();improveDelete();inject()},1200);
})();
