const jwt = require('jsonwebtoken');

// ==============================
// verificaciones con middlewares
// ==============================

let verifica = (req, res, next) => {


    let token = req.get('token');

    jwt.verify(token, process.env.TOKEN_SEED, (err, decoded) => {


        if (err) {
            return res.status(401).json({
                ok: false,
                err: 'Token no válido'
            })
        }
        req.usuario = decoded.usuario;
        next();
    });
};

let verificaAdmin_Role = (req, res, next) => {
        let usuario = req.usuario;

        if(req.usuario.role === 'ADMIN_ROLE'){
            next();
        }else {
            return res.status(401).json({
                ok: false,
                err: 'El usuario no es administrador'
            })
        }
};

module.exports = {
    verifica,
    verificaAdmin_Role
}