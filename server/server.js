require("./config/config.js");

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// habilitar carpeta public
app.use(express.static(path.resolve(__dirname , '../public' )))


app.use(require('./rutas/index'));


mongoose.connect(process.env.URLDB, (err, res) => {
    if(err){
        throw err;
    }else{
        console.log('bdd online');
    }
})

app.listen(port, () => {
    console.log(`escuchando el puerto ${port}`)
});