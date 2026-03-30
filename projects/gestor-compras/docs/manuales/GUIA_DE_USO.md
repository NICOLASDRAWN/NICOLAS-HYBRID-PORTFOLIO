# 🚀 Guía de Inicio Rápido - Sistema MIP Internacional

## 📋 Scripts Disponibles

### 1. **INICIAR_Y_GUARDAR.bat** ⭐ (RECOMENDADO)

**Descripción:** Script completo que hace TODO automáticamente.

**¿Qué hace?**

- ✅ Crea backup automático de seguridad
- ✅ Verifica que Node.js esté instalado
- ✅ Instala dependencias si es necesario
- ✅ Inicia el backend (puerto 3000)
- ✅ Inicia el frontend (puerto 5173)
- ✅ Abre el navegador automáticamente
- ✅ Muestra menú interactivo con opciones

**Cómo usar:**

1. Haz doble clic en `INICIAR_Y_GUARDAR.bat`
2. Espera a que todo se inicie (30-60 segundos)
3. El navegador se abrirá automáticamente
4. ¡Listo para usar!

**Menú de opciones incluye:**

- Abrir aplicación en navegador
- Ver estado de servicios
- Crear backup manual
- Reiniciar servicios
- Abrir carpeta de backups
- Detener servicios

---

### 2. **BACKUP_RAPIDO.bat** 💾

**Descripción:** Crea un backup rápido sin iniciar el sistema.

**¿Qué hace?**

- ✅ Copia toda la base de datos
- ✅ Copia archivos de configuración
- ✅ Crea archivo con información del backup
- ✅ Muestra total de backups guardados

**Cómo usar:**

1. Haz doble clic en `BACKUP_RAPIDO.bat`
2. Espera 5-10 segundos
3. ¡Backup completado!

**Cuándo usar:**

- Antes de hacer cambios importantes
- Al final del día de trabajo
- Antes de actualizar el sistema
- Cuando quieras asegurar los datos

---

### 3. **INICIAR_SISTEMA.bat** (Original)

**Descripción:** Script básico de inicio.

**¿Qué hace?**

- Inicia backend y frontend
- Abre el navegador

---

## 🎯 Uso Recomendado Diario

### Al Iniciar el Día

```
1. Doble clic en INICIAR_Y_GUARDAR.bat
2. Esperar a que abra el navegador
3. Iniciar sesión
4. ¡Trabajar normalmente!
```

### Durante el Día

- El sistema corre en segundo plano
- Puedes cerrar el navegador y volver a abrir
- Los datos se guardan automáticamente

### Al Terminar el Día

```
Opción A (Recomendada):
1. Ejecutar BACKUP_RAPIDO.bat
2. Cerrar el navegador
3. En el menú de INICIAR_Y_GUARDAR.bat, seleccionar opción 7 (Detener servicios)

Opción B (Rápida):
1. Simplemente cerrar todo
2. Los servicios se detendrán automáticamente
```

---

## 📁 Estructura de Backups

Los backups se guardan en la carpeta `backups/` con el siguiente formato:

```
backups/
├── backup_2026-02-04_1130/
│   ├── data/
│   │   ├── orders.json
│   │   ├── products.json
│   │   ├── suppliers.json
│   │   └── ...
│   ├── package.json
│   └── INFO.txt
├── backup_2026-02-04_1800/
└── manual_2026-02-04_2000/
```

**Tipos de backup:**

- `backup_YYYY-MM-DD_HHMM/` - Backups automáticos al iniciar
- `manual_YYYY-MM-DD_HHMM/` - Backups manuales desde el menú

---

## 🔧 Solución de Problemas

### ❌ "Node.js no está instalado"

**Solución:**

1. Descargar Node.js desde <https://nodejs.org/>
2. Instalar versión LTS (recomendada)
3. Reiniciar la computadora
4. Volver a ejecutar el script

### ❌ "El puerto 3000 ya está en uso"

**Solución:**

- El backend ya está corriendo
- Puedes continuar normalmente
- O seleccionar opción 4 (Reiniciar servicios) en el menú

### ❌ "El puerto 5173 ya está en uso"

**Solución:**

- El frontend ya está corriendo
- Puedes continuar normalmente
- O seleccionar opción 4 (Reiniciar servicios) en el menú

### ❌ El navegador no abre automáticamente

**Solución:**

1. Abrir manualmente el navegador
2. Ir a: <http://localhost:5173>
3. O presionar opción 1 en el menú

### ❌ Pantalla en blanco en el navegador

**Solución:**

1. Esperar 30 segundos más
2. Refrescar la página (F5)
3. Verificar que ambos servicios estén activos (opción 2 del menú)

---

## 💡 Consejos y Mejores Prácticas

### 🔒 Seguridad de Datos

- ✅ Hacer backup diario (automático al iniciar)
- ✅ Hacer backup manual antes de cambios importantes
- ✅ Mantener al menos 7 días de backups
- ✅ Copiar backups importantes a otra ubicación

### ⚡ Rendimiento

- ✅ Cerrar pestañas del navegador que no uses
- ✅ Reiniciar servicios si notas lentitud (opción 4)
- ✅ Limpiar backups antiguos cada semana

### 📊 Monitoreo

- ✅ Verificar estado de servicios regularmente (opción 2)
- ✅ Revisar que los backups se estén creando
- ✅ Verificar espacio en disco disponible

---

## 🆘 Soporte Rápido

### URLs Importantes

- **Aplicación:** <http://localhost:5173>
- **API Backend:** <http://localhost:3000/api>
- **Página de Borradores:** <http://localhost:5173/#/drafts>

### Comandos Manuales (Si es necesario)

```bash
# Iniciar solo backend
cd backend
npm start

# Iniciar solo frontend
npm run dev

# Instalar dependencias
npm install
cd backend && npm install
```

---

## 📝 Notas Importantes

1. **No cerrar las ventanas de comando** que se abren automáticamente (Backend y Frontend)
2. **Los datos se guardan automáticamente** mientras trabajas
3. **Los backups no ocupan mucho espacio** (generalmente menos de 10 MB cada uno)
4. **Puedes tener múltiples pestañas** del navegador abiertas con la aplicación
5. **El sistema funciona sin internet** (es completamente local)

---

## ✅ Checklist de Inicio

Antes de empezar a trabajar, verifica:

- [ ] Node.js instalado
- [ ] Ejecutado `INICIAR_Y_GUARDAR.bat`
- [ ] Navegador abierto en <http://localhost:5173>
- [ ] Backup creado automáticamente
- [ ] Inicio de sesión exitoso

---

## 🎉 ¡Todo Listo

Si seguiste estos pasos, tu sistema está:

- ✅ Funcionando correctamente
- ✅ Con backup de seguridad
- ✅ Listo para usar
- ✅ Protegido contra pérdida de datos

**¿Preguntas o problemas?**
Revisa la sección de "Solución de Problemas" arriba.

---

**Última actualización:** 2026-02-04
**Versión del sistema:** 3.1 Enterprise
