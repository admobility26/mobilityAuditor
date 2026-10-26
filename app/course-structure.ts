import type {Course,CourseSection,PdfPage} from './course-model';
export const STRUCTURE_VERSION=2;
export type OutlineEntry={title:string;page:number;depth?:number};
export type TextLine={text:string;size:number};
export type TextItem={str:string;height:number;transform:number[];hasEOL?:boolean};
export function pageFromItems(items:TextItem[],page:number):PdfPage{
 const lines:TextLine[]=[];let text='',size=0,lastY:number|undefined;
 const flush=()=>{const clean=text.replace(/\s+/g,' ').trim();if(clean)lines.push({text:clean,size});text='';size=0;};
 for(const item of items){if(!item.str.trim())continue;const y=item.transform[5];if(lastY!==undefined&&Math.abs(y-lastY)>3)flush();text+=(text?' ':'')+item.str;size=Math.max(size,Math.abs(item.height||item.transform[0]||0));lastY=y;if(item.hasEOL)flush();}flush();
 return {page,text:lines.map(l=>l.text).join('\n'),heading:'',lines};
}
const normalize=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const headingNumber=(s:string)=>s.match(/^(\d{1,2})[.)]\s+([^\d\s].*)$/);
const isContents=(p:PdfPage)=>p.text.split('\n').slice(0,10).some(l=>/^(?:[íi]ndice(?:\s+de\s+(?:cap[íi]tulos|contenidos))?|tabla de contenidos|contenidos?)$/i.test(l.trim()));
function bodySize(p:PdfPage){const values=(p.lines||[]).filter(l=>l.text.length>35).map(l=>l.size).sort((a,b)=>a-b);return values[Math.floor(values.length/2)]||10;}
export function detectSections(pages:PdfPage[],outline:OutlineEntry[]=[]):CourseSection[]{
 const contents=new Set(pages.filter(isContents).map(p=>p.page));
 const toc=new Map<number,string>();
 for(const p of pages.filter(p=>contents.has(p.page))){for(const line of p.text.split('\n')){const m=line.trim().match(/^(\d{1,2})[.)]\s+(.+?)\s[.·\s]*(\d{1,4})\s*$/);if(m)toc.set(Number(m[1]),m[2].trim());}}
 const starts:{page:number;line:number;title:string;number:number}[]=[];
 for(const p of pages){if(contents.has(p.page))continue;const lines=p.lines||p.text.split('\n').map(text=>({text,size:0}));const median=bodySize(p);
 for(let i=0;i<lines.length;i++){const line=lines[i],text=line.text.trim(),match=headingNumber(text);if(!match)continue;const n=Number(match[1]);if(n===0||n>60||text.length<7||/\s\d{1,4}$/.test(text))continue;
 const tocTitle=toc.get(n),tocMatch=tocTitle&&(normalize(text).includes(normalize(tocTitle).slice(0,45))||normalize(tocTitle).includes(normalize(match[2]).slice(0,45)));
 if(tocTitle&&!tocMatch)continue;
 const large=line.size>=median*1.12;
 const explicit=/\b(?:m[óo]dulo|cap[íi]tulo)\b/i.test(text);
 if(!tocMatch&&!large&&!explicit)continue;
 let title=text;
 // A chapter title may wrap onto the following line; never join paragraph text.
 for(let j=i+1;j<Math.min(i+3,lines.length);j++){const next=lines[j];if(!next.text.trim()||next.size<line.size*.92||headingNumber(next.text)||/^\d+\.\d+|^(?:ejemplo|actividad|caso)\b/i.test(next.text))break;title+=' '+next.text.trim();}
 if(!starts.some(s=>s.number===n))starts.push({page:p.page,line:i,title:tocMatch?`${n}. ${tocTitle}`:title,number:n});
 }}
 // Numbered chapter sequences have priority over question lists and decorative headings.
 const sequence=starts.filter((s,i,all)=>i===0||s.number>all[i-1].number);
 let boundaries=sequence.length>=2?sequence:[];
 if(!boundaries.length){const valid=outline.filter(e=>Number.isInteger(e.page)&&e.page>=1&&e.page<=pages.length&&e.title?.trim()&&(e.depth||0)===0&&!/^(?:ejemplo|actividad|caso)\b/i.test(e.title.trim()));
 if(valid.length>=2)boundaries=valid.map((e,i)=>{const p=pages.find(p=>p.page===e.page)!;const lines=p.text.split('\n');const line=lines.findIndex(l=>normalize(l)===normalize(e.title));return{page:e.page,line:Math.max(0,line),title:e.title.trim(),number:i+1};}).sort((a,b)=>a.page-b.page||a.line-b.line);}
 const at=new Map(boundaries.map(b=>[`${b.page}:${b.line}`,b.title]));
 const result:CourseSection[]=[];let current:CourseSection|undefined;
 const create=(title:string)=>{const s:CourseSection={id:crypto.randomUUID(),title:title.trim()||'Contenido del manual',pages:[],body:'',links:[],video:'',question:null};result.push(s);return s;};
 for(const p of pages){const lines=p.text.split('\n');for(let i=0;i<lines.length;i++){const title=at.get(`${p.page}:${i}`);if(title)current=create(title);if(!current)current=create(boundaries.length?'Presentación e índice':'Contenido del manual');if(!current.pages.includes(p.page))current.pages.push(p.page);current.body+=(current.body?'\n':'')+lines[i];}}
 return result;
}
export type CourseAnchor={id:string;label:string;offset:number;kind:'example'|'topic'};
export function courseAnchors(section:CourseSection):CourseAnchor[]{const result:CourseAnchor[]=[];let offset=0;for(const line of section.body.split('\n')){const clean=line.trim();const example=/^[A-ZÁÉÍÓÚÑ0-9]/.test(clean)&&!/^Actividad(?: en|\. Para|\. En)\b/.test(clean)&&/^(?:\d+(?:\.\d+)*[.)]?\s+)?(?:ejemplos?|casos?(?: pr[áa]cticos?)?|actividad|taller)\b/i.test(clean);if(!(headingNumber(clean)&&/\s\d{1,4}$/.test(clean))&&normalize(clean)!==normalize(section.title)&&clean.length>3&&clean.length<200&&(example||/^\d+\.\d+(?:\.\d+)*[.)]?\s+\S/.test(clean)||/^Capa \d+[.:]\s/.test(clean)))result.push({id:`${section.id}-jump-${offset}`,label:clean,offset,kind:example?'example':'topic'});offset+=line.length+1;}return result;}
export function reorganizeCourse(course:Course,result:{sections:CourseSection[];pageCount:number}):Course{
 const previousWork=[...(course.previousWork||[])];
 for(const s of course.sections){const notes=course.notes[s.id]||'',completed=course.completed.includes(s.id),answer=course.answers[s.id];if(notes||completed||s.video||s.links.length||s.question)previousWork.push({title:s.title||`Página ${s.pages[0]}`,pages:s.pages,notes,completed,video:s.video,links:s.links,question:s.question,...(answer===undefined?{}:{answer})});}
 const completed=result.sections.filter(s=>s.pages.every(p=>course.sections.filter(old=>old.pages.includes(p)).every(old=>course.completed.includes(old.id)))).map(s=>s.id);
 return {...course,...result,structureVersion:STRUCTURE_VERSION,previousWork,completed,notes:{},answers:{}};
}
