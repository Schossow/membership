const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const Admin = require('../models/Admin')

const validarCampos = (req, res, next) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    return res.status(400).json(errors)
  }
  next()
}

const generarJWT = (uid = '') => {
  return new Promise((resolve, reject) => {
    const payload = {uid}
    jwt.sign(payload, process.env.KEY, {
      expiresIn: '4h'
    }, (err, token) => {
      if(err){
        console.log(err)
        reject('No se pudo crear el token')
      }else{
        resolve(token)
      }
    })
  })
}

const validarJWT = async(req, res, next) => {
  const token = req.header('token')
  if(!token){
    return res.status(401).json({
      msg: 'No hay token en la petición'
    })
  }

  try{
    const {uid} = jwt.verify(token, process.env.KEY)

    const admin = await Admin.findById(uid)

    if(!admin){
      return res.status(401).json({
        msg: 'Usuario no se encuentra registrado'
      })
    }

    req.admin = admin

    next()
  }catch(err){
    return res.status(401).json({
      msg: 'Token no valido',
      err,
    })
  }
  
}

module.exports = {
  validarCampos,
  generarJWT,
  validarJWT,
}