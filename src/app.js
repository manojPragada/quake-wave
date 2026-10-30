import { events, visibleEvents, sortEvents, project, parseGeoJSON, advanceCutoff, eventDetailRows, freshnessLabel, depthSummary, magnitudeSummary, loadedTimeSpan, magnitudeBands } from './model.js';
const $=selector=>document.querySelector(selector);
const depthLabel=document.createElement('label');depthLabel.textContent='Maximum depth ';
const depthSelect=document.createElement('select');depthSelect.id='depth';
for(const [value,label] of [['all','Any depth'],['20','20 km'],['50','50 km']]){const option=document.createElement('option');option.value=value;option.textContent=label;depthSelect.append(option);}
depthLabel.append(depthSelect);$('#magnitude').closest('label').after(depthLabel);
const sortLabel=document.createElement('label');sortLabel.textContent='Order events ';
const sortSelect=document.createElement('select');sortSelect.id='sort';
for(const [value,label] of [['newest','Newest first'],['magnitude','Largest first'],['depth','Shallowest first']]){const option=document.createElement('option');option.value=value;option.textContent=label;sortSelect.append(option);}
sortLabel.append(sortSelect);depthLabel.after(sortLabel);
const playback=document.createElement('button');playback.id='playback';playback.type='button';playback.textContent='Play history';playback.setAttribute('aria-pressed','false');
const historyStatus=document.createElement('p');historyStatus.id='history-status';historyStatus.className='status';historyStatus.setAttribute('role','status');
$('#clock').after(playback,historyStatus);
const freshness=document.createElement('p');freshness.id='freshness';freshness.className='small muted';freshness.textContent='Synthetic demo · no freshness claim';historyStatus.after(freshness);
let selected='q1',dataset=events,imported=false,importGeneration=0;
let playing=false,frame=null,previousTime=null,playbackCutoff=0;
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
function stopPlayback(message='Historical playback paused.') {
  playing=false;previousTime=null;if(frame!==null)cancelAnimationFrame(frame);frame=null;
  playback.textContent='Play history';playback.setAttribute('aria-pressed','false');historyStatus.textContent=message;
}
function tick(time) {
  if(!playing)return;
  if(previousTime===null)previousTime=time;
  const next=advanceCutoff(playbackCutoff,$('#hour').min,$('#hour').max,time-previousTime);previousTime=time;playbackCutoff=next;$('#hour').value=next;render();
  if(next>=Number($('#hour').max))stopPlayback('Historical playback complete.');else frame=requestAnimationFrame(tick);
}
function syncMotionPreference() {
  if(reducedMotion.matches)stopPlayback('Animation disabled by reduced-motion preference; scrub the timeline manually.');
  playback.disabled=reducedMotion.matches;
}
playback.addEventListener('click',()=>{
  if(playing){stopPlayback();return;}
  if(Number($('#hour').value)>=Number($('#hour').max))$('#hour').value=$('#hour').min;
  playbackCutoff=Number($('#hour').value);playing=true;playback.textContent='Pause history';playback.setAttribute('aria-pressed','true');historyStatus.textContent='Replaying this loaded dataset; this is not a live feed.';frame=requestAnimationFrame(tick);
});
reducedMotion.addEventListener?.('change',syncMotionPreference);syncMotionPreference();
function render() {
  const cutoff=Number($('#hour').value),items=sortEvents(visibleEvents(Number($('#magnitude').value),cutoff,dataset,$('#depth').value),$('#sort').value);
  selected=items.find(event=>event.id===selected)?.id??items[0]?.id??null;
  $('#clock').textContent=imported?new Date(cutoff).toISOString():String(cutoff).padStart(2,'0')+':00';
  const depths=depthSummary(items),magnitudes=magnitudeSummary(items),bands=magnitudeBands(items),span=loadedTimeSpan(items),spanText=!span?'no visible time span':imported?`${new Date(span.earliest).toISOString()} → ${new Date(span.latest).toISOString()}`:`demo hours ${span.earliest}:00–${span.latest}:00`,magnitudeText=magnitudes.largest===null?'no magnitude summary':`largest M${magnitudes.largest} / average M${magnitudes.average.toFixed(1)}`;$('#count').textContent=`${items.length}${imported?' imported records':' fictional events'} visible · ${magnitudeText} · bands: ${bands.below4} below M4 / ${bands.from4to6} M4–5.9 / ${bands.atLeast6} M6+ · ${spanText} · ${depths.Shallow} shallow / ${depths.Intermediate} intermediate / ${depths.Deep} deep`;
  $('#list').replaceChildren();$('#markers').replaceChildren();
  for(const event of items) {
    const button=document.createElement('button');button.dataset.event=event.id;button.textContent=`M${event.magnitude} · ${event.place}`;
    button.setAttribute('aria-pressed',String(event.id===selected));button.addEventListener('click',()=>{
      selected=event.id;render();[...$('#list').children].find(button=>button.dataset.event===selected)?.focus();
    });$('#list').append(button);
    const point=project(event),radius=4+Math.max(0,event.magnitude)*3;
    for(const size of [radius,radius/2,4]) {
      const dot=document.createElementNS('http://www.w3.org/2000/svg','circle');dot.setAttribute('cx',point[0]);dot.setAttribute('cy',point[1]);dot.setAttribute('r',size);dot.setAttribute('class',size===4?'marker':'quake-ring');$('#markers').append(dot);
    }
  }
  const event=items.find(event=>event.id===selected);const heading=document.createElement('h2');heading.textContent=event?event.place:'No matching events';
  if(!event){const empty=document.createElement('p');empty.className='muted small';empty.textContent='Try a lower magnitude or later timeline position.';$('#detail').replaceChildren(heading,empty);return;}
  const facts=document.createElement('dl');facts.className='event-facts';
  for(const [label,value] of eventDetailRows(event,imported)){const term=document.createElement('dt'),description=document.createElement('dd');term.textContent=label;description.textContent=value;facts.append(term,description);}
  const caveat=document.createElement('p');caveat.className='muted small';caveat.textContent=imported?'User-supplied record; provenance is not verified.':'Fictional record bundled for interface demonstration.';
  $('#detail').replaceChildren(heading,facts,caveat);
}
$('#magnitude').addEventListener('change',render);$('#depth').addEventListener('change',render);$('#sort').addEventListener('change',render);$('#hour').addEventListener('input',()=>{stopPlayback('Timeline scrubbed manually.');render();});
$('#import-file').addEventListener('change',async()=>{
  stopPlayback('Playback stopped while a local file is read.');
  const file=$('#import-file').files?.[0],generation=++importGeneration;if(!file)return;
  $('#import-status').textContent='Reading local file…';
  try {
    if(file.size>1048576)throw new Error('Maximum file size is 1 MiB.');
    const result=parseGeoJSON(JSON.parse(await file.text()));if(generation!==importGeneration)return;
    dataset=result.events;imported=true;selected=null;
    const times=dataset.map(event=>event.time);const min=Math.min(...times),max=Math.max(...times);
    $('#hour').min=min;$('#hour').max=max;$('#hour').step=1;$('#hour').value=max;
    $('#timeline-label').textContent='Imported timeline (UTC)';$('#data-mode').textContent='IMPORTED FILE / NOT LIVE / NOT AN ALERT SYSTEM';
    $('.map-note').textContent='IMPORTED COORDINATES / SCHEMATIC GEOGRAPHY';
    $('footer span').textContent='User-supplied records · provenance unverified · no live connection';
    freshness.textContent=freshnessLabel(result.generated);$('#import-status').textContent=`Loaded ${dataset.length} records from ${file.name.slice(0,100)}; skipped ${result.skipped}. File generation: ${result.generated===null?'unknown':new Date(result.generated).toISOString()}. Not refreshed automatically.`;render();
  } catch(error) {if(generation===importGeneration)$('#import-status').textContent='Import failed; previous dataset kept. '+error.message;}
});
$('#reset-demo').addEventListener('click',()=>{
  stopPlayback('Synthetic demo restored; playback is ready.');
  importGeneration++;dataset=events;imported=false;selected='q1';$('#import-file').value='';$('#hour').min=0;$('#hour').max=24;$('#hour').step=1;$('#hour').value=24;
  $('#timeline-label').textContent='Demo timeline';$('#data-mode').textContent='SYNTHETIC EVENTS / NOT AN ALERT SYSTEM';$('.map-note').textContent='FICTIONAL EVENT LOCATIONS / SCHEMATIC GEOGRAPHY';$('footer span').textContent='Synthetic demo · no live data connection';freshness.textContent='Synthetic demo · no freshness claim';$('#import-status').textContent='Synthetic demo restored. Imported data discarded.';render();
});render();


