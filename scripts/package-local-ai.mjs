import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
await fs.copyFile(path.join(root,'app/audit/contract.mjs'),path.join(root,'local-ai/contract.mjs'));
const table=Array.from({length:256},(_,n)=>{let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;return c>>>0;});
const crc=b=>{let c=0xffffffff;for(const x of b)c=table[(c^x)&255]^(c>>>8);return (c^0xffffffff)>>>0;};
const locals=[],directory=[];let offset=0;
for(const name of ['asistente-local.mjs','contract.mjs','LEEME.txt','Iniciar.command']){const bytes=await fs.readFile(path.join(root,'local-ai',name));const filename=Buffer.from('asistente-local/'+name);const sum=crc(bytes);const h=Buffer.alloc(30);h.writeUInt32LE(0x04034b50);h.writeUInt16LE(20,4);h.writeUInt16LE(0x800,6);h.writeUInt16LE(33,12);h.writeUInt32LE(sum,14);h.writeUInt32LE(bytes.length,18);h.writeUInt32LE(bytes.length,22);h.writeUInt16LE(filename.length,26);locals.push(h,filename,bytes);const d=Buffer.alloc(46);d.writeUInt32LE(0x02014b50);d.writeUInt16LE((3<<8)|20,4);d.writeUInt16LE(20,6);d.writeUInt16LE(0x800,8);d.writeUInt16LE(33,14);d.writeUInt32LE(sum,16);d.writeUInt32LE(bytes.length,20);d.writeUInt32LE(bytes.length,24);d.writeUInt16LE(filename.length,28);d.writeUInt32LE(((name.endsWith('.command')?0o100755:0o100644)<<16)>>>0,38);d.writeUInt32LE(offset,42);directory.push(d,filename);offset+=h.length+filename.length+bytes.length;}
const central=Buffer.concat(directory);const end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50);end.writeUInt16LE(4,8);end.writeUInt16LE(4,10);end.writeUInt32LE(central.length,12);end.writeUInt32LE(offset,16);await fs.mkdir(path.join(root,'public'),{recursive:true});await fs.writeFile(path.join(root,'public/asistente-ia-local.zip'),Buffer.concat([...locals,central,end]));console.log('Asistente local empaquetado con contrato de validación compartido.');
