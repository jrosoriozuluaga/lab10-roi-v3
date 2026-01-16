# Documentación del Proyecto ROI Calculator

Este directorio centra toda la documentación técnica, estratégica y de usuario para el sistema de Medición de ROI para Adopción de AI.

## Índice de Documentos

### 📘 Estrategia y Metodología
*   [**Prueba Técnica**](docs/Prueba%20Técnica.md): El desafío original y los requisitos del proyecto. Define el problema de negocio y los criterios de éxito.
*   [**Framework de Medición**](docs/FRAMEWORK.md): La estrategia central de medición. Define las fórmulas de ROI, los KPIs (Net AI Value, Payback, etc.) y la metodología de cálculo.

### 📕 Guías de Usuario
*   [**Guía de Escenarios**](docs/SCENARIO_GUIDELINES.md): Explicación detallada de los 3 escenarios del calculador (Pesimista, Realista, Optimista), sus valores preestablecidos y cómo interpretar los resultados.

### 📗 Especificaciones Técnicas
*   [**Especificación Funcional**](docs/SPECIFICATION.md): Detalles de los requerimientos funcionales y requisitos del sistema.
*   [**Estructuras de Datos**](docs/DATA_STRUCTURES.md): Definición de los modelos de datos (JSON schemas, interfaces TypeScript) utilizados en la aplicación.
*   [**Análisis de Tareas**](docs/TASK_ANALYSIS.md): Desglose de tareas y planificación del desarrollo.

## Estructura del Proyecto
La documentación está diseñada para diferentes audiencias:
*   **Stakeholders / Negocio**: Ver *Framework* y *Prueba Técnica*.
*   **Usuarios Finales**: Ver *Guía de Escenarios*.
*   **Desarrolladores**: Ver *Especificación*, *Estructuras de Datos* y *Análisis de Tareas*.

## Instalación y Desarrollo

```bash
# Instalar dependencias
npm install

# Correr servidor de desarrollo
npm run dev

# Construir para producción
npm run build
```
