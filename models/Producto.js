// ===========================
// IMPORTAR CONEXIÓN A LA BASE DE DATOS
// ===========================

const conexion = require("../config/database");

// ===========================
// MODELO PRODUCTO
// ===========================

const Producto = {

    // ===========================
    // OBTENER TODOS LOS PRODUCTOS
    // ===========================
    obtenerTodos(callback) {

        const sql = "SELECT * FROM producto";

        conexion.query(sql, callback);

    },

    // ===========================
    // OBTENER PRODUCTO POR ID
    // ===========================
    obtenerPorId(id, callback) {

        const sql = "SELECT * FROM producto WHERE idProducto = ?";

        conexion.query(sql, [id], callback);

    },

    // ===========================
    // INSERTAR PRODUCTO
    // Y CREAR AUTOMÁTICAMENTE
    // SU REGISTRO EN INVENTARIO
    // ===========================
    insertar(datos, callback) {

        const sql = `
            INSERT INTO producto
            (
                nombre,
                codigoBarra,
                precioVenta,
                precioCompra,
                categoria,
                unidadMedida,
                fechaVencimiento
            )
            VALUES (?,?,?,?,?,?,?)
        `;

        conexion.query(

            sql,

            [
                datos.nombre,
                datos.codigoBarra,
                datos.precioVenta,
                datos.precioCompra,
                datos.categoria,
                datos.unidadMedida,
                datos.fechaVencimiento === "" ? null : datos.fechaVencimiento
            ],

            (error, resultado) => {

                if (error) {

                    return callback(error);

                }

                // Obtener el ID del producto recién creado
                const idProducto = resultado.insertId;

                // Crear automáticamente el registro en inventario
                const sqlInventario = `
                    INSERT INTO inventario
                    (
                        idProducto,
                        ubicacion,
                        stockActual,
                        stockMinimo,
                        fechaUltimaActualizacion
                    )
                    VALUES
                    (
                        ?, ?, ?, ?, NOW()
                    )
                `;

                conexion.query(

                    sqlInventario,

                    [
                        idProducto,
                        "Pendiente",
                        0,
                        0
                    ],

                    (errorInventario) => {

                        if (errorInventario) {

                            return callback(errorInventario);

                        }

                        callback(null, resultado);

                    }

                );

            }

        );

    },

    // ===========================
    // ACTUALIZAR PRODUCTO
    // ===========================
    actualizar(id, datos, callback) {

        // Si no se envía fecha de vencimiento,
        // conserva la que ya existe.

        if (!datos.fechaVencimiento) {

            const sql = `
                UPDATE producto
                SET
                    nombre = ?,
                    codigoBarra = ?,
                    precioVenta = ?,
                    precioCompra = ?,
                    categoria = ?,
                    unidadMedida = ?
                WHERE idProducto = ?
            `;

            conexion.query(

                sql,

                [
                    datos.nombre,
                    datos.codigoBarra,
                    datos.precioVenta,
                    datos.precioCompra,
                    datos.categoria,
                    datos.unidadMedida,
                    id
                ],

                callback

            );

        } else {

            const sql = `
                UPDATE producto
                SET
                    nombre = ?,
                    codigoBarra = ?,
                    precioVenta = ?,
                    precioCompra = ?,
                    categoria = ?,
                    unidadMedida = ?,
                    fechaVencimiento = ?
                WHERE idProducto = ?
            `;

            conexion.query(

                sql,

                [
                    datos.nombre,
                    datos.codigoBarra,
                    datos.precioVenta,
                    datos.precioCompra,
                    datos.categoria,
                    datos.unidadMedida,
                    datos.fechaVencimiento,
                    id
                ],

                callback

            );

        }

    },

    // ===========================
    // ELIMINAR PRODUCTO
    // ===========================
    eliminar(id, callback) {

        conexion.query(

            "DELETE FROM producto WHERE idProducto = ?",

            [id],

            callback

        );

    }

};

// ===========================
// EXPORTAR MODELO
// ===========================

module.exports = Producto;