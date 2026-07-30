const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/dashboardController");

const auth = require("../middlewares/auth");

router.get("/", auth, dashboardController.estadisticas);

module.exports = router;