# Guía de Escenarios del Calculador ROI

Esta guía explica los 3 escenarios preestablecidos en el Calculador de ROI, qué variables afectan, y cómo interactúan entre sí.

## Resumen de Presets

Los escenarios simplifican la proyección ajustando automáticamente tres variables clave de adopción e impacto.

| Variable | 🌧️ Pesimista | 🌤️ Realista (Base) | 🚀 Optimista |
| :--- | :---: | :---: | :---: |
| **Factor de Eficiencia (η)** | 30% | 55% | 80% |
| **Horas Ahorradas/Semana** | 1 hora | 2.5 horas | 5 horas |
| **Factor de Atribución (α)** | 10% | 30% | 50% |

## Detalle de Escenarios

### 1. 🌧️ Escenario Pesimista (Conservador)
*   **Descripción**: Asume baja adopción, alta resistencia al cambio y fricción en la implementación.
*   **Cuándo usarlo**: Para presentar "el peor de los casos" a los stakeholders financieros (CFO) y demostrar que incluso con resultados mínimos, la inversión es segura o el riesgo es bajo.
*   **Narrativa**: "Baja adopción y alta fricción."

### 2. 🌤️ Escenario Realista (Base Case)
*   **Descripción**: Basado en benchmarks actuales del mercado y proyecciones estándar. Es el punto de partida recomendado.
*   **Cuándo usarlo**: Para la planificación operativa y establecimiento de KPIs.
*   **Narrativa**: "Proyección base según benchmarks actuales."

### 3. 🚀 Escenario Optimista (Best Case)
*   **Descripción**: Asume una implementación perfecta, adopción total y madurez operativa de los equipos.
*   **Cuándo usarlo**: Para inspirar y mostrar el potencial máximo de la tecnología si se ejecutan todas las iniciativas de Change Management correctamente.
*   **Narrativa**: "Adopción total y madurez operativa."

## Interacción y Lógica

### Selección de Escenarios
Al hacer clic en uno de los botones de escenario (`Pesimista`, `Realista`, `Optimista`):
1.  **Actualización Inmediata**: Las 3 variables (Eficiencia, Horas, Atribución) se actualizan instantáneamente en los inputs.
2.  **Cálculo de ROI**: El ROI, Net Value y Payback se recalculan automáticamente.
3.  **Feedback Visual**: Se muestra una notificación confirmando el ajuste.

### Modo Personalizado (Override)
*   Si modificas **manualmente** cualquiera de las tres variables controladas por los presets, el escenario activo se deselecciona automáticamente.
*   El sistema interpreta esto como un "Escenario Personalizado".

### Herramienta de Comparación
El botón **"Comparar Escenarios"** abre una vista lateral que:
*   Mantiene tus costos fijos actuales (Licencias, Implementación, Salarios).
*   Calcula y muestra simultáneamente los resultados (ROI, Net Value, Payback) para **los tres escenarios**.
*   Te permite ver rápidamente la sensibilidad de tu inversión frente a la incertidumbre de la adopción.

## Definición de Variables

*   **Factor de Eficiencia (η)**: Porcentaje del tiempo ahorrado que se convierte en valor productivo real. (Ej: Ahorrar 1 hora no siempre significa 1 hora más de trabajo productivo; a veces es descanso o ineficiencia).
*   **Horas Ahorradas/Semana**: Promedio de horas que cada usuario activo ahorra semanalmente gracias a la IA.
*   **Factor de Atribución (α)**: Porcentaje de los nuevos ingresos que pueden atribuirse directamente al uso de IA.
