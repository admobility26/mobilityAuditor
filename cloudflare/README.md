# Entrada de Cloudflare a la aplicación privada

Este Worker redirige a la aplicación existente de AD Mobility y conserva su inicio de sesión y base de datos en Sites.

Configuración de Workers Builds para `admobility26/mobilityAuditor`:

- Rama de producción: `main`.
- Directorio raíz: `/`.
- Comando de compilación: vacío.
- Comando de despliegue: `npx wrangler deploy --config cloudflare/wrangler.jsonc`.
- Comando de versiones no destinadas a producción: `npx wrangler versions upload --config cloudflare/wrangler.jsonc`.

La configuración explícita evita que Wrangler intente detectar el repositorio completo como Next.js. No ejecutar el despliegue sin `--config` en la raíz del proyecto.

No se publican los archivos de la aplicación ni sus documentos en este Worker. Las peticiones GET/HEAD devuelven 302 al origen privado sin copiar parámetros. Otros métodos devuelven 405, para no reenviar datos de formularios. No hay credenciales ni bindings de base de datos en esta configuración.

El despliegue de la aplicación con sus cambios se realiza mediante Sites. Una compilación correcta de este Worker verifica la entrada a esa aplicación; no actualiza su código por sí sola.
