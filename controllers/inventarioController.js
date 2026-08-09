const Inventario = require("../models/Inventario");

// ==========================
// LISTAR INVENTARIO
// ==========================
exports.listar = (req, res) => {

    Inventario.obtenerTodos((err, resultados) => {

        if (err) {
            return res.status(500).json({
                exito: false,
                mensaje: "Error interno del servidor.",
                error: err.message
            });
        }

        if (!resultados || resultados.length === 0) {
            return res.status(404).json({
                exito: false,
                mensaje: "No se encontraron registros de inventario."
            });
        }

        return res.status(200).json(resultados);

    });

};

// ==========================
// BUSCAR INVENTARIO
// ==========================
exports.buscar = (req, res) => {

    Inventario.obtenerPorId(req.params.id, (err, resultados) => {

        if (err) {
            return res.status(500).json({
                exito: false,
                mensaje: "Error interno del servidor.",
                error: err.message
            });
        }

        if (!resultados || resultados.length === 0) {
            return res.status(404).json({
                exito: false,
                mensaje: "Registro de inventario no encontrado."
            });
        }

        return res.status(200).json(resultados[0]);

    });

};

// ==========================
// INSERTAR INVENTARIO
// ==========================
exports.insertar = (req, res) => {

    const inventario = req.body;

    if (
        !inventario.idProducto ||
        inventario.stockActual === undefined ||
        inventario.stockMinimo === undefined
    ) {
        return res.status(400).json({
            exito: false,
            mensaje: "Todos los campos obligatorios deben ser enviados."
        });
    }

    if (inventario.stockActual < 0 || inventario.stockMinimo < 0) {
        return res.status(400).json({
            exito: false,
            mensaje: "El stock no puede ser negativo."
        });
    }

    Inventario.insertar(inventario, (err, resultado) => {

        if (err) {
            return res.status(500).json({
                exito: false,
                mensaje: "Error al registrar el inventario.",
                error: err.message
            });
        }

        return res.status(201).json({
            exito: true,
            mensaje: "Inventario registrado correctamente.",
            id: resultado.insertId
        });

    });

};

// ==========================
// ACTUALIZAR INVENTARIO
// ==========================
exports.actualizar = (req, res) => {

    const inventario = req.body;

    if (
        !inventario.idProducto ||
        inventario.stockActual === undefined ||
        inventario.stockMinimo === undefined
    ) {
        return res.status(400).json({
            exito: false,
            mensaje: "Todos los campos obligatorios deben ser enviados."
        });
    }

    if (inventario.stockActual < 0 || inventario.stockMinimo < 0) {
        return res.status(400).json({
            exito: false,
            mensaje: "El stock no puede ser negativo."
        });
    }

    Inventario.actualizar(req.params.id, inventario, (err, resultado) => {

        if (err) {
            return res.status(500).json({
                exito: false,
                mensaje: "Error interno del servidor.",
                error: err.message
            });
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                exito: false,
                mensaje: "Registro de inventario no encontrado."
            });
        }

        return res.status(200).json({
            exito: true,
            mensaje: "Inventario actualizado correctamente."
        });

    });

};

// ==========================
// ELIMINAR INVENTARIO
// ==========================
exports.eliminar = (req, res) => {

    Inventario.eliminar(req.params.id, (err, resultado) => {

        if (err) {
            return res.status(500).json({
                exito: false,
                mensaje: "Error interno del servidor.",
                error: err.message
            });
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                exito: false,
                mensaje: "Registro de inventario no encontrado."
            });
        }

        return res.status(200).json({

            exito: true,

            mensaje: "Registro de inventario eliminado correctamente."

        });

    });

};