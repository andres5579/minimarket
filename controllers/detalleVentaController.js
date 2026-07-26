// ===========================
// IMPORTAR MODELO
// ===========================

const DetalleVenta = require("../models/DetalleVenta");

// ===========================
// LISTAR DETALLES
// ===========================

exports.obtenerTodos = (req,res)=>{

    DetalleVenta.obtenerTodos((err,datos)=>{

        if(err){

            return res.status(500).json(err);

        }

        res.json(datos);

    });

};

// ===========================
// BUSCAR POR ID
// ===========================

exports.obtenerPorId=(req,res)=>{

    DetalleVenta.obtenerPorId(req.params.id,(err,datos)=>{

        if(err){

            return res.status(500).json(err);

        }

        res.json(datos[0]);

    });

};