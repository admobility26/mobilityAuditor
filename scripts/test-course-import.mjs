import assert from 'node:assert/strict';
import {sectionsFromPages,safeLink,youtubeEmbed} from '../app/course-model.ts';
const long='Texto íntegro '.repeat(2500);
const pages=[{page:1,text:'Portada',heading:''},{page:2,text:long,heading:'Tema 1'},{page:3,text:'Final del primer tema',heading:''},{page:4,text:'Segundo tema',heading:''}];
const sections=sectionsFromPages(pages,[{title:'Tema 1',page:2},{title:'Subtema en la misma página',page:2},{title:'Tema 2',page:4}]);
assert.equal(sections.length,3);assert.deepEqual(sections.flatMap(s=>s.pages),[1,2,3,4]);assert.equal(sections.map(s=>s.body).join('\n\n'),pages.map(p=>p.text).join('\n\n'));assert.ok(sections[1].body.length>8000);
assert.deepEqual(sectionsFromPages(pages).flatMap(s=>s.pages),[1,2,3,4]);assert.equal(safeLink('javascript:alert(1)'),'');assert.equal(youtubeEmbed('https://youtube.com.evil.test/watch?v=abcdefghijk'),'');assert.equal(youtubeEmbed('https://youtu.be/abcdefghijk'),'https://www.youtube-nocookie.com/embed/abcdefghijk');
console.log('OK: texto >8.000 caracteres, todas las páginas una sola vez, portada, marcadores repetidos y enlaces seguros.');
