const conexion = require("../config/database");

const Producto = {

    obtenerTodos(callback) {
        const sql = "SELECT * FROM producto";
        conexion.query(sql, callback);
    },

    obtenerPorId(id, callback) {
        const sql = "SELECT * FROM producto WHERE idProducto = ?";
        conexion.query(sql, [id], callback);
    },

    insertar(datos, callback) {

        const sql = `
        INSERT INTO producto
        (nombre,codigoBarra,precioVenta,precioCompra,categoria,unidadMedida,fechaVencimiento)
        VALUES (?,?,?,?,?,?,?)
        `;

        conexion.query(sql, [
            datos.nombre,
            datos.codigoBarra,
            datos.precioVenta,
            datos.precioCompra,
            datos.categoria,
            datos.unidadMedida,
            datos.fechaVencimiento === "" ? null : datos.fechaVencimiento
        ], callback);

    },

    actualizar(id, datos, callback) {

        // Si la fecha viene vacía, no la actualiza
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

    eliminar(id, callback) {

        conexion.query(
            "DELETE FROM producto WHERE idProducto=?",
            [id],
            callback
        );

    }

};

module.exports = Producto;