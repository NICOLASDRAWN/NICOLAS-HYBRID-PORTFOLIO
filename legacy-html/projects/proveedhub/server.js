import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import fsExtra from 'fs-extra';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define DATA_ROOT based on environment variable (set by Electron main process) or fallback to local
const DATA_ROOT = process.env.PROVEEHUB_DATA_PATH || __dirname;

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
})); 
app.use(express.json());

// Archivos de datos
const DB_FILE = path.join(DATA_ROOT, 'database.json');
const CONFIG_FILE = path.join(DATA_ROOT, 'config.json');
const UPLOADS_DIR = path.join(DATA_ROOT, 'uploads');

// Asegurar directorios iniciales
if (!fs.existsSync(DATA_ROOT)) {
    try {
        fs.mkdirSync(DATA_ROOT, { recursive: true });
    } catch (e) {
        console.error("Error creating Data Root:", e);
    }
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

// Servir archivos estáticos desde la carpeta de datos REAL
app.use('/uploads', express.static(UPLOADS_DIR));

// Helpers de lectura/escritura
const readDb = () => {
  if (!fs.existsSync(DB_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  } catch (e) { return []; }
};

// AUTO-BACKUP LOGIC
let backupTimeout = null;

const performAutoBackup = () => {
    const config = readConfig();
    if (!config.backupPath) return;

    // Debounce: Cancel previous scheduled backup if it happens too fast
    if (backupTimeout) clearTimeout(backupTimeout);

    // Schedule backup in 5 seconds
    backupTimeout = setTimeout(async () => {
        try {
            const targetDir = path.resolve(config.backupPath);
            if (!fs.existsSync(targetDir)) return; // Drive not connected or path invalid

            const destProveedHub = path.join(targetDir, 'ProveedoresMIP_Backup');

            // Use fs-extra sync or async (async better for non-blocking)
            await fsExtra.ensureDir(destProveedHub);
            await fsExtra.copy(DB_FILE, path.join(destProveedHub, 'database.json'));
            await fsExtra.copy(UPLOADS_DIR, path.join(destProveedHub, 'uploads'));
            
            const timestamp = new Date().toLocaleString();
            fs.writeFileSync(path.join(destProveedHub, 'ultimo_sync.txt'), `Sincronizado el: ${timestamp}`);
            
            console.log("Auto-Backup completado exitosamente.");
        } catch (e) {
            console.error("Error en Auto-Backup (puede ser offline):", e.message);
        }
    }, 5000);
};

const writeDb = (data) => {
  try {
      // Rotación de Backups (Seguridad contra corrupción)
      if (fs.existsSync(DB_FILE)) {
          const backup1 = `${DB_FILE}.bak.1`;
          const backup2 = `${DB_FILE}.bak.2`;
          
          try {
            if (fs.existsSync(backup1)) fsExtra.copySync(backup1, backup2); // 1 -> 2
            fsExtra.copySync(DB_FILE, backup1); // Actual -> 1
          } catch (err) {
              console.warn("No se pudo rotar backups locales:", err.message);
          }
      }

      fsExtra.outputJsonSync(DB_FILE, data, { spaces: 2 });
      performAutoBackup(); // Trigger backup on change
  } catch(e) {
      console.error("Error escribiendo DB:", e);
  }
};

const readConfig = () => {
  if (!fs.existsSync(CONFIG_FILE)) return { backupPath: '' };
  try {
    return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
  } catch (e) { return { backupPath: '' }; }
};

const writeConfig = (data) => {
  try {
      fsExtra.outputJsonSync(CONFIG_FILE, data, { spaces: 2 });
  } catch(e) {
      console.error("Error escribiendo config:", e);
  }
};

// --- MIGRACIÓN DE URLs ---
const migrateUrls = () => {
    const suppliers = readDb();
    let changed = false;
    suppliers.forEach(s => {
        if (s.documents) {
            s.documents.forEach(doc => {
                // Si es absoluta local, convertir a relativa
                if (doc.url && doc.url.includes('localhost:3001/uploads/')) {
                    const parts = doc.url.split('/uploads/');
                    if (parts.length > 1) {
                        doc.url = `/uploads/${parts[1]}`;
                        changed = true;
                    }
                }
            });
        }
    });
    if (changed) {
        console.log("Migrando URLs absolutas a relativas en la BD...");
        writeDb(suppliers);
    }
};
migrateUrls(); 

// --- MULTER CONFIG ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const supplierId = req.params.supplierId;
    const supplierDir = path.join(UPLOADS_DIR, supplierId);
    if (!fs.existsSync(supplierDir)) fs.mkdirSync(supplierDir, { recursive: true });
    cb(null, supplierDir);
  },
  filename: (req, file, cb) => {
    const safeName = Buffer.from(file.originalname, 'latin1').toString('utf8').replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, safeName);
  }
});
const upload = multer({ 
    storage,
    limits: { fileSize: 50 * 1024 * 1024 } 
});

// --- SEGURIDAD Y AUDITORÍA ---
const USERS = [
    { name: "Ingrid", pin: "1357" },
    { name: "Yuliet", pin: "2468" },
    { name: "Maria Alejandra", pin: "3690" },
    { name: "Elena", pin: "4710" },
    { name: "Miguel", pin: "5820" },
    { name: "Yesid", pin: "6930" }
];

const AUDIT_FILE = path.join(DATA_ROOT, 'audit_log.txt');

const logAudit = (action, user, details) => {
    const timestamp = new Date().toLocaleString();
    const logEntry = `[${timestamp}] USUARIO: ${user} | ACCIÓN: ${action} | DETALLES: ${details}\n`;
    try {
        fs.appendFileSync(AUDIT_FILE, logEntry);
    } catch (e) {
        console.error("Error escribiendo log de auditoría:", e);
    }
};

// Endpoint para verificar PIN (Opcional si validamos directo en Delete)
app.post('/api/verify-pin', (req, res) => {
    const { pin } = req.body;
    const user = USERS.find(u => u.pin === pin);
    if (user) {
        res.json({ valid: true, user: user.name });
    } else {
        res.status(401).json({ valid: false, error: "PIN incorrecto" });
    }
});

// --- RUTAS API PRINCIPALES ---
app.get('/api/suppliers', (req, res) => {
  res.json(readDb());
});

app.post('/api/suppliers', (req, res) => {
// ... (mantener igual)

  try {
      const suppliers = readDb();
      const newSupplier = req.body;
      
      if (!newSupplier.name) return res.status(400).json({ error: 'El nombre es obligatorio' });

      if (!newSupplier.id) newSupplier.id = Date.now().toString();
      if (!newSupplier.documents) newSupplier.documents = [];
      
      suppliers.unshift(newSupplier);
      writeDb(suppliers);
      
      const supplierDir = path.join(UPLOADS_DIR, newSupplier.id);
      if (!fs.existsSync(supplierDir)) fs.mkdirSync(supplierDir, { recursive: true });

      res.json(newSupplier);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

app.put('/api/suppliers/:id', (req, res) => {
  const suppliers = readDb();
  const { id } = req.params;
  const index = suppliers.findIndex(s => s.id === id);
  
  if (index !== -1) {
    suppliers[index] = { ...suppliers[index], ...req.body };
    writeDb(suppliers);
    res.json(suppliers[index]);
  } else {
    res.status(404).json({ error: 'Proveedor no encontrado' });
  }
});

// DELETE -> POST (Para evitar bloqueos de body en algunos clientes/proxies)
app.post('/api/suppliers/:id/delete', (req, res) => {
    const { id } = req.params;
    const { pin } = req.body;

    if (!pin) return res.status(400).json({ error: 'Se requiere código de seguridad' });

    const user = USERS.find(u => u.pin === pin);
    if (!user) return res.status(403).json({ error: 'Código de seguridad inválido' });

    const suppliers = readDb();
    const index = suppliers.findIndex(s => s.id === id);

    if (index !== -1) {
        const deletedSupplier = suppliers[index];
        
        // Log de Auditoría
        logAudit("ELIMINAR PROVEEDOR", user.name, `Nombre: ${deletedSupplier.name} (ID: ${id})`);

        // Eliminar archivos asociados
        const supplierDir = path.join(UPLOADS_DIR, id);
        if (fs.existsSync(supplierDir)) {
            try {
                fs.rmSync(supplierDir, { recursive: true, force: true });
            } catch(e) { console.error("Error borrando carpeta:", e); }
        }

        suppliers.splice(index, 1);
        writeDb(suppliers);
        res.json({ success: true, message: `Proveedor eliminado por ${user.name}` });
    } else {
        res.status(404).json({ error: 'Proveedor no encontrado' });
    }
});

app.post('/api/suppliers/:supplierId/documents/:docId/delete', (req, res) => {
    const { supplierId, docId } = req.params;
    const { pin } = req.body;

    if (!pin) return res.status(400).json({ error: 'Se requiere código de seguridad' });
    const user = USERS.find(u => u.pin === pin);
    if (!user) return res.status(403).json({ error: 'Código de seguridad inválido' });

    const suppliers = readDb();
    const sIndex = suppliers.findIndex(s => s.id === supplierId);

    if (sIndex !== -1) {
        const supplier = suppliers[sIndex];
        const docIndex = supplier.documents ? supplier.documents.findIndex(d => d.id === docId) : -1;

        if (docIndex !== -1) {
            const doc = supplier.documents[docIndex];
            
            // Log
            logAudit("ELIMINAR DOCUMENTO", user.name, `Documento: ${doc.name} (Proveedor: ${supplier.name})`);

            // Borrar archivo físico si existe
            try {
                // Extraer nombre de archivo de la URL relativa
                const filename = path.basename(doc.url); 
                const filePath = path.join(UPLOADS_DIR, supplierId, filename);
                
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            } catch(e) {
                console.error("Error eliminando archivo físico:", e);
            }

            supplier.documents.splice(docIndex, 1);
            writeDb(suppliers);
            res.json({ success: true });
        } else {
            res.status(404).json({ error: 'Documento no encontrado' });
        }
    } else {
        res.status(404).json({ error: 'Proveedor no encontrado' });
    }
});

app.post('/api/upload/:supplierId', upload.single('file'), (req, res) => {
  const { supplierId } = req.params;
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'Sin archivo' });

  const suppliers = readDb();
  const index = suppliers.findIndex(s => s.id === supplierId);

  if (index !== -1) {
    const relativePath = `/uploads/${supplierId}/${file.filename}`;
    
    const newDoc = {
      id: Date.now().toString(),
      name: file.originalname, 
      url: relativePath,
      type: file.mimetype,
      date: new Date().toISOString().split('T')[0],
      size: `${(file.size / 1024).toFixed(1)} KB`
    };
    if (!suppliers[index].documents) suppliers[index].documents = [];
    suppliers[index].documents.push(newDoc);
    writeDb(suppliers);
    
    // Trigger backup explicitly here too (although writeDb does it, the file content itself needs to be copied)
    // writeDb only saves the JSON. The file is already on disk in UPLOADS_DIR.
    // So performAutoBackup will pick it up because it copies the whole UPLOADS_DIR.
    
    res.json(newDoc);
  } else {
    fs.unlinkSync(file.path);
    res.status(404).json({ error: 'Proveedor no encontrado' });
  }
});

// --- RUTAS DE BACKUP / DRIVE ---
app.get('/api/backup-config', (req, res) => {
  res.json(readConfig());
});

app.post('/api/backup-config', (req, res) => {
  const currentConfig = readConfig();
  const newConfig = { ...currentConfig, ...req.body };
  
  writeConfig(newConfig);
  res.json({ success: true, config: newConfig });
});

app.post('/api/sync-now', async (req, res) => {
  // Manual trigger (forces immediate execution)
  const config = readConfig();
  if (!config.backupPath) return res.status(400).json({ error: 'Ruta de copia no configurada' });

  const targetDir = path.resolve(config.backupPath);

  try {
    if (!fs.existsSync(targetDir)) {
      return res.status(400).json({ error: 'La ruta destino no existe en este PC.' });
    }

    const destProveedHub = path.join(targetDir, 'ProveedoresMIP_Backup');

    await fsExtra.ensureDir(destProveedHub);
    await fsExtra.copy(DB_FILE, path.join(destProveedHub, 'database.json'));
    await fsExtra.copy(UPLOADS_DIR, path.join(destProveedHub, 'uploads'));

    const timestamp = new Date().toLocaleString();
    fs.writeFileSync(path.join(destProveedHub, 'ultimo_sync.txt'), `Sincronizado el: ${timestamp}`);

    res.json({ success: true, message: 'Copia de seguridad completada correctamente.' });
  } catch (error) {
    console.error("Error en backup manual:", error);
    res.status(500).json({ error: `Error al copiar archivos: ${error.message}` });
  }
});

if (process.env.START_SERVER === 'true' || process.argv[1].endsWith('server.js')) {
    app.listen(PORT, () => {
      console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
      console.log(`Archivos se guardarán en: ${DATA_ROOT}`);
    });
}

export default app;
