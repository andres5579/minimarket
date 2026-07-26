// ===========================
// IMPORTAR EXPRESS
// ===========================

const express = require("express");

const router = express.Router();

// ===========================
// IMPORTAR CONTROLADOR
// ===========================

const controller = require("../controllers/detalleVentaController");

// ===========================
// RUTAS
// ===========================

router.get("/",controller.obtenerTodos);

router.get("/:id",controller.obtenerPorId);

// ===========================
// EXPORTAR
// ===========================

module.exports = router;