const Venta = require("../models/Venta");

// ===========================
// Obtener clientes
// ===========================

exports.clientes = (req, res) => {

    Venta.obtenerClientes((err, resultados) => {

        if (err) {
            return res.status(500).json({
                exito: false,
                mensaje: "Error al obtener los clientes.",
                error: err.message
            });
        }

        return res.status(200).json(resultados);

    });

};

// ===========================
// Obtener empleados
// ===========================

exports.empleados = (req, res) => {

    Venta.obtenerEmpleados((err, resultados) => {

        if (err) {
            return res.status(500).json({
                exito: false,
                mensaje: "Error al obtener los empleados.",
                error: err.message
            });
        }

        return res.status(200).json(resultados);

    });

};

// ===========================
// Obtener productos
// ===========================

exports.productos = (req, res) => {

    Venta.obtenerProductos((err, resultados) => {

        if (err) {
            return res.status(500).json({
                exito: false,
                mensaje: "Error al obtener los productos.",
                error: err.message
            });
        }

        return res.status(200).json(resultados);

    });

};

// ===========================
// Guardar venta
// ===========================

exports.guardar = (req, res) => {

    const venta = req.body;

    // ===========================
    // Validaciones
    // ===========================

    if (
        !venta.idCliente ||
        !venta.idEmpleado ||
        !venta.metodoPago ||
        !venta.estado
    ) {

        return res.status(400).json({
            exito: false,
            mensaje: "Información de la venta incompleta."
        });

    }

    if (!venta.detalles || venta.detalles.length === 0) {

        return res.status(400).json({
            exito: false,
            mensaje: "Debe agregar al menos un producto."
        });

    }

    if (venta.totalPagar <= 0) {

        return res.status(400).json({
            exito: false,
            mensaje: "El total de la venta es inválido."
        });

    }

    let pendientesStock = venta.detalles.length;

    // ===========================
    // Verificar stock
    // ===========================

    venta.detalles.forEach(detalle => {

        Venta.consultarStock(detalle.idProducto, (err, resultado) => {

            if (err) {

                return res.status(500).json({
                    exito: false,
                    mensaje: "Error al consultar el inventario.",
                    error: err.message
                });

            }

            if (resultado.length === 0) {

                return res.status(404).json({
                    exito: false,
                    mensaje: "Producto no encontrado en inventario."
                });

            }

            if (resultado[0].stockActual < detalle.cantidad) {

                return res.status(400).json({
                    exito: false,
                    mensaje: `Stock insuficiente para el producto ${detalle.idProducto}.`
                });

            }

            pendientesStock--;

            if (pendientesStock === 0) {

                registrarVenta();

            }

        });

    });

    // ===========================
    // Registrar venta
    // ===========================

    function registrarVenta() {

        Venta.registrarVenta(venta, (err, resultadoVenta) => {

            if (err) {

                return res.status(500).json({
                    exito: false,
                    mensaje: "Error al registrar la venta.",
                    error: err.message
                });

            }

            const idVenta = resultadoVenta.insertId;

            registrarDetalles(idVenta);

        });

    }

    // ===========================
    // Registrar detalles
    // ===========================

    function registrarDetalles(idVenta) {

        let pendientes = venta.detalles.length;

        venta.detalles.forEach(detalle => {

            Venta.registrarDetalle({

                idVenta,
                idProducto: detalle.idProducto,
                cantidad: detalle.cantidad,
                precioUnitario: detalle.precioUnitario,
                subtotal: detalle.subtotal

            }, (err) => {

                if (err) {

                    return res.status(500).json({
                        exito: false,
                        mensaje: "Error al registrar el detalle.",
                        error: err.message
                    });

                }

                Venta.actualizarInventario(

                    detalle.idProducto,

                    detalle.cantidad,

                    (err) => {

                        if (err) {

                            return res.status(500).json({
                                exito: false,
                                mensaje: "Error al actualizar el inventario.",
                                error: err.message
                            });

                        }

                        pendientes--;

                        if (pendientes === 0) {

                            finalizarVenta();

                        }

                    }

                );

            });

        });

    }

    // ===========================
    // Finalizar venta
    // ===========================

    function finalizarVenta() {

        const puntos = Math.floor(venta.totalPagar / 1000);

        Venta.actualizarPuntos(

            venta.idCliente,

            puntos,

            (err) => {

                if (err) {

                    return res.status(500).json({
                        exito: false,
                        mensaje: "La venta fue registrada, pero no se actualizaron los puntos.",
                        error: err.message
                    });

                }

                return res.status(201).json({

                    exito: true,

                    mensaje: "Venta registrada correctamente.",

                    puntosGanados: puntos

                });

            }

        );

    }

};

// ===========================
// Historial de ventas
// ===========================

exports.historial = (req, res) => {

    Venta.obtenerVentas((err, resultados) => {

        if (err) {

            return res.status(500).json({

                exito: false,
                mensaje: "Error al obtener las ventas.",
                error: err.message

            });

        }

        return res.status(200).json(resultados);

    });

};

// ===========================
// Detalle de una venta
// ===========================

exports.detalle = (req, res) => {

    Venta.obtenerDetalle(req.params.id, (err, resultados) => {

        if (err) {

            return res.status(500).json({

                exito: false,
                mensaje: "Error al obtener el detalle.",
                error: err.message

            });

        }

        return res.status(200).json(resultados);

    });

};