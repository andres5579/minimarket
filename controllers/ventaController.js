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

exports.guardar = async (req, res) => {

    const venta = req.body;

    // ===========================
    // Validaciones generales
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

    if (Number(venta.totalPagar) <= 0) {

        return res.status(400).json({
            exito: false,
            mensaje: "El total de la venta es inválido."
        });

    }

    // ===========================
    // Validar detalles
    // ===========================

    for (const detalle of venta.detalles) {

        if (!detalle.idProducto) {

            return res.status(400).json({
                exito: false,
                mensaje: "Cada detalle debe tener un producto."
            });

        }

        if (
            !Number.isInteger(Number(detalle.cantidad)) ||
            Number(detalle.cantidad) <= 0
        ) {

            return res.status(400).json({
                exito: false,
                mensaje: "La cantidad debe ser un número entero mayor que cero."
            });

        }

        if (
            !Number.isFinite(Number(detalle.precioUnitario)) ||
            Number(detalle.precioUnitario) <= 0
        ) {

            return res.status(400).json({
                exito: false,
                mensaje: "El precio unitario debe ser mayor que cero."
            });

        }

        if (
            !Number.isFinite(Number(detalle.subtotal)) ||
            Number(detalle.subtotal) <= 0
        ) {

            return res.status(400).json({
                exito: false,
                mensaje: "El subtotal debe ser mayor que cero."
            });

        }

        // ===========================
        // Validar subtotal
        // ===========================

        const cantidad = Number(detalle.cantidad);
        const precio = Number(detalle.precioUnitario);
        const subtotal = Number(detalle.subtotal);

        const subtotalCalculado = cantidad * precio;

        if (Math.abs(subtotal - subtotalCalculado) > 0.01) {

            return res.status(400).json({
                exito: false,
                mensaje: `El subtotal del producto ${detalle.idProducto} no coincide con la cantidad y el precio.`
            });

        }

    }

    // ===========================
    // Validar total
    // ===========================

    const totalCalculado = venta.detalles.reduce(
        (total, detalle) => total + Number(detalle.subtotal),
        0
    );

    if (
        Math.abs(
            Number(venta.totalPagar) - totalCalculado
        ) > 0.01
    ) {

        return res.status(400).json({
            exito: false,
            mensaje: "El total de la venta no coincide con la suma de los subtotales."
        });

    }

    // ===========================
    // Registrar venta
    // ===========================

    try {

        const resultado = await Venta.registrarVentaCompleta(venta);

        return res.status(201).json({

            exito: true,

            mensaje: "Venta registrada correctamente.",

            idVenta: resultado.idVenta,

            puntosGanados: resultado.puntosGanados

        });

    } catch (error) {

        console.error("Error al registrar venta:", error);

        return res.status(400).json({

            exito: false,

            mensaje: error.message

        });

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