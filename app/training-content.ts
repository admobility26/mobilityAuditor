export const manual='/formacion/manual-alumnado.pdf?v=20261025r2';
export const materials=[{title:'Manual del alumnado',detail:'17 páginas · contenidos, casos y fichas',url:manual},{title:'Accidentes laborales de tráfico',detail:'Infografía · datos de 2024',url:'/formacion/alt-2024.pdf'},{title:'Evaluación y control',detail:'6 páginas revisadas · cuestionario, corrección y asistencia',url:'/formacion/evaluacion-control.pdf?v=20261025r2'}];
export const modules=[
 {id:'sistema',title:'La movilidad como riesgo integrado',minutes:45,subtitle:'La seguridad se construye entre todos.',topics:[
 ['Objetivos y preguntas de entrada',2,'Revisamos cinco ideas previas: in itinere, manos libres, agendas imposibles, ADAS y rutas cortas. La sesión busca reconocer los riesgos y decidir qué barreras necesita cada desplazamiento.'],
 ['Las cuatro capas del Sistema Seguro',2,'Organización: agendas y comunicaciones. Persona: descanso y atención. Vehículo: mantenimiento y carga. Entorno: vía, tráfico y meteorología. Un error humano no debe dejar al trabajador sin otras barreras de protección.'],
 ['In itinere y desplazamientos en jornada',3,'Distingue el trayecto de ida o vuelta del trabajo de los desplazamientos profesionales durante la jornada. La calificación de un caso concreto depende de sus circunstancias; evita reglas automáticas.'],
 ['El iceberg de los costes',4,'Además de la reparación, registra sustituciones, servicios aplazados, alquileres, horas de coordinación y pérdida de actividad. Trabaja con costes observados, sin aplicar multiplicadores universales.']
 ]},
 {id:'persona',title:'Atención, descanso y organización',minutes:60,subtitle:'Llegar bien empieza antes de salir.',topics:[
 ['Distracción y comunicaciones',4,'La distracción puede ser visual, manual o cognitiva. El manos libres mantiene una demanda mental. Prepara direcciones antes de salir y consulta mensajes únicamente cuando estés detenido en un lugar seguro y legal.'],
 ['Alcohol y medicamentos',5,'El objetivo preventivo es 0,0 alcohol. Si un medicamento provoca efectos que afectan a la conducción, consulta su información y el canal de la empresa para reorganizar el trayecto. No cambies tratamientos por tu cuenta.'],
 ['Fatiga y somnolencia',6,'Bostezos repetidos, pérdida de recuerdos del trayecto o correcciones frecuentes de trayectoria exigen actuar. Ventanilla, música y café no sustituyen al descanso: detente de forma segura y cambia el plan.'],
 ['Presión temporal y semáforo de decisiones',7,'Una agenda que solo se cumple corriendo necesita reorganización. Renegocia citas, reasigna servicios e incorpora márgenes. La empresa también previene al dejar de exigir respuestas durante la conducción.']
 ]},
 {id:'vehiculo',title:'Distancias, lluvia y vehículo',minutes:55,subtitle:'Una revisión breve puede cambiar el viaje.',topics:[
 ['Distancia de reacción y frenado',7,'La distancia de detención suma reacción y frenado. A 90 km/h se recorren 25 metros por segundo: 1,5 segundos de reacción suponen 37,5 metros antes de empezar a frenar.'],
 ['Lluvia y adherencia en Bizkaia',8,'Reduce la velocidad según las condiciones, aumenta la separación y anticipa curvas, retenciones y pasos de peatones. Revisa visibilidad y neumáticos, y añade tiempo a la agenda.'],
 ['Chequeo previo y carga',8,'Comprueba neumáticos, testigos, luces, limpiaparabrisas, retrovisores y cinturón. Sujeta herramientas y cajas incluso en trayectos cortos. Resuelve las anomalías relevantes antes de iniciar la ruta.'],
 ['ADAS: asistentes con límites',9,'Conoce lo que equipa cada vehículo. Sensores sucios, visibilidad y señalización pueden limitar las ayudas. El AEB y el mantenimiento de carril no sustituyen la atención ni garantizan evitar cualquier colisión.']
 ]},
 {id:'rutas',title:'Rutas, emergencias y movilidad sostenible',minutes:50,subtitle:'Elige por exposición al riesgo, además de por tiempo.',topics:[
 ['Comparar rutas y proteger a usuarios vulnerables',10,'Compara tiempo realista, tipo de vía, cruces, lluvia, aparcamiento y maniobras. Anticipa peatones, ciclistas, motoristas y VMP. Una alternativa más larga puede reducir complejidad, pero necesita revisión en su contexto.'],
 ['Proteger · Avisar · Socorrer',10,'Evita un segundo accidente y no te expongas al tráfico. Avisa al 112 cuando sea necesario, indicando ubicación y riesgos, y ayuda dentro de tus conocimientos. La seguridad personal tiene prioridad sobre reparar o fotografiar. Para los vehículos obligados en España, utiliza la baliza V-16 conectada certificada, sin exponerte al tráfico; no sustituye al aviso al 112 cuando sea necesario.'],
 ['Alternativas y rediseño de una jornada',11,'Agrupa visitas, comparte vehículo cuando sea viable y utiliza transporte público o reuniones a distancia. Taller: una visita se retrasa con lluvia; replantea comunicaciones, orden de servicios, márgenes y posible fatiga.'],
 ['Del diagnóstico al seguimiento del plan',12,'Define alcance, encuesta y exposición; fija objetivos medibles, medidas y responsables. Escucha propuestas y revisa incidentes, defectos, kilómetros, rutas y alternativas de movilidad.']
 ]}
] as const;
export const questions=[
 ['El Sistema Seguro considera que…',['Un buen conductor no comete errores','Los errores humanos existen y el sistema debe reducir sus consecuencias','El vehículo es el único responsable'],1,2,'Las cuatro capas deben reducir las consecuencias de los errores.'],
 ['Una llamada con manos libres…',['Elimina la distracción','Puede mantener carga cognitiva','Permite trabajar mientras se conduce'],1,4,'Las manos libres no eliminan la atención mental que exige la conversación.'],
 ['Si una agenda solo se cumple corriendo…',['Es un problema de organización además de conducción','Hay que mejorar la habilidad','Basta con salir cinco minutos antes'],0,7,'Replanificar citas y márgenes evita trasladar toda la presión al conductor.'],
 ['Con alcohol, la referencia preventiva segura es…',['0,0','Una cerveza','Depende de sentirse bien'],0,5,'Se trata de un objetivo preventivo, no de estimar una tasa legal.'],
 ['Ante somnolencia…',['Abrir la ventanilla','Subir la música','Parar de forma segura y descansar o cambiar el plan'],2,6,'Los trucos para aguantar no sustituyen al descanso.'],
 ['La distancia de reacción a 90 km/h durante un segundo es aproximadamente…',['8 metros','25 metros','60 metros'],1,7,'90 dividido entre 3,6 son 25 metros por segundo.'],
 ['El ABS…',['Elimina cualquier riesgo de frenada','Ayuda a evitar el bloqueo y mantener capacidad direccional','Sustituye a los neumáticos'],1,14,'Es una ayuda; no elimina la necesidad de adherencia y neumáticos en buen estado.'],
 ['Un ADAS…',['Sustituye al conductor','Es una capa de asistencia con límites','Permite usar el móvil'],1,9,'Conoce los límites de los asistentes del vehículo concreto.'],
 ['En una furgoneta…',['La carga puede ir suelta si el trayecto es corto','La carga debe ir colocada y sujeta','Solo importa el peso total'],1,8,'Una frenada puede desplazar los objetos incluso en un trayecto breve.'],
 ['La ruta más segura…',['Siempre es la más corta','Considera vía, clima, tráfico, conductor y vehículo','Siempre usa carreteras secundarias'],1,10,'La evaluación debe considerar la exposición y complejidad del trayecto.'],
 ['Ante una avería, la prioridad inicial es…',['Reparar','Protegerse, señalizar con la baliza V-16 conectada sin exponerse y evitar otro siniestro','Hacer fotografías'],1,10,'La seguridad personal tiene prioridad. Utiliza la V-16 conectada certificada cuando corresponda y avisa al 112 si es necesario.'],
 ['Un casi accidente…',['No sirve porque no hubo daños','Puede aportar información preventiva','Debe ocultarse'],1,15,'Comunicarlo permite investigar las barreras antes de que haya lesiones.'],
 ['La política del móvil debe…',['Responsabilizar solo al conductor','Incluir también a quien llama y planifica','Permitir WhatsApp de trabajo durante la marcha'],1,5,'Quien coordina también debe proteger los periodos de conducción.'],
 ['La lluvia…',['Solo afecta a la visibilidad','Puede afectar a adherencia, visibilidad y tiempo de viaje','No cambia la planificación'],1,8,'El margen de agenda forma parte de la prevención.'],
 ['En una empresa pequeña, un plan de movilidad segura y sostenible…',['Puede ser simple, práctico y medible','Requiere cientos de páginas','Solo sirve para transportistas'],0,12,'Ajusta medidas, responsables e indicadores a la actividad real.']
] as const;
export const decisions=[
 {title:'El gerente llama mientras conduces',options:['Responder porque es el gerente','Responder al detenerte en un lugar seguro y legal','Leer primero el mensaje'],correct:1,feedback:'La política debe proteger también frente a llamadas de responsables. No se exige respuesta durante la conducción.'},
 {title:'Bostezos frecuentes y aviso de somnolencia',options:['Abrir la ventanilla y continuar','Acelerar para llegar antes','Detenerse con seguridad y descansar o cambiar el plan'],correct:2,feedback:'La somnolencia exige actuar; las ayudas del vehículo no sustituyen al descanso.'},
 {title:'Llueve y la escobilla deja una franja sin limpiar',options:['Corregir la anomalía antes de salir','Salir porque el trayecto es corto','Confiar en el ADAS'],correct:0,feedback:'La visibilidad debe permitir conducir con seguridad. Corrige el defecto o cambia el vehículo o el plan.'},
 {title:'El primer servicio se retrasa 35 minutos',options:['Recuperar el tiempo conduciendo','Reprogramar y avisar al cliente desde una parada segura','Aceptar todas las visitas sin margen'],correct:1,feedback:'La respuesta es organizativa: revisa orden, horarios, márgenes por lluvia y estado del conductor.'}
];
export type TrainingDraft={title:string;participant:string;company:string;date:string;completed:string[];notes:Record<string,string>;answers:number[];submitted:boolean};
export function blankTraining():TrainingDraft{return {title:'Sesión de prevención vial',participant:'',company:'',date:new Date().toISOString().slice(0,10),completed:[],notes:{},answers:Array(15).fill(-1),submitted:false};}
export function scoreTraining(answers:number[]){return questions.reduce((n,q,i)=>n+(answers[i]===q[2]?1:0),0);}
