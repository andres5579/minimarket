// ===========================
// IMPORTAR MODELO
// ===========================

const Producto = require("../models/Producto");

// ===========================
// LISTAR PRODUCTOS
// ===========================

exports.listar = (req, res) => {

    Producto.obtenerTodos((error, datos) => {

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
                mensaje: "No se encontraron productos."
            });

        }

        return res.status(200).json(datos);

    });

};

// ===========================
// BUSCAR PRODUCTO
// ===========================

exports.buscar = (req, res) => {

    Producto.obtenerPorId(req.params.id, (error, datos) => {

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
                mensaje: "Producto no encontrado."
            });

        }

        return res.status(200).json(datos[0]);

    });

};

// ===========================
// INSERTAR PRODUCTO
// ===========================

exports.insertar = (req, res) => {

    const producto = req.body;

    if (
        !producto.nombre ||
        !producto.codigoBarra ||
        !producto.precioVenta ||
        !producto.precioCompra
    ) {

        return res.status(400).json({
            exito: false,
            mensaje: "Todos los campos obligatorios son requeridos."
        });

    }

    Producto.insertar(producto, (error, resultado) => {

        if (error) {

            return res.status(500).json({
                exito: false,
                mensaje: "Error al registrar el producto.",
                error: error.message
            });

        }

        return res.status(201).json({
            exito: true,
            mensaje: "Producto registrado correctamente.",
            id: resultado.insertId
        });

    });

};

// ===========================
// ACTUALIZAR PRODUCTO
// ===========================

exports.actualizar = (req, res) => {

    const producto = req.body;

    if (!producto.nombre) {

        return res.status(400).json({
            exito: false,
            mensaje: "Información incompleta."
        });

    }

    Producto.actualizar(req.params.id, producto, (error, resultado) => {

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
                mensaje: "Producto no encontrado."
            });

        }

        return res.status(200).json({
            exito: true,
            mensaje: "Producto actualizado correctamente."
        });

    });

};

// ===========================
// ELIMINAR PRODUCTO
// ===========================

exports.eliminar = (req, res) => {

    Producto.eliminar(req.params.id, (error, resultado) => {

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
                mensaje: "Producto no encontrado."
            });

        }

        return res.status(204).send();

    });

};