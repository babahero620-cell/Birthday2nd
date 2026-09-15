const escapeHtml = s => String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
const friend = escapeHtml(CONFIG.friendName);
const sender = escapeHtml(CONFIG.senderName);
document.querySelectorAll("[data-friend]").forEach(e=>e.textContent=CONFIG.friendName);
document.querySelectorAll("[data-sender]").forEach(e=>e.textContent=CONFIG.senderName);
document.getElementById("intro").textContent=CONFIG.introMessage.replaceAll("FRIEND_NAME",CONFIG.friendName);
document.getElementById("songTitle").textContent=CONFIG.song.title;
document.getElementById("miniTitle").textContent=CONFIG.song.title;

const loader=document.getElementById("loader"), story=document.getElementById("story");
setTimeout(()=>{loader.classList.add("hide");story.hidden=false;setTimeout(()=>loader.remove(),900)},1400);

const ambient=document.getElementById("ambient");
for(let i=0;i<26;i++){const p=document.createElement("span");p.className="particle";p.textContent=["✦","·","♡","✧"][i%4];p.style.left=Math.random()*100+"%";p.style.animationDuration=(7+Math.random()*12)+"s";p.style.animationDelay=(-Math.random()*15)+"s";p.style.fontSize=(8+Math.random()*12)+"px";ambient.appendChild(p)}

const openBtn=document.getElementById("openBtn");
openBtn.addEventListener("click",()=>{document.getElementById("balloon").style.animation="balloonExit 1.2s cubic-bezier(.2,.8,.2,1) forwards";setTimeout(()=>document.querySelector(".music-section").scrollIntoView({behavior:"smooth"}),750)});
const style=document.createElement("style");style.textContent="@keyframes balloonExit{to{transform:translate(-50%,-150vh) scale(.75);opacity:0}}";document.head.appendChild(style);

const audio=document.getElementById("audio");audio.src=CONFIG.song.src;
const playBtn=document.getElementById("playBtn"), mini=document.getElementById("miniPlayer"), miniPlay=document.getElementById("miniPlay"), mute=document.getElementById("muteBtn");
function toggleAudio(){if(audio.paused){audio.play().then(()=>{playBtn.textContent="❚❚";miniPlay.textContent="❚❚";mini.classList.add("show")}).catch(()=>{});}else{audio.pause();playBtn.textContent="▶";miniPlay.textContent="▶"}}
playBtn.onclick=toggleAudio;miniPlay.onclick=toggleAudio;mute.onclick=()=>{audio.muted=!audio.muted;mute.textContent=audio.muted?"🔇":"🔊"};
audio.addEventListener("timeupdate",()=>{if(audio.duration)document.getElementById("trackFill").style.width=(audio.currentTime/audio.duration*100)+"%"});

const wave=document.getElementById("wave");for(let i=0;i<22;i++){const b=document.createElement("i");b.style.setProperty("--h",(5+Math.random()*20)+"px");b.style.animationDelay=(-Math.random())+"s";wave.appendChild(b)}

const wall=document.getElementById("wall");
CONFIG.photos.forEach((p,i)=>{
  const card=document.createElement("article");card.className="polaroid";card.tabIndex=0;card.dataset.index=i;
  card.innerHTML=`<div class="polaroid-inner"><div class="front"><img loading="lazy" src="${escapeHtml(p.image)}" alt="${escapeHtml(p.frontText)}"><span class="caption">${escapeHtml(p.frontText)}</span></div><div class="back">${escapeHtml(p.backText)}</div></div>`;
  card.addEventListener("click",e=>{
    if(card.classList.contains("flipped")) openModal(p);
    else card.classList.add("flipped");
  });
  card.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();card.click()}});
  wall.appendChild(card);
});

const modal=document.getElementById("photoModal");
function openModal(p){document.getElementById("modalImg").src=p.image;document.getElementById("modalImg").alt=p.frontText;document.getElementById("modalText").textContent=p.backText;modal.classList.add("open")}
function closeModal(){modal.classList.remove("open")}document.getElementById("modalClose").onclick=closeModal;modal.addEventListener("click",e=>{if(e.target===modal)closeModal()});

const scratchGrid=document.getElementById("scratchGrid");let found=0;
CONFIG.scratchCards.forEach((msg,i)=>{
  const wrap=document.createElement("div");wrap.className="scratch-card";
  wrap.innerHTML=`<div class="scratch-message">${escapeHtml(msg)}</div><canvas></canvas><div class="scratch-cover">Scratch me ✨</div>`;
  scratchGrid.appendChild(wrap);initScratch(wrap,wrap.querySelector("canvas"),wrap.querySelector(".scratch-cover"));
});
function initScratch(wrap,canvas,cover){
  const ctx=canvas.getContext("2d",{willReadFrequently:true});let drawing=false,done=false;
  function resize(){const r=wrap.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);canvas.width=r.width*d;canvas.height=r.height*d;canvas.style.width=r.width+"px";canvas.style.height=r.height+"px";ctx.setTransform(d,0,0,d,0,0);ctx.fillStyle="#d7c5bb";ctx.fillRect(0,0,r.width,r.height);ctx.fillStyle="#efe4dd";ctx.font="700 13px DM Sans";ctx.textAlign="center";ctx.fillText("scratch • scratch • scratch",r.width/2,r.height/2)}
  resize();
  const point=e=>{const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left),y:(e.clientY-r.top)}};
  function scratch(e){if(!drawing||done)return;e.preventDefault();const p=point(e);ctx.globalCompositeOperation="destination-out";ctx.beginPath();ctx.arc(p.x,p.y,22,0,Math.PI*2);ctx.fill();check()}
  function check(){if(done)return;const d=ctx.getImageData(0,0,canvas.width,canvas.height).data;let transparent=0;for(let i=3;i<d.length;i+=40)if(d[i]<80)transparent++;if(transparent/(d.length/40)>.60){done=true;cover.style.transition="opacity .45s";cover.style.opacity="0";canvas.style.opacity="0";found++;if(found===CONFIG.scratchCards.length)document.getElementById("allFound").classList.add("show")}}
  canvas.addEventListener("pointerdown",e=>{drawing=true;canvas.setPointerCapture(e.pointerId);scratch(e)});canvas.addEventListener("pointermove",scratch);canvas.addEventListener("pointerup",()=>drawing=false);canvas.addEventListener("pointercancel",()=>drawing=false);
  window.addEventListener("resize",()=>{if(!done)resize()});
}

const timeline=document.getElementById("timeline");
CONFIG.timeline.forEach(t=>{const el=document.createElement("article");el.className="time-card";el.innerHTML=`<span class="time-num">${t[0]}</span><h3>${escapeHtml(t[1])}</h3><p>${escapeHtml(t[2])}</p>`;timeline.appendChild(el)});

const letter=document.getElementById("letter"), raw=CONFIG.finalLetter.replaceAll("FRIEND_NAME",CONFIG.friendName).replaceAll("YOUR_NAME",CONFIG.senderName);
raw.split(/\n+/).filter(Boolean).forEach(txt=>{const p=document.createElement("div");p.className="line";p.textContent=txt;letter.appendChild(p)});

const revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");e.target.querySelectorAll?.(".time-card").forEach((c,i)=>setTimeout(()=>c.classList.add("show"),i*130));e.target.querySelectorAll?.(".letter .line").forEach((l,i)=>setTimeout(()=>l.classList.add("show"),i*320))}}),{threshold:.16});
document.querySelectorAll(".reveal").forEach(e=>revealObserver.observe(e));
document.querySelectorAll(".time-card").forEach(e=>revealObserver.observe(e));

const sections=[...document.querySelectorAll(".scene")],progress=document.getElementById("progressFill");
window.addEventListener("scroll",()=>{const y=scrollY+innerHeight*.45;let idx=sections.findIndex(s=>y<s.offsetTop+s.offsetHeight);if(idx<0)idx=sections.length-1;progress.style.width=((idx)/(sections.length-1)*100)+"%"},{passive:true});

document.getElementById("replay").onclick=()=>{audio.pause();audio.currentTime=0;playBtn.textContent="▶";miniPlay.textContent="▶";mini.classList.remove("show");found=0;document.getElementById("allFound").classList.remove("show");document.querySelectorAll(".polaroid").forEach(c=>c.classList.remove("flipped"));document.querySelectorAll(".scratch-card").forEach(c=>{const cover=c.querySelector(".scratch-cover"),can=c.querySelector("canvas");cover.style.opacity="1";can.style.opacity="1";const ctx=can.getContext("2d");const r=c.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);ctx.setTransform(d,0,0,d,0,0);ctx.globalCompositeOperation="source-over";ctx.fillStyle="#d7c5bb";ctx.fillRect(0,0,r.width,r.height)});window.scrollTo({top:0,behavior:"smooth"})});

window.addEventListener("load",()=>document.title=`For ${CONFIG.friendName} ♥`);
