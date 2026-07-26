require("./config/database");

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// Archivos estáticos
app.use(express.static("public"));

// Rutas
app.use("/api/productos", require("./routes/productoRoutes"));
app.use("/api/clientes", require("./routes/clienteRoutes"));
app.use("/api/empleados", require("./routes/empleadoRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/inventario", require("./routes/inventarioRoutes"));
app.use("/api/ventas", require("./routes/ventaRoutes"));
app.use("/api/detalleventa",require("./routes/detalleVentaRoutes"));

// Página principal
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "dashboard.html"));
});

app.get("/productos", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "productos.html"));
});

app.get("/clientes", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "clientes.html"));
});

app.get("/empleados", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "empleados.html"));
});

app.get("/inventario", (req, res) => {

    res.sendFile(path.join(__dirname, "views", "inventario.html"));

});

app.get("/ventas", (req, res) => {

    res.sendFile(path.join(__dirname, "views", "ventas.html"));

});

app.get("/detalleventa",(req,res)=>{

    res.sendFile(path.join(__dirname,"views","detalleVenta.html"));

});

const PUERTO = 3000;

app.listen(PUERTO, () => {
    console.log(`Servidor iniciado en http://localhost:${PUERTO}`);
});