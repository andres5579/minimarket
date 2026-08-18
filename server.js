require("./config/database");

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const path = require("path");

const verificarSesion = require("./middlewares/auth");
const verificarRol = require("./middlewares/roles");

const app = express();

// =========================
// Middleware
// =========================
app.use(cors());
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET || "minimarket",
    resave: false,
    saveUninitialized: false
}));

// =========================
// Archivos públicos
// =========================
app.use(express.static("public"));

// =========================
// API
// =========================
app.use("/api/productos", require("./routes/productoRoutes"));
app.use("/api/clientes", require("./routes/clienteRoutes"));
app.use("/api/empleados", require("./routes/empleadoRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/inventario", require("./routes/inventarioRoutes"));
app.use("/api/ventas", require("./routes/ventaRoutes"));
app.use("/api/detalleventa", require("./routes/detalleVentaRoutes"));

// =========================
// Login
// =========================
app.use("/login", require("./routes/loginRoutes"));

// =========================
// Página inicial
// =========================
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "login.html"));
});

// =========================
// Dashboard
// Todos los usuarios autenticados
// =========================
app.get("/dashboard", verificarSesion, (req, res) => {
    res.sendFile(path.join(__dirname, "views", "dashboard.html"));
});

// =========================
// Productos
// Todos los usuarios autenticados
// =========================
app.get("/productos", verificarSesion, (req, res) => {
    res.sendFile(path.join(__dirname, "views", "productos.html"));
});

// =========================
// Clientes
// Administrador y Cajero
// =========================
app.get(
    "/clientes",
    verificarSesion,
    verificarRol("administrador", "cajero"),
    (req, res) => {
        res.sendFile(path.join(__dirname, "views", "clientes.html"));
    }
);

// =========================
// Empleados
// Solo Administrador
// =========================
app.get(
    "/empleados",
    verificarSesion,
    verificarRol("administrador"),
    (req, res) => {
        res.sendFile(path.join(__dirname, "views", "empleados.html"));
    }
);

// =========================
// Inventario
// Administrador y Auxiliar de Inventario
// =========================
app.get(
    "/inventario",
    verificarSesion,
    verificarRol("administrador", "auxiliar de inventario"),
    (req, res) => {
        res.sendFile(path.join(__dirname, "views", "inventario.html"));
    }
);

// =========================
// Ventas
// Administrador y Cajero
// =========================
app.get(
    "/ventas",
    verificarSesion,
    verificarRol("administrador", "cajero"),
    (req, res) => {
        res.sendFile(path.join(__dirname, "views", "ventas.html"));
    }
);

// =========================
// Detalle de Venta
// Solo Administrador
// =========================
app.get(
    "/detalleventa",
    verificarSesion,
    verificarRol("administrador"),
    (req, res) => {
        res.sendFile(path.join(__dirname, "views", "detalleVenta.html"));
    }
);

// =========================
// Servidor
// =========================
const PUERTO = process.env.PORT || 3000;

// Solo inicia el servidor cuando
// server.js se ejecuta directamente
if (require.main === module) {

    app.listen(PUERTO, () => {
        console.log(`Servidor iniciado en el puerto ${PUERTO}`);
    });

}

// Exportar la aplicación para Jest y Supertest
module.exports = app;
