import {scripts} from './narration-scripts.js';

// One media element preserves pause position and prevents overlapping clips.
export function createNarration() {
 const audio=document.getElementById('narration-audio');
 const toggle=document.getElementById('narration-auto');
 const play=document.getElementById('narration-play');
 const miniPlay=document.getElementById('simulation-narration-play');
 const replay=document.getElementById('narration-replay');
 const title=document.getElementById('narration-title');
 const status=document.getElementById('narration-status');
 const transcript=document.getElementById('narration-transcript');
 let selection='',generation=0;
 function sync(){play.textContent=audio.paused?(audio.currentTime>0&&!audio.ended?'Resume narration':'Play narration'):'Pause narration';play.setAttribute('aria-label',play.textContent);miniPlay.textContent=play.textContent;}
 async function start(){const current=generation;try{await audio.play();if(current===generation){status.textContent='Playing';sync();}}catch(error){if(current===generation&&error.name!=='AbortError'){status.textContent='Press Play to start narration. If audio cannot load, the transcript is below.';sync();}}}
 function select(kind,id,label,{autoplay=false}={}) {
  const key=`${kind}:${id}`;
  if(!scripts[kind]?.[id])return;
  if(selection===key){if(autoplay&&toggle.checked){if(audio.paused)void start();}else if(!autoplay){audio.pause();status.textContent='Paused';sync();}return;}
  generation++;audio.pause();audio.currentTime=0;
  selection=key;audio.src=`audio/${kind}-${id}.mp3`;audio.load();
  title.textContent=label;document.getElementById('simulation-narration-title').textContent=label;transcript.textContent=scripts[kind][id];status.textContent='Ready';sync();
  if(autoplay&&toggle.checked)void start();
 }
 const togglePlay=()=>{if(!selection)return;if(audio.paused)void start();else{audio.pause();status.textContent='Paused';sync();}};
 play.addEventListener('click',togglePlay);miniPlay.addEventListener('click',togglePlay);
 replay.addEventListener('click',()=>{if(!selection)return;audio.currentTime=0;if(audio.error)audio.load();void start();});
 toggle.addEventListener('change',()=>{if(!toggle.checked){audio.pause();status.textContent='Automatic narration off';sync();}});
 audio.addEventListener('play',sync);audio.addEventListener('pause',sync);
 audio.addEventListener('ended',()=>{status.textContent='Finished';sync();});
 audio.addEventListener('error',()=>{status.textContent='Audio could not load. Read the transcript below or press Replay to retry.';sync();});
 document.getElementById('narration-speed').addEventListener('change',event=>{audio.playbackRate=Number(event.target.value);});
 window.addEventListener('pagehide',()=>{generation++;audio.pause();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&!audio.paused){audio.pause();status.textContent='Paused';sync();}});
 return {select};
}
