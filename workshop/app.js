import {stages, tools} from './content.js';
import {createScene} from './scene.js';
const $=id=>document.getElementById(id);
const preferFlat=()=>matchMedia('(max-width:760px), (prefers-reduced-motion:reduce)').matches;
const state={stage:'prepare',view:'journey',flat:false,presenter:false,graph:false};
let demo=0;
let graphOpen=false;
const backgroundInert=new Map();
function renderGraphMode(){
  const panel=$('map-panel'), toggle=$('graph-toggle');
  document.body.classList.toggle('graph-expanded',state.graph);
  toggle.setAttribute('aria-expanded',String(state.graph));
  toggle.textContent=state.graph?'Exit full-page graph ×':'Focus on the graph ↗';
  if(state.graph===graphOpen)return;
  graphOpen=state.graph;
  if(graphOpen){
    panel.setAttribute('role','dialog');
    panel.setAttribute('aria-modal','true');
    panel.setAttribute('aria-labelledby','map-heading');
    const outside=[...document.querySelectorAll('body > :not(main):not(script), main > :not(.explorer), .story-panel')];
    outside.forEach(element=>{backgroundInert.set(element,element.inert);element.inert=true});
    toggle.focus({preventScroll:true});
  }else{
    panel.removeAttribute('role');panel.removeAttribute('aria-modal');panel.removeAttribute('aria-labelledby');
    backgroundInert.forEach((inert,element)=>{element.inert=inert});backgroundInert.clear();
    toggle.focus({preventScroll:true});
  }
}
const scene=createScene($('scene'),{nodes:tools,onSelect(id){const stage=stages.find(item=>item.node===id);if(stage)navigate({stage:stage.id})}});
function readURL(){const p=new URLSearchParams(location.search);state.stage=stages.some(s=>s.id===p.get('step'))?p.get('step'):'prepare';state.view=['journey','map','facilitator'].includes(p.get('view'))?p.get('view'):'journey';state.flat=p.has('flat')?p.get('flat')==='1':preferFlat();state.presenter=p.get('present')==='1';state.graph=p.get('graph')==='full';}
function navigate(change){Object.assign(state,change);const u=new URL(location.href);for(const [key,value,defaultValue] of [['step',state.stage,'prepare'],['view',state.view,'journey'],['flat',state.flat?'1':'0',preferFlat()?'1':'0'],['present',state.presenter?'1':'0','0'],['graph',state.graph?'full':'embedded','embedded']]){if(value===defaultValue)u.searchParams.delete(key);else u.searchParams.set(key,value)}if(u.href!==location.href){try{history.pushState({},'',u)}catch{/* Some file viewers cannot write history. The local interaction still works. */}}render(true)}
function render(announce=false){const index=stages.findIndex(s=>s.id===state.stage),stage=stages[index],tool=tools.find(t=>t.id===stage.node);
  $('graph-step-label').textContent=`${String(index+1).padStart(2,'0')} / ${stage.title.toUpperCase()}`;
  $('graph-step-title').textContent=stage.headline;
  $('graph-step-benefit').textContent=stage.benefit;
  $('graph-step-artifact').textContent=stage.artifact;
  $('graph-step-question').textContent=stage.prompt;
  $('graph-step-count').textContent=`${index+1} / ${stages.length}`;
  $('graph-prev').disabled=index===0;
  $('graph-next').disabled=index===stages.length-1;
  $('stage-eyebrow').textContent=`${String(index+1).padStart(2,'0')} / ${stage.eyebrow}`;
  $('step-counter').textContent=`${index+1} of ${stages.length}`;
  for(const [element,field] of [['stage-title','headline'],['stage-description','description'],['stage-benefit','benefit'],['stage-artifact','artifact'],['stage-check','check'],['stage-boundary','boundary'],['teaching-prompt','prompt'],['teaching-exercise','exercise']])$(element).textContent=stage[field];
  for(const [element,field] of [['tool-title','name'],['tool-role','role'],['tool-owns','owns'],['tool-excludes','excludes'],['tool-location','location'],['tool-maturity','maturity']])$(element).textContent=tool[field];
  document.querySelectorAll('[data-stage]').forEach(button=>{if(button.dataset.stage===state.stage)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current')});
  document.querySelectorAll('[data-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.view===state.view)));
  $('prev-stage').disabled=index===0;$('next-stage').disabled=index===stages.length-1;
  $('next-stage').replaceChildren(document.createTextNode(index===stages.length-1?'Journey complete':'Next step →'));
  $('stage-progress').replaceChildren(...stages.map((s,i)=>{const dot=document.createElement('span');dot.className=i===index?'active':'';dot.setAttribute('aria-hidden','true');return dot}));
  $('technical-panel').hidden=state.view!=='map';$('facilitator-panel').hidden=state.view!=='facilitator';
  $('flat-toggle').setAttribute('aria-pressed',String(state.flat));$('flat-toggle').textContent=state.flat?'Use 3D view':'Use flat view';
  document.querySelectorAll('.scene-controls button').forEach(b=>b.disabled=state.flat);
  document.body.classList.toggle('presentation',state.presenter);$('presenter-toggle').setAttribute('aria-pressed',String(state.presenter));$('presenter-toggle').textContent=state.presenter?'Exit presentation':'Presentation mode';
  renderGraphMode();
  scene.selectNode(stage.node);scene.setMode(state.flat?'flat':'spatial');
  if(announce)$('announcement').textContent=`Step ${index+1}: ${stage.title}. ${stage.headline}`;
}
document.querySelectorAll('[data-stage]').forEach(button=>button.addEventListener('click',()=>navigate({stage:button.dataset.stage})));
document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>navigate({view:button.dataset.view})));
function advance(delta){const index=stages.findIndex(s=>s.id===state.stage),next=stages[index+delta];if(next)navigate({stage:next.id})}
$('graph-prev').addEventListener('click',()=>advance(-1));$('graph-next').addEventListener('click',()=>advance(1));
$('prev-stage').addEventListener('click',()=>advance(-1));$('next-stage').addEventListener('click',()=>advance(1));
$('graph-toggle').addEventListener('click',()=>navigate({graph:!state.graph}));
$('flat-toggle').addEventListener('click',()=>navigate({flat:!state.flat}));
$('rotate-left').addEventListener('click',()=>scene.rotate(-12));$('rotate-right').addEventListener('click',()=>scene.rotate(12));$('zoom-out').addEventListener('click',()=>scene.zoomBy(-.1));$('zoom-in').addEventListener('click',()=>scene.zoomBy(.1));$('reset-camera').addEventListener('click',()=>scene.reset());
$('presenter-toggle').addEventListener('click',()=>navigate({presenter:!state.presenter}));
window.addEventListener('popstate',()=>{readURL();render(true)});
document.addEventListener('keydown',event=>{if(state.graph){
  if(event.key==='Escape'){event.preventDefault();navigate({graph:false});return}
  if(event.key==='Tab'){
    const controls=[...$('map-panel').querySelectorAll('button:not(:disabled),a[href]')].filter(element=>element.getClientRects().length);
    const first=controls[0],last=controls[controls.length-1];
    if(event.shiftKey&&event.target===first){event.preventDefault();last.focus();return}
    if(!event.shiftKey&&event.target===last){event.preventDefault();first.focus();return}
  }
}if(event.key==='Escape'&&state.presenter){navigate({presenter:false});return}if(event.altKey||event.ctrlKey||event.metaKey||event.shiftKey)return;const element=event.target;if(element.closest('input,textarea,select,[contenteditable=true]'))return;if(element.closest('.steps,.story-navigation')&&['ArrowLeft','ArrowRight'].includes(event.key)){event.preventDefault();advance(event.key==='ArrowRight'?1:-1)}});
$('demo-action').addEventListener('click',()=>{demo=(demo+1)%3;const status=$('demo-status');status.classList.toggle('failed',demo===1);status.classList.toggle('corrected',demo===2);if(demo===1){status.textContent='CHECK FAILED · Expected 1 request. Observed 2.';$('demo-evidence').textContent='Return to the bounded build task. Keep the same acceptance check.';$('demo-action').textContent='Inspect the corrected example →';navigate({stage:'build'})}else if(demo===2){status.textContent='ILLUSTRATIVE RECHECK · Expected 1. Observed 1.';$('demo-evidence').textContent='One check passes in this example. Review the exact candidate, then inspect the other checks.';$('demo-action').textContent='Reset the example ↺';navigate({stage:'review'})}else{status.textContent='Ready to inspect the behavior.';$('demo-evidence').textContent='A visible page is only the beginning of the check.';$('demo-action').textContent='Try the duplicate check ↗'}$('announcement').textContent=status.textContent});
readURL();
if (!CSS.supports('transform-style', 'preserve-3d')) state.flat = true;
render();
