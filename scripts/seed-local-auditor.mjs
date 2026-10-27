import {execFileSync} from 'node:child_process';
import {passwordHash} from '../app/password.mjs';
const hash=await passwordHash('LocalQA!23456789');
const sql=`INSERT OR IGNORE INTO formation_users (id,email,name,password_hash,role,active,created_at) VALUES ('local-qa-admin','qa-admin@example.invalid','Administrador de prueba local','${hash}','admin',1,'2026-10-26T00:00:00.000Z')`;
execFileSync(process.execPath,['--import','./scripts/sites-env.mjs','./node_modules/wrangler/bin/wrangler.js','d1','execute','DB','--local','--config','dist/server/wrangler.json','--persist-to','.wrangler/state','--command',sql],{stdio:'pipe'});console.log('Cuenta de prueba creada solo en la base local.');
