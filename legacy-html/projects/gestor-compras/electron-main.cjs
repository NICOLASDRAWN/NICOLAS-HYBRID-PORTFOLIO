const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { fork } = require('child_process');

let serverProcess;
let mainWindow;
let linksWindow;
let serverReady = false;

// Polling: fetch network-status from server every 5s and push to links window
let statusPoller = null;

function startStatusPoller() {
    if (statusPoller) return;
    statusPoller = setInterval(async () => {
        if (!linksWindow || linksWindow.isDestroyed()) return;
        try {
            const http = require('http');
            const data = await new Promise((resolve, reject) => {
                http.get('http://localhost:3000/api/network-status', (res) => {
                    let body = '';
                    res.on('data', chunk => body += chunk);
                    res.on('end', () => resolve(JSON.parse(body)));
                }).on('error', reject);
            });
            if (!linksWindow.isDestroyed()) {
                linksWindow.webContents.send('status-update', data);
            }
        } catch (e) { /* server might not be ready yet */ }
    }, 5000);
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        title: "MIP Internacional - Gestor de Compras",
        icon: path.join(__dirname, 'icon.png'),
        show: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
        backgroundColor: '#0f172a' // Match the theme from start
    });

    const userDataPath = app.getPath('userData');
    console.log(`[Electron]: User Data Path: ${userDataPath}`);

    // Load a temporary loading state
    const loadingHtml = `
    <html>
        <body style="background: #0f172a; color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; margin: 0;">
            <div style="font-size: 48px; font-weight: bold; margin-bottom: 20px; background: linear-gradient(135deg, #f97316, #ef4444); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">MIP</div>
            <div style="font-size: 18px; margin-bottom: 30px; letter-spacing: 2px;">INICIANDO SISTEMA...</div>
            <div style="width: 40px; height: 40px; border: 4px solid rgba(249,115,22,0.3); border-top-color: #f97316; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
        </body>
    </html>`;
    
    mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(loadingHtml)}`);

    const serverPath = path.join(__dirname, 'backend', 'server.js');
    const http = require('http');

    const checkServer = () => {
        return new Promise((resolve) => {
            const req = http.request({ port: 3000, host: 'localhost', method: 'HEAD', path: '/api/health' }, (res) => {
                resolve(res.statusCode === 200);
            });
            req.on('error', () => resolve(false));
            req.end();
            setTimeout(() => resolve(false), 2000);
        });
    };

    checkServer().then(isRunning => {
        if (isRunning) {
            console.log(`[Electron]: Server already running. Connecting...`);
            serverReady = true;
            mainWindow.loadURL('http://localhost:3000');
            createLinksWindow();
            startStatusPoller();
            return;
        }

        serverProcess = fork(serverPath, [], {
            env: { ...process.env, ELECTRON_RUN_AS_NODE: '1', USER_DATA_PATH: userDataPath },
            silent: true
        });

        serverProcess.stdout.on('data', (data) => {
            const out = data.toString();
            console.log(`[Server]: ${out}`);
            if (out.includes('SERVIDOR MIP INTERNACIONAL LISTO') && !serverReady) {
                serverReady = true;
                mainWindow.loadURL('http://localhost:3000');
                createLinksWindow();
                startStatusPoller();
            }
        });

        serverProcess.stderr.on('data', (data) => {
            console.error(`[Server Error]: ${data}`);
        });
    });

    // Fallback: try to load after some time if detection based on stdout fails
    setTimeout(() => {
        if (!serverReady && mainWindow) {
            console.warn(`[Electron]: Server taking long to respond. Attempting force load...`);
            serverReady = true; // prevent double triggers
            mainWindow.loadURL('http://localhost:3000').catch(e => {
                console.error(`[Electron]: Force load failed: ${e.message}`);
                // If it fails, wait and try again or show error
            });
            if (!linksWindow) createLinksWindow();
            startStatusPoller();
        }
    }, 15000); // 15 seconds is more reasonable for slow HDDs

    mainWindow.once('ready-to-show', () => {
        mainWindow.maximize();
        mainWindow.show();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
        if (linksWindow) linksWindow.close();
        if (statusPoller) { clearInterval(statusPoller); statusPoller = null; }
    });
}

function createLinksWindow() {
    if (linksWindow) return;

    linksWindow = new BrowserWindow({
        width: 460,
        height: 600,
        title: "MIP CONNECT — Accesos",
        icon: path.join(__dirname, 'icon.png'),
        resizable: false,
        alwaysOnTop: true,
        autoHideMenuBar: true,
        frame: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,  // needed for ipcRenderer in inline html
        }
    });

    const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: #0f172a;
            color: white;
            padding: 28px;
            min-height: 100vh;
        }
        .header {
            display: flex;
            align-items: center;
            gap: 14px;
            margin-bottom: 24px;
            padding-bottom: 20px;
            border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .logo {
            width: 44px; height: 44px;
            background: linear-gradient(135deg, #f97316, #ef4444);
            border-radius: 14px;
            display: flex; align-items: center; justify-content: center;
            font-size: 20px; font-weight: 900; color: white; letter-spacing: -1px;
        }
        h1 { font-size: 19px; font-weight: 900; letter-spacing: -0.5px; }
        .badge {
            display: inline-flex; align-items: center; gap: 5px;
            font-size: 9px; font-weight: 800; text-transform: uppercase;
            letter-spacing: 1.5px; color: #10b981;
            margin-top: 3px;
        }
        .dot { width: 6px; height: 6px; border-radius: 50%; background: #10b981; animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        .section { margin-bottom: 16px; }
        .label {
            font-size: 9px; font-weight: 800; text-transform: uppercase;
            color: #475569; letter-spacing: 1.5px; margin-bottom: 6px;
        }
        .link-card {
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 14px;
            padding: 12px 14px;
            display: flex; align-items: center; justify-content: space-between;
            gap: 10px;
            cursor: pointer;
            transition: all 0.15s;
        }
        .link-card:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.15); }
        .link-card .url { font-family: monospace; font-size: 12px; color: #60a5fa; word-break: break-all; }
        .link-card.tunnel { background: rgba(249,115,22,0.07); border-color: rgba(249,115,22,0.25); }
        .link-card.tunnel .url { color: #fb923c; }
        .link-card .copy-btn {
            flex-shrink: 0;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 8px;
            padding: 4px 8px;
            font-size: 9px;
            font-weight: 800;
            text-transform: uppercase;
            color: #94a3b8;
            cursor: pointer;
            letter-spacing: 1px;
            transition: all 0.15s;
        }
        .link-card .copy-btn:hover { background: rgba(255,255,255,0.1); color: white; }
        .tunnel-waiting {
            padding: 12px 14px;
            border-radius: 14px;
            border: 1px dashed rgba(249,115,22,0.2);
            color: #94a3b8;
            font-size: 11px;
            display: flex; align-items: center; gap: 8px;
        }
        .spinner { width: 12px; height: 12px; border: 2px solid rgba(249,115,22,0.3); border-top-color: #f97316; border-radius: 50%; animation: spin .8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .hint {
            margin-top: 20px;
            padding: 12px 14px;
            background: rgba(59,130,246,0.06);
            border: 1px solid rgba(59,130,246,0.12);
            border-radius: 12px;
            font-size: 10px;
            color: #64748b;
            line-height: 1.5;
        }
        .hint strong { color: #93c5fd; }
        .footer { margin-top: 18px; font-size: 9px; color: #334155; text-align: center; letter-spacing: 0.5px; }
        .copied { color: #10b981 !important; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">M</div>
        <div>
            <h1>MIP CONNECT</h1>
            <div class="badge"><div class="dot"></div> Servidor Activo</div>
        </div>
    </div>

    <div class="section">
        <div class="label">⚡ Acceso Local</div>
        <div class="link-card" onclick="copyLink('http://localhost:3000', this)">
            <span class="url">http://localhost:3000</span>
            <span class="copy-btn">Copiar</span>
        </div>
    </div>

    <div class="section">
        <div class="label">🌐 Acceso en Red Local</div>
        <div id="net-links"><div class="tunnel-waiting"><div class="spinner"></div> Detectando IPs...</div></div>
    </div>

    <div class="section">
        <div class="label">☁️ Acceso Remoto (Cloudflare)</div>
        <div id="tunnel-link">
            <div class="tunnel-waiting">
                <div class="spinner"></div>
                Creando túnel seguro... (10-20 seg)
            </div>
        </div>
    </div>

    <div class="hint">
        <strong>📋 Cómo compartir:</strong> Comparte el enlace de <strong>Red Local</strong> con usuarios en la misma oficina. Usa el link de <strong>Cloudflare</strong> para acceso remoto — es gratis y cambia cada día.
    </div>

    <div class="footer">MIP Internacional Trading SAS · Puerto 3000</div>

    <script>
        const { ipcRenderer } = require('electron');

        function copyLink(url, el) {
            navigator.clipboard.writeText(url).catch(() => {
                const ta = document.createElement('textarea');
                ta.value = url; document.body.appendChild(ta); ta.select();
                document.execCommand('copy'); document.body.removeChild(ta);
            });
            const btn = el.querySelector('.copy-btn');
            if (btn) { btn.textContent = '✓ Copiado'; btn.classList.add('copied'); setTimeout(() => { btn.textContent = 'Copiar'; btn.classList.remove('copied'); }, 2000); }
        }

        ipcRenderer.on('status-update', (event, data) => {
            // Update network IPs
            const netDiv = document.getElementById('net-links');
            if (data.ips && data.ips.length > 0) {
                netDiv.innerHTML = data.ips.map(ip => {
                    const url = 'http://' + ip.address + ':' + data.port;
                    return '<div class="link-card" onclick="copyLink(\\''+url+'\\', this)"><span class="url">'+url+'</span><span class="copy-btn">Copiar</span></div>';
                }).join('');
            }

            // Update tunnel
            const tunnelDiv = document.getElementById('tunnel-link');
            if (data.tunnelUrl) {
                tunnelDiv.innerHTML = '<div class="link-card tunnel" onclick="copyLink(\\''+data.tunnelUrl+'\\', this)"><span class="url">'+data.tunnelUrl+'</span><span class="copy-btn">Copiar</span></div>';
            }
        });
    </script>
</body>
</html>`;

    linksWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);

    linksWindow.on('closed', () => {
        linksWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (serverProcess) serverProcess.kill();
    if (statusPoller) clearInterval(statusPoller);
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (mainWindow === null) createWindow();
});

process.on('exit', () => {
    if (serverProcess) serverProcess.kill();
});
