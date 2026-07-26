const express = require("express");

const router = express.Router();

const ventaController = require("../controllers/ventaController");

// Listas
router.get("/clientes", ventaController.clientes);

router.get("/empleados", ventaController.empleados);

router.get("/productos", ventaController.productos);

router.get("/historial", ventaController.historial);

router.get("/detalle/:id", ventaController.detalle);

// Registrar venta
router.post("/", ventaController.guardar);

module.exports = router;