import {sectionsFromPages,type PdfPage} from './course-model';
export async function importManual(file:File,onProgress:(n:number)=>void){
 const pdfjs=await import('pdfjs-dist');pdfjs.GlobalWorkerOptions.workerSrc='/training/pdf.worker.min.mjs';
 const data=new Uint8Array(await file.arrayBuffer());if(new TextDecoder().decode(data.slice(0,5))!=='%PDF-')throw Error('El archivo no es un PDF válido.');
 const task=pdfjs.getDocument({data});const pdf=await task.promise;
 try{if(pdf.numPages>1000)throw Error('El manual supera las 1.000 páginas. Divídelo en volúmenes.');
 const pages:PdfPage[]=[],empty:number[]=[];
 for(let i=1;i<=pdf.numPages;i++){const page=await pdf.getPage(i),content=await page.getTextContent();const lines:string[]=[];let line='',lastY:number|undefined;
 const items=content.items.filter((x):x is import('pdfjs-dist/types/src/display/api').TextItem=>'str' in x);
 for(const item of items){const y=item.transform[5];if(lastY!==undefined&&Math.abs(y-lastY)>3&&line){lines.push(line);line='';}line+=(line?' ':'')+item.str;if(item.hasEOL){lines.push(line);line='';}lastY=y;}if(line)lines.push(line);
 const text=lines.join('\n');if(!text.trim())empty.push(i);
 const sizes=items.map(x=>Math.abs(x.height)).filter(Boolean).sort((a,b)=>a-b),median=sizes[Math.floor(sizes.length/2)]||10;
 const heading=items.find(x=>x.str.trim().length>5&&x.str.length<140&&Math.abs(x.height)>median*1.35)?.str.trim()||'';
 pages.push({page:i,text,heading});onProgress(Math.round(i/pdf.numPages*100));page.cleanup();}
 if(empty.length)throw Error(`Las páginas ${empty.slice(0,15).join(', ')}${empty.length>15?'…':''} no tienen texto extraíble. Usa un PDF con OCR para evitar un curso incompleto.`);
 const outline:{title:string;page:number}[]=[];
 const walk=async(entries:any[])=>{for(const e of entries){try{const dest=typeof e.dest==='string'?await pdf.getDestination(e.dest):e.dest;if(dest?.[0])outline.push({title:e.title,page:(await pdf.getPageIndex(dest[0]))+1});}catch{}if(e.items?.length)await walk(e.items);}};
 await walk(await pdf.getOutline()||[]);
 return {pageCount:pdf.numPages,sections:sectionsFromPages(pages,outline)};
 }finally{await task.destroy();}
}
