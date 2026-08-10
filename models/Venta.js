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

            `
            SELECT
                idProducto,
                nombre,
                precioVenta
            FROM producto
            ORDER BY nombre
            `,

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

    }

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

    }

    // ===============================
    // Registrar venta completa
    // ===============================

    static async registrarVentaCompleta(datos) {

        const conexion = db.promise();

        try {

            // ===============================
            // Iniciar transacción
            // ===============================

            await conexion.beginTransaction();

            // ==========================================
            // Preparar detalles con precios reales
            // ==========================================

            const detallesCalculados = [];

            let totalCalculado = 0;

            for (const detalle of datos.detalles) {

                // ==========================================
                // Consultar producto y bloquear registro
                // ==========================================

                const [productos] = await conexion.query(

                    `
                    SELECT
                        idProducto,
                        precioVenta
                    FROM producto
                    WHERE idProducto = ?
                    FOR UPDATE
                    `,

                    [detalle.idProducto]

                );

                if (productos.length === 0) {

                    throw new Error(
                        `Producto ${detalle.idProducto} no encontrado.`
                    );

                }

                const precioReal = Number(
                    productos[0].precioVenta
                );

                const cantidad = Number(
                    detalle.cantidad
                );

                // ==========================================
                // Calcular subtotal con precio real
                // ==========================================

                const subtotalReal =
                    cantidad * precioReal;

                // ==========================================
                // Verificar stock y bloquear inventario
                // ==========================================

                const [inventario] = await conexion.query(

                    `
                    SELECT stockActual
                    FROM inventario
                    WHERE idProducto = ?
                    FOR UPDATE
                    `,

                    [detalle.idProducto]

                );

                if (inventario.length === 0) {

                    throw new Error(
                        `Producto ${detalle.idProducto} no encontrado en inventario.`
                    );

                }

                if (
                    Number(inventario[0].stockActual) <
                    cantidad
                ) {

                    throw new Error(
                        `Stock insuficiente para el producto ${detalle.idProducto}.`
                    );

                }

                // ==========================================
                // Guardar detalle calculado
                // ==========================================

                detallesCalculados.push({

                    idProducto: detalle.idProducto,

                    cantidad: cantidad,

                    precioUnitario: precioReal,

                    subtotal: subtotalReal

                });

                totalCalculado += subtotalReal;

            }

            // ==========================================
            // Registrar venta con total real
            // ==========================================

            const [resultadoVenta] = await conexion.query(

                `
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
                `,

                [
                    totalCalculado,
                    datos.metodoPago,
                    datos.estado,
                    datos.idEmpleado,
                    datos.idCliente
                ]

            );

            const idVenta =
                resultadoVenta.insertId;

            // ==========================================
            // Registrar detalles y descontar inventario
            // ==========================================

            for (const detalle of detallesCalculados) {

                await conexion.query(

                    `
                    INSERT INTO detalleventa
                    (
                        idVenta,
                        idProducto,
                        cantidad,
                        precioUnitario,
                        subtotal
                    )
                    VALUES (?, ?, ?, ?, ?)
                    `,

                    [
                        idVenta,
                        detalle.idProducto,
                        detalle.cantidad,
                        detalle.precioUnitario,
                        detalle.subtotal
                    ]

                );

                await conexion.query(

                    `
                    UPDATE inventario
                    SET
                        stockActual = stockActual - ?,
                        fechaUltimaActualizacion = NOW()
                    WHERE idProducto = ?
                    `,

                    [
                        detalle.cantidad,
                        detalle.idProducto
                    ]

                );

            }

            // ==========================================
            // Actualizar puntos
            // ==========================================

            const puntos =
                Math.floor(totalCalculado / 1000);

            await conexion.query(

                `
                UPDATE cliente
                SET puntosAcumulados =
                    puntosAcumulados + ?
                WHERE idCliente = ?
                `,

                [
                    puntos,
                    datos.idCliente
                ]

            );

            // ==========================================
            // Confirmar transacción
            // ==========================================

            await conexion.commit();

            return {

                idVenta,

                puntosGanados: puntos,

                totalCalculado

            };

        } catch (error) {

            // ==========================================
            // Revertir transacción
            // ==========================================

            await conexion.rollback();

            throw error;

        }

    }

}

module.exports = Venta;