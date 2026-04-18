const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const fs = require('fs');

const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json({ limit: '100mb' }));

// Static folder for uploads (logos, signatures)
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
app.use('/uploads', express.static(uploadDir));

// Database Setup
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error('Error opening database:', err);
    else console.log('Connected to SQLite database at', dbPath);
});

// Multer Setup for File Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${Date.now()}${ext}`);
    }
});
const upload = multer({ storage });

// Initialize Schema
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS suppliers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    taxId TEXT,
    address TEXT,
    phone TEXT,
    email TEXT,
    category TEXT,
    subcategory TEXT,
    contactName TEXT,
    bankName TEXT,
    accountType TEXT,
    accountNumber TEXT,
    isActive BOOLEAN
  )`);

    db.run(`CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    supplierId TEXT,
    code TEXT,
    name TEXT NOT NULL,
    unit TEXT,
    unitPrice REAL,
    category TEXT
  )`);

    db.run(`CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    sequenceNumber INTEGER,
    date TEXT,
    supplierId TEXT,
    supplierName TEXT,
    supplierAddress TEXT,
    supplierTaxId TEXT,
    subtotal REAL,
    tax REAL,
    total REAL,
    paymentType TEXT,
    quoteNumber TEXT,
    costCenter TEXT,
    advancePercentage REAL,
    paidAmount REAL,
    debtAmount REAL,
    comments TEXT,
    status TEXT,
    approvedBy TEXT,
    approvedAt TEXT,
    changeReason TEXT,
    changeRequestedBy TEXT,
    items JSON
  )`);

    db.run(`CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    companyName TEXT,
    companyAddress TEXT,
    companyTaxId TEXT,
    nextSequenceNumber INTEGER,
    signatureUrl TEXT,
    logoUrl TEXT,
    currencySymbol TEXT
  )`);

    db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT,
    role TEXT,
    username TEXT UNIQUE,
    password TEXT
  )`);

    // Migrations for existing tables
    db.run(`ALTER TABLE orders ADD COLUMN changeReason TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column name')) console.log('Notice: changeReason column might already exist');
    });
    db.run(`ALTER TABLE orders ADD COLUMN changeRequestedBy TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column name')) console.log('Notice: changeRequestedBy column might already exist');
    });
});

// --- Auth Routes ---
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const normalizedUsername = username.trim().toUpperCase();

    db.get('SELECT * FROM users WHERE UPPER(username) = ?', [normalizedUsername], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });

        // Try bcrypt comparison, fall back to plain text (for initial seeding/migration)
        const isMatch = bcrypt.compareSync(password, user.password) || password === user.password;

        if (isMatch) {
            const { password: _, ...userWithoutPassword } = user;
            res.json(userWithoutPassword);
        } else {
            res.status(401).json({ error: 'Contraseña incorrecta' });
        }
    });
});

app.post('/api/users', (req, res) => {
    const u = req.body;
    const hashedPassword = bcrypt.hashSync(u.password, 10);
    db.run(`INSERT INTO users (id, name, role, username, password) VALUES (?, ?, ?, ?, ?)`,
        [u.id, u.name, u.role, u.username, hashedPassword], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true });
        });
});

// --- CRUD Routes ---
const handleQuery = (res, sql, params = []) => {
    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
};

app.get('/api/suppliers', (req, res) => handleQuery(res, 'SELECT * FROM suppliers'));
app.post('/api/suppliers', (req, res) => {
    const s = req.body;
    const sql = `INSERT OR REPLACE INTO suppliers (id, name, taxId, address, phone, email, category, subcategory, contactName, bankName, accountType, accountNumber, isActive) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.run(sql, [s.id, s.name, s.taxId, s.address, s.phone, s.email, s.category, s.subcategory, s.contactName, s.bankName, s.accountType, s.accountNumber, s.isActive], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.get('/api/products', (req, res) => handleQuery(res, 'SELECT * FROM products'));
app.post('/api/products', (req, res) => {
    const p = req.body;
    const sql = `INSERT OR REPLACE INTO products (id, supplierId, code, name, unit, unitPrice, category) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.run(sql, [p.id, p.supplierId, p.code, p.name, p.unit, p.unitPrice, p.category], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// Bulk Import
app.post('/api/bulk/suppliers', (req, res) => {
    const list = req.body;
    console.log(`Recibiendo carga masiva de ${list.length} proveedores`);
    const stmt = db.prepare(`INSERT OR REPLACE INTO suppliers (id, name, taxId, address, phone, email, category, subcategory, contactName, bankName, accountType, accountNumber, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    db.serialize(() => {
        list.forEach(s => {
            stmt.run([s.id, s.name, s.taxId, s.address, s.phone, s.email, s.category, s.subcategory, s.contactName, s.bankName, s.accountType, s.accountNumber, s.isActive]);
        });
        stmt.finalize((err) => {
            if (err) {
                console.error('Error in bulk suppliers:', err);
                return res.status(500).json({ error: err.message });
            }
            console.log('Carga masiva de proveedores finalizada');
            res.json({ count: list.length });
        });
    });
});

app.post('/api/bulk/products', (req, res) => {
    const list = req.body;
    console.log(`Recibiendo carga masiva de ${list.length} productos`);
    const stmt = db.prepare(`INSERT OR REPLACE INTO products (id, supplierId, code, name, unit, unitPrice, category) VALUES (?, ?, ?, ?, ?, ?, ?)`);
    db.serialize(() => {
        list.forEach(p => {
            stmt.run([p.id, p.supplierId, p.code, p.name, p.unit, p.unitPrice || 0, p.category]);
        });
        stmt.finalize((err) => {
            if (err) {
                console.error('Error in bulk products:', err);
                return res.status(500).json({ error: err.message });
            }
            console.log('Carga masiva de productos finalizada');
            res.json({ count: list.length });
        });
    });
});

app.get('/api/orders', (req, res) => {
    db.all('SELECT * FROM orders ORDER BY sequenceNumber DESC', (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows.map(r => ({ ...r, items: JSON.parse(r.items) })));
    });
});

app.post('/api/orders', (req, res) => {
    const o = req.body;
    const sql = `INSERT INTO orders (id, sequenceNumber, date, supplierId, supplierName, supplierAddress, supplierTaxId, subtotal, tax, total, paymentType, quoteNumber, costCenter, advancePercentage, paidAmount, debtAmount, comments, status, approvedBy, approvedAt, changeReason, changeRequestedBy, items) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.run(sql, [o.id, o.sequenceNumber, o.date, o.supplierId, o.supplierName, o.supplierAddress, o.supplierTaxId, o.subtotal, o.tax, o.total, o.paymentType, o.quoteNumber, o.costCenter, o.advancePercentage, o.paidAmount, o.debtAmount, o.comments, o.status, o.approvedBy, o.approvedAt, o.changeReason || null, o.changeRequestedBy || null, JSON.stringify(o.items)], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: o.id });
    });
});

app.put('/api/orders/:id', (req, res) => {
    const { id } = req.params;
    const o = req.body;

    // Check if we are doing a full update (items is present) or a partial status update
    if (o.items) {
        const sql = `UPDATE orders SET 
            date = ?, 
            supplierId = ?, 
            supplierName = ?, 
            supplierAddress = ?, 
            supplierTaxId = ?, 
            subtotal = ?, 
            tax = ?, 
            total = ?, 
            paymentType = ?, 
            quoteNumber = ?, 
            costCenter = ?, 
            advancePercentage = ?, 
            paidAmount = ?, 
            debtAmount = ?, 
            comments = ?, 
            status = ?, 
            items = ?
            WHERE id = ?`;

        db.run(sql, [
            o.date, o.supplierId, o.supplierName, o.supplierAddress, o.supplierTaxId,
            o.subtotal, o.tax, o.total, o.paymentType, o.quoteNumber, o.costCenter,
            o.advancePercentage, o.paidAmount, o.debtAmount, o.comments, o.status,
            JSON.stringify(o.items), id
        ], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true });
        });
    } else {
        // Legacy/Partial update logic
        const { status, approvedBy, approvedAt, paidAmount, debtAmount, changeReason, changeRequestedBy } = o;
        let sql = `UPDATE orders SET status = ?, approvedBy = ?, approvedAt = ?, changeReason = ?, changeRequestedBy = ?`;
        let params = [status, approvedBy, approvedAt, changeReason, changeRequestedBy];

        if (paidAmount !== undefined) {
            sql += `, paidAmount = ?, debtAmount = ?`;
            params.push(paidAmount, debtAmount);
        }

        sql += ` WHERE id = ?`;
        params.push(id);

        db.run(sql, params, (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true });
        });
    }
});

app.get('/api/settings', (req, res) => {
    db.get('SELECT * FROM settings WHERE id = 1', (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row || {});
    });
});

app.post('/api/settings', (req, res) => {
    const s = req.body;
    db.run(`INSERT OR REPLACE INTO settings (id, companyName, companyAddress, companyTaxId, nextSequenceNumber, signatureUrl, logoUrl, currencySymbol) 
            VALUES (1, ?, ?, ?, ?, ?, ?, ?)`,
        [s.companyName, s.companyAddress, s.companyTaxId, s.nextSequenceNumber, s.signatureUrl, s.logoUrl, s.currencySymbol], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true });
        });
});

// --- Upload Routes ---
app.post('/api/upload/:type', upload.single('file'), (req, res) => {
    const { type } = req.params; // 'logo' or 'signature'
    if (!req.file) return res.status(400).json({ error: 'No se subió ningún archivo' });

    const fileUrl = `http://${req.hostname}:${PORT}/uploads/${req.file.filename}`;

    // Optionally update settings directly here
    const column = type === 'logo' ? 'logoUrl' : 'signatureUrl';
    db.run(`UPDATE settings SET ${column} = ? WHERE id = 1`, [fileUrl], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ url: fileUrl });
    });
});

app.get('/api/users', (req, res) => {
    db.all('SELECT id, name, role, username FROM users', (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
