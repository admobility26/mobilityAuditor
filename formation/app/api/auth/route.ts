import {env} from 'cloudflare:workers';
import {getDb} from '../../../db';
import {users,sessions,loginLimits} from '../../../db/schema';
import {eq,lt,sql} from 'drizzle-orm';
import {cookies} from 'next/headers';
import {getFormationUser,sameOrigin,sessionCookie,publicUser,SESSION_COOKIE,bootstrapAdmin} from '../../formation-auth';
import {digest,passwordHash,verifyPassword} from '../../password.mjs';
export const dynamic='force-dynamic';
const json=(data:unknown,status=200,extra={})=>Response.json(data,{status,headers:{'Cache-Control':'no-store',...extra}});
export async function GET(){return json({user:await getFormationUser()});}
export async function POST(req:Request){if(!sameOrigin(req))return json({error:'Origen no permitido.'},403);try{const raw=await req.text();if(raw.length>4096)throw Error('Solicitud demasiado grande.');const b=JSON.parse(raw),db=getDb();
 if(b.action==='login'){
 await bootstrapAdmin();const email=typeof b.email==='string'?b.email.trim().toLowerCase():'',password=typeof b.password==='string'?b.password.slice(0,129):'';const now=Date.now();
 for(const key of [`ip:${req.headers.get('cf-connecting-ip')||'local'}`,`email:${email}`]){const bucket=await digest(key);const rows=await db.insert(loginLimits).values({bucket,attempts:1,untilAt:now+900000}).onConflictDoUpdate({target:loginLimits.bucket,set:{attempts:sql`CASE WHEN until_at<${now} THEN 1 ELSE attempts+1 END`,untilAt:sql`CASE WHEN until_at<${now} THEN ${now+900000} ELSE until_at END`}}).returning();if(rows[0].attempts>(key.startsWith('ip:')?120:15))return json({error:'Demasiados intentos. Espera 15 minutos.'},429);}
 const u=(await db.select().from(users).where(eq(users.email,email)))[0];const ok=await verifyPassword(password,u?.passwordHash||'pbkdf2:100000:dummy:0000000000000000000000000000000000000000000000000000000000000000');if(!u||!u.active||!ok||(u.expiresAt&&u.expiresAt<=new Date().toISOString()))return json({error:'Correo o contraseña incorrectos, o acceso no disponible.'},401);
 const token=Array.from(crypto.getRandomValues(new Uint8Array(32)),n=>n.toString(16).padStart(2,'0')).join('');await db.batch([db.delete(sessions).where(lt(sessions.expiresAt,new Date().toISOString())),db.delete(loginLimits).where(lt(loginLimits.untilAt,now)),db.insert(sessions).values({tokenHash:await digest(token),userId:u.id,expiresAt:new Date(now+43200000).toISOString()})]);return json({user:publicUser(u)},200,{'Set-Cookie':sessionCookie(token)});
 }
 const user=await getFormationUser();if(!user)return json({error:'Inicia sesión.'},401);
 if(b.action==='logout'){const token=(await cookies()).get(SESSION_COOKIE)?.value;if(token)await db.delete(sessions).where(eq(sessions.tokenHash,await digest(token)));return json({ok:true},200,{'Set-Cookie':sessionCookie('',true)});}
 if(b.action==='password'){const u=(await db.select().from(users).where(eq(users.id,user.id)))[0];if(typeof b.password!=='string'||b.password.length<12||b.password.length>128||!await verifyPassword(b.currentPassword||'',u.passwordHash))throw Error('Comprueba tu contraseña actual y escribe una nueva de al menos 12 caracteres.');await db.batch([db.update(users).set({passwordHash:await passwordHash(b.password)}).where(eq(users.id,user.id)),db.delete(sessions).where(eq(sessions.userId,user.id))]);return json({ok:true},200,{'Set-Cookie':sessionCookie('',true)});}
 throw Error('Operación no válida.');
 }catch(e){const message=e instanceof Error?e.message:'';const known=['Solicitud demasiado grande.', 'Operación no válida.', 'Comprueba tu contraseña actual y escribe una nueva de al menos 12 caracteres.'].includes(message);return json({error:known?message:'No se ha podido completar la operación.'},known?400:500);}}
