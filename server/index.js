require("dotenv").config();

const cors = require("cors");
const express = require("express");
const { getPool, isDatabaseConfigured } = require("./src/db");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    service: "proxy-api",
    databaseConfigured: isDatabaseConfigured(),
  });
});

app.get("/api/alumnos", async (req, res) => {
  if (!isDatabaseConfigured()) {
    return res.status(503).json({
      message:
        "La conexion a SQL Server todavia no esta configurada. Completa server/.env cuando tengas la base creada.",
      exampleQuery: "SELECT id, nombre, curso FROM Alumnos",
    });
  }

  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .query("SELECT id, nombre, curso FROM Alumnos");

    return res.json(result.recordset);
  } catch (error) {
    console.error("Error consultando SQL Server:", error);

    return res.status(500).json({
      message: "No se pudo consultar SQL Server.",
      detail: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor proxy escuchando en http://localhost:${PORT}`);
});
