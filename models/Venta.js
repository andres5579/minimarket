const db = require("../config/database");

class Venta {

    // ===============================
    // Obtener clientes
    // ===============================

    static obtenerClientes(callback) {

        db.query(
            "SELECT idCliente, nombre FROM cliente ORDER BY nombre",
            callback
        );

    }

    // ===============================
    // Obtener empleados
    // ===============================

    static obtenerEmpleados(callback) {

        db.query(
            "SELECT idEmpleado, nombre FROM empleado ORDER BY nombre",
            callback
        );

    }

    // ===============================
    // Obtener productos
    // ===============================

    static obtenerProductos(callback) {

        db.query(

            `SELECT
                idProducto,
                nombre,
                precioVenta
            FROM producto
            ORDER BY nombre`,

            callback

        );

    }

    // ===============================
    // Registrar venta
    // ===============================

    static registrarVenta(datos, callback) {

        const sql = `
            INSERT INTO venta
            (
                fechaHora,
                totalPagar,
                metodoPago,
                estado,
                idEmpleado,
                idCliente
            )
            VALUES
            (
                NOW(),
                ?,
                ?,
                ?,
                ?,
                ?
            )
        `;

        db.query(

            sql,

            [

                datos.totalPagar,
                datos.metodoPago,
                datos.estado,
                datos.idEmpleado,
                datos.idCliente

            ],

            callback

        );

    }

    // ===============================
    // Registrar detalle
    // ===============================

    static registrarDetalle(datos, callback) {

        const sql = `
            INSERT INTO detalleventa
            (
                idVenta,
                idProducto,
                cantidad,
                precioUnitario,
                subtotal
            )
            VALUES (?,?,?,?,?)
        `;

        db.query(

            sql,

            [

                datos.idVenta,
                datos.idProducto,
                datos.cantidad,
                datos.precioUnitario,
                datos.subtotal

            ],

            callback

        );

    }

    // ===============================
    // Descontar inventario
    // ===============================

    static actualizarInventario(idProducto, cantidad, callback) {

        db.query(

            `
            UPDATE inventario
            SET
                stockActual = stockActual - ?,
                fechaUltimaActualizacion = NOW()
            WHERE idProducto = ?
            `,

            [

                cantidad,
                idProducto

            ],

            callback

        );

    }

    // ===============================
    // Consultar stock
    // ===============================

    static consultarStock(idProducto, callback) {

        db.query(

            `
            SELECT stockActual
            FROM inventario
            WHERE idProducto = ?
            `,

            [idProducto],

            callback

        );

    }

    // ===============================
    // Actualizar puntos
    // ===============================

    static actualizarPuntos(idCliente, puntos, callback) {

        db.query(

            `
            UPDATE cliente
            SET puntosAcumulados = puntosAcumulados + ?
            WHERE idCliente = ?
            `,

            [

                puntos,
                idCliente

            ],

            callback

        );

    }

    // ===============================
// Listar ventas
// ===============================

static obtenerVentas(callback) {

    const sql = `
        SELECT

            v.idVenta,
            v.fechaHora,
            c.nombre AS cliente,
            e.nombre AS empleado,
            v.metodoPago,
            v.totalPagar,
            v.estado

        FROM venta v

        INNER JOIN cliente c
            ON v.idCliente = c.idCliente

        INNER JOIN empleado e
            ON v.idEmpleado = e.idEmpleado

        ORDER BY v.idVenta DESC
    `;

    db.query(sql, callback);

};

// ===============================
// Obtener detalle de una venta
// ===============================

static obtenerDetalle(idVenta, callback) {

    const sql = `
        SELECT

            dv.idDetalle,
            p.nombre,
            dv.cantidad,
            dv.precioUnitario,
            dv.subtotal

        FROM detalleventa dv

        INNER JOIN producto p
            ON dv.idProducto = p.idProducto

        WHERE dv.idVenta = ?
    `;

    db.query(sql, [idVenta], callback);

};

}



module.exports = Venta;