const Usuario = require("../models/Usuario");

exports.login = (req, res) => {

    const { usuario, contraseña } = req.body;

    if (!usuario || !contraseña) {

        return res.status(400).json({
            exito: false,
            mensaje: "Debe ingresar usuario y contraseña"
        });

    }

    Usuario.login(usuario, contraseña, (err, resultados) => {

        if (err) {

            return res.status(500).json({
                exito: false,
                mensaje: "Error del servidor"
            });

        }

        if (resultados.length === 0) {

            return res.status(401).json({
                exito: false,
                mensaje: "Usuario o contraseña incorrectos"
            });

        }

        req.session.usuario = resultados[0];

        res.json({
            exito: true,
            mensaje: "Bienvenido",
            usuario: resultados[0].nombre,
            redirect: "/dashboard"
        });

    });

};

exports.logout = (req, res) => {

    req.session.destroy(() => {

        res.redirect("/");

    });

};

exports.usuarioActual = (req, res) => {

    if (req.session.usuario) {

        res.json(req.session.usuario);

    } else {

        res.status(401).json({
            mensaje: "No autenticado"
        });

    }

};