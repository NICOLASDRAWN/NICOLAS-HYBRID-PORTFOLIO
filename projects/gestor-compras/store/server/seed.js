const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const seedUsers = [
    { id: 'master-01', name: 'Administrador Maestro', role: 'Admin', username: 'SOPORTE', password: 'MIP' },
];

const seedSuppliers = [
    { id: '1', name: 'PUNTEAR SAS', email: 'comercial@puntear.com', phone: '3157824764', address: 'CR 57 128 34', taxId: '900194253', category: 'SUMINISTRO', subcategory: 'PAPELERIA', isActive: 1 },
];

const seedProducts = [
    { id: '101', supplierId: '1', code: '7312', name: 'CARGO BASICO (IMPRESIONES B&N + ESCANER)', unit: 'UNIDAD - UND', unitPrice: 160000, category: 'SERVICIOS' },
];

db.serialize(() => {
    // Clear optional (for testing)
    // db.run('DELETE FROM users');
    // db.run('DELETE FROM suppliers');

    const userStmt = db.prepare('INSERT OR IGNORE INTO users (id, name, role, username, password) VALUES (?, ?, ?, ?, ?)');
    seedUsers.forEach(u => userStmt.run(u.id, u.name, u.role, u.username, u.password));
    userStmt.finalize();

    const supStmt = db.prepare('INSERT OR IGNORE INTO suppliers (id, name, email, phone, address, taxId, category, subcategory, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
    seedSuppliers.forEach(s => supStmt.run(s.id, s.name, s.email, s.phone, s.address, s.taxId, s.category, s.subcategory, s.isActive));
    supStmt.finalize();

    const prodStmt = db.prepare('INSERT OR IGNORE INTO products (id, supplierId, code, name, unit, unitPrice, category) VALUES (?, ?, ?, ?, ?, ?, ?)');
    seedProducts.forEach(p => prodStmt.run(p.id, p.supplierId, p.code, p.name, p.unit, p.unitPrice, p.category));
    prodStmt.finalize();

    const settingsStmt = db.prepare('INSERT OR IGNORE INTO settings (id, companyName, companyAddress, companyTaxId, nextSequenceNumber, currencySymbol) VALUES (1, ?, ?, ?, ?, ?)');
    settingsStmt.run('MIP INTERNACIONAL TRADING SAS', 'CRA 20B 77 05 OF 302', '901.165.028-2', 3963, '$');
    settingsStmt.finalize();

    console.log('Database seeded successfully.');
});

db.close();
