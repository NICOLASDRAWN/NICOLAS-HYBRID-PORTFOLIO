<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Proveedores MIP

Sistema de gestión de proveedores con soporte local y respaldo en Drive.

## Estructura del Proyecto
El proyecto ha sido reestructurado para mayor orden:
- `src/`: Contiene todo el código fuente del frontend (React).
- `server.js`: Backend Express para manejo de archivos y base de datos local.
- `electron-main.js`: Punto de entrada para la aplicación de escritorio.
- `uploads/`: Carpeta donde se almacenan los documentos de proveedores.
- `database.json`: Base de datos local (JSON).

## Instalación

1. Instalar Node.js (si no lo tienes).
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. (Opcional) Configurar API Key de Gemini en `.env.local` si deseas funciones de IA.

## Ejecución

### Modo Desarrollo (Web)
Para trabajar en la aplicación usando el navegador:
```bash
npm start
```
Esto iniciará tanto el backend (puerto 3001) como el frontend (puerto 3000).

### Modo Aplicación (Escritorio)
Para ejecutar la versión de escritorio:
1. Asegúrate de que las dependencias estén instaladas.
2. Ejecuta:
```bash
npm run app
```
*Nota: En desarrollo, esto requiere que `npm start` esté corriendo o que `npm run dev` esté activo para que Electron pueda cargar la URL local.*

### Build
Para generar los archivos estáticos:
```bash
npm run build
```
