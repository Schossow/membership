const {Schema, model} = require('mongoose')

const AdminSchema = Schema({
  username: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatorio'],
  },
})

AdminSchema.methods.toJSON = function(){
  const {__v, password, ...admin} = this.toObject()
  return admin
}

module.exports = model('Admin', AdminSchema)