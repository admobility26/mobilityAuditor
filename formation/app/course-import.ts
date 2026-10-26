import type {PdfPage} from './course-model';
import {pageFromItems,detectSections,STRUCTURE_VERSION} from './course-structure';
export async function importManual(file:File,onProgress:(n:number)=>void){
 const pdfjs=await import('pdfjs-dist');pdfjs.GlobalWorkerOptions.workerSrc='/training/pdf.worker.min.mjs';
 const data=new Uint8Array(await file.arrayBuffer());if(new TextDecoder().decode(data.slice(0,5))!=='%PDF-')throw Error('El archivo no es un PDF válido.');
 const task=pdfjs.getDocument({data});const pdf=await task.promise;
 try{if(pdf.numPages>1000)throw Error('El manual supera las 1.000 páginas. Divídelo en volúmenes.');
 const pages:PdfPage[]=[],empty:number[]=[];
 for(let i=1;i<=pdf.numPages;i++){const page=await pdf.getPage(i),content=await page.getTextContent();const items=content.items.filter((x):x is import('pdfjs-dist/types/src/display/api').TextItem=>'str' in x);
 const parsed=pageFromItems(items,i);if(!parsed.text.trim())empty.push(i);pages.push(parsed);onProgress(Math.round(i/pdf.numPages*100));page.cleanup();}
 if(empty.length)throw Error(`Las páginas ${empty.slice(0,15).join(', ')}${empty.length>15?'…':''} no tienen texto extraíble. Usa un PDF con OCR para evitar un curso incompleto.`);
 const outline:{title:string;page:number;depth:number}[]=[];
 const walk=async(entries:any[],depth=0)=>{for(const e of entries){try{const dest=typeof e.dest==='string'?await pdf.getDestination(e.dest):e.dest;if(dest?.[0])outline.push({title:e.title,depth,page:(await pdf.getPageIndex(dest[0]))+1});}catch{}if(e.items?.length)await walk(e.items,depth+1);}};
 await walk(await pdf.getOutline()||[]);
 return {pageCount:pdf.numPages,sections:detectSections(pages,outline),structureVersion:STRUCTURE_VERSION};
 }finally{await task.destroy();}
}
