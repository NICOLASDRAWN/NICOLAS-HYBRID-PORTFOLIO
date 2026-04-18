import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Un pequeño icono de círculo azul (16x16 PNG incrustado en formato ICO)
// Este es un buffer pre-calculado de un archivo .ico válido muy pequeño
// (Cabecera ICO + Entrada Directorio + Cabecera PNG + Datos PNG de un pixel azul expandido)
// Nota: Para simplificar y asegurar validez, usaré un base64 de un icono genérico azul.

const iconBase64 = "AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A5uQA/+bkAP/m5AD/5uQA/+bkAP/m5AD/5uQA/+bkAP/m5AD/5uQA/+bkAP/m5AD/5uQA/+bkAP/m5AD/5uQA/+bkAP/m5AD/5uQA/+bkAP/m5AD/5uQA/+bkAP/m5AD/5uQA/+bkAP/m5AD/5uQA/+bkAP/m5AD/5uQA/+bkAP/m5AD/5uQA/+bkAP/m5AD/5uQA/+bkAP/m5AD/5uQA/+bkAP/m5AD/5uQA/+bkAP/m5AD/5uQA/+bkAP/m5AD/5uQA/+bkAP/m5AD/5uQA/+bkAP/m5AD/5uQA/+bkAP/m5AD/5uQA/+bkAP/m5AD/5uQA/+bkAP/m5AD/5uQA/+bkAP/m5AD/5uQA/+bkAP/m5AD/5uQA/+bkAP/m5AD/5uQA/+bkAP/m5AD/5uQA/+bkAP/m5AD/5uQA/+bkAP/m5AD/5uQA/+bkAP/m5AD/5uQA/+bkAP/m5AD/5uQA/+bkAP/m5AD/5uQA/+bkAP/m5AD/5uQA/+bkAP/m5AD/5uQA/+bkAP/m5AD/5uQA/+bkAP/m5AD/5uQA/+bkAP/m5AD/5uQA/+bkAP/m5AD/5uQA/+bkAP/m5AD/5uQA/+bkAP/m5AD/5uQA/+bkAP/m5AD/5uQA/+bkAP/m5AD/5uQA/+bkAP/m5AD/5uQA/+bkAP/m5AD/5uQA/+bkAP/m5AD/5uQA/+bkAP/m5AD/5uQA/+bkAP/m5AD/5uQA/+bkAP/m5AD/5uQA/+bkAP/m5AD/5uQA/+bkAP/m5AD/5uQA/+bkAP/m5AD/5uQA/+bkAP/m5AD/5uQA/+bkAP/m5AD/5uQA/+bkAP/m5AD/5uQA/+bkAP/m5AD/5uQA/+bkAP/m5AD/5uQA/+bkAP/m5AD/5uQA/+bkAP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

const buffer = Buffer.from(iconBase64, 'base64');
const iconPath = path.join(__dirname, 'public', 'icon.ico');

try {
    if (!fs.existsSync(path.join(__dirname, 'public'))) {
        fs.mkdirSync(path.join(__dirname, 'public'));
    }
    fs.writeFileSync(iconPath, buffer);
    console.log("Icono azul generado en:", iconPath);
} catch (e) {
    console.error("Error generando icono:", e);
}
