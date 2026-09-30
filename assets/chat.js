/* Saved conversations use private recovery tokens; no credential belongs in source. */
(function(){
'use strict';
const form=document.getElementById('askForm');if(!form)return;
const input=document.getElementById('q'),thread=document.getElementById('thread'),voice=document.getElementById('voiceBtn');
const status=document.getElementById('chat-status'),select=document.getElementById('chat-history'),newButton=document.getElementById('chat-new'),deleteButton=document.getElementById('chat-delete');
const endpoint=window.SANIFU_CONFIG?.chatEndpoint||'';
const siteBookingUrl='https://cal.com/david-ndungu/sanifu-scope?utm_source=sanifu.run&utm_medium=website&utm_campaign=sanifu_pilot';
if(!endpoint){
 const panel=document.getElementById('chat-panel'),launch=document.getElementById('chat-launcher');
 panel.classList.add('unavailable');
 panel.setAttribute('aria-label','Sanifu prepared questions and answers');
 const disclosure=document.querySelector('.chat-disclosure');
 disclosure.textContent='Prepared answers only. No conversation is submitted or saved here. Please don’t share secrets or private client information.';
 document.querySelector('.chat-footnote').textContent='The manual brief is not sent to David. Download it to bring to your free call; he designs your custom agenda afterward.';
 function open(){panel.hidden=false;launch.setAttribute('aria-expanded','true');document.getElementById('chat-close').focus()}
 function close(){panel.hidden=true;launch.setAttribute('aria-expanded','false');launch.focus()}
 document.querySelectorAll('[data-chat-open]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();open()}));launch.onclick=open;document.getElementById('chat-close').onclick=close;
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden&&!launch.hidden)close()});
 document.getElementById('chat-history-wrap').hidden=true;document.querySelector('.chat-actions').hidden=true;
 const suggestions=document.getElementById('chat-suggestions');
 const quickAnswers=new Map([
  ['I have an app idea. Where do I start?','Try this: “When [person] needs to [task], they should be able to [result].” Then name one action and one check that would show it works. A small request tracker with sample data is one possible first exercise; David chooses the actual workshop scope with you on the free call.'],
  ['How do I check that an AI-built app works?','Choose one expected behavior and one failure case before accepting the result. For a request tracker, try a valid request, a blank title and a repeated submit. Check what actually happens. Those checks give evidence for that small slice; security, data handling and deployment need separate review. In a workshop, you practice making these decisions and running the checks.'],
  ['What could I automate in my work?','Look for one repeated task with a clear input and a result you can check, such as preparing an editable summary from sample intake answers. Bring the real workflow to the free call, but keep private client data out of this site.'],
  ['How can I build software without knowing how to code?','You can explore the software path if you are comfortable using a computer. You define the task, direct a coding agent, inspect its work and test the result. David guides you; you do most of the building. Four hours is for an agreed small first version, not a whole production app.'],
  ['Can you help me build and train an ML model?','Start with the decision the model should support and a simple rule it must beat. The ML path is usually for experienced engineers. David checks your task, data, baseline, supported model path and costs before proposing a workshop. Training may fit that scope; Zerfoo is the default when suitable. No accuracy result is promised.'],
  ['What does a workshop cost?','The free fit-and-scope call comes first. The pilot price is $300 for each of the first five paid four-hour workshops, subject to availability and a written proposal. Preparation is included. External tools and deployment depend on the agreed scope.'],
  ['Why pay for a workshop when I can use AI and free tutorials?','Choose Sanifu when you want live feedback on your own project: help defining one useful change, reviewing what the agent produced, and checking meaningful failure cases. The pilot includes four live hours, preparation, written next steps, and one batch of follow-up questions within seven days, up to 30 minutes of David’s time. You do the building. The free scope call helps you decide whether that guidance is worth the fee.'],
  ['What projects has David built?','David’s projects include Zerfoo for ML in Go, Serenity for project memory, Dira for decision records, Kazi for checking agent work, AgentGavel for testing agent governance, and Ajent for sharing useful knowledge and software. Explore the portfolio below. These are examples of David’s work; tools are chosen for your scope.'],
  ['What is AMOS?','AMOS is a planned open-source application foundation for accounts, subscriptions, deployment, and operations. David is creating it to help developers focus on their business features. Its vision does not establish a working release. It is not currently available as a Sanifu workshop platform or required for your workshop.'],
  ['Who is David?','David’s published biography describes more than 20 years building software, including engineering roles at Zendesk, a consultancy and a software business. His work on testing, production systems and customer handover informs how he teaches you to choose a useful first slice, check it and keep working afterward. This is his own career account; Sanifu does not yet have verified learner outcomes.'],
  ['What is your email and phone number?','Email david@ndungu.dev or call +1 (415) 234-7604. The phone line reaches Sanifu’s AI assistant, which can explain the workshops and point you to the free scope-call page. It cannot book the call for you by phone yet.']
 ]);
 suggestions.hidden=false;suggestions.setAttribute('aria-label','Prepared answers while the AI is offline');suggestions.querySelector('p').textContent='Quick answers';
 suggestions.querySelectorAll('button').forEach(button=>{button.hidden=!quickAnswers.has(button.dataset.prompt||button.textContent.trim())});
 const welcome=bubble('ai','Want to build software or work through an ML idea? I can help you choose a first step.');
 const choices=document.createElement('div');choices.className='offline-options';
 const manual=document.createElement('a');manual.href='#manual';manual.textContent='Write a brief';choices.append(manual);
 const call=document.createElement('a');call.href=siteBookingUrl;call.textContent='Book a free call';call.target='_blank';call.rel='noopener noreferrer';
 const primary=document.createElement('div');primary.className='chat-suggestions';for(const [label,question] of [['Build an app','I have an app idea. Where do I start?'],['Explore ML','Can you help me build and train an ML model?']]){const button=document.createElement('button');button.type='button';button.textContent=label;button.onclick=()=>preparedReply(question);primary.append(button)}
 const phone=document.createElement('a');phone.href='tel:+14152347604';phone.textContent='Call AI: +1 (415) 234-7604';
 const welcomeActions=document.createElement('div');welcomeActions.className='offline-options';welcomeActions.append(call,phone);welcome.append(primary,welcomeActions);document.querySelector('.conversation-tools').append(choices);
 function preparedReply(question){
  bubble('user',question);
  const text=quickAnswers.get(question)||'The AI intake is not connected yet, so I can’t answer a new question. Nothing was sent or saved. You can choose a prepared question, write a brief, or book a free call.';
  const answer=bubble('ai',text);
  if(question==='Who is David?'){const link=document.createElement('a');link.href='https://ndungu.dev/about/';link.textContent=' Read his published biography.';link.target='_blank';link.rel='noopener noreferrer';answer.append(link)}
  if(question==='What projects has David built?'){const link=document.createElement('a');link.href='#portfolio';link.textContent=' Explore David’s projects.';answer.append(link)}
  status.textContent=quickAnswers.has(question)?'Prepared answer · not AI-generated':'AI offline · your message was not sent';
  thread.scrollTop=thread.scrollHeight;
 }
 suggestions.addEventListener('click',event=>{const button=event.target.closest('button');if(button&&!button.hidden)preparedReply(button.dataset.prompt||button.textContent.trim())});
 form.addEventListener('submit',event=>{event.preventDefault();const question=input.value.trim();if(!question)return;preparedReply(question);input.value='';input.style.height='';input.focus({preventScroll:true})});
 input.addEventListener('keydown',event=>{if(event.key==='Enter'&&!event.shiftKey&&!event.isComposing){event.preventDefault();form.requestSubmit()}});
 form.hidden=false;status.textContent='Prepared answers · AI offline';thread.scrollTop=thread.scrollHeight;return;
}
const conversationURL=endpoint.replace(/\/ask$/,'/conversation'),titleURL=conversationURL+'/title',storageKey='sanifu-chat-v1';
const pendingTitle='Start a conversation';
function isPendingTitle(value){return typeof value==='string'&&['start a conversation','new conversation','sanifu conversation'].includes(value.toLowerCase().replace(/^[\s.!?…"']+|[\s.!?…"']+$/g,''))}
const greeting='Hi! I can help you explore a software or ML workshop. What’s your name and email so David can follow up with you? Sanifu will never sell your information or spam you. Sharing is optional — you can skip this and ask a question.';
const suggestions=document.getElementById('chat-suggestions');
suggestions.addEventListener('click',e=>{if(e.target.matches('button')&&!asking&&!unanswered){input.value=e.target.dataset.prompt||e.target.textContent;input.focus()}});
let briefSnapshot=null;
let asking=false,unanswered=false,persistent=true,chats=[],token='',booking=null,bookingCard=null;
const titlePending=new Map();
function randomToken(){return Array.from(crypto.getRandomValues(new Uint8Array(32)),b=>b.toString(16).padStart(2,'0')).join('')}
function save(deleted=''){try{const stored=JSON.parse(localStorage.getItem(storageKey)||'null');if(stored&&Array.isArray(stored.chats)){const known=new Map(stored.chats.filter(c=>c&&/^[a-f0-9]{64}$/.test(c.token)&&typeof c.title==='string').map(c=>[c.token,{...c,title:isPendingTitle(c.title)?pendingTitle:c.title}]));for(const c of chats)known.set(c.token,{...c,title:isPendingTitle(c.title)?pendingTitle:c.title});known.delete(deleted);chats=Array.from(known.values())}localStorage.setItem(storageKey,JSON.stringify({current:token,chats}));persistent=true}catch{persistent=false}}
function notice(){status.textContent=persistent?'Saved for your next visit in this browser. Transcript copies are emailed to David.':'Transcript copies are emailed to David, but this browser cannot save its recovery key. Keep this page open to continue.'}
function options(){save();select.replaceChildren();for(const c of chats){const option=document.createElement('option');option.value=c.token;option.textContent=c.title;select.append(option)}select.value=token;const title=chats.find(c=>c.token===token)?.title;document.getElementById('chat-current-title').textContent=title&&!isPendingTitle(title)?title:'AI guide for software and ML learning'}
function briefReady(){const b=briefSnapshot?.brief;return !!b&&b.status!=='approved'&&b.sourceTurns===briefSnapshot.turns.length&&briefText.value===b.text}
function busy(value){asking=value;document.querySelectorAll("#brief-panel button,#brief-generate").forEach(b=>b.disabled=value||unanswered);document.getElementById('brief-approve').disabled=value||unanswered||!briefReady();input.disabled=value||unanswered;voice.disabled=value||unanswered;form.querySelector('[type="submit"]').disabled=value||unanswered;select.disabled=value;newButton.disabled=value;deleteButton.disabled=value;document.querySelectorAll('[data-book-call]').forEach(b=>b.disabled=value||unanswered);form.setAttribute('aria-busy',String(value))}
function render(text){
 const fragment=document.createDocumentFragment(),pattern=/\[([^\]]+)\]\(([^)\s]+)\)/g;let offset=0,match;
 function plain(value){value.split('\n').forEach((line,i)=>{if(i)fragment.append(document.createElement('br'));fragment.append(document.createTextNode(line))})}
 while((match=pattern.exec(text))){plain(text.slice(offset,match.index));let url;try{url=new URL(match[2])}catch{}
  if(url&&url.href==='https://cal.com/david-ndungu/sanifu-scope'){const button=document.createElement('button');button.type='button';button.className='retry';button.dataset.bookCall='';button.textContent=match[1];button.onclick=openBooking;fragment.append(button)}else if(url&&url.protocol==='https:'&&(['sanifu.run','www.sanifu.run','cal.com','ajent.social','github.com','kazi.sire.run','sire.run'].includes(url.hostname)||url.href==='https://ndungu.dev/about/')){const link=document.createElement('a');link.href=url.href;link.textContent=match[1];link.target='_blank';link.rel='noopener noreferrer';fragment.append(link)}else plain(match[1]);offset=pattern.lastIndex;
 }plain(text.slice(offset));return fragment;
}
function bubble(role,text){const row=document.createElement('div');row.className='msg '+role;row.setAttribute('aria-label',role==='ai'?'Sanifu':'You');const body=document.createElement('div');body.className='bubble';const label=document.createElement('div');label.className='message-label';const avatar=document.createElement('span');avatar.className='message-avatar';avatar.setAttribute('aria-hidden','true');avatar.textContent=role==='ai'?'S':'Y';label.append(avatar,document.createTextNode(role==='ai'?'Sanifu':'You'));const content=document.createElement('div');content.className='message-content';content.append(endpoint?render(text):document.createTextNode(text));body.append(label,content);row.append(body);thread.append(row);thread.scrollTop=thread.scrollHeight;return body}
function retry(body,message,action){const content=body.querySelector('.message-content')||body;content.textContent=message+' ';const button=document.createElement('button');button.type='button';button.className='retry';button.textContent='Try again';button.onclick=()=>{if(!asking)action()};content.append(button)}
async function request(url,init={},forToken=token){const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),70000);try{const response=await fetch(url,{...init,headers:{'Content-Type':'application/json','X-Conversation-Token':forToken},signal:controller.signal,cache:'no-store'});if(!response.ok){const messages={409:'This conversation has another reply in progress. Wait a moment, then retry.',413:'This conversation is full. Start a new chat to continue.',429:'The chat is busy or has reached its request limit. Try again later or book a call below.',503:'The assistant or saved chats are unavailable. Please try again.',502:'The AI service could not answer just now.'};const err=new Error(messages[response.status]||'Your request could not be completed.');err.status=response.status;throw err}return response.status===204?null:response.json()}finally{clearTimeout(timeout)}}
function errorText(err){return err.name==='AbortError'?'The request took too long. Your message may already be saved.':err instanceof TypeError?'The chat could not be reached.':err.message}
function setTitle(forToken,value){if(typeof value!=='string'||isPendingTitle(value))return;const entry=chats.find(c=>c.token===forToken);if(entry){entry.title=value.trim().slice(0,80);options()}}
function generateTitle(forToken){if(titlePending.has(forToken))return titlePending.get(forToken);const run=(async()=>{try{let data;try{data=await request(titleURL,{method:'POST',body:'{}'},forToken)}catch(err){if(err.status!==409)throw err;const current=await request(conversationURL,{},forToken);data=current.title&&!isPendingTitle(current.title)?current:await request(titleURL,{method:'POST',body:'{}'},forToken)}setTitle(forToken,data.title)}catch{/* Keep a neutral local label when title generation is unavailable. */}finally{titlePending.delete(forToken)}})();titlePending.set(forToken,run);return run}
async function ask(q,id=crypto.randomUUID(),addUser=true){
 if(asking)return;busy(true);suggestions.hidden=false;input.value='';input.style.height='';if(addUser)bubble('user',q);const pending=bubble('ai','···');pending.classList.add('pending-dots');
 const entry=chats.find(c=>c.token===token);if(entry&&isPendingTitle(entry.title)){entry.title='Sanifu conversation';options()}
 try{const data=await request(endpoint,{method:'POST',body:JSON.stringify({message:q,requestId:id})});if(typeof data.answer!=='string'||!data.answer.trim())throw new Error('The assistant returned an empty answer.');pending.querySelector('.message-content').replaceChildren(render(data.answer));unanswered=false;briefSnapshot=null;document.getElementById("brief-approve").disabled=true;document.getElementById("brief-status").textContent="Conversation updated. Review your brief again before approving.";notice();generateTitle(token)}
 catch(err){unanswered=true;retry(pending,errorText(err),()=>{pending.parentElement.remove();ask(q,id,false)})}
 finally{pending.classList.remove('pending-dots');busy(false);thread.scrollTop=thread.scrollHeight;if(!unanswered)input.focus({preventScroll:true})}
}
async function restore(){
 if(asking)return;unanswered=false;busy(true);status.textContent='Loading saved conversation…';
 try{const data=await request(conversationURL);if(!Array.isArray(data.turns))throw new Error('The saved conversation could not be read.');thread.replaceChildren();suggestions.hidden=false;if(!data.turns.length)bubble('ai',greeting);
 for(const turn of data.turns){bubble('user',turn.question);if(turn.completedAt)bubble('ai',turn.answer);else{unanswered=true;const pending=bubble('ai','');retry(pending,'This message is saved but has no completed reply yet.',()=>{pending.parentElement.remove();ask(turn.question,turn.id,false)})}}
 showBrief(data);if(data.title&&!isPendingTitle(data.title))setTitle(token,data.title);else if(data.turns.some(turn=>turn.completedAt))generateTitle(token);booking=data.booking||null;bookingCard=null;if(booking)showBooking(booking);notice();
 }catch(err){unanswered=true;thread.replaceChildren();const body=bubble('ai','');retry(body,errorText(err),restore);status.textContent='Your saved conversation has not been cleared.'}
 finally{busy(false)}
}
function fresh(){document.getElementById("brief-panel").hidden=true;briefSnapshot=null;token=randomToken();chats.push({token,title:pendingTitle});unanswered=false;booking=null;bookingCard=null;thread.replaceChildren();bubble('ai',greeting);suggestions.hidden=false;options();busy(false);notice()}
try{const stored=JSON.parse(localStorage.getItem(storageKey)||'null');if(stored&&Array.isArray(stored.chats)){chats=stored.chats.filter(c=>c&&/^[a-f0-9]{64}$/.test(c.token)&&typeof c.title==='string');token=chats.some(c=>c.token===stored.current)?stored.current:''}}catch{persistent=false}
newButton.onclick=()=>{if(!asking){fresh();input.focus()}};
select.onchange=()=>{if(asking)return;token=select.value;save();restore()};
deleteButton.onclick=async()=>{if(asking||!confirm('Delete this conversation from saved chats and the AWS transcript archive? Emailed and AI provider copies remain. This does not cancel a Cal.com booking.'))return;busy(true);try{await request(conversationURL,{method:'DELETE'});chats=chats.filter(c=>c.token!==token);save(token);fresh();status.textContent='Conversation deleted. Start a new chat when you’re ready.'}catch(err){status.textContent=errorText(err)}finally{busy(false)}};
form.addEventListener('submit',e=>{e.preventDefault();if(bookingCard&&bookingCard.contains(e.submitter||document.activeElement))return;const q=input.value.trim();if(!unanswered&&q&&Array.from(q).length<=1000)ask(q)});
input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();form.requestSubmit()}});

const bookingEndpoint=endpoint.replace(/\/ask$/,'/booking');
function element(tag,text,parent){const node=document.createElement(tag);if(text)node.textContent=text;if(parent)parent.append(node);return node}
function bookingButton(parent,text,action){const b=element('button',text,parent);b.type='button';b.onclick=()=>{if(!asking)action()};return b}
function card(title){
 if(bookingCard)bookingCard.parentElement.remove();
 bookingCard=bubble('ai','');bookingCard.classList.add('booking-card');
 const h=element('h3',title,bookingCard);h.tabIndex=-1;h.focus({preventScroll:true});
 return bookingCard;
}
function when(start,zone){return new Intl.DateTimeFormat(undefined,{dateStyle:'full',timeStyle:'short',timeZone:zone}).format(new Date(start))+' · '+zone}
function bookingFallback(parent){const p=element('p','',parent),a=element('a','Open Cal.com',p);a.href=siteBookingUrl;a.target='_blank';a.rel='noopener noreferrer'}
async function bookingRequest(body){
 const res=await request(bookingEndpoint,{method:'POST',body:JSON.stringify(body)});
 if(!res||typeof res.status!=='string')throw new Error('The booking response could not be read.');
 booking=res;const entry=chats.find(c=>c.token===token);if(entry&&isPendingTitle(entry.title)){entry.title='Sanifu scope call';options()}
 return res;
}
async function refreshBooking(){
 if(asking)return;busy(true);
 try{const data=await request(conversationURL);booking=data.booking||null;if(booking)showBooking(booking);else{const c=card('Booking status unavailable');element('p','Check your email for a Cal.com invitation before booking again.',c);bookingFallback(c)}}
 catch(err){status.textContent=errorText(err)}finally{busy(false)}
}
function showBooking(b){
 const titles={draft:'Review your scope call',confirmed:'Your call is booked',pending:'Booking requested',failed:'That booking was not completed',unknown:'Check your booking status',submitting:'Checking your booking'};
 const c=card(titles[b.status]||'Check your booking status');
 element('p',when(b.start,b.timeZone)+' · '+b.duration+' minutes',c);
 element('p',b.name+' · '+b.email,c);
 if(b.status==='draft'){
  element('p','Confirming creates the appointment with Cal.com and sends calendar invitations. Your name, email, selected time and booking status are saved with this conversation for you and David to review.',c);
  bookingButton(c,'Confirm booking',()=>confirmBooking(b));
  bookingButton(c,'Change details or time',()=>chooseTime(b));
 }else if(b.status==='confirmed'||b.status==='pending'){
  element('p',b.status==='confirmed'?'Cal.com confirmed your appointment. Check your invitation email for joining, cancellation and rescheduling links.':'Cal.com received your request; it is awaiting approval. Check your email for updates.',c);
  if(b.status==='confirmed'&&b.meetingUrl){try{const u=new URL(b.meetingUrl);if(u.protocol==='https:'){const a=element('a','Join meeting',c);a.href=u.href;a.target='_blank';a.rel='noopener noreferrer'}}catch{}}
  element('p','Reference: '+b.uid,c);
 }else if(b.status==='failed'){
  element('p','The time may have become unavailable, or Cal.com could not accept these details. Choose another time or check your details before trying again.',c);
  bookingButton(c,'Choose another time',()=>chooseTime(b));bookingFallback(c);
 }else{
  element('p','We cannot yet confirm the outcome. Check your email for a Cal.com invitation or contact David before making another booking. This chat will not submit the appointment again.',c);
  bookingButton(c,'Refresh booking status',refreshBooking);
  const a=element('a','Contact David',c);a.href='https://ndungu.dev/contact/';a.target='_blank';a.rel='noopener noreferrer';
 }
 thread.scrollTop=thread.scrollHeight;
}
async function confirmBooking(b){
 if(asking)return;busy(true);bookingCard.querySelectorAll('button').forEach(x=>x.disabled=true);
 try{showBooking(await bookingRequest({action:'confirm',id:b.id,confirmed:true}))}
 catch(err){const c=card('Check before trying again');element('p',errorText(err)+' Check the saved booking status before confirming again.',c);bookingButton(c,'Check saved booking',refreshBooking)}
 finally{busy(false)}
}
function localDate(zone,date=new Date()){return new Intl.DateTimeFormat('en-CA',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit'}).format(date)}
function field(parent,label,type,value=''){const wrap=element('label',label,parent),input=element('input','',wrap);input.type=type;input.value=value;input.required=true;return input}
async function openBooking(){if(asking||unanswered)return;setOpen(true);thread.scrollIntoView({block:'center'});if(booking)showBooking(booking);else chooseTime()}
function chooseTime(previous=null){
 const c=card('Book a free Sanifu scope call');element('p','Choose a time to talk with David. Times are shown in your selected time zone.',c);
 const zoneLabel=element('label','Time zone',c),zone=element('select','',zoneLabel);
 let zoneName=previous?.timeZone||Intl.DateTimeFormat().resolvedOptions().timeZone||'UTC';
 const zones=Array.from(new Set([zoneName,'UTC',...(Intl.supportedValuesOf?Intl.supportedValuesOf('timeZone'):['America/Los_Angeles','America/New_York','Europe/London','Africa/Nairobi','Asia/Tokyo'])]));
 for(const name of zones){const opt=element('option',name,zone);opt.value=name}zone.value=zoneName;
 const date=field(c,'Week starting','date',localDate(zoneName));date.min=date.value;
 const results=element('div','',c);results.className='booking-times';results.setAttribute('aria-live','polite');
 const load=bookingButton(c,'Find available times',loadTimes);
 zone.onchange=()=>{date.min=localDate(zone.value);if(date.value<date.min)date.value=date.min;results.replaceChildren()};date.onchange=()=>results.replaceChildren();
 bookingFallback(c);
 async function loadTimes(){
  if(!date.reportValidity())return;
  busy(true);load.disabled=true;date.disabled=true;zone.disabled=true;results.textContent='Checking availability…';
  try{
   const data=await request(bookingEndpoint+'/availability?'+new URLSearchParams({start:date.value,timeZone:zone.value}));
   if(!Array.isArray(data.slots))throw new Error('Available times could not be read.');results.replaceChildren();
   if(!data.slots.length)element('p','No times available that week. Try a different date.',results);
   let lastDay='';
   for(const start of data.slots){const day=localDate(zone.value,new Date(start));if(day!==lastDay){element('h4',new Intl.DateTimeFormat(undefined,{weekday:'long',month:'short',day:'numeric',timeZone:zone.value}).format(new Date(start)),results);lastDay=day}
    const b=bookingButton(results,new Intl.DateTimeFormat(undefined,{hour:'numeric',minute:'2-digit',timeZone:zone.value}).format(new Date(start)),()=>details(start,zone.value,data.duration,previous));b.setAttribute('aria-label',when(start,zone.value));
   }
  }catch(err){results.textContent=errorText(err)+' You can also book on Cal.com.'}
  finally{busy(false);load.disabled=false;date.disabled=false;zone.disabled=false;thread.scrollTop=Math.max(0,c.parentElement.offsetTop-thread.offsetTop)}
 }
 loadTimes();
}
function details(start,zone,duration,previous){
 const c=card('Your booking details');element('p',when(start,zone)+' · '+duration+' minutes',c);
 const name=field(c,'Name','text',previous?.name||'');name.maxLength=120;name.autocomplete='name';
 const email=field(c,'Email for your invitation','email',previous?.email||'');email.maxLength=254;email.autocomplete='email';
 element('p','These details are saved with this chat. Cal.com receives them only when you confirm. Booking fields are not sent to the AI model.',c);
 const message=element('p','',c);message.setAttribute('role','status');
 const draftID=crypto.randomUUID();
 const review=bookingButton(c,'Review booking',async()=>{
  if(!name.reportValidity()||!email.reportValidity())return;busy(true);c.querySelectorAll('button,input').forEach(x=>x.disabled=true);
  try{showBooking(await bookingRequest({action:'draft',id:draftID,start,timeZone:zone,name:name.value,email:email.value}))}
  catch(err){message.textContent=errorText(err)}finally{busy(false);c.querySelectorAll('button,input').forEach(x=>x.disabled=false)}
 });
 bookingButton(c,'Back to available times',()=>chooseTime({name:name.value,email:email.value,timeZone:zone}));
 c.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.tagName==='INPUT'){e.preventDefault();review.click()}});
 name.focus({preventScroll:true});thread.scrollTop=thread.scrollHeight;
}
document.querySelectorAll('[data-book-call]').forEach(b=>b.onclick=openBooking);
const widget=document.getElementById('chat'),panel=document.getElementById('chat-panel'),launcher=document.getElementById('chat-launcher'),closeButton=document.getElementById('chat-close');
function setOpen(open){if(!widget||!panel)return;panel.hidden=!open;widget.dataset.open=String(open);launcher.setAttribute('aria-expanded',String(open));if(open){thread.scrollTop=thread.scrollHeight;if(!input.disabled)input.focus({preventScroll:true})}else launcher.focus({preventScroll:true})}
if(launcher)launcher.onclick=()=>setOpen(true);if(closeButton)closeButton.onclick=()=>setOpen(false);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&panel&&!panel.hidden&&!launcher.hidden)setOpen(false)});
document.querySelectorAll('[data-chat-open]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();history.replaceState(null,'','#chat');setOpen(true)}));
if(location.hash==='#chat')setOpen(true);window.addEventListener('hashchange',()=>{if(location.hash==='#chat')setOpen(true)});


const briefText=document.getElementById('brief-text'),briefStatus=document.getElementById('brief-status');
function showBrief(c){briefSnapshot=c;const b=c.brief;if(!b)return;document.getElementById('brief-panel').hidden=false;briefText.value=b.text;document.getElementById('brief-approve').disabled=b.status==='approved'||b.sourceTurns!==c.turns.length;briefStatus.textContent=b.status==='approved'?'Approved by you. David will design your workshop after your call.':b.sourceTurns!==c.turns.length?'Conversation changed. Generate a fresh brief or edit and save before approving.':'Draft — edit, save, then confirm its accuracy.'}
async function briefAction(action){if(asking)return;busy(true);briefStatus.textContent='Working…';try{await titlePending.get(token);const current=await request(conversationURL);if(action==='generate')briefSnapshot=current;else if(!briefSnapshot||current.version!==briefSnapshot.version){showBrief(current);throw new Error('The intake changed. Review the current version before continuing.')}const body={action,version:briefSnapshot.version};if(action==='save')body.text=briefText.value;if(action==='approve'){if(briefText.value!==briefSnapshot.brief?.text)throw new Error('Save your edits before approving.');body.confirmed=true}const result=await request(endpoint.replace(/\/ask$/,'/brief'),{method:'POST',body:JSON.stringify(body)});showBrief(result)}catch(e){briefStatus.textContent=errorText(e);document.getElementById('brief-panel').hidden=false;}finally{busy(false);document.getElementById('brief-approve').disabled=!briefReady()}}
document.getElementById('brief-generate').onclick=()=>briefAction('generate');document.getElementById('brief-save').onclick=()=>briefAction('save');document.getElementById('brief-approve').onclick=()=>briefAction('approve');briefText.oninput=()=>{document.getElementById('brief-approve').disabled=true;briefStatus.textContent='Unsaved edits. Save before approving.'};document.getElementById('brief-download').onclick=()=>downloadBrief(briefText.value);
document.querySelectorAll('[data-interest]').forEach(b=>b.addEventListener('click',()=>{if(!asking&&!unanswered){input.value=b.dataset.interest==='ml'?'I would like to explore an ML project.':b.dataset.interest==='software'?'I would like to build my own app.':'I would like help finding a small project to learn with.';input.focus()}}));

form.hidden=false;
if(token){options();restore()}else fresh();
})();
