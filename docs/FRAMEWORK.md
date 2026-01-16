# Framework de Medición de ROI para Adopción de AI

Este documento detalla la estrategia de medición implementada en el sistema, cumpliendo con los requisitos de la "Parte 1: El Framework de Medición".

## 1.1 Modelo de ROI

El cálculo del Retorno de Inversión se basa en un modelo ajustado por riesgo que considera factores de eficiencia y atribución para evitar sobreestimaciones.

### Fórmula Maestra

```math
Net AI Value = (Hard Savings + Net Revenue + Cost Avoidance) - Total Costs
ROI % = (Net AI Value / Total Costs) × 100
```

### A. Costos (Total Costs)
Todos los costos se anualizan para el cálculo del ROI.

1.  **Costos Directos (OpEx):**
    *   Licencias mensuales (n8n, Cursor, Gemini, etc.) × 12.
    *   Soporte y mantenimiento.
2.  **Costos de Implementación (CapEx - One-time):**
    *   Setup e integración inicial.
    *   Presupuesto de Training.
3.  **Costos Ocultos (Hidden Costs):**
    *   **Curva de Aprendizaje:** Costo de oportunidad por pérdida de productividad inicial.
    *   *Cálculo:* `Usuarios × Horas de Aprendizaje × Costo Hora × Factor de Ineficiencia (20%)`.

### B. Beneficios (Total Benefits)

1.  **Hard Savings (Ahorros Directos):**
    *   **FTE Savings:** Tiempo ahorrado que se traduce en capacidad productiva.
    *   *Ajuste de Realidad (η):* Se aplica un **Factor de Eficiencia (Eta)**. No todo el tiempo ahorrado es productivo.
    *   *Fórmula:* `(Horas Ahorradas/Semana × 52 × Costo Hora) × η`.
    *   *Otros:* Reducción de costos de outsourcing y consolidación de licencias.

2.  **Hard Revenue (Nuevos Ingresos):**
    *   Ganancias adicionales habilitadas por AI.
    *   *Ajuste de Atribución (α):* **Factor de Atribución (Alpha)**. Porcentaje del ingreso atribuible directamente a la AI.
    *   *Fórmula:* `Revenue Uplift Anual × α`.

3.  **Cost Avoidance (Riesgos Mitigados):**
    *   Reducción de downtime.
    *   Ahorros en multas de compliance.
    *   Prevención de fraude.
    *   Reducción de retrabajo (QA).

### C. Factores de Ajuste (Safety Margins)

*   **η (Eta) - Eficiencia:** 0.45 (Mes 1) a 0.85 (Mes 9+). Penaliza tiempos muertos.
*   **α (Alpha) - Atribución:** 0.20 (Conservador) a 0.50 (Optimista). Define causalidad.

---

## 1.2 Métricas del Sistema

Tabla de métricas core monitoreadas en el Dashboard.

| Métrica | Definición | Cómo se mide | Meta (M3) | Frecuencia |
| :--- | :--- | :--- | :--- | :--- |
| **Net AI Value** | Beneficio económico neto total. | `Beneficios - Costos` | > $0 | Mensual |
| **ROI Acumulativo** | Retorno porcentual sobre inversión total. | `(Net Value / Costos Total) %` | Breakeven | Mensual |
| **Activation Rate** | % empleados que completaron training. | Dato de LMS / HRIS. | > 60% | Semanal |
| **AI MAU** | Usuarios activos mensuales (>1 uso/semana). | Logs de herramientas (Cursor/n8n). | > 50% | Semanal |
| **Power Users** | % usuarios con uso avanzado (>5h/sem). | Análisis de uso por percentil. | > 5% | Mensual |
| **Delivery Rate** | % proyectos entregados a tiempo. | Jira/Linear status. | > 70% | Quincenal |
| **Payback Period** | Tiempo para recuperar inversión. | `Costos / (Beneficio Mensual)` | < 12 Meses | Trimestral |

---

## 1.3 Proceso de Medición

### A. Fuentes de Datos (Data Sources)
El sistema integra datos de tres fuentes principales (simuladas en el prototipo):
1.  **Cost Center (ERP):** Para facturación de licencias e inversión inicial.
2.  **Usage Logs (API):** Consumo de tokens (Gemini) y actividad de usuarios (Cursor/n8n).
3.  **Productivity Tracker (Jira/Linear):** Velocity de equipos y tasa de entrega.

### B. Frecuencia de Recolección
*   **Tiempo Real:** Alertas de consumo de API y errores (Cost Avoidance).
*   **Semanal:** Métricas de adopción (MAU, Activation) para detectar bloqueos rápido.
*   **Mensual:** Cierre financiero (Costos vs Beneficios) para reporte a C-Levels.

### C. Responsabilidades
*   **AI Lead:** Monitorea Adopción y Bloqueos (Vista Operativa).
*   **CTO:** Monitorea Infraestructura, Seguridad y Delivery (Vista Técnica).
*   **CFO:** Valida Hard Savings y aprueba presupuesto (Vista Financiera).
*   **CEO:** Revisa Alineación Estratégica y ROI Macro (Vista Ejecutiva).

### D. Metodología para "Tiempo Ahorrado"
Para cuantificar la métrica más difícil, utilizamos un enfoque híbrido triangular:
1.  **Benchmarks (Base):** Estimación inicial por rol (ej. Devs ahorran 20% en boilerplate).
2.  **Ajuste por Eficiencia (η):** Se descuenta el 40-50% del tiempo teórico por "context switching" y revisiones humanas necesarias.
3.  **Validación por Output:** Se cruza con el "Delivery Rate". Si el tiempo ahorrado no aumenta la velocidad de entrega, el Factor de Eficiencia (η) se reduce automáticamente en el próximo ciclo.
