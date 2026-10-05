/* HorseHub 1.32.0 – 2D rigged Andalusian companion.
   Fixed companion for the whole app. Layered SVG puppet, no AI, no model download.
   Motion is split into independent body/head/ear/eye/mane/tail systems.
*/
(()=>{'use strict';
const VERSION='1.32.0';
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
function horseSvg(){const p=profile();return `<div class="hh-vector-wrap" aria-label="${esc(p.name)}"><svg viewBox="0 0 360 420" role="img" focusable="false" class="hh-andalusian-svg">
<defs>
 <linearGradient id="coat" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#15100f"/><stop offset=".38" stop-color="#33211c"/><stop offset=".68" stop-color="#120e0d"/><stop offset="1" stop-color="#050505"/></linearGradient>
 <linearGradient id="coatWarm" x1="0" y1="0" x2=".9" y2="1"><stop offset="0" stop-color="#594039"/><stop offset=".42" stop-color="#241815"/><stop offset="1" stop-color="#070707"/></linearGradient>
 <linearGradient id="neck" x1="0" y1="0" x2="1" y2=".5"><stop offset="0" stop-color="#070707"/><stop offset=".48" stop-color="#4a332d"/><stop offset=".7" stop-color="#17100e"/><stop offset="1" stop-color="#050505"/></linearGradient>
 <linearGradient id="muzzle" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4e3730"/><stop offset=".5" stop-color="#1b1412"/><stop offset="1" stop-color="#080707"/></linearGradient>
 <linearGradient id="mane" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0a0808"/><stop offset=".42" stop-color="#3b2925"/><stop offset=".65" stop-color="#100c0b"/><stop offset="1" stop-color="#020202"/></linearGradient>
 <radialGradient id="iris"><stop offset="0" stop-color="#d5a76b"/><stop offset=".3" stop-color="#6f4b2d"/><stop offset=".72" stop-color="#1b120e"/><stop offset="1" stop-color="#050505"/></radialGradient>
 <linearGradient id="hoof" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#332c29"/><stop offset="1" stop-color="#0c0b0b"/></linearGradient>
 <filter id="blur"><feGaussianBlur stdDeviation="3"/></filter>
 <filter id="soft"><feGaussianBlur stdDeviation="1.2"/></filter>
</defs>
<ellipse class="hh-shadow" cx="185" cy="391" rx="112" ry="17" fill="#000" opacity=".22" filter="url(#soft)"/>
<g class="hh-rig">
  <g class="hh-tail"><path d="M82 286 C50 292 37 316 47 333 C53 344 71 338 79 326 C66 348 86 355 99 333 C112 312 107 297 92 284Z" fill="url(#mane)"/><path d="M77 301 C58 313 57 329 67 333" fill="none" stroke="#76594e" stroke-opacity=".42" stroke-width="4" stroke-linecap="round"/><path d="M84 303 C74 324 81 337 88 339" fill="none" stroke="#4c362f" stroke-opacity=".6" stroke-width="3" stroke-linecap="round"/></g>
  <g class="hh-body"><path d="M74 252 C78 218 102 195 143 188 C190 180 242 195 268 226 C286 247 288 283 274 310 C259 335 218 344 170 340 C124 337 91 319 78 292 C72 280 71 266 74 252Z" fill="url(#coat)"/>
    <path d="M93 238 C119 210 170 199 216 210 C240 216 260 230 269 249 C245 233 212 228 175 231 C140 234 111 244 91 259Z" fill="#8a6859" opacity=".13"/>
    <path d="M112 280 C148 302 218 306 264 281" fill="none" stroke="#a47c69" stroke-opacity=".13" stroke-width="11" stroke-linecap="round"/>
    <path d="M98 311 C139 330 210 333 251 313" fill="none" stroke="#000" stroke-opacity=".28" stroke-width="13" stroke-linecap="round"/>
  </g>
  <g class="hh-neck"><path d="M128 260 C118 224 118 180 128 139 C138 99 160 70 192 64 C219 59 245 77 249 106 C253 134 239 160 226 185 C213 209 213 238 229 272 C202 290 157 286 128 260Z" fill="url(#neck)"/>
    <path d="M143 223 C135 186 143 131 165 96 C177 77 198 69 216 78 C183 85 166 113 159 150 C151 188 163 229 181 258 C167 257 153 245 143 223Z" fill="#9c725f" opacity=".13"/>
    <path d="M202 86 C221 111 221 144 207 169" fill="none" stroke="#c0927b" stroke-opacity=".15" stroke-width="9" stroke-linecap="round"/>
  </g>
  <g class="hh-legs">
    <g class="hh-leg-back"><path d="M235 286 C243 312 245 344 239 375 C237 386 226 389 214 385 L218 374 L222 309Z" fill="url(#coatWarm)"/><path d="M214 373 L240 373 L242 389 L212 389Z" fill="url(#hoof)"/></g>
    <g class="hh-leg-back2"><path d="M196 294 C202 323 202 353 197 378 C194 388 184 389 174 385 L177 373 L180 305Z" fill="url(#coat)"/><path d="M173 373 L198 373 L199 389 L171 389Z" fill="url(#hoof)"/></g>
    <g class="hh-leg-front"><path d="M139 282 C132 311 128 345 132 375 C134 387 145 389 156 384 L153 372 L155 300Z" fill="url(#coatWarm)"/><path d="M130 373 L156 373 L158 389 L129 389Z" fill="url(#hoof)"/></g>
    <g class="hh-leg-front2"><path d="M112 278 C105 308 104 342 108 374 C109 386 120 390 130 384 L127 371 L131 299Z" fill="url(#coat)"/><path d="M106 372 L130 372 L132 389 L104 389Z" fill="url(#hoof)"/></g>
  </g>
  <g class="hh-head"><path d="M174 109 C159 89 157 59 170 36 C184 12 210 3 236 12 C263 21 277 43 275 69 C273 94 257 113 237 126 C219 137 190 133 174 109Z" fill="url(#coat)"/>
    <path d="M171 62 C188 38 216 27 244 34 C258 38 269 48 274 61 C251 49 225 48 202 56 C190 60 181 67 171 77Z" fill="#b48a74" opacity=".13"/>
    <path d="M224 80 C244 78 263 86 267 101 C263 121 248 137 227 142 C207 146 185 136 178 119 C184 103 202 87 224 80Z" fill="url(#muzzle)"/>
    <path d="M194 128 C212 139 239 139 257 125" fill="none" stroke="#b28a77" stroke-opacity=".2" stroke-width="4" stroke-linecap="round"/>
    <g class="hh-ears"><path class="hh-ear-l" d="M188 43 C174 31 168 12 173 -7 C193 0 209 16 212 37Z" fill="url(#coatWarm)" stroke="#080707" stroke-width="3"/><path class="hh-ear-r" d="M230 35 C239 12 254 0 273 1 C274 21 264 39 247 50Z" fill="url(#coat)" stroke="#080707" stroke-width="3"/><path d="M180 3 C191 10 198 19 201 31 L188 23Z M260 8 C256 20 251 29 244 37 L256 27Z" fill="#9a6b5a" opacity=".35"/></g>
    <g class="hh-mane-front"><path d="M183 40 C161 62 157 93 169 119 C179 139 196 149 210 151 C194 128 193 103 202 76 C208 58 203 46 196 35Z" fill="url(#mane)"/><path d="M174 67 C169 92 176 117 191 133" fill="none" stroke="#77564b" stroke-opacity=".45" stroke-width="5" stroke-linecap="round"/><path d="M181 51 C174 78 182 99 194 114" fill="none" stroke="#b18a76" stroke-opacity=".2" stroke-width="3" stroke-linecap="round"/></g>
    <g class="hh-eyes"><g class="hh-eye hh-eye-l"><ellipse cx="202" cy="76" rx="11" ry="12" fill="#090807"/><ellipse cx="202" cy="76" rx="7" ry="8" fill="url(#iris)"/><circle cx="205" cy="72" r="2.7" fill="#fff" opacity=".95"/><path class="hh-lid" d="M190 74 Q202 62 214 74" fill="none" stroke="#0a0808" stroke-width="5" stroke-linecap="round"/></g><g class="hh-eye hh-eye-r"><ellipse cx="246" cy="75" rx="11" ry="12" fill="#090807"/><ellipse cx="246" cy="75" rx="7" ry="8" fill="url(#iris)"/><circle cx="249" cy="71" r="2.7" fill="#fff" opacity=".95"/><path class="hh-lid" d="M234 73 Q246 61 258 73" fill="none" stroke="#0a0808" stroke-width="5" stroke-linecap="round"/></g></g>
    <path d="M215 29 C226 24 238 25 247 30" fill="none" stroke="#e2b09a" stroke-opacity=".22" stroke-width="5" stroke-linecap="round"/>
    <path d="M247 101 C253 99 260 100 264 104" fill="none" stroke="#000" stroke-opacity=".4" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="206" cy="114" rx="5" ry="6" fill="#090807"/><ellipse cx="253" cy="112" rx="5" ry="6" fill="#090807"/>
  </g>
</g></svg></div>`}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function displayClass(){return mood==='happy'?'hh-reaction-happy':mood==='curious'?'hh-reaction-curious':mood==='reminder'?'hh-reaction-reminder':mood==='calm'?'hh-reaction-calm':''}
function greeting(){const messages={friendly:['Hallo! Schön, dass du da bist.','Wie schön, dich zu sehen!','Ich bin bei dir – was steht heute an?'],curious:['Was schauen wir uns als Nächstes an?','Ich bin neugierig auf deinen Stalltag!'],happy:['Juhu, das hast du toll gemacht!','Super erledigt – weiter so!'],reminder:['Psst … schau doch kurz auf deine heutigen Aufgaben.','Kleiner Hinweis: Vielleicht steht bald etwas im Kalender an.']};const a=messages[mood]||messages.friendly;return {title:'HorseHub',text:a[Math.floor(Math.random()*a.length)]}}
function renderFaceOnly(){const face=$('hh-companion-face');if(!face)return;face.className=displayClass();if(!face.innerHTML)face.innerHTML=horseSvg();startIdleController()}
function anchorBubble(){const trig=$('hh-companion-trigger'),b=$('hh-companion-bubble');if(!trig||!b)return;const r=trig.getBoundingClientRect(),bw=Math.min(250,window.innerWidth-20),left=Math.max(10,Math.min(window.innerWidth-bw-10,r.left+r.width/2-bw/2));let top=r.top-12;const bh=b.offsetHeight||72;if(top-bh<10)top=r.bottom+10;b.style.left=`${left}px`;b.style.right='auto';b.style.top=`${Math.max(10,top-bh)}px`}
function renderBubble(){const el=$('hh-companion-bubble');if(!el)return;el.innerHTML=bubbleOpen?`<div class="hh-bubble-title">${esc(greeting().title)}</div><div class="hh-bubble-text">${esc(greeting().text)}</div>`:'';el.classList.toggle('hidden',!bubbleOpen);if(bubbleOpen)requestAnimationFrame(anchorBubble)}
function applyPosition(){const trigger=$('hh-companion-trigger');if(!trigger)return;trigger.classList.toggle('manual',Number.isFinite(settings.dragX)&&Number.isFinite(settings.dragY));if(Number.isFinite(settings.dragX)&&Number.isFinite(settings.dragY)){trigger.style.left=`${Math.max(6,Math.min(window.innerWidth-6,settings.dragX))}px`;trigger.style.top=`${Math.max(6,Math.min(window.innerHeight-6,settings.dragY))}px`;trigger.style.right='auto';trigger.style.bottom='auto'}else{trigger.style.left='';trigger.style.top='';trigger.style.right='';trigger.style.bottom=''}}
function render(){const root=$('hh-companion-root');if(!root)return;const trigger=$('hh-companion-trigger');if(trigger){const w=settings.size==='klein'?100:settings.size==='gross'?158:130,h=settings.size==='klein'?126:settings.size==='gross'?195:160;trigger.style.width=w+'px';trigger.style.height=h+'px';trigger.style.display=settings.enabled?'block':'none'}renderFaceOnly();applyPosition();renderBubble();const panel=$('hh-companion-panel');if(panel)panel.classList.toggle('hidden',!panelOpen);root.classList.toggle('hh-disabled',!settings.enabled)}
function renderPanel(){const panel=$('hh-companion-panel');if(!panel)return;panel.innerHTML=`<div class="hh-companion-panel-title"><h3 style="margin:0">🐴 Pferdebegleiter</h3><button type="button" class="smallbtn secondary" data-hh="close">Schließen</button></div><p class="hh-muted">A – Andalusier (Rappe), als lokal animierter 2D-Rig. Ein fester Begleiter für die gesamte App.</p><div class="hh-section"><b>Größe</b><select id="hh-size-select"><option value="klein" ${settings.size==='klein'?'selected':''}>Klein</option><option value="mittel" ${settings.size==='mittel'?'selected':''}>Mittel</option><option value="gross" ${settings.size==='gross'?'selected':''}>Groß</option></select></div><div class="hh-section"><b>Position</b><p class="hh-muted" style="margin:5px 0 8px">Ziehe den Begleiter direkt auf dem Bildschirm an eine freie Stelle.</p><button type="button" class="secondary" data-hh="reset-position">↺ Position zurücksetzen</button></div><div class="hh-section"><b>Reaktionen</b><label class="hh-check"><input type="checkbox" data-pref="greetings" ${settings.greetings?'checked':''}> Begrüßungen und kleine Sprüche</label><label class="hh-check"><input type="checkbox" data-pref="taskReactions" ${settings.taskReactions?'checked':''}> Auf erledigte Aufgaben reagieren</label><label class="hh-check"><input type="checkbox" data-pref="reminders" ${settings.reminders?'checked':''}> Freundliche Erinnerungen</label><label class="hh-check"><input type="checkbox" data-pref="randomTips" ${settings.randomTips?'checked':''}> Zufällige Motivationstipps</label><label class="hh-check"><input type="checkbox" data-pref="enabled" ${settings.enabled?'checked':''}> Begleiter anzeigen</label></div><div class="hh-row-actions"><button type="button" data-hh="preview">▶ Animation testen</button><button type="button" class="secondary" data-hh="tip">💬 Spruch testen</button></div><div id="hh-companion-status" class="hh-companion-status ok">2D-Rig aktiv · ${esc(profile().name)}</div>`;panel.querySelector('#hh-size-select')?.addEventListener('change',e=>{settings.size=e.target.value;persist();render()});panel.querySelectorAll('[data-pref]').forEach(el=>el.addEventListener('change',()=>{settings[el.dataset.pref]=el.checked;persist();render();renderSettingsCard()}))}
function renderSettingsCard(){const host=$('horseCompanionSettingsHost');if(!host)return;host.innerHTML=`<div class="hh-settings-inline"><div class="hh-settings-inline-photo">${horseSvg()}</div><div><div class="hh-selection-note"><b>A – Andalusier (Rappe)</b><br>Realistisch-stilisierter 2D-Rig nach unserer Charakterstudie. Ein fester Begleiter für die gesamte App. Keine KI und kein Modell-Download.</div><div class="hh-row-actions"><button type="button" data-settings="toggle">${settings.enabled?'🐴 Begleiter deaktivieren':'🐴 Begleiter aktivieren'}</button><button type="button" class="secondary" data-settings="open">⚙️ Begleiter-Einstellungen</button><button type="button" class="secondary" data-settings="preview">▶ Animation testen</button></div><div class="hh-companion-status ${settings.enabled?'ok':'off'}">${settings.enabled?'2D-Begleiter ist aktiv':'Begleiter ist deaktiviert'}</div></div></div>`;host.querySelector('[data-settings="toggle"]')?.addEventListener('click',()=>{settings.enabled=!settings.enabled;panelOpen=false;bubbleOpen=false;persist();render();renderSettingsCard()});host.querySelector('[data-settings="open"]')?.addEventListener('click',()=>{panelOpen=true;bubbleOpen=false;renderPanel();render()});host.querySelector('[data-settings="preview"]')?.addEventListener('click',()=>react('happy'))}
function react(next='friendly'){mood=next;panelOpen=false;bubbleOpen=true;render();const face=$('hh-companion-face');const rig=face?.querySelector('.hh-rig');if(!rig)return;const map={friendly:'hh-rx-greet',happy:'hh-rx-happy',curious:'hh-rx-curious',reminder:'hh-rx-alert',calm:'hh-rx-calm'};pulse(rig,map[next]||map.friendly, next==='calm'?3000:2300)}
function animate(el,cls,duration){if(!el)return;pulse(el,cls,duration)}
function startIdleController(){clearTimers();if(!settings.enabled)return;const face=$('hh-companion-face');if(!face)return;const q=s=>face.querySelector(s);
  // Permanent, tiny breathing layer.
  q('.hh-rig')?.classList.add('hh-breathe');
  // Independent asynchronous movements – no fixed loop pattern.
  const schedule=()=>{
    if(!settings.enabled||!document.body.contains(face))return;
    later(()=>{animate(q('.hh-ears'),'hh-ear-l',850);later(()=>animate(q('.hh-ears'),'hh-ear-r',900),120,700)},1800,5200);
    later(()=>animate(q('.hh-eye-l .hh-lid'),'hh-blink',420),3500,10500);
    later(()=>animate(q('.hh-eye-r .hh-lid'),'hh-blink',420),3600,11000);
    later(()=>animate(q('.hh-head'),'hh-head-left',1800),7000,17000);
    later(()=>animate(q('.hh-head'),'hh-head-right',1800),9000,19000);
    later(()=>animate(q('.hh-body'),'hh-weight',1900),5000,10500);
    later(()=>animate(q('.hh-mane-front'),'hh-mane-sway',1800),7000,14000);
    later(()=>animate(q('.hh-tail'),'hh-tail-sway',2400),14000,30000);
    later(()=>{schedule()},32000,44000);
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
