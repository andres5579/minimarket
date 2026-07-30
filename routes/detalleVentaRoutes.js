// ===========================
// IMPORTAR EXPRESS
// ===========================

const express = require("express");

const router = express.Router();

// ===========================
// IMPORTAR CONTROLADOR
// ===========================

const controller = require("../controllers/detalleVentaController");

const auth = require("../middlewares/auth");
const roles = require("../middlewares/roles");


// ===========================
// RUTAS
// ===========================

// Obtener todos los detalles
router.get(
    "/",
    auth,
    roles("administrador"),
    controller.obtenerTodos
);

// Obtener un detalle por ID
router.get(
    "/:id",
    auth,
    roles("administrador"),
    controller.obtenerPorId
);

// ===========================
// EXPORTAR
// ===========================

module.exports = router;