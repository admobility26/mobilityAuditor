import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createReadStream} from 'node:fs';
import {mkdtemp,open,rm,stat} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
const base='http://127.0.0.1:5173',target=250*1024*1024;
const folder=await mkdtemp(path.join(tmpdir(),'ad-large-upload-')),filename=path.join(folder,'Prueba-250MB.pdf');let uploadId='',storedId='';
const login=await fetch(base+'/signin-with-chatgpt?return_to=/',{redirect:'manual'}),cookie=login.headers.getSetCookie().map(c=>c.split(';')[0]).join('; '),headers={cookie};
const call=(body)=>fetch(base+'/api/training/resources/uploads',{method:'POST',headers:{...headers,'content-type':'application/json'},body:JSON.stringify(body)});
try{
 const entries=['1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n','2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n','3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 600 800] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n','4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n'];
 const text='BT /F1 20 Tf 50 700 Td (Prueba de archivo original de 250 MB) Tj ET\n';entries.push(`5 0 obj\n<< /Length ${text.length} >>\nstream\n${text}endstream\nendobj\n`);
 let prefix='%PDF-1.4\n',offsets=[0];for(const entry of entries){offsets.push(Buffer.byteLength(prefix));prefix+=entry;}offsets.push(Buffer.byteLength(prefix));const ending='\nendstream\nendobj\n';const xref='xref\n0 7\n0000000000 65535 f \n'+offsets.slice(1).map(n=>String(n).padStart(10,'0')+' 00000 n \n').join('');let padding=target,head,tail;
 for(let i=0;i<5;i++){head=`6 0 obj\n<< /Length ${padding} >>\nstream\n`;tail=`${xref}trailer\n<< /Size 7 /Root 1 0 R >>\nstartxref\n${Buffer.byteLength(prefix+head)+padding+ending.length}\n%%EOF\n`;padding=target-Buffer.byteLength(prefix+head+ending+tail);}
 const handle=await open(filename,'w');await handle.write(prefix+head);const filler=Buffer.alloc(8*1024*1024,32);for(let remaining=padding;remaining>0;remaining-=Math.min(remaining,filler.length))await handle.write(filler.subarray(0,Math.min(remaining,filler.length)));await handle.write(ending+tail);await handle.close();assert.equal((await stat(filename)).size,target);
 assert.equal((await call({action:'start',filename:'too-large.pdf',mimeType:'application/pdf',size:target+1})).status,400);
 assert.equal((await fetch(base+'/api/training/resources/uploads',{method:'POST',headers:{'content-type':'application/json'},body:'{}'})).status,401);
 let r=await call({action:'start',filename:'Prueba-250MB.pdf',mimeType:'application/pdf',size:target});assert.equal(r.status,200);const start=await r.json();uploadId=start.id;assert.equal((await call({action:'complete',id:uploadId,parts:[]})).status,400);
 const fd=await open(filename,'r'),parts=[];for(let offset=0,part=1;offset<target;offset+=start.chunkSize,part++){const bytes=Buffer.alloc(Math.min(start.chunkSize,target-offset));await fd.read(bytes,0,bytes.length,offset);r=await fetch(`${base}/api/training/resources/uploads?id=${uploadId}&part=${part}`,{method:'PUT',headers:{...headers,'content-type':'application/octet-stream'},body:bytes});assert.equal(r.status,200,await r.clone().text());const data=await r.json();parts.push(data);if(part===1){const repeat=await fetch(`${base}/api/training/resources/uploads?id=${uploadId}&part=1`,{method:'PUT',headers:{...headers,'content-type':'application/octet-stream'},body:bytes});assert.equal(repeat.status,200);const retried=await repeat.json();assert.equal(retried.partNumber,1);parts[0]=retried;}}await fd.close();
 r=await call({action:'complete',id:uploadId,parts});assert.equal(r.status,200,await r.clone().text());const record=await r.json();storedId=record.id;assert.equal(record.size,target);assert.equal((await call({action:'complete',id:uploadId,parts})).status,200);
 const original=createHash('sha256');for await(const chunk of createReadStream(filename))original.update(chunk);const download=createHash('sha256');const served=await fetch(`${base}/api/training/resources/file?id=${storedId}`,{headers});assert.equal(served.status,200);if(served.headers.has('content-length'))assert.equal(Number(served.headers.get('content-length')),target);let received=0;for await(const chunk of served.body){received+=chunk.length;download.update(chunk);}assert.equal(received,target);assert.equal(original.digest('hex'),download.digest('hex'));
 r=await fetch(`${base}/api/training/resources/file?id=${storedId}`,{headers:{...headers,range:'bytes=0-99'}});assert.equal(r.status,206);assert.equal((await r.arrayBuffer()).byteLength,100);assert.equal(r.headers.get('content-range'),`bytes 0-99/${target}`);
 r=await fetch(`${base}/api/training/resources/file?id=${storedId}`,{headers:{...headers,range:'bytes='+target+'-'}});assert.equal(r.status,416);
 console.log('OK: PDF válido de 250 MB, 32 partes, reintento de parte, finalización repetida, SHA-256 idéntico, rangos y acceso privado.');
}finally{
 if(storedId)await fetch(`${base}/api/training/resources?id=${storedId}`,{method:'DELETE',headers});else if(uploadId)await fetch(`${base}/api/training/resources/uploads?id=${uploadId}`,{method:'DELETE',headers});await rm(folder,{recursive:true,force:true});
}
