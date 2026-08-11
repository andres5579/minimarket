const Inventario = require("../models/Inventario");

// ==========================
// LISTAR INVENTARIO
// ==========================
exports.listar = (req, res) => {

    Inventario.obtenerTodos((err, resultados) => {

        if (err) {
            return res.status(500).json({
                exito: false,
                mensaje: "Error al obtener el inventario.",
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

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            exito: false,
            mensaje: "El ID del inventario debe ser un número entero mayor que cero."
        });
    }

    Inventario.obtenerPorId(id, (err, resultados) => {

        if (err) {
            return res.status(500).json({
                exito: false,
                mensaje: "Error al obtener el inventario.",
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

    // ==========================
    // Campos obligatorios
    // ==========================

    if (
        inventario.idProducto === undefined ||
        inventario.idProducto === null ||
        inventario.idProducto === "" ||
        inventario.stockActual === undefined ||
        inventario.stockMinimo === undefined
    ) {

        return res.status(400).json({
            exito: false,
            mensaje: "Todos los campos obligatorios deben ser enviados."
        });

    }

    // ==========================
    // Validar ID producto
    // ==========================

    const idProducto = Number(inventario.idProducto);

    if (!Number.isInteger(idProducto) || idProducto <= 0) {

        return res.status(400).json({
            exito: false,
            mensaje: "El ID del producto debe ser un número entero mayor que cero."
        });

    }

    // ==========================
    // Validar stock actual
    // ==========================

    const stockActual = Number(inventario.stockActual);

    if (!Number.isFinite(stockActual) || stockActual < 0) {

        return res.status(400).json({
            exito: false,
            mensaje: "El stock actual debe ser un número mayor o igual a cero."
        });

    }

    // ==========================
    // Validar stock mínimo
    // ==========================

    const stockMinimo = Number(inventario.stockMinimo);

    if (!Number.isFinite(stockMinimo) || stockMinimo < 0) {

        return res.status(400).json({
            exito: false,
            mensaje: "El stock mínimo debe ser un número mayor o igual a cero."
        });

    }

    // ==========================
    // Validar ubicación
    // ==========================

    if (
        inventario.ubicacion === undefined ||
        inventario.ubicacion === null ||
        String(inventario.ubicacion).trim() === ""
    ) {

        return res.status(400).json({
            exito: false,
            mensaje: "La ubicación es obligatoria."
        });

    }

    Inventario.insertar(

        {
            idProducto,
            ubicacion: String(inventario.ubicacion).trim(),
            stockActual,
            stockMinimo
        },

        (err, resultado) => {

            if (err) {

                // Producto inexistente
                if (err.code === "ER_NO_REFERENCED_ROW_2") {

                    return res.status(404).json({
                        exito: false,
                        mensaje: "El producto indicado no existe."
                    });

                }

                // Inventario duplicado
                if (
                    err.code === "ER_DUP_ENTRY" ||
                    err.code === "ER_DUP_KEY"
                ) {

                    return res.status(409).json({
                        exito: false,
                        mensaje: "El producto ya tiene un registro de inventario."
                    });

                }

                console.error(err);

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

        }

    );

};

// ==========================
// ACTUALIZAR INVENTARIO
// ==========================
exports.actualizar = (req, res) => {

    const id = Number(req.params.id);

    // ==========================
    // Validar ID inventario
    // ==========================

    if (!Number.isInteger(id) || id <= 0) {

        return res.status(400).json({
            exito: false,
            mensaje: "El ID del inventario debe ser un número entero mayor que cero."
        });

    }

    const inventario = req.body;

    // ==========================
    // Campos obligatorios
    // ==========================

    if (
        inventario.idProducto === undefined ||
        inventario.idProducto === null ||
        inventario.idProducto === "" ||
        inventario.stockActual === undefined ||
        inventario.stockMinimo === undefined
    ) {

        return res.status(400).json({
            exito: false,
            mensaje: "Todos los campos obligatorios deben ser enviados."
        });

    }

    // ==========================
    // Validar ID producto
    // ==========================

    const idProducto = Number(inventario.idProducto);

    if (!Number.isInteger(idProducto) || idProducto <= 0) {

        return res.status(400).json({
            exito: false,
            mensaje: "El ID del producto debe ser un número entero mayor que cero."
        });

    }

    // ==========================
    // Validar stock actual
    // ==========================

    const stockActual = Number(inventario.stockActual);

    if (!Number.isFinite(stockActual) || stockActual < 0) {

        return res.status(400).json({
            exito: false,
            mensaje: "El stock actual debe ser un número mayor o igual a cero."
        });

    }

    // ==========================
    // Validar stock mínimo
    // ==========================

    const stockMinimo = Number(inventario.stockMinimo);

    if (!Number.isFinite(stockMinimo) || stockMinimo < 0) {

        return res.status(400).json({
            exito: false,
            mensaje: "El stock mínimo debe ser un número mayor o igual a cero."
        });

    }

    // ==========================
    // Validar ubicación
    // ==========================

    if (
        inventario.ubicacion === undefined ||
        inventario.ubicacion === null ||
        String(inventario.ubicacion).trim() === ""
    ) {

        return res.status(400).json({
            exito: false,
            mensaje: "La ubicación es obligatoria."
        });

    }

    Inventario.actualizar(

        id,

        {
            idProducto,
            ubicacion: String(inventario.ubicacion).trim(),
            stockActual,
            stockMinimo
        },

        (err, resultado) => {

            if (err) {

                // Producto inexistente
                if (err.code === "ER_NO_REFERENCED_ROW_2") {

                    return res.status(404).json({
                        exito: false,
                        mensaje: "El producto indicado no existe."
                    });

                }

                // Producto ya tiene otro inventario
                if (
                    err.code === "ER_DUP_ENTRY" ||
                    err.code === "ER_DUP_KEY"
                ) {

                    return res.status(409).json({
                        exito: false,
                        mensaje: "El producto ya tiene otro registro de inventario."
                    });

                }

                console.error(err);

                return res.status(500).json({
                    exito: false,
                    mensaje: "Error al actualizar el inventario.",
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

        }

    );

};

// ==========================
// ELIMINAR INVENTARIO
// ==========================
exports.eliminar = (req, res) => {

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {

        return res.status(400).json({
            exito: false,
            mensaje: "El ID del inventario debe ser un número entero mayor que cero."
        });

    }

    Inventario.eliminar(id, (err, resultado) => {

        if (err) {

            console.error(err);

            return res.status(500).json({
                exito: false,
                mensaje: "Error al eliminar el inventario.",
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