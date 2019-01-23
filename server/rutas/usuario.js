const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../modelos/usuario');
const { verifica, verificaAdmin_Role} = require('../middlewares/auth')
const app = express();

app.get('/usuario', verifica ,(req, res)  =>{

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let hasta = req.query.hasta || 5;
    hasta = Number(hasta);

    Usuario.find({ status: true }, 'name email img status role google')
        .skip(desde)
        .limit(hasta)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: err
                });
            }

            Usuario.count({status: true}, (err, cuenta) => {
                res.json({
                    ok: true,
                    usuarios: usuarios,
                    cuenta: cuenta
                })
            })

        })
});

app.post('/usuario', [verifica, verificaAdmin_Role] ,(req, res)  =>{

    let body = req.body;

    let usuario = new Usuario({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
        img: body.img,
        status: body.status,
        google: body.google
    })

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.put('/usuario/:id', [verifica, verificaAdmin_Role] ,(req, res)  =>{

    let id = req.params.id

    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })

});

app.delete('/usuario/:id', [verifica, verificaAdmin_Role] ,(req, res)  =>{

    let id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, deleted) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        };

        if (!deleted) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            usuario: deleted
        })
    })
});

app.delete('/usuario-blocked/:id', [verifica, verificaAdmin_Role] ,(req, res)  =>{

    let id = req.params.id;

    let body = _.pick(req.body, ['estado']);

    let cambio = {
        status: false
    };

    Usuario.findByIdAndUpdate(id, cambio, { new: true }, (err, userBlocked) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }

        res.json({
            ok: true,
            usuario: userBlocked
        })
    })

});

module.exports = app;