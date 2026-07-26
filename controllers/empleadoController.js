const Empleado = require("../models/Empleado");

// ==========================
// LISTAR EMPLEADOS
// ==========================
exports.listar = (req, res) => {

    Empleado.obtenerTodos((err, resultados) => {

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
                mensaje: "No se encontraron empleados."
            });
        }

        return res.status(200).json(resultados);

    });

};

// ==========================
// BUSCAR EMPLEADO
// ==========================
exports.buscar = (req, res) => {

    Empleado.obtenerPorId(req.params.id, (err, resultados) => {

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
                mensaje: "Empleado no encontrado."
            });
        }

        return res.status(200).json(resultados[0]);

    });

};

// ==========================
// INSERTAR EMPLEADO
// ==========================
exports.insertar = (req, res) => {

    const empleado = req.body;

    if (
        !empleado.nombre ||
        !empleado.rol ||
        !empleado.usuario ||
        !empleado.password
    ) {

        return res.status(400).json({
            exito: false,
            mensaje: "Todos los campos son obligatorios."
        });

    }

    Empleado.insertar(empleado, (err, resultado) => {

        if (err) {
            return res.status(500).json({
                exito: false,
                mensaje: "Error al registrar el empleado.",
                error: err.message
            });
        }

        return res.status(201).json({
            exito: true,
            mensaje: "Empleado registrado correctamente.",
            id: resultado.insertId
        });

    });

};

// ==========================
// ACTUALIZAR EMPLEADO
// ==========================
exports.actualizar = (req, res) => {

    const empleado = req.body;

    if (
        !empleado.nombre ||
        !empleado.rol ||
        !empleado.usuario ||
        !empleado.password
    ) {

        return res.status(400).json({
            exito: false,
            mensaje: "Todos los campos son obligatorios."
        });

    }

    Empleado.actualizar(req.params.id, empleado, (err, resultado) => {

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
                mensaje: "Empleado no encontrado."
            });
        }

        return res.status(200).json({
            exito: true,
            mensaje: "Empleado actualizado correctamente."
        });

    });

};

// ==========================
// ELIMINAR EMPLEADO
// ==========================
exports.eliminar = (req, res) => {

    Empleado.eliminar(req.params.id, (err, resultado) => {

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
                mensaje: "Empleado no encontrado."
            });
        }

        return res.status(204).send();

    });

};