# Incorporación de la guía de movilidad sostenible

Fuente: `Guia-movilidad-sostenible.pdf`, 42 páginas, facilitada por el usuario. La copia de consulta íntegra está en `public/formacion/guia-movilidad-sostenible.pdf`; no se modifica su contenido ni se interpretan sus instrucciones como acciones autorizadas por sí mismas.

## Formación

Se incorpora a la biblioteca y al taller complementario «Movilidad sostenible»:

- Ocho fases, con enlaces a las páginas 7, 10, 18, 34, 36 y 37.
- Evaluación de accesos, transporte, instalaciones y políticas laborales, pp. 10-11.
- DAFO con evidencias, pp. 16-17.
- Catálogo de medidas y selección por coste e impacto esperado, pp. 20-33.
- Indicadores, metodología, bases de comparación y seguimiento, pp. 18-19 y 36.
- Participación, comunicación y actualización, pp. 35-37.

Las notas se guardan con la sesión en la base de datos y forman parte de la exportación JSON. El taller es material complementario: no cambia automáticamente la duración de cuatro horas del curso. No presenta trámites administrativos ni evalúa automáticamente obligaciones legales.

## Recogida de información

Se amplían los cuatro grupos existentes de encuesta con campos opcionales:

- Modalidad de trabajo y viabilidad de más teletrabajo, p. 15.
- Itinerario habitual y alternativo, p. 13.
- Número real de trayectos y kilómetros totales de un día presencial, p. 19. Se evita asumir dos trayectos en una jornada partida.
- Problemas de acceso al centro, conocimiento de alternativas y canal de participación, pp. 10-11, 15 y 37.

Los campos se almacenan en el JSON de cada respuesta y se incluyen automáticamente en la exportación CSV/JSON; no requieren migración de tablas ni obligan a completar de nuevo las respuestas existentes. El número de trayectos se valida como entero positivo.

## Criterios de adaptación

La guía recomienda encuestas voluntarias y anónimas (p. 14), mientras que el usuario solicitó registros identificados. Se mantiene el diseño autorizado y se explica la diferencia. No se afirma que anonimizar un informe elimine identificadores de todo texto libre automáticamente.

No se copia la afirmación de que una participación superior a un umbral garantice representatividad, ni la de riesgo/emisiones cero por teletrabajo. Los porcentajes del DAFO de ejemplo no se introducen como datos de la empresa. Se distingue sostenibilidad de seguridad (p. 4).

No se automatizan calendarios legales usando exclusivamente el documento. En la app se enlaza la [Ley 9/2025 consolidada en BOE](https://www.boe.es/eli/es/l/2025/12/03/9/con) para contrastar el ámbito, las modificaciones y los trámites aplicables.

El diagnóstico de IA mantiene su contrato agregado: estos nuevos itinerarios, opiniones y notas no se incorporan al resumen enviado a Ollama.
