export type CourseLink={title:string;url:string};
export type CourseQuestion={prompt:string;options:string[];correct:number;explanation:string};
export type CourseSection={id:string;title:string;pages:number[];body:string;links:CourseLink[];video:string;question:CourseQuestion|null};
export type Course={id:string;title:string;filename:string;pageCount:number;sections:CourseSection[];completed:string[];notes:Record<string,string>;answers:Record<string,number>;updatedAt?:string};
export type PdfPage={page:number;text:string;heading:string};
export function sectionsFromPages(pages:PdfPage[],outline:{title:string;page:number}[]=[]):CourseSection[]{
 const starts=new Map<number,string>();
 for(const e of outline)if(e.page>=1&&e.page<=pages.length&&!starts.has(e.page))starts.set(e.page,e.title);
 if(!starts.size)for(const p of pages)if(p.heading)starts.set(p.page,p.heading);
 if(!starts.has(1))starts.set(1,starts.size?'Inicio del manual':'Contenido del manual');
 const result:CourseSection[]=[];
 for(const p of pages){if(starts.has(p.page))result.push({id:crypto.randomUUID(),title:starts.get(p.page)!,pages:[],body:'',links:[],video:'',question:null});const s=result[result.length-1];s.pages.push(p.page);s.body+=(s.body?'\n\n':'')+p.text;}
 return result;
}
export function safeLink(value:string){try{const u=new URL(value);return ['https:','http:'].includes(u.protocol)?u.href:''}catch{return ''}}
export function youtubeEmbed(value:string){try{const u=new URL(value);const host=u.hostname.replace(/^www\./,'');let id='';if(host==='youtu.be')id=u.pathname.slice(1);if(['youtube.com','m.youtube.com','youtube-nocookie.com'].includes(host))id=u.searchParams.get('v')||u.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1]||'';return /^[\w-]{11}$/.test(id)?`https://www.youtube-nocookie.com/embed/${id}`:''}catch{return ''}}
