import {MAX_RESOURCE_BYTES,resourceMime,type TrainingResource} from './training-resource-model';
const endpoint='/api/training/resources/uploads';
async function request(url:string,options:RequestInit,retries=2):Promise<any>{for(let attempt=0;;attempt++){try{const r=await fetch(url,options);const d=await r.json().catch(()=>({error:'No se pudo subir el archivo. Actualiza la página e inténtalo de nuevo.'}));if(!r.ok){if(r.status>=500&&attempt<retries)continue;throw Error((d as any).error||'Error de subida.');}return d;}catch(e){if(e instanceof TypeError&&attempt<retries)continue;throw e;}}}
export async function uploadResource(file:File,onProgress:(percent:number)=>void):Promise<TrainingResource>{
 if(file.size>MAX_RESOURCE_BYTES)throw Error('El archivo supera los 250 MB.');const mimeType=resourceMime(new Uint8Array(await file.slice(0,16).arrayBuffer()));if(!mimeType)throw Error('Usa un PDF o una imagen PNG, JPG, WebP o GIF.');
 let id='';try{const start=await request(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'start',filename:file.name.slice(0,250),size:file.size,mimeType})},0);id=start.id;const parts=[];
 for(let offset=0,number=1;offset<file.size;offset+=start.chunkSize,number++){const part=await request(`${endpoint}?id=${id}&part=${number}`,{method:'PUT',headers:{'Content-Type':'application/octet-stream'},body:file.slice(offset,offset+start.chunkSize)});parts.push(part);onProgress(Math.round(Math.min(file.size,offset+start.chunkSize)/file.size*99));}
 const result=await request(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'complete',id,parts})});onProgress(100);return result;
 }catch(e){if(id)await fetch(`${endpoint}?id=${id}`,{method:'DELETE'}).catch(()=>{});throw e;}
}
