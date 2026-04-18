import pg from 'pg';
import fs from 'fs-extra';
import path from 'path';
import crypto from 'crypto';
import cron from 'node-cron';

// PostgreSQL Connection Pool Configuration for 50 Users
class PostgreSQLManager {
    constructor() {
        this.poolConfig = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 5432,
            database: process.env.DB_NAME || 'mip_compras',
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || '12345678',
            max: 100,                      // Maximum connections in pool
            min: 20,                       // Minimum connections
            idleTimeoutMillis: 30000,       // 30 seconds
            connectionTimeoutMillis: 2000,   // 2 seconds
            statement_timeout: 10000,        // 10 seconds per query
            query_timeout: 10000,           // 10 seconds per query
            // Connection retry settings
            retryConnection: true,
            retryCount: 3,
            retryDelay: 2000
        };

        this.pool = null;
        this.connectionAttempts = 0;
        this.maxConnectionAttempts = 10;
    }

    async initialize() {
        try {
            console.log('🔧 Inicializando PostgreSQL connection pool...');

            // Create pool with retry logic
            this.pool = new pg.Pool(this.poolConfig);

            // Test connection
            const client = await this.pool.connect();
            const result = await client.query('SELECT NOW() as server_time, version() as version');
            client.release();

            console.log('✅ PostgreSQL conectado exitosamente');
            console.log(`📊 Version: ${result.rows[0].version.split(',')[0]}`);
            console.log(`🕐 Server Time: ${result.rows[0].server_time}`);
            console.log(`🔗 Pool Config: ${this.poolConfig.min}-${this.poolConfig.max} connections`);

            // Initialize database schema if needed
            await this.initializeSchema();

            // Setup monitoring
            this.setupMonitoring();

            return true;
        } catch (error) {
            console.error('❌ Error conectando a PostgreSQL:', error.message);
            this.connectionAttempts++;

            if (this.connectionAttempts < this.maxConnectionAttempts) {
                console.log(`🔄 Reintentando conexión (${this.connectionAttempts}/${this.maxConnectionAttempts})...`);
                setTimeout(() => this.initialize(), 2000);
            } else {
                console.error('🚨 No se pudo conectar a PostgreSQL después de múltiples intentos');
                throw error;
            }
        }
    }

    async initializeSchema() {
        const schema = `
        -- Users Table
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'Viewer',
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            email TEXT,
            last_seen TIMESTAMP,
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Suppliers Table  
        CREATE TABLE IF NOT EXISTS suppliers (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            tax_id TEXT,
            address TEXT,
            phone TEXT,
            email TEXT,
            category TEXT,
            subcategory TEXT,
            contact_name TEXT,
            bank_name TEXT,
            account_type TEXT,
            account_number TEXT,
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Products Table
        CREATE TABLE IF NOT EXISTS products (
            id TEXT PRIMARY KEY,
            supplier_id TEXT REFERENCES suppliers(id),
            code TEXT NOT NULL,
            name TEXT NOT NULL,
            unit TEXT,
            unit_price DECIMAL(12,2),
            category TEXT,
            stock_quantity INTEGER DEFAULT 0,
            min_stock INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Orders Table
        CREATE TABLE IF NOT EXISTS orders (
            id TEXT PRIMARY KEY,
            sequence_number INTEGER NOT NULL,
            date DATE NOT NULL,
            supplier_id TEXT REFERENCES suppliers(id),
            supplier_name TEXT NOT NULL,
            supplier_address TEXT,
            supplier_tax_id TEXT,
            subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
            tax DECIMAL(12,2) NOT NULL DEFAULT 0,
            total DECIMAL(12,2) NOT NULL DEFAULT 0,
            payment_type TEXT,
            quote_number TEXT,
            advance_percentage DECIMAL(5,2),
            paid_amount DECIMAL(12,2) DEFAULT 0,
            debt_amount DECIMAL(12,2) DEFAULT 0,
            comments TEXT,
            status TEXT DEFAULT 'pending',
            approved_by TEXT,
            approved_at TIMESTAMP,
            change_reason TEXT,
            change_requested_by TEXT,
            items JSONB NOT NULL DEFAULT '[]',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Settings Table
        CREATE TABLE IF NOT EXISTS settings (
            id INTEGER PRIMARY KEY DEFAULT 1,
            company_name TEXT,
            company_address TEXT,
            company_tax_id TEXT,
            next_sequence_number INTEGER DEFAULT 1,
            signature_url TEXT,
            logo_url TEXT,
            currency_symbol TEXT DEFAULT '$',
            schedules JSONB DEFAULT '{"local": {"start": 7, "end": 19, "enabled": false}, "remote": {"start": 11, "end": 17, "enabled": true, "slots": [[11, 12], [16, 17]]}}',
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Activities Table (for audit trail)
        CREATE TABLE IF NOT EXISTS activities (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            action TEXT NOT NULL,
            entity_type TEXT,
            entity_id TEXT,
            details JSONB DEFAULT '{}',
            user_ip TEXT,
            is_remote BOOLEAN DEFAULT false,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Create indexes for performance
        CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
        CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
        CREATE INDEX IF NOT EXISTS idx_suppliers_name ON suppliers(name);
        CREATE INDEX IF NOT EXISTS idx_suppliers_tax_id ON suppliers(tax_id);
        CREATE INDEX IF NOT EXISTS idx_products_supplier ON products(supplier_id);
        CREATE INDEX IF NOT EXISTS idx_products_code ON products(code);
        CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(date);
        CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
        CREATE INDEX IF NOT EXISTS idx_orders_supplier ON orders(supplier_id);
        CREATE INDEX IF NOT EXISTS idx_activities_user ON activities(user_id);
        CREATE INDEX IF NOT EXISTS idx_activities_timestamp ON activities(timestamp);
        
        -- Create updated_at trigger function
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = CURRENT_TIMESTAMP;
            RETURN NEW;
        END;
        $$ language 'plpgsql';

        -- Create triggers for updated_at
        CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        `;

        try {
            const client = await this.pool.connect();
            await client.query(schema);
            client.release();
            console.log('📋 Esquema PostgreSQL inicializado exitosamente');
        } catch (error) {
            console.error('❌ Error inicializando esquema:', error);
            throw error;
        }
    }

    setupMonitoring() {
        // Log pool statistics every minute
        cron.schedule('* * * * *', async () => {
            if (this.pool) {
                const totalCount = this.pool.totalCount;
                const idleCount = this.pool.idleCount;
                const waitingCount = this.pool.waitingCount;

                if (totalCount > 80) { // Alert if pool is getting full
                    console.log(`⚠️  Pool usage high: ${totalCount}/${this.poolConfig.max} connections`);
                }

                if (waitingCount > 5) {
                    console.log(`⚠️  ${waitingCount} queries waiting for connections`);
                }
            }
        });

        // Connection health check
        cron.schedule('*/5 * * * *', async () => {
            try {
                if (this.pool) {
                    const client = await this.pool.connect();
                    await client.query('SELECT 1');
                    client.release();
                }
            } catch (error) {
                console.error('❌ Connection health check failed:', error.message);
            }
        });
    }

    async query(text, params = []) {
        const start = Date.now();
        try {
            const result = await this.pool.query(text, params);
            const duration = Date.now() - start;

            // Log slow queries (more than 1 second)
            if (duration > 1000) {
                console.log(`⚠️  Slow query (${duration}ms): ${text.substring(0, 100)}...`);
            }

            return result;
        } catch (error) {
            console.error('❌ Query error:', error.message);
            throw error;
        }
    }

    async getClient() {
        return await this.pool.connect();
    }

    async close() {
        if (this.pool) {
            await this.pool.end();
            console.log('🔒 PostgreSQL connection pool closed');
        }
    }

    // Database status for monitoring
    async getStatus() {
        if (!this.pool) {
            return { status: 'disconnected', connections: 0 };
        }

        try {
            const client = await this.pool.connect();
            const result = await client.query(`
                SELECT 
                    count(*) as total_connections,
                    count(*) FILTER (WHERE state = 'active') as active_connections
                FROM pg_stat_activity 
                WHERE datname = current_database()
            `);
            client.release();

            return {
                status: 'connected',
                poolConnections: {
                    total: this.pool.totalCount,
                    idle: this.pool.idleCount,
                    waiting: this.pool.waitingCount
                },
                databaseConnections: result.rows[0]
            };
        } catch (error) {
            return { status: 'error', error: error.message };
        }
    }
}

export default PostgreSQLManager;