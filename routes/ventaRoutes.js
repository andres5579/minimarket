const express = require("express");
const router = express.Router();

const ventaController = require("../controllers/ventaController");

const auth = require("../middlewares/auth");
const roles = require("../middlewares/roles");

// Historial de ventas
router.get(
    "/",
    auth,
    roles("administrador", "cajero"),
    ventaController.historial
);

// Lista de clientes
router.get(
    "/clientes",
    auth,
    roles("administrador", "cajero"),
    ventaController.clientes
);

// Lista de empleados
router.get(
    "/empleados",
    auth,
    roles("administrador", "cajero"),
    ventaController.empleados
);

// Lista de productos
router.get(
    "/productos",
    auth,
    roles("administrador", "cajero"),
    ventaController.productos
);

// Registrar venta
router.post(
    "/",
    auth,
    roles("administrador", "cajero"),
    ventaController.guardar
);

// Detalle de una venta
router.get(
    "/:id",
    auth,
    roles("administrador", "cajero"),
    ventaController.detalle
);

module.exports = router;