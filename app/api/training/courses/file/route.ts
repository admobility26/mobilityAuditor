import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '../../../../chatgpt-auth';
export const dynamic='force-dynamic';
export async function GET(req:Request){if(!await getChatGPTUser())return new Response('Inicia sesión.',{status:401});const id=new URL(req.url).searchParams.get('id');if(!id||! /^[a-f0-9-]{36}$/.test(id))return new Response('No encontrado',{status:404});const file=await env.BUCKET!.get(`training/${id}.pdf`);if(!file)return new Response('No encontrado',{status:404});return new Response(file.body,{headers:{'Content-Type':'application/pdf','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Content-Disposition':'inline; filename="manual.pdf"'}});}
