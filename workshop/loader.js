// Keep a complete static story available if any interactive module fails.
import('./app.js').catch(()=>{
 document.body.classList.remove('graph-expanded');
 const panel=document.getElementById('map-panel');panel.removeAttribute('role');panel.removeAttribute('aria-modal');
 document.querySelectorAll('[inert]').forEach(element=>element.inert=false);
 const message=document.createElement('p');message.className='load-message';message.textContent='The interactive graph could not start. The eight-chapter story is available below; reload to try the graph again.';
 document.getElementById('scene').replaceChildren(message);
 document.querySelectorAll('button').forEach(button=>button.disabled=true);
 document.getElementById('process-summary').hidden=false;
});
