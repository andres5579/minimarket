const express = require("express");

const router = express.Router();

const controlador = require("../controllers/productoController");

router.get("/",controlador.listar);

router.get("/:id",controlador.buscar);

router.post("/",controlador.insertar);

router.put("/:id",controlador.actualizar);

router.delete("/:id",controlador.eliminar);

module.exports = router;