import React, {useEffect, useMemo, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Waves, Play, Square, Shuffle, SlidersHorizontal, Shell, ChevronDown, Eraser} from 'lucide-react';
const MATERIALS=[
 {t:'THE STONES',img:'stones',d:'Rounded fragments of the shoreline. Their dry little collisions become rhythms shaped by time and tide.'},
 {t:'THE SHELLS',img:'cowries',d:'Little chambers of the ocean, carrying hollow echoes and delicate clicks from another world.'},
 {t:'THE TIGER COWRIE',img:'tiger-cowrie',d:'Spotted and glossy, a held breath of the reef. Its toothed lip answers with a bright, dry rattle.'},
 {t:'THE SHELL STRINGS',img:'shell-strings',d:'Hundreds of small spirals threaded together, clicking softly like rain on a tin roof.'},
 {t:'THE SHELL CHIMES',img:'shell-chimes',d:'A loose curtain of shells that sway and whisper against one another with every breath of air.'},
 {t:'THE DRIFTWOOD',img:'driftwood',d:'Weathered by countless tides, these fragments of wood bring dry knocks and earthy textures.'},
 {t:'THE SEA GLASS',img:'sea-glass',d:'Once discarded, now softened by the sea. Tiny fragments carrying bright, delicate tones.'},
 {t:'THE TIDELINE REMNANTS',img:'plastic-bottle',d:'Traces of human presence, washed ashore and transformed into unexpected textures.'},
 {t:'THE FOAM BOX',img:'foam-box',d:'A pitted slab of sea-worn foam, giving soft, papery taps and a muffled hush.'},
 {t:'THE BELLS',img:'bells',d:'Small brass bells that ring warm and shimmering at the lightest touch, then fade like a far-off buoy.'}
];
import './style.css';

const files = [
 ['Foam box kick 1','sample_foam_box_kick_1.wav','Kick'],['Foam box kick 2','sample_foam_box_kick_2.wav','Kick'],['Foam box snap','sample_foam_box_snap.wav','Snap'],
 ['Sea shell closed hat 1','sample_sea_shell_hihat_closed_1.wav','Hat'],['Sea shell closed hat 2','sample_shell_hihat_closed_2.wav','Hat'],['Shell shaker 1','sample_shell_shaker1.wav','Shaker'],
 ['Shell shaker 2','sample_shell_shaker_2.wav','Shaker'],['Shell shaker 3','sample_shell_shaker_3.wav','Shaker'],['Shell shaker 4','sample_shell_shaker_4.wav','Shaker'],
 ['Shell maracas 1','sample_shell_maracas_1.wav','Shaker'],['Shell maracas 2','sample_shell_maracas_2.wav','Shaker'],['Shell maracas 3','sample_shell_maracas_3.wav','Shaker'],
 ['Driftwood 1','sample_drift_wood_1.wav','Wood'],['Driftwood 2','sample_drift_wood_2.wav','Wood'],['Driftwood 3','sample_drift_wood_3.wav','Wood'],['Driftwood 3 alt','sample_drift_wood_3-1.wav','Wood'],['Driftwood 4','sample_drift_wood_4.wav','Wood'],['Driftwood 5','sample_drift_wood_5.wav','Wood'],['Driftwood 6','sample_drift_wood_6.wav','Wood'],
 ['Driftwood guiro 1','sample_drift_wood_guiros_1.wav','Scrape'],['Driftwood guiro 2','sample_drift_wood_guiros_2.wav','Scrape'],['Shell guiro 1','sample_shell_guiro_1.wav','Scrape'],['Shell guiro 2','sample_shell_guiro_2.wav','Scrape'],
 ['Bell','sample_bell.wav','Metal'],['Bell on bell 1','sample_bell_on_bell_1.wav','Metal'],['Bell on bell 2','sample_bell_on_bell_2.wav','Metal'],['Bell on bell 3','sample_bell_on_bell_3.wav','Metal'],['Door bell','sample_door_bell_1.wav','Metal'],['Shell on bell','sample_shell_on_bell.wav','Metal'],['Small shell chime 1','sample_small_shell_chime_1.wav','Metal'],['Small shell chime 2','sample_small_shell_chime_2.wav','Metal'],
 ['Shell 1','sample_shell_1.wav','Shell'],['Shell 2','sample_shell_2.wav','Shell'],['Shell on shell 1','sample_shell_on_shell_1.wav','Shell'],['Shell on shell 2','sample_shell_on_shell_2.wav','Shell'],['Shell on shell 3','sample_shell_on_shell_3.wav','Shell'],['Shell on shell 4','sample_shell_on_shell_4.wav','Shell'],['Rock 1','sample_rock_1.wav','Stone'],['Rock 2','sample_rock_2.wav','Stone'],['Rock on shell','sample_rock_on_shell_1.wav','Stone'],['Sand on foam 1','sample_sand_on_foambox_1.wav','Texture'],['Sand on foam 2','sample_sand_on_foam_box_2.wav','Texture'],['Broken glass','sample_broken_glass.wav','Glass'],['Glass churi 1','sample_glass_churi_1.wav','Glass'],['Glass churi 2','sample_glass_churi_2.wav','Glass'],['Plastic bottle 1','sample_plactic_bottle_1.wav','Plastic'],['Plastic bottle 2','sample_plastic_bottle_2.wav','Plastic'],['Plastic bottle 3','sample_plastic_bottle_3.wav','Plastic'],['Shell cabasa 1','sample_shell_cabasa_1.wav','Shaker'],['Shell cabasa 2','sample_shell_cabasa_2.wav','Shaker'],['Shell cabasa 3','sample_shell_cabasa_3.wav','Shaker'],['Shell cabasa 4','sample_shell_cabasa_4.wav','Shaker'],['Shell shekere 1','sample_shell_shekere_1.wav','Shaker'],['Shell shekere 2','sample_shell_shekere_2.wav','Shaker']
] .map((x,i)=>({id:i,name:x[0],file:x[1],kind:x[2],material:({Kick:'Foam packaging',Snap:'Foam packaging',Hat:'Sea shells',Shaker:'Sea shells',Wood:'Driftwood',Scrape:'Driftwood & shells',Metal:'Metal & shells',Shell:'Sea shells',Stone:'Stone',Texture:'Sand & foam',Glass:'Glass',Plastic:'Plastic'}[x[2]]||'Found object')}));
const genres=['House','UK Garage','Jungle','Breakbeat','Downtempo','Experimental'];
const padNames=['KICK','LOW HIT','SNAP','CL HAT','OPEN HAT','SHAKER','SHELL','WOOD','GUIRO','BELL','CHIME','STONE','GLASS','BOTTLE','TEXTURE','RATTLE'];
const pick=(kind,idx=0)=>{const a=files.filter(f=>f.kind===kind);return a[idx%a.length]||files[idx%files.length]};
const voiceLabel=(row)=>{const sample=files.find(f=>f.id===row.sampleId)||files[0];const sameKind=files.filter(f=>f.kind===sample.kind);const ordinal=sameKind.findIndex(f=>f.id===sample.id)+1;return `${sample.kind.toUpperCase()} ${String(ordinal).padStart(2,'0')}`};
function makePattern(genre, seed=Math.random){
 const p=Array.from({length:16},()=>Array(16).fill(false));
 const set=(row,steps)=>steps.forEach(s=>p[row][s%16]=true);
 if(genre==='House'){set(0,[0,4,8,12]);set(3,[2,6,10,14]);set(2,[4,12]);set(5,[0,2,4,6,8,10,12,14]);set(9,[7,15]);}
 if(genre==='UK Garage'){set(0,[0,7,10]);set(2,[4,12]);set(3,[2,6,10,14]);set(5,[0,3,4,7,8,11,12,15]);set(8,[3,11]);}
 if(genre==='Jungle'){set(0,[0,5,8,11,14]);set(2,[4,12]);set(3,[2,6,10,14]);set(5,[0,2,3,4,6,8,10,11,12,14]);set(8,[3,7,11,15]);}
 if(genre==='Breakbeat'){set(0,[0,6,10]);set(2,[4,12]);set(3,[2,6,10,14]);set(5,[0,2,4,6,8,10,12,14]);set(7,[3,11]);}
 if(genre==='Downtempo'){set(0,[0,8]);set(2,[4,12]);set(3,[4,12]);set(5,[2,6,10,14]);set(9,[7]);}
 if(genre==='Experimental'){for(let r=0;r<16;r++)for(let s=0;s<16;s++)if(seed()<[.12,.07,.16,.2,.08,.22,.14,.12,.18,.1,.12,.13,.06,.08,.16,.2][r])p[r][s]=true;}
 // Humanised generative details, with restraint
 for(let r=0;r<16;r++)for(let s=0;s<16;s++)if(!p[r][s]&&seed()< (genre==='Experimental'?.10:.025))p[r][s]=true;
 return p;
}
function App(){
 const [matsOpen,setMatsOpen]=useState(false),[matsSeen,setMatsSeen]=useState(false);
 const [genre,setGenre]=useState('House'),[bpm,setBpm]=useState(124),[pattern,setPattern]=useState(()=>makePattern('House')),[playing,setPlaying]=useState(false),[step,setStep]=useState(-1),[selected,setSelected]=useState(0),[master,setMaster]=useState(78),[seaLevel,setSeaLevel]=useState(24),[seaMist,setSeaMist]=useState(42),[seaPlaying,setSeaPlaying]=useState(false),[shimmer,setShimmer]=useState(18),[seaName]=useState('BBC Seaside · 29.7 sec'),[fx,setFx]=useState({pitch:0,bitcrush:0,compression:10,reverb:0,reverbType:'spring',delay:0,delayType:'analog',delayNote:'1/8',filter:100,drive:5}),[swing,setSwing]=useState(8),[volume,setVolume]=useState(Array(16).fill(78));
 const ctx=useRef(null), buffers=useRef({}), nodes=useRef(null), timer=useRef(null), nextStep=useRef(0), nextTime=useRef(0), playingRef=useRef(false), patternRef=useRef(pattern), bpmRef=useRef(bpm), fxRef=useRef(fx), seaRef=useRef(null), seaSource=useRef(null), seaGain=useRef(null), seaPlayingRef=useRef(false), ambienceOut=useRef(null), seaFilter=useRef(null), seaReverb=useRef(null), seaReverbWet=useRef(null), shimmerSend=useRef(null), shimmerFilter=useRef(null), shimmerDelay=useRef(null), shimmerFeedback=useRef(null), shimmerWet=useRef(null), seaPan=useRef(null), seaPanLfo=useRef(null), masterRef=useRef(null), stepRef=useRef(-1);
 useEffect(()=>{patternRef.current=pattern},[pattern]);useEffect(()=>{bpmRef.current=bpm},[bpm]);useEffect(()=>{fxRef.current=fx; if(nodes.current){
 const t=ctx.current.currentTime,n=nodes.current;
 n.filter.frequency.setTargetAtTime(120+fx.filter/100*17880,t,.05);
 if(n.lastBitcrush!==fx.bitcrush){n.crusher.curve=makeBitcrush(fx.bitcrush);n.lastBitcrush=fx.bitcrush;}
 if(n.lastDrive!==fx.drive){n.drive.curve=makeDrive(fx.drive);n.lastDrive=fx.drive;}
 n.comp.threshold.setTargetAtTime(-6-(fx.compression/100)*34,t,.05);
 n.comp.ratio.setTargetAtTime(1+(fx.compression/100)*11,t,.05);
 n.springWet.gain.setTargetAtTime(fx.reverb/100*.24,t,.08);
 n.springFeedback.gain.setTargetAtTime(.22+(fx.reverb/100)*.22,t,.08);
 n.delayGain.gain.setTargetAtTime(fx.delay/100*.26,t,.08);
 n.delay.delayTime.setTargetAtTime(delaySeconds(fx.delayNote,bpmRef.current),t,.08);
 n.feedback.gain.setTargetAtTime(.16+(fx.delay/100)*.28,t,.08);
 n.delayTone.frequency.setTargetAtTime(3400,t,.08);
 }} ,[fx,bpm]);
 const init=async()=>{if(ctx.current)return;const c=new (window.AudioContext||window.webkitAudioContext)();ctx.current=c;const input=c.createGain(),filter=c.createBiquadFilter(),crusher=c.createWaveShaper(),drive=c.createWaveShaper(),dry=c.createGain(),springDelay=c.createDelay(.08),springTone=c.createBiquadFilter(),springFeedback=c.createGain(),springWet=c.createGain(),delay=c.createDelay(1),delayTone=c.createBiquadFilter(),feedback=c.createGain(),delayGain=c.createGain(),comp=c.createDynamicsCompressor(),masterGain=c.createGain();
 filter.type='lowpass';filter.frequency.value=18000;crusher.curve=makeBitcrush(0);crusher.oversample='none';drive.curve=makeDrive(8);drive.oversample='2x';dry.gain.value=1;springDelay.delayTime.value=.031;springTone.type='bandpass';springTone.frequency.value=1450;springTone.Q.value=1.15;springFeedback.gain.value=.22;springWet.gain.value=0;delay.delayTime.value=delaySeconds(fxRef.current.delayNote,bpmRef.current);delayTone.type='lowpass';delayTone.frequency.value=3400;delayTone.Q.value=.35;feedback.gain.value=.16;delayGain.gain.value=0;comp.threshold.value=-12;comp.ratio.value=2;comp.knee.value=18;comp.attack.value=.003;comp.release.value=.18;masterGain.gain.value=master/100;
 // Clear signal flow: input → tone → bit depth → gentle saturation → dry/space sends → compressor → master.
 input.connect(filter);filter.connect(crusher);crusher.connect(drive);
 drive.connect(dry);dry.connect(comp);
 drive.connect(springDelay);springDelay.connect(springTone);springTone.connect(springFeedback);springFeedback.connect(springDelay);springTone.connect(springWet);springWet.connect(comp);
 drive.connect(delay);delay.connect(delayTone);delayTone.connect(feedback);feedback.connect(delay);delayTone.connect(delayGain);delayGain.connect(comp);
 comp.connect(masterGain);masterGain.connect(c.destination);
 nodes.current={input,filter,crusher,drive,dry,springDelay,springTone,springFeedback,springWet,delay,delayTone,feedback,delayGain,comp,masterGain,lastBitcrush:0,lastDrive:8};
 // Dedicated sea-atmosphere chain: softened source, diffuse reverb, filtered shimmer echoes and slow stereo drift.
 const ambOut=c.createGain(),seaTone=c.createBiquadFilter(),seaPanNode=c.createStereoPanner(),seaVerb=c.createConvolver(),seaVerbWet=c.createGain(),seaVerbDry=c.createGain();
 seaTone.type='lowpass';seaTone.frequency.value=2300;seaTone.Q.value=.55;seaPanNode.pan.value=0;
 const impulseLength=Math.floor(c.sampleRate*4.2),impulse=c.createBuffer(2,impulseLength,c.sampleRate);
 for(let ch=0;ch<2;ch++){const data=impulse.getChannelData(ch);for(let i=0;i<impulseLength;i++){const fade=Math.pow(1-i/impulseLength,3.2);data[i]=(Math.random()*2-1)*fade;}}
 seaVerb.buffer=impulse;seaVerbWet.gain.value=.42;seaVerbDry.gain.value=.82;
 const shSend=c.createGain(),shTone=c.createBiquadFilter(),shDelay=c.createDelay(1),shFeedback=c.createGain(),shWet=c.createGain(),shReturn=c.createGain();
 shTone.type='bandpass';shTone.frequency.value=3400;shTone.Q.value=.8;shDelay.delayTime.value=.37;shFeedback.gain.value=.28;shWet.gain.value=.12;shReturn.gain.value=.7;
 shSend.connect(shTone);shTone.connect(shDelay);shDelay.connect(shFeedback);shFeedback.connect(shTone);shDelay.connect(shWet);shWet.connect(shReturn);shReturn.connect(ambOut);
 seaTone.connect(seaVerbDry);seaVerbDry.connect(ambOut);seaTone.connect(seaVerb);seaVerb.connect(seaVerbWet);seaVerbWet.connect(ambOut);
 const lfo=c.createOscillator(),lfoDepth=c.createGain();lfo.type='sine';lfo.frequency.value=.075;lfoDepth.gain.value=.22;lfo.connect(lfoDepth);lfoDepth.connect(seaPanNode.pan);lfo.start();
 seaPanNode.connect(seaTone);ambOut.connect(masterGain);ambienceOut.current=seaPanNode;seaFilter.current=seaTone;seaReverb.current=seaVerb;seaReverbWet.current=seaVerbWet;shimmerSend.current=shSend;shimmerFilter.current=shTone;shimmerDelay.current=shDelay;shimmerFeedback.current=shFeedback;shimmerWet.current=shWet;seaPan.current=seaPanNode;seaPanLfo.current=lfo;
 const decoded={};await Promise.all(files.map(async f=>{try{const r=await fetch('/samples/'+f.file);const b=await r.arrayBuffer();decoded[f.id]=await c.decodeAudioData(b)}catch(e){console.warn('Could not load',f.file,e)}}));buffers.current=decoded;
 // Load the supplied shoreline recording as the built-in default ambience.
 try{
   const seaResponse=await fetch('/audio/shoreline.wav');
   if(!seaResponse.ok) throw new Error('Sea ambience file unavailable');
   seaRef.current=await c.decodeAudioData(await seaResponse.arrayBuffer());
 }catch(e){console.warn('Could not load built-in sea ambience',e)}
 };
 const ensure=async()=>{await init();if(ctx.current.state==='suspended')await ctx.current.resume()};
 function delaySeconds(note,tempo){const beats=note==='1/4'?1:note==='1/8'?.5:note==='1/16'?.25:note==='1/32'?.125:1;return Math.max(.03,Math.min(1.5,(60/tempo)*beats))}

function makeDrive(amount){const n=44100,curve=new Float32Array(n),k=1+amount*0.045;for(let i=0;i<n;i++){const x=i*2/n-1;curve[i]=Math.tanh(k*x)/Math.tanh(k)}return curve}
 function makeBitcrush(amount){const n=65536,curve=new Float32Array(n),bits=Math.max(3,Math.round(16-(amount/100)*12)),levels=Math.pow(2,bits-1),mix=amount/100;for(let i=0;i<n;i++){const x=i*2/n-1,q=Math.round(x*levels)/levels;curve[i]=x*(1-mix)+q*mix}return curve}
 const playSample=async(file,vel=1,when=null)=>{await ensure();const c=ctx.current,b=buffers.current[file.id];if(!b)return;const src=c.createBufferSource(),g=c.createGain();src.buffer=b;src.detune.value=fxRef.current.pitch;g.gain.value=vel;src.connect(g);g.connect(nodes.current.input);src.start(when??c.currentTime)};
 const triggerRow=(row,when)=>{const chosen=files.find(f=>f.id===row.sampleId)||pick(row.kind||'Wood');const b=buffers.current[chosen.id];if(!b)return;const c=ctx.current,src=c.createBufferSource(),g=c.createGain(),pan=c.createStereoPanner();src.buffer=b;src.detune.value=fxRef.current.pitch;g.gain.value=(volume[row.index]||78)/100;pan.pan.value=row.index%2?0.12:-0.12;src.connect(g);g.connect(pan);pan.connect(nodes.current.input);src.start(when)};
 const [rows,setRows]=useState(()=>{const kinds=['Kick','Kick','Snap','Hat','Hat','Shaker','Shell','Wood','Scrape','Metal','Metal','Stone','Glass','Plastic','Texture','Shaker'];return kinds.map((k,i)=>({index:i,name:padNames[i],kind:k,sampleId:pick(k,i).id}))});
 const rowsRef=useRef(rows);
 const commitRows=(nextRows)=>{rowsRef.current=nextRows;setRows(nextRows)};
 const shufflePattern=()=>{
  const previous=patternRef.current;
  let fresh;
  for(let attempt=0;attempt<12;attempt++){
   fresh=makePattern(genre);
   const density=genre==='Experimental'?.34:genre==='Downtempo'?.24:.30;
   for(let r=0;r<16;r++){
    const active=fresh[r].map((v,s)=>v?s:-1).filter(s=>s>=0);
    // Move a few existing hits to nearby syncopated positions, then add/remove accents.
    const edits=genre==='Experimental'?4:3;
    for(let k=0;k<edits;k++){
     const from=active.length?active[Math.floor(Math.random()*active.length)]:Math.floor(Math.random()*16);
     if(Math.random()<.62){fresh[r][from]=false;const shift=[1,2,3,15][Math.floor(Math.random()*4)];fresh[r][(from+shift)%16]=true;}
     else fresh[r][Math.floor(Math.random()*16)]=Math.random()<.72;
    }
    for(let s=0;s<16;s++)if(Math.random()<density*.12)fresh[r][s]=!fresh[r][s];
   }
   // Keep the downbeat foundation genre-aware.
   if(genre==='House') [0,4,8,12].forEach(s=>fresh[0][s]=true);
   if(genre==='Downtempo') [0,8].forEach(s=>fresh[0][s]=true);
   if(fresh.some((row,r)=>row.some((v,s)=>v!==previous[r][s])))break;
  }
  setPattern(fresh);
 };
 const shuffleSounds=()=>{const oldRows=rowsRef.current;const nextRows=oldRows.map(row=>{const choices=files.filter(file=>file.id!==row.sampleId);const next=choices[Math.floor(Math.random()*choices.length)];return {...row,sampleId:next.id}});commitRows(nextRows)};
 const choosePadSample=(rowIndex,sampleId)=>{const nextRows=rowsRef.current.map((row,i)=>i===rowIndex?{...row,sampleId:Number(sampleId)}:row);commitRows(nextRows)};
 const changeGenre=g=>{setGenre(g);setPattern(makePattern(g));setBpm(({House:124,'UK Garage':132,Jungle:168,Breakbeat:126,Downtempo:92,Experimental:118})[g])};
 const start=async()=>{await ensure();if(playingRef.current)return;playingRef.current=true;setPlaying(true);nextStep.current=0;nextTime.current=ctx.current.currentTime+.04;const tick=()=>{if(!playingRef.current)return;const c=ctx.current,interval=60/bpmRef.current/4;while(nextTime.current<c.currentTime+.12){const s=nextStep.current, swingOffset=(s%2===1?interval*(swing/100)*.45:0),at=nextTime.current+swingOffset;patternRef.current.forEach((row,r)=>{if(row[s])triggerRow(rowsRef.current[r],at)});setTimeout(()=>{if(playingRef.current)setStep(s)},Math.max(0,(at-c.currentTime)*1000));nextStep.current=(nextStep.current+1)%16;nextTime.current+=interval;}timer.current=setTimeout(tick,25)};tick()};
 const stop=()=>{playingRef.current=false;setPlaying(false);setStep(-1);clearTimeout(timer.current)};
 useEffect(()=>()=>{stop();if(seaSource.current){try{seaSource.current.stop()}catch{}}ctx.current?.close()},[]);
 const clearPattern=()=>setPattern(old=>old.map(row=>row.map(()=>false)));
 const toggle=async(r,s)=>{const turningOn=!patternRef.current[r]?.[s];setPattern(old=>old.map((row,i)=>row.map((v,j)=>i===r&&j===s?!v:v)));if(!turningOn)return;try{await ensure();const row=rowsRef.current[r];if(row)triggerRow(row,ctx.current.currentTime)}catch(e){console.warn('Preview failed',e)}};
 const stopSea=()=>{seaPlayingRef.current=false;setSeaPlaying(false);if(seaSource.current){try{seaSource.current.stop()}catch{}seaSource.current=null;}if(seaGain.current){try{seaGain.current.disconnect()}catch{}seaGain.current=null;}};
 const startSea=()=>{if(!ctx.current||!seaRef.current||seaPlayingRef.current)return;const c=ctx.current,src=c.createBufferSource(),gain=c.createGain();src.buffer=seaRef.current;src.loop=true;gain.gain.value=seaLevel/100*.55;src.connect(gain);gain.connect(ambienceOut.current||nodes.current.masterGain);if(shimmerSend.current)gain.connect(shimmerSend.current);src.start();seaSource.current=src;seaGain.current=gain;seaPlayingRef.current=true;setSeaPlaying(true);};
 const toggleSea=async()=>{if(seaPlayingRef.current){stopSea();return;}await ensure();if(!seaRef.current){console.warn('Sea ambience is not available');return;}startSea();};
 useEffect(()=>{if(!ctx.current)return;const t=ctx.current.currentTime;if(seaGain.current)seaGain.current.gain.setTargetAtTime(seaLevel/100*.55,t,.12);if(seaFilter.current)seaFilter.current.frequency.setTargetAtTime(700+seaMist*38,t,.18);if(seaReverbWet.current)seaReverbWet.current.gain.setTargetAtTime(.12+(seaMist/100)*.72,t,.18);if(shimmerWet.current)shimmerWet.current.gain.setTargetAtTime((shimmer/100)*.42,t,.12);if(shimmerFeedback.current)shimmerFeedback.current.gain.setTargetAtTime(.12+(shimmer/100)*.34,t,.12);if(shimmerFilter.current)shimmerFilter.current.frequency.setTargetAtTime(1800+shimmer*58,t,.15);},[seaLevel,seaMist,shimmer]);
 return <div className="app"><div className="cover"/><header><div className="brand"><Waves size={19}/><span>REDOWAN'S SEASHORE FINDS</span><i>GENERATIVE PERCUSSION</i></div><div className="header-right"><span className="live-dot"/> BROWSER INSTRUMENT <span className="version">V 1.0</span></div></header>
 <main><section className="hero"><div><p className="eyebrow">FIELD-RECORDED OBJECTS · RHYTHMIC EXPERIMENTS</p><h1>Redowan's<br/><em>sea shore findings.</em></h1><p className="intro">A living percussion instrument built from driftwood, shells, glass, stone and the small sounds left behind by the tide.</p></div><div className="hero-note"><span>01 / 54</span><small>FOUND SOUNDS<br/>FROM THE SHORE</small></div></section>
 <section className="transport panel"><div className="transport-left"><button className={'play '+(playing?'active':'')} onClick={playing?stop:start}>{playing?<Square size={16}/>:<Play size={16} fill="currentColor"/>}{playing?'STOP':'PLAY'}</button><button className="random" onClick={shufflePattern}><Shuffle size={15}/> SHUFFLE PATTERN</button><button type="button" className={'random materials-btn '+(matsOpen?'open':'')} aria-expanded={matsOpen} aria-controls="materials-panel" onClick={()=>{setMatsOpen(o=>!o);setMatsSeen(true)}}><Shell size={15}/><span>MATERIALS &amp; INSTRUMENTS</span><ChevronDown size={13} className="chev"/></button><button className="random" onClick={shuffleSounds}><Waves size={15}/> SHUFFLE SOUNDS</button><div className="pitch-control"><label>MASTER PITCH <b>{fx.pitch>0?"+":""}{Math.round(fx.pitch/100)} st</b></label><input className="pitch-range" aria-label="Master pitch" type="range" min="-12" max="12" step="1" value={fx.pitch/100} style={{background:fx.pitch===0?"linear-gradient(to right,#ffffff22 0%,#ffffff22 49.6%,#efcfd0 49.6%,#efcfd0 50.4%,#ffffff22 50.4%,#ffffff22 100%)":fx.pitch>0?`linear-gradient(to right,#ffffff22 0%,#ffffff22 49.6%,#efcfd0 49.6%,#efcfd0 50.4%,#ffffff22 50.4%,#ffffff22 100%),linear-gradient(to right,transparent 50%,#70aaa8 50%,#70aaa8 ${50+(fx.pitch/2400)*100}%,transparent ${50+(fx.pitch/2400)*100}%)`:`linear-gradient(to right,#ffffff22 0%,#ffffff22 49.6%,#efcfd0 49.6%,#efcfd0 50.4%,#ffffff22 50.4%,#ffffff22 100%),linear-gradient(to right,transparent ${50+(fx.pitch/2400)*100}%,#70aaa8 ${50+(fx.pitch/2400)*100}%,#70aaa8 50%,transparent 50%)`}} onChange={e=>setFx({...fx,pitch:Math.round(+e.target.value*100)})}/></div></div><div className="tempo"><label>TEMPO</label><strong>{bpm}</strong><span>BPM</span><input aria-label="Tempo" type="range" min="60" max="190" value={bpm} onChange={e=>setBpm(+e.target.value)}/></div><div className="genre"><label>RHYTHM WORLD</label><select value={genre} onChange={e=>changeGenre(e.target.value)}>{genres.map(g=><option key={g}>{g}</option>)}</select></div><div id="materials-panel" className={'materials-panel '+(matsOpen?'open':'')} role="region" aria-label="Materials and instruments" aria-hidden={!matsOpen}><div className="materials-inner"><div className="materials-note"><h3>A TRIBUTE TO THE SHORE</h3><p>Growing up, my family and I shared a deep affection for the beaches of Bangladesh. Over years of trips, we collected little souvenirs from the shore: shells, driftwood, broken glass and other forgotten treasures shaped by the sea. For this sample library, I revisited those objects, recorded their unique timbres, and turned their natural textures into playable sounds. It is a way of appreciating the sea all over again, not just for its beauty, but for the unexpected music it leaves behind.</p></div><div className="materials-grid">{matsSeen&&MATERIALS.map(m=><figure className="mat" key={m.t}><img src={`/images/materials/${m.img}.webp`} width="640" height="480" loading="lazy" decoding="async" alt={m.t}/><figcaption><b>{m.t}</b><p>{m.d}</p></figcaption></figure>)}</div></div></div></section>
 <section className="sequencer panel"><div className="section-head"><div><p className="eyebrow">01 — PATTERN GENERATOR</p><h2>Shoreline sequence</h2></div><span className="steps-label">16 STEPS · 4 BARS OF MOTION</span></div><div className="grid-wrap"><div className="step-head"><div className="track-label">VOICE</div>{Array.from({length:16},(_,i)=><div key={i} className={'step-num '+(i%4===0?'bar':'')}>{i+1}</div>)}</div>{rows.map((row,r)=><div className="track" key={r}><button className={'track-label '+(selected===r?'chosen':'')} onClick={()=>setSelected(r)}><span className="track-name">{voiceLabel(row)}</span><small>{files.find(f=>f.id===row.sampleId)?.material||row.kind}</small></button>{pattern[r].map((on,s)=><button key={s} aria-label={`${voiceLabel(row)} step ${s+1}`} onClick={()=>toggle(r,s)} className={`cell ${on?'on':''} ${s%4===0?'bar':''} ${step===s&&playing?'current':''}`}/>)}</div>)}</div><div className="sequencer-foot"><span><i className="legend-on"/> ACTIVE STEP</span><span>CLICK ANY CELL TO EDIT</span><span>SWING <b>{swing}%</b> <input type="range" min="0" max="60" value={swing} onChange={e=>setSwing(+e.target.value)}/></span></div><div className="sequencer-actions"><button type="button" className="clear-btn" onClick={clearPattern} disabled={!pattern.some(r=>r.some(Boolean))}><Eraser size={14}/> CLEAR PATTERN</button></div></section>
 <section className="lower"><div className="panel sounds"><div className="section-head"><div><p className="eyebrow">02 — FOUND OBJECTS</p><h2>Sample collection</h2></div><span className="count">54 SOUNDS</span></div><div className="pads">{rows.map((row,i)=>{const sample=files.find(f=>f.id===row.sampleId)||files[0];return <div key={i} className={'pad '+(selected===i?'selected':'')}><button type="button" className="pad-audition" onClick={()=>{setSelected(i);playSample(sample)}} aria-label={`Audition ${sample.name}`}><span className="pad-no">{String(i+1).padStart(2,'0')}</span><span className="pad-title">{sample.name}</span><span className="pad-type">{row.name} · SAMPLE {String(sample.id+1).padStart(2,'0')}</span></button><select className="pad-select" aria-label={`Choose sample for ${row.name}`} value={row.sampleId} onChange={e=>{choosePadSample(i,e.target.value);setSelected(i)}}>{files.map(f=><option key={f.id} value={f.id}>{f.name} · {f.material}</option>)}</select></div>})}</div><p className="hint">Tap a pad to audition. Use its sample menu to load any sound from the collection into that voice.</p>
 <details className="library-browser"><summary><span>Browse sample library</span><small>54 recordings · materials &amp; source objects</small></summary><div className="library-list">{files.map(f=><div className="library-item" key={f.id}><div><b>{String(f.id+1).padStart(2,'0')} · {f.name}</b><small>{f.material} <span>—</span> {f.kind}</small></div><button type="button" onClick={()=>playSample(f)} aria-label={`Preview ${f.name}`}><Play size={12} fill="currentColor"/> Preview</button></div>)}</div></details></div>
 <div className="side"><div className="panel ambience"><div className="section-head"><div><p className="eyebrow">03 — ENVIRONMENT</p><h2>Sea atmosphere</h2></div><button type="button" className={'sea-toggle '+(seaPlaying?'is-playing':'')} onClick={toggleSea} aria-label={seaPlaying?'Stop sea ambience':'Play sea ambience'} title={seaPlaying?'Stop sea ambience':'Play sea ambience'}>{seaPlaying?<Square size={17} fill="currentColor"/>:<Waves size={19}/>}</button></div><p className="small-copy">A softened shoreline bed with drifting stereo space, hazy reverb and delicate filtered shimmer echoes.</p><div className="file-name">{seaName} · BUILT-IN FIELD RECORDING</div><div className="slider-line"><span>SEA LEVEL</span><b>{seaLevel}%</b></div><input className="wide-slider" type="range" min="0" max="100" value={seaLevel} onChange={e=>setSeaLevel(+e.target.value)}/><div className="slider-line"><span>MIST / DIFFUSION</span><b>{seaMist}%</b></div><input aria-label="Mist and diffusion" className="wide-slider" type="range" min="0" max="100" value={seaMist} onChange={e=>setSeaMist(+e.target.value)}/><div className="slider-line"><span>SHIMMER</span><b>{shimmer}%</b></div><input className="wide-slider" type="range" min="0" max="100" value={shimmer} onChange={e=>setShimmer(+e.target.value)}/><div className="ends"><span>OPAQUE / CLOSE</span><span>DIFFUSE / GLASSY</span></div></div>
 <div className="panel effects"><div className="section-head"><div><p className="eyebrow">04 — DSP</p><h2>Sound shaping</h2></div><SlidersHorizontal size={18}/></div>
 <div className="dsp-controls">
  <div className="dsp-group"><div className="dsp-group-title">DYNAMICS & TONE</div><div className="dsp-basic-grid">
  <div className="fx-control"><div><span>COMPRESSION</span><b>{fx.compression}%</b></div><input className="wide-slider" type="range" min="0" max="100" value={fx.compression} onChange={e=>setFx({...fx,compression:+e.target.value})}/></div>
  <div className="fx-control"><div><span>BITCRUSH</span><b>{fx.bitcrush}%</b></div><input className="wide-slider" type="range" min="0" max="100" value={fx.bitcrush} onChange={e=>setFx({...fx,bitcrush:+e.target.value})}/></div>
  <div className="fx-control"><div><span>SATURATION</span><b>{fx.drive}%</b></div><input className="wide-slider" type="range" min="0" max="100" value={fx.drive} onChange={e=>setFx({...fx,drive:+e.target.value})}/></div>
  <div className="fx-control"><div><span>LOW-PASS FILTER</span><b>{fx.filter}%</b></div><input className="wide-slider" type="range" min="0" max="100" value={fx.filter} onChange={e=>setFx({...fx,filter:+e.target.value})}/></div>
  </div></div>
  <div className="dsp-group"><div className="dsp-group-title">REVERB</div>
  <div className="fx-control"><div><span>TYPE</span></div><select className="dsp-select" value={fx.reverbType} onChange={e=>setFx({...fx,reverbType:e.target.value})}><option value="spring">Spring</option></select></div>
  <div className="fx-control"><div><span>AMOUNT</span><b>{fx.reverb}%</b></div><input className="wide-slider" type="range" min="0" max="100" value={fx.reverb} onChange={e=>setFx({...fx,reverb:+e.target.value})}/></div>
  </div>
  <div className="dsp-group"><div className="dsp-group-title">DELAY</div>
  <div className="fx-control"><div><span>TYPE</span></div><select className="dsp-select" value={fx.delayType} onChange={e=>setFx({...fx,delayType:e.target.value})}><option value="analog">Analog</option></select></div>
  <div className="fx-control"><div><span>NOTE DIVISION</span></div><select className="dsp-select" value={fx.delayNote} onChange={e=>setFx({...fx,delayNote:e.target.value})}><option>1/4</option><option>1/8</option><option>1/16</option><option>1/32</option></select></div>
  <div className="fx-control"><div><span>AMOUNT</span><b>{fx.delay}%</b></div><input className="wide-slider" type="range" min="0" max="100" value={fx.delay} onChange={e=>setFx({...fx,delay:+e.target.value})}/></div>
  </div>
 </div></div></div></section>
 <footer><div><Waves size={16}/> <b>REDOWAN'S SEASHORE FINDS</b><span>GENERATIVE PERCUSSION</span></div><p>MADE FROM FOUND THINGS · PLAYED INTO NEW PLACES</p><span>WEB AUDIO · V1.0</span></footer></main></div>
}

createRoot(document.getElementById('root')).render(<App/>);
