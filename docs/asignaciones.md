# Vínculos entre trabajadores y vehículos

Flota → Asignaciones registra una pareja trabajador/vehículo por vínculo. No hay exclusividad: cada persona puede tener varios vehículos y cada vehículo varias personas.

- Campos: trabajador, vehículo, tipo de uso, estado Activa/Inactiva y observaciones.
- Una sola vinculación por pareja. Se puede cambiar su tipo de uso y desactivar/reactivar. Para cambiar los extremos se crea otra pareja.
- El identificador determinista de la pareja utiliza las referencias internas; la clave primaria impide duplicados incluso en escrituras concurrentes.
- Se validan ambas referencias y se bloquea el borrado de trabajadores o vehículos que tienen vínculos. No se requiere migración: se almacenan como registros de flota de tipo `assignments`.
- Búsqueda por nombre o matrícula, filtro por trabajador/vehículo/centro, resúmenes en ambos sentidos y exportación CSV/JSON. Los filtros de fechas de actividad no se aplican a estas asignaciones.
- Acceso desde Trabajadores → Vehículos vinculados y desde el inventario → Ver asignaciones.
- La persona responsable de la ficha del vehículo se conserva. Los usuarios reales, kilómetros y ocupación del análisis siguen procediendo de viajes registrados; un vínculo no acredita un viaje ni permisos de conducción.

Prueba de integración con servidor y proxy de pruebas local en 127.0.0.1:8791: `node scripts/test-assignments.mjs`. Crea únicamente sus ejemplos y los elimina al terminar. No ejecutar contra producción.
