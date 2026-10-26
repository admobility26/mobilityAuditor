export type TrainingResource={id:string;filename:string;mimeType:string;size:number;createdAt:string};
export const MAX_RESOURCE_BYTES=25*1024*1024;
export function resourceMime(bytes:Uint8Array):string|null{
 if(bytes.length>=5&&new TextDecoder().decode(bytes.slice(0,5))==='%PDF-')return 'application/pdf';
 if(bytes.length>=8&&[137,80,78,71,13,10,26,10].every((v,i)=>bytes[i]===v))return 'image/png';
 if(bytes.length>=3&&bytes[0]===255&&bytes[1]===216&&bytes[2]===255)return 'image/jpeg';
 const head=new TextDecoder().decode(bytes.slice(0,12));
 if(head.startsWith('GIF87a')||head.startsWith('GIF89a'))return 'image/gif';
 if(head.startsWith('RIFF')&&head.slice(8,12)==='WEBP')return 'image/webp';
 return null;
}
