const express = require('express');
const bcrypt = require('bcrypt');

// libreria de autenticacion con token
const jwt = require('jsonwebtoken');

// constantes de google
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require('../modelos/usuario');
const app = express();

app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            })
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'usuario incorrecto'
                }
            })
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'contraseña incorrecto'
                }
            })
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.TOKEN_SEED ,{expiresIn: process.env.TOKEN_EXPIRES})

        res.json({
            ok: true,
            usuario: usuarioDB,
            token: token
        })
    })
})

// configuaracion de google

async function verify( token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    console.log(payload)
  }
  verify().catch(console.error);

app.post('/google', (req, res) => {

    let token =  req.body.idtoken;

    verify(token);

    res.json({
        token
    })
});


module.exports = app;