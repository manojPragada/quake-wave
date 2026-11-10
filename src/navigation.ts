export function nextEventIndex(current:number,total:number,direction:1|-1){if(total<=0)return-1;return(current+direction+total)%total}
