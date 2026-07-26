const db = require("../config/database");

class Inventario {

    static obtenerTodos(callback){

        const sql = `
            SELECT
                i.idInventario,
                i.idProducto,
                p.nombre,
                i.ubicacion,
                i.stockActual,
                i.stockMinimo,
                i.fechaUltimaActualizacion
            FROM inventario i
            INNER JOIN producto p
                ON i.idProducto = p.idProducto
        `;

        db.query(sql, callback);

    }

    static obtenerPorId(id, callback){

        const sql = `
            SELECT
                i.idInventario,
                i.idProducto,
                p.nombre,
                i.ubicacion,
                i.stockActual,
                i.stockMinimo,
                i.fechaUltimaActualizacion
            FROM inventario i
            INNER JOIN producto p
                ON i.idProducto = p.idProducto
            WHERE i.idInventario = ?
        `;

        db.query(sql, [id], callback);

    }

    static insertar(datos, callback){

        db.query(

            `INSERT INTO inventario
            (idProducto,ubicacion,stockActual,stockMinimo,fechaUltimaActualizacion)
            VALUES (?,?,?,?,NOW())`,

            [
                datos.idProducto,
                datos.ubicacion,
                datos.stockActual,
                datos.stockMinimo
            ],

            callback

        );

    }

    static actualizar(id, datos, callback){

        db.query(

            `UPDATE inventario SET

            idProducto=?,

            ubicacion=?,

            stockActual=?,

            stockMinimo=?,

            fechaUltimaActualizacion=NOW()

            WHERE idInventario=?`,

            [

                datos.idProducto,

                datos.ubicacion,

                datos.stockActual,

                datos.stockMinimo,

                id

            ],

            callback

        );

    }

    static eliminar(id, callback){

        db.query(

            "DELETE FROM inventario WHERE idInventario=?",

            [id],

            callback

        );

    }

}

module.exports = Inventario;