# 📦 GUÍA DE PREPARACIÓN PARA DISTRIBUCIÓN

## 🎯 OBJETIVO

Crear una copia limpia del sistema lista para que otras personas la usen.

---

## 📋 PASOS MANUALES

### PASO 1: Crear Nueva Carpeta

1. Ir al Escritorio
2. Crear carpeta: `gestor-de-compras-mip-v3.1-PRODUCCION`

### PASO 2: Copiar Archivos Necesarios

#### Archivos Raíz

Copiar estos archivos de la carpeta actual a la nueva:

- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `tsconfig.node.json`
- `vite.config.ts`
- `index.html`
- `index.css`
- `App.tsx`
- `main.tsx`
- `types.ts`
- `constants.ts`
- `vite-env.d.ts`
- `postcss.config.js`
- `tailwind.config.js`

#### Scripts de Gestión

- `INICIAR_Y_GUARDAR.bat`
- `BACKUP_RAPIDO.bat`
- `DETENER_SISTEMA.bat`

#### Carpetas Completas

Copiar estas carpetas completas:

- `backend/` (toda la carpeta)
- `pages/` (toda la carpeta)
- `components/` (toda la carpeta)
- `store/` (toda la carpeta)

#### Documentación

Crear carpeta `docs/` y copiar:

- `CAMBIOS_CONSECUTIVOS.md`
- `CAMBIOS_REALIZADOS.txt`
- `GUIA_DE_USO.md`
- `DATOS_CARGADOS.md`
- `MEJORAS_IMPLEMENTADAS.md`

### PASO 3: Crear Script de Instalación

Crear archivo `INSTALAR.bat` en la nueva carpeta con este contenido:

```batch
@echo off
chcp 65001 >nul
color 0B
title Instalacion del Sistema MIP

echo.
echo ════════════════════════════════════════════════════════════════
echo.
echo        INSTALACION DEL SISTEMA MIP v3.1
echo.
echo ════════════════════════════════════════════════════════════════
echo.
echo Iniciando instalacion...
echo.
echo IMPORTANTE: Este proceso puede tomar 2-5 minutos
echo.
pause
echo.
echo Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js no esta instalado
    echo.
    echo Instale Node.js desde: https://nodejs.org/
    pause
    exit
)
echo OK Node.js instalado
echo.
echo Instalando Frontend...
call npm install
echo.
echo Instalando Backend...
cd backend
call npm install
cd ..
echo.
echo ════════════════════════════════════════════════════════════════
echo.
echo  INSTALACION COMPLETADA
echo.
echo  Proximo paso: Doble clic en INICIAR_Y_GUARDAR.bat
echo.
echo ════════════════════════════════════════════════════════════════
echo.
pause
```

### PASO 4: Crear README

Crear archivo `README.md` en la nueva carpeta con este contenido:

```markdown
# 🚀 GESTOR DE COMPRAS MIP INTERNACIONAL v3.1

## ✅ VERSIÓN DE PRODUCCIÓN

**Fecha:** 2026-02-04
**Versión:** 3.1 Enterprise

---

## 🚀 INSTALACIÓN

1. Doble clic en: `INSTALAR.bat`
2. Esperar 2-5 minutos
3. ¡Listo!

---

## 🎬 CÓMO USAR

1. Doble clic en: `INICIAR_Y_GUARDAR.bat`
2. Esperar que abra el navegador
3. Iniciar sesión:
   - Usuario: `admin`
   - Contraseña: `123`

---

## 📊 DATOS INCLUIDOS

- 3 usuarios
- 300+ proveedores
- 30+ productos

---

## ✅ CARACTERÍSTICAS

- Consecutivos por usuario (#0001, #0002...)
- Gestión de borradores
- Backups automáticos
- Sistema completo listo para usar

---

**¡Sistema listo para producción!** 🎉
```

---

## ✅ VERIFICACIÓN FINAL

Antes de entregar, verificar que la nueva carpeta tenga:

- [ ] Archivo `package.json`
- [ ] Carpeta `backend/` completa
- [ ] Carpeta `pages/` completa
- [ ] Carpeta `components/` completa
- [ ] Carpeta `store/` completa
- [ ] Script `INSTALAR.bat`
- [ ] Script `INICIAR_Y_GUARDAR.bat`
- [ ] Archivo `README.md`
- [ ] Carpeta `docs/` con documentación

---

## 🎯 INSTRUCCIONES PARA USUARIOS

Cuando entregues la carpeta, diles:

1. **Instalar Node.js** (si no lo tienen)
   - Descargar de: <https://nodejs.org/>
   - Instalar versión LTS

2. **Ejecutar INSTALAR.bat**
   - Doble clic
   - Esperar 2-5 minutos

3. **Ejecutar INICIAR_Y_GUARDAR.bat**
   - Doble clic
   - Esperar que abra navegador

4. **Iniciar sesión**
   - Usuario: admin
   - Contraseña: 123

5. **¡Listo para trabajar!**

---

## 📞 CREDENCIALES

### Administrador

- Usuario: `admin`
- Contraseña: `123`

### Comprador

- Usuario: `yulimip`
- Contraseña: `mip2025*`

### Super Usuario

- Usuario: `master`
- Contraseña: `master123`

---

## 💡 NOTAS IMPORTANTES

### NO copiar

- ❌ `node_modules/` (se instala automáticamente)
- ❌ `dist/` (se genera automáticamente)
- ❌ `.git/` (no es necesario)
- ❌ Archivos temporales

### SÍ copiar

- ✅ Todo el código fuente
- ✅ `backend/data/` con los datos
- ✅ `backend/uploads/` con archivos subidos
- ✅ Scripts de gestión (.bat)
- ✅ Documentación

---

## 🚀 RESULTADO FINAL

La carpeta `gestor-de-compras-mip-v3.1-PRODUCCION` estará lista para:

- ✅ Copiar a otro computador
- ✅ Compartir con otras personas
- ✅ Instalar en servidor
- ✅ Usar en producción

---

**¡Sistema completo y listo para distribución!** 🎉
