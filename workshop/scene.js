const positions = [
  {x:85,y:352,h:35}, {x:250,y:217,h:64}, {x:419,y:311,h:82},
  {x:554,y:139,h:112}, {x:718,y:38,h:145}
];
export function createScene(host, {nodes, onSelect}) {
  let camera = {yaw:-24,pitch:53,zoom:1}, selected = nodes[0].id, flat = false;
  let activePointer = null, origin = null, dragged = false;
  host.replaceChildren();
  const cameraEl = document.createElement('div'); cameraEl.className = 'scene-camera';
  const world = document.createElement('div'); world.className = 'scene-world';
  const floor = document.createElement('div'); floor.className = 'scene-floor'; floor.setAttribute('aria-hidden','true'); world.append(floor);
  const ns='http://www.w3.org/2000/svg', svg=document.createElementNS(ns,'svg');
  svg.classList.add('paths'); svg.setAttribute('viewBox','0 0 860 520'); svg.setAttribute('aria-hidden','true');
  const path=document.createElementNS(ns,'path'); path.setAttribute('d','M140 396 C200 396 190 261 305 261 S400 355 474 355 S520 183 609 183 S704 82 773 82'); svg.append(path);
  const feedback=document.createElementNS(ns,'path'); feedback.classList.add('feedback-path'); feedback.setAttribute('d','M773 82 C900 470 500 545 305 261'); svg.append(feedback);const workflow=document.createElementNS(ns,'path');workflow.classList.add('workflow-path');workflow.setAttribute('d','M773 82 C925 260 880 455 650 420 S535 375 474 355');svg.append(workflow);world.append(svg);
  const buttons = new Map();
  nodes.forEach((node,index)=>{
    const p=positions[index], station=document.createElement('div'); station.className='station'; station.style.left=`${p.x}px`;station.style.top=`${p.y}px`;station.style.setProperty('--height',`${p.h}px`);
    ['top','front','side'].forEach(face=>{const el=document.createElement('div');el.className=`station-face station-${face}`;el.setAttribute('aria-hidden','true');station.append(el)});
    const button=document.createElement('button');button.type='button';button.className='station-label';button.dataset.station=node.id;button.setAttribute('aria-label',`${node.name}: ${node.role}`);
    const name=document.createElement('strong');name.textContent=node.name;
    const role=document.createElement('span');role.textContent=node.role;button.append(name,role);
    button.addEventListener('click',event=>{if(dragged){event.preventDefault();return}selectNode(node.id);onSelect(node.id)});
    station.append(button);world.append(station);buttons.set(node.id,{button,station,height:p.h});
  });
  const marker=document.createElement('div');marker.className='scene-marker';marker.setAttribute('aria-hidden','true');world.append(marker);cameraEl.append(world);host.append(cameraEl);
  function draw(){
    const fit=Math.min(host.clientWidth/1040,host.clientHeight/480,host.closest('.graph-expanded')?2.5:1.1);
    const yaw=camera.yaw*Math.PI/180, pitch=camera.pitch*Math.PI/180;
    // Center the raised labels, rather than the ground plane beneath them.
    const projected=positions.map(p=>(
      (Math.sin(yaw)*(p.x+55-430)+Math.cos(yaw)*(p.y+42-260))*Math.cos(pitch)
      -(p.h+45)*Math.sin(pitch)
    ));
    const midpoint=(Math.min(...projected)+Math.max(...projected))/2;
    cameraEl.style.transform=`translateY(${(-midpoint-32)*fit*camera.zoom}px) scale(${fit*camera.zoom}) rotateX(${camera.pitch}deg) rotateZ(${camera.yaw}deg)`;
    buttons.forEach(({button,height})=>button.style.transform=`translateZ(${height+45}px) rotateZ(${-camera.yaw}deg) rotateX(${-camera.pitch}deg)`);
  }
  const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));
  function setCamera(next){camera={yaw:clamp(next.yaw??camera.yaw,-65,65),pitch:clamp(next.pitch??camera.pitch,25,65),zoom:clamp(next.zoom??camera.zoom,.7,1.4)};draw()}
  function selectNode(id){selected=id;buttons.forEach(({button,station},key)=>{button.setAttribute('aria-pressed',String(key===selected));station.classList.toggle('selected',key===selected)})}
  function pointerDown(event){if(flat||event.button!==0)return;activePointer=event.pointerId;origin={x:event.clientX,y:event.clientY,...camera};dragged=false;}
  function pointerMove(event){if(event.pointerId!==activePointer||!origin)return;const dx=event.clientX-origin.x,dy=event.clientY-origin.y;if(Math.abs(dx)>7){dragged=true;host.classList.add('is-dragging');if(!host.hasPointerCapture(event.pointerId))host.setPointerCapture(event.pointerId);setCamera({yaw:origin.yaw+dx*.18,pitch:origin.pitch-dy*.12})}}
  function pointerEnd(event){if(event.pointerId!==activePointer)return;if(host.hasPointerCapture(event.pointerId))host.releasePointerCapture(event.pointerId);activePointer=null;origin=null;host.classList.remove('is-dragging');setTimeout(()=>{dragged=false},0)}
  host.addEventListener('pointerdown',pointerDown);host.addEventListener('pointermove',pointerMove);host.addEventListener('pointerup',pointerEnd);host.addEventListener('pointercancel',pointerEnd);
  const resize = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(draw) : null;
  if (resize) resize.observe(host); else window.addEventListener('resize', draw);
  selectNode(selected);draw();
  return {selectNode,setCamera,getCamera:()=>({...camera}),rotate:(yaw,pitch=0)=>setCamera({yaw:camera.yaw+yaw,pitch:camera.pitch+pitch}),zoomBy:delta=>setCamera({zoom:camera.zoom+delta}),reset:()=>setCamera({yaw:-24,pitch:53,zoom:1}),setMode(mode){flat=mode==='flat';host.classList.toggle('scene-flat',flat);draw()},destroy(){if(resize)resize.disconnect();else window.removeEventListener('resize',draw);host.removeEventListener('pointerdown',pointerDown);host.removeEventListener('pointermove',pointerMove);host.removeEventListener('pointerup',pointerEnd);host.removeEventListener('pointercancel',pointerEnd);host.replaceChildren()}};
}
