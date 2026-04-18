import express from 'express';
import cors from 'cors';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import cron from 'node-cron';
import archiver from 'archiver';

import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import crypto from 'crypto';
import { Mutex } from 'async-mutex';
import bcrypt from 'bcryptjs';
import https from 'https';
import selfsigned from 'selfsigned';
import { networkInterfaces } from 'os';
import { spawn } from 'child_process';

const getLocalIps = () => {
    const ips = [];
    const nets = networkInterfaces();
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                ips.push({ name, address: net.address });
            }
        }
    }
    return ips;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isElectron = !!process.env.ELECTRON_RUN_AS_NODE;
const customPath = process.env.USER_DATA_PATH;

// Unified Path Strategy: Always prefer the Roaming AppData folder to keep data synced
// between the Desktop App and the Standalone Network Server.
const defaultRoaming = path.join(process.env.APPDATA || '', 'MIP Internacional - Gestor de Compras');

// Deterministic path: if on Windows and APPDATA is available, use it. Otherwise fallback.
let persistentBase = __dirname;
if (process.platform === 'win32' && process.env.APPDATA) {
    persistentBase = defaultRoaming;
}
if (customPath) persistentBase = customPath;

// Ensure consistent subfolder structure
const DATA_DIR = path.join(persistentBase, 'backend/data');
const UPLOADS_DIR = path.join(persistentBase, 'backend/uploads');
const BACKUP_DIR = path.join(persistentBase, 'backend/backups');

// Create directories to avoid errors
fs.ensureDirSync(DATA_DIR);
fs.ensureDirSync(UPLOADS_DIR);
fs.ensureDirSync(BACKUP_DIR);

console.log(`📂 [STORAGE]: Using directory: ${DATA_DIR}`);

const app = express();
const PORT = 3000; // Unified Port for MVP

// --- SECURITY & SESSION STORE ---
app.set('trust proxy', 1); // Trust localtunnel proxy

// Simple File-based Session Store to survive restarts
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');
let sessions = {};

try {
    fs.ensureDirSync(DATA_DIR);
    if (fs.existsSync(SESSIONS_FILE)) {
        sessions = fs.readJsonSync(SESSIONS_FILE);
    } else {
        fs.writeJsonSync(SESSIONS_FILE, {});
    }
} catch (e) {
    console.error("Error loading sessions:", e);
    sessions = {};
}

const saveSessions = () => {
    try {
        fs.writeJsonSync(SESSIONS_FILE, sessions, { spaces: 2 });
    } catch (e) {
        console.error("Error saving sessions:", e);
    }
};

// Periodic session cleanup (older than 7 days)
setInterval(() => {
    const now = Date.now();
    const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
    let changed = false;
    Object.entries(sessions).forEach(([id, session]) => {
        if (session.timestamp && (now - session.timestamp > SEVEN_DAYS)) {
            delete sessions[id];
            changed = true;
        }
    });
    if (changed) saveSessions();
}, 24 * 60 * 60 * 1000);

// Helper: Check if request is Remote (Outside local network)
const isRemote = (req) => {
    // Localtunnel or Proxy sets 'x-forwarded-for'
    const xForwarded = req.headers['x-forwarded-for'];
    if (xForwarded) return true;

    // Get IP
    let ip = req.ip || req.connection.remoteAddress;

    // Normalize IPv6 mapped IPv4
    if (ip.startsWith('::ffff:')) {
        ip = ip.substring(7);
    }

    // Localhost
    if (ip === '::1' || ip === '127.0.0.1' || ip === 'localhost') return false;

    // Private Network Ranges (LAN/WiFi)
    // 192.168.x.x
    if (ip.startsWith('192.168.')) return false;
    // 10.x.x.x
    if (ip.startsWith('10.')) return false;
    // 172.16.x.x - 172.31.x.x
    if (ip.startsWith('172.') && parseInt(ip.split('.')[1]) >= 16 && parseInt(ip.split('.')[1]) <= 31) return false;

    // If not local, it's remote
    return true;
};

// Helmet: Secure HTTP Headers
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}));

// Rate Limiter: General API
const apiLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutos
    max: 1000, // Aumentado a 1000 solicitudes
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Demasiadas solicitudes, por favor intente más tarde.' }
});

const loginLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minuto
    max: 50, // Aumentado a 50 intentos para evitar bloqueos accidentales
    message: { error: 'Demasiados intentos. Intente nuevamente en unos segundos.' }
});

app.use(cors({
    origin: '*', // Allow all origins explicitly
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json({ limit: '50mb' }));

// --- STATIC FILES ---
const FRONTEND_BUILD_PATH = path.join(__dirname, '../dist');
app.use(express.static(FRONTEND_BUILD_PATH));

// Health Check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});
app.use('/uploads', express.static(UPLOADS_DIR, {
    setHeaders: (res, path, stat) => {
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    }
}));

const FILE_PATHS = {
    suppliers: path.join(DATA_DIR, 'suppliers.json'),
    products: path.join(DATA_DIR, 'products.json'),
    orders: path.join(DATA_DIR, 'orders.json'),
    users: path.join(DATA_DIR, 'users.json'),
    settings: path.join(DATA_DIR, 'settings.json'),
    activities: path.join(DATA_DIR, 'activities.json'),
    inventory_items: path.join(DATA_DIR, 'inventory_items.json'),
    inventory_entries: path.join(DATA_DIR, 'inventory_entries.json'),
    warehouses: path.join(DATA_DIR, 'warehouses.json'),
    cost_centers: path.join(DATA_DIR, 'cost_centers.json')
};

// MUTEX LOCKS per file to prevent Race Conditions
const fileLocks = {};
Object.keys(FILE_PATHS).forEach(key => {
    fileLocks[key] = new Mutex();
});

// Ensure data files exist
async function ensureDataFiles(force = false) {
    await fs.ensureDir(DATA_DIR);
    await fs.ensureDir(UPLOADS_DIR);

    for (const [key, filePath] of Object.entries(FILE_PATHS)) {
        if (force || !(await fs.pathExists(filePath))) {
            const initialData = key === 'settings' ? {
                // Default Schedules
                schedules: {
                    local: { start: 7, end: 19, enabled: false }, // 7 AM - 7 PM
                    remote: { start: 11, end: 17, enabled: true, slots: [[11, 12], [16, 17]] }
                }
            } : (key === 'users' ? [
                // Default users with HASHED passwords (defaults: 123, master123)
                { id: '1', name: 'Administrador', username: 'admin', password: await bcrypt.hash('123', 10), role: 'Admin' },
                { id: 'master-user-id', name: 'Super Usuario', username: 'master', password: await bcrypt.hash('master123', 10), role: 'Admin' }
            ] : []);
            await fs.writeJson(filePath, initialData, { spaces: 2 });
        }
    }

    // MIGRATION: Auto-hash plain text passwords
    try {
        const usersFile = FILE_PATHS.users;
        if (await fs.pathExists(usersFile)) {
            const users = await fs.readJson(usersFile);
            let changed = false;
            for (const user of users) {
                // Safely handle password conversion
                const pwd = String(user.password || '');
                // If password doesn't start with $2 (bcrypt), hash it
                if (pwd && !pwd.startsWith('$2')) {
                    console.log(`🔒 Migrando contraseña para usuario: ${user.username}`);
                    user.password = await bcrypt.hash(pwd, 10);
                    changed = true;
                }
            }
            if (changed) {
                await fs.writeJson(usersFile, users, { spaces: 2 });
                console.log("✅ Migración de contraseñas completada.");
            }
        }
    } catch (e) {
        console.error("Error en migración de seguridad:", e);
    }
}



// TRANSACTIONAL HELPER: Lock -> Read -> Modify -> Write -> Unlock
const updateJson = async (fileKey, updateFn) => {
    const release = await fileLocks[fileKey].acquire();
    try {
        const filePath = FILE_PATHS[fileKey];
        const data = await fs.readJson(filePath).catch(() => []); // Direct read (already locked)

        // Pass a copy or the real object? Real object is fine here.
        const modifiedData = await updateFn(data); // Let caller modify it

        // Write logic (duplicated from writeJson to avoid recursive lock deadlock)
        const backupDir = path.join(DATA_DIR, 'backups', 'shadow');
        // Shadow Backup
        if (await fs.pathExists(filePath)) {
            await fs.ensureDir(backupDir);
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupPath = path.join(backupDir, `${fileKey}_${timestamp}.json`);
            await fs.copy(filePath, backupPath);
            // Cleanup
            const files = await fs.readdir(backupDir);
            const myBackups = files.filter(f => f.startsWith(fileKey)).sort();
            if (myBackups.length > 5) await fs.remove(path.join(backupDir, myBackups[0]));
        }

        // Atomic Write
        const tempPath = `${filePath}.tmp`;
        await fs.writeJson(tempPath, modifiedData, { spaces: 2 });
        await fs.move(tempPath, filePath, { overwrite: true });

        // Mirror Write to Local Project (Double Safety)
        try {
            const localMirror = path.join(process.cwd(), 'backend', 'data', path.basename(filePath));
            if (path.resolve(localMirror) !== path.resolve(filePath)) {
                await fs.writeJson(localMirror, modifiedData, { spaces: 2 });
            }
        } catch (e) { /* silent fail for mirror */ }

        return modifiedData;
    } catch (e) {
        console.error(`❌ Transaction Error ${fileKey}:`, e);
        throw e;
    } finally {
        release();
    }
};

// Simple overwrite (uses same lock) for Settings
const overwriteJson = async (fileKey, newData) => {
    await updateJson(fileKey, () => newData);
};

// Legacy writeJson (Deprecated but kept for direct calls if any)
const writeJson = overwriteJson;

// Lectura Robusta con recuperación automática
const readJson = async (fileKey) => {
    const filePath = FILE_PATHS[fileKey];
    try {
        if (!(await fs.pathExists(filePath))) {
            console.log(`ℹ️ Creando archivo inicial para: ${fileKey}`);
            return [];
        }

        const content = await fs.readFile(filePath, 'utf8');
        if (!content || content.trim() === '') {
            console.error(`⚠️ ALERTA: Archivo ${fileKey} vacío.`);
            return fileKey === 'settings' ? {} : [];
        }

        try {
            return JSON.parse(content);
        } catch (parseErr) {
            console.error(`❌ ERROR CRÍTICO: Archivo ${fileKey} corrupto (JSON inválido).`);
            // Intentar recuperar de un backup si existe o devolver estructura segura
            return fileKey === 'settings' ? {} : [];
        }
    } catch (e) {
        console.error(`Error inesperado leyendo ${fileKey}:`, e);
        return fileKey === 'settings' ? {} : [];
    }
};

// --- BACKUPS AUTOMÁTICOS (CRON) ---
// Backup completo del sistema cada 6 horas
cron.schedule('0 0,6,12,18 * * *', async () => {
    console.log('🕒 Ejecutando Backup Automático...');
    try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const zipName = `FULL_BACKUP_${timestamp}.zip`;
        const autoBackupDir = path.join(BACKUP_DIR, 'auto');
        const zipPath = path.join(autoBackupDir, zipName);

        await fs.ensureDir(autoBackupDir);

        const output = fs.createWriteStream(zipPath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        archive.pipe(output);
        // Zip content while excluding the 'backups' folder if it were inside (it's not anymore, but good practice)
        archive.directory(DATA_DIR, 'data');
        archive.directory(UPLOADS_DIR, 'uploads');
        await archive.finalize();

        // Cleanup: keep only 20 latest auto backups
        const files = await fs.readdir(autoBackupDir);
        const autoBackups = files.filter(f => f.startsWith('FULL_BACKUP_')).sort();
        if (autoBackups.length > 20) {
            for (let i = 0; i < autoBackups.length - 20; i++) {
                await fs.remove(path.join(autoBackupDir, autoBackups[i]));
            }
        }

        console.log(`✅ Backup Automático Completado: ${zipName}`);
    } catch (e) {
        console.error('❌ Error en Backup Automático:', e);
    }
});

// --- MIDDLEWARE: ACCESS CONTROL & AUTH ---

const checkSchedulerAccess = async (req, res, next) => {
    // Allow CORS preflight and login
    if (req.method === 'OPTIONS') return next();
    if (req.path === '/login' || req.originalUrl.includes('/api/login')) return next();

    // IMPORTANT: checkSchedulerAccess runs before authenticate in the middleware chain,
    // but we can try to peak at the token if we want to allow Admins.
    // However, it's safer to just move authenticate ABOVE checkSchedulerAccess.

    // Admins bypass scheduler
    if (req.user?.role === 'Admin') return next();

    const settings = await readJson('settings');
    const schedules = settings.schedules || {
        local: { start: 6, end: 22, enabled: false },
        remote: { start: 11, end: 17, enabled: true, slots: [[11, 12], [16, 17]] }
    };

    const now = new Date();
    const currentHour = now.getHours();

    const remote = isRemote(req);
    const policy = remote ? schedules.remote : schedules.local;

    // SCHEDULE RESTRICTION PAUSED: Access is now allowed 24/7 as requested.
    /*
    if (policy.enabled) {
        // Check slots if defined (array of [start, end_exclusive])
        // If slots exists, it overrides start/end range
        let allowed = false;

        if (policy.slots && Array.isArray(policy.slots)) {
            allowed = policy.slots.some(([start, end]) => currentHour >= start && currentHour < end);
        } else {
            allowed = currentHour >= policy.start && currentHour < policy.end;
        }

        if (!allowed) {
            console.log(`⛔ CLAVE: Acceso bloqueado (${remote ? 'Remoto' : 'Local'}) - Usuario: ${req.user?.username || 'Anon'} - Hora: ${currentHour}:00 - Path: ${req.path}`);
            return res.status(403).json({
                error: `Acceso restringido en este horario. (${remote ? 'Remoto' : 'Local'})`,
                code: 'SCHEDULE_RESTRICTION'
            });
        }
    }
    */

    next();
};

const authenticate = async (req, res, next) => {
    // Allows CORS and Login/Logout
    if (req.method === 'OPTIONS') return next();
    if (req.path === '/login' || req.path === '/logout' || req.originalUrl.includes('/api/login')) return next();

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        console.log(`🔐 AUTH FAIL: No authorization header - Path: ${req.path}`);
        return res.status(401).json({ error: 'No autorizado: Falta token' });
    }

    const token = authHeader.split(' ')[1];

    // Intentar recuperar sesión de memoria
    let user = sessions[token];

    // Si no está en memoria, intentar recargar desde disco por si se reinició el servidor
    if (!user) {
        try {
            if (fs.existsSync(SESSIONS_FILE)) {
                const loadedSessions = await fs.readJson(SESSIONS_FILE);
                if (loadedSessions[token]) {
                    sessions = loadedSessions; // Sincronizar memoria
                    user = loadedSessions[token];
                    console.log(`♻️ Sesión recuperada del disco para token: ${token.substring(0, 8)}...`);
                }
            }
        } catch (e) {
            console.error("Error leyendo sesiones:", e);
        }
    }

    if (!user) {
        console.log(`🔐 AUTH FAIL: Invalid token - Path: ${req.path} - Token: ${token?.substring(0, 8)}...`);
        return res.status(401).json({ error: 'Sesión expirada' });
    }

    // REFRESH: Always get fresh user info from the source of truth (users.json)
    try {
        const users = await readJson('users');
        const freshUser = users.find(u => String(u.id) === String(user.id));
        if (freshUser) {
            const { password, ...safeUser } = freshUser;
            // Update in-memory session to reflect changes in role/permissions immediately
            sessions[token] = { ...user, ...safeUser };
            user = sessions[token];
        } else {
            console.log(`⚠️ User not found in users.json during refresh: ${user.id}`);
        }
    } catch (e) {
        console.error("Error refreshing session user data:", e);
    }

    req.user = user;
    next();
};

const authorize = (allowedRoles = []) => {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ error: 'No autenticado' });

        // Admin always has access
        if (req.user.role === 'Admin') return next();

        // 1. Check Roles
        const hasRole = allowedRoles.length === 0 || allowedRoles.includes(req.user.role);
        if (hasRole) return next();

        // 2. Check Granular Permissions (Fallback)
        // Extract resource from path: /api/products -> products
        try {
            const parts = req.path.split('/').filter(Boolean); // Remove empty strings
            // Expected format: ['api', 'products', '123']
            if (parts.length >= 2 && parts[0] === 'api') {
                const resource = parts[1]; // 'products', 'suppliers', etc.

                let permission = '';
                if (req.method === 'POST') permission = `${resource}_create`;
                if (req.method === 'PUT') permission = `${resource}_edit`;
                if (req.method === 'DELETE') permission = `${resource}_delete`;
                if (req.method === 'GET') permission = `${resource}_view`;

                if (permission && req.user.permissions && req.user.permissions[permission]) {
                    console.log(`✅ AUTH: Permission granted via ${permission} for ${req.user.username}`);
                    return next();
                }
            }
        } catch (e) {
            console.error("Error checking permissions:", e);
        }

        console.log(`⛔ AUTH DENIED: User ${req.user.username} (Role: ${req.user.role}) attempted ${req.path}`);
        return res.status(403).json({ error: 'No tiene permisos para realizar esta acción' });
    };
};

// --- PUBLIC API ENDPOINTS (No Auth Required) ---

app.get('/api/network-status', (req, res) => {
    const ips = getLocalIps();
    const primaryIp = ips.length > 0 ? ips[0].address : 'localhost';
    res.json({
        ips: ips,
        primaryIp: primaryIp,
        publicIp: global.publicIp || 'Cargando...',
        tunnelUrl: global.tunnelUrl || null,
        port: PORT,
        url: `http://${primaryIp}:${PORT}`,
        localUrl: `http://localhost:${PORT}`
    });
});

// API para documentación del sistema
app.get('/api/docs', async (req, res) => {
    try {
        const possiblePaths = [
            path.join(__dirname, '..'),
            process.cwd(),
            path.join(process.resourcesPath || '', 'app'),
            path.dirname(process.execPath)
        ];

        let rootDir = possiblePaths[0];
        console.log(`🔍 [DOCS] Buscando en: ${possiblePaths.filter(Boolean).join(' | ')}`);

        for (const p of possiblePaths) {
            if (p && await fs.pathExists(p)) {
                const files = await fs.readdir(p);
                if (files.some(f => f.endsWith('.md'))) {
                    rootDir = p;
                    console.log(`✅ [DOCS] Carpeta encontrada: ${rootDir}`);
                    break;
                }
            }
        }

        const files = await fs.readdir(rootDir);
        const docs = files.filter(f => f.endsWith('.md'))
            .map(f => ({ name: f, title: f.replace('.md', '').split('_').join(' ') }));
        res.json(docs);
    } catch (e) {
        console.error("❌ [DOCS] Error listando:", e);
        res.status(500).json({ error: 'Error leyendo docs' });
    }
});

app.get('/api/docs/:name', async (req, res) => {
    try {
        const name = req.params.name;
        if (!name.endsWith('.md')) return res.status(400).send('Solo .md');

        const possiblePaths = [
            path.join(__dirname, '..'),
            process.cwd(),
            path.join(process.resourcesPath || '', 'app'),
            path.dirname(process.execPath)
        ];

        let fullPath = null;
        for (const p of possiblePaths) {
            if (!p) continue;
            const testPath = path.join(p, name);
            if (await fs.pathExists(testPath)) {
                fullPath = testPath;
                break;
            }
        }

        if (!fullPath) return res.status(404).send('Doc no encontrado');

        const content = await fs.readFile(fullPath, 'utf8');
        res.send(content);
    } catch (e) {
        res.status(500).send('Error leyendo doc');
    }
});

// Endpoint para subir manuales/documentación (.md) - Solo ADMIN
app.post('/api/docs/upload', authorize(['Admin']), async (req, res) => {
    console.log("📂 [DOCS] Subiendo nuevo manual...");
    upload.single('file')(req, res, async (err) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!req.file) return res.status(400).json({ error: 'No se recibió archivo' });

        if (!req.file.originalname.endsWith('.md')) {
            await fs.remove(req.file.path);
            return res.status(400).json({ error: 'Solo se permiten archivos .md' });
        }

        try {
            // Find the best place to save the doc (where we usually find them)
            const possiblePaths = [
                path.join(__dirname, '..'),
                process.cwd(),
                path.join(process.resourcesPath || '', 'app'),
                path.dirname(process.execPath)
            ];

            let destDir = possiblePaths[0];
            for (const p of possiblePaths) {
                if (p && await fs.pathExists(p)) {
                    const files = await fs.readdir(p);
                    if (files.some(f => f.endsWith('.md'))) {
                        destDir = p;
                        break;
                    }
                }
            }

            const destPath = path.join(destDir, req.file.originalname);
            await fs.move(req.file.path, destPath, { overwrite: true });
            console.log(`✅ [DOCS] Manual guardado en: ${destPath}`);
            res.json({ success: true, name: req.file.originalname });
        } catch (e) {
            console.error("❌ [DOCS] Error al mover:", e);
            res.status(500).json({ error: 'Error al procesar el manual' });
        }
    });
});

// Public Routes (Already handled above or moved here)
app.post('/api/login', loginLimiter, async (req, res) => {
    const { username, password } = req.body;
    const users = await readJson('users');

    // Find user by username first - CASE INSENSITIVE
    const user = users.find(u => u.username?.toLowerCase() === username?.toLowerCase());

    if (user) {
        // Verify Password Hash
        const match = await bcrypt.compare(password, user.password || '');

        if (match) {
            const token = crypto.randomUUID();
            const { password, ...userWithoutPassword } = user;

            // Store Session Persistent
            sessions[token] = userWithoutPassword;
            saveSessions();

            console.log(`✅ [LOGIN] Exitoso: ${user.username} (${user.role})`);
            // Return Token
            res.json({ ...userWithoutPassword, token });
            return;
        } else {
            console.log(`❌ [LOGIN] Contraseña incorrecta para: ${username}`);
        }
    } else {
        console.log(`❓ [LOGIN] Usuario no encontrado: ${username}`);
    }

    res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
});

app.post('/api/logout', (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        delete sessions[token];
        saveSessions();
    }
    res.status(204).send();
});

// --- PROTECTED API ENDPOINTS ---

// 1. Authenticate everything below this point
app.use('/api', authenticate);

// 2. Apply Rate Limit & Access Schedule to all protected /api
app.use('/api', apiLimiter, checkSchedulerAccess);

// Heartbeat
app.post('/api/users/heartbeat', async (req, res) => {
    const { userId } = req.body;
    if (!userId) return res.status(400).send();

    // Update user last seen
    const users = await readJson('users');
    const index = users.findIndex(u => u.id === userId);
    if (index > -1) {
        users[index].lastSeen = new Date().toISOString();
        await writeJson('users', users);
    }
    res.status(204).send();
});

// Activities
app.get('/api/activities', async (req, res) => {
    const activities = await readJson('activities');
    res.json(activities.slice(-50).reverse());
});

app.post('/api/activities', async (req, res) => {
    const activities = await readJson('activities');
    const ip = req.ip || req.connection.remoteAddress;
    const newActivity = {
        id: Date.now().toString(),
        ...req.body,
        userIp: ip,
        timestamp: new Date().toISOString(),
        isRemote: isRemote(req)
    };
    activities.push(newActivity);
    await writeJson('activities', activities);
    res.status(201).json(newActivity);
});

// Generic CRUD
// Generic CRUD with Role Protection
const setupCRUD = (entityName, readRoles = [], writeRoles = []) => {
    // GET: Read
    app.get(`/api/${entityName}`, authorize(readRoles), async (req, res) => {
        let data = await readJson(entityName);
        if (entityName === 'users' && Array.isArray(data)) {
            data = data.map(({ password, ...user }) => user);
        }
        res.json(data);
    });

    // POST: Create
    app.post(`/api/${entityName}`, authorize(writeRoles), async (req, res) => {
        try {
            console.log(`📝 POST /api/${entityName} - User: ${req.user?.username || 'unknown'}`);
            const newItem = req.body;

            // HASH PASSWORD if User
            if (entityName === 'users' && newItem.password) {
                newItem.password = await bcrypt.hash(newItem.password, 10);
            }

            await updateJson(entityName, (data) => {
                if (entityName === 'settings') return newItem;

                // Auto-assign ID
                if (!newItem.id) newItem.id = crypto.randomUUID();

                // KEEP EXACT DECIMALS FOR ORDERS
                if (entityName === 'orders') {
                    if (newItem.total) newItem.total = Number(newItem.total);
                    if (newItem.subtotal) newItem.subtotal = Number(newItem.subtotal);
                    if (newItem.tax) newItem.tax = Number(newItem.tax);
                    if (newItem.paidAmount !== undefined) newItem.paidAmount = Number(newItem.paidAmount || 0);
                    if (newItem.debtAmount !== undefined) newItem.debtAmount = Number(newItem.debtAmount || 0);

                    if (Array.isArray(newItem.items)) {
                        newItem.items = newItem.items.map(item => ({
                            ...item,
                            unitPrice: Number(item.unitPrice || 0),
                            total: Number(item.total || 0)
                        }));
                    }
                    
                    // PREVENT DUPLICATE SEQUENCE NUMBERS
                    if (newItem.sequenceNumber) {
                        const existingSeq = data.find(o => o.sequenceNumber === newItem.sequenceNumber && String(o.id) !== String(newItem.id));
                        if (existingSeq) {
                            console.warn(`⚠️ [WARNING] Sequence ${newItem.sequenceNumber} is already taken! Re-assigning...`);
                            // Re-assign sequence by finding the global max + 1
                            const allSeqs = data.map(o => o.sequenceNumber).filter(Boolean);
                            const maxSeq = allSeqs.length > 0 ? Math.max(...allSeqs) : 0;
                            newItem.sequenceNumber = maxSeq + 1;
                            
                            // Let's also try to update settings if possible (fire and forget ok, or we handle it independently)
                            try {
                                const fs = require('fs-extra');
                                const setPath = FILE_PATHS['settings'];
                                const setStr = fs.readFileSync(setPath, 'utf8');
                                const setJson = JSON.parse(setStr);
                                if (setJson.nextSequenceNumber <= newItem.sequenceNumber) {
                                    setJson.nextSequenceNumber = newItem.sequenceNumber + 1;
                                    fs.writeFileSync(setPath, JSON.stringify(setJson, null, 2));
                                }
                            } catch (err) {}
                        }
                    }
                }

                const index = data.findIndex(item => item.id === newItem.id);
                if (index > -1) data[index] = newItem;
                else data.push(newItem);
                return data;
            });

            res.status(201).json(newItem);
        } catch (error) {
            console.error(`❌ Error creando ${entityName}:`, error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    });

    // PUT: Update
    app.put(`/api/${entityName}/:id`, authorize(writeRoles), async (req, res) => {
        const { id } = req.params;
        let updatedItem = null;

        try {
            // HASH PASSWORD if User and it was changed
            if (entityName === 'users' && req.body.password) {
                // Determine if password is new or same (basic heuristic or just hash it)
                // For safety, if a password field is sent, we assume it's a new password to be hashed.
                // We shouldn't send the existing hash back from frontend ever.
                if (!req.body.password.startsWith('$2')) {
                    req.body.password = await bcrypt.hash(req.body.password, 10);
                }
            }

            await updateJson(entityName, (data) => {
                const index = data.findIndex(item => String(item.id) === String(id));
                if (index > -1) {
                    console.log(`✅ [UPDATE] ${entityName} ID: ${id} - User: ${req.user?.username}`);
                    data[index] = { ...data[index], ...req.body };
                    const order = data[index];
                    // ENFORCE ROUNDING FOR ORDERS
                    if (entityName === 'orders') {
                        if (order.total) order.total = Math.round(order.total);
                        if (order.subtotal) order.subtotal = Math.round(order.subtotal);
                        if (order.tax) order.tax = Math.round(order.tax);
                        if (order.paidAmount) order.paidAmount = Math.round(order.paidAmount || 0);
                        if (order.debtAmount) order.debtAmount = Math.round(order.debtAmount || 0);

                        if (Array.isArray(order.items)) {
                            order.items = order.items.map(item => ({
                                ...item,
                                unitPrice: Math.round(item.unitPrice || 0),
                                total: Math.round(item.total || 0)
                            }));
                        }

                        // PREVENT DUPLICATE SEQUENCE NUMBERS
                        if (order.sequenceNumber) {
                            const existingSeq = data.find(o => o.sequenceNumber === order.sequenceNumber && String(o.id) !== String(order.id));
                            if (existingSeq) {
                                console.warn(`⚠️ [WARNING] Sequence ${order.sequenceNumber} is already taken on UPDATE! Re-assigning...`);
                                // Re-assign sequence by finding the global max + 1
                                const allSeqs = data.map(o => o.sequenceNumber).filter(Boolean);
                                const maxSeq = allSeqs.length > 0 ? Math.max(...allSeqs) : 0;
                                order.sequenceNumber = maxSeq + 1;
                                
                                try {
                                    const fs = require('fs-extra');
                                    const setPath = FILE_PATHS['settings'];
                                    const setStr = fs.readFileSync(setPath, 'utf8');
                                    const setJson = JSON.parse(setStr);
                                    if (setJson.nextSequenceNumber <= order.sequenceNumber) {
                                        setJson.nextSequenceNumber = order.sequenceNumber + 1;
                                        fs.writeFileSync(setPath, JSON.stringify(setJson, null, 2));
                                    }
                                } catch (err) {}
                            }
                        }

                        // Specialized: Core Approval Logic (Finalize if all approvals are met)
                        if (order.status === 'Pending' || order.status === 'InProcess') {
                            let isFullyApproved = false;

                            if (Array.isArray(order.approvals) && order.approvals.length > 0) {
                                // Dynamic system: check all assigned approvers
                                isFullyApproved = order.approvals.every(a => a.approved);
                            } else {
                                // Fallback/Legacy: check budget and purchasing flags
                                isFullyApproved = order.budgetApproved && order.purchasingApproved;
                            }

                            if (isFullyApproved) {
                                console.log(`✅ [AUTO-APPROVE] Finishing order #${order.sequenceNumber || id}`);
                                order.status = 'Approved';

                                // Final consolidate of names if not already done
                                if (!order.approvedBy) {
                                    if (Array.isArray(order.approvals) && order.approvals.length > 0) {
                                        order.approvedBy = order.approvals.map(a => a.userName).join(' & ');
                                    } else {
                                        order.approvedBy = `${order.approvedByBudget || 'Presupuesto'} & ${order.approvedByPurchasing || 'Compras'}`;
                                    }
                                    order.approvedAt = new Date().toISOString();
                                }
                            }
                        }
                    }

                    updatedItem = data[index];
                }
                return data;
            });

            if (updatedItem) {
                // SYNC SESSIONS if user role changed
                if (entityName === 'users') {
                    const { password, ...safeUser } = updatedItem;
                    Object.keys(sessions).forEach(token => {
                        if (sessions[token].id === id) {
                            sessions[token] = { ...sessions[token], ...safeUser };
                        }
                    });
                    saveSessions();
                }
                res.json(updatedItem);
            } else {
                res.status(404).json({ error: 'No encontrado' });
            }
        } catch (e) {
            res.status(500).json({ error: 'Error al actualizar' });
        }
    });

    // DELETE: Delete
    app.delete(`/api/${entityName}/:id`, authorize(writeRoles), async (req, res) => {
        const { id } = req.params;
        const data = await readJson(entityName);
        const filtered = data.filter(item => item.id !== id);
        await writeJson(entityName, filtered);

        // KILL SESSIONS if user deleted
        if (entityName === 'users') {
            let killed = 0;
            Object.keys(sessions).forEach(token => {
                if (sessions[token].id === id) {
                    delete sessions[token];
                    killed++;
                }
            });
            if (killed > 0) {
                saveSessions();
                console.log(`🚫 [SESSION] Cerradas ${killed} sesiones del usuario eliminado: ${id}`);
            }
        }

        console.log(`🗑️ [CRUD] ${entityName.toUpperCase()} ELIMINADO: ${id}`);
        res.status(204).send();
    });
};

// Specialized Order Deletion with Sequence Reclamation
app.delete('/api/orders/:id', authorize(['Admin', 'Buyer', 'Approver']), async (req, res) => {
    try {
        const { id } = req.params;
        const orders = await readJson('orders');
        const orderIndex = orders.findIndex(o => o.id === id);

        if (orderIndex === -1) {
            return res.status(404).json({ error: 'Orden no encontrada' });
        }

        const orderToDelete = orders[orderIndex];

        // Security check: Only Admin or Owner can delete
        // Also allow Approvers if Admin
        const isAdmin = req.user.role === 'Admin';
        const isOwner = orderToDelete.requestedById === req.user.id;

        if (!isAdmin && !isOwner) {
            return res.status(403).json({ error: 'No tiene permisos para eliminar esta orden' });
        }

        // Release sequence logic ONLY if it's not a duplicate
        const isDuplicateHandler = orders.some(o => o.id !== id && o.sequenceNumber === orderToDelete.sequenceNumber);

        if (!isDuplicateHandler && orderToDelete.sequenceNumber) {
            await updateJson('settings', (settings) => {
                const seqNum = orderToDelete.sequenceNumber;

                if (seqNum === (settings.nextSequenceNumber - 1)) {
                    // It was the last one, just decrement
                    settings.nextSequenceNumber -= 1;
                } else {
                    // It's a gap, add to released list
                    if (!settings.releasedSequences) settings.releasedSequences = [];
                    if (!settings.releasedSequences.includes(seqNum)) {
                        settings.releasedSequences.push(seqNum);
                        settings.releasedSequences.sort((a, b) => a - b);
                    }
                }
                return settings;
            });
        }

        // Remove from orders
        orders.splice(orderIndex, 1);
        await writeJson('orders', orders);

        // Clean up associated inventory entries
        try {
            const inventoryEntries = await readJson('inventory_entries');
            const remainingEntries = inventoryEntries.filter(e => e.orderId !== id);
            if (inventoryEntries.length !== remainingEntries.length) {
                await writeJson('inventory_entries', remainingEntries);
                console.log(`🧹 [INV] Limpieza: ${inventoryEntries.length - remainingEntries.length} entradas de inventario eliminadas para la orden ${id}`);
            }
        } catch (invErr) {
            console.warn("⚠️ Advertencia: Error limpiando entradas de inventario:", invErr);
        }

        console.log(`🗑️ [ORDER] ELIMINADO: ${id} (#${seqNum}) - Consecutivo liberado`);
        res.status(204).send();
    } catch (e) {
        console.error("❌ Error al eliminar orden:", e);
        res.status(500).json({ error: 'Error al eliminar la orden' });
    }
});

// Define Permissions per Entity
// Roles: 'Viewer', 'Admin', 'Approver', 'Buyer'

// SPECIAL ROUTE: Allow Users to Update Themselves (Bypassing Admin-only restriction on 'users' CRUD)
app.put('/api/users/:id', authenticate, async (req, res, next) => {
    const { id } = req.params;

    // If Admin, let the standard CRUD handle it (next route)
    if (req.user.role === 'Admin') return next();

    // If not Admin, ensure they are updating THEMSELVES
    if (req.user.id !== id) {
        return res.status(403).json({ error: 'Solo puedes editar tu propio perfil' });
    }

    try {
        const users = await readJson('users');
        const index = users.findIndex(u => u.id === id);

        if (index > -1) {
            // Security: Prevent Role Self-Escalation
            if (req.body.role && req.body.role !== req.user.role) {
                return res.status(403).json({ error: 'No puedes cambiar tu propio rol' });
            }

            // HASH PASSWORD if changed
            if (req.body.password) {
                req.body.password = await bcrypt.hash(req.body.password, 10);
            }

            // Perform Update
            users[index] = { ...users[index], ...req.body };
            await writeJson('users', users);

            // Sync Session
            const { password, ...safeUser } = users[index];
            Object.keys(sessions).forEach(token => {
                if (sessions[token].id === id) {
                    sessions[token] = { ...sessions[token], ...safeUser };
                }
            });
            saveSessions();

            console.log(`✅ [SELF-UPDATE] Usuario actualizado: ${safeUser.username}`);
            res.json(users[index]);
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (err) {
        console.error("Error en self-update:", err);
        res.status(500).json({ error: 'Error al actualizar perfil' });
    }
});
setupCRUD('suppliers', [], ['Admin', 'Buyer']);
setupCRUD('products', [], ['Admin', 'Buyer']);
setupCRUD('orders', [], ['Admin', 'Buyer', 'Approver']);
setupCRUD('users', [], ['Admin']); // Allow all to read (sanitized), Admin to write
setupCRUD('inventory_items', [], ['Admin', 'Buyer', 'Approver']);
setupCRUD('inventory_entries', [], ['Admin', 'Buyer', 'Approver']);
setupCRUD('warehouses', [], ['Admin', 'Buyer', 'Approver']);
setupCRUD('cost_centers', [], ['Admin', 'Buyer']);

// Settings
app.get('/api/settings', async (req, res) => {
    const settings = await readJson('settings');
    // Ensure schedule structure exists
    if (!settings.schedules) {
        settings.schedules = {
            local: { start: 6, end: 22, enabled: false },
            remote: { start: 11, end: 17, enabled: true, slots: [[11, 12], [16, 17]] }
        };
    }
    res.json(settings);
});

app.post('/api/settings', authorize(['Admin']), async (req, res) => {
    await writeJson('settings', req.body);
    res.json(req.body);
});

// Bulk Import
app.post('/api/bulk/:entity', authorize(['Admin', 'Buyer', 'Approver']), async (req, res) => {
    const { entity } = req.params;
    if (!FILE_PATHS[entity]) return res.status(404).json({ error: 'Entidad invalida' });

    const existing = await readJson(entity);
    const toImport = req.body;
    const merged = [...existing];
    let updatedCount = 0;
    let createdCount = 0;

    toImport.forEach(item => {
        let index = -1;
        if (entity === 'suppliers') {
            index = merged.findIndex(e => e.taxId === item.taxId);
        } else if (entity === 'products') {
            index = merged.findIndex(e => e.code === item.code && e.supplierId === item.supplierId);
        } else {
            index = merged.findIndex(e => e.id === item.id);
        }

        if (index > -1) {
            merged[index] = { ...merged[index], ...item };
            updatedCount++;
        } else {
            merged.push(item);
            createdCount++;
        }
    });

    await writeJson(entity, merged);
    res.json({ count: toImport.length, updated: updatedCount, created: createdCount });
});

// Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => {
        // Sanitize filename: remove spaces and special chars
        const sanitized = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        cb(null, `${Date.now()}-${sanitized}`);
    }
});
const upload = multer({ storage });

// Sequence Reservation is handled by a queued endpoint below for better race protection

// Ruta específica para upload con LOGS DETALLADOS y validación PDF
app.post('/api/upload/:type', authorize(['Admin', 'Buyer', 'Approver', 'Viewer']), async (req, res) => {
    try {
        const uploadType = req.params.type;
        console.log(`📂 Iniciando subida de archivo... Tipo: ${uploadType}`);

        // Asegurar que la carpeta existe antes de procesar
        await fs.ensureDir(UPLOADS_DIR);

        upload.single('file')(req, res, (err) => {
            if (err) {
                console.error("❌ Error MULTER:", err);
                return res.status(500).json({ error: `Error interno de carga: ${err.message}` });
            }

            if (!req.file) {
                console.error("❌ Error: No llegó ningún archivo en el request");
                return res.status(400).json({ error: 'No se recibió ningún archivo. Verifique el tamaño.' });
            }

            // Validación específica para documentos PDF e Imágenes
            if (uploadType === 'documents') {
                // Allow PDF, Images, Excel, Word, Text, Markdown
                const validExtensions = ['.pdf', '.png', '.jpg', '.jpeg', '.xls', '.xlsx', '.doc', '.docx', '.txt', '.csv', '.md'];
                const ext = path.extname(req.file.originalname).toLowerCase();

                if (!validExtensions.includes(ext)) {
                    fs.removeSync(path.join(UPLOADS_DIR, req.file.filename));
                    return res.status(400).json({ error: 'Tipo de archivo no permitido. Solo PDF, Imágenes, Excel, Word y Markdown.' });
                }
            } else if (uploadType === 'logo' || uploadType === 'signature' || uploadType === 'signatures') {
                const isImage = req.file.mimetype.startsWith('image/') ||
                    /\.(png|jpg|jpeg|gif)$/i.test(req.file.originalname);
                if (!isImage) {
                    fs.removeSync(path.join(UPLOADS_DIR, req.file.filename));
                    return res.status(400).json({ error: 'Solo se permiten archivos de imagen (.png, .jpg, etc)' });
                }
            }

            // Validar tamaño global (50MB)
            const maxSize = 50 * 1024 * 1024;
            if (req.file.size > maxSize) {
                fs.removeSync(path.join(UPLOADS_DIR, req.file.filename));
                return res.status(400).json({ error: 'Archivo demasiado grande (Máximo 50MB)' });
            }

            const fileUrl = `/uploads/${req.file.filename}`;
            console.log(`✅ Archivo guardado exitosamente: ${fileUrl} (${req.file.size} bytes)`);
            res.json({ url: fileUrl });
        });
    } catch (e) {
        console.error("❌ Error CRÍTICO en upload:", e);
        res.status(500).json({ error: e.message });
    }
});

// Ruta fallback con LOGS
app.post('/api/upload', authorize(['Admin', 'Buyer', 'Approver']), async (req, res) => {
    console.log(`📂 Iniciando subida (Ruta Legacy)...`);
    await fs.ensureDir(UPLOADS_DIR);

    upload.single('file')(req, res, (err) => {
        if (err) {
            console.error("❌ Error MULTER Legacy:", err);
            return res.status(500).json({ error: err.message });
        }
        if (!req.file) return res.status(400).json({ error: 'No files uploaded' });

        const fileUrl = `/uploads/${req.file.filename}`;
        console.log(`✅ Archivo guardado (Legacy): ${fileUrl}`);
        res.json({ url: fileUrl });
    });
});

// Reset
app.post('/api/reset', authorize(['Admin']), async (req, res) => {
    try {
        await ensureDataFiles(true);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: 'Error al reiniciar la base de datos' });
    }
});

// (Import moved to top)

fs.ensureDirSync(path.join(BACKUP_DIR, 'auto'));
fs.ensureDirSync(path.join(BACKUP_DIR, 'manual'));

app.post('/api/backup/create', authorize(['Admin']), async (req, res) => {
    try {
        const { type } = req.body;
        const isManual = type === 'manual';
        const subDir = isManual ? 'manual' : 'auto';
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `backup-${type}-${timestamp}.zip`;
        const filePath = path.join(BACKUP_DIR, subDir, fileName);

        const output = fs.createWriteStream(filePath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', () => {
            console.log(`📦 Respaldo creado: ${fileName} (${archive.pointer()} bytes)`);
            res.json({ message: 'Respaldo creado con éxito', fileName, path: filePath });
        });

        archive.on('error', (err) => { throw err; });

        archive.pipe(output);
        archive.directory(DATA_DIR, 'data');
        archive.directory(UPLOADS_DIR, 'uploads');
        await archive.finalize();

        if (!isManual) {
            const files = await fs.readdir(path.join(BACKUP_DIR, 'auto'));
            if (files.length > 20) {
                files.sort();
                const toDelete = files.slice(0, files.length - 20);
                for (const file of toDelete) {
                    await fs.remove(path.join(BACKUP_DIR, 'auto', file));
                }
            }
        }
    } catch (err) {
        console.error('Error al crear respaldo:', err);
        res.status(500).json({ error: 'Error al generar respaldo' });
    }
});

app.get('/api/backup/download/:type/:filename', authorize(['Admin']), (req, res) => {
    const { type, filename } = req.params;
    const subDir = type === 'manual' ? 'manual' : 'auto';
    const filePath = path.join(BACKUP_DIR, subDir, filename);
    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).json({ error: 'Archivo no encontrado' });
    }
});

app.post('/api/backup/import', authorize(['Admin']), async (req, res) => {
    try {
        const { data } = req.body;
        if (!data) return res.status(400).json({ error: 'No data provided' });

        for (const [key, value] of Object.entries(data)) {
            if (FILE_PATHS[key]) {
                await writeJson(key, value);
            }
        }
        res.status(200).json({ message: 'Base de datos restaurada correctamente' });
    } catch (err) {
        res.status(500).json({ error: 'Error al restaurar respaldo' });
    }
});

// Start


/* --- EMAIL NOTIFICATION SYSTEM --- */
let nodemailer;
import('nodemailer').then(m => nodemailer = m.default).catch(() => {
    console.log("ℹ️ Módulo 'nodemailer' no detectado. Las notificaciones por correo estarán desactivadas hasta que se instalen las dependencias.");
});

const sendEmail = async (config, to, subject, html) => {
    if (!nodemailer) throw new Error("Servidor de correo no instalado. Contacte a soporte.");
    if (!config || !config.enabled) throw new Error("Las notificaciones están desactivadas.");

    // Basic transporter configuration
    const transportConfig = {
        auth: {
            user: config.user,
            pass: config.pass
        }
    };

    if (config.service === 'gmail') {
        transportConfig.service = 'gmail';
    } else if (config.service === 'outlook') {
        transportConfig.service = 'hotmail'; // Nodemailer well-known service
    } else {
        transportConfig.host = config.host;
        transportConfig.port = config.port;
        transportConfig.secure = config.port === 465;
    }

    const transporter = nodemailer.createTransport(transportConfig);

    return transporter.sendMail({
        from: `"Gestor de Compras" <${config.user}>`,
        to,
        subject,
        html
    });
};

// Sequence Reservation Endpoint with basic race-condition protection
// NOW: Per-user sequences starting from 0001
let reservationQueue = Promise.resolve();
app.post('/api/reserve-sequence', async (req, res) => {
    reservationQueue = reservationQueue.then(async () => {
        try {
            await ensureDataFiles();

            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ error: 'Usuario no autenticado' });
            }

            let reservedSeq;
            await updateJson('settings', (settings) => {
                // Check if there are released sequences (gaps)
                if (settings.releasedSequences && settings.releasedSequences.length > 0) {
                    // Take the smallest released sequence
                    reservedSeq = settings.releasedSequences.shift();
                    console.log(`♻️ [SEQ] Reutilizando Consecutivo: ${reservedSeq}`);
                } else {
                    // Get current global sequence
                    reservedSeq = settings.nextSequenceNumber || 1;
                    // Increment for next time
                    settings.nextSequenceNumber = reservedSeq + 1;
                }

                // Clean up old per-user logic if exists
                if (settings.userSequences) delete settings.userSequences;

                return settings;
            });

            console.log(`🎟️ [SEQ] Reservado Consecutivo Global: ${reservedSeq}`);
            res.json({ sequence: reservedSeq });
        } catch (e) {
            console.error("❌ Error reservando secuencia:", e);
            res.status(500).json({ error: e.message });
        }
    }).catch(err => {
        console.error("❌ Error en cola de reserva:", err);
    });
});

app.post('/api/test-email', async (req, res) => {
    const config = req.body;
    try {
        if (!config.user || !config.pass) throw new Error("Faltan credenciales");
        await sendEmail(
            { ...config, enabled: true }, // Force enable for test
            config.user,
            "Prueba de Conexión - Gestor de Compras",
            `<div style="font-family: sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #10b981;">¡Conexión Exitosa!</h2>
                <p>El sistema de notificaciones está configurado correctamente.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <small>Enviado desde el Servidor del Gestor de Compras</small>
             </div>`
        );
        res.json({ success: true, message: "Correo de prueba enviado" });
    } catch (err) {
        console.error("Email Test Error:", err.message);
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post('/api/send-email-notification', async (req, res) => {
    const { to, subject, html, config } = req.body;
    try {
        await sendEmail(config, to, subject, html);
        res.json({ success: true });
    } catch (err) {
        console.error("Notification Error:", err.message);
        // Don't crash client for email error, just warn
        res.status(200).json({ success: false, message: err.message, warning: true });
    }
});



// SPA Fallback for React Router
app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(path.join(FRONTEND_BUILD_PATH, 'index.html'));
});

ensureDataFiles().then(() => {
    app.listen(PORT, '0.0.0.0', async () => {
        const ips = getLocalIps();
        console.log(`\n🚀 SERVIDOR MIP INTERNACIONAL LISTO`);
        console.log(`===============================================`);
        console.log(`💻 ACCESO LOCAL: http://localhost:${PORT}`);

        // IP Publica en segundo plano (No bloquea el inicio)
        global.publicIp = 'Detectando...';
        fetch('https://api.ipify.org?format=json', { timeout: 4000 })
            .then(res => res.json())
            .then(data => { global.publicIp = data.ip; })
            .catch(() => { global.publicIp = 'No detectada'; });

        if (ips.length > 0) {
            console.log(`\n🌐 ACCESO EN RED:`);
            ips.forEach(ip => {
                console.log(`   ➜ [${ip.name}] http://${ip.address}:${PORT}`);
            });
        }

        // Intento de Túnel Automático (Cloudflare Quick Tunnel)
        if (global.cfTunnelProcess) {
            console.log('☁️  Túnel de Cloudflare ya está en ejecución.');
            return;
        }

        // Canal de Logs para el Túnel
        const TUNNEL_LOG = path.join(DATA_DIR, 'tunnel.log');
        const logTunnel = (msg) => {
            const timestamp = new Date().toISOString();
            const logMsg = `[${timestamp}] ${msg}\n`;
            try {
                fs.appendFileSync(TUNNEL_LOG, logMsg);
            } catch (e) { }
            console.log(msg);
        };

        // Limpiar log previo
        if (fs.existsSync(TUNNEL_LOG)) {
            try { fs.unlinkSync(TUNNEL_LOG); } catch (e) { }
        }

        const killExistingTunnels = async () => {
            try {
                if (process.platform === 'win32') {
                    const { exec } = await import('child_process');
                    return new Promise((resolve) => {
                        exec('taskkill /F /IM cloudflared.exe /T', () => resolve());
                    });
                }
            } catch (e) { }
        };

        await killExistingTunnels();
        logTunnel(`\n☁️  Iniciando Túnel de Cloudflare...`);

        try {
        // --- GESTOR DE TÚNEL AUTÓNOMO (Auto-Restart) ---
        const startTunnel = async () => {
            const possibleCfPaths = [
                'cloudflared',
                path.join(process.env.LOCALAPPDATA || '', 'Microsoft/WindowsApps/cloudflared.exe'),
                'C:/Program Files/Cloudflare/cloudflared.exe',
                path.join(process.env.USERPROFILE || '', 'bin/cloudflared.exe'),
                path.join(__dirname, 'cloudflared.exe')
            ];

            const validPaths = possibleCfPaths.filter(p => !p.includes('/') && !p.includes('\\') || fs.existsSync(p));
            if (validPaths.length === 0) {
                logTunnel('❌ Cloudflared no encontrado. Acceso remoto deshabilitado.');
                return;
            }

            const cfPath = validPaths[0]; // Usar el mas probable
            logTunnel(`🔎 Lanzando túnel con: ${cfPath}`);

            const cf = spawn(cfPath, ['tunnel', '--url', `http://127.0.0.1:${PORT}`]);
            global.cfTunnelProcess = cf;

            let stderrBuffer = '';
            const detectUrl = (data) => {
                stderrBuffer += data.toString();
                const match = stderrBuffer.match(/https:\/\/[a-z0-9.-]+\.(trycloudflare\.com|loca\.lt)/i);
                if (match && !global.tunnelUrl) {
                    global.tunnelUrl = match[0];
                    logTunnel(`\n🔗 ENLACE REMOTO ACTIVO: ${global.tunnelUrl}`);
                }
            };

            cf.stdout.on('data', detectUrl);
            cf.stderr.on('data', detectUrl);
            
            cf.on('close', (code) => {
                logTunnel(`⚠️ Túnel cerrado (Código: ${code}). Reiniciando en 10s...`);
                global.tunnelUrl = null;
                global.cfTunnelProcess = null;
                setTimeout(startTunnel, 10000);
            });

            const cleanup = () => { if(cf) cf.kill(); };
            process.on('SIGINT', cleanup);
            process.on('SIGTERM', cleanup);
        };

        await killExistingTunnels();
        startTunnel();

        } catch (err) {
            logTunnel(`❌ Excepción en el gestor de túnel: ${err.message}`);
        }

        console.log(`===============================================\n`);
    });
});
