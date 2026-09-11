const sql = require("mssql");

const requiredEnvVars = [
  "DB_USER",
  "DB_PASSWORD",
  "DB_SERVER",
  "DB_DATABASE",
];

let poolPromise;

function isDatabaseConfigured() {
  return requiredEnvVars.every((envVar) => Boolean(process.env[envVar]));
}

function getDbConfig() {
  return {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: Number(process.env.DB_PORT || 1433),
    options: {
      encrypt: process.env.DB_ENCRYPT === "true",
      trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE !== "false",
    },
  };
}

async function getPool() {
  if (!isDatabaseConfigured()) {
    throw new Error("Faltan variables de entorno para conectar a SQL Server.");
  }

  if (!poolPromise) {
    poolPromise = sql.connect(getDbConfig());
  }

  return poolPromise;
}

module.exports = {
  sql,
  getPool,
  isDatabaseConfigured,
};
