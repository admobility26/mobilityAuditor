import {GET as resourceFile} from '../../resources/file/route';
import {getFormationUser} from '../../../../formation-auth';
import {getDb} from '../../../../../db';
import {trainingCourses} from '../../../../../db/schema';
import {eq} from 'drizzle-orm';
export const dynamic='force-dynamic';
export async function GET(req:Request){if(!await getFormationUser())return new Response('Inicia sesión.',{status:401});const url=new URL(req.url),id=url.searchParams.get('id');if(!id)return new Response('No encontrado',{status:404});const row=(await getDb().select().from(trainingCourses).where(eq(trainingCourses.id,id)))[0];if(!row)return new Response('No encontrado',{status:404});url.searchParams.set('id',JSON.parse(row.payload).originalResourceId);return resourceFile(new Request(url,req));}
