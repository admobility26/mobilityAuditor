export type TrackPoint={lat:number;lon:number;time?:string};
export type Track={segments:{points:TrackPoint[]}[]};
export type TrackInfo={track:Track;pointCount:number;segmentCount:number;lengthKm:number;timedPoints:number};
export function distanceM(a:TrackPoint,b:TrackPoint):number;
export function pointSegmentM(p:TrackPoint,a:TrackPoint,b:TrackPoint):number;
export function pointTrackM(p:TrackPoint,segments:Track['segments']):number;
export function validateTrack(value:unknown):TrackInfo;
export function parseGPXText(text:string):TrackInfo;
