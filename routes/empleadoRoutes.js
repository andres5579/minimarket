const express = require("express");
const router = express.Router();

const empleadoController = require("../controllers/empleadoController");

router.get("/", empleadoController.listar);

router.get("/:id", empleadoController.buscar);

router.post("/", empleadoController.insertar);

router.put("/:id", empleadoController.actualizar);

router.delete("/:id", empleadoController.eliminar);

module.exports = router;