export const events=[{id:'q1',place:'Pacific demo region',lon:145,lat:36,magnitude:6.2,depth:32,hour:3},{id:'q2',place:'Andes demo region',lon:-72,lat:-30,magnitude:5.3,depth:60,hour:9},{id:'q3',place:'Island arc demo region',lon:119,lat:-4,magnitude:4.6,depth:15,hour:14},{id:'q4',place:'Atlantic demo region',lon:-30,lat:10,magnitude:3.8,depth:10,hour:20}];
export function visibleEvents(magnitude, cutoff, dataset=events) {
  return dataset.filter(event=>event.magnitude>=magnitude&&(event.time??event.hour)<=cutoff)
    .sort((a,b)=>(b.time??b.hour)-(a.time??a.hour));
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


