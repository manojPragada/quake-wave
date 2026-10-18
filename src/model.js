export const events=[{id:'q1',place:'Pacific demo region',lon:145,lat:36,magnitude:6.2,depth:32,hour:3},{id:'q2',place:'Andes demo region',lon:-72,lat:-30,magnitude:5.3,depth:60,hour:9},{id:'q3',place:'Island arc demo region',lon:119,lat:-4,magnitude:4.6,depth:15,hour:14},{id:'q4',place:'Atlantic demo region',lon:-30,lat:10,magnitude:3.8,depth:10,hour:20}];
export function visibleEvents(magnitude,hour){return events.filter(e=>e.magnitude>=magnitude&&e.hour<=hour);}
export function project(e){return [(e.lon+180)/360*800,(90-e.lat)/180*400];}
