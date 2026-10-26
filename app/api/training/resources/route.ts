import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '../../../chatgpt-auth';
import {getDb} from '../../../../db';
import {trainingResources} from '../../../../db/schema';
import {desc,eq} from 'drizzle-orm';
import {MAX_DIRECT_RESOURCE_BYTES,resourceMime,type TrainingResource} from '../../../training-resource-model';
export const dynamic='force-dynamic';
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
const sameOrigin=(req:Request)=>!req.headers.get('origin')||req.headers.get('origin')===new URL(req.url).origin;
export async function GET(){if(!await getChatGPTUser())return json({error:'Inicia sesión.'},401);const rows=await getDb().select().from(trainingResources).orderBy(desc(trainingResources.createdAt));return json(rows.map(r=>JSON.parse(r.payload)));}
export async function POST(req:Request){
 if(!await getChatGPTUser())return json({error:'Inicia sesión.'},401);if(!sameOrigin(req))return json({error:'Origen no permitido.'},403);
 let uploaded='';try{
 if(Number(req.headers.get('content-length'))>MAX_DIRECT_RESOURCE_BYTES+1024*1024)throw Error('Actualiza la página para subir archivos de hasta 250 MB por partes.');
 // Send original bytes directly: multipart POSTs are intercepted by the framework's 1 MB Server Action limit.
 if(!req.body)throw Error('Selecciona un archivo.');
 const reader=req.body.getReader(),chunks:Uint8Array[]=[];let size=0;
 while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>MAX_DIRECT_RESOURCE_BYTES){await reader.cancel();throw Error('Actualiza la página para subir archivos de hasta 250 MB por partes.');}chunks.push(value);}
 if(size<5)throw Error('El archivo está vacío o no es válido.');
 const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength;}
 const mimeType=resourceMime(bytes.subarray(0,16));if(!mimeType)throw Error('Formato no admitido. Usa PDF, PNG, JPG, WebP o GIF.');
 const id=crypto.randomUUID(),createdAt=new Date().toISOString(),filename=decodeURIComponent(req.headers.get('x-file-name')||'Documento').replace(/[\u0000-\u001f\u007f]/g,'').slice(0,250)||'Documento';
 const record:TrainingResource={id,filename,mimeType,size,createdAt};
 await env.BUCKET!.put(`training-resources/${id}`,bytes,{httpMetadata:{contentType:mimeType}});uploaded=id;
 await getDb().insert(trainingResources).values({id,payload:JSON.stringify(record),createdAt});return json(record);
 }catch(e){if(uploaded)await env.BUCKET!.delete(`training-resources/${uploaded}`);return json({error:(e as Error).message},400);}
}
export async function DELETE(req:Request){
 if(!await getChatGPTUser())return json({error:'Inicia sesión.'},401);if(!sameOrigin(req))return json({error:'Origen no permitido.'},403);
 const id=new URL(req.url).searchParams.get('id');if(!id||!/^[a-f0-9-]{36}$/.test(id))return json({error:'Documento no válido.'},400);
 try{await env.BUCKET!.delete(`training-resources/${id}`);await getDb().delete(trainingResources).where(eq(trainingResources.id,id));return json({ok:true});}catch{return json({error:'No se pudo eliminar el documento. Inténtalo de nuevo.'},500);}
}
