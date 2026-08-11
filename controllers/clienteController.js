const Cliente = require("../models/Cliente");

// ==========================
// VALIDAR ID
// ==========================

function validarId(id) {

    return Number.isInteger(Number(id)) && Number(id) > 0;

}

// ==========================
// VALIDAR CORREO
// ==========================

function validarCorreo(correo) {

    const expresion =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return expresion.test(correo);

}

// ==========================
// VALIDAR TELÉFONO
// ==========================

function validarTelefono(telefono) {

    return /^\d{7,15}$/.test(telefono);

}

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

    const id = req.params.id;

    if (!validarId(id)) {

        return res.status(400).json({
            exito: false,
            mensaje: "El ID del cliente debe ser un número entero mayor que cero."
        });

    }

    Cliente.obtenerPorId(id, (error, datos) => {

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

    // ==========================
    // Validar nombre
    // ==========================

    if (
        typeof cliente.nombre !== "string" ||
        cliente.nombre.trim() === ""
    ) {

        return res.status(400).json({
            exito: false,
            mensaje: "El nombre es obligatorio."
        });

    }

    // ==========================
    // Validar teléfono
    // ==========================

    if (
        typeof cliente.telefono !== "string" ||
        cliente.telefono.trim() === ""
    ) {

        return res.status(400).json({
            exito: false,
            mensaje: "El teléfono es obligatorio."
        });

    }

    const telefono = cliente.telefono.trim();

    if (!validarTelefono(telefono)) {

        return res.status(400).json({
            exito: false,
            mensaje: "El teléfono debe contener entre 7 y 15 dígitos."
        });

    }

    // ==========================
    // Validar correo
    // ==========================

    if (
        typeof cliente.correo !== "string" ||
        cliente.correo.trim() === ""
    ) {

        return res.status(400).json({
            exito: false,
            mensaje: "El correo es obligatorio."
        });

    }

    const correo = cliente.correo.trim().toLowerCase();

    if (!validarCorreo(correo)) {

        return res.status(400).json({
            exito: false,
            mensaje: "El correo electrónico no tiene un formato válido."
        });

    }

    // ==========================
    // Buscar correo duplicado
    // ==========================

    Cliente.buscarPorCorreo(
        correo,
        null,
        (error, resultados) => {

            if (error) {

                return res.status(500).json({
                    exito: false,
                    mensaje: "Error al verificar el correo.",
                    error: error.message
                });

            }

            if (resultados.length > 0) {

                return res.status(409).json({
                    exito: false,
                    mensaje: "El correo electrónico ya está registrado."
                });

            }

            // ==========================
            // Preparar datos
            // ==========================

            const datos = {

                nombre: cliente.nombre.trim(),

                telefono,

                correo

            };

            // ==========================
            // Insertar cliente
            // ==========================

            Cliente.insertar(
                datos,
                (error, resultado) => {

                    if (error) {

                        // Error de restricción UNIQUE
                        if (error.code === "ER_DUP_ENTRY") {

                            return res.status(409).json({
                                exito: false,
                                mensaje: "El correo electrónico ya está registrado."
                            });

                        }

                        return res.status(500).json({
                            exito: false,
                            mensaje: "Error al registrar el cliente.",
                            error: error.message
                        });

                    }

                    return res.status(201).json({

                        exito: true,

                        mensaje:
                            "Cliente registrado correctamente.",

                        id: resultado.insertId

                    });

                }
            );

        }
    );

};

// ==========================
// ACTUALIZAR CLIENTE
// ==========================

exports.actualizar = (req, res) => {

    const id = req.params.id;

    // ==========================
    // Validar ID
    // ==========================

    if (!validarId(id)) {

        return res.status(400).json({
            exito: false,
            mensaje: "El ID del cliente debe ser un número entero mayor que cero."
        });

    }

    const cliente = req.body;

    // ==========================
    // Validar nombre
    // ==========================

    if (
        typeof cliente.nombre !== "string" ||
        cliente.nombre.trim() === ""
    ) {

        return res.status(400).json({
            exito: false,
            mensaje: "El nombre es obligatorio."
        });

    }

    // ==========================
    // Validar teléfono
    // ==========================

    if (
        typeof cliente.telefono !== "string" ||
        cliente.telefono.trim() === ""
    ) {

        return res.status(400).json({
            exito: false,
            mensaje: "El teléfono es obligatorio."
        });

    }

    const telefono = cliente.telefono.trim();

    if (!validarTelefono(telefono)) {

        return res.status(400).json({
            exito: false,
            mensaje: "El teléfono debe contener entre 7 y 15 dígitos."
        });

    }

    // ==========================
    // Validar correo
    // ==========================

    if (
        typeof cliente.correo !== "string" ||
        cliente.correo.trim() === ""
    ) {

        return res.status(400).json({
            exito: false,
            mensaje: "El correo es obligatorio."
        });

    }

    const correo = cliente.correo.trim().toLowerCase();

    if (!validarCorreo(correo)) {

        return res.status(400).json({
            exito: false,
            mensaje: "El correo electrónico no tiene un formato válido."
        });

    }

    // ==========================
    // Verificar que exista
    // ==========================

    Cliente.obtenerPorId(id, (error, datos) => {

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

        // ==========================
        // Verificar correo duplicado
        // ==========================

        Cliente.buscarPorCorreo(
            correo,
            id,
            (error, resultados) => {

                if (error) {

                    return res.status(500).json({
                        exito: false,
                        mensaje: "Error al verificar el correo.",
                        error: error.message
                    });

                }

                if (resultados.length > 0) {

                    return res.status(409).json({
                        exito: false,
                        mensaje: "El correo electrónico ya está registrado por otro cliente."
                    });

                }

                // ==========================
                // Actualizar
                // ==========================

                const datosCliente = {

                    nombre: cliente.nombre.trim(),

                    telefono,

                    correo

                };

                Cliente.actualizar(
                    id,
                    datosCliente,
                    (error, resultado) => {

                        if (error) {

                            if (error.code === "ER_DUP_ENTRY") {

                                return res.status(409).json({
                                    exito: false,
                                    mensaje: "El correo electrónico ya está registrado por otro cliente."
                                });

                            }

                            return res.status(500).json({
                                exito: false,
                                mensaje: "Error al actualizar el cliente.",
                                error: error.message
                            });

                        }

                        return res.status(200).json({

                            exito: true,

                            mensaje:
                                "Cliente actualizado correctamente."

                        });

                    }
                );

            }
        );

    });

};

// ==========================
// ELIMINAR CLIENTE
// ==========================

exports.eliminar = (req, res) => {

    const id = req.params.id;

    // ==========================
    // Validar ID
    // ==========================

    if (!validarId(id)) {

        return res.status(400).json({
            exito: false,
            mensaje: "El ID del cliente debe ser un número entero mayor que cero."
        });

    }

    Cliente.eliminar(id, (error, resultado) => {

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