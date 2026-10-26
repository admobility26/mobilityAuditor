# AD Mobility · Formación

Portal independiente de formación para https://formacion.admobility26.com.
La demostración pública contiene únicamente datos ficticios. Los cursos, documentos originales y progreso real requieren sesión. La aplicación de auditoría mantiene su alojamiento y acceso privado independientes.

## Administración

Iniciar sesión y abrir «Usuarios y claves». El administrador crea alumnos, genera contraseñas aleatorias, fija caducidad y puede bloquear o restablecer accesos. No hay registro público. Cada alumno guarda su propio progreso. Solo el administrador publica cursos y documentos originales (PDF e imágenes hasta 250 MB).

## Desarrollo

Instalar con `npm ci`, ejecutar `npm run dev`. Aplicar las migraciones de `drizzle/` a la base D1 del portal. La prueba `node scripts/test-portal-security.mjs` usa únicamente la instancia local; `scripts/seed-local-admin.mjs` crea una cuenta de prueba local, nunca una cuenta de producción.

Variables de producción: `FORMATION_ADMIN_EMAIL`, `FORMATION_ADMIN_HASH` (secreto PBKDF2), `PUBLIC_ORIGIN`. Enlaces D1 `DB` y R2 `BUCKET`. No guardar contraseñas ni claves en el repositorio. El administrador inicial se crea una sola vez; la variable de arranque no sustituye cambios de contraseña posteriores.

## Alojamiento

El portal tiene su propio proyecto Sites, declarado en `.openai/hosting.json`, base de datos y almacenamiento. Compilar y publicar con el flujo Sites. El Worker de dominio personalizado se encuentra en `../cloudflare/formacion-proxy.mjs`; su configuración en `formacion-proxy.jsonc`. Reenvía al origen del portal y conserva las sesiones seguras. Los datos reales no se incluyen en el código ni en esta copia de GitHub.
