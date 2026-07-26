const db = require("../config/database");

exports.estadisticas = (req, res) => {

    const datos = {};

    db.query("SELECT COUNT(*) total FROM producto", (err, productos) => {

        if (err) return res.status(500).json(err);

        datos.productos = productos[0].total;

        db.query("SELECT COUNT(*) total FROM cliente", (err, clientes) => {

            if (err) return res.status(500).json(err);

            datos.clientes = clientes[0].total;

            db.query("SELECT COUNT(*) total FROM empleado", (err, empleados) => {

                if (err) return res.status(500).json(err);

                datos.empleados = empleados[0].total;

                db.query("SELECT COUNT(*) total FROM inventario", (err, inventario) => {

                    if (err) return res.status(500).json(err);

                    datos.inventario = inventario[0].total;

                    res.json(datos);

                });

            });

        });

    });

};