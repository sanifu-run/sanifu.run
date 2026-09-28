'use strict';
function downloadBrief(text,name='sanifu-learner-brief.txt'){const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
document.getElementById('manual-form').addEventListener('submit',event=>{event.preventDefault();const data=new FormData(event.currentTarget);const text='Sanifu learner brief — prepared locally, not submitted\n\n'+Array.from(data,([k,v])=>k+':\n'+String(v).trim()).join('\n\n');downloadBrief(text);document.getElementById('manual-status').textContent='Your brief was downloaded. Nothing was submitted. Bring it to your free call.'});

const backgroundVideo=document.getElementById('chat-background-video');
const configuredVideoUrl=window.SANIFU_CONFIG?.videoUrl;
if(backgroundVideo&&configuredVideoUrl){
  try{
    const url=new URL(configuredVideoUrl);
    if(url.protocol!=='https:'||!url.hostname.endsWith('.cloudfront.net'))throw new Error('Invalid video URL');
    let targetTime=0,seeking=false,previousX=null;
    const seek=()=>{if(seeking||!Number.isFinite(backgroundVideo.duration))return;seeking=true;backgroundVideo.currentTime=targetTime};
    backgroundVideo.addEventListener('loadedmetadata',()=>{if(backgroundVideo.duration>0){targetTime=backgroundVideo.duration/2;seek()}});
    backgroundVideo.addEventListener('seeked',()=>{seeking=false;backgroundVideo.hidden=false;document.body.classList.add('has-chat-video');if(Math.abs(backgroundVideo.currentTime-targetTime)>.04)seek()});
    backgroundVideo.addEventListener('error',()=>{backgroundVideo.hidden=true;document.body.classList.remove('has-chat-video')});
    if(window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches){
      window.addEventListener('pointermove',event=>{if(event.pointerType!=='mouse'||previousX===null){previousX=event.clientX;return}targetTime=Math.max(0,Math.min(backgroundVideo.duration,targetTime+(event.clientX-previousX)/innerWidth*.8*backgroundVideo.duration));previousX=event.clientX;seek()},{passive:true});
    }
    backgroundVideo.src=url.href;
  }catch{/* Keep the static Sanifu background when video configuration is invalid. */}
}
