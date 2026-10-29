export const events=[{id:'q1',place:'Pacific demo region',lon:145,lat:36,magnitude:6.2,depth:32,hour:3},{id:'q2',place:'Andes demo region',lon:-72,lat:-30,magnitude:5.3,depth:60,hour:9},{id:'q3',place:'Island arc demo region',lon:119,lat:-4,magnitude:4.6,depth:15,hour:14},{id:'q4',place:'Atlantic demo region',lon:-30,lat:10,magnitude:3.8,depth:10,hour:20}];
export function visibleEvents(magnitude, cutoff, dataset=events, maxDepth=Infinity) {
  const depth=Number(maxDepth);const limit=Number.isFinite(depth)?Math.max(0,depth):Infinity;
  return dataset.filter(event=>event.magnitude>=magnitude&&(event.time??event.hour)<=cutoff&&(Number.isFinite(event.depth)?event.depth:0)<=limit)
    .sort((a,b)=>(b.time??b.hour)-(a.time??a.hour));
}
export function sortEvents(items,mode='newest') {
  const copy=[...items];
  if(mode==='magnitude')return copy.sort((a,b)=>b.magnitude-a.magnitude||String(a.id).localeCompare(String(b.id)));
  if(mode==='depth')return copy.sort((a,b)=>(a.depth??0)-(b.depth??0)||String(a.id).localeCompare(String(b.id)));
  return copy.sort((a,b)=>(b.time??b.hour)-(a.time??a.hour)||String(a.id).localeCompare(String(b.id)));
}
export function advanceCutoff(value,min,max,elapsedMs,durationMs=8000) {
  const numbers=[value,min,max,elapsedMs,durationMs].map(Number);
  if(!numbers.every(Number.isFinite)||numbers[4]<=0)return Number.isFinite(numbers[1])?numbers[1]:0;
  const low=Math.min(numbers[1],numbers[2]),high=Math.max(numbers[1],numbers[2]);
  return Math.min(high,Math.max(low,numbers[0])+(Math.max(0,numbers[3])/numbers[4])*(high-low));
}
export function parseGeoJSON(value) {
  if (!value || value.type!=='FeatureCollection' || !Array.isArray(value.features)) throw new Error('Expected a GeoJSON FeatureCollection.');
  if(value.features.length>5000)throw new Error('Maximum 5,000 features per import.');
  const result=[]; let skipped=0;
  for(const [index,feature] of value.features.entries()) {
    const properties=feature?.properties, geometry=feature?.geometry, coords=geometry?.coordinates;
    if(feature?.type!=='Feature'||geometry?.type!=='Point'||!Array.isArray(coords)||coords.length<3||!properties||
       ![coords[0],coords[1],coords[2],properties.mag,properties.time].every(Number.isFinite)||
       Math.abs(coords[0])>180||Math.abs(coords[1])>90||Math.abs(properties.time)>8.64e15||properties.mag < -10||properties.mag>12) {skipped++;continue;}
    result.push({id:'imported-'+index,sourceId:typeof feature.id==='string'?feature.id:null,
      place:typeof properties.place==='string'?properties.place.slice(0,200):'Unspecified location',
      lon:coords[0],lat:coords[1],depth:coords[2],magnitude:properties.mag,time:properties.time});
  }
  if(!result.length)throw new Error('No valid magnitude/time/Point records found.');
  return {events:result,skipped,generated:Number.isFinite(value.metadata?.generated)&&Math.abs(value.metadata.generated)<=8.64e15?value.metadata.generated:null};
}
export function project(e){return [(e.lon+180)/360*800,(90-e.lat)/180*400];}
export function depthBand(depth){if(depth===null||depth===''||typeof depth==='boolean')return 'Unknown';const value=Number(depth);if(!Number.isFinite(value)||value<0)return 'Unknown';if(value<70)return 'Shallow';if(value<300)return 'Intermediate';return 'Deep';}
export function depthSummary(items){const counts={Shallow:0,Intermediate:0,Deep:0,Unknown:0};for(const item of items)counts[depthBand(item?.depth)]++;return counts;}
export function magnitudeSummary(items){const values=items.map(item=>item.magnitude).filter(Number.isFinite);return values.length?{largest:Math.max(...values),average:values.reduce((sum,value)=>sum+value,0)/values.length}:{largest:null,average:null};}
export function loadedTimeSpan(items){const values=items.map(item=>item.time??item.hour).filter(Number.isFinite);return values.length?{earliest:Math.min(...values),latest:Math.max(...values)}:null;}
export function eventDetailRows(event,imported=false){
  if(!event)return [];
  const rows=[['Magnitude',String(event.magnitude)],['Depth',`${event.depth} km · ${depthBand(event.depth)}`],['Coordinates',`${event.lat.toFixed(2)}°, ${event.lon.toFixed(2)}°`],['Time',imported?new Date(event.time).toISOString():`Demo hour ${event.hour}:00`]];
  if(imported&&event.sourceId)rows.push(['Source record',event.sourceId]);
  return rows;
}
export function freshnessLabel(generated,now=Date.now()){
  if(!Number.isFinite(generated)||!Number.isFinite(now))return 'Generation time unknown · freshness cannot be assessed';
  const hours=Math.max(0,now-generated)/3600000;
  if(hours<1)return `Generated ${Math.round(hours*60)} min ago · user-supplied metadata`;
  if(hours<48)return `Generated ${Math.round(hours)} h ago · user-supplied metadata`;
  return `Generated ${Math.round(hours/24)} d ago · may be stale · user-supplied metadata`;
}



