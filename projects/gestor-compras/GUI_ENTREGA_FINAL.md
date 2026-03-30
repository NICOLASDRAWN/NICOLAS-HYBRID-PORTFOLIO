# Guía de Versión Final - Gestor de Compras MIP Internacional

Esta versión representa el estado consolidado y optimizado del sistema, con todas las mejoras solicitadas implementadas y una limpieza profunda de código obsoleto.

## Resumen de Cambios Principales

1. **Eliminación de "Centros de Costo":** Se ha removido completamente la funcionalidad de Centros de Costo según lo solicitado. Esto incluye la interfaz de usuario, la lógica de base de datos, los tipos de datos y la exportación a Excel.
2. **Rediseño de Orden de Compra (PDF):** El formato de impresión se ha optimizado. Se eliminó la columna de Centro de Costo, permitiendo más espacio para la descripción de los productos, logrando un diseño más limpio y profesional.
3. **Sistema de Carga de PDF Mejorado:** Se ha implementado un sistema robusto para vincular cotizaciones y documentos soporte en formato PDF directamente a las órdenes.
4. **Consolidación de Archivos:** Se ha limpiado el directorio raíz, moviendo la documentación técnica a la carpeta `docs/` y eliminando archivos temporales o de registro (logs) innecesarios.
5. **Ajustes de Cálculos y Tasas:** Se verificaron todos los cálculos de IVA (incluyendo la opción "Otro"), retenciones y protocolo AIU.

## Estructura del Proyecto

* `/backend`: Núcleo del servidor y API (PostgreSQL).
* `/pages`: Componentes principales de la interfaz.
* `/store`: Manejo de estado global y base de datos local.
* `/docs`: Historial de cambios, guías de implementación y registros de limpieza.
* `/docs/PLANTILLAS_CARGA.md`: Guía de encabezados para importación masiva de datos.
* `types.ts`: Definiciones de tipos del sistema.
* `constants.ts`: Configuraciones estáticas (Categorías, Unidades).

## Scripts de Operación

* **`EJECUTAR_MIP.bat`**: Ejecutable maestro único. Permite:
    1. Arrancar el sistema (con limpieza automática).
    2. Actualizar y aplicar cambios (compilación de código).
    3. Crear backups de seguridad.
    4. Detener todos los servicios.
    5. Consultar documentación.

## Recomendaciones de Uso

* **Borradores:** Utilice los borradores para guardar el progreso de órdenes complejas. Se limpian automáticamente al emitir la orden final.
* **Firmas:** Asegúrese de que los usuarios (Admin/Aprobador) carguen su firma en la sección de Configuración para una validación visual en los PDFs.
* **Inventario:** El sistema ahora permite el recibo parcial o total de mercancía vinculada a órdenes de compra aprobadas.

### Versión Release 1.0.0 - Febrero 2026
