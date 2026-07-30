const express = require("express");
const router = express.Router();

const empleadoController = require("../controllers/empleadoController");

const auth = require("../middlewares/auth");
const roles = require("../middlewares/roles");

router.get(
    "/",
    auth,
    roles("administrador"),
    empleadoController.listar
);

router.get(
    "/:id",
    auth,
    roles("administrador"),
    empleadoController.buscar
);

router.post(
    "/",
    auth,
    roles("administrador"),
    empleadoController.insertar
);

router.put(
    "/:id",
    auth,
    roles("administrador"),
    empleadoController.actualizar
);

router.delete(
    "/:id",
    auth,
    roles("administrador"),
    empleadoController.eliminar
);

module.exports = router;