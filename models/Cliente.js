const conexion = require("../config/database");

const Cliente = {

    // ==========================
    // LISTAR CLIENTES
    // ==========================

    obtenerTodos(callback) {

        conexion.query(
            `
            SELECT
                idCliente,
                nombre,
                telefono,
                correo,
                puntosAcumulados
            FROM cliente
            ORDER BY idCliente ASC
            `,
            callback
        );

    },

    // ==========================
    // BUSCAR CLIENTE POR ID
    // ==========================

    obtenerPorId(id, callback) {

        conexion.query(
            `
            SELECT
                idCliente,
                nombre,
                telefono,
                correo,
                puntosAcumulados
            FROM cliente
            WHERE idCliente = ?
            `,
            [id],
            callback
        );

    },

    // ==========================
    // BUSCAR CORREO DUPLICADO
    // ==========================

    buscarPorCorreo(correo, idExcluir, callback) {

        let sql = `
            SELECT
                idCliente,
                correo
            FROM cliente
            WHERE correo = ?
        `;

        const parametros = [correo];

        // En una actualización excluimos
        // al propio cliente.

        if (idExcluir) {

            sql += `
                AND idCliente <> ?
            `;

            parametros.push(idExcluir);

        }

        conexion.query(
            sql,
            parametros,
            callback
        );

    },

    // ==========================
    // INSERTAR CLIENTE
    // ==========================

    insertar(datos, callback) {

        const sql = `
            INSERT INTO cliente
            (
                nombre,
                telefono,
                correo,
                puntosAcumulados
            )
            VALUES (?, ?, ?, ?)
        `;

        conexion.query(

            sql,

            [
                datos.nombre,
                datos.telefono,
                datos.correo,
                0
            ],

            callback

        );

    },

    // ==========================
    // ACTUALIZAR CLIENTE
    // ==========================

    actualizar(id, datos, callback) {

        const sql = `
            UPDATE cliente
            SET
                nombre = ?,
                telefono = ?,
                correo = ?
            WHERE idCliente = ?
        `;

        conexion.query(

            sql,

            [
                datos.nombre,
                datos.telefono,
                datos.correo,
                id
            ],

            callback

        );

    },

    // ==========================
    // ELIMINAR CLIENTE
    // ==========================

    eliminar(id, callback) {

        conexion.query(

            `
            DELETE FROM cliente
            WHERE idCliente = ?
            `,

            [id],

            callback

        );

    }

};

module.exports = Cliente;