---
description: Plan de implementación de mejoras solicitadas para el Gestor de Compras MIP
---

# Mejoras Solicitadas - Enero 2026

## Estado de Implementación

### ✅ COMPLETADO

1. **Actualización de Tipos (types.ts)**
   - [x] ProductType: 'Producto' | 'Servicio'
   - [x] Nuevos estados de orden: AcuerdoComercial, EnRevision, Anulada
   - [x] Estado OCC: EnProceso, Entregado, Pendiente
   - [x] AIU fields: aiuEnabled, aiuAdministracion, aiuImprevistos, aiuUtilidad
   - [x] Documentos adjuntos: OrderDocument interface
   - [x] IVA personalizado: customTaxRate
   - [x] Unidad de medida en items: unit en POItem
   - [x] Tipo de item: itemType en POItem
   - [x] InventoryItem interface para inventario

---

### 🔄 PENDIENTE DE IMPLEMENTAR

## 1. PRODUCTOS - Separar Productos y Servicios (✅ COMPLETADO)

**Archivo:** `pages/Products.tsx`

**Cambios requeridos:**

- [x] Agregar filtro por tipo (Producto/Servicio)
- [x] Agregar campo "Tipo" en el formulario de creación/edición
- [x] Mostrar columna de tipo en la tabla
- [x] Agregar dos pestañas: "Productos" y "Servicios"

---

## 2. ÓRDENES - Nuevos Estados (✅ COMPLETADO)

**Archivos:** `pages/CreateOrder.tsx`, `pages/Dashboard.tsx`

**Estados actuales:**

- Draft, InProcess, Pending, Approved, ChangeRequested, ApprovedForChange

**Nuevos estados a agregar:**

- [x] AcuerdoComercial (Acuerdo Comercial)
- [x] EnRevision (En Revisión)
- [x] Anulada

**Nueva columna Estado OCC:**

- [x] EnProceso
- [x] Entregado
- [x] Pendiente

---

## 3. IVA - Nuevas Opciones (✅ COMPLETADO)

**Archivo:** `pages/CreateOrder.tsx`

**Opciones actuales:** 0%, 5%, 19%

**Agregar:**

- [x] 10%
- [x] "Otro" (campo de texto para porcentaje personalizado)

---

## 4. AIU - Nuevo Campo Editable (✅ COMPLETADO)

**Archivo:** `pages/CreateOrder.tsx`

**Campos:**

- [x] Checkbox para habilitar AIU
- [x] % Administración (editable)
- [x] % Imprevistos (editable)
- [x] % Utilidad (editable)
- [x] Total AIU (calculado)

---

## 5. Documentos Adjuntos (✅ COMPLETADO)

**Archivos:** `pages/CreateOrder.tsx`, `backend/server.js`

**Funcionalidad:**

- [x] Botón "Adjuntar Documento"
- [x] Subida de archivos (PDF, imágenes, etc.)
- [x] Lista de documentos adjuntos
- [x] Posibilidad de descargar/eliminar

---

## 6. Porcentaje de Anticipo Editable (✅ COMPLETADO)

**Archivo:** `pages/CreateOrder.tsx`

**Cambio:**

- [x] Hacer editable el campo de porcentaje cuando se selecciona "Pago Anticipado"
- [x] Actualmente opciones fijas, cambiar a input numérico

---

## 7. Resumen Mensual Descargable (✅ COMPLETADO)

**Archivo:** `pages/Finance.tsx`

**Funcionalidad:**

- [x] Selector de mes/año
- [x] Vista resumen de órdenes del mes
- [x] Totales por estado, proveedor, categoría
- [x] Botón "Descargar Excel"

---

## 8. Inventario en Tiempo Real (✅ COMPLETADO)

**Archivo:** `pages/Inventory.tsx`

**Funcionalidad:**

- [x] Nueva ventana/módulo
- [x] Lista de productos con stock actual
- [x] Alertas de stock bajo
- [x] Historial de movimientos
- [x] Estados: Normal, Bajo, Agotado, Exceso

---

## Orden de Implementación Recomendado

1. Productos (separar Productos/Servicios) - 30 min
2. Órdenes (nuevos estados + OCC) - 45 min
3. IVA (opciones adicionales) - 20 min
4. Porcentaje anticipo editable - 15 min
5. AIU - 30 min
6. Documentos adjuntos - 45 min
7. Resumen mensual - 40 min
8. Inventario - 1 hora

**Tiempo total estimado:** ~4-5 horas
