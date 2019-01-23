const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let roles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message:'{VALUE} no es un rol valido'
}

let  Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    name:{
        type: String,
        required: [true,'El nombre es obligatorio']
    },
    email:{
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true

    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        required: true,
        default: "USER_ROLE",
        anum: roles
    },
    status: {
        type: Boolean,
        default: true
    },
    google:{
        type: Boolean,
        default: false
    }   
});

usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
} 

usuarioSchema.plugin( uniqueValidator, {
    message:  '{PATH} debe ser unico'
});
module.exports = mongoose.model('Usuario', usuarioSchema);