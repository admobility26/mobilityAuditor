import {env} from 'cloudflare:workers';
import {getFormationUser,sameOrigin} from '../../../../formation-auth';
import {getDb} from '../../../../../db';
import {trainingResources,trainingResourceUploads} from '../../../../../db/schema';
import {eq,lt} from 'drizzle-orm';
import {MAX_RESOURCE_BYTES,RESOURCE_CHUNK_BYTES,resourceMime,resourcePartLength,type TrainingResource} from '../../../../training-resource-model';
export const dynamic='force-dynamic';
type Upload=TrainingResource&{uploadId:string;owner:string};
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
async function pending(id:unknown,owner:string){if(typeof id!=='string'||!/^[a-f0-9-]{36}$/.test(id))throw Error('Subida no válida.');const row=(await getDb().select().from(trainingResourceUploads).where(eq(trainingResourceUploads.id,id)))[0];if(!row)throw Error('Subida no encontrada.');const data=JSON.parse(row.payload) as Upload;if(data.owner!==owner)throw Error('Subida no encontrada.');return data;}
async function smallJson(req:Request){if(Number(req.headers.get('content-length'))>20000)throw Error('Solicitud demasiado grande.');const text=await req.text();if(text.length>20000)throw Error('Solicitud demasiado grande.');return JSON.parse(text);}
export async function POST(req:Request){const user=await getFormationUser();if(user?.role!=='admin')return json({error:'Inicia sesión.'},401);if(!sameOrigin(req))return json({error:'Origen no permitido.'},403);
 try{const body=await smallJson(req),db=getDb();
 if(body.action==='start'){
 if(typeof body.filename!=='string'||!body.filename.trim()||body.filename.length>250||!Number.isInteger(body.size)||body.size<5||body.size>MAX_RESOURCE_BYTES||!['application/pdf','image/png','image/jpeg','image/webp','image/gif'].includes(body.mimeType))throw Error('Selecciona un PDF o una imagen de hasta 250 MB.');
 const expired=await db.select().from(trainingResourceUploads).where(lt(trainingResourceUploads.createdAt,new Date(Date.now()-86400000).toISOString())).limit(5);
 for(const old of expired){const u=JSON.parse(old.payload) as Upload;try{await env.BUCKET!.resumeMultipartUpload(`training-resources/${u.id}`,u.uploadId).abort();}catch{}await db.delete(trainingResourceUploads).where(eq(trainingResourceUploads.id,u.id));}
 const id=crypto.randomUUID(),createdAt=new Date().toISOString(),filename=body.filename.replace(/[\u0000-\u001f\u007f]/g,'');
 const multipart=await env.BUCKET!.createMultipartUpload(`training-resources/${id}`,{httpMetadata:{contentType:body.mimeType}});
 const record:Upload={id,filename,mimeType:body.mimeType,size:body.size,createdAt,owner:user.userId,uploadId:multipart.uploadId};
 try{await db.insert(trainingResourceUploads).values({id,payload:JSON.stringify(record),createdAt});}catch(e){await multipart.abort();throw e;}
 return json({id,chunkSize:RESOURCE_CHUNK_BYTES});
 }
 if(body.action==='complete'){
 const row=(await db.select().from(trainingResources).where(eq(trainingResources.id,String(body.id))))[0];if(row)return json(JSON.parse(row.payload));
 const u=await pending(body.id,user.userId),count=Math.ceil(u.size/RESOURCE_CHUNK_BYTES);
 if(!Array.isArray(body.parts)||body.parts.length!==count||body.parts.some((p:any,i:number)=>p?.partNumber!==i+1||typeof p.etag!=='string'||!p.etag||p.etag.length>200))throw Error('Faltan partes del archivo. Vuelve a subirlo.');
 const key=`training-resources/${u.id}`;let stored=await env.BUCKET!.head(key);if(!stored)stored=await env.BUCKET!.resumeMultipartUpload(key,u.uploadId).complete(body.parts);
 if(stored.size!==u.size){await env.BUCKET!.delete(key);throw Error('El archivo no se ha recibido completo.');}
 const record:TrainingResource={id:u.id,filename:u.filename,mimeType:u.mimeType,size:u.size,createdAt:u.createdAt};
 await db.batch([db.insert(trainingResources).values({id:u.id,payload:JSON.stringify(record),createdAt:u.createdAt}).onConflictDoNothing(),db.delete(trainingResourceUploads).where(eq(trainingResourceUploads.id,u.id))]);return json(record);
 }
 throw Error('Operación no válida.');
 }catch(e){return json({error:(e as Error).message},400);}
}
export async function PUT(req:Request){const user=await getFormationUser();if(user?.role!=='admin')return json({error:'Inicia sesión.'},401);if(!sameOrigin(req))return json({error:'Origen no permitido.'},403);
 try{const url=new URL(req.url),u=await pending(url.searchParams.get('id'),user.userId),part=Number(url.searchParams.get('part')),length=resourcePartLength(u.size,part);
 if(Number(req.headers.get('content-length'))>length||!req.body)throw Error('Tamaño de parte no válido.');
 const reader=req.body.getReader(),chunks:Uint8Array[]=[];let size=0;while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>length){await reader.cancel();throw Error('Parte demasiado grande.');}chunks.push(value);}if(size!==length)throw Error('Parte incompleta.');
 const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength;}
 if(part===1&&resourceMime(bytes.subarray(0,16))!==u.mimeType)throw Error('El contenido del archivo no corresponde al formato indicado.');
 const result=await env.BUCKET!.resumeMultipartUpload(`training-resources/${u.id}`,u.uploadId).uploadPart(part,bytes);return json(result);
 }catch(e){return json({error:(e as Error).message},400);}
}
export async function DELETE(req:Request){const user=await getFormationUser();if(user?.role!=='admin')return json({error:'Inicia sesión.'},401);if(!sameOrigin(req))return json({error:'Origen no permitido.'},403);
 try{const u=await pending(new URL(req.url).searchParams.get('id'),user.userId);try{await env.BUCKET!.resumeMultipartUpload(`training-resources/${u.id}`,u.uploadId).abort();}catch{}await getDb().delete(trainingResourceUploads).where(eq(trainingResourceUploads.id,u.id));return json({ok:true});}catch(e){return json({error:(e as Error).message},400);}
}
