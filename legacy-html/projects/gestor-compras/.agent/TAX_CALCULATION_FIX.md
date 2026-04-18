# 🔧 CORRECCIONES CRÍTICAS - Sistema de Cálculo de Impuestos

## ❌ PROBLEMA IDENTIFICADO

El sistema tiene **inconsistencia en el formato de tasas de impuesto**:

- **Internamente:** Usa formato decimal (0.19 = 19%)
- **En el SELECT:** Estaba usando formato porcentaje (19 = 19%)
- **En cálculos:** Estaba dividiendo por 100 cuando NO debía

### Ejemplo del Error

```
Producto: 1 × $40,000 con IVA 19%

❌ CÁLCULO INCORRECTO:
- taxRate guardado: 0.19 (correcto)
- SELECT mostraba: value="19" (incorrecto)
- Cálculo: $40,000 × (1 + 19/100) = $40,000 × 1.19 = $47,600
- PERO el sistema dividía 0.19/100 = 0.0019
- Resultado: $40,000 × 1.0019 = $40,076 ❌ INCORRECTO

✅ CÁLCULO CORRECTO:
- taxRate: 0.19
- SELECT: value="0.19"
- Cálculo: $40,000 × (1 + 0.19) = $47,600 ✅ CORRECTO
```

---

## ✅ CORRECCIONES APLICADAS

### 1. **Select de IVA (Líneas 1742-1754)**

```typescript
// ❌ ANTES:
<select value={[0, 5, 19].includes(Number(item.taxRate)) ...}>
  <option value="0">0%</option>
  <option value="5">5%</option>
  <option value="19">19%</option>
</select>

// ✅ DESPUÉS:
<select value={[0, 0.05, 0.19].includes(Number(item.taxRate)) ...}>
  <option value="0">0%</option>
  <option value="0.05">5%</option>
  <option value="0.19">19%</option>
</select>
```

### 2. **Cálculo de Total por Línea (Línea 1772)**

```typescript
// ❌ ANTES:
item.quantity * item.unitPrice * (1 + (item.taxRate === 'custom' 
  ? Number(item.customTaxRate || 0) / 100 
  : Number(item.taxRate) / 100))  // ← División incorrecta

// ✅ DESPUÉS:
item.quantity * item.unitPrice * (1 + (item.taxRate === 'custom' 
  ? Number(item.customTaxRate || 0) / 100 
  : Number(item.taxRate)))  // ← Sin división extra
```

### 3. **Función updateItem (Líneas 660-681)**

Ya estaba correcta después de la corrección anterior.

---

## 📊 VERIFICACIÓN DE CÁLCULOS

### Caso 1: IVA 19% (Estándar)

```
Producto: PANTALON JEANS
Cantidad: 1
Precio Unitario: $40,000
IVA: 19% (0.19)

Cálculo:
- Subtotal: 1 × $40,000 = $40,000
- IVA: $40,000 × 0.19 = $7,600
- Total: $40,000 + $7,600 = $47,600 ✅
```

### Caso 2: IVA 19% (Dos productos iguales)

```
Producto 1: PANTALON JEANS - 1 × $40,000 = $40,000 (IVA 19%)
Producto 2: BOTAS SEGURIDAD - 1 × $40,000 = $40,000 (IVA 19%)

Cálculo:
- Subtotal: $80,000
- IVA P1: $40,000 × 0.19 = $7,600
- IVA P2: $40,000 × 0.19 = $7,600
- Total IVA: $15,200
- TOTAL: $80,000 + $15,200 = $95,200 ✅

NO debe dar $Cop1.600.000 ❌
```

### Caso 3: IVA Personalizado (15%)

```
Producto: SERVICIO ESPECIAL
Cantidad: 2
Precio Unitario: $50,000
IVA: Otro 15% (custom)

Cálculo:
- Subtotal: 2 × $50,000 = $100,000
- IVA: $100,000 × 0.15 = $15,000
- Total: $100,000 + $15,000 = $115,000 ✅
```

---

## 🎯 FORMATO ESTÁNDAR

### Tasas de Impuesto (taxRate)

```typescript
0     = 0%   (Sin IVA)
0.05  = 5%   (IVA Reducido)
0.19  = 19%  (IVA Estándar Colombia)
'custom' = Personalizado (usa customTaxRate)
```

### Tasa Personalizada (customTaxRate)

```typescript
15 = 15% (se guarda como número entero)
// En cálculos se divide: customTaxRate / 100 = 0.15
```

---

## 🧪 PRUEBAS REQUERIDAS

### Prueba 1: Crear Orden con IVA 19%

1. Agregar producto con precio $40,000
2. Cantidad: 1
3. IVA: 19%
4. **Verificar:** Total línea = $47,600

### Prueba 2: Dos Productos Iguales

1. Producto 1: $40,000 × 1 (IVA 19%)
2. Producto 2: $40,000 × 1 (IVA 19%)
3. **Verificar:** Total general = $95,200

### Prueba 3: IVA Personalizado

1. Agregar producto $50,000
2. Cantidad: 2
3. IVA: Otro → 15%
4. **Verificar:** Total línea = $115,000

### Prueba 4: Mix de IVAs

1. Producto A: $10,000 (IVA 0%)
2. Producto B: $10,000 (IVA 5%)
3. Producto C: $10,000 (IVA 19%)
4. **Verificar:**
   - Subtotal: $30,000
   - IVA: $0 + $500 + $1,900 = $2,400
   - Total: $32,400

---

## 📝 ESTADO ACTUAL

✅ **Correcciones Aplicadas:**

- Select de IVA usa valores decimales
- Cálculo de total por línea corregido
- Función updateItem maneja correctamente custom rates

⏳ **Pendiente de Verificar:**

- Pruebas manuales con datos reales
- Verificación de PDF generado
- Validación de totales en resumen

---

## 🚨 IMPORTANTE

**ANTES de continuar usando el sistema:**

1. Recargar la página (Ctrl+F5) para obtener el código actualizado
2. Crear una orden de prueba con los casos descritos arriba
3. Verificar que los totales sean correctos
4. Si hay órdenes antiguas con datos incorrectos, pueden necesitar recalcularse

**Formato Correcto:**

- IVA 0% → value="0" → taxRate = 0
- IVA 5% → value="0.05" → taxRate = 0.05
- IVA 19% → value="0.19" → taxRate = 0.19
- IVA Otro → value="custom" → taxRate = 'custom', customTaxRate = número

---

**Fecha de Corrección:** 2026-02-03 12:16 PM
**Archivos Modificados:** pages/CreateOrder.tsx
**Líneas Corregidas:** 1742, 1752-1754, 1772
