const DESTINATION = 'https://ad-movilidad-auditoria-aitor.aitor-dlgd.chatgpt.site/';

export default {
  async fetch(request) {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Abre la aplicación para iniciar sesión y gestionar los datos.', {
        status: 405,
        headers: { Allow: 'GET, HEAD', 'Cache-Control': 'no-store' },
      });
    }
    return new Response(null, {
      status: 302,
      headers: {
        Location: DESTINATION,
        'Cache-Control': 'no-store',
        'Referrer-Policy': 'no-referrer',
      },
    });
  },
};
