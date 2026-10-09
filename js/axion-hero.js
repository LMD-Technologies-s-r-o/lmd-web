/* Axion hero mock – port of the animated SOLIDWORKS window from axion-cad.com (LMD Technologies) */
(function waitForMock(){
if(!document.getElementById("cad")||!document.getElementById("chat")){return setTimeout(waitForMock,120)}
var reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
var lang="cs";
var CS={ask:"Napište úkol nebo příkaz…"};
function T(k){return CS[k]||""}
var DATA={cs:{th:["Pracuji…","Hotovo"],
scen:[{u:"Vytvoř díl podle přiloženého obrázku",att:"Screenshot 2026-10-06 073948.png",ref:"výkres",s:["Čtu aktivní dokument","Hledám soubory","Analyzuji přiložený obrázek","Vytvářím základní plech","Ohýbám boční stěny","Vyřezávám díry, drážky a výřezy"],build:{3:1,4:2,5:3},a:"Vytvořil jsem plechový díl podle přiloženého obrázku:<ul><li><b>Základní plech</b> ≈ 150 × 110 mm, t = 3 mm</li><li><b>Dvě boční stěny</b> stoupající dozadu, délka ≈ 200 mm</li><li><b>Díry, drážky</b> a zadní výřezy</li></ul>",file:"Part3.SLDPRT",tag:"<b>LIVE</b> · Sheet-Metal1 · t = 3 mm · L ≈ 200"}]}};

/* ---------- shaded 3D viewer ---------- */
function sub(a,b){return[a[0]-b[0],a[1]-b[1],a[2]-b[2]]}
function cross(a,b){return[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]}
function dot(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]}
function nrm(a){var l=Math.hypot(a[0],a[1],a[2])||1;return[a[0]/l,a[1]/l,a[2]/l]}
function edgesAll(n){var e=[];for(var i=0;i<n;i++)e.push([i,(i+1)%n]);return e}
function boxGeo(x0,y0,z0,x1,y1,z1){var v=[[x0,y0,z0],[x1,y0,z0],[x1,y1,z0],[x0,y1,z0],[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1]];
  var F=[[0,3,2,1,[0,0,-1]],[4,5,6,7,[0,0,1]],[0,1,5,4,[0,-1,0]],[3,7,6,2,[0,1,0]],[0,4,7,3,[-1,0,0]],[1,2,6,5,[1,0,0]]];
  return F.map(function(f){return{p:[v[f[0]],v[f[1]],v[f[2]],v[f[3]]],n:f[4],fe:edgesAll(4)}})}
function prismGeo(prof,z0,z1,col,holes){
  var A=0;for(var i=0;i<prof.length;i++){var a=prof[i],b=prof[(i+1)%prof.length];A+=a[0]*b[1]-b[0]*a[1]}
  if(A<0)prof=prof.slice().reverse();var n=prof.length,g=[];
  for(var i=0;i<n;i++){var a=prof[i],b=prof[(i+1)%n],dx=b[0]-a[0],dy=b[1]-a[1];
    g.push({p:[[a[0],a[1],z0],[b[0],b[1],z0],[b[0],b[1],z1],[a[0],a[1],z1]],n:nrm([dy,-dx,0]),fe:[]})}
  g.push({p:prof.map(function(q){return[q[0],q[1],z1]}),n:[0,0,1],fe:edgesAll(n)});
  g.push({p:prof.map(function(q){return[q[0],q[1],z0]}),n:[0,0,-1],fe:edgesAll(n)});
  (holes||[]).forEach(function(h){[[z1+.06,1],[z0-.06,-1]].forEach(function(zz){g.push({p:h.map(function(q){return[q[0],q[1],zz[0]]}),n:[0,0,zz[1]],fe:edgesAll(h.length),col:"#2E3238"})})});
  return g}
function arcPts(cx,cy,r,a0,a1,k){var o=[];for(var i=0;i<=k;i++){var a=a0+(a1-a0)*i/k;o.push([cx+r*Math.cos(a),cy+r*Math.sin(a)])}return o}
function circ(cx,cy,r){return arcPts(cx,cy,r,0,Math.PI*2*(23/24),23)}
function slot(cx,cy,w,h){var r=w/2;return arcPts(cx,cy+h/2-r,r,0,Math.PI,8).concat(arcPts(cx,cy-h/2+r,r,Math.PI,Math.PI*2,8))}
var SG={};
function sheetGeo(lvl){if(SG[lvl])return SG[lvl];
  var L=200,W=110,t=3,LB=150,ox=-100,oy=-42;
  function T2(p){return[p[0]+ox,p[1]+oy+20]}
  var groups=[];
  var r=3,zi=W/2-t-r;
  var base=boxGeo(ox,oy+20-t,lvl>=2?-zi:-W/2+t,ox+LB,oy+20,lvl>=2?zi:W/2-t);base.first=true;groups.push(base);
  function bend(sg){var g=[],k=10,yc=oy+20+r,zc=sg*zi,x0=ox,x1=ox+LB;
    function P(x,rad,a){return[x,yc+rad*Math.sin(a),zc+sg*rad*Math.cos(a)]}
    for(var i=0;i<k;i++){var a0=-Math.PI/2+Math.PI/2*i/k,a1=-Math.PI/2+Math.PI/2*(i+1)/k,am=(a0+a1)/2,nn=[0,Math.sin(am),sg*Math.cos(am)];
      g.push({p:[P(x0,r+t,a0),P(x1,r+t,a0),P(x1,r+t,a1),P(x0,r+t,a1)],n:nn,fe:[]});
      g.push({p:[P(x0,r,a0),P(x1,r,a0),P(x1,r,a1),P(x0,r,a1)],n:[-nn[0],-nn[1],-nn[2]],fe:[]})}
    [[x0,-1],[x1,1]].forEach(function(e){var pts=[];for(var i=0;i<=k;i++)pts.push(P(e[0],r+t,-Math.PI/2+Math.PI/2*i/k));for(var i=k;i>=0;i--)pts.push(P(e[0],r,-Math.PI/2+Math.PI/2*i/k));g.push({p:pts,n:[e[1],0,0],fe:edgesAll(pts.length)})});
    return g}
  if(lvl>=2){
    groups.push(bend(1));groups.push(bend(-1));
    var prof=[[0,r]];
    if(lvl>=3){prof=prof.concat([[150,r]]).concat(arcPts(172,r,22,Math.PI,0,14).slice(1,-1)).concat([[194,r]])}else prof.push([194,r]);
    prof=prof.concat([[200,6+r],[200,92]]).concat(arcPts(190,92,10,0,Math.PI/2,5).slice(1)).concat([[10,26]]).concat(arcPts(10,16,10,Math.PI/2,Math.PI,5).slice(1)).concat([[0,0]]);
    prof.pop();prof=prof.map(T2);
    var holes=lvl>=3?[circ(20,13,5),circ(152,74,4),slot(152,50,7,16)].map(function(h){return h.map(T2)}):[];
    groups.push(prismGeo(prof,W/2-t,W/2,null,holes));
    groups.push(prismGeo(prof,-W/2,-W/2+t,null,holes));
  }
  return SG[lvl]=groups}
var LIGHT=nrm([-0.45,0.6,-0.66]),HALF=nrm([LIGHT[0],LIGHT[1],LIGHT[2]-1]);
function Viewer(cv,o){var self=this;this.cv=cv;this.ctx=cv.getContext("2d");this.groups=[];this.ang=o.ang;this.tilt=o.tilt;this.span=o.span;this.drag=false;
  this.resize=function(){var r=cv.getBoundingClientRect(),d=window.devicePixelRatio||1;cv.width=Math.max(1,r.width*d);cv.height=Math.max(1,r.height*d);self.ctx.setTransform(d,0,0,d,0,0);self.draw()};
  window.addEventListener("resize",this.resize);
  var lx=0,ly=0,host=o.host||cv;
  host.addEventListener("pointerdown",function(e){self.drag=true;lx=e.clientX;ly=e.clientY;host.style.cursor="grabbing";try{host.setPointerCapture(e.pointerId)}catch(_){}});
  host.addEventListener("pointermove",function(e){if(!self.drag)return;self.ang-=(e.clientX-lx)*0.01;self.tilt=Math.max(0.12,Math.min(1.25,self.tilt+(e.clientY-ly)*0.008));lx=e.clientX;ly=e.clientY;self.draw()});
  function up(){self.drag=false;host.style.cursor=""}
  host.addEventListener("pointerup",up);host.addEventListener("pointercancel",up);
}
Viewer.prototype.fit=function(g){var mn=[1e9,1e9,1e9],mx=[-1e9,-1e9,-1e9];g.forEach(function(gr){gr.forEach(function(f){f.p.forEach(function(v){for(var k=0;k<3;k++){mn[k]=Math.min(mn[k],v[k]);mx[k]=Math.max(mx[k],v[k])}})})});
  this.c=[(mn[0]+mx[0])/2,(mn[1]+mx[1])/2,(mn[2]+mx[2])/2];this.rad=Math.hypot(mx[0]-mn[0],mx[1]-mn[1],mx[2]-mn[2])/2};
Viewer.prototype.set=function(g){this.groups=g;this.draw()};
Viewer.prototype.draw=function(){var c=this.ctx,w=this.cv.clientWidth,h=this.cv.clientHeight,dp=window.devicePixelRatio||1;if(Math.abs(this.cv.width-Math.max(1,w*dp))>1||Math.abs(this.cv.height-Math.max(1,h*dp))>1){this.cv.width=Math.max(1,w*dp);this.cv.height=Math.max(1,h*dp);c.setTransform(dp,0,0,dp,0,0)}c.clearRect(0,0,w,h);if(!this.groups.length)return;
  var C=this.c||[0,20,0],s=this.rad?Math.min(w,h)*0.47/this.rad:Math.min(w*0.82,h*1.25)/this.span,cy=Math.cos(this.ang),sy=Math.sin(this.ang),cx=Math.cos(-this.tilt),sx=Math.sin(-this.tilt),D=1100;
  function Tr(v,yo){var X=v[0]-(yo?C[0]:0),Z=v[2]-(yo?C[2]:0),x=X*cy-Z*sy,z=X*sy+Z*cy,y=v[1]-(yo?C[1]:0);return[x,y*cx-z*sx,y*sx+z*cx]}
  function Pj(v){var p=D/(D+v[2]);return[w/2+v[0]*s*p,h/2-v[1]*s*p]}
  c.lineJoin="round";
  var gs=this.groups.slice(),key=function(g){var z=0;g.forEach(function(f){var v=Tr(f.p[0],20);z+=v[2]});return z/g.length};
  var first=gs.filter(function(g){return g.first}),rest=gs.filter(function(g){return!g.first}).map(function(g){return[key(g),g]}).sort(function(a,b){return b[0]-a[0]}).map(function(x){return x[1]});
  first.concat(rest).forEach(function(g){
    var info=g.map(function(f){var tp=f.p.map(function(v){return Tr(v,20)}),tn=Tr(f.n,0),cc=[0,0,0];tp.forEach(function(v){cc[0]+=v[0];cc[1]+=v[1];cc[2]+=v[2]});cc=cc.map(function(q){return q/tp.length});
      return{tp:tp,tn:tn,front:dot(tn,[cc[0],cc[1],cc[2]+D])<0}});
    g.forEach(function(f,k){var I=info[k];if(!I.front)return;var pp=I.tp.map(Pj);
      var dl=Math.max(0,dot(I.tn,LIGHT)),sp=Math.pow(Math.max(0,dot(I.tn,HALF)),24),v=Math.min(1,0.18+0.62*dl+0.3*sp),gv=Math.round(62+140*v);
      var col=f.col||("rgb("+gv+","+gv+","+(gv+3)+")");
      c.beginPath();pp.forEach(function(q,i){i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1])});c.closePath();c.fillStyle=col;c.fill();c.strokeStyle=col;c.lineWidth=.7;c.stroke();
      c.strokeStyle="#16191F";c.lineWidth=1.1;c.beginPath();
      f.fe.forEach(function(e){c.moveTo(pp[e[0]][0],pp[e[0]][1]);c.lineTo(pp[e[1]][0],pp[e[1]][1])});
      c.stroke()})})};
var hero=new Viewer(document.getElementById("cad"),{ang:-0.5,tilt:0.55,span:370,host:document.querySelector(".ax-mock .viewport")});
hero.fit(sheetGeo(3));hero.resize();
(function loop(){if(!reduce){if(!hero.drag){hero.ang+=0.005}hero.draw()}requestAnimationFrame(loop)})();

/* ---------- animated chat (real Axion chat behaviour) ---------- */
var timers=[];
function later(f,ms){timers.push(setTimeout(f,ms))}
function clearT(){timers.forEach(function(t){if(t&&t.c)clearInterval(t.c);else clearTimeout(t)});timers=[]}
var $=function(id){return document.getElementById(id)};
var um=$("um"),inp=$("inp"),cmp=$("cmp"),chip=$("chip"),mu=$("mu"),ts=$("ts"),ts2=$("ts2"),st=$("st"),stl=$("st-l"),sth=$("st-h"),stt=$("st-t"),stg=$("st-g"),aw=$("aw"),ma=$("ma"),vfile=$("vfile"),vtag=$("vtag");
chip.hidden=true;aw.hidden=true;
function stamp(){var d=new Date(),p=function(n){return(n<10?"0":"")+n};return p(d.getDate())+"."+p(d.getMonth()+1)+"."+d.getFullYear()+" "+p(d.getHours())+":"+p(d.getMinutes())}
function arrow(){stg.textContent=st.classList.contains("col")?"▸":"▾"}
if(stg)stg.addEventListener("click",function(){st.classList.toggle("col");arrow()});
var chatEl=$("chat");try{new MutationObserver(function(){chatEl.scrollTop=chatEl.scrollHeight}).observe(chatEl,{childList:true,subtree:true,characterData:true,attributes:true})}catch(e){}
function scene(sc,lvl){vfile.textContent="SOLIDWORKS · "+(sc.file||"Part1.SLDPRT");hero.set(lvl?sheetGeo(lvl):[]);vtag.innerHTML=lvl===3?sc.tag:"<b>LIVE</b> · Nový díl"}
function userHtml(sc){var e=function(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;")};return e(sc.u)+(sc.att?"<small>[📎 "+e(sc.ref)+"]</small>":"")}
function finish(sc,secs){st.classList.add("done");sth.textContent=DATA[lang].th[1]+" · "+sc.s.length+(sc.s.length>=2&&sc.s.length<=4?" kroky":" kroků");if(secs)stt.textContent=secs;
  stl.querySelectorAll("li").forEach(function(li){li.className="done"})}
function renderFinal(sc){scene(sc,3);um.hidden=false;mu.innerHTML=userHtml(sc);ts.textContent=stamp();st.hidden=false;st.className="steps";
  stl.innerHTML=sc.s.map(function(x){return"<li><span class='s'></span>"+x+"</li>"}).join("");finish(sc,"15.0 s");arrow();aw.hidden=false;ma.innerHTML=sc.a;ts2.textContent=stamp()}
var firstRun=true;
function runScenario(){
  clearT();var sc=DATA[lang].scen[0];
  if(reduce){renderFinal(sc);return}
  if(firstRun){firstRun=false;renderFinal(sc);st.classList.add("col");arrow();later(runScenario,4500);return}
  scene(sc,1);
  um.hidden=true;ts.textContent="";st.hidden=true;st.className="steps";aw.hidden=true;stl.innerHTML="";
  var i=0,t0;inp.textContent=T("ask");cmp.classList.remove("typing","sent");chip.hidden=true;
  if(sc.att)later(function(){chip.innerHTML="📎 "+sc.att+" <u>✕</u>";chip.hidden=false},700);
  later(function(){cmp.classList.add("typing");(function type(){if(i<=sc.u.length){inp.innerHTML=sc.u.slice(0,i)+"<span class='caret'></span>";i++;later(type,30)}else{later(send,450)}})()},1500);
  function send(){cmp.classList.add("sent");later(function(){cmp.classList.remove("typing","sent");inp.textContent=T("ask");chip.hidden=true;mu.innerHTML=userHtml(sc);ts.textContent=stamp();um.hidden=false;later(startSteps,500)},160)}
  function startSteps(){st.hidden=false;sth.textContent=DATA[lang].th[0];arrow();t0=performance.now();var tick=setInterval(function(){stt.textContent=((performance.now()-t0)/1000).toFixed(1)+" s"},100);timers.push({c:tick});
    sc.s.forEach(function(x,k){later(function(){var lis=stl.querySelectorAll("li");if(lis.length){lis[lis.length-1].className="done";if(sc.build&&sc.build[k-1])scene(sc,sc.build[k-1])}
      var li=document.createElement("li");li.innerHTML="<span class='s'></span>"+x;stl.appendChild(li)},k*1150)});
    later(function(){clearInterval(tick);scene(sc,3);finish(sc);
      later(function(){st.classList.add("col");arrow()},700);
      later(function(){aw.hidden=false;ma.innerHTML=sc.a;ts2.textContent=stamp()},1100);
      later(function(){st.classList.remove("col");arrow()},3400);
      later(function(){st.classList.add("col");arrow()},6000);
      later(function(){runScenario()},9000)},sc.s.length*1150+500)}
}
runScenario();
})();
