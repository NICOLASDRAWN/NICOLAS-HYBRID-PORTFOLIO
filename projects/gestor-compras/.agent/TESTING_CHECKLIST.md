# 🧪 CHECKLIST DE TESTING - GESTOR MIP INTERNACIONAL

## ✅ Estado de Compilación

- [x] Frontend compilado (`npm run build`)
- [x] Backend con dependencias instaladas
- [x] Archivo BAT actualizado con opción de testing

## 📋 Páginas Principales - Verificación de Carga

### 1. **Login** (`/login`)

- [ ] Página carga correctamente
- [ ] Formulario de login visible
- [ ] Credenciales de prueba: `admin` / `123`
- [ ] Redirección exitosa al dashboard

### 2. **Welcome** (`/`)

- [ ] Página de bienvenida carga
- [ ] Botón de acceso funcional

### 3. **Dashboard** (`/dashboard`)

- [ ] Tabla de órdenes visible
- [ ] Estadísticas (Total Órdenes, Gasto Total, etc.) se muestran
- [ ] **NUEVA FUNCIONALIDAD**: Columna "Docs" muestra contador de documentos
- [ ] Filtros funcionan correctamente
- [ ] Tabs "Todas las Órdenes" y "Mis Borradores" funcionan

### 4. **Create Order** (`/create-order`)

- [ ] Wizard de 4 pasos carga
- [ ] Selección de proveedor funciona
- [ ] Agregar productos funciona
- [ ] **NUEVA FUNCIONALIDAD**: Documentos cargados son siempre visibles
- [ ] **NUEVA FUNCIONALIDAD**: "Guardar Borrador" recarga la página para nueva orden
- [ ] Cálculos de totales correctos
- [ ] AIU se calcula correctamente

### 5. **Suppliers** (`/suppliers`)

- [ ] Lista de proveedores carga
- [ ] Búsqueda funciona
- [ ] **NUEVA FUNCIONALIDAD**: Botón "Ver Documentos" visible en cada proveedor
- [ ] **NUEVA FUNCIONALIDAD**: Modal de documentos muestra archivos por orden
- [ ] Crear/Editar proveedor funciona
- [ ] Importar Excel funciona

### 6. **Products** (`/products`)

- [ ] Lista de productos carga
- [ ] Filtros por proveedor funcionan
- [ ] Crear/Editar producto funciona
- [ ] Importar Excel funciona

### 7. **Finance** (`/finance`)

- [ ] Página carga correctamente
- [ ] Gráficos se renderizan
- [ ] Filtros de fecha funcionan
- [ ] Exportar a Excel funciona

### 8. **Inventory** (`/inventory`)

- [ ] Lista de inventario carga
- [ ] Recibir mercancía funciona
- [ ] Asignación a bodegas funciona
- [ ] Estados de inventario correctos

### 9. **Monthly Report** (`/monthly-report`)

- [ ] Reporte mensual carga
- [ ] Selección de mes/año funciona
- [ ] Datos se muestran correctamente
- [ ] Exportar funciona

### 10. **Cost Centers** (`/cost-centers`)

- [ ] Lista de centros de costo carga
- [ ] Crear/Editar funciona
- [ ] Importar Excel funciona

### 11. **Settings** (`/settings`)

- [ ] Configuración general carga
- [ ] Subir logo funciona
- [ ] Subir firma funciona
- [ ] Configuración de email funciona
- [ ] Gestión de usuarios funciona

### 12. **Drafts** (`/drafts`)

- [ ] Borradores del usuario actual se muestran
- [ ] Editar borrador funciona
- [ ] Eliminar borrador funciona

---

## 🔧 Funcionalidades Críticas Nuevas

### ✨ Gestión de Documentos

1. **Dashboard - Columna "Docs"**
   - [ ] Se muestra contador de documentos adjuntos
   - [ ] Icono de archivo visible
   - [ ] Muestra "-" cuando no hay documentos

2. **Suppliers - Visor de Documentos**
   - [ ] Botón "Ver Documentos" (icono de archivo) visible
   - [ ] Modal se abre correctamente
   - [ ] Muestra órdenes agrupadas por proveedor
   - [ ] Documentos se pueden descargar
   - [ ] Muestra fecha de subida
   - [ ] Muestra "Sin Documentos" cuando no hay archivos

3. **Create Order - Visibilidad de Documentos**
   - [ ] Links de descarga siempre visibles (no requieren hover)
   - [ ] Botón de eliminar visible para documentos
   - [ ] Subida de PDF funciona correctamente

### 🔢 Numeración de Órdenes

1. **Reserva de Consecutivos**
   - [ ] No se reserva número al abrir "Create Order"
   - [ ] Número se reserva solo al guardar
   - [ ] Borradores reciben número consecutivo
   - [ ] No hay saltos innecesarios en numeración

2. **Guardar Borrador**
   - [ ] Guarda correctamente
   - [ ] Muestra mensaje de éxito
   - [ ] Recarga la página automáticamente
   - [ ] Limpia el formulario para nueva orden

---

## 🚀 Instrucciones de Testing

### Preparación

```bash
# 1. Ejecutar EJECUTAR_MIP.bat
# 2. Seleccionar opción 4 (Testear Sistema)
# 3. Luego opción 1 (Arrancar Sistema)
```

### Flujo de Prueba Completo

1. **Login**: Ingresar con `admin` / `123`
2. **Dashboard**: Verificar que carga y muestra datos
3. **Crear Orden**:
   - Seleccionar proveedor
   - Agregar productos
   - Subir documento PDF
   - Verificar que documento es visible
   - Guardar como borrador
   - Verificar que recarga
4. **Suppliers**:
   - Buscar proveedor usado en orden
   - Click en "Ver Documentos"
   - Verificar que aparece el PDF subido
5. **Dashboard**:
   - Verificar que orden aparece con contador de docs

### Testing de Errores Comunes

- [ ] Intentar subir archivo no-PDF en documentos (debe rechazar)
- [ ] Crear orden sin proveedor (debe mostrar error)
- [ ] Crear orden sin productos (debe mostrar error)
- [ ] Intentar aprobar sin permisos (debe mostrar error)

---

## 📊 Resultados Esperados

### ✅ Todo Funcional

- Todas las páginas cargan sin errores de consola
- Navegación fluida entre secciones
- Datos se guardan correctamente
- Documentos se suben y visualizan correctamente
- Numeración consecutiva sin saltos

### ⚠️ Problemas Conocidos (Si los hay)

- Ninguno reportado actualmente

---

## 🔍 Comandos de Verificación Rápida

```bash
# Verificar que el build existe
dir dist\index.html

# Verificar backend
dir backend\server.js

# Verificar base de datos
dir backend\data\*.json

# Ver logs del servidor (si hay errores)
# Revisar la ventana "MIP Backend Server"
```

---

## 📝 Notas Finales

- **Usuario de prueba**: `admin` / `123`
- **Puerto**: <http://localhost:3000>
- **Backup automático**: Cada 6 horas
- **Documentación**: GUI_ENTREGA_FINAL.md

**Última actualización**: 2026-02-05
**Versión**: 2.0.0
