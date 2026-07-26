const conexion = require("../config/database");

const Cliente = {

    obtenerTodos(callback){

        conexion.query(
            "SELECT * FROM cliente",
            callback
        );

    },

    obtenerPorId(id,callback){

        conexion.query(
            "SELECT * FROM cliente WHERE idCliente=?",
            [id],
            callback
        );

    },

    insertar(datos,callback){

        const sql=`
            INSERT INTO cliente
            (nombre,telefono,puntosAcumulados)
            VALUES(?,?,?)
        `;

        conexion.query(sql,[
            datos.nombre,
            datos.telefono,
            0
        ],callback);

    },

    actualizar(id,datos,callback){

        const sql=`
            UPDATE cliente
            SET
                nombre=?,
                telefono=?,
                puntosAcumulados=?
            WHERE idCliente=?
        `;

        conexion.query(sql,[
            datos.nombre,
            datos.telefono,
            datos.puntosAcumulados,
            id
        ],callback);

    },

    eliminar(id,callback){

        conexion.query(
            "DELETE FROM cliente WHERE idCliente=?",
            [id],
            callback
        );

    }

};

module.exports = Cliente;