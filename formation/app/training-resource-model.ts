export type TrainingResource={id:string;filename:string;mimeType:string;size:number;createdAt:string};
export const MAX_RESOURCE_BYTES=250*1024*1024;
export function resourceMime(bytes:Uint8Array):string|null{
 if(bytes.length>=5&&new TextDecoder().decode(bytes.slice(0,5))==='%PDF-')return 'application/pdf';
 if(bytes.length>=8&&[137,80,78,71,13,10,26,10].every((v,i)=>bytes[i]===v))return 'image/png';
 if(bytes.length>=3&&bytes[0]===255&&bytes[1]===216&&bytes[2]===255)return 'image/jpeg';
 const head=new TextDecoder().decode(bytes.slice(0,12));
 if(head.startsWith('GIF87a')||head.startsWith('GIF89a'))return 'image/gif';
 if(head.startsWith('RIFF')&&head.slice(8,12)==='WEBP')return 'image/webp';
 return null;
}

export const RESOURCE_CHUNK_BYTES=8*1024*1024;
export const MAX_DIRECT_RESOURCE_BYTES=25*1024*1024;
export function resourcePartLength(size:number,part:number){if(!Number.isInteger(size)||size<5||size>MAX_RESOURCE_BYTES||!Number.isInteger(part)||part<1||part>Math.ceil(size/RESOURCE_CHUNK_BYTES))throw Error('Parte de archivo no válida.');return Math.min(RESOURCE_CHUNK_BYTES,size-(part-1)*RESOURCE_CHUNK_BYTES);}
export function resourceRange(header:string|null,size:number):{offset:number;length:number}|null|'invalid'{if(!header)return null;const m=header.match(/^bytes=(\d*)-(\d*)$/);if(!m||(!m[1]&&!m[2]))return 'invalid';let start:number,end:number;if(!m[1]){const suffix=Number(m[2]);if(!Number.isSafeInteger(suffix)||suffix<1)return 'invalid';start=Math.max(0,size-suffix);end=size-1;}else{start=Number(m[1]);end=m[2]?Math.min(Number(m[2]),size-1):size-1;}if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start<0||start>=size||end<start)return 'invalid';return{offset:start,length:end-start+1};}
