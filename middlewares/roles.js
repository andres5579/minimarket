module.exports = (...rolesPermitidos) => {

    return (req, res, next) => {

        if (!req.session.usuario) {
            return res.redirect("/");
        }

        const rolUsuario = req.session.usuario.rol.trim().toLowerCase();

        const roles = rolesPermitidos.map(rol =>
            rol.trim().toLowerCase()
        );

        if (!roles.includes(rolUsuario)) {
            return res.status(403).send("Acceso denegado");
        }

        next();

    };

};