(() => {
  'use strict';

  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const W = 1400, H = 560, GROUND = 454;
  const $ = id => document.getElementById(id);
  const ui = {intro:$('intro'),pause:$('pauseOverlay'),finish:$('finishOverlay'),hud:$('hud'),count:$('nutCount'),icon:$('progressIcon'),time:$('timeDisplay'),summary:$('finishSummary'),level:$('levelLabel'),exam:$('examOverlay'),examStep:$('examStep'),examFormula:$('examFormula'),examInput:$('examInput'),discipline:$('disciplineOverlay'),disciplineReason:$('disciplineReason')};
  let pits = [[770,920],[1790,1960],[3010,3180],[3810,3960]];
  let platforms = [
    {x:405,y:326,w:172,h:29},{x:1050,y:336,w:175,h:29},{x:1515,y:300,w:175,h:29},
    {x:2220,y:325,w:170,h:29},{x:2720,y:310,w:188,h:29},{x:3330,y:332,w:175,h:29},{x:4100,y:298,w:175,h:29}
  ];
  let obstacles = [
    {x:310,y:393,w:87,h:61,type:'rock'},{x:610,y:382,w:76,h:72,type:'box'},
    {x:1270,y:389,w:86,h:65,type:'rock'},{x:1640,y:382,w:76,h:72,type:'box'},
    {x:2430,y:382,w:76,h:72,type:'box'},{x:2850,y:391,w:87,h:63,type:'rock'},
    {x:3570,y:382,w:76,h:72,type:'box'},{x:4290,y:392,w:87,h:62,type:'rock'}
  ];
  let springs = [{x:996,y:423,w:75,h:31},{x:2010,y:423,w:75,h:31},{x:3250,y:423,w:75,h:31}];
  let nutPositions = [
    [460,269],[720,335],[849,309],[1125,277],[1580,240],
    [1875,292],[2285,265],[2798,250],[3405,271],[4168,240]
  ];
  let checkpoints = [110,1495,2690,3630];
  let scienceNotes = [
    {x:942,y:205,formula:'F = m · a',caption:'сила штовхає НРК вгору'}
  ];
  let movingPlatforms = [], iceZones = [], windZones = [];
  const levelPlans = [
    {title:'Стартова стежка', lesson:'Сила і рух', color:'#bde7f9', width:4630,
      pits,platforms,obstacles,springs,nutPositions,checkpoints,scienceNotes,movingPlatforms,iceZones,windZones},
    {title:'Майстерня на схилі', lesson:'Шлях, швидкість і час', color:'#e5d7b7', width:3920,
      pits:[[700,845],[1440,1605],[2290,2470],[3190,3355]],
      platforms:[{x:420,y:333,w:164,h:29},{x:1060,y:322,w:174,h:29},{x:1750,y:303,w:177,h:29},{x:2650,y:326,w:170,h:29},{x:3460,y:294,w:186,h:29}],
      obstacles:[{x:300,y:392,w:86,h:62,type:'box'},{x:605,y:394,w:85,h:60,type:'rock'},{x:1260,y:382,w:76,h:72,type:'box'},{x:2010,y:391,w:86,h:63,type:'rock'},{x:2830,y:382,w:76,h:72,type:'box'},{x:3650,y:391,w:86,h:63,type:'rock'}],
      springs:[{x:890,y:423,w:75,h:31},{x:1660,y:423,w:75,h:31},{x:2500,y:423,w:75,h:31},{x:3370,y:423,w:75,h:31}],
      nutPositions:[[480,277],[760,294],[1115,265],[1530,292],[1810,239],[2170,276],[2735,262],[3290,280],[3535,230]],
      checkpoints:[110,1320,2550,3480], scienceNotes:[{x:1020,y:180,formula:'s = v · t',caption:'шлях = швидкість · час'}],
      movingPlatforms:[{x:930,y:345,w:142,h:28,axis:'x',range:120,speed:1.1,phase:0},{x:2130,y:330,w:145,h:28,axis:'y',range:88,speed:1.3,phase:1.4},{x:3000,y:342,w:150,h:28,axis:'x',range:110,speed:1.25,phase:2.5}], iceZones:[],windZones:[]},
    {title:'Стежка над хмарами', lesson:'Тертя і зчеплення', color:'#d9edfa', width:4220,
      pits:[[650,800],[1410,1595],[2220,2475],[3030,3225],[3700,3860]],
      platforms:[{x:385,y:332,w:165,h:29},{x:940,y:296,w:176,h:29},{x:1650,y:320,w:170,h:29},{x:2450,y:280,w:180,h:29},{x:3300,y:315,w:178,h:29},{x:3900,y:278,w:180,h:29}],
      obstacles:[{x:245,y:392,w:87,h:62,type:'rock'},{x:530,y:382,w:76,h:72,type:'box'},{x:1050,y:392,w:87,h:62,type:'rock'},{x:1825,y:382,w:76,h:72,type:'box'},{x:2660,y:391,w:87,h:63,type:'rock'},{x:3440,y:382,w:76,h:72,type:'box'}],
      springs:[{x:1310,y:423,w:75,h:31},{x:2115,y:423,w:75,h:31},{x:2925,y:423,w:75,h:31},{x:3580,y:423,w:75,h:31}],
      nutPositions:[[430,271],[715,290],[1015,238],[1345,325],[1715,264],[2140,318],[2540,215],[2960,315],[3410,255],[3970,225]],
      checkpoints:[110,1190,2520,3260], scienceNotes:[{x:2730,y:174,formula:'Fₜ = μ · N',caption:'тертя тримає колеса на дорозі'}],
      movingPlatforms:[{x:2740,y:338,w:145,h:28,axis:'y',range:82,speed:1.05,phase:1}],
      iceZones:[[880,1170],[2600,2975]],windZones:[{x:1450,w:350,force:190},{x:3180,w:300,force:-150}]},
    {title:'Екзамен комбата', lesson:'Формули за 90 секунд', color:'#b9dae1', width:3100,
      pits:[],platforms:[{x:480,y:354,w:155,h:29},{x:1210,y:334,w:160,h:29},{x:1950,y:354,w:155,h:29},{x:2550,y:326,w:170,h:29}],
      obstacles:[{x:900,y:391,w:87,h:63,type:'rock'},{x:1660,y:382,w:76,h:72,type:'box'},{x:2350,y:391,w:87,h:63,type:'rock'}], springs:[],nutPositions:[],
      checkpoints:[110,850,1590,2360],scienceNotes:[],movingPlatforms:[],iceZones:[],windZones:[],
      examQuestions:[{x:690,formula:'F = □ · a',answer:'m'},{x:1450,formula:'s = □ · t',answer:'v'},{x:2230,formula:'Fₜ = μ · □',answer:'n'}]}
  ];
  let currentLevel = levelPlans[0], worldWidth = currentLevel.width;
  const state = {mode:'intro',level:0,camera:0,time:0,score:0,attempts:0,checkpoint:110,nuts:[],particles:[],shake:0,flash:0,best:0,onIce:false,lessonCue:'',lessonCueTime:0,lessonShown:false,examStep:0,examQuestions:[],remaining:0};
  const player = {x:110,y:GROUND-59,w:78,h:59,vx:0,vy:0,grounded:false,coyote:0,jumpBuffer:0,angle:0,wheel:0,support:null};
  const keys = {left:false,right:false,jump:false};
  let audioContext = null, soundOn = false, lastFrame = 0;
  const audio = {master:null,motor:null,motorGain:null,wind:null,windGain:null,nextMusic:0,musicStep:0};
  try { state.best = Number(localStorage.getItem('nrk-best-time')) || 0; } catch (_) {}

  const copyItems = items => items.map(item => Array.isArray(item) ? [...item] : {...item});
  function chooseLevel(index) {
    const level = levelPlans[index];
    currentLevel=level;worldWidth=level.width;state.level=index;
    pits=copyItems(level.pits);platforms=copyItems(level.platforms);obstacles=copyItems(level.obstacles);springs=copyItems(level.springs);
    nutPositions=copyItems(level.nutPositions);checkpoints=[...level.checkpoints];scienceNotes=copyItems(level.scienceNotes);
    movingPlatforms=copyItems(level.movingPlatforms).map(p=>({...p,baseX:p.x,baseY:p.y}));iceZones=copyItems(level.iceZones);windZones=copyItems(level.windZones);
    reset();
  }
  function reset() {
    Object.assign(player,{x:110,y:GROUND-59,vx:0,vy:0,grounded:false,coyote:0,jumpBuffer:0,angle:0,wheel:0,support:null});
    Object.assign(state,{mode:'play',camera:0,time:0,score:0,attempts:0,checkpoint:110,particles:[],shake:0,flash:0,onIce:false,lessonCue:'',lessonCueTime:0,lessonShown:false,nuts:nutPositions.map(([x,y])=>({x,y,taken:false})),examStep:0,examQuestions:copyItems(currentLevel.examQuestions||[]),remaining:state.level===3?90:0});
    keys.left=keys.right=keys.jump=false;
    ui.intro.hidden=ui.pause.hidden=ui.finish.hidden=ui.exam.hidden=ui.discipline.hidden=true;
    ui.hud.hidden=false;
    updateHud();
    canvas.focus?.();
  }
  function showLevelSelection(){
    state.mode='intro';keys.left=keys.right=keys.jump=false;
    ui.hud.hidden=true;ui.pause.hidden=true;ui.finish.hidden=true;ui.exam.hidden=true;ui.discipline.hidden=true;ui.intro.hidden=false;
  }
  function updateHud() {
    ui.count.textContent=state.level===3?`${state.examStep} / ${state.examQuestions.length}`:`${state.score} / ${nutPositions.length}`;
    ui.icon.textContent=state.level===3?'✎':'⬡';
    ui.level.textContent=`РІВЕНЬ ${state.level+1}`;
    const seconds=Math.ceil(state.level===3?state.remaining:state.time);
    ui.time.textContent=`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;
  }
  function showLessonCue(text){
    if(state.lessonShown)return;
    state.lessonShown=true;state.lessonCue=text;state.lessonCueTime=4.4;
  }
  function pause() {
    if(state.mode==='play'){state.mode='pause';ui.pause.hidden=false;keys.left=keys.right=keys.jump=false;}
    else if(state.mode==='pause'){state.mode='play';ui.pause.hidden=true;}
  }
  function openExam(question){
    state.mode='exam';keys.left=keys.right=keys.jump=false;ui.examStep.textContent=`${state.examStep+1} / ${state.examQuestions.length}`;ui.examFormula.textContent=question.formula;ui.examInput.value='';ui.exam.hidden=false;setTimeout(()=>ui.examInput.focus(),0);
  }
  function discipline(reason){
    state.mode='discipline';keys.left=keys.right=keys.jump=false;ui.exam.hidden=true;ui.disciplineReason.textContent=reason;ui.discipline.hidden=false;soundEffect('discipline');
  }
  function answerExam(value){
    if(state.mode!=='exam')return;
    const question=state.examQuestions[state.examStep];
    if(String(value).trim().toLowerCase()!==question.answer){discipline('Помилка у формулі. Комбат не приймає відповідь.');return;}
    soundEffect('correct');state.examStep++;ui.exam.hidden=true;state.mode='play';
    if(state.examStep===state.examQuestions.length)showLessonCue('Усі формули зібрано. Тепер — до фінішу!');
  }
  function finish() {
    state.mode='finish';ui.finish.hidden=false;
    const t=state.time.toFixed(1);
    if(!state.best || state.time<state.best){state.best=state.time;try{localStorage.setItem('nrk-best-time',String(state.best));}catch(_){}}
    ui.summary.textContent=state.level===3
      ? `Екзамен складено. Усі ${state.examQuestions.length} формули відновлено за ${Math.ceil(90-state.remaining)} с.`
      : `«${currentLevel.title}» пройдено: ${nutPositions.length} гайок за ${t} с. ${state.attempts?`Повернень до чекпойнта: ${state.attempts}.`: 'Ідеальний заїзд!'} Рекорд: ${state.best.toFixed(1)} с.`;
    soundEffect('finish');
  }
  function ensureAudio(){
    if(!soundOn)return null;
    try {
      audioContext ||= new (window.AudioContext||window.webkitAudioContext)();
      if(audio.master)return audioContext;
      audioContext.resume();
      audio.master=audioContext.createGain();audio.master.gain.value=.42;audio.master.connect(audioContext.destination);
      audio.motor=audioContext.createOscillator();audio.motor.type='sawtooth';audio.motor.frequency.value=52;
      audio.motorGain=audioContext.createGain();audio.motorGain.gain.value=.0001;audio.motor.connect(audio.motorGain).connect(audio.master);audio.motor.start();
      const noise=audioContext.createBuffer(1,audioContext.sampleRate*2,audioContext.sampleRate);const data=noise.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=Math.random()*2-1;
      audio.wind=audioContext.createBufferSource();audio.wind.buffer=noise;audio.wind.loop=true;const filter=audioContext.createBiquadFilter();filter.type='bandpass';filter.frequency.value=720;filter.Q.value=.6;audio.windGain=audioContext.createGain();audio.windGain.gain.value=.0001;audio.wind.connect(filter).connect(audio.windGain).connect(audio.master);audio.wind.start();
      audio.nextMusic=audioContext.currentTime+.6;audio.musicStep=0;
      return audioContext;
    } catch(_){return null;}
  }
  function tone(freq,duration=.08,type='triangle',gain=.065,slide=0){
    const context=ensureAudio();if(!context)return;
    const o=context.createOscillator(),g=context.createGain(),now=context.currentTime;o.type=type;o.frequency.setValueAtTime(freq,now);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(35,freq+slide),now+duration);g.gain.setValueAtTime(gain,now);g.gain.exponentialRampToValueAtTime(.001,now+duration);o.connect(g).connect(audio.master);o.start(now);o.stop(now+duration+.02);
  }
  function noiseBurst(duration=.12,gain=.05,frequency=900){
    const context=ensureAudio();if(!context)return;const buffer=context.createBuffer(1,Math.ceil(context.sampleRate*duration),context.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*(1-i/data.length);const source=context.createBufferSource(),filter=context.createBiquadFilter(),amp=context.createGain();filter.type='bandpass';filter.frequency.value=frequency;amp.gain.value=gain;source.buffer=buffer;source.connect(filter).connect(amp).connect(audio.master);source.start();
  }
  function soundEffect(kind){
    if(!soundOn)return;
    if(kind==='jump'){tone(210,.12,'square',.045,190);tone(410,.09,'triangle',.025,100);}
    if(kind==='spring'){tone(105,.22,'sine',.07,620);tone(720,.16,'triangle',.045,320);}
    if(kind==='nut'){tone(740,.09,'triangle',.06,120);setTimeout(()=>tone(1010,.12,'sine',.045,90),65);}
    if(kind==='splash'){noiseBurst(.24,.09,530);tone(155,.25,'sine',.06,-60);}
    if(kind==='fall'){noiseBurst(.22,.055,1150);tone(390,.3,'sine',.04,-260);}
    if(kind==='ice'){noiseBurst(.06,.025,2500);tone(880,.07,'sine',.018,160);}
    if(kind==='correct'){tone(523,.12,'triangle',.06,80);setTimeout(()=>tone(784,.2,'triangle',.07,90),90);}
    if(kind==='discipline'){noiseBurst(.28,.12,180);tone(110,.45,'sawtooth',.09,-52);setTimeout(()=>tone(78,.36,'square',.05,-16),120);}
    if(kind==='finish'){[523,659,784].forEach((f,i)=>setTimeout(()=>tone(f,.32,'triangle',.055,45),i*115));}
  }
  function updateAudio(){
    if(!soundOn||!ensureAudio())return;const now=audioContext.currentTime;const speed=Math.min(1,Math.abs(player.vx)/405);const active=state.mode==='play';
    audio.motor.frequency.setTargetAtTime(48+speed*118,now,.05);audio.motorGain.gain.setTargetAtTime(active?(.006+speed*.027):.0001,now,.08);
    const inWind=!player.grounded&&windZones.some(wind=>player.x+player.w/2>wind.x&&player.x+player.w/2<wind.x+wind.w);audio.windGain.gain.setTargetAtTime(inWind?.028:.0001,now,.1);
    if(active&&now>=audio.nextMusic){const themes=[[262,330,392,330],[220,277,330,277],[294,370,440,370]];const notes=themes[state.level]||themes[0];tone(notes[audio.musicStep%notes.length],.44,'sine',.013,0);audio.musicStep++;audio.nextMusic=now+.78;}
  }
  function respawn() {
    state.attempts++;state.shake=12;state.flash=.35;
    player.x=state.checkpoint;player.y=GROUND-player.h;player.vx=player.vy=0;player.grounded=false;player.support=null;
    soundEffect(state.level===2?'fall':'splash');
  }
  function overlap(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;}
  function groundAt(x){return !pits.some(([a,b])=>x>a&&x<b);}
  function solids() {
    const list=platforms.concat(movingPlatforms,obstacles);
    for(let x=0;x<worldWidth;x+=20) if(groundAt(x+10)) list.push({x,y:GROUND,w:20,h:250,type:'ground'});
    return list;
  }
  function update(dt) {
    state.time+=dt;state.shake=Math.max(0,state.shake-dt*35);state.flash=Math.max(0,state.flash-dt);state.lessonCueTime=Math.max(0,state.lessonCueTime-dt);
    if(state.level===3){state.remaining=Math.max(0,state.remaining-dt);if(!state.remaining){discipline('90 секунд минули. Комбат чекає на точні формули.');return;}}
    if(state.mode==='exam'){updateHud();return;}
    for(const platform of movingPlatforms){
      const oldX=platform.x,oldY=platform.y,offset=Math.sin(state.time*platform.speed+platform.phase)*(platform.range/2);
      platform.x=platform.baseX+(platform.axis==='x'?offset:0);platform.y=platform.baseY+(platform.axis==='y'?offset:0);
      platform.dx=platform.x-oldX;platform.dy=platform.y-oldY;
    }
    if(player.support&&movingPlatforms.includes(player.support)){
      player.x=Math.max(0,Math.min(worldWidth-player.w,player.x+player.support.dx));
      player.y+=player.support.dy;
    }
    const accel=player.grounded?2700:1800, maxSpeed=405;
    const onIce=player.grounded&&iceZones.some(([start,end])=>player.x+player.w/2>start&&player.x+player.w/2<end);
    if(onIce&&!state.onIce){soundEffect('ice');if(state.level===2)showLessonCue('Fₜ = μ · N   На льоду зчеплення менше — гальмуй раніше.');}state.onIce=onIce;
    if(keys.left)player.vx=Math.max(-maxSpeed,player.vx-accel*dt);
    else if(keys.right)player.vx=Math.min(maxSpeed,player.vx+accel*dt);
    else player.vx*=Math.exp(-(player.grounded?(onIce?2.3:12):3)*dt);
    if(Math.abs(player.vx)<3)player.vx=0;
    player.jumpBuffer=Math.max(0,player.jumpBuffer-dt);
    player.coyote=player.grounded?.1:Math.max(0,player.coyote-dt);
    if(player.jumpBuffer>0&&player.coyote>0){player.vy=-825;player.grounded=false;player.coyote=0;player.jumpBuffer=0;state.shake=2;soundEffect('jump');}
    if(!keys.jump&&player.vy<-240)player.vy+=1250*dt;
    player.vy=Math.min(1200,player.vy+1950*dt);
    if(!player.grounded)for(const wind of windZones)if(player.x+player.w/2>wind.x&&player.x+player.w/2<wind.x+wind.w)player.vx+=wind.force*dt;

    const prevX=player.x;
    player.x=Math.max(0,Math.min(worldWidth-player.w,player.x+player.vx*dt));
    const solidList=solids();
    for(const s of solidList){if(s.type==='ground'||!overlap(player,s))continue;
      if(player.vx>0&&prevX+player.w<=s.x+8){player.x=s.x-player.w;player.vx=0;}
      else if(player.vx<0&&prevX>=s.x+s.w-8){player.x=s.x+s.w;player.vx=0;}
    }
    const prevY=player.y;player.y+=player.vy*dt;player.grounded=false;player.support=null;
    for(const s of solidList){if(!overlap(player,s))continue;
      if(player.vy>=0&&prevY+player.h<=s.y+12){player.y=s.y-player.h;player.vy=0;player.grounded=true;player.support=s;}
      else if(player.vy<0&&prevY>=s.y+s.h-8){player.y=s.y+s.h;player.vy=0;}
    }
    for(const s of springs){if(overlap(player,s)&&player.vy>=0&&prevY+player.h<=s.y+15){player.y=s.y-player.h;player.vy=-1110;player.grounded=false;player.coyote=0;state.shake=5;burst(s.x+s.w/2,s.y, '#ffcb31',12);soundEffect('spring');if(state.level===0)showLessonCue('F = m · a   Сильніший поштовх швидше змінює рух НРК.');}}
    if(state.level===1&&player.support&&movingPlatforms.includes(player.support))showLessonCue('s = v · t   За однаковий час швидший рух проходить більший шлях.');
    player.wheel+=player.vx*dt/17;
    player.angle+=(Math.max(-.12,Math.min(.12,player.vy/3000))-player.angle)*Math.min(1,dt*8);
    if(player.y>H+110)respawn();
    // Чекпойнт зберігається лише після безпечного приземлення, а не під час падіння над проваллям.
    checkpoints.forEach(x=>{if(player.grounded&&player.x>x&&x>state.checkpoint)state.checkpoint=x;});
    for(const nut of state.nuts){if(nut.taken)continue;const dx=player.x+player.w/2-nut.x,dy=player.y+player.h/2-nut.y;
      if(dx*dx+dy*dy<65*65){nut.taken=true;state.score++;burst(nut.x,nut.y,'#ffd232',13);soundEffect('nut');updateHud();}}
    const nextQuestion=state.examQuestions[state.examStep];
    if(state.level===3&&nextQuestion&&player.x+player.w>nextQuestion.x){openExam(nextQuestion);updateHud();return;}
    if(player.x>worldWidth-220&&state.score===nutPositions.length&&(!state.examQuestions.length||state.examStep===state.examQuestions.length))finish();
    state.camera+=(Math.max(0,Math.min(worldWidth-W,player.x-360))-state.camera)*Math.min(1,dt*4);
    for(const p of state.particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=650*dt;p.life-=dt;}
    state.particles=state.particles.filter(p=>p.life>0);
    updateHud();
  }
  function burst(x,y,color,n){for(let i=0;i<n;i++){const a=i*6.283/n,sp=75+(i*37%110);state.particles.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-60,life:.45+(i%3)*.12,color});}}

  function path(points,fill,stroke='#293137',width=2){ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);for(let i=1;i<points.length;i++)ctx.lineTo(points[i][0],points[i][1]);ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}}
  function line(points,color='#30363a',width=2){ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);for(let i=1;i<points.length;i++)ctx.lineTo(points[i][0],points[i][1]);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke();}
  function roundRect(x,y,w,h,r,fill,stroke='#293137',sw=2){ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=sw;ctx.stroke();}}
  function noise(n){const s=Math.sin(n*127.1+78.233)*43758.5453;return s-Math.floor(s);}
  function cloud(x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle='#ffffffd5';ctx.strokeStyle='#7bbfe4aa';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-75,17);ctx.bezierCurveTo(-89,3,-74,-12,-53,-8);ctx.bezierCurveTo(-49,-32,-20,-36,-5,-17);ctx.bezierCurveTo(15,-48,55,-28,54,-5);ctx.bezierCurveTo(84,-9,90,13,70,20);ctx.bezierCurveTo(26,29,-33,27,-75,17);ctx.fill();ctx.stroke();for(let i=0;i<6;i++)line([[-65+i*20,10],[-52+i*20,2]],'#9ed0e8',1);ctx.restore();}
  function scienceNote(note){
    const x=note.x-state.camera;
    if(x>W+30||x+210<-30)return;
    ctx.save();ctx.translate(x,note.y);ctx.rotate(Math.sin(note.x*.01)*.018);
    ctx.globalAlpha=.54;
    ctx.fillStyle='#325e74';ctx.font='italic 700 26px Georgia, serif';ctx.fillText(note.formula,0,0);
    ctx.fillStyle='#5d7077';ctx.font='700 11px Trebuchet MS, sans-serif';ctx.fillText(note.caption,3,18);
    line([[47,27],[57,42]],'#567f90',1.5);line([[57,42],[52,36]],'#567f90',1.5);line([[57,42],[61,35]],'#567f90',1.5);
    ctx.restore();
  }
  function lessonCue(){
    if(!state.lessonCueTime)return;
    const alpha=Math.min(1,state.lessonCueTime/.45,1.15-(4.4-state.lessonCueTime)/.5);
    ctx.save();ctx.globalAlpha=Math.max(0,alpha)*.9;ctx.textAlign='center';ctx.fillStyle='#19394b';ctx.font='italic 700 21px Georgia, serif';ctx.fillText(state.lessonCue,W/2,90);ctx.strokeStyle='#f7fcffb8';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(W/2-165,102);ctx.lineTo(W/2+165,102);ctx.stroke();ctx.restore();
  }
  function backdrop(){
    if(state.level===2){skyPathBackdrop();return;}
    const sky=ctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,currentLevel.color);sky.addColorStop(.7,'#ecf8fa');sky.addColorStop(1,state.level===1?'#e8dfc5':'#def1df');ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
    for(let i=0;i<12;i++){let x=i*270-(state.camera*.17%270);cloud(x,100+(i%3)*50,.65+(i%3)*.13);}
    ctx.save();ctx.translate(-state.camera*.12,0);for(let k=-1;k<7;k++){let x=k*720;path([[x,GROUND],[x+90,338],[x+165,364],[x+300,260],[x+445,357],[x+560,310],[x+720,GROUND]],'#c8e2ed','#abcddd',2);line([[x+260,308],[x+300,260],[x+356,310]],'#eff9f9',3);}ctx.restore();
    if(state.level===1)workshopBackdrop();
    if(state.level===2)for(let i=0;i<9;i++)cloud(i*210-(state.camera*.28%210),62+(i%2)*58,.46);
    for(const note of scienceNotes)scienceNote(note);
    ctx.save();ctx.translate(-state.camera*.32,0);for(let k=-1;k<22;k++){let x=k*275+40,y=GROUND+12;tree(x,y,.85+(k%3)*.16);}ctx.restore();
    ctx.fillStyle='#d4ebcd';ctx.fillRect(0,GROUND-23,W,40);
  }
  function skyPathBackdrop(){
    const sky=ctx.createLinearGradient(0,0,0,H);
    sky.addColorStop(0,'#172e5e');sky.addColorStop(.42,'#5676af');sky.addColorStop(.72,'#d2e6f1');sky.addColorStop(1,'#f7fbff');
    ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
    for(let i=0;i<40;i++){
      const x=(i*137-state.camera*.045)%1500,y=30+(i*53%210),r=1+(i%3)*.55;
      ctx.globalAlpha=.34+(i%4)*.11;ctx.fillStyle='#fff5c7';ctx.beginPath();ctx.arc(x<0?x+1500:x,y,r,0,7);ctx.fill();
    }
    ctx.globalAlpha=1;
    ctx.save();ctx.translate(-state.camera*.1,0);ctx.globalAlpha=.48;
    for(let k=-1;k<5;k++){
      const x=k*780;
      path([[x,GROUND],[x+145,283],[x+247,353],[x+387,205],[x+515,346],[x+660,266],[x+790,GROUND]],'#8ba5c6','#5d779e',2);
      path([[x+330,267],[x+387,205],[x+435,271]],'#edf7ff','#7592b7',1);
      path([[x+604,305],[x+660,266],[x+706,320]],'#edf7ff','#7592b7',1);
    }
    ctx.restore();
    ctx.save();ctx.translate(-state.camera*.25,0);ctx.globalAlpha=.93;
    for(let i=-2;i<12;i++)cloud(i*190,396+(i%3)*17,1.12+(i%2)*.12);
    ctx.globalAlpha=.72;for(let i=-1;i<10;i++)cloud(i*245+80,454+(i%2)*12,1.35);
    ctx.restore();ctx.globalAlpha=1;
    for(const note of scienceNotes)scienceNote(note);
  }
  function workshopBackdrop(){ctx.save();ctx.translate(-state.camera*.22,0);ctx.globalAlpha=.32;for(let x=-40;x<worldWidth+200;x+=620){line([[x,GROUND-15],[x+70,185],[x+140,GROUND-15]],'#8f7554',9);line([[x+70,185],[x+220,185]],'#8f7554',6);line([[x+150,185],[x+150,245]],'#8f7554',3);ctx.fillStyle='#d6a548';ctx.fillRect(x+140,242,20,17);}ctx.restore();}
  function tree(x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);path([[-7,0],[-5,-95],[5,-95],[9,0]],'#8b7860','#657e6e',2);for(const [dx,dy,r] of [[-28,-91,32],[3,-117,40],[32,-91,30]]){ctx.fillStyle='#8ebfa7';ctx.strokeStyle='#6f9c90';ctx.lineWidth=2;ctx.beginPath();ctx.arc(dx,dy,r,0,7);ctx.fill();ctx.stroke();}for(let i=0;i<15;i++){let px=(noise(i+x)*78)-39,py=-125+noise(i*13+x)*53;line([[px,py],[px+7,py-7]],'#b7d8ae',1.5);}ctx.restore();}
  function groundPiece(a,b){let x=a-state.camera,w=b-a;if(x>W+20||x+w< -20)return;ctx.save();ctx.translate(x,0);
    if(state.level===2){
      path([[0,GROUND],[w,GROUND],[w,H+5],[0,H+5]],'#60778b','#263340',3);
      ctx.fillStyle='#718ca0';ctx.fillRect(0,GROUND+18,w,H-GROUND);
      for(let i=0;i<w/18;i++){const px=i*18+noise(i+a)*12,py=GROUND+28+noise(i*4+a)*75,r=2+noise(i*7+a)*9;ctx.fillStyle=i%3?'#668095':'#9eb5c4';ctx.beginPath();ctx.ellipse(px,py,r,r*.58,.2,0,7);ctx.fill();}
      path([[0,GROUND],[15,GROUND-10],[32,GROUND-5],[49,GROUND-14],[65,GROUND-7],[82,GROUND-13],[99,GROUND-6],[w,GROUND-9],[w,GROUND+9],[0,GROUND+9]],'#f5fbff','#38546a',2);
      ctx.fillStyle='#ccebf3';ctx.fillRect(0,GROUND-5,w,5);ctx.restore();return;
    }
    path([[0,GROUND],[w,GROUND],[w,H+5],[0,H+5]],'#986a43','#313332',3);
    ctx.fillStyle='#b78450';ctx.fillRect(0,GROUND+18,w,H-GROUND);
    for(let i=0;i<w/19;i++){const px=i*19+noise(i+a)*14,py=GROUND+28+noise(i*4+a)*85;let r=2+noise(i*7+a)*10;ctx.fillStyle=i%3?'#9b764e':'#d4a269';ctx.strokeStyle='#6d5946';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(px,py,r,r*.6,.2,0,7);ctx.fill();ctx.stroke();}
    path([[0,GROUND],[15,GROUND-11],[32,GROUND-5],[49,GROUND-15],[65,GROUND-7],[82,GROUND-14],[99,GROUND-6],[w,GROUND-9],[w,GROUND+9],[0,GROUND+9]],'#68b43d','#293629',2);
    ctx.fillStyle='#b5d842';ctx.fillRect(0,GROUND-8,w,5);
    for(let i=0;i<w/12;i++){let px=i*12+noise(i+a)*7,hh=8+noise(i*3+a)*16;line([[px,GROUND-7],[px-3,GROUND-hh]],i%3?'#4b942f':'#8abd3e',2);}
    ctx.restore();}
  function water(a,b){const x=a-state.camera,w=b-a;ctx.save();ctx.translate(x,0);ctx.fillStyle='#348fc9';ctx.fillRect(0,GROUND+26,w,H-GROUND);ctx.fillStyle='#70d0e9';ctx.fillRect(0,GROUND+30,w,7);for(let j=0;j<3;j++){ctx.beginPath();for(let i=0;i<=w;i+=4){const yy=GROUND+25+j*22+Math.sin(i*.065+state.time*3+j)*5;if(i===0)ctx.moveTo(i,yy);else ctx.lineTo(i,yy);}ctx.strokeStyle=j?'#b1e7ee':'#f5ffff';ctx.lineWidth=3;ctx.stroke();}ctx.restore();}
  function cloudGap(a,b){const x=a-state.camera,w=b-a;ctx.save();ctx.translate(x,0);const fade=ctx.createLinearGradient(0,GROUND,0,H);fade.addColorStop(0,'#d5ecf6');fade.addColorStop(1,'#7594bd');ctx.fillStyle=fade;ctx.fillRect(0,GROUND,w,H-GROUND);ctx.globalAlpha=.84;for(let row=0;row<3;row++)for(let i=-1;i<w/78+2;i++)cloud(i*78+(row%2)*25,GROUND+30+row*46,.5);ctx.globalAlpha=1;ctx.strokeStyle='#f8fdff';ctx.lineWidth=3;ctx.setLineDash([7,8]);ctx.beginPath();ctx.moveTo(0,GROUND+8);ctx.lineTo(w,GROUND+8);ctx.stroke();ctx.setLineDash([]);ctx.restore();}
  function icePatch(start,end){const x=start-state.camera,w=end-start;if(x>W||x+w<0)return;ctx.save();ctx.translate(x,0);ctx.fillStyle='#d5f3f7';ctx.fillRect(0,GROUND-8,w,18);ctx.strokeStyle='#75c7da';ctx.lineWidth=2;for(let i=0;i<w;i+=35)line([[i,GROUND+2],[i+15,GROUND-6],[i+28,GROUND+5]],'#9bdae5',2);ctx.restore();}
  function windZone(wind){const x=wind.x-state.camera;if(x>W||x+wind.w<0)return;ctx.save();ctx.globalAlpha=.38;ctx.strokeStyle='#5a9fc1';ctx.lineWidth=3;for(let y=215;y<365;y+=45)for(let px=8;px<wind.w;px+=75){const dir=Math.sign(wind.force);line([[x+px,y],[x+px+dir*36,y]],'#5a9fc1',3);line([[x+px+dir*36,y],[x+px+dir*26,y-6]],'#5a9fc1',2);line([[x+px+dir*36,y],[x+px+dir*26,y+6]],'#5a9fc1',2);}ctx.restore();}
  function platform(p){let x=p.x-state.camera;if(x>W+100||x+p.w< -100)return;ctx.save();ctx.translate(x,p.y);
    if(state.level===2){
      path([[6,5],[p.w-8,3],[p.w-12,30],[p.w-28,48],[21,47],[3,32]],'#6e8799','#293946',3);
      for(let i=0;i<9;i++){const px=14+i*(p.w-28)/9;line([[px,16],[px-5,34]],'#4a6274',2);}
      path([[0,0],[20,-10],[39,-5],[60,-14],[79,-6],[100,-13],[124,-6],[p.w,-8],[p.w,13],[0,13]],'#f6fcff','#385a72',3);
      for(let i=0;i<7;i++)line([[10+i*(p.w-20)/7,-1],[18+i*(p.w-20)/7,-5]],'#9ed1e2',2);ctx.restore();return;
    }
    path([[6,5],[p.w-8,3],[p.w-12,30],[p.w-28,48],[21,47],[3,32]],'#a67645','#3b3830',3);for(let i=0;i<11;i++){let px=12+i*(p.w-24)/11;line([[px,18],[px-4,32]],'#784f35',2);}path([[0,0],[20,-10],[39,-5],[60,-14],[79,-6],[100,-13],[124,-6],[p.w,-8],[p.w,13],[0,13]],'#5faf3c','#344132',3);for(let i=0;i<18;i++){let px=i*p.w/18;line([[px,0],[px-3,-8-noise(i+p.x)*11]],'#3e9036',2);}ctx.restore();}
  function rock(o){ctx.save();ctx.translate(o.x-state.camera,o.y);path([[2,o.h-3],[12,33],[31,10],[59,1],[82,27],[o.w-1,o.h-4]],'#8c9497','#343a3b',3);path([[12,33],[31,10],[39,38],[2,o.h-3]],'#b7bcba','#465052',1);path([[39,38],[59,1],[82,27],[o.w-1,o.h-4],[52,o.h-8]],'#70797e','#42484a',1);line([[16,42],[28,27],[39,38],[48,28]],'#dde1df',3);line([[62,17],[71,31],[65,45]],'#444f52',2);ctx.restore();}
  function box(o){ctx.save();ctx.translate(o.x-state.camera,o.y);roundRect(1,1,o.w-2,o.h-2,2,'#c88a42','#352e27',4);ctx.fillStyle='#e2a75a';ctx.fillRect(9,10,o.w-18,o.h-20);line([[10,11],[o.w-9,o.h-9]],'#7e4e2f',13);line([[o.w-9,11],[10,o.h-9]],'#7e4e2f',13);line([[10,11],[o.w-9,o.h-9]],'#d9a160',6);line([[o.w-9,11],[10,o.h-9]],'#d9a160',6);for(const x of [8,o.w-9])for(const y of [8,o.h-9]){ctx.fillStyle='#373232';ctx.beginPath();ctx.arc(x,y,2.5,0,7);ctx.fill();}ctx.restore();}
  function spring(s){ctx.save();ctx.translate(s.x-state.camera,s.y);roundRect(0,24,s.w,8,2,'#525c5c','#293034',2);line([[15,22],[25,8],[38,23],[51,8],[61,23]],'#333b3e',5);line([[15,22],[25,8],[38,23],[51,8],[61,23]],'#cbd4d1',2);path([[-8,3],[s.w+2,-8],[s.w+8,3],[-2,14]],'#d5a257','#33312f',3);line([[0,7],[s.w-2,-3]],'#ffe2a2',2);ctx.restore();}
  function nut(x,y,scale=1){ctx.save();ctx.translate(x-state.camera,y+Math.sin(state.time*4+x)*5);ctx.scale(scale,scale);ctx.rotate(Math.sin(state.time*2+x)*.1);for(let i=0;i<4;i++){let a=i*1.57+state.time*2;line([[Math.cos(a)*32,Math.sin(a)*32],[Math.cos(a)*38,Math.sin(a)*38]],'#ffc527',3);}let pts=[];for(let i=0;i<6;i++){let a=i*Math.PI/3;pts.push([Math.cos(a)*23,Math.sin(a)*23]);}path(pts,'#d2d8d7','#263238',4);ctx.beginPath();ctx.arc(0,0,10,0,7);ctx.fillStyle='#80919b';ctx.fill();ctx.strokeStyle='#283238';ctx.lineWidth=3;ctx.stroke();line([[-13,-9],[-8,-15],[9,-13]],'#ffffff',2);ctx.restore();}
  function flag(x){ctx.save();ctx.translate(x-state.camera,GROUND);roundRect(-8,-6,30,8,3,'#ad7b43','#33332d',2);line([[5,-6],[5,-125]],'#353a38',5);ctx.fillStyle='#ffdc40';ctx.strokeStyle='#293238';ctx.lineWidth=2;ctx.beginPath();ctx.arc(5,-129,7,0,7);ctx.fill();ctx.stroke();ctx.fillStyle='#fff';ctx.strokeStyle='#303638';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(8,-119);ctx.lineTo(75,-107);ctx.lineTo(69,-57);ctx.lineTo(8,-69);ctx.closePath();ctx.fill();ctx.stroke();for(let row=0;row<3;row++)for(let col=0;col<4;col++)if((row+col)%2===0)path([[9+col*15,-118+row*17],[24+col*15,-115+row*17],[23+col*15,-98+row*17],[9+col*15,-101+row*17]],'#343638',null);ctx.restore();}
  function checkpoint(x,active){ctx.save();ctx.translate(x-state.camera,GROUND);line([[0,-5],[0,-65]],'#445053',3);path([[0,-65],[42,-57],[0,-48]],active?'#ffd247':'#f9f3df','#3f4647',2);ctx.restore();}
  function examGate(question,index){
    const x=question.x-state.camera;if(x>W+80||x<-100)return;const done=index<state.examStep;
    ctx.save();ctx.translate(x,GROUND);line([[0,-5],[0,-124]],'#263f50',5);line([[100,-5],[100,-124]],'#263f50',5);path([[0,-124],[100,-124],[92,-76],[8,-76]],done?'#8dc8a0':'#e8eef0','#263f50',3);ctx.fillStyle='#243f50';ctx.font='700 20px Georgia,serif';ctx.textAlign='center';ctx.fillText(done?'✓':question.formula,50,-94);ctx.restore();
  }
  function car(){ctx.save();ctx.translate(player.x-state.camera,player.y);ctx.translate(player.w/2,player.h/2);ctx.rotate(player.angle);ctx.translate(-player.w/2,-player.h/2);
    roundRect(6,19,65,27,7,'#ffcb31','#252e31',3);path([[20,20],[25,8],[50,8],[61,20]],'#f8d44e','#293238',3);path([[29,11],[47,11],[53,20],[26,20]],'#a7dcf0','#2e3a3f',2);line([[38,11],[38,20]],'#53656b',2);roundRect(63,23,13,7,2,'#e5e1c9','#333',2);line([[11,30],[69,30]],'#fce27a',2);for(const wx of [19,62]){ctx.save();ctx.translate(wx,46);ctx.rotate(player.wheel);ctx.fillStyle='#272d2f';ctx.strokeStyle='#0b1a20';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,12,0,7);ctx.fill();ctx.stroke();ctx.fillStyle='#9aa5a7';ctx.beginPath();ctx.arc(0,0,5,0,7);ctx.fill();ctx.stroke();line([[-10,0],[10,0]],'#5a6467',1);ctx.restore();}line([[10,19],[8,5]],'#3b464a',3);ctx.fillStyle='#f6d039';ctx.beginPath();ctx.arc(8,4,4,0,7);ctx.fill();ctx.stroke();ctx.restore();}
  function render(){ctx.clearRect(0,0,W,H);ctx.save();if(state.shake)ctx.translate((noise(state.time*77)-.5)*state.shake,(noise(state.time*113)-.5)*state.shake);backdrop();
    const edges=[0,...pits.flat(),worldWidth];for(let i=0;i<edges.length-1;i+=2)groundPiece(edges[i],edges[i+1]);
    for(const [a,b] of pits)state.level===2?cloudGap(a,b):water(a,b);
    for(const zone of iceZones)icePatch(...zone);
    for(const wind of windZones)windZone(wind);
    for(const p of platforms)platform(p);
    for(const p of movingPlatforms)platform(p);
    for(const o of obstacles)o.type==='rock'?rock(o):box(o);
    for(const s of springs)spring(s);
    for(const n of state.nuts)if(!n.taken)nut(n.x,n.y);
    for(const cp of checkpoints.slice(1))checkpoint(cp,cp<=state.checkpoint);
    if(state.level===3)state.examQuestions.forEach(examGate);
    flag(worldWidth-145);car();lessonCue();
    for(const p of state.particles){ctx.globalAlpha=Math.min(1,p.life*2);ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x-state.camera,p.y,3,0,7);ctx.fill();}ctx.globalAlpha=1;
    if(player.x>worldWidth-470&&state.score<nutPositions.length){roundRect(worldWidth-525-state.camera,290,255,52,9,'#fffbe8e8','#31383a',2);ctx.fillStyle='#273137';ctx.font='900 17px Trebuchet MS, sans-serif';ctx.fillText(`Збери ще ${nutPositions.length-state.score} гайок!`,worldWidth-508-state.camera,322);}
    ctx.restore();if(state.flash){ctx.fillStyle=`rgba(255,255,255,${state.flash})`;ctx.fillRect(0,0,W,H);}
  }
  function frame(t){const dt=Math.min(.033,(t-lastFrame)/1000||0);lastFrame=t;if(state.mode==='play'||state.mode==='exam')update(dt);updateAudio();render();requestAnimationFrame(frame);}

  function setControl(name,down){if(name==='jump'){if(down&&!keys.jump)player.jumpBuffer=.14;keys.jump=down;}else keys[name]=down;}
  const map={ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',ArrowUp:'jump',KeyW:'jump',Space:'jump'};
  window.addEventListener('keydown',e=>{
    if(state.mode==='exam'&&e.key.length===1){e.preventDefault();answerExam(e.key);return;}
    if(map[e.code]){e.preventDefault();setControl(map[e.code],true);}else if(e.code==='Escape'){e.preventDefault();pause();}else if(e.code==='KeyR'&&state.mode!=='intro'){reset();}
  });
  window.addEventListener('keyup',e=>{if(map[e.code]){e.preventDefault();setControl(map[e.code],false);}});
  window.addEventListener('blur',()=>{keys.left=keys.right=keys.jump=false;if(state.mode==='play')pause();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&state.mode==='play')pause();});
  document.querySelectorAll('[data-control]').forEach(button=>{const name=button.dataset.control;button.addEventListener('pointerdown',e=>{e.preventDefault();button.setPointerCapture(e.pointerId);button.classList.add('pressed');setControl(name,true);});for(const event of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(event,e=>{e.preventDefault();button.classList.remove('pressed');setControl(name,false);});});
  document.querySelectorAll('[data-level]').forEach(button=>button.addEventListener('click',()=>chooseLevel(Number(button.dataset.level))));
  $('pauseButton').addEventListener('click',pause);$('resumeButton').addEventListener('click',pause);$('restartFromPause').addEventListener('click',reset);$('playAgainButton').addEventListener('click',reset);$('levelSelectButton').addEventListener('click',showLevelSelection);
  $('examAgainButton').addEventListener('click',reset);$('examLevelSelectButton').addEventListener('click',showLevelSelection);document.querySelectorAll('[data-answer]').forEach(button=>button.addEventListener('click',()=>answerExam(button.dataset.answer)));
  $('soundButton').addEventListener('click',()=>{soundOn=!soundOn;$('soundButton').innerHTML=soundOn?'♫ <span>ЗВУК УВІМК.</span>':'♫ <span>ЗВУК ВИМК.</span>';$('soundButton').setAttribute('aria-label',soundOn?'Вимкнути звук':'Увімкнути звук');if(soundOn){const context=ensureAudio();if(context&&audio.master){audio.master.gain.setTargetAtTime(.42,context.currentTime,.03);tone(660,.12,'triangle',.05,120);}}else if(audio.master&&audioContext)audio.master.gain.setTargetAtTime(.0001,audioContext.currentTime,.04);});
  state.nuts=nutPositions.map(([x,y])=>({x,y,taken:false}));requestAnimationFrame(frame);
})();
