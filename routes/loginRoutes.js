const express = require("express");

const router = express.Router();

const loginController = require("../controllers/loginController");

router.post("/",loginController.login);

router.get("/logout",loginController.logout);

router.get("/usuario",loginController.usuarioActual);

module.exports = router;