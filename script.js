/* =========================================================
   YOUR CONTENT  (edit everything here)
   ========================================================= */
const CONFIG = {
  email: "piyushpanwar0719@gmail.com",
  timeZone: "Asia/Kolkata",
  card: {
    initials: "Piyush Panwar", number: "001", level: "LVL 26",
    role: "Developer · Designer · Photographer",
    abilities: [["Design",92],["Code",88],["Motion",80],["Photo",85]],
    intro: "A short intro about you: what you do, where you're based and what you love building.",
    chips: ["Figma","React","SwiftUI","Illustrator","Framer","Lightroom"],
    place: "Remote · Worldwide"
  },
  name: "Piyush Panwar",
  roles: ["photographer", "UI/UX designer", "developer"],
  skills: [
    { id:"web", title:"Web Developer", menu:"Web Development", room:"Sites that load fast and feel <span>alive</span>.",
      desc:"Placeholder: describe the kind of websites you build, your stack and how you work with clients.",
      projects:[
        {name:"Project One", text:"Short description of the project and its result.", tags:["React","Landing page"]},
        {name:"Project Two", text:"Short description of the project and its result.", tags:["E-commerce","Shopify"]},
        {name:"Project Three", text:"Short description of the project and its result.", tags:["Portfolio","GSAP"]}]},
    { id:"app", title:"App Developer", menu:"App Development", room:"iOS apps people keep <span>opening</span>.",
      desc:"Placeholder: describe the apps you build and the platforms you work on.",
      projects:[
        {name:"App One", text:"Short description of the app.", tags:["SwiftUI","iOS"]},
        {name:"App Two", text:"Short description of the app.", tags:["Firebase","iOS"]}]},
    { id:"uiux", title:"UI/UX Designer", menu:"UI/UX Design", room:"Interfaces that just <span>make sense</span>.",
      desc:"Placeholder: describe your design process, tools and focus areas.",
      projects:[
        {name:"Case Study One", text:"Short description of the case study.", tags:["Figma","Web app"]},
        {name:"Case Study Two", text:"Short description of the case study.", tags:["Framer","Fintech"]},
        {name:"Case Study Three", text:"Short description of the case study.", tags:["Mobile","Research"]}]},
    { id:"graphic", title:"Graphic Designer", menu:"Graphic Design", room:"Brands with a <span>point of view</span>.",
      desc:"Placeholder: describe your branding, social and print work.",
      projects:[
        {name:"Brand One", text:"Short description of the work.", tags:["Illustrator","Branding"]},
        {name:"Social Kit", text:"Short description of the work.", tags:["Social media","Carousels"]}]},
    { id:"photo", title:"Photographer", menu:"Photography", room:"Light, framed and <span>kept</span>.",
      desc:"Placeholder: describe the photography you shoot.",
      projects:[
        {name:"Series One", text:"Short description of the series.", tags:["Street","Film"]},
        {name:"Series Two", text:"Short description of the series.", tags:["Portrait"]}]}
  ],
  story: [
    {date:"Oct 2026 — Now", title:"Independent freelancer", org:"Working for myself, remote-first",
     points:["Placeholder point about what you do now.","Another placeholder point."]},
    {date:"Jul 2026 — Sep 2026", title:"Job title", org:"Company name",
     points:["What you did there.","What you achieved."]},
    {date:"Jan 2026 — Jun 2026", title:"Job title", org:"Company name, City",
     points:["What you did there.","What you achieved."]},
    {date:"Jan 2025 — May 2025", title:"Intern title", org:"Company name · Remote",
     points:["What you did there.","What you achieved."]},
    {date:"Jul 2022 — May 2026", title:"Your degree", org:"Your university",
     points:["A line about your studies.","A line about graduating."]}
  ]
};

/* =========================================================
   APP CODE  (no need to edit below)
   ========================================================= */
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];

/* Theme: saved choice, else system preference */
const root = document.documentElement;
function setTheme(t){ root.dataset.theme=t;
  document.querySelector('meta[name=theme-color]').content = t==='dark'?'#1A1818':'#F4EEE5';
  try{localStorage.setItem('theme',t)}catch(e){} }
let saved=null; try{saved=localStorage.getItem('theme')}catch(e){}
setTheme(saved || 'dark');

/* Loader */
(function(){ let n=0; const num=$('#loadNum'), bar=$('#loadBar');
  const t=setInterval(()=>{ n=Math.min(100,n+Math.ceil(Math.random()*7));
    num.textContent=String(n).padStart(3,'0'); bar.style.width=n+'%';
    if(n>=100){clearInterval(t); setTimeout(()=>$('#loader').classList.add('done'),300)} },40); })();

/* Live clock */
function tick(){ const d=new Date();
  const time=d.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit',timeZone:CONFIG.timeZone}).toLowerCase().replace(' ','');
  const date=d.toLocaleDateString('en-GB',{day:'numeric',month:'short',timeZone:CONFIG.timeZone});
  $('#headClock').textContent=`Local time ${time} • ${date}`; $$('.liveTime').forEach(e=>e.textContent=time); }
tick(); setInterval(tick,15000);
$('#yr').textContent=new Date().getFullYear();

/* Header + back-to-top */
addEventListener('scroll',()=>{ $('#header').classList.toggle('scrolled',scrollY>30); $('#toTop').classList.toggle('show',scrollY>800); },{passive:true});
$('#toTop').onclick=()=>scrollTo({top:0,behavior:'smooth'});

/* Menu */
const menu=$('#menu');
const openMenu=o=>{menu.classList.toggle('open',o);$('#menuBtn').setAttribute('aria-expanded',o);document.body.style.overflow=o?'hidden':''};
$('#menuBtn').onclick=()=>openMenu(true); $('#menuClose').onclick=()=>openMenu(false);
$$('[data-close]').forEach(a=>a.addEventListener('click',()=>openMenu(false)));

/* Hero rotating role */
(function(){ let i=0; const el=$('#rot'); el.textContent=CONFIG.roles[0];
  setInterval(()=>{ el.classList.add('out'); setTimeout(()=>{ i=(i+1)%CONFIG.roles.length; el.textContent=CONFIG.roles[i]; el.classList.remove('out'); },400); },2200); })();

/* Modals */
function openModal(m){ m.classList.add('open'); m.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; }
function closeModal(m){ m.classList.remove('open'); m.setAttribute('aria-hidden','true'); if(!$('#skill').classList.contains('open')) document.body.style.overflow=''; }
$$('.modal').forEach(m=>m.addEventListener('click',e=>{ if(e.target===m||e.target.closest('[data-close-modal]')) closeModal(m); }));
addEventListener('keydown',e=>{ if(e.key==='Escape'){ $$('.modal.open').forEach(closeModal); closeSkill(); openMenu(false);} });

/* Ability card: loading ring 0-100%, card drops in, tilts with pointer, tap to flip */
(function(){
  const C=CONFIG.card, stage=$('#cardStage'), holo=$('#holo'), scene=$('#cardScene');
  $('#cardInitials').textContent=C.initials; $('#cardNo').textContent='No. '+C.number; $('#cardLvl').textContent=C.level;
  $('#cardName').textContent=CONFIG.name; $('#cardRole').textContent=C.role; $('#cardHello').textContent=`Hi, I'm ${CONFIG.name}.`;
  $('#cardIntro').textContent=C.intro; $('#cardPlace').textContent=C.place;
  $('#cardAbil').innerHTML=C.abilities.map(([k,v])=>`<div><span>${k}</span><i style="--v:${v}%"></i><b>${v}</b></div>`).join('');
  $('#cardChips').innerHTML=C.chips.map(c=>`<span>${c}</span>`).join('');
  let flipped=false, rx=0, ry=0;
  const apply=()=>{ holo.style.setProperty('--rx',rx+'deg'); holo.style.setProperty('--ry',(ry+(flipped?180:0))+'deg'); };
  $('#abilityBtn').onclick=()=>{ stage.classList.remove('ready'); flipped=false; rx=ry=0; apply();
    openModal($('#abilityModal')); let n=0;
    const t=setInterval(()=>{ n=Math.min(100,n+4); $('#cardPct').textContent=n+'%'; $('#cardRing').style.setProperty('--p',n);
      if(n>=100){ clearInterval(t); setTimeout(()=>stage.classList.add('ready'),200);
        if(matchMedia('(hover:none)').matches) setTimeout(()=>photo.classList.add('color'),900); } },30); };
  const photo=$('.holo-photo');
  scene.addEventListener('pointermove',e=>{ const r=scene.getBoundingClientRect(), x=(e.clientX-r.left)/r.width, y=(e.clientY-r.top)/r.height;
    rx=(0.5-y)*20; ry=(x-0.5)*24; apply();
    photo.style.setProperty('--px',(x-.5)*2); photo.style.setProperty('--py',(y-.5)*2);
    $$('.holo .glare').forEach(g=>{g.style.setProperty('--gx',x*100+'%');g.style.setProperty('--gy',y*100+'%')});
    $$('.holo .foil').forEach(f=>{f.style.setProperty('--fx',x*100+'%');f.style.setProperty('--fy',y*100+'%')}); });
  scene.addEventListener('pointerleave',()=>{ rx=ry=0; apply(); photo.style.setProperty('--px',0); photo.style.setProperty('--py',0); });
  holo.addEventListener('click',e=>{ if(e.target.closest('[data-contact]'))return; flipped=!flipped; apply(); });
})();

/* Hero photo: black & white, colour paints in along the mouse trail and fades away.
   Each frame draws  bw x (1 - mask) + colour x mask  so soft hair edges never double up. */
(function(){
  const stage=$('#fig'), canvas=$('#figCanvas'), base=$('#figBase'), COLOUR_SRC='me-color.webp';
  if(!stage) return;
  $('#figWm').textContent=CONFIG.name;
  stage.addEventListener('click',e=>{ if(!e.target.closest('#abilityBtn')) $('#abilityBtn').click(); });
  stage.addEventListener('keydown',e=>{ if(e.target===stage&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); $('#abilityBtn').click(); } });
  const noHover=matchMedia('(hover:none), (max-width:899px)').matches, still=matchMedia('(prefers-reduced-motion:reduce)').matches;
  if(noHover||still){ canvas.remove(); return; }            // phones: black & white photo only
  const BRUSH=130, FADE=.018, dpr=Math.min(devicePixelRatio||1,2);
  const ctx=canvas.getContext('2d');
  const layer=()=>{ const c=document.createElement('canvas'); return [c,c.getContext('2d')]; };
  const [bwC,bwX]=layer(), [colC,colX]=layer(), [maskC,maskX]=layer(), [tmpC,tmpX]=layer();
  const bw=new Image(), col=new Image(); bw.src=base.currentSrc||base.src; col.src=COLOUR_SRC;
  let W=1,H=1,R=BRUSH*dpr, pts=[], last=null, idle=999, running=false, showing=false;
  function fit(x,img){ x.clearRect(0,0,W,H); if(!img.naturalWidth) return;
    const k=Math.min(W/img.naturalWidth,H/img.naturalHeight), w=img.naturalWidth*k, h=img.naturalHeight*k;
    x.drawImage(img,(W-w)/2,H-h,w,h); }                       // same as object-fit:contain, bottom aligned
  function measure(){ const r=stage.getBoundingClientRect(); W=Math.max(1,Math.round(r.width*dpr)); H=Math.max(1,Math.round(r.height*dpr));
    for(const c of [canvas,bwC,colC,maskC,tmpC]){ c.width=W; c.height=H; } R=BRUSH*dpr; fit(bwX,bw); fit(colX,col); hide(); }
  bw.onload=()=>fit(bwX,bw); col.onload=()=>fit(colX,col);
  function dab(x,y){ const g=maskX.createRadialGradient(x,y,0,x,y,R);
    g.addColorStop(0,'rgba(255,255,255,1)'); g.addColorStop(.55,'rgba(255,255,255,.8)'); g.addColorStop(1,'rgba(255,255,255,0)');
    maskX.globalCompositeOperation='source-over'; maskX.fillStyle=g; maskX.fillRect(x-R,y-R,R*2,R*2); }
  function draw(){
    ctx.globalCompositeOperation='source-over'; ctx.clearRect(0,0,W,H); ctx.drawImage(bwC,0,0);
    ctx.globalCompositeOperation='destination-out'; ctx.drawImage(maskC,0,0);
    tmpX.globalCompositeOperation='source-over'; tmpX.clearRect(0,0,W,H); tmpX.drawImage(colC,0,0);
    tmpX.globalCompositeOperation='destination-in'; tmpX.drawImage(maskC,0,0);
    ctx.globalCompositeOperation='lighter'; ctx.drawImage(tmpC,0,0); ctx.globalCompositeOperation='source-over'; }
  function show(){ if(!showing){ showing=true; draw(); base.style.visibility='hidden'; } }
  function hide(){ showing=false; base.style.visibility=''; ctx.clearRect(0,0,W,H); maskX.clearRect(0,0,W,H); }
  function frame(){
    const moving=pts.length>0; idle=moving?0:idle+1;
    if(idle>=120){ hide(); running=false; return; }
    maskX.globalCompositeOperation='destination-out';
    maskX.fillStyle=`rgba(0,0,0,${moving?FADE:Math.min(FADE+idle*.004,.5)})`; maskX.fillRect(0,0,W,H);
    pts.forEach(p=>dab(p.x,p.y)); pts.length=0;
    draw(); show(); requestAnimationFrame(frame); }
  stage.addEventListener('pointermove',e=>{
    const r=stage.getBoundingClientRect(), x=(e.clientX-r.left)*dpr, y=(e.clientY-r.top)*dpr;
    if(last){ const d=Math.hypot(x-last.x,y-last.y), n=Math.max(1,Math.ceil(d/(R*.25)));   // fill gaps on fast moves
      for(let i=1;i<=n;i++) pts.push({x:last.x+(x-last.x)*i/n, y:last.y+(y-last.y)*i/n}); } else pts.push({x,y});
    last={x,y}; if(!running){ running=true; idle=0; requestAnimationFrame(frame); } },{passive:true});
  stage.addEventListener('pointerleave',()=>{ last=null; });
  new ResizeObserver(measure).observe(stage); measure();
})();

/* Contact: opens the email app with a pre-filled message */
$('#mailLink').textContent=CONFIG.email; $('#mailLink').href='mailto:'+CONFIG.email;
document.addEventListener('click',e=>{ if(e.target.closest('[data-contact]')){ e.preventDefault(); $('#contactBox').classList.remove('sent'); openModal($('#contactModal')); }});
$('#contactForm').onsubmit=e=>{ e.preventDefault(); const f=new FormData(e.target);
  if(f.get('company')) return; // spam trap
  const body=`Hi,\n\n${f.get('project')}\n\n— ${f.get('name')} (${f.get('email')})`;
  location.href=`mailto:${CONFIG.email}?subject=${encodeURIComponent('New project from '+f.get('name'))}&body=${encodeURIComponent(body)}`;
  $('#contactBox').classList.add('sent'); e.target.reset(); };

/* Doors */
const wall=$('#wall');
CONFIG.skills.forEach((s,i)=>{
  wall.insertAdjacentHTML('beforeend',`<button class="door-frame" data-skill="${s.id}" aria-label="Open ${s.title}">
    <div class="door-room"><p>${s.room}</p></div>
    <div class="door"><span class="num mono">0${i+1}</span><h3>${s.title}</h3></div></button>`);
  $('#footWork').insertAdjacentHTML('beforeend',`<li><a href="#" data-skill="${s.id}">${s.menu}</a></li>`);
});
/* Pinned horizontal scroll: page scroll moves the wall, doors open near the centre */
const doorsPin=$('#doorsPin'), frames=$$('.door-frame');
function sizeDoors(){ const extra=Math.max(0,wall.scrollWidth-innerWidth); doorsPin.style.height=(innerHeight+extra)+'px'; doorsUpdate(); }
function doorsUpdate(){
  const extra=Math.max(0,wall.scrollWidth-innerWidth), top=doorsPin.getBoundingClientRect().top;
  const p=Math.min(1,Math.max(0,-top/Math.max(1,doorsPin.offsetHeight-innerHeight)));
  wall.style.transform=`translateX(${-p*extra}px)`; $('#wallBar').style.width=(p*100)+'%';
  const pinned=top<=1 && top+doorsPin.offsetHeight>=innerHeight-1; $('#toTop').style.visibility=pinned?'hidden':'';
  const mid=innerWidth/2; let best=0,bd=1e9;
  frames.forEach((f,i)=>{ const r=f.getBoundingClientRect(), d=Math.abs(r.left+r.width/2-mid);
    f.style.setProperty('--open',Math.max(0,1-d/(r.width*0.9)).toFixed(3)); if(d<bd){bd=d;best=i;} });
  $('#doorCount').textContent=`0${best+1} / 0${frames.length}`; return p; }
function scrollToDoor(dir){ const pinTop=doorsPin.offsetTop, range=doorsPin.offsetHeight-innerHeight, step=range/Math.max(1,frames.length-1);
  const cur=scrollY-pinTop; const target=Math.round(Math.min(range,Math.max(0,(Math.round(cur/step)+dir)*step)));
  scrollTo({top:pinTop+target,behavior:'smooth'}); }
$('#wallNext').onclick=()=>scrollToDoor(1); $('#wallPrev').onclick=()=>scrollToDoor(-1);

/* Skill overlay (what's behind each door) */
function openSkill(id){ const i=CONFIG.skills.findIndex(s=>s.id===id), s=CONFIG.skills[i]; if(!s)return;
  $('#skillNum').textContent=`0${i+1} / 0${CONFIG.skills.length}`; $('#skillEyebrow').textContent=s.menu;
  $('#skillTitle').innerHTML=`${s.title.split(' ')[0]} <em>${s.title.split(' ').slice(1).join(' ')}</em>`;
  $('#skillDesc').textContent=s.desc;
  const tags=['All',...new Set(s.projects.flatMap(p=>p.tags))];
  const render=f=>{ $('#projects').innerHTML=s.projects.filter(p=>f==='All'||p.tags.includes(f)).map(p=>`
      <article class="proj"><div class="thumb mono">Project image</div><div class="body"><h4>${p.name}</h4><p>${p.text}</p>
      <div class="tags">${p.tags.map(t=>`<span>${t}</span>`).join('')}</div></div></article>`).join(''); };
  $('#filters').innerHTML=tags.map((t,k)=>`<button class="${k?'':'on'}">${t}</button>`).join('');
  $$('#filters button').forEach(b=>b.onclick=()=>{ $$('#filters button').forEach(x=>x.classList.remove('on')); b.classList.add('on'); render(b.textContent); });
  render('All'); $('#skill').scrollTop=0; $('#skill').classList.add('open'); document.body.style.overflow='hidden'; }
function closeSkill(){ $('#skill').classList.remove('open'); document.body.style.overflow=''; }
$('#skillBack').onclick=closeSkill;
document.addEventListener('click',e=>{ const t=e.target.closest('[data-skill]'); if(!t)return; e.preventDefault();
  if(t.classList.contains('door-frame')){ t.classList.add('opening'); setTimeout(()=>{openSkill(t.dataset.skill); t.classList.remove('opening');},700); }
  else setTimeout(()=>openSkill(t.dataset.skill),400); });

/* Cursor label over doors */
const cur=$('#cursor');
addEventListener('pointermove',e=>{ cur.style.left=e.clientX+'px'; cur.style.top=e.clientY+'px';
  cur.classList.toggle('show',!!e.target.closest('.door-frame')); });

/* Story: pinned, one card per scroll step, year odometer rolls back in time */
const storyPin=$('#storyPin'), tc=$('#tcards'), N=CONFIG.story.length;
$('#storyTotal').textContent=N;
CONFIG.story.forEach((s,i)=>tc.insertAdjacentHTML('beforeend',`<article class="tcard" data-pos="${i?'next':'now'}"><span class="mono when">${s.date}</span>
  <h3>${s.title}</h3><div class="org">${s.org}</div><ul>${s.points.map(p=>`<li>${p}</li>`).join('')}</ul><span class="idx">0${i+1}</span></article>`));
$('#steps').innerHTML=CONFIG.story.map((_,i)=>`<button aria-label="Go to step ${i+1}"></button>`).join('');
const odo=$('#odo'); odo.innerHTML=[0,1,2,3].map(()=>`<div class="digit">${'0123456789'.split('').map(n=>`<span>${n}</span>`).join('')}</div>`).join('');
const yearOf=d=>(d.match(/\d{4}/)||['0000'])[0];
function setYear(y){ [...odo.children].forEach((d,k)=>d.style.transform=`translateY(-${y[k]}em)`); }
let storyIdx=-1;
function storySet(i){ if(i===storyIdx)return; storyIdx=i;
  [...tc.children].forEach((c,k)=>c.dataset.pos=k<i?'past':k===i?'now':k===i+1?'next':'later');
  $$('#steps button').forEach((b,k)=>b.classList.toggle('on',k<=i));
  $('#storyNum').textContent=String(i+1).padStart(2,'0'); $('#storyDate').textContent=CONFIG.story[i].date;
  setYear(yearOf(CONFIG.story[i].date.split('—').pop().includes('Now')?String(new Date().getFullYear()):CONFIG.story[i].date)); }
function sizeStory(){ storyPin.style.height=(innerHeight*(N*0.75+0.5))+'px'; storyUpdate(); }
function storyUpdate(){ const top=storyPin.getBoundingClientRect().top, range=storyPin.offsetHeight-innerHeight;
  const p=Math.min(.9999,Math.max(0,-top/Math.max(1,range))); storySet(Math.floor(p*N)); }
$$('#steps button').forEach((b,k)=>b.onclick=()=>scrollTo({top:storyPin.offsetTop+(storyPin.offsetHeight-innerHeight)*(k+.5)/N,behavior:'smooth'}));

/* One scroll loop for both pinned sections */
let ticking=false;
addEventListener('scroll',()=>{ if(ticking)return; ticking=true; requestAnimationFrame(()=>{ doorsUpdate(); storyUpdate(); ticking=false; }); },{passive:true});
addEventListener('resize',()=>{ sizeDoors(); sizeStory(); });
sizeDoors(); sizeStory();
document.fonts && document.fonts.ready.then(()=>{ sizeDoors(); sizeStory(); });

/* Scroll reveal */
const revObs=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){e.target.classList.add('in');revObs.unobserve(e.target);} }),{threshold:.15});
$$('.reveal').forEach(el=>revObs.observe(el));

/* =========================================================
   PULL-CORD THEME SWITCH
   Uses your setTheme() if it exists, otherwise switches
   <html data-theme="dark|light"> and saves it by itself.
   ========================================================= */
(function(){
  const cord = document.getElementById('pullcord');
  if(!cord) return;
  const rope = cord.querySelector('.pc-rope');
  const handle = cord.querySelector('.pc-handle');
  const html = document.documentElement;
  const PULL_TO_TOGGLE = 45;   // px of pull needed to switch
  const MAX_PULL = 120;        // furthest the rope stretches
  const SOUND = true;          // little "click" when it switches

  function currentTheme(){ return html.dataset.theme === 'light' ? 'light' : 'dark'; }
  function applyTheme(t){
    if(typeof window.setTheme === 'function'){ window.setTheme(t); }
    else{ html.dataset.theme = t; try{ localStorage.setItem('theme', t); }catch(e){} }
    handle.setAttribute('aria-checked', t === 'dark');
  }
  function toggle(){ applyTheme(currentTheme() === 'dark' ? 'light' : 'dark'); click(); }
  handle.setAttribute('aria-checked', currentTheme() === 'dark');

  let ctx;
  function click(){
    if(!SOUND) return;
    try{
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime;
      o.type = 'square'; o.frequency.setValueAtTime(1800, t); o.frequency.exponentialRampToValueAtTime(600, t + .03);
      g.gain.setValueAtTime(.06, t); g.gain.exponentialRampToValueAtTime(.0001, t + .05);
      o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + .06);
    }catch(e){}
  }

  /* --- tiny spring physics: y = extra rope length, a = swing angle --- */
  let y = 0, vy = 0, a = 0, va = 0, dragging = false, raf = 0, last = 0;
  function render(){
    rope.style.height = `calc(var(--cord-len) + ${y.toFixed(2)}px)`;
    cord.style.transform = `rotate(${a.toFixed(3)}deg)`;
  }
  function step(now){
    const dt = Math.min(.032, (now - last) / 1000 || .016); last = now;
    if(!dragging){
      vy += (-420 * y - 14 * vy) * dt;  y += vy * dt;    // springy rope
      va += (-60 * a - 2.2 * va) * dt;  a += va * dt;    // damped pendulum
      if(y < 0){ y = 0; vy *= -.3; }
    }
    render();
    if(dragging || Math.abs(y) > .05 || Math.abs(vy) > .5 || Math.abs(a) > .02 || Math.abs(va) > .05){
      raf = requestAnimationFrame(step);
    }else{ y = a = vy = va = 0; render(); raf = 0; }
  }
  function kick(){ if(!raf){ last = performance.now(); raf = requestAnimationFrame(step); } }

  let sx = 0, sy = 0, moved = false, lastA = 0, lastT = 0;
  handle.addEventListener('pointerdown', e => {
    dragging = true; moved = false; sx = e.clientX; sy = e.clientY;
    handle.setPointerCapture(e.pointerId); cord.classList.remove('show-hint'); kick();
  });
  handle.addEventListener('pointermove', e => {
    if(!dragging) return;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    if(Math.abs(dx) + Math.abs(dy) > 6) moved = true;
    const pull = Math.max(0, dy);
    y = MAX_PULL * (1 - Math.exp(-pull / MAX_PULL));        // gets harder the further you pull
    const len = rope.offsetHeight + 40;
    const na = Math.max(-35, Math.min(35, -Math.atan2(dx, len) * 180 / Math.PI));
    const now = performance.now();
    va = (na - lastA) / Math.max(.008, (now - lastT) / 1000) * .3; lastA = a = na; lastT = now;
  });
  function release(){
    if(!dragging) return;
    dragging = false;
    if(!moved){ vy = 650; toggle(); }        // a plain tap: quick tug
    else if(y >= PULL_TO_TOGGLE * .8){ toggle(); vy = -40; }
    kick();
  }
  handle.addEventListener('pointerup', release);
  handle.addEventListener('pointercancel', release);
  handle.addEventListener('keydown', e => {
    if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); vy = 650; toggle(); kick(); }
  });

  /* gentle sway on load so people notice it */
  setTimeout(() => { va = 40; kick(); cord.classList.add('show-hint');
    setTimeout(() => cord.classList.remove('show-hint'), 4000); }, 1200);
})();
