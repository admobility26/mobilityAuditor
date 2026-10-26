export type CourseLink={title:string;url:string};
export type CourseQuestion={prompt:string;options:string[];correct:number;explanation:string};
export type CourseSection={id:string;title:string;pages:number[];body:string;links:CourseLink[];video:string;question:CourseQuestion|null};
export type PreviousWork={title:string;pages:number[];notes:string;completed:boolean;video:string;links:CourseLink[];question:CourseQuestion|null;answer?:number};
export type Course={originalResourceId?:string;structureVersion?:number;previousWork?:PreviousWork[];id:string;title:string;filename:string;pageCount:number;sections:CourseSection[];completed:string[];notes:Record<string,string>;answers:Record<string,number>;updatedAt?:string};
export type PdfPage={page:number;text:string;heading:string;lines?:{text:string;size:number}[]};
export function safeLink(value:string){try{const u=new URL(value);return ['https:','http:'].includes(u.protocol)?u.href:''}catch{return ''}}
export function youtubeEmbed(value:string){try{const u=new URL(value);const host=u.hostname.replace(/^www\./,'');let id='';if(host==='youtu.be')id=u.pathname.slice(1);if(['youtube.com','m.youtube.com','youtube-nocookie.com'].includes(host))id=u.searchParams.get('v')||u.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1]||'';return /^[\w-]{11}$/.test(id)?`https://www.youtube-nocookie.com/embed/${id}`:''}catch{return ''}}
