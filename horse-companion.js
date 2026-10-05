/* HorseHub 1.39.0 – 2D rigged Andalusian companion.
   Fixed companion for the whole app. Layered SVG puppet, no AI, no model download.
   Motion is split into independent body/head/ear/eye/mane/tail systems.
*/
(()=>{'use strict';
const VERSION='1.50.0';
const KEY='hhCompanionSettings_v5';
const OLD_KEYS=['hhCompanionSettings_v4','hhCompanionSettings_v3','hhCompanionSettings_v2'];
try{['hhCompanionSelections_v1','hhCompanionPhotoOriginal_v1','hhCompanionPhotoCartoon_v1'].forEach(k=>localStorage.removeItem(k))}catch(_){}
const defaults={enabled:true,size:'mittel',position:'rechts',dragX:null,dragY:null,greetings:true,taskReactions:true,reminders:true,randomTips:true};
const readJson=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(d))}catch(_){return d}};
const $=id=>document.getElementById(id);
let settings={...defaults,...readJson(KEY,{})};
if(!localStorage.getItem(KEY)){
  for(const k of OLD_KEYS){const old=readJson(k,null);if(old){settings={...defaults,...old,dragX:null,dragY:null};break}}
  try{localStorage.setItem(KEY,JSON.stringify(settings))}catch(_){ }
}
let mood='friendly',bubbleOpen=false,panelOpen=false,lastTaskReaction=0,dragging=false,dragMoved=false,dragStart=null;
let timers=[];
function persist(){try{localStorage.setItem(KEY,JSON.stringify(settings))}catch(e){console.warn(e)}}
function profile(){return window.HorseHubCompanionDB?.[0]||{id:'horsehub-default',name:'HorseHub-Begleiter'}}
function resetDrag(){settings.dragX=null;settings.dragY=null;settings.position='rechts';persist();render()}
function clearTimers(){timers.forEach(clearTimeout);timers=[]}
function later(fn,min,max){const ms=Math.round(min+Math.random()*(max-min));const id=setTimeout(()=>{timers=timers.filter(x=>x!==id);fn()},ms);timers.push(id)}
function pulse(el,cls,duration=900){if(!el)return;el.classList.remove(cls);void el.offsetWidth;el.classList.add(cls);setTimeout(()=>el.classList.remove(cls),duration)}
function horseSvg(){const p=profile();const color=(p.color||'').toLowerCase();let lid='#4a3028';if(color.includes('schimmel')||color.includes('weiß'))lid='#d8d1c8';else if(color.includes('braun'))lid='#5a3b2c';else if(color.includes('fuchs'))lid='#70412b';else if(color.includes('schwarz')||color.includes('rappe'))lid='#3a2927';return `<div class="hh-photo-wrap hh-head-only" style="--hh-lid-color:${lid}" aria-label="${esc(p.name)}"><div class="hh-photo-neck-motion"><div class="hh-photo-rig"><div class="hh-photo-head-motion"><img class="hh-photo-base" src="andalusier-head-neck-clean.png?v=1.50.0" alt="A – Andalusier (Rappe), Kopf und Hals"><span class="hh-photo-lid hh-photo-lid-l" aria-hidden="true"><i></i></span><span class="hh-photo-lid hh-photo-lid-r" aria-hidden="true"><i></i></span></div></div></div></div>`}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function displayClass(){return mood==='happy'?'hh-reaction-happy':mood==='curious'?'hh-reaction-curious':mood==='reminder'?'hh-reaction-reminder':mood==='calm'?'hh-reaction-calm':''}
function greeting(){const messages={friendly:['Hallo! Schön, dass du da bist.','Wie schön, dich zu sehen!','Ich bin bei dir – was steht heute an?'],curious:['Was schauen wir uns als Nächstes an?','Ich bin neugierig auf deinen Stalltag!'],happy:['Juhu, das hast du toll gemacht!','Super erledigt – weiter so!'],reminder:['Psst … schau doch kurz auf deine heutigen Aufgaben.','Kleiner Hinweis: Vielleicht steht bald etwas im Kalender an.']};const a=messages[mood]||messages.friendly;return {title:'HorseHub',text:a[Math.floor(Math.random()*a.length)]}}
function renderFaceOnly(){const face=$('hh-companion-face');if(!face)return;face.className=displayClass();if(!face.innerHTML)face.innerHTML=horseSvg();startIdleController()}
function anchorBubble(){const trig=$('hh-companion-trigger'),b=$('hh-companion-bubble');if(!trig||!b)return;const r=trig.getBoundingClientRect(),bw=Math.min(250,window.innerWidth-20),left=Math.max(10,Math.min(window.innerWidth-bw-10,r.left+r.width/2-bw/2));let top=r.top-12;const bh=b.offsetHeight||72;if(top-bh<10)top=r.bottom+10;b.style.left=`${left}px`;b.style.right='auto';b.style.top=`${Math.max(10,top-bh)}px`}
function renderBubble(){const el=$('hh-companion-bubble');if(!el)return;el.innerHTML=bubbleOpen?`<div class="hh-bubble-title">${esc(greeting().title)}</div><div class="hh-bubble-text">${esc(greeting().text)}</div>`:'';el.classList.toggle('hidden',!bubbleOpen);if(bubbleOpen)requestAnimationFrame(anchorBubble)}
function applyPosition(){const trigger=$('hh-companion-trigger');if(!trigger)return;trigger.classList.toggle('manual',Number.isFinite(settings.dragX)&&Number.isFinite(settings.dragY));if(Number.isFinite(settings.dragX)&&Number.isFinite(settings.dragY)){trigger.style.left=`${Math.max(6,Math.min(window.innerWidth-6,settings.dragX))}px`;trigger.style.top=`${Math.max(6,Math.min(window.innerHeight-6,settings.dragY))}px`;trigger.style.right='auto';trigger.style.bottom='auto'}else{trigger.style.left='';trigger.style.top='';trigger.style.right='';trigger.style.bottom=''}}
function render(){const root=$('hh-companion-root');if(!root)return;const trigger=$('hh-companion-trigger');if(trigger){const w=settings.size==='klein'?100:settings.size==='gross'?158:130,h=settings.size==='klein'?126:settings.size==='gross'?195:160;trigger.style.width=w+'px';trigger.style.height=h+'px';trigger.style.display=settings.enabled?'block':'none'}renderFaceOnly();applyPosition();renderBubble();const panel=$('hh-companion-panel');if(panel)panel.classList.toggle('hidden',!panelOpen);root.classList.toggle('hh-disabled',!settings.enabled)}
function renderPanel(){const panel=$('hh-companion-panel');if(!panel)return;panel.innerHTML=`<div class="hh-companion-panel-title"><h3 style="margin:0">🐴 Pferdebegleiter</h3><button type="button" class="smallbtn secondary" data-hh="close">Schließen</button></div><p class="hh-muted">A – Andalusier (Rappe), als lokal animierter 2D-Kopf-Rig. Ein fester Begleiter für die gesamte App.</p><div class="hh-section"><b>Größe</b><select id="hh-size-select"><option value="klein" ${settings.size==='klein'?'selected':''}>Klein</option><option value="mittel" ${settings.size==='mittel'?'selected':''}>Mittel</option><option value="gross" ${settings.size==='gross'?'selected':''}>Groß</option></select></div><div class="hh-section"><b>Position</b><p class="hh-muted" style="margin:5px 0 8px">Ziehe den Begleiter direkt auf dem Bildschirm an eine freie Stelle.</p><button type="button" class="secondary" data-hh="reset-position">↺ Position zurücksetzen</button></div><div class="hh-section"><b>Reaktionen</b><label class="hh-check"><input type="checkbox" data-pref="greetings" ${settings.greetings?'checked':''}> Begrüßungen und kleine Sprüche</label><label class="hh-check"><input type="checkbox" data-pref="taskReactions" ${settings.taskReactions?'checked':''}> Auf erledigte Aufgaben reagieren</label><label class="hh-check"><input type="checkbox" data-pref="reminders" ${settings.reminders?'checked':''}> Freundliche Erinnerungen</label><label class="hh-check"><input type="checkbox" data-pref="randomTips" ${settings.randomTips?'checked':''}> Zufällige Motivationstipps</label><label class="hh-check"><input type="checkbox" data-pref="enabled" ${settings.enabled?'checked':''}> Begleiter anzeigen</label></div><div class="hh-row-actions"><button type="button" data-hh="preview">▶ Animation testen</button><button type="button" class="secondary" data-hh="tip">💬 Spruch testen</button></div><div id="hh-companion-status" class="hh-companion-status ok">2D-Kopf-Rig aktiv · abgestimmter Kopf · ${esc(profile().name)}</div>`;panel.querySelector('#hh-size-select')?.addEventListener('change',e=>{settings.size=e.target.value;persist();render()});panel.querySelectorAll('[data-pref]').forEach(el=>el.addEventListener('change',()=>{settings[el.dataset.pref]=el.checked;persist();render();renderSettingsCard()}))}
function renderSettingsCard(){const host=$('horseCompanionSettingsHost');if(!host)return;host.innerHTML=`<div class="hh-settings-inline"><div class="hh-settings-inline-photo">${horseSvg()}</div><div><div class="hh-selection-note"><b>A – Andalusier (Rappe)</b><br>Realistisch-stilisierter 2D-Kopf-Rig nach unserer Charakterstudie. Ein fester Begleiter für die gesamte App. Keine KI und kein Modell-Download.</div><div class="hh-row-actions"><button type="button" data-settings="toggle">${settings.enabled?'🐴 Begleiter deaktivieren':'🐴 Begleiter aktivieren'}</button><button type="button" class="secondary" data-settings="open">⚙️ Begleiter-Einstellungen</button><button type="button" class="secondary" data-settings="preview">▶ Animation testen</button></div><div class="hh-companion-status ${settings.enabled?'ok':'off'}">${settings.enabled?'2D-Begleiter ist aktiv':'Begleiter ist deaktiviert'}</div></div></div>`;host.querySelector('[data-settings="toggle"]')?.addEventListener('click',()=>{settings.enabled=!settings.enabled;panelOpen=false;bubbleOpen=false;persist();render();renderSettingsCard()});host.querySelector('[data-settings="open"]')?.addEventListener('click',()=>{panelOpen=true;bubbleOpen=false;renderPanel();render()});host.querySelector('[data-settings="preview"]')?.addEventListener('click',()=>react('happy'))}
function react(next='friendly'){mood=next;panelOpen=false;bubbleOpen=true;render();const face=$('hh-companion-face');const rig=face?.querySelector('.hh-photo-rig');if(!rig)return;const map={friendly:'hh-rx-greet',happy:'hh-rx-happy',curious:'hh-rx-curious',reminder:'hh-rx-alert',calm:'hh-rx-calm'};pulse(rig,map[next]||map.friendly, next==='calm'?3000:2300)}
function animate(el,cls,duration){if(!el)return;pulse(el,cls,duration)}
function runAnim(el, cls, duration, delay=0){
  if(!el)return;
  el.classList.remove(cls);
  void el.offsetWidth;
  if(delay)el.style.animationDelay=`${delay}ms`;
  el.classList.add(cls);
  window.setTimeout(()=>{el.classList.remove(cls);if(delay)el.style.animationDelay=''},duration+delay+30);
}
function startIdleController(){
  clearTimers();
  if(!settings.enabled)return;
  const face=$('hh-companion-face');
  if(!face)return;
  const q=s=>face.querySelector(s);
  const neck=q('.hh-photo-neck-motion'),head=q('.hh-photo-head-motion'),leftEar=q('.hh-photo-ear-l'),rightEar=q('.hh-photo-ear-r'),lidL=q('.hh-photo-lid-l'),lidR=q('.hh-photo-lid-r');
  neck?.classList.add('hh-neck-breathe');
  let headBusy=false;
  let earBusy=false;
  const laterSafe=(fn,min,max)=>later(()=>{if(settings.enabled&&document.body.contains(face))fn()},min,max);
  const headAction=(type)=>{
    if(headBusy||!settings.enabled)return;
    headBusy=true;
    const duration=type==='nod'?2500:2300;
    if(type==='nod'){
      runAnim(neck,'hh-neck-nod',duration);
      runAnim(head,'hh-head-nod',duration,70);
    }else if(type==='left'){
      runAnim(neck,'hh-neck-turn-left',duration);
      runAnim(head,'hh-head-left',duration,55);
    }else{
      runAnim(neck,'hh-neck-turn-right',duration);
      runAnim(head,'hh-head-right',duration,55);
    }
    window.setTimeout(()=>{headBusy=false},duration+180);
  };
  const earAction=()=>{
    return;
    if(earBusy||!settings.enabled)return;
    earBusy=true;
    const mode=Math.random();
    if(mode<0.43){runAnim(leftEar,'hh-ear-l',1200)}
    else if(mode<0.86){runAnim(rightEar,'hh-ear-r',1200)}
    else{runAnim(leftEar,'hh-ear-l',1250);runAnim(rightEar,'hh-ear-r',1250)}
    window.setTimeout(()=>{earBusy=false},1400);
  };
  const blink=()=>{
    if(!settings.enabled)return;
    runAnim(lidL,'hh-blink',390);
    runAnim(lidR,'hh-blink',390);
    if(Math.random()<0.18)window.setTimeout(()=>{if(settings.enabled){runAnim(lidL,'hh-blink',390);runAnim(lidR,'hh-blink',390)}},520);
  };
  const schedule=()=>{
    if(!settings.enabled||!document.body.contains(face))return;
    laterSafe(earAction,2600,6200);
    laterSafe(blink,4300,9500);
    laterSafe(()=>{
      const r=Math.random();
      headAction(r<0.28?'nod':r<0.64?'left':'right');
    },7000,12500);
    laterSafe(schedule,11000,17000);
  };
  schedule();
}
function onPointerDown(e){if(!settings.enabled)return;const t=e.currentTarget;if(e.pointerType==='mouse'&&e.button!==0)return;dragging=true;dragMoved=false;dragStart={x:e.clientX,y:e.clientY,left:t.getBoundingClientRect().left,top:t.getBoundingClientRect().top};t.setPointerCapture?.(e.pointerId);t.classList.add('dragging');e.preventDefault()}
function onPointerMove(e){if(!dragging||!dragStart)return;const dx=e.clientX-dragStart.x,dy=e.clientY-dragStart.y;if(!dragMoved&&(Math.abs(dx)+Math.abs(dy)<7))return;dragMoved=true;const t=e.currentTarget;let x=dragStart.left+dx,y=dragStart.top+dy;const r=t.getBoundingClientRect(),margin=6;x=Math.max(margin,Math.min(window.innerWidth-r.width-margin,x));y=Math.max(margin,Math.min(window.innerHeight-r.height-margin,y));settings.dragX=x;settings.dragY=y;settings.position='manuell';applyPosition();anchorBubble()}
function onPointerUp(e){if(!dragging)return;const t=e.currentTarget;dragging=false;t.classList.remove('dragging');t.releasePointerCapture?.(e.pointerId);if(dragMoved){persist();bubbleOpen=false;panelOpen=false;render();e.preventDefault();return}if(panelOpen){panelOpen=false;bubbleOpen=false}else if(bubbleOpen){panelOpen=true;bubbleOpen=false;renderPanel()}else{bubbleOpen=true;mood='curious'}render()}
function create(){if($('hh-companion-root'))return;const el=document.createElement('div');el.id='hh-companion-root';el.innerHTML=`<div id="hh-companion-bubble" class="hh-companion-bubble hidden" role="status" aria-live="polite"></div><div id="hh-companion-panel" class="hidden" aria-label="Pferdebegleiter"></div><button id="hh-companion-trigger" type="button" aria-label="Pferdebegleiter öffnen oder verschieben" title="Ziehen zum Verschieben · Tippen für Reaktionen"><span id="hh-companion-face"></span></button>`;document.body.appendChild(el);const trigger=$('hh-companion-trigger');trigger.addEventListener('pointerdown',onPointerDown);trigger.addEventListener('pointermove',onPointerMove);trigger.addEventListener('pointerup',onPointerUp);trigger.addEventListener('pointercancel',onPointerUp);el.addEventListener('click',e=>{const b=e.target.closest('[data-hh]');if(!b)return;const action=b.dataset.hh;if(action==='close'){panelOpen=false;bubbleOpen=false;render()}else if(action==='preview'){react('happy')}else if(action==='tip'){react(settings.reminders?'reminder':'friendly')}else if(action==='reset-position'){resetDrag();panelOpen=true;renderPanel()}});document.addEventListener('change',e=>{const t=e.target;if(t?.type==='checkbox'&&t.closest('#todayTodoList')&&settings.enabled&&settings.taskReactions){const now=Date.now();if(now-lastTaskReaction>1200){lastTaskReaction=now;setTimeout(()=>react('happy'),120)}}});window.addEventListener('resize',()=>{if(Number.isFinite(settings.dragX)&&Number.isFinite(settings.dragY)){settings.dragX=Math.min(settings.dragX,window.innerWidth-20);settings.dragY=Math.min(settings.dragY,window.innerHeight-20);persist();applyPosition()}if(bubbleOpen)anchorBubble()});render();renderSettingsCard();if(settings.enabled&&settings.greetings)setTimeout(()=>{if(!bubbleOpen&&!panelOpen)react('friendly')},2200)}
async function init(){if(document.readyState==='loading')await new Promise(r=>document.addEventListener('DOMContentLoaded',r,{once:true}));if(!window.HorseHubCompanionDB?.length){console.warn('Companion-Datenbank fehlt');return}persist();create();renderPanel();renderSettingsCard()}
window.addEventListener('storage',()=>{settings={...defaults,...readJson(KEY,{})};render();renderSettingsCard()});window.addEventListener('pageshow',()=>{settings={...defaults,...readJson(KEY,{})};render();renderSettingsCard()});init();
})();
