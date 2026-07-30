const express = require("express");
const router = express.Router();

const clienteController = require("../controllers/clienteController");

const auth = require("../middlewares/auth");
const roles = require("../middlewares/roles");

router.get(
    "/",
    auth,
    roles("administrador", "cajero"),
    clienteController.listar
);

router.get(
    "/:id",
    auth,
    roles("administrador", "cajero"),
    clienteController.buscar
);

router.post(
    "/",
    auth,
    roles("administrador", "cajero"),
    clienteController.insertar
);

router.put(
    "/:id",
    auth,
    roles("administrador", "cajero"),
    clienteController.actualizar
);

router.delete(
    "/:id",
    auth,
    roles("administrador"),
    clienteController.eliminar
);

module.exports = router;