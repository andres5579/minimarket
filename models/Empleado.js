const db = require("../config/database");
const bcrypt = require("bcrypt");

const Empleado = {

    // ==========================
    // LOGIN
    // ==========================
    login(usuario, password, callback) {

        const sql = `
            SELECT *
            FROM empleado
            WHERE usuario = ?
        `;

        db.query(sql, [usuario], async (err, resultados) => {

            if (err) return callback(err);

            if (resultados.length === 0) {
                return callback(null, []);
            }

            const empleado = resultados[0];

            const coincide = await bcrypt.compare(
                password,
                empleado.password
            );

            if (!coincide) {
                return callback(null, []);
            }

            callback(null, [empleado]);

        });

    },

    // ==========================
    // LISTAR
    // ==========================
    obtenerTodos(callback) {

        const sql = `
            SELECT
                idEmpleado,
                nombre,
                rol,
                usuario
            FROM empleado
            ORDER BY idEmpleado ASC
        `;

        db.query(sql, callback);

    },

    // ==========================
    // BUSCAR POR ID
    // ==========================
    obtenerPorId(id, callback) {

        const sql = `
            SELECT
                idEmpleado,
                nombre,
                rol,
                usuario
            FROM empleado
            WHERE idEmpleado = ?
        `;

        db.query(sql, [id], callback);

    },

    // ==========================
    // INSERTAR
    // ==========================
    insertar(empleado, callback) {

        const sql = `
            INSERT INTO empleado
            (
                nombre,
                rol,
                usuario,
                password
            )
            VALUES (?, ?, ?, ?)
        `;

        db.query(sql, [

            empleado.nombre,
            empleado.rol,
            empleado.usuario,
            empleado.password

        ], callback);

    },

    // ==========================
    // ACTUALIZAR
    // ==========================
    actualizar(id, empleado, callback) {

        const sql = `
            UPDATE empleado
            SET
                nombre=?,
                rol=?,
                usuario=?,
                password=?
            WHERE idEmpleado=?
        `;

        db.query(sql, [

            empleado.nombre,
            empleado.rol,
            empleado.usuario,
            empleado.password,
            id

        ], callback);

    },

    // ==========================
    // ELIMINAR
    // ==========================
    eliminar(id, callback) {

        const sql = `
            DELETE FROM empleado
            WHERE idEmpleado=?
        `;

        db.query(sql, [id], callback);

    }

};

module.exports = Empleado;