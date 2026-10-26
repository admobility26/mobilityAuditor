import {env} from 'cloudflare:workers';
import {getDb} from '../../../../db';
import {trainingCourses,trainingResources} from '../../../../db/schema';
export const dynamic='force-dynamic';
// Owner-private Sites access plus a temporary server-side migration credential.
export async function GET(req:Request){
 const expected=env.TRAINING_MIGRATION_KEY,provided=req.headers.get('x-training-migration-key');if(!expected||!provided)return new Response('No autorizado',{status:403});
 const digest=async(s:string)=>new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)));const a=await digest(expected),b=await digest(provided);let mismatch=0;for(let i=0;i<a.length;i++)mismatch|=a[i]^b[i];if(mismatch)return new Response('No autorizado',{status:403});
 const url=new URL(req.url),kind=url.searchParams.get('kind'),id=url.searchParams.get('id');
 if(kind){if(!id||!/^[a-f0-9-]{36}$/.test(id)||!['course-file','resource-file'].includes(kind))return new Response('No encontrado',{status:404});const key=kind==='course-file'?`training/${id}.pdf`:`training-resources/${id}`;const object=await env.BUCKET!.get(key,req.headers.has('range')?{range:req.headers}:undefined);if(!object)return new Response('No encontrado',{status:404});const range=object.range as {offset?:number;length?:number}|undefined;return new Response(object.body,{status:range?206:200,headers:{'Cache-Control':'private, no-store','Content-Type':object.httpMetadata?.contentType||'application/octet-stream','Content-Length':String(range?.length??object.size),...(range?{'Content-Range':`bytes ${range.offset}-${(range.offset||0)+(range.length||0)-1}/${object.size}`}:{})}});}
 const db=getDb(),courses=await db.select().from(trainingCourses),resources=await db.select().from(trainingResources);return Response.json({courses:await Promise.all(courses.map(async row=>({...JSON.parse(row.payload),fileSize:(await env.BUCKET!.head(`training/${row.id}.pdf`))?.size||0}))),resources:resources.map(row=>JSON.parse(row.payload))},{headers:{'Cache-Control':'private, no-store'}});
}
