const db = require("../config/database");

const Usuario = {

    login(usuario, contraseña, callback) {

        const sql = `
            SELECT *
            FROM usuario
            WHERE usuario = ? AND contraseña = ?
        `;

        db.query(sql, [usuario, contraseña], callback);

    }

};

module.exports = Usuario;