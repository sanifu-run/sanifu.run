'use strict';
const backgroundVideo=document.getElementById('chat-background-video');
const configuredVideoUrl=window.SANIFU_CONFIG?.videoUrl;
if(backgroundVideo&&configuredVideoUrl){
  try{
    const url=new URL(configuredVideoUrl);
    if(url.protocol!=='https:'||!url.hostname.endsWith('.cloudfront.net'))throw new Error('Invalid video URL');
    let targetTime=0,seeking=false,previousX=null;
    const motionAllowed=window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)');
    const seek=()=>{if(seeking||!Number.isFinite(backgroundVideo.duration))return;seeking=true;backgroundVideo.currentTime=targetTime};
    backgroundVideo.addEventListener('loadedmetadata',()=>{if(backgroundVideo.duration>0){targetTime=backgroundVideo.duration/2;seek()}});
    backgroundVideo.addEventListener('seeked',()=>{seeking=false;backgroundVideo.hidden=false;document.body.classList.add('has-chat-video');if(motionAllowed.matches&&Math.abs(backgroundVideo.currentTime-targetTime)>.04)seek()});
    backgroundVideo.addEventListener('error',()=>{backgroundVideo.hidden=true;document.body.classList.remove('has-chat-video')});
    motionAllowed.addEventListener('change',()=>{previousX=null;if(!motionAllowed.matches)targetTime=backgroundVideo.currentTime});
    window.addEventListener('pointermove',event=>{if(!motionAllowed.matches||event.pointerType!=='mouse'){previousX=null;return}if(previousX===null){previousX=event.clientX;return}targetTime=Math.max(0,Math.min(backgroundVideo.duration,targetTime+(event.clientX-previousX)/innerWidth*.8*backgroundVideo.duration));previousX=event.clientX;seek()},{passive:true});
    backgroundVideo.src=url.href;
  }catch{/* Keep the static Sanifu background when video configuration is invalid. */}
}
