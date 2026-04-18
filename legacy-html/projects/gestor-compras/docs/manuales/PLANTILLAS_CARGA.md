# 📄 Plantillas de Carga Masiva (Excel/CSV)

Utilice estas tablas como referencia para estructurar sus archivos de carga masiva. El sistema detecta automáticamente los encabezados basándose en los nombres de las columnas.

## 🏢 Importación de Proveedores

El archivo debe tener al menos el **Nombre** y el **NIT**.

| Columna (Encabezados Soportados) | Descripción | Requerido | Ejemplo |
| :--- | :--- | :--- | :--- |
| **Nombre**, RAZONSOCIAL, EMPRESA, NAME | Nombre legal o comercial | Sí | Mi Proveedor SAS |
| **NIT**, RUC, IDENTIFICACION, TAXID | Identificación tributaria | Sí | 900.123.456-7 |
| EMAIL, CORREO, MAIL | Correo electrónico | No | <ventas@proveedor.com> |
| TELEFONO, CELULAR, PHONE | Número de contacto | No | 3001234567 |
| DIRECCION, UBICACION, ADDRESS | Ubicación física | No | Calle 123 #45-67 |
| CATEGORIA, TIPO, RUBRO | Categoría general | No | SUMINISTRO |
| SUBCATEGORIA, SUBTIPO | Detalle de categoría | No | FERRETERIA |

---

## 📦 Importación de Productos

El archivo debe tener al menos el **Código** y el **Nombre**.

| Columna (Encabezados Soportados) | Descripción | Requerido | Ejemplo |
| :--- | :--- | :--- | :--- |
| **CODIGO**, CODE, ID, REF | Referencia única | Sí | SKU-1001 |
| **NOMBRE**, PRODUCTO, DESCRIPCION | Nombre del ítem | Sí | Botas de Seguridad |
| PRECIO, PRICE, COSTO, VALOR | Valor unitario | No | 85000 |
| UNIDAD, UNIT, MEDIDA, UOM | Unidad (UND, GAL, KG) | No | UND |
| CATEGORIA, CATEGORY, FAMILIA | Categoría del producto | No | EPP |

---

## 💡 Notas Importantes

1. **Sin Encabezados:** Si el archivo no tiene encabezados, el sistema asumirá que la **primera columna** es el Nombre y la **segunda columna** es el Código (en productos).
2. **Códigos Automáticos:** En la carga de productos, si deja la columna de código vacía, el sistema generará uno automáticamente (ej: `AUTO-123456-789`).
3. **Proveedores:** Al importar productos, puede seleccionar un proveedor en el sistema para vincular todos los productos del archivo a ese proveedor específico.
4. **Formatos:** Se recomiendan archivos `.xlsx` (Excel) o `.csv` (valores separados por comas).
