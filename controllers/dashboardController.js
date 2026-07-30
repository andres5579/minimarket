const db = require("../config/database");

exports.estadisticas = (req, res) => {

    const datos = {};

    // ==========================
    // TOTAL PRODUCTOS
    // ==========================
    db.query("SELECT COUNT(*) AS total FROM producto", (err, productos) => {

        if (err) {
            return res.status(500).json({
                exito: false,
                mensaje: "Error al obtener el total de productos.",
                error: err.message
            });
        }

        datos.totalProductos = productos[0].total;

        // ==========================
        // TOTAL CLIENTES
        // ==========================
        db.query("SELECT COUNT(*) AS total FROM cliente", (err, clientes) => {

            if (err) {
                return res.status(500).json({
                    exito: false,
                    mensaje: "Error al obtener el total de clientes.",
                    error: err.message
                });
            }

            datos.totalClientes = clientes[0].total;

            // ==========================
            // TOTAL EMPLEADOS
            // ==========================
            db.query("SELECT COUNT(*) AS total FROM empleado", (err, empleados) => {

                if (err) {
                    return res.status(500).json({
                        exito: false,
                        mensaje: "Error al obtener el total de empleados.",
                        error: err.message
                    });
                }

                datos.totalEmpleados = empleados[0].total;

                // ==========================
                // TOTAL INVENTARIO
                // ==========================
                db.query("SELECT COUNT(*) AS total FROM inventario", (err, inventario) => {

                    if (err) {
                        return res.status(500).json({
                            exito: false,
                            mensaje: "Error al obtener el total del inventario.",
                            error: err.message
                        });
                    }

                    datos.totalInventario = inventario[0].total;

                    // ==========================
                    // TOTAL VENTAS
                    // ==========================
                    db.query("SELECT COUNT(*) AS total FROM venta", (err, ventas) => {

                        if (err) {
                            return res.status(500).json({
                                exito: false,
                                mensaje: "Error al obtener el total de ventas.",
                                error: err.message
                            });
                        }

                        datos.totalVentas = ventas[0].total;

                        // ==========================
                        // RESPUESTA FINAL
                        // ==========================
                        return res.status(200).json(datos);

                    });

                });

            });

        });

    });

};