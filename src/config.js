module.exports = {
    PORT: parseInt(process.env.PORT) || 3000,
    NODE_ENV: process.env.NODE_ENV || 'DEV',
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    REQUEST_TIMEOUT: process.env.REQUEST_TIMEOUT || 60 * 1000,
    POSTGRES: {
        user: process.env.POSTGRES_USER || "postgres",
        database: process.env.POSTGRES_DB || "postgres",
        password: process.env.POSTGRES_PW || "password",
        host: process.env.POSTGRES_HOST || "db",
        port: parseInt(process.env.POSTGRES_PORT) || 5432,
        max: parseInt(process.env.POSTGRES_MAX_POOL) || 10,
        idleTimeoutMillis: parseInt(process.env.POSTGRES_IDLE_TIMEOUT) || 30000
    }
}