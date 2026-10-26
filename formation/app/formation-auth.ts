import {cookies} from 'next/headers';
import {env} from 'cloudflare:workers';
import {getDb} from '../db';
import {users,sessions} from '../db/schema';
import {and,eq,gt} from 'drizzle-orm';
import {digest} from './password.mjs';
export const SESSION_COOKIE='__Host-ad-formation';
export async function getFormationUser(){const token=(await cookies()).get(SESSION_COOKIE)?.value;if(!token)return null;const now=new Date().toISOString();const row=(await getDb().select({user:users}).from(sessions).innerJoin(users,eq(users.id,sessions.userId)).where(and(eq(sessions.tokenHash,await digest(token)),gt(sessions.expiresAt,now),eq(users.active,1))))[0]?.user;if(!row||(row.expiresAt&&row.expiresAt<=now))return null;return{id:row.id,userId:row.id,email:row.email,name:row.name,role:row.role,expiresAt:row.expiresAt};}
export function sameOrigin(req:Request){const origin=req.headers.get('origin');return !!origin&&[new URL(req.url).origin,env.PUBLIC_ORIGIN].includes(origin);}
export function sessionCookie(token:string,expired=false){return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${expired?0:43200}`;}
export const publicUser=(u:{id:string;email:string;name:string;role:string;active?:number;expiresAt?:string|null;createdAt?:string})=>({id:u.id,email:u.email,name:u.name,role:u.role,active:u.active===undefined?true:!!u.active,expiresAt:u.expiresAt||null,createdAt:u.createdAt});
export async function bootstrapAdmin(){if(!env.FORMATION_ADMIN_HASH||!env.FORMATION_ADMIN_EMAIL)return;await getDb().insert(users).values({id:crypto.randomUUID(),email:env.FORMATION_ADMIN_EMAIL.toLowerCase(),name:'AD Mobility · Administración',passwordHash:env.FORMATION_ADMIN_HASH,role:'admin',active:1,createdAt:new Date().toISOString()}).onConflictDoNothing();}
