# 💎 DOCUMENTACIÓN SUPREMA - GESTOR DE COMPRAS MIP v2.5

> **Estado del Sistema**: 🚀 92% Optimizado | **Diseño**: Premium Enterprise
> **Última Revisión**: 2026-02-20 | **Estabilidad**: ✅ Crítica-Estable

---

## 🏛️ ARQUITECTURA VISUAL (DESIGN SYSTEM)

El sistema utiliza un lenguaje de diseño **Executive-Grade** orientado a la eficiencia y el prestigio.

| Componente | Clase CSS | Propósito / Efecto |
| :--- | :--- | :--- |
| **Glassmorphism** | `.premium-glass` | Efecto cristal esmerilado con blur de 20px-40px. |
| **Interactive Cards** | `.premium-card` | Elevación dinámica, bordes suaves de 1.5rem. |
| **Pulsing FAB** | `.bottom-nav-fab` | Botón flotante móvil con animación de pulso infinito. |
| **Mesh Gradients** | `.mesh-bg` | Fondos de gradiente de malla para profundidad visual. |
| **Text Effects** | `.text-gradient` | Títulos con gradiente animado azul/índigo/esmeralda. |

---

## 📱 EXPERIENCIA MÓVIL (NATIVE-FEEL)

Optimización extrema para smartphones con una interfaz densa pero ultra-legible.

* **Bottom Nav 2.0**: Altura de 96px, esquinas redondeadas (2.5rem).
* **Safe Areas**: Soporte nativo para `safe-area-inset-bottom` (iPhone/Android).
* **Micro-Interacciones**:
  * `active:scale-95` en todos los botones para feedback físico.
  * Transiciones de 300ms-500ms en cambios de estado.
* **Visibilidad**: Padding global `pb-mobile-nav` (128px) para evitar cortes de contenido.

---

## 📂 MÓDULOS DEL ECOSISTEMA

Resumen compacto de capacidades operativas.

### 💳 GESTIÓN DE ÓRDENES

* **Wizard de 4 Pasos**: Selección Inteligente → Logística → AIU/Financiero → Seguridad.
* **Workflow de Aprobación**: Borrador → Pendiente → Aprobado/Anulado.
* **Seguridad**: Sistema de firmas digitales y logs de auditoría por usuario.

### 🏢 DIRECTORIO DE SOCIOS (PROVEEDORES)

* **Visualización**: Tarjetas densas con indicadores de documentos cargados.
* **Utilidades**: Importación Excel, búsqueda por NIT/Nombre en tiempo real.
* **Documentación**: Gestor integrado de RUT, Cámara de Comercio y Certificaciones.

### 📦 INVENTARIO Y CATÁLOGO

* **Maestro de Items**: Generación automática de SKUs editables.
* **Bodegas**: Soporte multi-bodega con tracking de existencias cruzado.
* **Alertas**: Indicadores de stock Crítico/Bajo/Agotado.

---

## 🔐 MATRIZ DE SEGURIDAD Y ROLES

Configuración de acceso granular para máxima protección de datos.

| Rol | Dashboard | Órdenes | Proveedores | Inventario | Reportes |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Admin** | ✅ TOTAL | ✅ TOTAL | ✅ TOTAL | ✅ TOTAL | ✅ TOTAL |
| **Approver** | ✅ VER | ✅ FIRMAR | ✅ VER | ✅ VER | ✅ VER |
| **Buyer** | ✅ VER | ✅ CREAR | ✅ GESTIÓN | ✅ GESTIÓN | ✅ VER |
| **Viewer** | ✅ VER | ✅ VER | ✅ VER | ✅ VER | ✅ VER |

---

## 🛠️ GUÍA DE OPERACIÓN RÁPIDA

Para mantener el sistema organizado y eficiente.

1. **Carga de Datos**: Utilizar siempre los templates de Excel oficiales.
2. **Impresión**: Usar el botón nativo de la orden; el sistema oculta automáticamente la UI.
3. **Búsqueda**: `Ctrl + K` abre la paleta de comandos global desde cualquier página.
4. **Móvil**: Deslizar horizontalmente en los filtros del Dashboard para cambiar de estado rápidamente.

---

> *Desarrollado con precisión técnica por **Antigravity AI** para MIP Internacional 2026.*
