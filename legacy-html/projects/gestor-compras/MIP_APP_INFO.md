# 📦 Aplicación MIP Internacional - Gestor de Compras

Esta es la versión de escritorio de tu sistema. Se ha configurado para ejecutarse como una aplicación independiente en Windows.

## 🚀 Cómo ejecutar la aplicación

1. **Modo Desarrollo (Instantáneo):**
   Ejecuta el archivo `EJECUTAR_APP_DEV.bat` para abrir la ventana de la aplicación de inmediato.

2. **Versión Compilada (Instalador):**
   Una vez que termine el proceso de empaquetado, encontrarás el instalador en:
   `dist-app/MIP Internacional - Gestor de Compras Setup 0.0.0.exe`

   Al instalarla, se creará un acceso directo en tu escritorio con el logo del sistema.

## 💾 Almacenamiento Seguro de Datos

La aplicación está configurada profesionalmente para guardar tus datos en la carpeta de sistema `%APPDATA%/MIP Internacional - Gestor de Compras`.

- Esto asegura que tus datos (órdenes, proveedores, backups) persistan incluso si actualizas o reinstalas la aplicación.
- Los archivos se mantienen privados en tu perfil de usuario.

## 🌐 Conectividad

Al iniciar la aplicación, verás automáticamente un mensaje con los enlaces de acceso:

- **Local:** Para usar en este mismo computador.
- **Red:** Para que otros computadores de tu misma oficina entren al sistema.
- **Remoto:** Si tienes configurado un túnel o IP pública.

## 🛠️ Notas Técnicas

- **Framework:** Electron + Node.js
- **Frontend:** React (Vite)
- **Seguridad:** Datos locales persistentes y backups automáticos.

---
*Generado por Antigravity AI*
