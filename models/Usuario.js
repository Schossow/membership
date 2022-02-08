const {Schema, model} = require('mongoose')

const UsuarioSchema = Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
  },
  lastName: {
    type: String,
    required: [true, 'El apellido es obligatorio'],
  },
  ID: {
    type: String,
    required: [true, 'La identificación es obligatorio'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'El correo es obligatorio'],
    unique: true,
  },
  state: {
    type: Boolean,
    default: true,
  },
})

UsuarioSchema.methods.toJSON = function(){
  const {__v, ...usuario} = this.toObject()
  return usuario
}

module.exports = model('Usuario', UsuarioSchema)