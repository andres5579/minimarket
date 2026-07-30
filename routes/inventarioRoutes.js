const express = require("express");
const router = express.Router();

const inventarioController = require("../controllers/inventarioController");

const auth = require("../middlewares/auth");
const roles = require("../middlewares/roles");

router.get(
    "/",
    auth,
    roles("administrador", "auxiliar de inventario"),
    inventarioController.listar
);

router.get(
    "/:id",
    auth,
    roles("administrador", "auxiliar de inventario"),
    inventarioController.buscar
);

router.post(
    "/",
    auth,
    roles("administrador", "auxiliar de inventario"),
    inventarioController.insertar
);

router.put(
    "/:id",
    auth,
    roles("administrador", "auxiliar de inventario"),
    inventarioController.actualizar
);

router.delete(
    "/:id",
    auth,
    roles("administrador"),
    inventarioController.eliminar
);

module.exports = router;