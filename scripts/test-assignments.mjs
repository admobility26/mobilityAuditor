import assert from 'node:assert/strict';
const base='http://127.0.0.1:8791',created=[];
const post=async(path,data)=>{const r=await fetch(base+path,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(data)});return {status:r.status,data:await r.json()}};
const worker=async name=>{const r=await post('/api/responses',{nombre:name,empresa:'QA',centro:'QA',puesto:'QA',funciones:'Prueba de vínculos',modo:'A pie'});assert.equal(r.status,200);created.push(['/api/responses',r.data.id]);return r.data.id};
const vehicle=async plate=>{const r=await post('/api/fleet',{kind:'vehicles',record:{plate,model:'Prueba',company:'QA',center:'QA',category:'Turismo',fuel:'Eléctrico',seats:'5',initialKm:'0',status:'Activo'}});assert.equal(r.status,200);created.push(['/api/fleet',r.data.ids[0]]);return r.data.ids[0]};
try{
const [a,b]=[await worker('QA Persona A'),await worker('QA Persona B')];const [x,y]=[await vehicle('QA-LINK-A'),await vehicle('QA-LINK-B')];
const link=(workerId,vehicleId,extra={})=>post('/api/fleet',{kind:'assignments',record:{workerId,vehicleId,role:'Uso compartido',status:'Activa',...extra}});
for(const [w,v] of [[a,x],[a,y],[b,x]]){const r=await link(w,v);assert.equal(r.status,200);created.push(['/api/fleet',r.data.ids[0]])}
let rows=await(await fetch(base+'/api/fleet')).json();const links=rows.filter(r=>r.kind==='assignments'&&[a,b].includes(r.workerId));assert.equal(links.filter(r=>r.workerId===a).length,2);assert.equal(links.filter(r=>r.vehicleId===x).length,2);
assert.equal((await link(a,x)).status,400);assert.equal((await link('missing',x)).status,400);assert.equal((await link(a,'missing')).status,400);
assert.equal((await fetch(base+'/api/responses?id='+a,{method:'DELETE'})).status,409);assert.equal((await fetch(base+'/api/fleet?id='+x,{method:'DELETE'})).status,409);
const old=links.find(r=>r.workerId===a&&r.vehicleId===x);assert.equal((await link(b,y,{id:old.id})).status,400);assert.equal((await link(a,x,{id:old.id,status:'Inactiva'})).status,200);
rows=await(await fetch(base+'/api/fleet')).json();assert.equal(rows.find(r=>r.id===old.id).status,'Inactiva');
const concurrent=await Promise.all([link(b,y),link(b,y)]);for(const r of concurrent){assert.ok([200,400].includes(r.status));if(r.status===200&&!created.some(([,id])=>id===r.data.ids[0]))created.push(['/api/fleet',r.data.ids[0]])}rows=await(await fetch(base+'/api/fleet')).json();assert.equal(rows.filter(r=>r.kind==='assignments'&&r.workerId===b&&r.vehicleId===y).length,1);
console.log('Relación muchos a muchos verificada: dos vehículos por persona, dos personas por vehículo, duplicados concurrentes, edición, baja del vínculo, referencias y protección de borrado.');
}finally{for(const [path,id] of created.reverse()){const r=await fetch(base+path+'?id='+encodeURIComponent(id),{method:'DELETE'});assert.equal(r.status,200)}}
