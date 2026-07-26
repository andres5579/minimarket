const express = require("express");

const router = express.Router();

const inventarioController = require("../controllers/inventarioController");

router.get("/", inventarioController.listar);

router.get("/:id", inventarioController.buscar);

router.post("/", inventarioController.insertar);

router.put("/:id", inventarioController.actualizar);

router.delete("/:id", inventarioController.eliminar);

module.exports = router;