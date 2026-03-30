# 📘 MANUAL DE USUARIO - GESTOR DE COMPRAS MIP v2.5

Este manual contiene las instrucciones operativas para el uso correcto del sistema de gestión de compras de **MIP Internacional Trading SAS**.

---

## 🔑 1. ACCESO Y SEGURIDAD

*   **Usuario Maestro**: `admin` / `master`
*   **Contraseña Universal (Restaurada)**: `123`
*   **Seguridad**: El sistema registra cada acción (Audit Trail). Asegúrese de cerrar sesión al terminar.

---

## 💳 2. GESTIÓN DE ÓRDENES DE COMPRA

Para crear una orden satisfactoria:
1.  **Datos del Proveedor**: Seleccione el proveedor. Sus datos (NIT, Dirección, Banco) se cargarán automáticamente.
2.  **Ítems de Compra**: Agregue los productos. El sistema calcula el Subtotal, IVA y Retenciones.
3.  **Adjuntos (Crítico)**: Vincule la cotización o factura en formato **PDF** usando el botón de carga.
4.  **Flujo de Aprobación**:
    *   **Borrador**: Guarde para editar después.
    *   **Pendiente**: Envía la orden a los aprobadores.
    *   **Aprobado**: La orden se bloquea y se genera el PDF final con firmas digitales.

---

## 📦 3. INVENTARIO Y BODEGAS

*   **Recibo de Mercancía**: Una vez aprobada una orden, puede marcar qué ítems han llegado físicamente.
*   **Stock**: El sistema descuenta existencias automáticamente al generar salidas o ventas (según configuración).

---

## 🏛️ 4. RESPALDOS Y MANTENIMIENTO (PARA ADMINISTRADORES)

*   **Backups**: El sistema crea copias automáticas al entrar y salir.
*   **Sincronización**: Utilice siempre el **CENTRO_DE_CONTROL_MIP.bat** para iniciar el equipo y asegurar que los datos estén al día.

---

## 🌐 5. ACCESO REMOTO

*   Puede acceder desde su celular o desde otra sede activando el **Acceso Remoto** desde el Centro de Control. Escanee el código QR que aparece en la pantalla de inicio para conectarse al nodo central.

---

> Propiedad Intelectual de **MIP Internacional Trading SAS**. Todos los derechos reservados 2026.
