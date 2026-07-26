const db = require("../config/database");

class Empleado {

    static obtenerTodos(callback){
        db.query("SELECT * FROM empleado", callback);
    }

    static obtenerPorId(id, callback){
        db.query(
            "SELECT * FROM empleado WHERE idEmpleado=?",
            [id],
            callback
        );
    }

    static insertar(datos, callback){

        db.query(
            `INSERT INTO empleado
            (nombre, rol, usuario, password)
            VALUES (?,?,?,?)`,
            [
                datos.nombre,
                datos.rol,
                datos.usuario,
                datos.password
            ],
            callback
        );

    }

    static actualizar(id, datos, callback){

        db.query(
            `UPDATE empleado SET
            nombre=?,
            rol=?,
            usuario=?,
            password=?
            WHERE idEmpleado=?`,
            [
                datos.nombre,
                datos.rol,
                datos.usuario,
                datos.password,
                id
            ],
            callback
        );

    }

    static eliminar(id, callback){

        db.query(
            "DELETE FROM empleado WHERE idEmpleado=?",
            [id],
            callback
        );

    }

}

module.exports = Empleado;