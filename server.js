require("./config/database");

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const path = require("path");

const verificarSesion = require("./middlewares/auth");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use(session({
    secret: "minimarket",
    resave: false,
    saveUninitialized: false
}));

// Archivos públicos
app.use(express.static("public"));

// API
app.use("/api/productos", require("./routes/productoRoutes"));
app.use("/api/clientes", require("./routes/clienteRoutes"));
app.use("/api/empleados", require("./routes/empleadoRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/inventario", require("./routes/inventarioRoutes"));
app.use("/api/ventas", require("./routes/ventaRoutes"));
app.use("/api/detalleventa", require("./routes/detalleVentaRoutes"));

// Login
app.use("/login", require("./routes/loginRoutes"));

// Página inicial
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "login.html"));
});

// Dashboard
app.get("/dashboard", verificarSesion, (req, res) => {
    res.sendFile(path.join(__dirname, "views", "dashboard.html"));
});

// Productos
app.get("/productos", verificarSesion, (req, res) => {
    res.sendFile(path.join(__dirname, "views", "productos.html"));
});

// Clientes
app.get("/clientes", verificarSesion, (req, res) => {
    res.sendFile(path.join(__dirname, "views", "clientes.html"));
});

// Empleados
app.get("/empleados", verificarSesion, (req, res) => {
    res.sendFile(path.join(__dirname, "views", "empleados.html"));
});

// Inventario
app.get("/inventario", verificarSesion, (req, res) => {
    res.sendFile(path.join(__dirname, "views", "inventario.html"));
});

// Ventas
app.get("/ventas", verificarSesion, (req, res) => {
    res.sendFile(path.join(__dirname, "views", "ventas.html"));
});

// Detalle de venta
app.get("/detalleventa", verificarSesion, (req, res) => {
    res.sendFile(path.join(__dirname, "views", "detalleVenta.html"));
});

const PUERTO = 3000;

app.listen(PUERTO, () => {
    console.log(`Servidor iniciado en http://localhost:${PUERTO}`);
});