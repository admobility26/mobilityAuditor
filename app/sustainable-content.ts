export const guide='/formacion/guia-movilidad-sostenible.pdf';
export const guidePhases=[
 {title:'Decisión inicial',page:7,key:'guiaInicio',summary:'Acordar alcance, participación, objetivos generales y personas responsables. Reservar recursos y comunicar por qué se inicia el plan.',prompt:'¿Qué centro y colectivos abarca? ¿Quién coordina, quién participa y qué recursos se reservan?'},
 {title:'Información y diagnóstico',page:10,key:'guiaCentro',summary:'Estudiar accesos, transporte, instalaciones y política laboral; contrastar encuestas, entrevistas, incidentes y teletrabajo. Incluir las necesidades de visitantes y proveedores.',prompt:'Describe accesos peatonales y ciclistas, líneas y horarios, último tramo a pie, aparcamientos, duchas, recarga y horarios. Indica qué has comprobado y qué falta visitar.'},
 {title:'Diseño del plan',page:18,key:'guiaDiseno',summary:'Vincular cada barrera con un objetivo medible y medidas viables. Definir indicador, valor de partida, meta, plazo, responsable y presupuesto.',prompt:'Anota objetivo, indicador con denominador y método, valor inicial, meta y fecha; qué datos necesitas recoger de nuevo.'},
 {title:'Registro y comunicación administrativa',page:34,key:'guiaRegistro',summary:'Revisar el trámite aplicable tras aprobar el plan, la autoridad competente y las evidencias de presentación. Un documento guardado en la app no equivale a un plan registrado.',prompt:'Responsable del trámite, fuente normativa vigente, autoridad, plazo aplicable y justificante. No anotes un trámite como realizado sin evidencia.'},
 {title:'Implementación',page:34,key:'guiaImplantacion',summary:'Poner en marcha las medidas aprobadas, explicar cómo se usan e identificar quién las ejecuta. Comprobar que los horarios y servicios funcionan para los distintos turnos.',prompt:'Acciones, responsable, fecha, presupuesto, dependencias, colectivo destinatario y comunicación de puesta en marcha.'},
 {title:'Seguimiento y evaluación',page:36,key:'guiaSeguimiento',summary:'Volver a medir con un método comparable al inicial y contrastar resultados con las metas. Distinguir uso real de una medida, intención de uso y cambios en la plantilla o el transporte.',prompt:'Qué indicador revisarás, con qué frecuencia, quién lo medirá, periodo comparable y cómo documentarás desviaciones y costes reales.'},
 {title:'Actualización',page:37,key:'guiaActualizacion',summary:'Ajustar objetivos y medidas cuando no funcionan o cambian el centro, los turnos, la plantilla o los servicios de transporte. Conservar las razones de cada revisión.',prompt:'Qué ha cambiado, qué medida revisarás, qué nueva evidencia necesitas y cuándo se tomará la decisión.'},
 {title:'Comunicación y participación',page:37,key:'guiaParticipacion',summary:'Escuchar durante todas las fases y devolver resultados agregados. Utilizar canales accesibles para quienes no trabajan delante de un ordenador. Las propuestas de cambio del viaje personal deben resultar atractivas y voluntarias.',prompt:'Canales, personas consultadas, fechas, propuestas recibidas y cómo explicarás la decisión y sus resultados.'}
] as const;
export const sustainableMeasures=[
 ['Movilidad a pie',22,'Revisar continuidad de aceras, iluminación, cruces y seguridad del último tramo. Ofrecer recorridos adecuados a las personas y al entorno.'],
 ['Bicicleta',23,'Combinar ruta segura, aparcamiento protegido, vestuario, mantenimiento y acompañamiento. Analizar la seguridad antes de promover el cambio.'],
 ['Transporte público',24,'Contrastar frecuencias y horarios con los turnos. Valorar ayudas al abono, flexibilidad y conexiones, preguntando por barreras reales.'],
 ['Lanzaderas y rutas de empresa',25,'Estudiar demanda y puntos de conexión; ajustar servicios a entradas y salidas y explorar acuerdos con empresas cercanas.'],
 ['Coche compartido',26,'Valorar compatibilidad de zona, itinerario y horario, participación voluntaria y plazas reservadas. No publicar datos personales para emparejar personas sin un diseño específico de acceso.'],
 ['Aparcamiento',27,'Revisar ocupación y necesidades de acceso, valorar plazas para bicicleta o coche compartido y estudiar incentivos junto a alternativas viables.'],
 ['Evitar viajes innecesarios',28,'Explorar teletrabajo compatible con funciones, reuniones a distancia y organización de la jornada. Reducir exposición sin dar por garantizado un riesgo o emisiones nulos.'],
 ['Flota y desplazamientos en jornada',20,'Relacionar mantenimiento, selección de vehículos, rutas y presión temporal con las incidencias y los kilómetros de exposición registrados.'],
 ['Formación y cooperación',29,'Actualizar la formación a partir de incidentes y nuevas incorporaciones; coordinar mejoras de accesibilidad con otros centros y administraciones.'],
 ['Visitantes y proveedores',31,'Preparar información de acceso previa a la visita y recoger sus necesidades. Esta encuesta a trabajadores no sustituye a un estudio específico de visitantes.']
] as const;
export const guideIndicators=[
 ['Reparto modal','Personas que declaran cada modo principal / personas con respuesta válida. Mostrar base y periodo; no sumar porcentajes de escenarios distintos.'],
 ['Coche en solitario','Distinguir conductores que viajan solos de pasajeros. Registrar ocupación y ámbito antes de interpretar el cambio.'],
 ['Personas-kilómetro y vehículos-kilómetro','Recoger trayectos reales, distancias y días presenciales. No asumir siempre dos trayectos ni sumar pasajeros como vehículos adicionales.'],
 ['Teletrabajo y medidas implantadas','Distinguir compatibilidad del puesto, modalidad, días y uso real. La intención de cambiar no acredita una medida implantada.'],
 ['Seguridad y emisiones','Separar número de incidentes de exposición y documentar los factores de emisión, su fuente, año y unidad; no inventar ahorros por un cambio declarado.']
] as const;
