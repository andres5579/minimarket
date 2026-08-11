const db = require("../config/database");

exports.estadisticas = (req, res) => {

    const datos = {};

    // ==========================================
    // TOTAL PRODUCTOS
    // ==========================================

    db.query(
        "SELECT COUNT(*) AS total FROM producto",
        (err, productos) => {

            if (err) {
                return res.status(500).json({
                    exito: false,
                    mensaje: "Error al obtener el total de productos.",
                    error: err.message
                });
            }

            datos.totalProductos = productos[0].total;


            // ==========================================
            // TOTAL CLIENTES
            // ==========================================

            db.query(
                "SELECT COUNT(*) AS total FROM cliente",
                (err, clientes) => {

                    if (err) {
                        return res.status(500).json({
                            exito: false,
                            mensaje: "Error al obtener el total de clientes.",
                            error: err.message
                        });
                    }

                    datos.totalClientes = clientes[0].total;


                    // ==========================================
                    // TOTAL EMPLEADOS
                    // ==========================================

                    db.query(
                        "SELECT COUNT(*) AS total FROM empleado",
                        (err, empleados) => {

                            if (err) {
                                return res.status(500).json({
                                    exito: false,
                                    mensaje: "Error al obtener el total de empleados.",
                                    error: err.message
                                });
                            }

                            datos.totalEmpleados = empleados[0].total;


                            // ==========================================
                            // TOTAL INVENTARIO
                            // ==========================================

                            db.query(
                                "SELECT COUNT(*) AS total FROM inventario",
                                (err, inventario) => {

                                    if (err) {
                                        return res.status(500).json({
                                            exito: false,
                                            mensaje: "Error al obtener el total del inventario.",
                                            error: err.message
                                        });
                                    }

                                    datos.totalInventario =
                                        inventario[0].total;


                                    // ==========================================
                                    // TOTAL VENTAS
                                    // ==========================================

                                    db.query(
                                        "SELECT COUNT(*) AS total FROM venta",
                                        (err, ventas) => {

                                            if (err) {
                                                return res.status(500).json({
                                                    exito: false,
                                                    mensaje: "Error al obtener el total de ventas.",
                                                    error: err.message
                                                });
                                            }

                                            datos.totalVentas =
                                                ventas[0].total;


                                            // ==========================================
                                            // TOTAL VENDIDO
                                            // ==========================================

                                            db.query(
                                                `
                                                SELECT
                                                    COALESCE(SUM(totalPagar), 0) AS total
                                                FROM venta
                                                `,
                                                (err, totalVendido) => {

                                                    if (err) {
                                                        return res.status(500).json({
                                                            exito: false,
                                                            mensaje: "Error al obtener el total vendido.",
                                                            error: err.message
                                                        });
                                                    }

                                                    datos.totalVendido =
                                                        totalVendido[0].total;


                                                    // ==========================================
                                                    // VENTAS DEL DÍA
                                                    // ==========================================

                                                    db.query(
                                                        `
                                                        SELECT
                                                            COUNT(*) AS total
                                                        FROM venta
                                                        WHERE DATE(fechaHora) = CURDATE()
                                                        `,
                                                        (err, ventasHoy) => {

                                                            if (err) {
                                                                return res.status(500).json({
                                                                    exito: false,
                                                                    mensaje: "Error al obtener las ventas del día.",
                                                                    error: err.message
                                                                });
                                                            }

                                                            datos.ventasHoy =
                                                                ventasHoy[0].total;


                                                            // ==========================================
                                                            // PRODUCTOS CON STOCK BAJO
                                                            // ==========================================

                                                            db.query(
                                                                `
                                                                SELECT
                                                                    i.idProducto,
                                                                    p.nombre,
                                                                    i.stockActual,
                                                                    i.stockMinimo
                                                                FROM inventario i
                                                                INNER JOIN producto p
                                                                    ON i.idProducto = p.idProducto
                                                                WHERE i.stockActual <= i.stockMinimo
                                                                ORDER BY i.stockActual ASC
                                                                `,
                                                                (err, productosStockBajo) => {

                                                                    if (err) {
                                                                        return res.status(500).json({
                                                                            exito: false,
                                                                            mensaje: "Error al obtener los productos con stock bajo.",
                                                                            error: err.message
                                                                        });
                                                                    }

                                                                    datos.productosStockBajo =
                                                                        productosStockBajo;


                                                                    // ==========================================
                                                                    // PRODUCTOS MÁS VENDIDOS
                                                                    // ==========================================

                                                                    db.query(
                                                                        `
                                                                        SELECT
                                                                            p.idProducto,
                                                                            p.nombre,
                                                                            SUM(dv.cantidad) AS cantidadVendida
                                                                        FROM detalleventa dv
                                                                        INNER JOIN producto p
                                                                            ON dv.idProducto = p.idProducto
                                                                        GROUP BY
                                                                            p.idProducto,
                                                                            p.nombre
                                                                        ORDER BY cantidadVendida DESC
                                                                        LIMIT 5
                                                                        `,
                                                                        (err, productosMasVendidos) => {

                                                                            if (err) {
                                                                                return res.status(500).json({
                                                                                    exito: false,
                                                                                    mensaje: "Error al obtener los productos más vendidos.",
                                                                                    error: err.message
                                                                                });
                                                                            }

                                                                            datos.productosMasVendidos =
                                                                                productosMasVendidos;


                                                                            // ==========================================
                                                                            // ÚLTIMAS VENTAS
                                                                            // ==========================================

                                                                            db.query(
                                                                                `
                                                                                SELECT
                                                                                    v.idVenta,
                                                                                    v.fechaHora,
                                                                                    c.nombre AS cliente,
                                                                                    e.nombre AS empleado,
                                                                                    v.metodoPago,
                                                                                    v.totalPagar,
                                                                                    v.estado
                                                                                FROM venta v
                                                                                INNER JOIN cliente c
                                                                                    ON v.idCliente = c.idCliente
                                                                                INNER JOIN empleado e
                                                                                    ON v.idEmpleado = e.idEmpleado
                                                                                ORDER BY v.idVenta DESC
                                                                                LIMIT 5
                                                                                `,
                                                                                (err, ultimasVentas) => {

                                                                                    if (err) {
                                                                                        return res.status(500).json({
                                                                                            exito: false,
                                                                                            mensaje: "Error al obtener las últimas ventas.",
                                                                                            error: err.message
                                                                                        });
                                                                                    }

                                                                                    datos.ultimasVentas =
                                                                                        ultimasVentas;


                                                                                    // ==========================================
                                                                                    // VENTAS DE LOS ÚLTIMOS 7 DÍAS
                                                                                    // ==========================================

                                                                                    db.query(
                                                                                        `
                                                                                        SELECT
                                                                                            DATE(fechaHora) AS fecha,
                                                                                            SUM(totalPagar) AS total
                                                                                        FROM venta
                                                                                        WHERE DATE(fechaHora)
                                                                                            >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
                                                                                        GROUP BY DATE(fechaHora)
                                                                                        ORDER BY fecha ASC
                                                                                        `,
                                                                                        (err, ventasUltimosDias) => {

                                                                                            if (err) {
                                                                                                return res.status(500).json({
                                                                                                    exito: false,
                                                                                                    mensaje: "Error al obtener las ventas de los últimos días.",
                                                                                                    error: err.message
                                                                                                });
                                                                                            }

                                                                                            datos.ventasUltimosDias =
                                                                                                ventasUltimosDias;


                                                                                            // ==========================================
                                                                                            // RESPUESTA FINAL
                                                                                            // ==========================================

                                                                                            return res.status(200).json(datos);

                                                                                        }
                                                                                    );

                                                                                }
                                                                            );

                                                                        }
                                                                    );

                                                                }
                                                            );

                                                        }
                                                    );

                                                }
                                            );

                                        }
                                    );

                                }
                            );

                        }
                    );

                }
            );

        }
    );

};