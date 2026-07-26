const Cliente = require("../models/Cliente");

// ==========================
// LISTAR CLIENTES
// ==========================
exports.listar = (req, res) => {

    Cliente.obtenerTodos((error, datos) => {

        if (error) {
            return res.status(500).json({
                exito: false,
                mensaje: "Error interno del servidor.",
                error: error.message
            });
        }

        if (!datos || datos.length === 0) {
            return res.status(404).json({
                exito: false,
                mensaje: "No se encontraron clientes."
            });
        }

        return res.status(200).json(datos);

    });

};

// ==========================
// BUSCAR CLIENTE
// ==========================
exports.buscar = (req, res) => {

    Cliente.obtenerPorId(req.params.id, (error, datos) => {

        if (error) {
            return res.status(500).json({
                exito: false,
                mensaje: "Error interno del servidor.",
                error: error.message
            });
        }

        if (!datos || datos.length === 0) {
            return res.status(404).json({
                exito: false,
                mensaje: "Cliente no encontrado."
            });
        }

        return res.status(200).json(datos[0]);

    });

};

// ==========================
// INSERTAR CLIENTE
// ==========================
exports.insertar = (req, res) => {

    const cliente = req.body;

    if (!cliente.nombre || !cliente.telefono) {
        return res.status(400).json({
            exito: false,
            mensaje: "Nombre y teléfono son obligatorios."
        });
    }

    Cliente.insertar(cliente, (error, resultado) => {

        if (error) {
            return res.status(500).json({
                exito: false,
                mensaje: "Error al registrar el cliente.",
                error: error.message
            });
        }

        return res.status(201).json({
            exito: true,
            mensaje: "Cliente registrado correctamente.",
            id: resultado.insertId
        });

    });

};

// ==========================
// ACTUALIZAR CLIENTE
// ==========================
exports.actualizar = (req, res) => {

    const cliente = req.body;

    if (!cliente.nombre || !cliente.telefono) {
        return res.status(400).json({
            exito: false,
            mensaje: "Nombre y teléfono son obligatorios."
        });
    }

    Cliente.actualizar(req.params.id, cliente, (error, resultado) => {

        if (error) {
            return res.status(500).json({
                exito: false,
                mensaje: "Error interno del servidor.",
                error: error.message
            });
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                exito: false,
                mensaje: "Cliente no encontrado."
            });
        }

        return res.status(200).json({
            exito: true,
            mensaje: "Cliente actualizado correctamente."
        });

    });

};

// ==========================
// ELIMINAR CLIENTE
// ==========================
exports.eliminar = (req, res) => {

    Cliente.eliminar(req.params.id, (error, resultado) => {

        if (error) {
            return res.status(500).json({
                exito: false,
                mensaje: "Error interno del servidor.",
                error: error.message
            });
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                exito: false,
                mensaje: "Cliente no encontrado."
            });
        }

        return res.status(204).send();

    });

};