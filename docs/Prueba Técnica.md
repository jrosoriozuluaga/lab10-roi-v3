Prueba Técnica: Sistema de Medición de ROI para Adopción de AI
El reto
Eres el nuevo líder de adopción de AI en una empresa de 500 empleados. La compañía acaba de invertir $250,000 anuales en herramientas de AI como
•	n8n
•	Cursor
•	Gemini
Han pasado 3 meses y los C-Levels quieren saber: "Valió la pena? Cómo sabes? Deberíamos renovar o recortar presupuesto?"
Problema: No existe ningún sistema para medir si esto está funcionando. No solo se necesita un dashboard, se necesita definir QUÉ medir, CÓMO medirlo, y CÓMO probarlo.
Misión
Diseña e implementa un sistema completo de medición de ROI que permita:
1.	Probar el valor de la inversión en AI ante stakeholders
2.	Detectar problemas en la adopción antes de que sea tarde
3.	Tomar decisiones sobre dónde invertir esfuerzo
4.	Predecir si vale la pena seguir invirtiendo
Esto NO es solo construir un dashboard. Es definir una estrategia completa de medición.
Entregables Requeridos
Debes entregar 2 componentes principales:
PARTE 1: El Framework de Medición
1.1 Modelo de ROI
Diseña tu fórmula/modelo para calcular ROI. Debe incluir:
A. Costos (define qué incluir)
•	¿Solo licencias o también tiempo?
•	¿Training, onboarding, soporte?
•	¿Costo de oportunidad?
B. Beneficios (define cómo medirlos)
•	¿Tiempo ahorrado? ¿Cómo lo cuantificas?
•	¿Calidad mejorada? ¿Cómo lo mides?
•	¿Revenue habilitado? ¿Nuevas capacidades?
•	¿Satisfacción/retención de empleados?
C. Tu fórmula final
ROI = ???

Pregunta clave: ¿Qué timeframe usas? ¿ROI a 3 meses, 6 meses, 12 meses?
 
1.2 Métricas del Sistema
Define las métricas importantes.
Formato sugerido (tabla):
| Métrica | Definición | Cómo se mide | Por qué importa | Meta | Frecuencia de revisión |

 
1.3 Proceso de Medición
Describe paso a paso CÓMO capturarías esta información en la realidad:
A. Fuentes de datos
•	¿De dónde salen los números?
•	¿APIs de las herramientas?
•	¿Surveys a usuarios?
•	¿Tracking manual?
•	¿Integraciones con otros sistemas (HRIS, Jira, etc.)?
B. Frecuencia de recolección
•	¿Qué se mide diario, semanal, mensual, trimestral?
•	¿Por qué esa cadencia para cada métrica?
C. Responsabilidades
•	¿Quién recolecta qué?
•	¿Quién analiza?
•	¿Quién toma decisiones basado en qué?
D. Metodología de cálculo para tiempo ahorrado Esta es LA métrica más difícil. Diseña 2-3 métodos concretos. Ejemplos/ideas:
•	¿Self-report de usuarios?
•	¿Benchmarks por tipo de tarea?
•	¿A/B testing entre usuarios con/sin AI?
•	¿Análisis de velocity en Jira?
PARTE 2: El Prototipo Funcional
Dashboard o herramienta construida con AI
Requisitos Mínimos:
Construye un prototipo que implemente tu framework. Debe incluir:
1. Calculator de ROI Interactivo
•	Inputs para ajustar variables (costos, tiempo ahorrado, etc.)
•	Output: ROI calculado + breakdown visual
•	Escenarios: pesimista, realista, optimista
2. Vista de Métricas
3. Alertas/Flags
4. Sección de Recomendaciones
5. Vista para diferentes stakeholders
Specs Técnicas:
•	Stack libre (Lovable, n8n, Cursor, Replit, Supabase, lo que prefieras)
•	Usa data simulada (genera con AI)
 
 
Entrega
Deadline: [5-7 días después de envío]
Formato de entrega:
1.	Link a Notion/Google Doc con Parte 1
2.	Link a dashboard (Parte 2)
3.	Video explicando el dashboard y proceso
Enviar a: valentina@myalter.ai
Criterios de Evaluación (100 puntos)
Passing score: 80/100
1. Pensamiento Estratégico (45 puntos)
•	Modelo de ROI (15 pts) 
o	¿Es defendible y realista?
o	¿Consideraste trade-offs?
o	¿Justificaste bien las decisiones?
•	Framework de métricas (15 pts) 
o	¿Las métricas tienen sentido?
o	¿Cubren activación, uso e impacto?
o	¿Son medibles en la realidad?
•	Proceso de medición (15 pts) 
o	¿Es implementable?
o	¿Consideraste fuentes de data reales?
2. Ejecución Técnica (45 puntos)
•	Funcionalidad del prototipo (15 pts) 
o	¿Funciona el dashboard?
o	¿Implementa bien el framework?
o	¿Es usable?
•	Uso de AI en construcción (30 pts) 
o	¿Aprovechaste bien las herramientas?
3. Comunicación (10 puntos)
•	Claridad de documentos
•	Calidad de visualizaciones