// ===========================
// IMPORTAR CONEXIÓN
// ===========================

const db = require("../config/database");

// ===========================
// OBTENER TODOS
// ===========================

exports.obtenerTodos = (callback) => {

    const sql = `

        SELECT

            dv.idDetalle,

            v.idVenta,

            v.fechaHora,

            c.nombre AS cliente,

            e.nombre AS empleado,

            p.nombre AS producto,

            dv.cantidad,

            dv.precioUnitario,

            dv.subtotal,

            v.totalPagar

        FROM detalleventa dv

        INNER JOIN venta v
            ON dv.idVenta = v.idVenta

        INNER JOIN cliente c
            ON v.idCliente = c.idCliente

        INNER JOIN empleado e
            ON v.idEmpleado = e.idEmpleado

        INNER JOIN producto p
            ON dv.idProducto = p.idProducto

        ORDER BY v.idVenta DESC, dv.idDetalle ASC

    `;

    db.query(sql, callback);

};

// ===========================
// OBTENER POR ID
// ===========================

exports.obtenerPorId = (id, callback) => {

    const sql = `

        SELECT

            dv.idDetalle,

            v.idVenta,

            v.fechaHora,

            c.nombre AS cliente,

            e.nombre AS empleado,

            p.nombre AS producto,

            dv.cantidad,

            dv.precioUnitario,

            dv.subtotal,

            v.totalPagar

        FROM detalleventa dv

        INNER JOIN venta v
            ON dv.idVenta = v.idVenta

        INNER JOIN cliente c
            ON v.idCliente = c.idCliente

        INNER JOIN empleado e
            ON v.idEmpleado = e.idEmpleado

        INNER JOIN producto p
            ON dv.idProducto = p.idProducto

        WHERE dv.idDetalle = ?

    `;

    db.query(sql, [id], callback);

};