# AD Mobility para Windows y Mac

Instalador de acceso a la suite ONLINE completa. Requiere conexión a Internet; no instala un servidor local ni una base de datos offline. Abre Auditoría y Formación en el navegador predeterminado para conservar los accesos y la compatibilidad con las cuentas privadas. No contiene contraseñas, datos de empresas ni mecanismos para saltarse permisos.

Windows: ejecutar Setup y seguir el asistente. Mac: abrir DMG y arrastrar AD Mobility a Aplicaciones. Elegir el módulo e iniciar sesión en el navegador. Formación conserva administrador, alumnos y demo pública; la auditoría sigue privada.

Compilación: `npm ci`, `npm run dist:mac` (macOS), `npm run dist:win`. Salidas en `release/`. Los paquetes no están firmados con certificados comerciales de Apple/Microsoft. No se ha probado la ejecución en un equipo Windows físico. Para distribución comercial con identidad verificada, firmar y notarizar con las cuentas del propietario.
