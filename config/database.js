// =======================================================
// CONEXIÓN A LA BASE DE DATOS
// Proyecto: Sistema Web de Gestión MiniMarket
//
// Este archivo crea la conexión con MySQL.
// Durante las pruebas con Jest (NODE_ENV=test)
// NO se conecta automáticamente para evitar
// errores y advertencias.
// =======================================================

require("dotenv").config();
const mysql = require("mysql2");

// =======================================================
// Crear la conexión
// =======================================================

const conexion = mysql.createConnection({

    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME

});

// =======================================================
// Conectarse únicamente cuando NO se estén
// ejecutando pruebas automatizadas.
// =======================================================

if (process.env.NODE_ENV !== "test") {

    conexion.connect((error) => {

        if (error) {

            console.log("Error de conexión:", error);

        } else {

            console.log("Base de datos conectada.");

        }

    });

}

// =======================================================
// Exportar la conexión
// =======================================================

module.exports = conexion;