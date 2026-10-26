import assert from 'node:assert/strict';
import {resourceMime} from '../app/training-resource-model.ts';
const text=s=>new TextEncoder().encode(s);
assert.equal(resourceMime(text('%PDF-1.7\ncontenido')),'application/pdf');assert.equal(resourceMime(new Uint8Array([137,80,78,71,13,10,26,10])),'image/png');assert.equal(resourceMime(new Uint8Array([255,216,255,224])),'image/jpeg');assert.equal(resourceMime(text('GIF89a000000')),'image/gif');assert.equal(resourceMime(text('RIFF0000WEBP')),'image/webp');assert.equal(resourceMime(text('<svg onload="x">')),null);assert.equal(resourceMime(text('<html>archivo.pdf')),null);assert.equal(resourceMime(new Uint8Array()),null);
console.log('OK: PDF e imágenes reconocidos por contenido; SVG, HTML y archivos vacíos rechazados.');
