const mysql = require("mysql2");

const conexion = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Admin123*",
    database: "minimarket_gcm"
});

conexion.connect((error) => {
    if (error) {
        console.log("Error de conexión:", error);
    } else {
        console.log("Base de datos conectada.");
    }
});

module.exports = conexion;