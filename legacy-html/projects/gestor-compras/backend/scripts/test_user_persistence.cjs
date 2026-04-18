const fs = require('fs');
const path = require('path');
const http = require('http');

// Configuración
const HOST = 'localhost';
const PORT = 3000;
const ADMIN_CREDENTIALS = { username: 'admin', password: '123' };
const NEW_USER = {
    name: 'Test Buyer User',
    username: 'testbuyer_' + Date.now(),
    password: 'password123',
    role: 'Buyer',
    id: 'test-buyer-' + Date.now()
};

// Función helper para requests
function request(method, path, body = null, token = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: HOST,
            port: PORT,
            path: '/api' + path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (token) options.headers['Authorization'] = `Bearer ${token}`;

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = data ? JSON.parse(data) : {};
                    resolve({ statusCode: res.statusCode, data: parsed });
                } catch (e) {
                    resolve({ statusCode: res.statusCode, data: data });
                }
            });
        });

        req.on('error', (e) => reject(e));

        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

async function runTest() {
    console.log('--- TEST: Persistencia de Usuarios ---');

    // 1. Login Admin
    console.log('1. Autenticando Administrador...');
    const loginRes = await request('POST', '/login', ADMIN_CREDENTIALS);

    if (loginRes.statusCode !== 200) {
        console.error('❌ Falló Login Admin:', loginRes.data);
        process.exit(1);
    }
    const token = loginRes.data.token;
    console.log('✅ Admin logueado. Token recibido.');

    // 2. Crear Usuario
    console.log(`2. Creando usuario Comprador: ${NEW_USER.username}...`);
    const createRes = await request('POST', '/users', NEW_USER, token);

    if (createRes.statusCode !== 201 && createRes.statusCode !== 200) {
        console.error('❌ Falló creación de usuario:', createRes.data);
        process.exit(1);
    }
    console.log('✅ Usuario creado vía API.');

    // 3. Verificar Archivo
    console.log('3. Verificando persistencia en disco (users.json)...');
    const usersPath = path.join(__dirname, '../data/users.json');

    try {
        if (!fs.existsSync(usersPath)) {
            console.error('❌ Archivo users.json no encontrado.');
            process.exit(1);
        }

        const fileContent = fs.readFileSync(usersPath, 'utf8');
        const users = JSON.parse(fileContent);

        const foundUser = users.find(u => u.username === NEW_USER.username);

        if (foundUser) {
            console.log('✅ Usuario ENCONTRADO en users.json:');
            console.log(JSON.stringify(foundUser, null, 2));
            console.log('\n--> PRUEBA EXITOSA: El sistema está guardando usuarios correctamente.');
        } else {
            console.error('❌ Usuario NO encontrado en users.json.');
            console.log('Contenido del archivo:', users);
            process.exit(1);
        }

    } catch (e) {
        console.error('❌ Error leyendo archivo:', e);
        process.exit(1);
    }
}

runTest();
