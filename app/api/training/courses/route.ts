import {env} from 'cloudflare:workers';
import {getChatGPTUser,sameOrigin} from '../../../chatgpt-auth';
import {getDb} from '../../../../db';
import {trainingCourses} from '../../../../db/schema';
import {desc,eq} from 'drizzle-orm';
import type {Course} from '../../../course-model';
import {safeLink} from '../../../course-model';
export const dynamic='force-dynamic';
const json=(v:unknown,status=200)=>Response.json(v,{status,headers:{'Cache-Control':'no-store'}});
function validate(c:Course){
 if(!c||typeof c.title!=='string'||!c.title.trim()||c.title.length>200||!Number.isInteger(c.pageCount)||c.pageCount<1||c.pageCount>1000||!Array.isArray(c.sections)||!c.sections.length||c.sections.length>1000)throw Error('Curso no válido.');
 if(c.structureVersion!==undefined&&c.structureVersion!==2)throw Error('Versión de estructura no válida.');
 if(c.previousWork!==undefined){if(!Array.isArray(c.previousWork)||c.previousWork.length>2000)throw Error('Trabajo anterior no válido.');for(const w of c.previousWork){if(typeof w.title!=='string'||typeof w.notes!=='string'||w.notes.length>10000||!Array.isArray(w.pages)||w.pages.some(p=>!Number.isInteger(p)||p<1||p>c.pageCount)||typeof w.completed!=='boolean'||typeof w.video!=='string'||(w.video&&!safeLink(w.video))||!Array.isArray(w.links)||w.links.some(l=>typeof l.title!=='string'||!safeLink(l.url)))throw Error('Trabajo anterior no válido.');if(w.question&&(!Array.isArray(w.question.options)||w.question.options.length!==3||w.question.options.some(o=>typeof o!=='string')||typeof w.question.prompt!=='string'||typeof w.question.explanation!=='string'||!Number.isInteger(w.question.correct)||w.question.correct<0||w.question.correct>2))throw Error('Actividad anterior no válida.');}}
 const ids=new Set<string>(),pages:number[]=[];
 for(const s of c.sections){if(typeof s.id!=='string'||s.id.length>80||ids.has(s.id)||typeof s.title!=='string'||!s.title.trim()||s.title.length>250||typeof s.body!=='string'||!Array.isArray(s.pages)||s.pages.some(p=>!Number.isInteger(p)||p<1||p>c.pageCount))throw Error('Tema no válido.');ids.add(s.id);pages.push(...s.pages);
 if(!Array.isArray(s.links)||s.links.length>30||s.links.some(l=>typeof l.title!=='string'||l.title.length>200||typeof l.url!=='string'||l.url.length>2000||!safeLink(l.url))||typeof s.video!=='string'||s.video.length>2000||(s.video&&!safeLink(s.video)))throw Error('Enlace no válido.');
 if(s.question){const q=s.question;if(typeof q.prompt!=='string'||q.prompt.length>2000||!Array.isArray(q.options)||q.options.length!==3||q.options.some(o=>typeof o!=='string'||o.length>1000)||!Number.isInteger(q.correct)||q.correct<0||q.correct>2||typeof q.explanation!=='string'||q.explanation.length>4000)throw Error('Actividad no válida.');}}
 if(new Set(pages).size!==c.pageCount)throw Error('Deben conservarse todas las páginas del manual.');
 if(!Array.isArray(c.completed)||c.completed.some(id=>!ids.has(id))||!c.notes||!c.answers||Object.entries(c.notes).some(([k,v])=>!ids.has(k)||typeof v!=='string'||v.length>10000)||Object.entries(c.answers).some(([k,v])=>!ids.has(k)||!Number.isInteger(v)||v<0||v>2))throw Error('Progreso no válido.');
}
export async function GET(){if(!await getChatGPTUser())return json({error:'Inicia sesión.'},401);return json((await getDb().select().from(trainingCourses).orderBy(desc(trainingCourses.updatedAt))).map(r=>JSON.parse(r.payload)));}
export async function POST(req:Request){if(!await getChatGPTUser())return json({error:'Inicia sesión.'},401);if(!sameOrigin(req))return json({error:'Origen no permitido.'},403);
 let uploaded='';try{if(Number(req.headers.get('content-length'))>32*1024*1024)throw Error('Archivo demasiado grande.');const form=await req.formData(),raw=form.get('course');if(typeof raw!=='string'||new TextEncoder().encode(raw).byteLength>1800000)throw Error('El contenido del curso supera el límite de 1,8 MB de texto. Divide el manual.');const c=JSON.parse(raw) as Course;validate(c);const db=getDb(),old=c.id?(await db.select().from(trainingCourses).where(eq(trainingCourses.id,c.id)))[0]:null;const file=form.get('file');
 if(c.id&&!old)throw Error('Curso no encontrado.');
 const id=old?c.id:crypto.randomUUID();if(!old){if(!(file instanceof File)||file.size>25*1024*1024||file.size<5||new TextDecoder().decode(await file.slice(0,5).arrayBuffer())!=='%PDF-')throw Error('Sube un PDF válido de hasta 25 MB.');await env.BUCKET!.put(`training/${id}.pdf`,file.stream(),{httpMetadata:{contentType:'application/pdf'}});uploaded=id;c.filename=file.name.slice(0,250);}else c.filename=JSON.parse(old!.payload).filename;
 c.id=id;c.updatedAt=new Date().toISOString();const values={payload:JSON.stringify(c),updatedAt:c.updatedAt};if(old)await db.update(trainingCourses).set(values).where(eq(trainingCourses.id,id));else await db.insert(trainingCourses).values({id,...values});return json(c);
 }catch(e){if(uploaded)await env.BUCKET!.delete(`training/${uploaded}.pdf`);return json({error:(e as Error).message},400)}}
export async function DELETE(req:Request){if(!await getChatGPTUser())return json({error:'Inicia sesión.'},401);if(!sameOrigin(req))return json({error:'Origen no permitido.'},403);const id=new URL(req.url).searchParams.get('id');if(!id||! /^[a-f0-9-]{36}$/.test(id))return json({error:'Curso no válido.'},400);await env.BUCKET!.delete(`training/${id}.pdf`);await getDb().delete(trainingCourses).where(eq(trainingCourses.id,id));return json({ok:true});}
