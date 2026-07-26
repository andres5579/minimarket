const express = require("express");

const router = express.Router();

const controlador = require("../controllers/clienteController");

// Listar clientes
router.get("/", controlador.listar);

// Buscar cliente por ID
router.get("/:id", controlador.buscar);

// Registrar cliente
router.post("/", controlador.insertar);

// Actualizar cliente
router.put("/:id", controlador.actualizar);

// Eliminar cliente
router.delete("/:id", controlador.eliminar);

module.exports = router;