/* Book courses — shared lesson engine (one engine, one course-data.js per book).
   A lesson page calls Course.lesson({...}). The engine adds the cover and results
   screens, the top bar, the feedback dock, scoring, saving and autoplay testing. */
(function(){
'use strict';

/* ---------- course data ----------
   Each course folder has a course-data.js that calls Course.register({...}) right after this file loads:
   { slug, book, author, prefix (localStorage key prefix), tag (top-bar label), castIcon, castNote,
     lessons:[{id, ch, chLabel?, file, title, part}], glossary:{key:'Term: plain definition'} } */
const ALL=[];let D=null;
function register(data){D=data;ALL.push(data);}

/* ---------- icons (24px stroke icons) ---------- */
const P={
 box:'<path d="M3 7.5 12 3l9 4.5-9 4.5-9-4.5z"/><path d="M3 7.5v9L12 21l9-4.5v-9"/><path d="M12 12v9"/>',
 people:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7"/><path d="M18 14.8c1.9.7 3.2 2.4 3.6 5.2"/>',
 person:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4.4 4.2-6.5 8-6.5s7 2.1 8 6.5"/>',
 trend:'<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
 target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 pointer:'<path d="M6 3l12 7-5.5 1.5L10 17z"/><path d="M12.5 11.5 18 18"/>',
 check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
 x:'<path d="M6 6l12 12M18 6 6 18"/>',
 flame:'<path d="M12 3c.8 3 4.5 5 4.5 9.5a4.5 4.5 0 0 1-9 0c0-2.2 1.2-3.5 2.2-4.3.1 1.8.9 3 2.1 3.3-.3-3.3.2-5.6.2-8.5z"/>',
 star:'<path d="M12 3.2l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.6l-5.2 2.8 1-5.9-4.3-4.1 5.9-.8z"/>',
 bulb:'<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2h5c0-.9.4-1.6 1.1-2.2A6 6 0 0 0 12 3z"/>',
 book:'<path d="M4 19.5V5a2 2 0 0 1 2-2h14v15H6a2 2 0 0 0-2 2 2 2 0 0 0 2 2h14"/>',
 cal:'<rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M3 10h18M8 3v4M16 3v4"/>',
 alert:'<path d="M12 4 21 20H3z"/><path d="M12 10v4.5M12 17.2v.3"/>',
 leaf:'<path d="M5 20c0-9 6-15 15-15 0 9-6 15-15 15z"/><path d="M5 20 14 11"/>',
 bowl:'<path d="M3 11h18a9 9 0 0 1-18 0z"/><path d="M9 7c0-1.5 1-2 1-3.5M13 7c0-1.5 1-2 1-3.5"/>',
 map:'<path d="M9 4 3 6.5v13.5l6-2.5 6 2.5 6-2.5V4l-6 2.5z"/><path d="M9 4v13.5M15 6.5V20"/>',
 shield:'<path d="M12 3 4.5 6v5.5c0 4.5 3.2 8.2 7.5 9.5 4.3-1.3 7.5-5 7.5-9.5V6z"/><path d="M9 12l2 2 4-4"/>',
 arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
 down:'<path d="M12 5v14M6 13l6 6 6-6"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.8v.4"/>',
 play:'<path d="M7 5v14l11-7z"/>',
 cycle:'<path d="M20 12a8 8 0 1 1-2.3-5.6"/><path d="M20 4v5h-5"/>',
 lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
 tree:'<circle cx="12" cy="4.5" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="12" r="2"/><circle cx="4" cy="19.5" r="1.6"/><circle cx="9" cy="19.5" r="1.6"/><circle cx="18" cy="19.5" r="1.6"/><path d="M11 6.2 7 10.3M13 6.2l4 4.1M5.5 13.8 4.4 18M6.6 13.8 8.5 18M18 14v3.9"/>',
 chat:'<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9.5h8M8 12.5h5"/>',
 flask:'<path d="M9 3h6M10 3v6l-5.5 9.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3"/><path d="M7.5 15h9"/>',
 scale:'<path d="M12 4v16M7 20h10M5 7h14"/><path d="M5 7l-2.5 6a2.5 2.5 0 0 0 5 0zM19 7l-2.5 6a2.5 2.5 0 0 0 5 0z"/>',
 pencil:'<path d="M4 20l1-4L16 5l3 3L8 19z"/><path d="M14 7l3 3"/>',
 eye:'<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
 layers:'<path d="M12 3 2 8l10 5 10-5z"/><path d="M2 13l10 5 10-5"/>',
 compass:'<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5 13.5 13.5 8.5 15.5 10.5 10.5z"/>',
 home:'<path d="M4 11 12 4l8 7v9H4z"/><path d="M10 20v-5h4v5"/>',
 list:'<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>'
};
const ic=(n,cls)=>'<svg class="i'+(cls?' '+cls:'')+'" viewBox="0 0 24 24" aria-hidden="true">'+(P[n]||P.info)+'</svg>';
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const store={get(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};

/* ---------- installable app + offline (manifest.webmanifest, sw.js at the site root) ---------- */
(function(){
  if(location.protocol==='file:')return; // opened from a downloaded copy: no install, files are already local
  const base=new URL('../',document.currentScript.src);
  const add=(rel,href,extra)=>{if(document.querySelector('link[rel="'+rel+'"]'))return;const l=document.createElement('link');l.rel=rel;l.href=new URL(href,base).href;Object.assign(l,extra||{});document.head.appendChild(l);};
  add('manifest','manifest.webmanifest');
  add('apple-touch-icon','assets/icons/icon-180.png');
  add('icon','assets/icons/icon.svg',{type:'image/svg+xml'});
  if(!document.querySelector('meta[name="theme-color"]'))document.head.insertAdjacentHTML('beforeend','<meta name="theme-color" content="#5046e5"><meta name="apple-mobile-web-app-title" content="Learn FWD">');
  if('serviceWorker' in navigator&&window.isSecureContext)navigator.serviceWorker.register(new URL('sw.js',base).href,{scope:base.href}).catch(()=>{});
})();

/* ---------- shell markup ---------- */
const SHELL='<div class="top"><div class="top-in"><div class="toprow"><a href="index.html" class="stat" title="Course home" aria-label="Course home" style="color:var(--muted)">'+ic('home')+'</a><div class="track" aria-hidden="true"><div id="track"></div></div>'+
 '<span class="stat streak" id="streak" hidden title="Correct answers in a row"></span><span class="stat pts" id="ptswrap" title="Points">'+ic('star')+'<span id="pts">0</span></span></div><div class="secrow" id="secrow"></div></div></div>'+
 '<div class="wrap"><main class="card" id="card" aria-live="polite"></main></div>'+
 '<footer class="dock" id="dock"><div class="dock-in"><div class="fbx" id="fbx" hidden><div class="fic" id="fic"></div><div><div class="ft" id="ftitle"></div><div class="fx" id="ftext"></div></div></div>'+
 '<span class="src" id="src"></span><span class="err" id="err" role="alert"></span><button class="go" id="go">Continue</button></div></footer>';
const PART_COLORS=['h1','h2','h3','h4'];
const PILL={learn:['learn','Learn','bulb'],ex:['ex','Example','book'],try:['try','Try it','target'],pr:['pr','Practice','flame']};
const OKT=['Correct!','Nice work!','Spot on!','Exactly!','You got it!'];

/* ======================================================================= */
function lesson(cfg){
  document.body.insertAdjacentHTML('afterbegin',SHELL);
  const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
  const card=$('#card'),dock=$('#dock');
  if(!D)throw new Error('course-data.js did not call Course.register()');
  Course.current=cfg;
  const COURSE=D.lessons;
  const meta=COURSE.find(c=>c.id===cfg.id)||{ch:cfg.chapter,title:cfg.title};
  const next=COURSE[COURSE.indexOf(meta)+1];
  const G=Object.assign({},D.glossary||{},cfg.glossary||{});
  const parts=cfg.parts;
  const user=cfg.steps;
  const MAX=user.reduce((a,s)=>a+(s.pts||0),0);
  let i=0,ready=false,score=0,streak=0,answered=0,correctN=0,override=null,solvers=[];

  /* ---- api handed to every step ---- */
  const L={card,$,$$,ic,esc,sleep};
  L.g=(k,txt)=>{if(!G[k])console.warn('glossary key missing:',k);return '<span class="g" tabindex="0" data-def="'+esc(G[k]||txt)+'">'+txt+'</span>';};
  L.kick=(type,txt)=>'<p class="kick"><span class="pill '+PILL[type][0]+'">'+ic(PILL[type][2])+PILL[type][1]+'</span>'+(txt||'')+'</p>';
  L.h=html=>{card.innerHTML=html;};
  L.done=()=>{ready=true;$('#err').textContent='';$('#go').classList.remove('wait');};
  L.fb=(el,txt,kind)=>{const d=document.createElement('div');d.className='fb '+(kind||'info');d.innerHTML=txt;el.appendChild(d);return d;};
  L.solver=fn=>{solvers.push(fn);};
  L.err=t=>{$('#err').textContent=t;};
  function plus(n){const s=document.createElement('span');s.className='plus';s.textContent='+'+n;$('#ptswrap').appendChild(s);setTimeout(()=>s.remove(),950);}
  function drawStats(){$('#pts').textContent=score;const st=$('#streak');st.hidden=streak<2;st.innerHTML=ic('flame')+streak;}
  L.award=(ok,n)=>{answered+=1;if(ok){correctN+=1;streak++;score+=n||1;plus(n||1);}else streak=0;drawStats();};
  L.awardMany=(n,total)=>{answered+=total;correctN+=n;score+=n;if(n)plus(n);streak=n===total?streak+n:0;drawStats();};
  L.sheet=(kind,title,html,act)=>{
    dock.className='dock '+kind;$('#fbx').hidden=false;
    $('#fic').innerHTML=ic(kind==='ok'?'check':kind==='no'?'x':'info');
    $('#ftitle').textContent=title;$('#ftext').innerHTML=html||'';
    override=act||null;$('#go').textContent=act?act.label:(i===steps.length-1?'Start again':'Continue');
    $('#go').focus({preventScroll:true});
  };
  function clearSheet(){dock.className='dock';$('#fbx').hidden=true;override=null;$('#go').textContent=i===0?'Start lesson':i===steps.length-1?'Start again':'Continue';}
  L.clearSheet=clearSheet;
  L.shake=el=>{el.classList.remove('shake');void el.offsetWidth;el.classList.add('shake');};

  /* ---- teaching helpers: return HTML ---- */
  L.prose=t=>'<p class="prose">'+t+'</p>';
  L.quote=(t,cite)=>'<blockquote>“'+t+'”<cite>'+cite+'</cite></blockquote>';
  L.note=(t,icon)=>'<div class="fb info" style="display:flex;gap:10px;align-items:flex-start">'+ic(icon||'info')+'<div>'+t+'</div></div>';
  /* items: [icon, label, text, small] ; colors cycle c1..c4 unless item[4] given (1-4) */
  L.flow=(items,arrows)=>'<div class="flow">'+items.map((it,j)=>(j&&arrows!==false?'<div class="ar">'+ic('arrow')+'</div>':'')+'<div class="box c'+(it[4]||((j%4)+1))+'"><div class="ico">'+ic(it[0])+'</div><b>'+it[1]+'</b>'+it[2]+(it[3]?'<small>'+it[3]+'</small>':'')+'</div>').join('')+'</div>';
  /* items: [title, text] or [icon, title, text]; color 1-4 */
  L.list=(items,color)=>{const c=PART_COLORS[(color||1)-1];return '<ul class="list">'+items.map((it,j)=>{const hasIcon=it.length===3;return '<li><span class="num" style="background:var(--'+c+'-bg);color:var(--'+c+')">'+(hasIcon?ic(it[0]):(j+1))+'</span><div><b>'+(hasIcon?it[1]:it[0])+'</b>'+(hasIcon?it[2]:it[1])+'</div></li>';}).join('')+'</ul>';};
  /* tiers: [icon, title, text, small, highlight(bool), badge] */
  L.tiers=items=>items.map((t,j)=>{const c=PART_COLORS[j%4];return '<div class="tier'+(t[4]?' star':'')+'"><div class="ico" style="background:'+(t[4]?'var(--card)':'var(--'+c+'-bg)')+';color:var(--'+(t[4]?'h2':c)+')">'+ic(t[0])+'</div><div class="d"><div class="tag">'+t[1]+(t[5]?' <span class="badge">'+t[5]+'</span>':'')+'</div>'+t[2]+(t[3]?'<small>'+t[3]+'</small>':'')+'</div></div>';}).join('');
  /* lanes: [icon, title, html, color 1-4] */
  L.lanes=items=>'<div class="two">'+items.map(l=>'<div class="lane"><div class="lh" style="color:var(--'+PART_COLORS[(l[3]||1)-1]+')">'+ic(l[0])+l[1]+'</div>'+l[2]+'</div>').join('')+'</div>';

  /* ---- interactive widgets (each registers a solver for autoplay) ---- */
  function optButtons(box,opts,onPick){opts.forEach((o,j)=>{const b=document.createElement('button');b.className='opt';b.innerHTML='<span class="key">'+(j+1)+'</span><span>'+esc(o)+'</span>';b.onclick=()=>onPick(j,b);box.appendChild(b);});}
  /* one question, several options. pts: 1 */
  L.mc=(host,opts,right,good,bad)=>{
    let a=false;const box=document.createElement('div');box.className='opts';host.appendChild(box);
    optButtons(box,opts,(j,b)=>{if(a)return;a=true;const ok=j===right;
      [...box.children].forEach((x,k)=>{x.setAttribute('aria-disabled','true');if(k!==j&&k!==right)x.classList.add('dim');});
      b.classList.add(ok?'ok':'no',ok?'pop':'shake');if(!ok)box.children[right].classList.add('ok');
      L.award(ok);L.sheet(ok?'ok':'no',ok?OKT[answered%OKT.length]:'Not quite',ok?good:(bad||good));L.done();});
    L.solver(()=>box.children[right].click());
  };
  /* several items, one at a time, same choices. items: [text, rightIndex, why]. pts: items.length */
  L.quick=(host,title,choices,items)=>{
    let k=0;
    const show=()=>{clearSheet();host.innerHTML=L.kick('pr',title+' · '+(k+1)+' of '+items.length)+'<h1 class="q">'+items[k][0]+'</h1>';
      const box=document.createElement('div');box.className='opts';host.appendChild(box);let a=false;
      optButtons(box,choices,(j,b)=>{if(a)return;a=true;const r=items[k][1],ok=j===r;
        [...box.children].forEach((x,q)=>{x.setAttribute('aria-disabled','true');if(q!==j&&q!==r)x.classList.add('dim');});
        b.classList.add(ok?'ok':'no',ok?'pop':'shake');if(!ok)box.children[r].classList.add('ok');L.award(ok);
        const last=k===items.length-1;
        L.sheet(ok?'ok':'no',ok?OKT[answered%OKT.length]:'It’s “'+choices[r]+'”',items[k][2]+(last?' <b>Round complete.</b>':''),last?null:{label:'Next item',fn:()=>{k++;show();}});
        if(last)L.done();});};
    show();
    L.solver(async()=>{for(let n=0;n<items.length;n++){$$('.opts')[$$('.opts').length-1].children[items[k][1]].click();await sleep(5);if(override)$('#go').click();await sleep(5);}});
  };
  /* sort a list into buckets. items: [text, rightIndex, why]. pts: items.length */
  L.buckets=(host,choices,items,summary)=>{
    const pick=items.map(()=>null);const rows=document.createElement('div');host.appendChild(rows);let checked=false;
    items.forEach((it,r)=>{const row=document.createElement('div');row.className='row';row.innerHTML='<div class="t">'+it[0]+'</div>';
      choices.forEach((c,j)=>{const b=document.createElement('button');b.className='chip';b.textContent=c;
        b.onclick=()=>{if(checked)return;pick[r]=j;[...row.querySelectorAll('.chip')].forEach(x=>x.classList.remove('sel'));b.classList.add('sel');$('#err').textContent='';};row.appendChild(b);});
      const w=document.createElement('p');w.className='why';row.appendChild(w);rows.appendChild(row);});
    const c=document.createElement('button');c.className='btn pri';c.style.marginTop='16px';c.innerHTML=ic('check')+'Check answers';host.appendChild(c);
    c.onclick=()=>{if(checked)return;if(pick.includes(null)){L.err('Sort every item first');return;}
      checked=true;let n=0;[...rows.children].forEach((row,r)=>{const ok=pick[r]===items[r][1];if(ok)n++;
        const chips=row.querySelectorAll('.chip');chips[pick[r]].classList.remove('sel');chips[pick[r]].classList.add(ok?'ok':'no');if(!ok)chips[items[r][1]].classList.add('ok');
        const w=row.querySelector('.why');w.style.color=ok?'var(--ok)':'var(--no)';w.textContent=items[r][2];});
      L.awardMany(n,items.length);c.remove();L.sheet(n===items.length?'ok':'info',n+' of '+items.length+' right',summary);L.done();};
    L.solver(()=>{[...rows.children].forEach((row,r)=>row.querySelectorAll('.chip')[items[r][1]].click());c.click();});
  };
  /* story or worked example revealed beat by beat. list: [label, html]. pts: 0 */
  L.beats=(host,list,takeaway)=>{
    let k=0;const box=document.createElement('div');host.appendChild(box);
    const b=document.createElement('button');b.className='btn pri';host.appendChild(b);
    const step=()=>{const d=document.createElement('div');d.className='beat';
      d.innerHTML='<div class="dot"><span>'+(k+1)+'</span>'+(k<list.length-1?'<i></i>':'')+'</div><div class="tx">'+(list[k][0]?'<span class="n">'+list[k][0]+'</span>':'')+list[k][1]+'</div>';box.appendChild(d);k++;
      if(k<list.length){b.innerHTML='Next step <span style="opacity:.6;font-weight:500">'+(k+1)+'/'+list.length+'</span>'+ic('down');}
      else{b.remove();if(takeaway)L.sheet('info','The takeaway',takeaway);L.done();}};
    b.onclick=step;step();
    L.solver(()=>{while(b.isConnected)b.click();});
  };
  /* flip cards to reveal. cards: [title, body]. pts: 0 */
  L.flips=(host,cards,after)=>{
    const grid=document.createElement('div');grid.className='flips';host.appendChild(grid);const seen=new Set();
    cards.forEach((c,j)=>{const b=document.createElement('button');b.className='flip';b.innerHTML='<b>'+c[0]+'</b><span class="small">Tap to reveal</span>';
      b.onclick=()=>{b.classList.add('open');b.innerHTML='<b>'+c[0]+'</b><span style="font-size:14.5px;line-height:1.5;display:block">'+c[1]+'</span>';seen.add(j);if(seen.size===cards.length&&!ready){if(after)L.sheet('info','Got them all',after);L.done();}};grid.appendChild(b);});
    L.solver(()=>[...grid.children].forEach(b=>b.click()));
  };
  /* tap items in the right order. items: in CORRECT order (shown shuffled). pts: 1 (only if no mistakes) */
  L.order=(host,items,okHtml,slotLabels)=>{
    let n=0,miss=0;const slots=document.createElement('div');slots.className='slots';host.appendChild(slots);
    items.forEach((_,j)=>{const s=document.createElement('div');s.className='slot';s.innerHTML='<span class="sn">'+(j+1)+'</span><span class="small">'+(slotLabels?slotLabels[j]:'')+'</span>';slots.appendChild(s);});
    const pool=document.createElement('div');host.appendChild(pool);const msg=document.createElement('div');host.appendChild(msg);
    const idx=items.map((_,j)=>j);for(let j=idx.length-1;j>0;j--){const r=(j*7+3)%(j+1);[idx[j],idx[r]]=[idx[r],idx[j]];}
    if(idx.every((v,j)=>v===j))idx.reverse();
    idx.forEach(j=>{const b=document.createElement('button');b.className='chip';b.dataset.k=j;b.textContent=items[j];
      b.onclick=()=>{if(ready)return;if(j!==n){miss++;msg.innerHTML='';L.fb(msg,'Not that one yet. What has to come before it?','no');L.shake(b);return;}
        msg.innerHTML='';const s=slots.children[n];s.classList.add('filled');s.innerHTML='<span class="sn">'+(n+1)+'</span><span>'+esc(items[j])+'</span>';b.remove();n++;
        if(n===items.length){L.award(miss===0);L.sheet(miss===0?'ok':'info',miss===0?'Perfect order!':'All in place',okHtml);L.done();}};pool.appendChild(b);});
    L.solver(async()=>{for(let j=0;j<items.length;j++){const b=pool.querySelector('[data-k="'+j+'"]');if(b)b.click();await sleep(2);}});
  };
  /* build a sentence by cycling chips. slots: [[options...]], right: [index per slot],
     why: [[message per WRONG option, in option order skipping the right one]]. pts: 1 (first try only) */
  L.sentence=(host,slots,right,why,okHtml)=>{
    const s=slots.map((o,j)=>right[j]===0?1%o.length:0);let tries=0;
    const wrap=document.createElement('div');wrap.style.cssText='background:var(--soft);border-radius:18px;padding:14px 16px';
    const bs=document.createElement('div');bs.className='sentence';wrap.appendChild(bs);host.appendChild(wrap);
    const chk=document.createElement('button');chk.className='btn pri';chk.style.marginTop='14px';chk.innerHTML=ic('check')+'Check';host.appendChild(chk);
    const out=document.createElement('div');host.appendChild(out);
    const draw=()=>{bs.innerHTML='';slots.forEach((p,j)=>{const b=document.createElement('button');b.className='chip sel';b.innerHTML=esc(p[s[j]])+' '+ic('cycle');b.onclick=()=>{if(ready)return;s[j]=(s[j]+1)%p.length;out.innerHTML='';draw();};bs.appendChild(b);});};draw();
    chk.onclick=()=>{if(ready)return;tries++;out.innerHTML='';const w=s.findIndex((x,j)=>x!==right[j]);
      if(w<0){if(tries===1)L.award(true);L.sheet('ok',tries===1?'First try!':'Got it!',okHtml);L.done();}
      else{if(tries===1){answered++;streak=0;drawStats();}const wi=slots[w].map((_,x)=>x).filter(x=>x!==right[w]).indexOf(s[w]);L.fb(out,'<b>Piece '+(w+1)+' needs work.</b> '+((why[w]||[])[wi]||'Try another option.'),'no');L.shake(bs);}};
    L.solver(()=>{right.forEach((r,j)=>s[j]=r);draw();chk.click();});
  };

  /* ---- built-in cover and results ---- */
  const cover={part:-1,src:'',pts:0,run(){
    L.h('<div class="cover"><div class="hero">'+ic(cfg.icon||'target')+'</div><div class="eyebrow">'+esc(D.book)+' · '+esc(meta.chLabel||'Chapter '+meta.ch)+'</div><h1>'+esc(cfg.title)+'</h1>'+
     '<div class="meta"><span>'+ic('clock')+'About '+cfg.minutes+' minutes</span><span>'+ic('star')+MAX+' points</span><span>'+ic('map')+parts.length+' parts</span></div>'+
     '<div class="goals"><p>By the end you can</p><ul>'+cfg.goals.map(x=>'<li>'+ic('check')+'<span>'+x+'</span></li>').join('')+'</ul></div>'+
     '<div class="cast"><div class="ico">'+ic(D.castIcon||'star')+'</div><div>'+(cfg.castNote||D.castNote||'')+'</div></div>'+
     '<div class="legend"><span class="pill learn">'+ic('bulb')+'Learn</span><span class="pill ex">'+ic('book')+'Example</span><span class="pill try">'+ic('target')+'Try it</span><span class="pill pr">'+ic('flame')+'Practice</span></div>'+
     '<p class="small" style="margin:10px 0 0">Tip: press 1–5 to answer, Enter to continue.</p></div>');
    L.done();}};
  const results={part:parts.length,src:'',pts:0,run(){
    const key=D.prefix+':'+cfg.id,prev=store.get(key)||{};const best=Math.max(score,prev.best||0);const due=new Date(Date.now()+864e5*(prev.reviews?Math.min(14,[1,3,7,14][prev.reviews]||14):1));
    store.set(key,{best,max:MAX,last:score,completed:new Date().toISOString(),reviewDue:due.toISOString(),reviews:(prev.reviews||0)+(prev.completed?1:0)});
    const pct=MAX?Math.round(score/MAX*100):100,acc=answered?Math.round(correctN/answered*100):100,C=2*Math.PI*52;
    L.h('<div class="cover"><svg class="ring" width="140" height="140" viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="52" fill="none" stroke="var(--soft2)" stroke-width="10"/><circle cx="60" cy="60" r="52" fill="none" stroke="var(--ok-strong)" stroke-width="10" stroke-linecap="round" stroke-dasharray="'+C+'" stroke-dashoffset="'+C+'" transform="rotate(-90 60 60)" id="ringc" style="transition:stroke-dashoffset 1.2s cubic-bezier(.2,.8,.2,1)"/><text x="60" y="58" text-anchor="middle" font-size="26" font-weight="700" fill="currentColor" font-family="Inter,sans-serif">'+score+'</text><text x="60" y="78" text-anchor="middle" font-size="12" fill="var(--muted)" font-family="Inter,sans-serif">of '+MAX+' pts</text></svg>'+
     '<div class="eyebrow">Lesson complete</div><h1 style="font-size:28px">'+(pct>=80?'Strong work!':pct>=55?'Solid progress':'Good start')+'</h1>'+
     '<p class="small" style="margin:0">'+(pct>=80?'You’ve got this chapter.':pct>=55?'A review soon will lock it in.':'Run it again tomorrow. That’s how it sticks.')+'</p></div>'+
     '<div class="tiles"><div class="tile"><b>'+acc+'%</b><span>accuracy</span></div><div class="tile"><b>'+best+'</b><span>best score</span></div><div class="tile"><b>'+user.length+'</b><span>screens done</span></div></div>'+
     '<div class="sheet"><h3>Your cheat sheet</h3><ul style="margin:0;padding-left:20px">'+cfg.cheatsheet.map(x=>'<li>'+x+'</li>').join('')+'</ul></div>'+
     '<div class="next"><div>'+ic('cal')+'Review due '+due.toLocaleDateString(undefined,{weekday:'long',month:'short',day:'numeric'})+'</div><div>'+ic('book')+(cfg.read||'Read '+(meta.chLabel||'chapter '+meta.ch)+' of the book.')+'</div>'+
     (next?'<div>'+ic('arrow')+'<a href="'+next.file+'" style="color:var(--pri);font-weight:600">Next: '+esc(next.title)+'</a></div>':'<div>'+ic('star')+'That’s the final lesson. You finished the course.</div>')+
     '<div>'+ic('home')+'<a href="index.html" style="color:var(--pri);font-weight:600">Course home</a></div></div>');
    requestAnimationFrame(()=>requestAnimationFrame(()=>{const r=$('#ringc');if(r)r.style.strokeDashoffset=C*(1-(MAX?score/MAX:1));}));
    L.done();}};
  const steps=[cover,...user,results];

  /* ---- navigation ---- */
  function chrome(){
    const st=steps[i];
    $('#track').style.width=Math.round(i/(steps.length-1)*100)+'%';
    if(st.part<0)$('#secrow').innerHTML=ic(D.castIcon||'leaf')+'<span>'+esc(D.tag||D.book)+' · Lesson '+(COURSE.indexOf(meta)+1)+' of '+COURSE.length+'</span>';
    else if(st.part>=parts.length)$('#secrow').innerHTML='<span class="secchip" style="background:var(--h2-bg);color:var(--h2)">Finish</span><span>Wrap-up</span>';
    else{const c=PART_COLORS[st.part%4];$('#secrow').innerHTML='<span class="secchip" style="background:var(--'+c+'-bg);color:var(--'+c+')">Part '+(st.part+1)+' of '+parts.length+'</span><span>'+parts[st.part]+'</span>';}
    $('#src').innerHTML=st.src?ic('book')+st.src:'';
    drawStats();
  }
  function go(){ready=false;solvers=[];$('#err').textContent='';$('#go').classList.add('wait');chrome();clearSheet();card.style.animation='none';void card.offsetWidth;card.style.animation='';
    try{steps[i].run(L);}catch(e){console.error('Step '+i+' failed',e);card.innerHTML='<p class="fb no">This screen failed to load: '+esc(e.message)+'</p>';L.done();}
    window.scrollTo({top:0});}
  $('#go').onclick=()=>{
    if(override){const f=override.fn;override=null;f();return;}
    if(!ready){L.err('Finish this step first');return;}
    if(i===steps.length-1){i=0;score=0;streak=0;answered=0;correctN=0;}else i++;go();};
  document.addEventListener('keydown',e=>{
    if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA')return;
    if(e.key==='Enter'){if(document.activeElement===$('#go'))return;if(override||ready){e.preventDefault();$('#go').click();}return;}
    const n=parseInt(e.key,10);if(n>=1&&n<=9){const opts=$$('.opts');const box=opts[opts.length-1];if(box){const b=box.children[n-1];if(b&&b.getAttribute('aria-disabled')!=='true')b.click();}}
  });

  /* ---- autoplay: solves every screen, checks full score. Run Course.autoplay() ---- */
  Course.autoplay=async function(){
    const log=[];i=0;score=0;streak=0;answered=0;correctN=0;go();
    for(let guard=0;guard<400&&i<steps.length-1;guard++){
      const st=steps[i];
      if(!ready){
        if(st.solve)await st.solve(L);
        else{const fns=solvers.slice();solvers=[];for(const f of fns)await f();}
        for(let w=0;w<80&&!ready;w++){await sleep(50);if(!ready&&solvers.length){const fns=solvers.slice();solvers=[];for(const f of fns)await f();}}
      }
      if(!ready){log.push('STUCK at screen '+i+': '+(card.querySelector('.kick')||card).textContent.slice(0,60));break;}
      while(override){$('#go').click();await sleep(5);}
      i++;go();await sleep(5);
    }
    const ok=score===MAX&&log.length===0;
    log.push((ok?'PASS':'FAIL')+' '+cfg.id+': '+score+'/'+MAX+' points, '+user.length+' screens, accuracy '+(answered?Math.round(correctN/answered*100):100)+'%');
    return log.join('\n');
  };
  go();
}

/* ---------- course home: Course.home() in a course folder's index.html ---------- */
function home(){
  const now=Date.now();let last='';
  const rows=D.lessons.map((c,j)=>{const r=store.get(D.prefix+':'+c.id)||{};const due=r.reviewDue&&new Date(r.reviewDue)<=now;
    const head=c.part!==last?'<div class="parthead">'+esc(c.part)+'</div>':'';last=c.part;
    return head+'<a class="lesson-row'+(r.completed?(due?' due':' done'):'')+'" href="'+c.file+'"><div class="ln">'+(r.completed?ic(due?'clock':'check'):(j+1))+'</div><div class="lt"><b>'+esc(c.title)+'</b><span>'+esc(c.chLabel||'Chapter '+c.ch)+'</span></div><div class="lr">'+(r.completed?(r.best+'/'+r.max+' pts'+(due?'<br>Review due':'')):'')+'</div></a>';}).join('');
  const done=D.lessons.filter(c=>(store.get(D.prefix+':'+c.id)||{}).completed).length;
  document.title=D.book;
  document.body.insertAdjacentHTML('afterbegin','<div class="wrap" style="padding-top:28px"><p class="small"><a href="../index.html" style="color:var(--pri);font-weight:600">'+ic('home')+' All courses</a></p>'+
   '<div class="cover" style="text-align:left"><div class="eyebrow">'+esc(D.author)+'</div><h1>'+esc(D.book)+'</h1><p class="small" style="margin:0 0 6px">'+D.lessons.length+' lessons · '+done+' done</p><div class="cast"><div class="ico">'+ic(D.castIcon||'star')+'</div><div>'+(D.castNote||'')+'</div></div></div>'+
   '<div class="home-list">'+rows+'</div></div>');
}
/* ---------- all-courses hub: Course.hub() after loading every course-data.js ---------- */
function hub(){
  const rows=ALL.map(c=>{const done=c.lessons.filter(l=>(store.get(c.prefix+':'+l.id)||{}).completed).length;
    return '<a class="lesson-row'+(done===c.lessons.length?' done':'')+'" href="'+c.slug+'/index.html"><div class="ln">'+ic(c.castIcon||'book')+'</div><div class="lt"><b>'+esc(c.book)+'</b><span>'+esc(c.author)+'</span></div><div class="lr">'+done+' / '+c.lessons.length+'<br>lessons</div></a>';}).join('');
  document.body.insertAdjacentHTML('afterbegin','<div class="wrap" style="padding-top:28px"><div class="cover" style="text-align:left"><div class="eyebrow">Learn FWD</div><h1>Book courses</h1><p class="small" style="margin:0 0 16px">One interactive course per book. Each lesson is one chapter: learn, see an example, try it, practice.</p></div><div class="home-list">'+rows+'</div></div>');
}

window.Course={lesson,register,home,hub,all:ALL,icon:ic,icons:Object.keys(P),store};
})();
