import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '../../../../chatgpt-auth';
import {getDb} from '../../../../../db';
import {trainingResources} from '../../../../../db/schema';
import {eq} from 'drizzle-orm';
import {resourceRange,type TrainingResource} from '../../../../training-resource-model';
export const dynamic='force-dynamic';
export async function GET(req:Request){
 if(!await getChatGPTUser())return new Response('Inicia sesión.',{status:401});const url=new URL(req.url),id=url.searchParams.get('id');
 if(!id||!/^[a-f0-9-]{36}$/.test(id))return new Response('No encontrado',{status:404});
 const row=(await getDb().select().from(trainingResources).where(eq(trainingResources.id,id)))[0];if(!row)return new Response('No encontrado',{status:404});
 const metadata=JSON.parse(row.payload) as TrainingResource,range=resourceRange(req.headers.get('range'),metadata.size);if(range==='invalid')return new Response(null,{status:416,headers:{'Content-Range':`bytes */${metadata.size}`,'Cache-Control':'private, no-store'}});const file=await env.BUCKET!.get(`training-resources/${id}`,range?{range}:undefined);if(!file)return new Response('No encontrado',{status:404});
 const disposition=url.searchParams.get('download')==='1'?'attachment':'inline',filename=encodeURIComponent(metadata.filename).replace(/['()*]/g,c=>'%'+c.charCodeAt(0).toString(16).toUpperCase());
 return new Response(file.body,{status:range?206:200,headers:{'Content-Type':metadata.mimeType,'Accept-Ranges':'bytes',...(range?{'Content-Range':`bytes ${range.offset}-${range.offset+range.length-1}/${file.size}`}:{ }),'Content-Length':String(range?range.length:file.size),'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Content-Disposition':`${disposition}; filename="documento${metadata.mimeType==='application/pdf'?'.pdf':''}"; filename*=UTF-8''${filename}`}});
}
