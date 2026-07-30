const express = require("express");
const router = express.Router();

const productoController = require("../controllers/productoController");

const auth = require("../middlewares/auth");
const roles = require("../middlewares/roles");

router.get(
    "/",
    auth,
    roles("administrador", "cajero", "auxiliar de inventario"),
    productoController.listar
);

router.get(
    "/:id",
    auth,
    roles("administrador", "cajero", "auxiliar de inventario"),
    productoController.buscar
);

router.post(
    "/",
    auth,
    roles("administrador", "auxiliar de inventario"),
    productoController.insertar
);

router.put(
    "/:id",
    auth,
    roles("administrador", "auxiliar de inventario"),
    productoController.actualizar
);

router.delete(
    "/:id",
    auth,
    roles("administrador"),
    productoController.eliminar
);

module.exports = router;