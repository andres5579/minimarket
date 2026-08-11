// ===========================
// IMPORTAR MODELO
// ===========================

const Producto = require("../models/Producto");

// ===========================
// FUNCIONES DE VALIDACIÓN
// ===========================

function validarId(id) {

    return Number.isInteger(Number(id)) && Number(id) > 0;

}

// ===========================
// VALIDAR PRECIO
// ===========================

function validarPrecio(valor) {

    return (
        valor !== undefined &&
        valor !== null &&
        valor !== "" &&
        Number.isFinite(Number(valor)) &&
        Number(valor) > 0
    );

}

// ===========================
// VALIDAR FECHA
// ===========================

function validarFecha(fecha) {

    if (!fecha) {
        return true;
    }

    if (typeof fecha !== "string") {
        return false;
    }

    // Formato YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
        return false;
    }

    const fechaObjeto = new Date(`${fecha}T00:00:00`);

    if (Number.isNaN(fechaObjeto.getTime())) {
        return false;
    }

    const [anio, mes, dia] = fecha.split("-").map(Number);

    return (
        fechaObjeto.getFullYear() === anio &&
        fechaObjeto.getMonth() + 1 === mes &&
        fechaObjeto.getDate() === dia
    );

}

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

    const id = req.params.id;

    if (!validarId(id)) {

        return res.status(400).json({
            exito: false,
            mensaje: "El ID del producto debe ser un número entero mayor que cero."
        });

    }

    Producto.obtenerPorId(id, (error, datos) => {

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

    // ===========================
    // VALIDAR NOMBRE
    // ===========================

    if (
        typeof producto.nombre !== "string" ||
        producto.nombre.trim() === ""
    ) {

        return res.status(400).json({
            exito: false,
            mensaje: "El nombre del producto es obligatorio."
        });

    }

    // ===========================
    // VALIDAR CÓDIGO DE BARRAS
    // ===========================

    if (
        typeof producto.codigoBarra !== "string" ||
        producto.codigoBarra.trim() === ""
    ) {

        return res.status(400).json({
            exito: false,
            mensaje: "El código de barras es obligatorio."
        });

    }

    const codigoBarra = producto.codigoBarra.trim();

    // ===========================
    // VALIDAR PRECIO DE VENTA
    // ===========================

    if (!validarPrecio(producto.precioVenta)) {

        return res.status(400).json({
            exito: false,
            mensaje: "El precio de venta debe ser un número mayor que cero."
        });

    }

    // ===========================
    // VALIDAR PRECIO DE COMPRA
    // ===========================

    if (!validarPrecio(producto.precioCompra)) {

        return res.status(400).json({
            exito: false,
            mensaje: "El precio de compra debe ser un número mayor que cero."
        });

    }

    // ===========================
    // VALIDAR CATEGORÍA
    // ===========================

    if (
        producto.categoria !== undefined &&
        producto.categoria !== null &&
        (
            typeof producto.categoria !== "string" ||
            producto.categoria.trim() === ""
        )
    ) {

        return res.status(400).json({
            exito: false,
            mensaje: "La categoría no puede estar vacía."
        });

    }

    // ===========================
    // VALIDAR UNIDAD DE MEDIDA
    // ===========================

    if (
        producto.unidadMedida !== undefined &&
        producto.unidadMedida !== null &&
        (
            typeof producto.unidadMedida !== "string" ||
            producto.unidadMedida.trim() === ""
        )
    ) {

        return res.status(400).json({
            exito: false,
            mensaje: "La unidad de medida no puede estar vacía."
        });

    }

    // ===========================
    // VALIDAR FECHA
    // ===========================

    if (!validarFecha(producto.fechaVencimiento)) {

        return res.status(400).json({
            exito: false,
            mensaje: "La fecha de vencimiento no es válida. Use el formato YYYY-MM-DD."
        });

    }

    // ===========================
    // BUSCAR CÓDIGO DUPLICADO
    // ===========================

    Producto.buscarPorCodigoBarra(
        codigoBarra,
        null,
        (error, resultados) => {

            if (error) {

                return res.status(500).json({
                    exito: false,
                    mensaje: "Error al verificar el código de barras.",
                    error: error.message
                });

            }

            if (resultados.length > 0) {

                return res.status(409).json({
                    exito: false,
                    mensaje: "El código de barras ya está registrado."
                });

            }

            // ===========================
            // PREPARAR DATOS
            // ===========================

            const datos = {

                nombre: producto.nombre.trim(),

                codigoBarra,

                precioVenta: Number(producto.precioVenta),

                precioCompra: Number(producto.precioCompra),

                categoria:
                    producto.categoria
                        ? producto.categoria.trim()
                        : null,

                unidadMedida:
                    producto.unidadMedida
                        ? producto.unidadMedida.trim()
                        : null,

                fechaVencimiento:
                    producto.fechaVencimiento || null

            };

            // ===========================
            // INSERTAR
            // ===========================

            Producto.insertar(
                datos,
                (error, resultado) => {

                    if (error) {

                        if (error.code === "ER_DUP_ENTRY") {

                            return res.status(409).json({
                                exito: false,
                                mensaje: "El código de barras ya está registrado."
                            });

                        }

                        return res.status(500).json({
                            exito: false,
                            mensaje: "Error al registrar el producto.",
                            error: error.message
                        });

                    }

                    return res.status(201).json({

                        exito: true,

                        mensaje:
                            "Producto registrado correctamente.",

                        id: resultado.insertId

                    });

                }
            );

        }
    );

};

// ===========================
// ACTUALIZAR PRODUCTO
// ===========================

exports.actualizar = (req, res) => {

    const id = req.params.id;

    // ===========================
    // VALIDAR ID
    // ===========================

    if (!validarId(id)) {

        return res.status(400).json({
            exito: false,
            mensaje: "El ID del producto debe ser un número entero mayor que cero."
        });

    }

    const producto = req.body;

    // ===========================
    // VALIDAR NOMBRE
    // ===========================

    if (
        typeof producto.nombre !== "string" ||
        producto.nombre.trim() === ""
    ) {

        return res.status(400).json({
            exito: false,
            mensaje: "El nombre del producto es obligatorio."
        });

    }

    // ===========================
    // VALIDAR CÓDIGO
    // ===========================

    if (
        typeof producto.codigoBarra !== "string" ||
        producto.codigoBarra.trim() === ""
    ) {

        return res.status(400).json({
            exito: false,
            mensaje: "El código de barras es obligatorio."
        });

    }

    const codigoBarra = producto.codigoBarra.trim();

    // ===========================
    // VALIDAR PRECIO VENTA
    // ===========================

    if (!validarPrecio(producto.precioVenta)) {

        return res.status(400).json({
            exito: false,
            mensaje: "El precio de venta debe ser un número mayor que cero."
        });

    }

    // ===========================
    // VALIDAR PRECIO COMPRA
    // ===========================

    if (!validarPrecio(producto.precioCompra)) {

        return res.status(400).json({
            exito: false,
            mensaje: "El precio de compra debe ser un número mayor que cero."
        });

    }

    // ===========================
    // VALIDAR CATEGORÍA
    // ===========================

    if (
        producto.categoria !== undefined &&
        producto.categoria !== null &&
        (
            typeof producto.categoria !== "string" ||
            producto.categoria.trim() === ""
        )
    ) {

        return res.status(400).json({
            exito: false,
            mensaje: "La categoría no puede estar vacía."
        });

    }

    // ===========================
    // VALIDAR UNIDAD
    // ===========================

    if (
        producto.unidadMedida !== undefined &&
        producto.unidadMedida !== null &&
        (
            typeof producto.unidadMedida !== "string" ||
            producto.unidadMedida.trim() === ""
        )
    ) {

        return res.status(400).json({
            exito: false,
            mensaje: "La unidad de medida no puede estar vacía."
        });

    }

    // ===========================
    // VALIDAR FECHA
    // ===========================

    if (!validarFecha(producto.fechaVencimiento)) {

        return res.status(400).json({
            exito: false,
            mensaje: "La fecha de vencimiento no es válida. Use el formato YYYY-MM-DD."
        });

    }

    // ===========================
    // COMPROBAR QUE EXISTE
    // ===========================

    Producto.obtenerPorId(id, (error, datos) => {

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

        // ===========================
        // BUSCAR CÓDIGO DUPLICADO
        // ===========================

        Producto.buscarPorCodigoBarra(
            codigoBarra,
            id,
            (error, resultados) => {

                if (error) {

                    return res.status(500).json({
                        exito: false,
                        mensaje: "Error al verificar el código de barras.",
                        error: error.message
                    });

                }

                if (resultados.length > 0) {

                    return res.status(409).json({
                        exito: false,
                        mensaje:
                            "El código de barras ya está registrado por otro producto."
                    });

                }

                // ===========================
                // PREPARAR DATOS
                // ===========================

                const datosProducto = {

                    nombre: producto.nombre.trim(),

                    codigoBarra,

                    precioVenta:
                        Number(producto.precioVenta),

                    precioCompra:
                        Number(producto.precioCompra),

                    categoria:
                        producto.categoria
                            ? producto.categoria.trim()
                            : null,

                    unidadMedida:
                        producto.unidadMedida
                            ? producto.unidadMedida.trim()
                            : null,

                    fechaVencimiento:
                        producto.fechaVencimiento || null

                };

                // ===========================
                // ACTUALIZAR
                // ===========================

                Producto.actualizar(
                    id,
                    datosProducto,
                    (error, resultado) => {

                        if (error) {

                            if (error.code === "ER_DUP_ENTRY") {

                                return res.status(409).json({
                                    exito: false,
                                    mensaje:
                                        "El código de barras ya está registrado por otro producto."
                                });

                            }

                            return res.status(500).json({
                                exito: false,
                                mensaje:
                                    "Error al actualizar el producto.",
                                error: error.message
                            });

                        }

                        return res.status(200).json({

                            exito: true,

                            mensaje:
                                "Producto actualizado correctamente."

                        });

                    }
                );

            }
        );

    });

};

// ===========================
// ELIMINAR PRODUCTO
// ===========================

exports.eliminar = (req, res) => {

    const id = req.params.id;

    // ===========================
    // VALIDAR ID
    // ===========================

    if (!validarId(id)) {

        return res.status(400).json({
            exito: false,
            mensaje: "El ID del producto debe ser un número entero mayor que cero."
        });

    }

    Producto.eliminar(id, (error, resultado) => {

        if (error) {

            if (error.code === "ER_ROW_IS_REFERENCED_2") {

                return res.status(400).json({

                    exito: false,

                    mensaje:
                        "No es posible eliminar este producto porque está asociado al inventario. Primero elimínelo del inventario."

                });

            }

            console.error(error);

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

            mensaje: "Producto eliminado correctamente."

        });

    });

};