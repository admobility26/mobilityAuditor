# AD Mobility · mobilityAuditor

Aplicación privada para auditar la movilidad al trabajo y los desplazamientos con vehículos de empresa.

## Funciones

- Trabajadores identificados, puestos, funciones, hábitos, barreras e intención de cambio con incentivos.
- Flota, viajes, conductores y pasajeros, kilómetros, costes, mantenimiento e incidencias.
- Asignaciones de varios vehículos por trabajador y varios trabajadores por vehículo; vínculos activos/inactivos y consulta en ambos sentidos.
- Importación de posiciones GPS y recorridos GPX conservando sus segmentos y tiempos reales.
- Comparación de recorridos históricos y propuestas de alternativas para revisión por un responsable.
- Indicadores, gráficos, exportación CSV/JSON y vistas imprimibles como PDF.
- Diagnósticos trazables y asistente opcional de IA local con Ollama; solo recibe un resumen agregado permitido.
- Formación vial: cuatro módulos, manuales, actividades, autoevaluación y sesiones guardadas.

Aplicación publicada: https://ad-movilidad-auditoria-aitor.aitor-dlgd.chatgpt.site/
Repositorio solicitado: https://github.com/admobility26/mobilityAuditor

## Arquitectura y acceso

React + TypeScript + Vinext; Worker con D1 y Drizzle. El manifiesto `.openai/hosting.json` identifica el Site existente. Su publicación conserva el acceso privado del propietario. Los datos de auditoría están en D1 y no se incluyen en el repositorio.

La autenticación de producción depende del entorno Sites y de sus cabeceras verificadas. Publicar directamente este Worker fuera de Sites requiere implementar una autenticación equivalente y proteger esas cabeceras; copiar el código a Cloudflare no configura ese acceso automáticamente.

El Worker `mobilityauditor.admobility26.workers.dev` redirige a la aplicación privada existente. El código del repositorio y la publicación del Site son operaciones distintas: Workers Builds despliega la redirección con la configuración de `cloudflare/README.md`. La aplicación privada se publica por separado mediante Sites.

## Desarrollo local

Requiere Node.js 22.13 o superior. Instala con `npm ci` y ejecuta `npm run dev` en loopback. El desarrollo portátil incluye una sesión simulada accesible por `/signin-with-chatgpt?return_to=/`; no se incorpora al acceso de producción.

- `npx tsc --noEmit`: comprobar tipos.
- `node scripts/test-kit.mjs`: verificar GPX, indicadores y asistente local.
- `npm run build`: generar el Worker.
- `npm start`: previsualizar la compilación localmente.
- `npm run db:generate`: generar migraciones tras cambios de esquema.

Las migraciones están en `drizzle/`. Para una base local nueva, tras compilar, aplica cada SQL en orden con:

```sh
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/ARCHIVO.sql
```

No repitas migraciones ya aplicadas. La publicación del Site gestiona las migraciones de producción.

## IA local

Consulta `local-ai/LEEME.txt`. El asistente escucha en 127.0.0.1, requiere una clave temporal y usa modelos ya instalados en Ollama. No crea túneles ni envía datos a servicios de IA externos. Si el navegador bloquea la conexión local, utiliza el intercambio de archivos JSON. Las interpretaciones requieren revisión humana.

## Formación revisada · 25/10/2026

Consulta `docs/revision-formacion.md`. Se ha incorporado el manual exacto sin caso de empresa y se ha corregido el cuestionario de apoyo: V-16 conectada certificada, criterio de puntuación, costes indirectos sin multiplicador universal, frenado sin distancias fijas y plantillas de asistencia sin atribuirles carácter oficial.

Los materiales formativos y el logo se incorporan por indicación de su titular. No se presupone una licencia abierta para redistribuirlos. La infografía conserva su atribución institucional y sus datos de 2024.

No subas `.env*`, credenciales, bases de datos locales, exportaciones de trabajadores, recorridos reales, `.wrangler`, `.sites-runtime` ni `node_modules`.
