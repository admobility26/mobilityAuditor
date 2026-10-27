export default {async fetch(request,env){
 const target=new URL(env.AUDITOR_ORIGIN);const incoming=new URL(request.url);target.pathname=incoming.pathname;target.search=incoming.search;const headers=new Headers(request.headers);headers.delete('host');for(const name of [...headers.keys()])if(name.startsWith('oai-authenticated-'))headers.delete(name);
 const response=await fetch(new Request(target,{method:request.method,headers,body:['GET','HEAD'].includes(request.method)?undefined:request.body,redirect:'manual'}));
 const output=new Headers(response.headers);output.set('Cache-Control','no-store');output.set('X-Content-Type-Options','nosniff');output.set('X-Frame-Options','SAMEORIGIN');output.set('Referrer-Policy','strict-origin-when-cross-origin');const location=output.get('location');if(location){const redirect=new URL(location,target);if(redirect.origin===target.origin){redirect.protocol=incoming.protocol;redirect.host=incoming.host;output.set('location',redirect.href);}}
 return new Response(response.body,{status:response.status,statusText:response.statusText,headers:output});
}};
