# 🚀 SISTEMA MIP INTERNACIONAL - SCRIPTS DE GESTIÓN

## 📦 Archivos Creados

Se han creado **4 scripts principales** para facilitar el uso del sistema:

---

## 1. 🎯 **INICIAR_Y_GUARDAR.bat** ⭐ PRINCIPAL

### ¿Qué hace?

Este es el script **MÁS COMPLETO** y el que debes usar normalmente.

**Funciones automáticas:**

- ✅ Crea backup de seguridad antes de iniciar
- ✅ Verifica Node.js y dependencias
- ✅ Inicia Backend (puerto 3000)
- ✅ Inicia Frontend (puerto 5173)
- ✅ Abre navegador automáticamente
- ✅ Muestra menú interactivo

**Menú interactivo incluye:**

1. 🌐 Abrir aplicación en navegador
2. 📊 Ver estado de los servicios
3. 💾 Crear backup manual
4. 🔄 Reiniciar servicios
5. 📁 Abrir carpeta de backups
6. 📝 Ver logs del backend
7. 🛑 Detener todos los servicios
8. ❌ Salir (dejar servicios corriendo)

### 🎬 Cómo usar

```
1. Doble clic en INICIAR_Y_GUARDAR.bat
2. Esperar 30-60 segundos
3. El navegador se abre automáticamente
4. ¡Listo para trabajar!
```

---

## 2. 💾 **BACKUP_RAPIDO.bat**

### ¿Qué hace?

Crea un backup completo de forma rápida sin iniciar el sistema.

**Respalda:**

- ✅ Toda la base de datos (backend/data)
- ✅ Archivos de configuración
- ✅ Crea archivo INFO.txt con detalles

### 🎬 Cómo usar

```
1. Doble clic en BACKUP_RAPIDO.bat
2. Esperar 5-10 segundos
3. ¡Backup completado!
```

### 💡 Cuándo usar

- Antes de hacer cambios importantes
- Al final del día
- Antes de actualizar
- Cuando quieras asegurar datos

---

## 3. 🛑 **DETENER_SISTEMA.bat**

### ¿Qué hace?

Detiene todos los servicios de forma segura.

**Detiene:**

- ✅ Frontend (Vite)
- ✅ Backend (Node.js)
- ✅ Libera puertos 3000 y 5173

### 🎬 Cómo usar

```
1. Doble clic en DETENER_SISTEMA.bat
2. Confirmar con 'S'
3. Servicios detenidos
```

---

## 4. 📖 **GUIA_DE_USO.md**

Documentación completa con:

- Instrucciones detalladas
- Solución de problemas
- Mejores prácticas
- Consejos de seguridad

---

## 🎯 FLUJO DE TRABAJO DIARIO

### ☀️ Al Iniciar el Día

```
1. Doble clic en: INICIAR_Y_GUARDAR.bat
2. Esperar que abra el navegador
3. Iniciar sesión
4. ¡Trabajar!
```

### 💼 Durante el Día

- Sistema corre en segundo plano
- Datos se guardan automáticamente
- Puedes cerrar/abrir navegador libremente

### 🌙 Al Terminar el Día

**Opción A - Completa (Recomendada):**

```
1. Ejecutar: BACKUP_RAPIDO.bat
2. Ejecutar: DETENER_SISTEMA.bat
3. Cerrar todo
```

**Opción B - Rápida:**

```
1. En menú de INICIAR_Y_GUARDAR.bat
2. Seleccionar opción 7 (Detener servicios)
3. Cerrar todo
```

---

## 📁 UBICACIÓN DE BACKUPS

Los backups se guardan en:

```
📁 backups/
   ├── 📁 backup_2026-02-04_1130/    (Automático al iniciar)
   ├── 📁 backup_2026-02-04_1800/    (Automático al iniciar)
   ├── 📁 manual_2026-02-04_2000/    (Manual desde menú)
   └── ...
```

Cada backup contiene:

- `data/` - Base de datos completa
- `*.json` - Archivos de configuración
- `INFO.txt` - Información del backup

---

## 🔥 CARACTERÍSTICAS DESTACADAS

### 🛡️ Seguridad

- ✅ Backup automático al iniciar
- ✅ Backup manual cuando quieras
- ✅ Verificación de integridad
- ✅ Información detallada de cada backup

### ⚡ Velocidad

- ✅ Inicio rápido (30-60 segundos)
- ✅ Backup rápido (5-10 segundos)
- ✅ Detención segura (2-3 segundos)

### 🎨 Interfaz

- ✅ Colores y emojis para fácil lectura
- ✅ Menú interactivo
- ✅ Mensajes claros de estado
- ✅ Confirmaciones de seguridad

### 🔧 Automatización

- ✅ Verifica dependencias
- ✅ Instala si es necesario
- ✅ Detecta servicios corriendo
- ✅ Libera puertos automáticamente

---

## 🆘 SOLUCIÓN RÁPIDA DE PROBLEMAS

### ❌ "Node.js no está instalado"

→ Instalar desde <https://nodejs.org/>

### ❌ "Puerto ya en uso"

→ El servicio ya está corriendo, continuar normalmente

### ❌ Navegador no abre

→ Abrir manualmente: <http://localhost:5173>

### ❌ Pantalla en blanco

→ Esperar 30 segundos y refrescar (F5)

---

## 📊 ESTADÍSTICAS

**Tiempo de inicio:** 30-60 segundos
**Tiempo de backup:** 5-10 segundos
**Tamaño de backup:** ~5-10 MB
**Puertos usados:** 3000 (Backend), 5173 (Frontend)

---

## ✅ CHECKLIST DE VERIFICACIÓN

Antes de trabajar, verifica:

- [ ] Node.js instalado
- [ ] Ejecutado INICIAR_Y_GUARDAR.bat
- [ ] Navegador abierto
- [ ] Backup creado
- [ ] Sesión iniciada

---

## 🎉 ¡LISTO PARA USAR

**Todo está configurado y funcionando.**

### Próximos pasos

1. ✅ Ejecutar `INICIAR_Y_GUARDAR.bat`
2. ✅ Esperar a que abra el navegador
3. ✅ Iniciar sesión
4. ✅ Ir a "Borradores" en el menú
5. ✅ ¡Empezar a trabajar!

---

## 📞 SOPORTE

**URLs importantes:**

- Aplicación: <http://localhost:5173>
- API: <http://localhost:3000/api>
- Borradores: <http://localhost:5173/#/drafts>

**Archivos importantes:**

- `GUIA_DE_USO.md` - Documentación completa
- `MEJORAS_IMPLEMENTADAS.md` - Changelog de mejoras

---

**Versión:** 3.1 Enterprise
**Fecha:** 2026-02-04
**Estado:** ✅ Producción
